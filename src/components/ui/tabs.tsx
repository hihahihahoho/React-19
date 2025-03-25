"use client"

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
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
    compoundVariants: [
      {
        variant: "default",
        size: "sm",
        className: "p-[2px]",
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
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
    compoundVariants: [
      {
        variant: "line",
        size: "default",
        className: "pb-1.5 pt-2",
      },
      {
        variant: "line",
        size: "sm",
        className: "b-1 min-w-8 pt-1.5",
      },
      {
        variant: "line",
        size: "lg",
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
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
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
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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

// Helper functions
const scrollTabIntoView = (
  activeTabRef: React.RefObject<HTMLElement> | undefined,
  listRef: HTMLDivElement | null
) => {
  if (!activeTabRef?.current || !listRef) return

  const tabElement = activeTabRef.current
  const listElement = listRef

  const tabRect = tabElement.getBoundingClientRect()
  const listRect = listElement.getBoundingClientRect()

  const tabCenter = tabRect.left + tabRect.width / 2
  const listCenter = listRect.left + listRect.width / 2
  const scrollOffset = tabCenter - listCenter

  listElement.scrollTo({
    left: listElement.scrollLeft + scrollOffset,
    behavior: "smooth",
  })
}

// Component implementations
export interface TabsProps
  extends React.ComponentProps<typeof TabsPrimitive.Root>,
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

  // Handle tab scrolling when active tab changes
  React.useEffect(() => {
    const activeTabRef = tabRefs.current.get(activeTab)
    scrollTabIntoView(activeTabRef, listContainerRef.current)
  }, [activeTab])

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
    }),
    [activeTab, handleSetActiveTab, layoutId, registerTab, variant, size]
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
  const { listContainerRef, variant, size } = useTabsContext()

  const handleWheel = React.useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (
        !listContainerRef.current ||
        event.deltaY === 0 ||
        event.deltaX !== 0
      ) {
        return
      }
      event.stopPropagation()
      listContainerRef.current.scrollBy({
        left: event.deltaY,
        behavior: "smooth",
      })
    },
    [listContainerRef]
  )

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants({ variant, size, className }))}
      ref={listContainerRef as React.RefObject<HTMLDivElement>}
      onWheel={handleWheel}
      data-variant={variant}
      data-size={size}
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
  const { activeTab, layoutId, registerTab, variant, size } = useTabsContext()
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
      className={cn(tabsTriggerVariants({ variant, size, className }))}
      value={value}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
      {activeTab === value && (
        <motion.div
          className={cn(tabsIndicatorVariants({ variant, size }))}
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
  const { variant, size } = useTabsContext()

  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(tabsContentVariants({ variant, size, className }))}
      data-variant={variant}
      data-size={size}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
