"use client"

import { useComposedRefs } from "@/lib/compose-refs"
import { cn } from "@/lib/utils"
import type { Modifier } from "@dnd-kit/core"
import {
  type Announcements,
  closestCenter,
  closestCorners,
  CollisionDetection,
  defaultDropAnimationSideEffects,
  DndContext,
  type DndContextProps,
  type DragEndEvent,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
  DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  type DropAnimation,
  getFirstCollision,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  pointerWithin,
  rectIntersection,
  type ScreenReaderInstructions,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers"
import {
  arrayMove,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  SortableContext,
  type SortableContextProps,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Slot } from "@radix-ui/react-slot"
import * as React from "react"
import * as ReactDOM from "react-dom"

// ============================================================
// Types
// ============================================================

export interface SortableGroupItem {
  id: UniqueIdentifier
  [key: string]: unknown
}

export interface SortableGroupData<
  T extends SortableGroupItem = SortableGroupItem,
> {
  id: UniqueIdentifier
  items: T[]
  [key: string]: unknown
}

// ============================================================
// Config
// ============================================================

const orientationConfig = {
  vertical: {
    modifiers: [restrictToVerticalAxis, restrictToParentElement],
    strategy: verticalListSortingStrategy,
    collisionDetection: closestCenter,
  },
  horizontal: {
    modifiers: [restrictToHorizontalAxis, restrictToParentElement],
    strategy: horizontalListSortingStrategy,
    collisionDetection: closestCenter,
  },
  mixed: {
    modifiers: [restrictToParentElement],
    strategy: rectSortingStrategy,
    collisionDetection: closestCorners,
  },
}

const ROOT_NAME = "Sortable"
const CONTENT_NAME = "SortableContent"
const ITEM_NAME = "SortableItem"
const ITEM_HANDLE_NAME = "SortableItemHandle"
const OVERLAY_NAME = "SortableOverlay"
const GROUP_NAME = "SortableGroup"
const GROUP_HANDLE_NAME = "SortableGroupHandle"

// ============================================================
// Root Context (shared between single & multi mode)
// ============================================================

interface SortableRootContextValue<T> {
  id: string
  items: UniqueIdentifier[]
  modifiers: DndContextProps["modifiers"]
  strategy: SortableContextProps["strategy"]
  activeId: UniqueIdentifier | null
  setActiveId: (id: UniqueIdentifier | null) => void
  getItemValue: (item: T) => UniqueIdentifier
  flatCursor: boolean
  // Multi-container mode extras
  mode: "single" | "multi"
  activeType: "group" | "item" | null
  groups: SortableGroupData[] | null
  findGroup: (id: UniqueIdentifier) => SortableGroupData | null
  isGroup: (id: UniqueIdentifier) => boolean
  getGroupOfItem: (itemId: UniqueIdentifier) => UniqueIdentifier | null
  groupsRef: React.MutableRefObject<HTMLElement | null>
}

const SortableRootContext =
  React.createContext<SortableRootContextValue<unknown> | null>(null)

function useSortableContext(consumerName: string) {
  const context = React.useContext(SortableRootContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``)
  }
  return context
}

// ============================================================
// SortableRoot - Unified component for single & multi mode
// ============================================================

interface GetItemValue<T> {
  getItemValue: (item: T) => UniqueIdentifier
}

// Single container mode props
type SingleModeProps<T> = DndContextProps &
  (T extends object ? GetItemValue<T> : Partial<GetItemValue<T>>) & {
    value: T[]
    onValueChange?: (items: T[]) => void
    onMove?: (
      event: DragEndEvent & { activeIndex: number; overIndex: number }
    ) => void
    strategy?: SortableContextProps["strategy"]
    orientation?: "vertical" | "horizontal" | "mixed"
    flatCursor?: boolean
  }

// Multi container mode props (also uses value/onValueChange)
interface MultiModeProps<
  TGroup extends SortableGroupData<TItem>,
  TItem extends SortableGroupItem,
> extends Omit<DndContextProps, "onDragStart" | "onDragEnd" | "onDragOver"> {
  value: TGroup[]
  onValueChange: (groups: TGroup[]) => void
  flatCursor?: boolean
  restrictToParent?: boolean
  orientation?: "vertical" | "horizontal" | "mixed"
  children: React.ReactNode
}

