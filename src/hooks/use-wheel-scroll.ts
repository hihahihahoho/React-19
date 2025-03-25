import * as React from "react"

interface UseWheelScrollOptions {
  orientation?: "horizontal" | "vertical" | null | undefined
  containerRef: React.RefObject<HTMLElement | null>
  /**
   * Speed multiplier for the scroll action
   * @default 1
   */
  speed?: number
}

/**
 * Hook to handle wheel events for scrollable containers
 * Particularly useful for horizontal scrolling with vertical wheel movement
 */
export function useWheelScroll({
  orientation,
  containerRef,
  speed = 1
}: UseWheelScrollOptions) {
  const handleWheel = React.useCallback(
    (event: React.WheelEvent<HTMLElement>) => {
      // If orientation is vertical, let the default browser behavior handle it
      if (orientation === "vertical") {
        return
      }

      if (
        !containerRef.current ||
        event.deltaY === 0 ||
        (orientation === "horizontal" && event.deltaX !== 0)
      ) {
        return
      }

      event.stopPropagation()

      // Default to horizontal if orientation is null or undefined
      const effectiveOrientation = orientation || "horizontal"
      // Apply speed multiplier to the delta
      const scrollAmount = event.deltaY * speed

      if (effectiveOrientation === "horizontal") {
        containerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        })
      } else {
        containerRef.current.scrollBy({
          top: scrollAmount,
          behavior: "smooth",
        })
      }
    },
    [containerRef, orientation, speed]
  )

  return { handleWheel }
}