import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"

const badgeVariants = cva(
  "focus:ring-ring inline-flex items-center justify-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors ring-inset focus:ring-2 focus:ring-offset-2 focus:outline-hidden [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground [a&]:hover:bg-primary/80 shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/80 shadow-sm",
        outline:
          "text-foreground ring-primary/10 [a&]:hover:bg-accent [a&]:hover:text-accent-foreground ring-1",
        red: "bg-red-500/15 text-red-700 dark:bg-red-500/10 dark:text-red-400 [a&]:hover:bg-red-500/25 dark:[a&]:hover:bg-red-500/20",
        orange:
          "bg-orange-500/15 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 [a&]:hover:bg-orange-500/25 dark:[a&]:hover:bg-orange-500/20",
        amber:
          "bg-amber-400/20 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400 [a&]:hover:bg-amber-400/30 dark:[a&]:hover:bg-amber-400/15",
        yellow:
          "bg-yellow-400/20 text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-300 [a&]:hover:bg-yellow-400/30 dark:[a&]:hover:bg-yellow-400/15",
        lime: "bg-lime-400/20 text-lime-700 dark:bg-lime-400/10 dark:text-lime-300 [a&]:hover:bg-lime-400/30 dark:[a&]:hover:bg-lime-400/15",
        green:
          "bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400 [a&]:hover:bg-green-500/25 dark:[a&]:hover:bg-green-500/20",
        emerald:
          "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 [a&]:hover:bg-emerald-500/25 dark:[a&]:hover:bg-emerald-500/20",
        teal: "bg-teal-500/15 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300 [a&]:hover:bg-teal-500/25 dark:[a&]:hover:bg-teal-500/20",
        cyan: "bg-cyan-400/20 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300 [a&]:hover:bg-cyan-400/30 dark:[a&]:hover:bg-cyan-400/15",
        sky: "bg-sky-500/15 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300 [a&]:hover:bg-sky-500/25 dark:[a&]:hover:bg-sky-500/20",
        blue: "bg-blue-500/15 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 [a&]:hover:bg-blue-500/25 dark:[a&]:hover:bg-blue-500/25",
        indigo:
          "bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 [a&]:hover:bg-indigo-500/25 dark:[a&]:hover:bg-indigo-500/20",
        violet:
          "bg-violet-500/15 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 [a&]:hover:bg-violet-500/25 dark:[a&]:hover:bg-violet-500/20",
        purple:
          "bg-purple-500/15 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 [a&]:hover:bg-purple-500/25 dark:[a&]:hover:bg-purple-500/20",
        fuchsia:
          "bg-fuchsia-400/15 text-fuchsia-700 dark:bg-fuchsia-400/10 dark:text-fuchsia-400 [a&]:hover:bg-fuchsia-400/25 dark:[a&]:hover:bg-fuchsia-400/20",
        pink: "bg-pink-400/15 text-pink-700 dark:bg-pink-400/10 dark:text-pink-400 [a&]:hover:bg-pink-400/25 dark:[a&]:hover:bg-pink-400/20",
        rose: "bg-rose-400/15 text-rose-700 dark:bg-rose-400/10 dark:text-rose-400 [a&]:hover:bg-rose-400/25 dark:[a&]:hover:bg-rose-400/20",
        zinc: "bg-zinc-600/10 text-zinc-700 dark:bg-white/5 dark:text-zinc-400 [a&]:hover:bg-zinc-600/20 dark:[a&]:hover:bg-white/10",
      },
      size: {
        xs: "min-h-5 min-w-5 px-2 py-0.5 text-xs",
        sm: "min-h-6 min-w-6 px-2 py-0.5 text-xs",
        md: "min-h-7 min-w-7 px-2.5 py-0.5 text-xs",
        lg: "rounded-4 min-h-8 min-w-8 px-4 py-1 text-sm",
      },
      hasLeftIcon: { true: "" },
      hasRightIcon: { true: "" },
      clearBtn: { true: "" },
    },

    compoundVariants: [
      { hasLeftIcon: true, size: "xs", className: "pl-1" },
      { hasLeftIcon: true, size: "sm", className: "pl-1.5" },
      { hasLeftIcon: true, size: ["md", "lg"], className: "pl-2" },
      { hasRightIcon: true, size: "xs", className: "pr-1" },
      { hasRightIcon: true, size: "sm", className: "pr-1.5" },
      { hasRightIcon: true, size: ["md", "lg"], className: "pr-2" },
      { clearBtn: true, size: ["md", "lg"], className: "pr-1.5" },
      { clearBtn: true, size: "sm", className: "pr-1" },
    ],
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
)

export interface BadgeProps
  extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
