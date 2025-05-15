"use client"

import { useScrollIntoView } from "@/hooks/use-scroll-into-view"
import { useWheelScroll } from "@/hooks/use-wheel-scroll"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { motion } from "motion/react"
import * as React from "react"

// Types
export type TabsContextType = {
  activeTab: string
  setActiveTab: (tabValue: string) => void
  layoutId: string
  registerTab: (tabValue: string, ref: React.RefObject<HTMLElement>) => void
  listContainerRef: React.RefObject<HTMLDivElement | null>
  size?: "sm" | "default" | "lg"
  orientation?: "horizontal" | "vertical"
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

export interface TabCoreProps
  extends Omit<React.ComponentProps<typeof TabsPrimitive.Root>, "orientation"> {
  setActiveTab?: (tabValue: string) => void
  orientation?: "horizontal" | "vertical"
  size?: "sm" | "default" | "lg"
}

export function TabCore({
  value,
  defaultValue = "",
  onValueChange,
  setActiveTab: externalSetActiveTab,
  children,
  orientation = "horizontal",
  size = "default",
  ...props
}: TabCoreProps) {
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

  React.useEffect(() => {
    if (isControlled && value !== internalActiveTab) {
      setInternalActiveTab(value!)
    }
  }, [value, isControlled, internalActiveTab])

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
      orientation,
      size,
    }),
    [activeTab, handleSetActiveTab, layoutId, registerTab, orientation, size]
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
          data-orientation={orientation}
          data-size={size}
          {...props}
        >
          {children}
        </TabsPrimitive.Root>
      </motion.div>
    </TabsContext.Provider>
  )
}

export function TabCoreList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const { listContainerRef, orientation } = useTabsContext()

  const { handleWheel } = useWheelScroll({
    orientation: orientation || "horizontal",
    containerRef: listContainerRef,
    speed: 1,
  })

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={className}
      ref={listContainerRef as React.RefObject<HTMLDivElement>}
      onWheel={handleWheel}
      data-orientation={orientation}
      {...props}
    />
  )
}

export function TabCoreTrigger({
  className,
  value,
  children,
  indicatorClassName,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  indicatorClassName?: string
}) {
  const { activeTab, layoutId, registerTab, orientation } = useTabsContext()
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
      className={className}
      value={value}
      data-orientation={orientation}
      {...props}
    >
      {children}
      {activeTab === value && (
        <motion.div
          className={indicatorClassName}
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

export function TabCoreContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  const { orientation } = useTabsContext()

  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={className}
      data-orientation={orientation}
      {...props}
    />
  )
}
