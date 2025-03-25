"use client"

import { useScrollIntoView } from "@/hooks/use-scroll-into-view"
import { useWheelScroll } from "@/hooks/use-wheel-scroll"
import { cn } from "@/lib/utils"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "motion/react"
import * as React from "react"

// Define variants using cva
const tabsListVariants = cva(
  "relative z-10 inline-flex max-w-full items-stretch justify-start overflow-auto overscroll-contain text-muted-foreground",
  {
    variants: {
      variant: {
        default: "rounded-lg bg-muted p-1",
        line: "flex gap-4 !rounded-none border-b",
      },
      size: {
        sm: "min-h-8 gap-1",
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
      variant: "default",
      size: "default",
    },

    compoundVariants: [
      {
        variant: "default",
        size: "sm",
        className: "p-[2px]",
      },
      {
        variant: "line",
        orientation: "vertical",
        className: "gap-4 !border-b-0 !border-r",
      },
    ],
  }
)

const tabsTriggerVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "px-3 data-[state=active]:text-foreground",
        line: "border-b-2 border-transparent px-2 data-[state=active]:text-foreground",
      },
      size: {
        sm: "gap-1 py-0.5 text-xs",
        default: "gap-1.5 py-1 text-sm",
        lg: "gap-2 py-1.5",
      },
      orientation: {
        horizontal: "",
        vertical: "w-full justify-start text-left",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      orientation: "horizontal",
    },
    compoundVariants: [
      {
        variant: "line",
        size: "default",
        orientation: "horizontal",
        className: "pb-1.5 pt-2",
      },
      {
        variant: "line",
        size: "sm",
        orientation: "horizontal",
        className: "b-1 min-w-8 pt-1.5",
      },
      {
        variant: "line",
        size: "lg",
        orientation: "horizontal",
        className: "pb-2 pt-2.5",
      },
      {
        variant: "default",
        size: "default",
        className: "rounded-md",
      },
      {
        variant: "default",
        size: "sm",
        className: "rounded-sm",
      },
      {
        variant: "default",
        size: "lg",
        className: "rounded-md",
      },
      {
        variant: "line",
        orientation: "vertical",
        className: "border-b-0 border-r-2 pb-0 pr-3 pt-0",
      },
    ],
  }
)

const tabsIndicatorVariants = cva("absolute left-0 right-0 -z-[1]", {
  variants: {
    variant: {
      default: "top-0 h-full w-full rounded-md bg-background shadow",
      line: "-bottom-0.5 h-0.5 w-full rounded-none bg-primary",
    },
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
    variant: "default",
    size: "default",
    orientation: "horizontal",
  },
  compoundVariants: [
    {
      variant: "line",
      orientation: "vertical",
      className: "-bottom-auto -right-0.5 bottom-0 left-auto h-full w-0.5",
    },
  ],
})

const tabsContentVariants = cva(
  "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "",
        line: "",
      },
      size: {
        sm: "mt-1.5",
        default: "mt-2",
        lg: "mt-2.5",
      },
      orientation: {
        horizontal: "",
        vertical: "ml-4 mt-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      orientation: "horizontal",
    },
  }
)

// Types
type TabsContextType = {
  activeTab: string
  setActiveTab: (tabValue: string) => void
  layoutId: string
  registerTab: (tabValue: string, ref: React.RefObject<HTMLElement>) => void
  listContainerRef: React.RefObject<HTMLDivElement | null>
  variant: VariantProps<typeof tabsListVariants>["variant"]
  size: VariantProps<typeof tabsListVariants>["size"]
  orientation: VariantProps<typeof tabsListVariants>["orientation"]
}

// Context
const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

export const useTabsContext = () => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("useTabsContext must be used within a TabsProvider")
  }
  return context
}

export interface TabsProps
  extends Omit<React.ComponentProps<typeof TabsPrimitive.Root>, "orientation">,
    VariantProps<typeof tabsListVariants> {
  setActiveTab?: (tabValue: string) => void
}

