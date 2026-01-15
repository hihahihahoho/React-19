"use client"

import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { useComposedRefs } from "@/lib/compose-refs"
import { cn } from "@/lib/utils"

type StickyDirection = "top" | "bottom" | "left" | "right"

export interface StickyProps extends React.HTMLAttributes<HTMLElement> {
  direction?: StickyDirection
  onStickyChange?: (isSticky: boolean) => void
  asChild?: boolean
  stickyClassName?: string
  ref?: React.Ref<HTMLElement>
}

function Sticky({
  children,
  direction = "top",
  onStickyChange,
  className,
  stickyClassName,
  asChild = false,
  style,
  ref,
  ...props
}: StickyProps) {
  const internalRef = React.useRef<React.ComponentRef<typeof Slot>>(null)
  const composedRefs = useComposedRefs(internalRef, ref)
  const [isSticky, setIsSticky] = React.useState(false)

  React.useEffect(() => {
    const element = internalRef.current
    if (!element) return

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const stuck = entry.intersectionRatio < 1
        setIsSticky(stuck)
        onStickyChange?.(stuck)
      },
      {
        threshold: [1],
        rootMargin: "-1px 0px -1px 0px",
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [direction, onStickyChange])

  const Comp = asChild ? Slot : "div"

  const stickyPositionMap: Record<StickyDirection, React.CSSProperties> = {
    top: { top: -1 },
    bottom: { bottom: -1 },
    left: { left: -1 },
    right: { right: -1 },
  }

  return (
    <Comp
      ref={(node: HTMLDivElement | null) => {
        composedRefs(node)
      }}
      data-slot="sticky"
      data-sticky-direction={direction}
      data-sticky={isSticky ? "" : undefined}
      className={cn("group sticky", className, isSticky && stickyClassName)}
      style={{
        ...stickyPositionMap[direction],
        ...style,
      }}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { Sticky }
