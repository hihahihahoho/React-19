"use client"

import { useComposedRefs } from "@/lib/compose-refs"
import { cn } from "@/lib/utils"
import type { Modifier } from "@dnd-kit/core"
import {
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
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
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

export interface NestedItem {
  id: UniqueIdentifier
  [key: string]: unknown
}

export interface NestedContainer<T extends NestedItem = NestedItem> {
  id: UniqueIdentifier
  items: T[]
  [key: string]: unknown
}

// ============================================================
// Context
// ============================================================

interface SortableNestedContextValue<
  TContainer extends NestedContainer<TItem>,
  TItem extends NestedItem,
> {
  containers: TContainer[]
  activeId: UniqueIdentifier | null
  activeType: "container" | "item" | null
  activeContainer: TContainer | null
  activeItem: TItem | null
  flatCursor: boolean
  findContainer: (id: UniqueIdentifier) => TContainer | null
  findItem: (id: UniqueIdentifier) => TItem | null
  isContainer: (id: UniqueIdentifier) => boolean
  getContainerOfItem: (itemId: UniqueIdentifier) => UniqueIdentifier | null
  containersRef: React.MutableRefObject<HTMLElement | null>
}

const SortableNestedContext = React.createContext<SortableNestedContextValue<
  NestedContainer,
  NestedItem
> | null>(null)

function useSortableNestedContext() {
  const context = React.useContext(SortableNestedContext)
  if (!context) {
    throw new Error(
      "`useSortableNestedContext` must be used within `SortableNestedRoot`"
    )
  }
  return context
}

// ============================================================
// Root Component
// ============================================================

interface SortableNestedRootProps<
  TContainer extends NestedContainer<TItem>,
  TItem extends NestedItem,
> extends Omit<DndContextProps, "onDragStart" | "onDragEnd" | "onDragOver"> {
  containers: TContainer[]
  onContainersChange: (containers: TContainer[]) => void
  flatCursor?: boolean
  /** Whether to restrict dragging to parent boundary. Default: true (allows cross-container drag within grid) */
  restrictToParent?: boolean
  children: React.ReactNode
}

function SortableNestedRoot<
  TContainer extends NestedContainer<TItem>,
  TItem extends NestedItem,
>(props: SortableNestedRootProps<TContainer, TItem>) {
  const {
    containers,
    onContainersChange,
    flatCursor = false,
    restrictToParent = true,
    modifiers: modifiersProp,
    children,
    ...dndProps
  } = props

  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null)
  const [activeType, setActiveType] = React.useState<
    "container" | "item" | null
  >(null)
  const lastOverId = React.useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = React.useRef(false)

  // Sensors
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

  const containersRef = React.useRef<HTMLElement | null>(null)

  // Custom constraint modifier: Restricts drag to the main grid area (containersRef)
  const restrictToMainGrid: Modifier = React.useCallback(
    ({ draggingNodeRect, transform }) => {
      if (!restrictToParent || !containersRef.current || !draggingNodeRect) {
        return transform
      }

      const containerRect = containersRef.current.getBoundingClientRect()
      const value = {
        ...transform,
      }

      // Restrict vertical
      if (draggingNodeRect.top + value.y <= containerRect.top) {
        value.y = containerRect.top - draggingNodeRect.top
      } else if (
        draggingNodeRect.bottom + value.y >=
        containerRect.top + containerRect.height
      ) {
        value.y =
          containerRect.top + containerRect.height - draggingNodeRect.bottom
      }

      // Restrict horizontal
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

  // Find container by id
  const findContainer = React.useCallback(
    (id: UniqueIdentifier): TContainer | null => {
      return containers.find((c) => c.id === id) || null
    },
    [containers]
  )

  // Find item across all containers
  const findItem = React.useCallback(
    (id: UniqueIdentifier): TItem | null => {
      for (const container of containers) {
        const item = container.items.find((item) => item.id === id) as
          | TItem
          | undefined
        if (item) return item
      }
      return null
    },
    [containers]
  )

  // Check if id is a container
  const isContainer = React.useCallback(
    (id: UniqueIdentifier): boolean => {
      return containers.some((c) => c.id === id)
    },
    [containers]
  )

  // Get container id that contains the item
  const getContainerOfItem = React.useCallback(
    (itemId: UniqueIdentifier): UniqueIdentifier | null => {
      // Check if it's a container first
      if (isContainer(itemId)) return itemId

      for (const container of containers) {
        if (container.items.some((item) => item.id === itemId)) {
          return container.id
        }
      }
      return null
    },
    [containers, isContainer]
  )

  // Active elements
  const activeContainer = React.useMemo(
    () =>
      activeId && activeType === "container" ? findContainer(activeId) : null,
    [activeId, activeType, findContainer]
  )
  const activeItem = React.useMemo(
    () => (activeId && activeType === "item" ? findItem(activeId) : null),
    [activeId, activeType, findItem]
  )

  // Collision detection
  const collisionDetection: CollisionDetection = React.useCallback(
    (args) => {
      // If dragging a container, only collide with other containers
      if (activeType === "container") {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) =>
            isContainer(container.id)
          ),
        })
      }

      // For items, use nested collision detection
      const pointerIntersections = pointerWithin(args)
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args)

      let overId = getFirstCollision(intersections, "id")

      if (overId != null) {
        // If over a container, find closest item within it
        const overContainer = findContainer(overId)
        if (overContainer && overContainer.items.length > 0) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) =>
                container.id !== overId &&
                overContainer.items.some((item) => item.id === container.id)
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
    [activeId, activeType, findContainer, isContainer]
  )

  // Drag handlers
  const handleDragStart = React.useCallback(
    (event: DragStartEvent) => {
      const { active } = event
      setActiveId(active.id)

      if (isContainer(active.id)) {
        setActiveType("container")
      } else {
        setActiveType("item")
      }
    },
    [isContainer]
  )

  const handleDragOver = React.useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      const overId = over?.id

      if (overId == null || active.id === overId) return

      // Don't handle container dragging here
      if (activeType === "container") return

      const overContainerId = getContainerOfItem(overId)
      const activeContainerId = getContainerOfItem(active.id)

      if (!overContainerId || !activeContainerId) return

      // Moving between containers
      if (activeContainerId !== overContainerId) {
        onContainersChange(
          containers.map((container) => {
            if (container.id === activeContainerId) {
              return {
                ...container,
                items: container.items.filter((item) => item.id !== active.id),
              }
            }
            if (container.id === overContainerId) {
              const overIndex = container.items.findIndex(
                (item) => item.id === overId
              )
              const activeItem = containers
                .find((c) => c.id === activeContainerId)
                ?.items.find((item) => item.id === active.id)

              if (!activeItem) return container

              const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top >
                  over.rect.top + over.rect.height

              const modifier = isBelowOverItem ? 1 : 0
              const newIndex =
                overId === overContainerId
                  ? container.items.length
                  : overIndex >= 0
                    ? overIndex + modifier
                    : container.items.length

              return {
                ...container,
                items: [
                  ...container.items.slice(0, newIndex),
                  activeItem,
                  ...container.items.slice(newIndex),
                ],
              }
            }
            return container
          }) as TContainer[]
        )
        recentlyMovedToNewContainer.current = true
      }
    },
    [activeType, containers, getContainerOfItem, onContainersChange]
  )

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      // Handle container reordering
      if (activeType === "container") {
        if (over && active.id !== over.id && isContainer(over.id)) {
          const oldIndex = containers.findIndex((c) => c.id === active.id)
          const newIndex = containers.findIndex((c) => c.id === over.id)
          onContainersChange(
            arrayMove(containers, oldIndex, newIndex) as TContainer[]
          )
        }
        setActiveId(null)
        setActiveType(null)
        return
      }

      // Handle item reordering within same container
      if (over) {
        const activeContainerId = getContainerOfItem(active.id)
        const overContainerId = getContainerOfItem(over.id)

        if (
          activeContainerId &&
          overContainerId &&
          activeContainerId === overContainerId
        ) {
          const container = findContainer(activeContainerId)
          if (container) {
            const activeIndex = container.items.findIndex(
              (item) => item.id === active.id
            )
            const overIndex = container.items.findIndex(
              (item) => item.id === over.id
            )

            if (activeIndex !== overIndex) {
              onContainersChange(
                containers.map((c) => {
                  if (c.id === activeContainerId) {
                    return {
                      ...c,
                      items: arrayMove(c.items, activeIndex, overIndex),
                    }
                  }
                  return c
                }) as TContainer[]
              )
            }
          }
        }
      }

      setActiveId(null)
      setActiveType(null)
    },
    [
      activeType,
      containers,
      findContainer,
      getContainerOfItem,
      isContainer,
      onContainersChange,
    ]
  )

  const handleDragCancel = React.useCallback(() => {
    setActiveId(null)
    setActiveType(null)
  }, [])

  // Reset recently moved flag
  React.useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false
    })
  }, [containers])

  // Context value
  const contextValue = React.useMemo(
    () => ({
      containers,
      activeId,
      activeType,
      activeContainer,
      activeItem,
      flatCursor,
      findContainer,
      findItem,
      isContainer,
      getContainerOfItem,
      containersRef,
    }),
    [
      containers,
      activeId,
      activeType,
      activeContainer,
      activeItem,
      flatCursor,
      findContainer,
      findItem,
      isContainer,
      getContainerOfItem,
    ]
  )

  return (
    <SortableNestedContext.Provider
      value={
        contextValue as SortableNestedContextValue<NestedContainer, NestedItem>
      }
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
    </SortableNestedContext.Provider>
  )
}