// Helper to check if value is groups (has items array)
function isGroupData(value: unknown[]): value is SortableGroupData[] {
  return (
    value.length > 0 &&
    typeof value[0] === "object" &&
    value[0] !== null &&
    "items" in value[0] &&
    Array.isArray((value[0] as SortableGroupData).items)
  )
}

// Unified props - both modes use value/onValueChange
type SortableRootProps<
  T,
  TGroup extends SortableGroupData<TItem>,
  TItem extends SortableGroupItem,
> = SingleModeProps<T> | MultiModeProps<TGroup, TItem>

function SortableRoot<
  T,
  TGroup extends SortableGroupData<TItem>,
  TItem extends SortableGroupItem,
>(props: SortableRootProps<T, TGroup, TItem>) {
  // Detect mode based on data structure (groups have items property)
  const isMultiMode = isGroupData(props.value as unknown[])

  if (isMultiMode) {
    return (
      <SortableRootMulti
        {...(props as unknown as MultiModeProps<TGroup, TItem>)}
      />
    )
  }
  return <SortableRootSingle {...(props as unknown as SingleModeProps<T>)} />
}

// ============================================================
// SortableRoot - Single Container Mode
// ============================================================

function SortableRootSingle<T>(props: SingleModeProps<T>) {
  const {
    value,
    onValueChange,
    collisionDetection,
    modifiers,
    strategy,
    onMove,
    orientation = "vertical",
    flatCursor = false,
    getItemValue: getItemValueProp,
    accessibility,
    onDragStart: onDragStartProp,
    onDragEnd: onDragEndProp,
    onDragCancel: onDragCancelProp,
    ...sortableProps
  } = props

  const id = React.useId()
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null)
  const groupsRef = React.useRef<HTMLElement | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  const config = React.useMemo(
    () => orientationConfig[orientation],
    [orientation]
  )

  const getItemValue = React.useCallback(
    (item: T): UniqueIdentifier => {
      if (typeof item === "object" && !getItemValueProp) {
        throw new Error("getItemValue is required when using array of objects")
      }
      return getItemValueProp
        ? getItemValueProp(item)
        : (item as UniqueIdentifier)
    },
    [getItemValueProp]
  )

  const items = React.useMemo(() => {
    return value.map((item) => getItemValue(item))
  }, [value, getItemValue])

  const onDragStart = React.useCallback(
    (event: DragStartEvent) => {
      onDragStartProp?.(event)
      if (event.activatorEvent.defaultPrevented) return
      setActiveId(event.active.id)
    },
    [onDragStartProp]
  )

  const onDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      onDragEndProp?.(event)
      if (event.activatorEvent.defaultPrevented) return

      const { active, over } = event
      if (over && active.id !== over?.id) {
        const activeIndex = value.findIndex(
          (item) => getItemValue(item) === active.id
        )
        const overIndex = value.findIndex(
          (item) => getItemValue(item) === over.id
        )

        if (onMove) {
          onMove({ ...event, activeIndex, overIndex })
        } else {
          onValueChange?.(arrayMove(value, activeIndex, overIndex))
        }
      }
      setActiveId(null)
    },
    [value, onValueChange, onMove, getItemValue, onDragEndProp]
  )

  const onDragCancel = React.useCallback(
    (event: DragEndEvent) => {
      onDragCancelProp?.(event)
      if (event.activatorEvent.defaultPrevented) return
      setActiveId(null)
    },
    [onDragCancelProp]
  )

  const announcements: Announcements = React.useMemo(
    () => ({
      onDragStart({ active }) {
        const activeValue = active.id.toString()
        return `Grabbed sortable item "${activeValue}". Current position is ${active.data.current?.sortable.index + 1} of ${value.length}. Use arrow keys to move, space to drop.`
      },
      onDragOver({ active, over }) {
        if (over) {
          const overIndex = over.data.current?.sortable.index ?? 0
          const activeIndex = active.data.current?.sortable.index ?? 0
          const moveDirection = overIndex > activeIndex ? "down" : "up"
          const activeValue = active.id.toString()
          return `Sortable item "${activeValue}" moved ${moveDirection} to position ${overIndex + 1} of ${value.length}.`
        }
        return "Sortable item is no longer over a droppable area. Press escape to cancel."
      },
      onDragEnd({ active, over }) {
        const activeValue = active.id.toString()
        if (over) {
          const overIndex = over.data.current?.sortable.index ?? 0
          return `Sortable item "${activeValue}" dropped at position ${overIndex + 1} of ${value.length}.`
        }
        return `Sortable item "${activeValue}" dropped. No changes were made.`
      },
      onDragCancel({ active }) {
        const activeIndex = active.data.current?.sortable.index ?? 0
        const activeValue = active.id.toString()
        return `Sorting cancelled. Sortable item "${activeValue}" returned to position ${activeIndex + 1} of ${value.length}.`
      },
    }),
    [value]
  )

  const screenReaderInstructions: ScreenReaderInstructions = React.useMemo(
    () => ({
      draggable: `
        To pick up a sortable item, press space or enter.
        While dragging, use the ${orientation === "vertical" ? "up and down" : orientation === "horizontal" ? "left and right" : "arrow"} keys to move the item.
        Press space or enter again to drop the item in its new position, or press escape to cancel.
      `,
    }),
    [orientation]
  )

  const contextValue = React.useMemo<SortableRootContextValue<T>>(
    () => ({
      id,
      items,
      modifiers: modifiers ?? config.modifiers,
      strategy: strategy ?? config.strategy,
      activeId,
      setActiveId,
      getItemValue,
      flatCursor,
      // Multi-mode fields (not used in single mode)
      mode: "single",
      activeType: null,
      groups: null,
      findGroup: () => null,
      isGroup: () => false,
      getGroupOfItem: () => null,
      groupsRef,
    }),
    [
      id,
      items,
      modifiers,
      strategy,
      config.modifiers,
      config.strategy,
      activeId,
      getItemValue,
      flatCursor,
    ]
  )

  return (
    <SortableRootContext.Provider
      value={contextValue as SortableRootContextValue<unknown>}
    >
      <DndContext
        collisionDetection={collisionDetection ?? config.collisionDetection}
        modifiers={modifiers ?? config.modifiers}
        sensors={sensors}
        {...sortableProps}
        id={id}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
        accessibility={{
          announcements,
          screenReaderInstructions,
          ...accessibility,
        }}
      />
    </SortableRootContext.Provider>
  )
}

