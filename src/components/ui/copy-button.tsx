"use client"

import { Check, Copy as CopyIcon, Loader2, X } from "lucide-react"
import * as React from "react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { Copy, type CopyState } from "@/components/ui/copy"
import { sonnerToast } from "./sonner"

/* -------------------------------------------------------------------------------------------------
 * CopyButton - A pre-styled copy button with toast feedback
 * -------------------------------------------------------------------------------------------------*/

export interface CopyButtonProps extends Omit<
  ButtonProps,
  "children" | "asChild"
> {
  /** Text content to copy to clipboard */
  content: string
  /** Time in ms before state resets to idle. Default: 2000 */
  resetDelay?: number
  /** Time in ms before showing loading state. Default: 500 to avoid flash for quick operations */
  loadingDelay?: number
  /** Toast message on success. Set to false to disable. Default: "Copied to clipboard" */
  successMessage?: string | false
  /** Toast message on error. Set to false to disable. Default: "Failed to copy" */
  errorMessage?: string | false
  /** Callback fired after successful copy */
  onCopied?: () => void
  /** Callback fired when copy fails */
  onCopyError?: (error: Error) => void
  ref?: React.Ref<HTMLButtonElement>
}

// Icon mapping for each state
const stateIcons: Record<CopyState, React.ReactNode> = {
  idle: <CopyIcon />,
  copying: <Loader2 className="animate-spin" />,
  copied: <Check className="text-green-500" />,
  error: <X className="text-destructive" />,
}

function CopyButton({
  content,
  resetDelay = 2000,
  loadingDelay = 500,
  successMessage = "Copied to clipboard",
  errorMessage = "Failed to copy",
  onCopied,
  onCopyError,
  variant = "outline",
  iconOnly = true,
  ref,
  ...props
}: CopyButtonProps) {
  return (
    <Copy
      content={content}
      resetDelay={resetDelay}
      loadingDelay={loadingDelay}
      onCopied={() => {
        if (successMessage)
          sonnerToast({
            title: successMessage,
            variant: "success",
          })
        onCopied?.()
      }}
      onCopyError={(error) => {
        if (errorMessage)
          sonnerToast({
            title: successMessage,
            variant: "destructive",
          })
        onCopyError?.(error)
      }}
    >
      {(state) => (
        <Button
          ref={ref}
          size={"xs"}
          variant={variant}
          iconOnly={iconOnly}
          {...props}
        >
          {stateIcons[state]}
          <span className="sr-only">Copy</span>
        </Button>
      )}
    </Copy>
  )
}

export { CopyButton }
