import { Slot, Slottable } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "ring-offset-background focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs",
        outline:
          "border-input bg-background hover:bg-accent hover:text-accent-foreground text-base-foreground border shadow-xs",
        secondary:
          "bg-base-secondary text-base-secondary-foreground hover:bg-base-secondary/80 shadow-xs",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },

      isRounded: {
        true: "rounded-full",
      },
      disabled: {
        true: "pointer-events-none opacity-50",
      },
      size: {
        xs: "h-6 min-w-6 gap-1 rounded-md px-2 py-1 text-xs",
        default: "h-9 min-w-9 px-4 py-2",
        sm: "h-8 min-w-8 px-3",
        lg: "h-10 min-w-10 rounded-xl px-8",
      },
      iconOnly: {
        true: "p-0",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
      iconOnly: false,
    },
  }
)

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  btnEventClick?: () => void
  iconLeft?: string | React.ReactNode
  iconRight?: string | React.ReactNode
  isLoading?: boolean
}

function Button({
  className,
  variant,
  size,
  iconOnly,
  asChild = false,
  iconLeft,
  iconRight,
  type = "button",
  isRounded,
  isLoading,
  disabled,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      type={type}
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
          iconOnly,
          isRounded,
          disabled,
        }),
        "flex items-center"
      )}
      disabled={isLoading || disabled || false}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      {!isLoading && iconLeft && iconLeft}
      <Slottable>{props.children}</Slottable>
      {iconRight && iconRight}
    </Comp>
  )
}

export { Button, buttonVariants }