// ============================================================
// SortableRoot - Multi Container Mode
// ============================================================

function SortableRootMulti<
  TGroup extends SortableGroupData<TItem>,
  TItem extends SortableGroupItem,
>(props: MultiModeProps<TGroup, TItem>) {
  const {
    value: groups,
    onValueChange: onGroupsChange,
    flatCursor = false,
    restrictToParent = true,
    orientation = "mixed",
    modifiers: modifiersProp,
    children,
    ...dndProps
  } = props

  const id = React.useId()
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null)
  const [activeType, setActiveType] = React.useState<"group" | "item" | null>(
    null
  )
  const lastOverId = React.useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = React.useRef(false)
  const groupsRef = React.useRef<HTMLElement | null>(null)

  const config = React.useMemo(
    () => orientationConfig[orientation],
    [orientation]
  )

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Custom constraint modifier
  const restrictToMainGrid: Modifier = React.useCallback(
    ({ draggingNodeRect, transform }) => {
      if (!restrictToParent || !groupsRef.current || !draggingNodeRect) {
        return transform
      }

      const containerRect = groupsRef.current.getBoundingClientRect()
      const value = { ...transform }

      if (draggingNodeRect.top + value.y <= containerRect.top) {
        value.y = containerRect.top - draggingNodeRect.top
      } else if (
        draggingNodeRect.bottom + value.y >=
        containerRect.top + containerRect.height
      ) {
        value.y =
          containerRect.top + containerRect.height - draggingNodeRect.bottom
      }

      if (draggingNodeRect.left + value.x <= containerRect.left) {
        value.x = containerRect.left - draggingNodeRect.left
      } else if (
        draggingNodeRect.right + value.x >=
        containerRect.left + containerRect.width
      ) {
        value.x =
          containerRect.left + containerRect.width - draggingNodeRect.right
      }

      return value
    },
    [restrictToParent]
  )

  const findGroup = React.useCallback(
    (groupId: UniqueIdentifier): TGroup | null => {
      return groups.find((g) => g.id === groupId) || null
    },
    [groups]
  )

  const isGroup = React.useCallback(
    (groupId: UniqueIdentifier): boolean => {
      return groups.some((g) => g.id === groupId)
    },
    [groups]
  )

  const getGroupOfItem = React.useCallback(
    (itemId: UniqueIdentifier): UniqueIdentifier | null => {
      if (isGroup(itemId)) return itemId
      for (const group of groups) {
        if (group.items.some((item) => item.id === itemId)) {
          return group.id
        }
      }
      return null
    },
    [groups, isGroup]
  )

  // Collision detection for multi-container
  const collisionDetection: CollisionDetection = React.useCallback(
    (args) => {
      if (activeType === "group") {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) =>
            isGroup(container.id)
          ),
        })
      }

      const pointerIntersections = pointerWithin(args)
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args)

      let overId = getFirstCollision(intersections, "id")

      if (overId != null) {
        const overGroup = findGroup(overId)
        if (overGroup && overGroup.items.length > 0) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) =>
                container.id !== overId &&
                overGroup.items.some((item) => item.id === container.id)
            ),
          })[0]?.id
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeId, activeType, findGroup, isGroup]
  )

  const handleDragStart = React.useCallback(
    (event: DragStartEvent) => {
      const { active } = event
      setActiveId(active.id)
      setActiveType(isGroup(active.id) ? "group" : "item")
    },
    [isGroup]
  )

  const handleDragOver = React.useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      const overId = over?.id

      if (overId == null || active.id === overId) return
      if (activeType === "group") return

      const overGroupId = getGroupOfItem(overId)
      const activeGroupId = getGroupOfItem(active.id)

      if (!overGroupId || !activeGroupId) return

      if (activeGroupId !== overGroupId) {
        onGroupsChange(
          groups.map((group) => {
            if (group.id === activeGroupId) {
              return {
                ...group,
                items: group.items.filter((item) => item.id !== active.id),
              }
            }
            if (group.id === overGroupId) {
              const overIndex = group.items.findIndex(
                (item) => item.id === overId
              )
              const activeItem = groups
                .find((g) => g.id === activeGroupId)
                ?.items.find((item) => item.id === active.id)

              if (!activeItem) return group

              const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top >
                  over.rect.top + over.rect.height

              const modifier = isBelowOverItem ? 1 : 0
              const newIndex =
                overId === overGroupId
                  ? group.items.length
                  : overIndex >= 0
                    ? overIndex + modifier
                    : group.items.length

              return {
                ...group,
                items: [
                  ...group.items.slice(0, newIndex),
                  activeItem,
                  ...group.items.slice(newIndex),
                ],
              }
            }
            return group
          }) as TGroup[]
        )
        recentlyMovedToNewContainer.current = true
      }
    },
    [activeType, groups, getGroupOfItem, onGroupsChange]
  )

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (activeType === "group") {
        if (over && active.id !== over.id && isGroup(over.id)) {
          const oldIndex = groups.findIndex((g) => g.id === active.id)
          const newIndex = groups.findIndex((g) => g.id === over.id)
          onGroupsChange(arrayMove(groups, oldIndex, newIndex) as TGroup[])
        }
        setActiveId(null)
        setActiveType(null)
        return
      }

      if (over) {
        const activeGroupId = getGroupOfItem(active.id)
        const overGroupId = getGroupOfItem(over.id)

        if (activeGroupId && overGroupId && activeGroupId === overGroupId) {
          const group = findGroup(activeGroupId)
          if (group) {
            const activeIndex = group.items.findIndex(
              (item) => item.id === active.id
            )
            const overIndex = group.items.findIndex(
              (item) => item.id === over.id
            )

            if (activeIndex !== overIndex) {
              onGroupsChange(
                groups.map((g) => {
                  if (g.id === activeGroupId) {
                    return {
                      ...g,
                      items: arrayMove(g.items, activeIndex, overIndex),
                    }
                  }
                  return g
                }) as TGroup[]
              )
            }
          }
        }
      }

      setActiveId(null)
      setActiveType(null)
    },
    [activeType, groups, findGroup, getGroupOfItem, isGroup, onGroupsChange]
  )

  const handleDragCancel = React.useCallback(() => {
    setActiveId(null)
    setActiveType(null)
  }, [])

  React.useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false
    })
  }, [groups])

  const contextValue = React.useMemo<SortableRootContextValue<TItem>>(
    () => ({
      id,
      items: groups.flatMap((g) => g.items.map((item) => item.id)),
      modifiers: modifiersProp ?? [restrictToMainGrid],
      strategy: config.strategy,
      activeId,
      setActiveId,
      getItemValue: (item: TItem) => item.id,
      flatCursor,
      // Multi-mode fields
      mode: "multi",
      activeType,
      groups: groups as SortableGroupData[],
      findGroup: findGroup as (
        id: UniqueIdentifier
      ) => SortableGroupData | null,
      isGroup,
      getGroupOfItem,
      groupsRef,
    }),
    [
      id,
      groups,
      modifiersProp,
      restrictToMainGrid,
      config.strategy,
      activeId,
      flatCursor,
      activeType,
      findGroup,
      isGroup,
      getGroupOfItem,
    ]
  )

  return (
    <SortableRootContext.Provider
      value={contextValue as SortableRootContextValue<unknown>}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        measuring={{
          droppable: { strategy: MeasuringStrategy.Always },
        }}
        modifiers={modifiersProp ?? [restrictToMainGrid]}
        {...dndProps}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {children}
      </DndContext>
    </SortableRootContext.Provider>
  )
}

