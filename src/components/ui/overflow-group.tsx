"use client"

import { useResizeObserver } from "@/hooks/use-resize-observer"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

// ============================================================================
// Types
// ============================================================================

type OverflowState = "collapse" | "none"

interface OverflowGroupContextValue {
  visibleCount: number
  overflowCount: number
  totalItems: number
  isVisible: (index: number) => boolean
  overflowState: OverflowState
  hiddenItems: number[]
}

// ============================================================================
// Context
// ============================================================================

const OverflowGroupContext =
  React.createContext<OverflowGroupContextValue | null>(null)

export function useOverflowGroupContext() {
  const context = React.useContext(OverflowGroupContext)
  if (!context) {
    throw new Error("useOverflowGroupContext must be used within OverflowGroup")
  }
  return context
}

// ============================================================================
// OverflowGroup (Root)
// ============================================================================

export interface OverflowGroupProps extends React.ComponentProps<"div"> {
  children: React.ReactNode
  maxShownItems?: number
  maxLine?: number
  minShowItems?: number
  overflowState?: OverflowState
}

function OverflowGroup({
  children,
  maxShownItems = Infinity,
  maxLine = 1,
  minShowItems = 1,
  overflowState = "collapse",
  className,
  ...props
}: OverflowGroupProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = React.useState<number>(0)
  const [totalItems, setTotalItems] = React.useState<number>(0)

  const calculateOverflow = React.useCallback(() => {
    if (!containerRef.current) return

    const containerWidth = containerRef.current.getBoundingClientRect().width
    if (!containerWidth) return

    const itemNodes = containerRef.current.querySelectorAll<HTMLDivElement>(
      "[data-overflow-item]"
    )
    const itemCount = itemNodes.length
    setTotalItems(itemCount)

    if (itemCount === 0) {
      setVisibleCount(0)
      return
    }

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
        setVisibleCount(Math.min(itemCount, maxShownItems))
        return
      }

      if (count === itemCount) {
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
      setVisibleCount(Math.min(shown, maxShownItems, itemCount))
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
    visible = Math.min(visible, maxShownItems, itemCount)
    setVisibleCount(visible)
  }, [maxShownItems, maxLine, minShowItems, overflowState])

  useResizeObserver({
    ref: containerRef,
    onResize: calculateOverflow,
  })

  React.useEffect(() => {
    calculateOverflow()
  }, [calculateOverflow])

  // Determine how many items to show
  const showCount =
    overflowState === "none"
      ? Math.min(totalItems, maxShownItems)
      : Math.min(Math.max(visibleCount, minShowItems), totalItems)

  const overflowCount = totalItems - showCount

  const isVisible = React.useCallback(
    (index: number) =>
      overflowState === "none"
        ? index < maxShownItems
        : index < minShowItems || index < showCount,
    [overflowState, maxShownItems, minShowItems, showCount]
  )

  const hiddenItems = React.useMemo(() => {
    const hidden: number[] = []
    for (let i = 0; i < totalItems; i++) {
      if (!isVisible(i)) {
        hidden.push(i)
      }
    }
    return hidden
  }, [totalItems, isVisible])

  const contextValue: OverflowGroupContextValue = {
    visibleCount: showCount,
    overflowCount,
    totalItems,
    isVisible,
    overflowState,
    hiddenItems,
  }

  return (
    <OverflowGroupContext.Provider value={contextValue}>
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
        visible
          ? "relative opacity-100"
          : "pointer-events-none absolute opacity-0",
        className
      )}
      style={visible ? {} : { position: "absolute" }}
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

  if (overflowCount <= 0) return null

  const Comp = asChild ? Slot : "div"
  const content =
    typeof children === "function"
      ? children(overflowCount)
      : (children ?? (overflowCount > 99 ? ">99" : `+${overflowCount}`))

  return (
    <Comp
      data-slot="overflow-group-indicator"
      data-overflow-indicator=""
      className={cn("relative opacity-100", className)}
      {...props}
    >
      {content}
    </Comp>
  )
}

// ============================================================================
// OverflowGroupHiddenItems
// ============================================================================

export interface OverflowGroupHiddenItemsProps {
  /**
   * Render function that receives the array of hidden item indices
   */
  children: (hiddenItems: number[]) => React.ReactNode
}

/**
 * Component to render hidden/overflowed items.
 * Provides access to the indices of hidden items via render prop.
 */
function OverflowGroupHiddenItems({ children }: OverflowGroupHiddenItemsProps) {
  const { hiddenItems, overflowCount } = useOverflowGroupContext()

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
