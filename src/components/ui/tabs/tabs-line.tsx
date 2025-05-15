"use client"

import { cn } from "@/lib/utils"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva } from "class-variance-authority"
import * as React from "react"
import {
  TabCore,
  TabCoreContent,
  TabCoreList,
  TabCoreTrigger,
  useTabsContext,
  type TabCoreProps,
} from "./tabs-core"

// Define Line variant CVA
const lineTabsListVariants = cva(
  "text-muted-foreground relative z-10 flex max-w-full items-stretch justify-start gap-4 overflow-auto overscroll-contain",
  {
    variants: {
      size: {
        sm: "min-h-8 gap-1",
        default: "min-h-9 gap-1.5",
        lg: "min-h-10 gap-2",
      },
      orientation: {
        horizontal: "flex-row border-b",
        vertical: "flex-col gap-4 border-r",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "default",
    },
  }
)

const lineTabsTriggerVariants = cva(
  "focus-visible:ring-ring data-[state=active]:text-foreground relative inline-flex items-center justify-center px-2 font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:outline-hidden focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "b-1 min-w-8 gap-1 py-0.5 pt-1.5 text-xs",
        default: "gap-1.5 py-1 pt-2 pb-1.5 text-sm",
        lg: "gap-2 py-1.5 pt-2.5 pb-2",
      },
      orientation: {
        horizontal: "border-b-2 border-transparent",
        vertical:
          "w-full justify-start border-r-2 border-transparent pt-0 pr-3 pb-0 text-left",
      },
    },
    defaultVariants: {
      size: "default",
      orientation: "horizontal",
    },
  }
)

const lineTabsIndicatorVariants = cva("bg-primary absolute -z-1 h-0.5 w-full", {
  variants: {
    size: {
      sm: "",
      default: "",
      lg: "",
    },
    orientation: {
      horizontal: "right-0 -bottom-0.5 left-0",
      vertical: "-bottom-auto -right-0.5 bottom-0 left-auto h-full w-0.5",
    },
  },
  defaultVariants: {
    size: "default",
    orientation: "horizontal",
  },
})

const lineTabsContentVariants = cva(
  "ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden",
  {
    variants: {
      size: {
        sm: "mt-1.5",
        default: "mt-2",
        lg: "mt-2.5",
      },
      orientation: {
        horizontal: "",
        vertical: "mt-0 ml-4",
      },
    },
    defaultVariants: {
      size: "default",
      orientation: "horizontal",
    },
  }
)

// Line variant components
function TabsLine(props: TabCoreProps) {
  return <TabCore {...props} />
}

function TabsListLine({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const { orientation, size } = useTabsContext()

  return (
    <TabCoreList
      className={cn(
        lineTabsListVariants({
          size,
          orientation,
          className,
        })
      )}
      {...props}
    />
  )
}

function TabsTriggerLine({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { orientation, size } = useTabsContext()

  return (
    <TabCoreTrigger
      className={cn(
        lineTabsTriggerVariants({
          size,
          orientation,
          className,
        })
      )}
      indicatorClassName={cn(
        lineTabsIndicatorVariants({
          size,
          orientation,
        })
      )}
      {...props}
    />
  )
}

function TabsContentLine({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  const { orientation, size } = useTabsContext()

  return (
    <TabCoreContent
      className={cn(
        lineTabsContentVariants({
          size,
          orientation,
          className,
        })
      )}
      {...props}
    />
  )
}

export { TabsContentLine, TabsLine, TabsListLine, TabsTriggerLine }
