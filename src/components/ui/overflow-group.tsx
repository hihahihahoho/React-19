"use client"

import { useResizeObserver } from "@/hooks/use-resize-observer"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

// ============================================================================
// Types
// ============================================================================

type OverflowState = "collapse" | "none"

interface OverflowGroupContextValue<T = unknown> {
  visibleCount: number
  overflowCount: number
  totalItems: number
  isVisible: (index: number) => boolean
  overflowState: OverflowState
  hiddenItems: T[]
  items: T[]
}

// ============================================================================
// Context
// ============================================================================

const OverflowGroupContext =
  React.createContext<OverflowGroupContextValue | null>(null)

function useOverflowGroupContext<T = unknown>() {
  const context = React.useContext(
    OverflowGroupContext
  ) as OverflowGroupContextValue<T> | null
  if (!context) {
    throw new Error("useOverflowGroupContext must be used within OverflowGroup")
  }
  return context
}

export { useOverflowGroupContext }

// ============================================================================
// OverflowGroup (Root)
// ============================================================================

export interface OverflowGroupProps<T> extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** Array of items to manage overflow for */
  items: T[]
  children: React.ReactNode
  maxShownItems?: number
  maxLine?: number
  minShowItems?: number
  overflowState?: OverflowState
}

function OverflowGroup<T>({
  items,
  children,
  maxShownItems = Infinity,
  maxLine = 1,
  minShowItems = 1,
  overflowState = "collapse",
  className,
  ...props
}: OverflowGroupProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = React.useState<number>(0)

  // Get totalItems from items.length - same as old hook
  const totalItems = items.length

  const calculateOverflow = React.useCallback(() => {
    const containerWidth = containerRef.current?.getBoundingClientRect().width
    if (!containerWidth) return
    if (!containerRef.current) return

    if (totalItems === 0) {
      setVisibleCount(0)
      return
    }

    const itemNodes = containerRef.current.querySelectorAll<HTMLDivElement>(
      "[data-overflow-item]"
    )
    const itemGap = parseInt(getComputedStyle(containerRef.current).gap) || 0
    const indicatorNode = containerRef.current.querySelector<HTMLDivElement>(
      "[data-overflow-indicator]"
    )

    const itemArray = Array.from(itemNodes)
    const indicatorWidth =
      (indicatorNode?.getBoundingClientRect().width || 0) + itemGap

    // Single line logic
    if (maxLine <= 1) {
      let widthSoFar = 0
      let count = 0
      for (let i = 0; i < itemArray.length; i++) {
        const w = itemArray[i].getBoundingClientRect().width + itemGap
        if (widthSoFar + w <= containerWidth) {
          widthSoFar += w
          count++
          if (count >= maxShownItems) break
        } else {
          break
        }
      }

      if (overflowState === "none") {
        setVisibleCount(Math.min(totalItems, maxShownItems))
        return
      }

      if (count === totalItems) {
        setVisibleCount(count)
      } else {
        while (count > 0) {
          let testWidth = 0
          for (let i = 0; i < count; i++) {
            testWidth += itemArray[i].getBoundingClientRect().width + itemGap
          }
          if (testWidth + indicatorWidth <= containerWidth) {
            setVisibleCount(Math.max(count, minShowItems))
            return
          }
          count--
        }
        setVisibleCount(minShowItems)
      }
      return
    }

    // Multi-line logic
    if (overflowState === "none") {
      let line = 1
      let widthUsed = 0
      let shown = 0
      for (let i = 0; i < itemArray.length; i++) {
        const w = itemArray[i].getBoundingClientRect().width + itemGap
        if (
          widthUsed === 0
            ? w <= containerWidth
            : widthUsed + w <= containerWidth
        ) {
          widthUsed += w
          shown++
        } else {
          line++
          if (line > maxLine) break
          widthUsed = 0
          i--
        }
        if (shown >= maxShownItems) break
      }
      setVisibleCount(Math.min(shown, maxShownItems, totalItems))
      return
    }

    // Collapse behavior with last-line indicator reservation
    let line = 1
    let visible = 0
    let i = 0
    let widthUsed = 0

    for (; i < itemArray.length && line < maxLine; ) {
      const w = itemArray[i].getBoundingClientRect().width + itemGap
      if (
        widthUsed === 0 ? w <= containerWidth : widthUsed + w <= containerWidth
      ) {
        widthUsed += w
        visible++
        i++
        if (visible >= maxShownItems) {
          setVisibleCount(Math.min(visible, maxShownItems))
          return
        }
      } else {
        line++
        widthUsed = 0
      }
    }

    widthUsed = 0
    const lastLineWidths: number[] = []
    let added = 0
    for (; i < itemArray.length; i++) {
      const w = itemArray[i].getBoundingClientRect().width + itemGap
      if (
        widthUsed === 0 ? w <= containerWidth : widthUsed + w <= containerWidth
      ) {
        widthUsed += w
        lastLineWidths.push(w)
        added++
        if (visible + added >= maxShownItems) break
      } else {
        break
      }
    }

    const overflowRemains = i < itemArray.length
    if (overflowRemains) {
      while (added > 0 && widthUsed + indicatorWidth > containerWidth) {
        widthUsed -= lastLineWidths.pop()!
        added--
      }
    }

    visible += added
    if (visible < minShowItems) visible = minShowItems
    visible = Math.min(visible, maxShownItems, totalItems)
    setVisibleCount(visible)
  }, [totalItems, maxShownItems, maxLine, minShowItems, overflowState])

  useResizeObserver({
    ref: containerRef,
    onResize: calculateOverflow,
  })

  React.useEffect(() => {
    calculateOverflow()
  }, [calculateOverflow])

  // Determine how many items to show - EXACTLY like old hook
  const showCount =
    overflowState === "none"
      ? Math.min(totalItems, maxShownItems)
      : Math.min(Math.max(visibleCount, minShowItems), totalItems)

  const overflowCount = totalItems - showCount

  // isVisible - EXACTLY like old hook
  const isVisible = React.useCallback(
    (index: number) =>
      overflowState === "none"
        ? index < maxShownItems
        : index < minShowItems || index < showCount,
    [overflowState, maxShownItems, minShowItems, showCount]
  )

  // Get actual hidden items (not just indices)
  const hiddenItems = React.useMemo(() => {
    const hidden: T[] = []
    for (let i = 0; i < totalItems; i++) {
      if (!isVisible(i)) {
        hidden.push(items[i])
      }
    }
    return hidden
  }, [totalItems, isVisible, items])

  const contextValue: OverflowGroupContextValue<T> = {
    visibleCount: showCount,
    overflowCount,
    totalItems,
    isVisible,
    overflowState,
    hiddenItems,
    items,
  }

  return (
    <OverflowGroupContext.Provider
      value={contextValue as OverflowGroupContextValue}
    >
      <div
        ref={containerRef}
        data-slot="overflow-group"
        className={cn(
          "relative flex w-full flex-wrap items-center gap-1 whitespace-nowrap",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </OverflowGroupContext.Provider>
  )
}

// ============================================================================
// OverflowGroupItem
// ============================================================================

export interface OverflowGroupItemProps extends React.ComponentProps<"div"> {
  asChild?: boolean
  index: number
}

function OverflowGroupItem({
  asChild = false,
  index,
  children,
  className,
  style,
  ...props
}: OverflowGroupItemProps) {
  const { isVisible } = useOverflowGroupContext()

  const visible = isVisible(index)
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      data-slot="overflow-group-item"
      data-overflow-item=""
      data-visible={visible}
      className={cn(
        visible ? "" : "pointer-events-none absolute top-0 left-0 opacity-0",
        className
      )}
      style={style}
      aria-hidden={!visible}
      {...props}
    >
      {children}
    </Comp>
  )
}

// ============================================================================
// OverflowGroupIndicator
// ============================================================================

export interface OverflowGroupIndicatorProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  asChild?: boolean
  children?: React.ReactNode | ((count: number) => React.ReactNode)
}

