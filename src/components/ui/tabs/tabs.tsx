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
} from "./tabs-core"

const defaultTabsListVariants = cva(
  "text-muted-foreground bg-muted relative z-10 inline-flex max-w-full items-stretch justify-start overflow-auto overscroll-contain rounded-lg p-1",
  {
    variants: {
      size: {
        sm: "min-h-8 gap-1 p-[2px]",
        default: "min-h-9 gap-1.5",
        lg: "min-h-10 gap-2",
      },
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "default",
    },
  }
)

const defaultTabsTriggerVariants = cva(
  "ring-offset-background focus-visible:ring-ring data-[state=active]:text-foreground relative inline-flex items-center justify-center px-3 font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "gap-1 rounded-sm py-0.5 text-xs",
        default: "gap-1.5 rounded-md py-1 text-sm",
        lg: "gap-2 rounded-md py-1.5",
      },
      orientation: {
        horizontal: "",
        vertical: "w-full justify-start text-left",
      },
    },
    defaultVariants: {
      size: "default",
      orientation: "horizontal",
    },
  }
)

const defaultTabsIndicatorVariants = cva(
  "bg-background absolute top-0 right-0 left-0 -z-1 h-full w-full rounded-md shadow-sm",
  {
    variants: {
      size: {
        sm: "",
        default: "",
        lg: "",
      },
      orientation: {
        horizontal: "",
        vertical: "",
      },
    },
    defaultVariants: {
      size: "default",
      orientation: "horizontal",
    },
  }
)

const defaultTabsContentVariants = cva(
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

function Tabs({ ...props }: React.ComponentProps<typeof TabCore>) {
  return <TabCore {...props} />
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const { orientation, size } = useTabsContext()

  return (
    <TabCoreList
      className={cn(
        defaultTabsListVariants({
          size,
          orientation,
          className,
        })
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { orientation, size } = useTabsContext()

  return (
    <TabCoreTrigger
      className={cn(
        defaultTabsTriggerVariants({
          size,
          orientation,
          className,
        })
      )}
      indicatorClassName={cn(
        defaultTabsIndicatorVariants({
          size,
          orientation,
        })
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  const { orientation, size } = useTabsContext()

  return (
    <TabCoreContent
      className={cn(
        defaultTabsContentVariants({
          size,
          orientation,
          className,
        })
      )}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