// ============================================================
// Containers Content (for sorting containers)
// ============================================================

interface SortableNestedContainersProps extends React.ComponentProps<"div"> {
  strategy?: SortableContextProps["strategy"]
  asChild?: boolean
}

function SortableNestedContainers(props: SortableNestedContainersProps) {
  const {
    strategy = rectSortingStrategy,
    asChild,
    children,
    ref,
    ...rest
  } = props
  const { containers, containersRef } = useSortableNestedContext()
  const composedRef = useComposedRefs(ref, containersRef)

  const ContainerPrimitive = asChild ? Slot : "div"

  return (
    <SortableContext items={containers.map((c) => c.id)} strategy={strategy}>
      <ContainerPrimitive
        ref={composedRef}
        data-slot="sortable-containers"
        {...rest}
      >
        {children}
      </ContainerPrimitive>
    </SortableContext>
  )
}

// ============================================================
// Container (draggable sortable container)
// ============================================================

interface SortableNestedContainerProps extends React.ComponentProps<"div"> {
  containerId: UniqueIdentifier
  asChild?: boolean
}

function SortableNestedContainer(props: SortableNestedContainerProps) {
  const { containerId, asChild, children, className, style, ref, ...rest } =
    props

  const { activeType, flatCursor } = useSortableNestedContext()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: containerId,
    data: { type: "container" },
  })

  // Use Translate not Transform to prevent distortion
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
  const ContainerPrimitive = asChild ? Slot : "div"

  return (
    <SortableNestedContainerContext.Provider
      value={{ containerId, attributes, listeners }}
    >
      <ContainerPrimitive
        ref={composedRef}
        data-slot="sortable-container"
        data-dragging={isDragging ? "" : undefined}
        data-over={isOver && activeType === "item" ? "" : undefined}
        style={combinedStyle}
        className={cn(
          "focus-visible:ring-ring focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden",
          {
            "cursor-default": flatCursor,
            // Keep fully visible since we don't use overlay in the requested setup
            "opacity-100": isDragging,
          },
          className
        )}
        {...rest}
      >
        {children}
      </ContainerPrimitive>
    </SortableNestedContainerContext.Provider>
  )
}