function Tabs({
  value,
  defaultValue = "",
  onValueChange,
  setActiveTab: externalSetActiveTab,
  children,
  variant = "default",
  size = "default",
  orientation = "horizontal",
  ...props
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] =
    React.useState<string>(defaultValue)
  const isControlled = value !== undefined
  const activeTab = isControlled ? value! : internalActiveTab

  const uniqueId = React.useId()
  const layoutId = `tabs-anim-${uniqueId}`
  const tabRefs = React.useRef<Map<string, React.RefObject<HTMLElement>>>(
    new Map()
  )
  const listContainerRef = React.useRef<HTMLDivElement>(null)
  const scrollIntoView = useScrollIntoView()

  const registerTab = React.useCallback(
    (tabValue: string, ref: React.RefObject<HTMLElement>) => {
      tabRefs.current.set(tabValue, ref)
    },
    []
  )

  // Sync controlled state with internal state
  React.useEffect(() => {
    if (isControlled && value !== internalActiveTab) {
      setInternalActiveTab(value!)
    }
  }, [value, isControlled, internalActiveTab])

  // Handle tab scrolling when active tab changes using the new hook
  React.useEffect(() => {
    const activeTabRef = tabRefs.current.get(activeTab)
    if (activeTabRef?.current && listContainerRef.current) {
      scrollIntoView(activeTabRef.current, {
        position: "center",
        container: listContainerRef.current,
        smooth: true,
        axis: orientation === "horizontal" ? "x" : "y",
        onlyIfNeeded: false,
      })
    }
  }, [activeTab, orientation, scrollIntoView])

  const handleSetActiveTab = React.useCallback(
    (tab: string) => {
      if (!isControlled) {
        setInternalActiveTab(tab)
      }
      externalSetActiveTab?.(tab)
    },
    [isControlled, externalSetActiveTab]
  )

  const contextValue = React.useMemo(
    () => ({
      activeTab,
      setActiveTab: handleSetActiveTab,
      layoutId,
      registerTab,
      listContainerRef,
      variant,
      size,
      orientation,
    }),
    [
      activeTab,
      handleSetActiveTab,
      layoutId,
      registerTab,
      variant,
      size,
      orientation,
    ]
  )

  return (
    <TabsContext.Provider value={contextValue}>
      <motion.div layout layoutRoot>
        <TabsPrimitive.Root
          data-slot="tabs"
          value={activeTab}
          onValueChange={(tab) => {
            handleSetActiveTab(tab)
            onValueChange?.(tab)
          }}
          data-variant={variant}
          data-size={size}
          data-orientation={orientation}
          {...props}
        >
          {children}
        </TabsPrimitive.Root>
      </motion.div>
    </TabsContext.Provider>
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const { listContainerRef, variant, size, orientation } = useTabsContext()

  const { handleWheel } = useWheelScroll({
    orientation,
    containerRef: listContainerRef,
    speed: 1,
  })

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        tabsListVariants({ variant, size, orientation, className })
      )}
      ref={listContainerRef as React.RefObject<HTMLDivElement>}
      onWheel={handleWheel}
      data-variant={variant}
      data-size={size}
      data-orientation={orientation}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { activeTab, layoutId, registerTab, variant, size, orientation } =
    useTabsContext()
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (value) {
      registerTab(value, triggerRef as React.RefObject<HTMLElement>)
    }
  }, [value, registerTab])

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      ref={triggerRef}
      className={cn(
        tabsTriggerVariants({ variant, size, orientation, className })
      )}
      value={value}
      data-variant={variant}
      data-size={size}
      data-orientation={orientation}
      {...props}
    >
      {children}
      {activeTab === value && (
        <motion.div
          className={cn(tabsIndicatorVariants({ variant, size, orientation }))}
          layoutId={layoutId}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        />
      )}
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  const { variant, size, orientation } = useTabsContext()

  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        tabsContentVariants({ variant, size, orientation, className })
      )}
      data-variant={variant}
      data-size={size}
      data-orientation={orientation}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
