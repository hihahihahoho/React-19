import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const glassIconWraperVariants = cva("relative", {
  variants: {
    size: {
      sm: "size-12",
      lg: "size-[72px]",
    },
  },
  defaultVariants: {
    size: "sm",
  },
})

const glassIconVariants = cva(
  "absolute z-[1] flex items-center justify-center rounded-lg bg-gradient-to-tr from-white/80 to-white/0 text-white ring-1 ring-inset ring-white/40 backdrop-blur-md dark:ring-white/20",
  {
    variants: {
      variant: {
        default: "bottom-[3px] left-[3px] size-[34px]",
        card: "bottom-[3px] left-[7px] h-[42px] w-[30px]",
      },
      size: {
        sm: "[&_svg]:size-6",
        lg: "[&_svg]:size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
    compoundVariants: [
      {
        variant: "default",
        size: "lg",
        className: "size-[52px] rounded-xl ring-2",
      },
      {
        variant: "card",
        size: "lg",
        className: "h-[64px] w-[45px] ring-2",
      },
    ],
  }
)

const glassIconColorVariants = {
  blue: "bg-blue-500 dark:bg-blue-600",
  green: "bg-green-500 dark:bg-green-600",
  red: "bg-red-500 dark:bg-red-600",
  purple: "bg-purple-500 dark:bg-purple-600",
  amber: "bg-amber-500 dark:bg-amber-600",
  rose: "bg-rose-500 dark:bg-rose-600",
  indigo: "bg-indigo-500 dark:bg-indigo-600",
  cyan: "bg-cyan-500 dark:bg-cyan-600",
  emerald: "bg-emerald-500 dark:bg-emerald-600",
  gray: "bg-primary dark:bg-primary/30",
}

const glassIconBackgroundVariants = cva("absolute z-[0] rounded-lg", {
  variants: {
    variant: {
      default: "absolute right-[5px] top-[4px] size-[34px] rotate-[15deg]",
      card: "right-[6px] top-[7px] h-[34px] w-[30px] rotate-[15deg]",
    },
    size: {
      sm: "",
      lg: "",
    },
    color: glassIconColorVariants,
  },
  defaultVariants: {
    variant: "default",
    size: "sm",
    color: "gray",
  },
  compoundVariants: [
    {
      variant: "default",
      size: "lg",
      className: "right-[8px] top-[6px] size-[52px] rounded-xl",
    },
    {
      variant: "card",
      size: "lg",
      className: "right-[12px] top-[8px] h-[52px] w-[45px]",
    },
  ],
})

export interface GlassIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassIconVariants> {
  backgroundClassName?: string
  color?: keyof typeof glassIconColorVariants
}

function GlassIcon({
  className,
  variant,
  size,
  color,
  children,
  backgroundClassName,
  ...props
}: GlassIconProps) {
  return (
    <div
      className={cn(
        glassIconWraperVariants({
          size,
        }),
        className
      )}
      {...props}
    >
      <div
        className={cn(
          glassIconVariants({
            variant,
            size,
          }),
          className
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          glassIconBackgroundVariants({
            variant,
            size,
            color,
          }),
          backgroundClassName
        )}
      />
    </div>
  )
}

export { GlassIcon, glassIconColorVariants, glassIconVariants }