// Container context for handle
interface SortableNestedContainerContextValue {
  containerId: UniqueIdentifier
  attributes: DraggableAttributes
  listeners: DraggableSyntheticListeners
}

const SortableNestedContainerContext =
  React.createContext<SortableNestedContainerContextValue | null>(null)

// Container Handle
interface SortableNestedContainerHandleProps extends React.ComponentProps<"button"> {
  asChild?: boolean
}

function SortableNestedContainerHandle(
  props: SortableNestedContainerHandleProps
) {
  const { asChild, className, ref, ...rest } = props
  const context = React.useContext(SortableNestedContainerContext)
  const { flatCursor } = useSortableNestedContext()

  if (!context) {
    throw new Error(
      "`SortableNestedContainerHandle` must be used within `SortableNestedContainer`"
    )
  }

  const HandlePrimitive = asChild ? Slot : "button"

  return (
    <HandlePrimitive
      type="button"
      data-slot="sortable-container-handle"
      {...context.attributes}
      {...context.listeners}
      ref={ref}
      className={cn(
        "touch-none select-none",
        flatCursor ? "cursor-default" : "cursor-grab active:cursor-grabbing",
        className
      )}
      {...rest}
    />
  )
}

// ============================================================
// Items Content (for sorting items within container)
// ============================================================

