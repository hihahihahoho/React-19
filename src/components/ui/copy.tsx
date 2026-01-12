"use client"

import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------------------------------
 * Copy - Base copy component with render prop pattern
 * -------------------------------------------------------------------------------------------------*/

export type CopyState = "idle" | "copying" | "copied" | "error"

export interface CopyProps extends Omit<
  React.ComponentPropsWithoutRef<"button">,
  "children"
> {
  /** Text content to copy to clipboard */
  content: string
  /** Merge props into child element instead of rendering a button */
  asChild?: boolean
  /** Time in ms before state resets to idle. Default: 2000 */
  resetDelay?: number
  /** Time in ms before showing "copying" state. Default: 0. Set to 500 to avoid flash for quick operations */
  loadingDelay?: number
  /** Callback fired after successful copy */
  onCopied?: () => void
  /** Callback fired when copy fails */
  onCopyError?: (error: Error) => void
  /** Render prop pattern - receive copy state to control UI */
  children?: React.ReactNode | ((state: CopyState) => React.ReactNode)
  ref?: React.Ref<HTMLButtonElement>
}

function Copy({
  children,
  className,
  content,
  asChild = false,
  resetDelay = 2000,
  loadingDelay = 0,
  onCopied,
  onCopyError,
  onClick,
  ref,
  ...props
}: CopyProps) {
  const Comp = asChild ? Slot : "button"
  const [state, setState] = React.useState<CopyState>("idle")
  const resetTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const loadingTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [])

  const handleCopy = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      // Execute original onClick if present
      onClick?.(event)

      // Clear any existing timeouts
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }

      // Set up delayed loading state
      if (loadingDelay > 0) {
        loadingTimeoutRef.current = setTimeout(() => {
          setState("copying")
        }, loadingDelay)
      } else {
        setState("copying")
      }

      try {
        await navigator.clipboard.writeText(content)

        // Clear loading timeout if copy finished before delay
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current)
        }

        setState("copied")
        onCopied?.()

        resetTimeoutRef.current = setTimeout(() => {
          setState("idle")
        }, resetDelay)
      } catch (error) {
        // Clear loading timeout if copy finished before delay
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current)
        }

        const err = error instanceof Error ? error : new Error(String(error))
        setState("error")
        onCopyError?.(err)
        console.error("Failed to copy:", err)

        resetTimeoutRef.current = setTimeout(() => {
          setState("idle")
        }, resetDelay)
      }
    },
    [content, loadingDelay, resetDelay, onCopied, onCopyError, onClick]
  )

  // Resolve children - support both ReactNode and render prop
  const resolvedChildren =
    typeof children === "function" ? children(state) : children

  return (
    <Comp
      ref={ref}
      onClick={handleCopy}
      className={cn(className)}
      data-state={state}
      {...props}
    >
      {resolvedChildren}
    </Comp>
  )
}

export { Copy }