// ============================================================
// SortableContent - Works for both single & multi mode
// ============================================================

const SortableContentContext = React.createContext<boolean>(false)

interface SortableContentProps extends React.ComponentProps<"div"> {
  /** Items to sort (required in multi mode when inside SortableGroup) */
  items?: UniqueIdentifier[]
  strategy?: SortableContextProps["strategy"]
  children: React.ReactNode
  asChild?: boolean
  withoutSlot?: boolean
}

function SortableContent(props: SortableContentProps) {
  const {
    items: itemsProp,
    strategy: strategyProp,
    asChild,
    withoutSlot,
    children,
    ref,
    ...contentProps
  } = props

  const context = useSortableContext(CONTENT_NAME)
  const groupContext = React.useContext(SortableGroupContext)

  // In multi mode inside a group, use group's items
  const items = itemsProp ?? groupContext?.items ?? context.items

  const ContentPrimitive = asChild ? Slot : "div"

  return (
    <SortableContentContext.Provider value={true}>
      <SortableContext
        items={items}
        strategy={strategyProp ?? context.strategy}
      >
        {withoutSlot ? (
          children
        ) : (
          <ContentPrimitive
            data-slot="sortable-content"
            {...contentProps}
            ref={ref}
          >
            {children}
          </ContentPrimitive>
        )}
      </SortableContext>
    </SortableContentContext.Provider>
  )
}

