// https://usehooks-ts.com/react-hook/use-resize-observer


import type { RefObject } from "react"
import React from "react"
import { useIsMounted } from "./use-is-mounted"

type Size = {
  width: number | undefined
  height: number | undefined
}

type UseResizeObserverOptions<T extends HTMLElement = HTMLElement> = {
  ref: RefObject<T | null>
  onResize?: (size: Size) => void
  box?: "border-box" | "content-box" | "device-pixel-content-box"
}

const initialSize: Size = {
  width: undefined,
  height: undefined,
}

export function useResizeObserver<T extends HTMLElement = HTMLElement>(
  options: UseResizeObserverOptions<T>
): Size {
  const { ref, box = "content-box" } = options
  const [{ width, height }, setSize] = React.useState<Size>(initialSize)
  const isMounted = useIsMounted()
  const previousSize = React.useRef<Size>({ ...initialSize })
  const onResize = React.useRef<((size: Size) => void) | undefined>(undefined)
  onResize.current = options.onResize

  React.useEffect(() => {
    if (!ref.current) return

    if (typeof window === "undefined" || !("ResizeObserver" in window)) return

    const observer = new ResizeObserver(([entry]) => {
      const boxProp =
        box === "border-box"
          ? "borderBoxSize"
          : box === "device-pixel-content-box"
            ? "devicePixelContentBoxSize"
            : "contentBoxSize"

      const newWidth = extractSize(entry, boxProp, "inlineSize")
      const newHeight = extractSize(entry, boxProp, "blockSize")

      const hasChanged =
        previousSize.current.width !== newWidth ||
        previousSize.current.height !== newHeight

      if (hasChanged) {
        const newSize: Size = { width: newWidth, height: newHeight }
        previousSize.current.width = newWidth
        previousSize.current.height = newHeight

        if (onResize.current) {
          onResize.current(newSize)
        } else {
          if (isMounted()) {
            setSize(newSize)
          }
        }
      }
    })

    observer.observe(ref.current, { box })

    return () => {
      observer.disconnect()
    }
  }, [box, ref, isMounted])

  return { width, height }
}

type BoxSizesKey = keyof Pick<
  ResizeObserverEntry,
  "borderBoxSize" | "contentBoxSize" | "devicePixelContentBoxSize"
>

function extractSize(
  entry: ResizeObserverEntry,
  box: BoxSizesKey,
  sizeType: keyof ResizeObserverSize
): number | undefined {
  if (!entry[box]) {
    if (box === "contentBoxSize") {
      return entry.contentRect[sizeType === "inlineSize" ? "width" : "height"]
    }
    return undefined
  }

  return Array.isArray(entry[box])
    ? entry[box][0][sizeType]
    : // @ts-expect-error Support Firefox's non-standard behavior
    (entry[box][sizeType] as number)
}