interface SortableNestedItemsProps extends React.ComponentProps<"div"> {
  containerId: UniqueIdentifier
  items: NestedItem[]
  strategy?: SortableContextProps["strategy"]
  asChild?: boolean
}

function SortableNestedItems(props: SortableNestedItemsProps) {
  const {
    containerId,
    items,
    strategy = verticalListSortingStrategy,
    asChild,
    children,
    ref,
    ...rest
  } = props

  const ItemsPrimitive = asChild ? Slot : "div"

  return (
    <SortableContext
      id={containerId.toString()}
      items={items.map((item) => item.id)}
      strategy={strategy}
    >
      <ItemsPrimitive ref={ref} data-slot="sortable-items" {...rest}>
        {children}
      </ItemsPrimitive>
    </SortableContext>
  )
}

// ============================================================
// Item (sortable item within container)
// ============================================================

interface SortableNestedItemProps extends React.ComponentProps<"div"> {
  itemId: UniqueIdentifier
  asHandle?: boolean
  asChild?: boolean
  disabled?: boolean
}

function SortableNestedItem(props: SortableNestedItemProps) {
  const {
    itemId,
    asHandle,
    asChild,
    disabled,
    className,
    style,
    ref,
    ...rest
  } = props

  const { flatCursor } = useSortableNestedContext()

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: itemId, disabled })

  const composedRef = useComposedRefs(ref, (node) => {
    if (disabled) return
    setNodeRef(node)
    if (asHandle) setActivatorNodeRef(node)
  })

  // Use Translate for items too
  const combinedStyle = React.useMemo<React.CSSProperties>(
    () => ({
      transform: CSS.Translate.toString(transform),
      transition,
      ...style,
      zIndex: isDragging ? 50 : undefined,
    }),
    [transform, transition, style, isDragging]
  )

  const ItemPrimitive = asChild ? Slot : "div"

  return (
    <SortableNestedItemContext.Provider
      value={{ itemId, attributes, listeners, setActivatorNodeRef, isDragging }}
    >
      <ItemPrimitive
        ref={composedRef}
        data-slot="sortable-item"
        data-dragging={isDragging ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        style={combinedStyle}
        className={cn(
          "focus-visible:ring-ring focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden",
          {
            "touch-none select-none": asHandle,
            "cursor-default": flatCursor,
            "cursor-grab data-dragging:cursor-grabbing":
              asHandle && !flatCursor,
            // Keep opacity 100 for no-overlay mode
            "opacity-100": isDragging,
            "pointer-events-none opacity-50": disabled,
          },
          className
        )}
        {...(asHandle && !disabled ? attributes : {})}
        {...(asHandle && !disabled ? listeners : {})}
        {...rest}
      />
    </SortableNestedItemContext.Provider>
  )
}