// ============================================================
// SortableItem - Works for both single & multi mode
// ============================================================

interface SortableItemContextValue {
  id: string
  attributes: DraggableAttributes
  listeners: DraggableSyntheticListeners | undefined
  setActivatorNodeRef: (node: HTMLElement | null) => void
  isDragging?: boolean
  disabled?: boolean
}

const SortableItemContext =
  React.createContext<SortableItemContextValue | null>(null)

function useSortableItemContext(consumerName: string) {
  const context = React.useContext(SortableItemContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ITEM_NAME}\``)
  }
  return context
}

interface SortableItemProps extends React.ComponentProps<"div"> {
  value: UniqueIdentifier
  asHandle?: boolean
  asChild?: boolean
  disabled?: boolean
}

function SortableItem(props: SortableItemProps) {
  const {
    value,
    style,
    asHandle,
    asChild,
    disabled,
    className,
    ref,
    ...itemProps
  } = props

  const inSortableContent = React.useContext(SortableContentContext)
  const inSortableOverlay = React.useContext(SortableOverlayContext)

  if (!inSortableContent && !inSortableOverlay) {
    throw new Error(
      `\`${ITEM_NAME}\` must be used within \`${CONTENT_NAME}\` or \`${OVERLAY_NAME}\``
    )
  }

  if (value === "") {
    throw new Error(`\`${ITEM_NAME}\` value cannot be an empty string`)
  }

  const context = useSortableContext(ITEM_NAME)
  const id = React.useId()
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: value, disabled })

  const composedRef = useComposedRefs(ref, (node) => {
    if (disabled) return
    setNodeRef(node)
    if (asHandle) setActivatorNodeRef(node)
  })

  const composedStyle = React.useMemo<React.CSSProperties>(() => {
    return {
      transform: CSS.Translate.toString(transform),
      transition,
      ...style,
      zIndex: isDragging ? 50 : undefined,
    }
  }, [transform, transition, style, isDragging])

  const itemContext = React.useMemo<SortableItemContextValue>(
    () => ({
      id,
      attributes,
      listeners,
      setActivatorNodeRef,
      isDragging,
      disabled,
    }),
    [id, attributes, listeners, setActivatorNodeRef, isDragging, disabled]
  )

  const ItemPrimitive = asChild ? Slot : "div"

  return (
    <SortableItemContext.Provider value={itemContext}>
      <ItemPrimitive
        id={id}
        data-disabled={disabled}
        data-dragging={isDragging ? "" : undefined}
        data-slot="sortable-item"
        {...itemProps}
        {...(asHandle && !disabled ? attributes : {})}
        {...(asHandle && !disabled ? listeners : {})}
        ref={composedRef}
        style={composedStyle}
        className={cn(
          "focus-visible:ring-ring focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden",
          {
            "touch-none select-none": asHandle,
            "cursor-default": context.flatCursor,
            "data-dragging:cursor-grabbing": !context.flatCursor,
            "cursor-grab": !isDragging && asHandle && !context.flatCursor,
            "opacity-50": isDragging,
            "pointer-events-none opacity-50": disabled,
          },
          className
        )}
      />
    </SortableItemContext.Provider>
  )
}