function OverflowGroupIndicator({
  asChild = false,
  children,
  className,
  ...props
}: OverflowGroupIndicatorProps) {
  const { overflowCount } = useOverflowGroupContext()

  const Comp = asChild ? Slot : "div"
  const content =
    typeof children === "function"
      ? children(overflowCount)
      : (children ?? (overflowCount > 99 ? ">99" : `+${overflowCount}`))

  return (
    <Comp
      data-slot="overflow-group-indicator"
      data-overflow-indicator=""
      className={cn(
        overflowCount <= 0 && "pointer-events-none absolute opacity-0",
        className
      )}
      {...props}
    >
      {content}
    </Comp>
  )
}

// ============================================================================
// OverflowGroupHiddenItems
// ============================================================================

export interface OverflowGroupHiddenItemsProps<T> {
  /** Render function that receives the array of hidden items */
  children: (hiddenItems: T[]) => React.ReactNode
}

/**
 * Component to render hidden/overflowed items.
 * Provides access to the actual hidden items via render prop.
 * Specify the type for type safety: `<OverflowGroupHiddenItems<MyType>>`
 */
function OverflowGroupHiddenItems<T>({
  children,
}: OverflowGroupHiddenItemsProps<T>) {
  const { hiddenItems, overflowCount } = useOverflowGroupContext<T>()

  if (overflowCount <= 0) return null

  return <>{children(hiddenItems)}</>
}

// ============================================================================
// Exports
// ============================================================================

export {
  OverflowGroup,
  OverflowGroupHiddenItems,
  OverflowGroupIndicator,
  OverflowGroupItem,
}