// Item context for handle
interface SortableNestedItemContextValue {
  itemId: UniqueIdentifier
  attributes: DraggableAttributes
  listeners: DraggableSyntheticListeners | undefined
  setActivatorNodeRef: (node: HTMLElement | null) => void
  isDragging: boolean
}

const SortableNestedItemContext =
  React.createContext<SortableNestedItemContextValue | null>(null)

// Item Handle
interface SortableNestedItemHandleProps extends React.ComponentProps<"button"> {
  asChild?: boolean
}

function SortableNestedItemHandle(props: SortableNestedItemHandleProps) {
  const { asChild, className, ref, ...rest } = props
  const context = React.useContext(SortableNestedItemContext)
  const { flatCursor } = useSortableNestedContext()

  if (!context) {
    throw new Error(
      "`SortableNestedItemHandle` must be used within `SortableNestedItem`"
    )
  }

  const composedRef = useComposedRefs(ref, context.setActivatorNodeRef)

  const HandlePrimitive = asChild ? Slot : "button"

  return (
    <HandlePrimitive
      type="button"
      data-slot="sortable-item-handle"
      data-dragging={context.isDragging ? "" : undefined}
      {...context.attributes}
      {...context.listeners}
      ref={composedRef}
      className={cn(
        "touch-none select-none",
        flatCursor
          ? "cursor-default"
          : "cursor-grab data-dragging:cursor-grabbing",
        className
      )}
      {...rest}
    />
  )
}

// ============================================================
// Overlay
// ============================================================

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
}

interface SortableNestedOverlayProps extends Omit<
  React.ComponentProps<typeof DragOverlay>,
  "children"
> {
  container?: Element | DocumentFragment | null
  children?:
    | ((params: {
        activeId: UniqueIdentifier
        activeType: "container" | "item" | null
        activeContainer: NestedContainer | null
        activeItem: NestedItem | null
      }) => React.ReactNode)
    | React.ReactNode
}

function SortableNestedOverlay(props: SortableNestedOverlayProps) {
  const { container: containerProp, children, ...overlayProps } = props

  const { activeId, activeType, activeContainer, activeItem, flatCursor } =
    useSortableNestedContext()

  const [mounted, setMounted] = React.useState(false)
  React.useLayoutEffect(() => setMounted(true), [])

  const container =
    containerProp ?? (mounted ? globalThis.document?.body : null)

  if (!container) return null

  return ReactDOM.createPortal(
    <DragOverlay
      dropAnimation={dropAnimation}
      className={cn(!flatCursor && "cursor-grabbing")}
      {...overlayProps}
    >
      {activeId && activeType
        ? typeof children === "function"
          ? children({
              activeId,
              activeType,
              activeContainer,
              activeItem,
            })
          : children
        : null}
    </DragOverlay>,
    container
  )
}

// ============================================================
// Exports
// ============================================================

export {
  SortableNestedContainer as Container,
  SortableNestedContainerHandle as ContainerHandle,
  SortableNestedContainers as Containers,
  SortableNestedItem as Item,
  SortableNestedItemHandle as ItemHandle,
  SortableNestedItems as Items,
  SortableNestedOverlay as Overlay,
  SortableNestedRoot as Root,
  SortableNestedRoot as SortableNested,
  SortableNestedContainer,
  SortableNestedContainerHandle,
  SortableNestedContainers,
  SortableNestedItem,
  SortableNestedItemHandle,
  SortableNestedItems,
  SortableNestedOverlay,
  SortableNestedRoot,
  // Context hook
  useSortableNestedContext,
}