// ============================================================
// SortableItemHandle
// ============================================================

interface SortableItemHandleProps extends React.ComponentProps<"button"> {
  asChild?: boolean
}

function SortableItemHandle(props: SortableItemHandleProps) {
  const { asChild, disabled, className, ref, ...itemHandleProps } = props

  const context = useSortableContext(ITEM_HANDLE_NAME)
  const itemContext = useSortableItemContext(ITEM_HANDLE_NAME)

  const isDisabled = disabled ?? itemContext.disabled

  const composedRef = useComposedRefs(ref, (node) => {
    if (!isDisabled) return
    itemContext.setActivatorNodeRef(node)
  })

  const HandlePrimitive = asChild ? Slot : "button"

  return (
    <HandlePrimitive
      type="button"
      aria-controls={itemContext.id}
      data-disabled={isDisabled}
      data-dragging={itemContext.isDragging ? "" : undefined}
      data-slot="sortable-item-handle"
      {...itemHandleProps}
      {...(isDisabled ? {} : itemContext.attributes)}
      {...(isDisabled ? {} : itemContext.listeners)}
      ref={composedRef}
      className={cn(
        "select-none disabled:pointer-events-none disabled:opacity-50",
        context.flatCursor
          ? "cursor-default"
          : "cursor-grab data-dragging:cursor-grabbing",
        className
      )}
      disabled={isDisabled}
    />
  )
}

// ============================================================
// SortableGroup - Multi container wrapper (only for multi mode)
// ============================================================

interface SortableGroupContextValue {
  groupId: UniqueIdentifier
  items: UniqueIdentifier[]
  attributes: DraggableAttributes
  listeners: DraggableSyntheticListeners
}

const SortableGroupContext =
  React.createContext<SortableGroupContextValue | null>(null)

interface SortableGroupProps extends React.ComponentProps<"div"> {
  value: UniqueIdentifier
  asChild?: boolean
}

function SortableGroup(props: SortableGroupProps) {
  const {
    value: groupId,
    asChild,
    children,
    className,
    style,
    ref,
    ...rest
  } = props

  const context = useSortableContext(GROUP_NAME)

  if (context.mode !== "multi") {
    throw new Error(
      `\`${GROUP_NAME}\` can only be used in multi mode (when value contains items with 'items' property)`
    )
  }

  const group = context.findGroup(groupId)
  const items = React.useMemo(
    () => group?.items.map((item) => item.id) ?? [],
    [group?.items]
  )

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: groupId,
    data: { type: "group" },
  })

  const combinedStyle = React.useMemo<React.CSSProperties>(
    () => ({
      transform: CSS.Translate.toString(transform),
      transition,
      ...style,
      zIndex: isDragging ? 50 : undefined,
    }),
    [transform, transition, style, isDragging]
  )

  const composedRef = useComposedRefs(ref, setNodeRef)
  const GroupPrimitive = asChild ? Slot : "div"

  const groupContext = React.useMemo<SortableGroupContextValue>(
    () => ({ groupId, items, attributes, listeners }),
    [groupId, items, attributes, listeners]
  )

  return (
    <SortableGroupContext.Provider value={groupContext}>
      <GroupPrimitive
        ref={composedRef}
        data-slot="sortable-group"
        data-dragging={isDragging ? "" : undefined}
        data-over={isOver && context.activeType === "item" ? "" : undefined}
        style={combinedStyle}
        className={cn(
          "focus-visible:ring-ring focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden",
          {
            "cursor-default": context.flatCursor,
            "opacity-100": isDragging,
          },
          className
        )}
        {...rest}
      >
        {children}
      </GroupPrimitive>
    </SortableGroupContext.Provider>
  )
}

