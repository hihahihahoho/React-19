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
  // Default variants from Badge
  default: "bg-primary dark:bg-primary",
  secondary: "bg-secondary dark:bg-secondary",
  destructive: "bg-destructive dark:bg-destructive",
  outline: "bg-primary/10 dark:bg-primary/20",

  // Color variants
  red: "bg-red-500 dark:bg-red-600",
  orange: "bg-orange-500 dark:bg-orange-600",
  amber: "bg-amber-500 dark:bg-amber-600",
  yellow: "bg-yellow-400 dark:bg-yellow-500",
  lime: "bg-lime-400 dark:bg-lime-500",
  green: "bg-green-500 dark:bg-green-600",
  emerald: "bg-emerald-500 dark:bg-emerald-600",
  teal: "bg-teal-500 dark:bg-teal-600",
  cyan: "bg-cyan-500 dark:bg-cyan-600",
  sky: "bg-sky-500 dark:bg-sky-600",
  blue: "bg-blue-500 dark:bg-blue-600",
  indigo: "bg-indigo-500 dark:bg-indigo-600",
  violet: "bg-violet-500 dark:bg-violet-600",
  purple: "bg-purple-500 dark:bg-purple-600",
  fuchsia: "bg-fuchsia-400 dark:bg-fuchsia-500",
  pink: "bg-pink-400 dark:bg-pink-500",
  rose: "bg-rose-400 dark:bg-rose-500",
  zinc: "bg-zinc-600 dark:bg-zinc-700",
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
