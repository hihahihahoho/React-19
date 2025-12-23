"use client";

import { useResizeObserver } from "@/hooks/use-resize-observer";
import React from "react";

// Define the possible overflow states
type OverflowState = "collapse" | "none"

export interface UseItemOverflowProps {
  totalItems: number
  maxShownItems?: number
  maxLine?: number
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
  maxLine = 1,
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

    // Branch: single line logic (existing behavior) vs multi-line
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
          if (testWidth + plusWidth <= containerWidth) {
            setVisibleCount(Math.max(count, minShowItems))
            return
          }
          count--
        }
        setVisibleCount(minShowItems)
      }
      return
    }

    // Multi-line logic: simulate wrapping similarly to the single-line branch.
    // Build full lines up to maxLine-1, then fill the last line and reserve
    // space for the "+N" indicator exactly once if overflow remains.
    if (overflowState === "none") {
      let line = 1
      let widthUsed = 0
      let shown = 0
      for (let i = 0; i < itemArray.length; i++) {
        const w = itemArray[i].getBoundingClientRect().width + itemGap
        if (widthUsed === 0 ? w <= containerWidth : widthUsed + w <= containerWidth) {
          widthUsed += w
          shown++
        } else {
          line++
          if (line > maxLine) break
          widthUsed = 0
          i-- // retry this item on the new line
        }
        if (shown >= maxShownItems) break
      }
      setVisibleCount(Math.min(shown, maxShownItems, totalItems))
      return
    }

    // Collapse behavior with explicit last-line plus reservation (only once)
    let line = 1
    let visible = 0
    let i = 0
    let widthUsed = 0

    // Fill complete lines before the last allowed line
    for (; i < itemArray.length && line < maxLine;) {
      const w = itemArray[i].getBoundingClientRect().width + itemGap
      if (widthUsed === 0 ? w <= containerWidth : widthUsed + w <= containerWidth) {
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

    // Handle the last allowed line
    widthUsed = 0
    const lastLineWidths: number[] = []
    let added = 0
    for (; i < itemArray.length; i++) {
      const w = itemArray[i].getBoundingClientRect().width + itemGap
      if (widthUsed === 0 ? w <= containerWidth : widthUsed + w <= containerWidth) {
        widthUsed += w
        lastLineWidths.push(w)
        added++
        if (visible + added >= maxShownItems) break
      } else {
        break
      }
    }

    // If we didn't consume all items, we need a "+N" indicator.
    const overflowRemains = i < itemArray.length
    if (overflowRemains) {
      // Ensure there is room for the plus (reserve once). If not, remove
      // items from the end until the plus fits.
      while (added > 0 && widthUsed + plusWidth > containerWidth) {
        widthUsed -= lastLineWidths.pop()!
        added--
      }
    }

    visible += added
    if (visible < minShowItems) visible = minShowItems
    visible = Math.min(visible, maxShownItems, totalItems)
    setVisibleCount(visible)
  }, [
    totalItems,
    maxShownItems,
    maxLine,
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