// ============================================================
// SortableGroupHandle - Handle for dragging groups
// ============================================================

interface SortableGroupHandleProps extends React.ComponentProps<"button"> {
  asChild?: boolean
}

function SortableGroupHandle(props: SortableGroupHandleProps) {
  const { asChild, className, ref, ...rest } = props
  const groupContext = React.useContext(SortableGroupContext)
  const context = useSortableContext(GROUP_HANDLE_NAME)

  if (!groupContext) {
    throw new Error(
      `\`${GROUP_HANDLE_NAME}\` must be used within \`${GROUP_NAME}\``
    )
  }

  const HandlePrimitive = asChild ? Slot : "button"

  return (
    <HandlePrimitive
      type="button"
      data-slot="sortable-group-handle"
      {...groupContext.attributes}
      {...groupContext.listeners}
      ref={ref}
      className={cn(
        "touch-none select-none",
        context.flatCursor
          ? "cursor-default"
          : "cursor-grab active:cursor-grabbing",
        className
      )}
      {...rest}
    />
  )
}

// ============================================================
// SortableGroupContent - Wrapper for groups grid (multi mode)
// ============================================================

interface SortableGroupContentProps extends React.ComponentProps<"div"> {
  strategy?: SortableContextProps["strategy"]
  asChild?: boolean
}

function SortableGroupContent(props: SortableGroupContentProps) {
  const {
    strategy = rectSortingStrategy,
    asChild,
    children,
    ref,
    ...rest
  } = props

  const context = useSortableContext("SortableGroupContent")

  if (context.mode !== "multi" || !context.groups) {
    throw new Error("`SortableGroupContent` can only be used in multi mode")
  }

  const composedRef = useComposedRefs(ref, context.groupsRef)
  const ContentPrimitive = asChild ? Slot : "div"

  return (
    <SortableContext
      items={context.groups.map((g) => g.id)}
      strategy={strategy}
    >
      <ContentPrimitive
        ref={composedRef}
        data-slot="sortable-group-content"
        {...rest}
      >
        {children}
      </ContentPrimitive>
    </SortableContext>
  )
}

// ============================================================
// SortableOverlay - Works for both modes
// ============================================================

const SortableOverlayContext = React.createContext(false)

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
}

interface SortableOverlayProps extends Omit<
  React.ComponentProps<typeof DragOverlay>,
  "children"
> {
  container?: Element | DocumentFragment | null
  children?:
    | ((params: {
        value: UniqueIdentifier
        type?: "group" | "item" | null
      }) => React.ReactNode)
    | React.ReactNode
}

function SortableOverlay(props: SortableOverlayProps) {
  const { container: containerProp, children, ...overlayProps } = props

  const context = useSortableContext(OVERLAY_NAME)

  const [mounted, setMounted] = React.useState(false)
  React.useLayoutEffect(() => setMounted(true), [])

  const container =
    containerProp ?? (mounted ? globalThis.document?.body : null)

  if (!container) return null

  return ReactDOM.createPortal(
    <DragOverlay
      dropAnimation={dropAnimation}
      modifiers={context.modifiers}
      className={cn(!context.flatCursor && "cursor-grabbing")}
      {...overlayProps}
    >
      <SortableOverlayContext.Provider value={true}>
        {context.activeId
          ? typeof children === "function"
            ? children({ value: context.activeId, type: context.activeType })
            : children
          : null}
      </SortableOverlayContext.Provider>
    </DragOverlay>,
    container
  )
}

// ============================================================
// Exports
// ============================================================

// Rename SortableRoot to Sortable for export
const Sortable = SortableRoot

export {
  Sortable,
  SortableContent,
  SortableGroup,
  SortableGroupContent,
  SortableGroupHandle,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
  useSortableContext,
}
