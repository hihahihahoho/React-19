import { useResizeObserver } from "@/hooks/use-resize-observer"
import React from "react"

// Define the possible overflow states
type OverflowState = "collapse" | "none"

export interface UseItemOverflowProps {
  totalItems: number
  maxShownItems?: number
  minShowItems?: number
  itemClassName?: string
  plusItemClassName?: string
  overflowState?: OverflowState
}

interface UseItemOverflowReturn {
  containerRef: React.RefObject<HTMLDivElement | null>
  visibleCount: number
  overflowCount: number
  isVisible: (index: number) => boolean
  overflowState: OverflowState // Expose the current overflow state
}

export const useItemOverflow = ({
  totalItems,
  maxShownItems = Infinity,
  minShowItems = 1,
  itemClassName = "measured-item",
  plusItemClassName = "measured-plus",
  overflowState = "collapse", // Default to current behavior
}: UseItemOverflowProps): UseItemOverflowReturn => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = React.useState<number>(0)

  const calculateOverflow = React.useCallback(() => {
    const containerWidth = containerRef.current?.getBoundingClientRect().width
    if (!containerWidth) return
    if (!containerRef.current) return
    if (totalItems === 0) {
      setVisibleCount(0)
      return
    }

    const itemNodes = containerRef.current.querySelectorAll<HTMLDivElement>(
      `.${itemClassName}`
    )
    const itemGap = parseInt(getComputedStyle(containerRef.current).gap)
    const plusNode = containerRef.current.querySelector<HTMLDivElement>(
      `.${plusItemClassName}`
    )

    const itemArray = Array.from(itemNodes)
    const plusWidth = (plusNode?.getBoundingClientRect().width || 0) + itemGap

    let widthSoFar = 0
    let count = 0

    // Count how many items can fit in the container
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

    // If overflow state is 'none', show all items up to maxShownItems
    if (overflowState === "none") {
      setVisibleCount(Math.min(totalItems, maxShownItems))
      return
    }

    // Otherwise use the collapse behavior
    if (count === totalItems) {
      setVisibleCount(count)
    } else {
      while (count > 0) {
        let testWidth = 0
        for (let i = 0; i < count; i++) {
          testWidth += itemArray[i].getBoundingClientRect().width + itemGap
        }
        if (testWidth + plusWidth <= containerWidth) {
          setVisibleCount(Math.max(count, minShowItems))
          return
        }
        count--
      }
      setVisibleCount(minShowItems)
    }
  }, [
    totalItems,
    maxShownItems,
    minShowItems,
    itemClassName,
    plusItemClassName,
    overflowState, // Add the new dependency
  ])

  useResizeObserver({
    ref: containerRef,
    onResize: calculateOverflow,
  })

  React.useEffect(() => {
    calculateOverflow()
  }, [calculateOverflow])

  // Determine how many items to show based on overflow state
  const showCount =
    overflowState === "none"
      ? Math.min(totalItems, maxShownItems)
      : Math.min(Math.max(visibleCount, minShowItems), totalItems)

  const overflowCount = totalItems - showCount
  const isVisible = (index: number) =>
    overflowState === "none"
      ? index < maxShownItems
      : index < minShowItems || index < showCount

  return {
    containerRef,
    visibleCount: showCount,
    overflowCount,
    isVisible,
    overflowState, // Return the current overflow state
  }
}
