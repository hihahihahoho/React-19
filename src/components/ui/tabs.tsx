"use client";

import { cn } from "@/lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import * as React from "react";

type TabsContextType = {
  activeTab: string;
  setActiveTab: (tabValue: string) => void;
  layoutId: string;
  registerTab: (tabValue: string, ref: React.RefObject<HTMLElement>) => void;
  listContainerRef: React.RefObject<HTMLDivElement | null>;
};

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("useTabsContext must be used within a TabsProvider");
  }
  return context;
};

function TabsRoot({
  onValueChange,
  children,
  setActiveTab,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & {
  setActiveTab?: (tabValue: string) => void;
}) {
  const { setActiveTab: setActive } = useTabsContext();

  const handleTabChange = (newActiveTab: string) => {
    setActive(newActiveTab);
    setActiveTab?.(newActiveTab);
    onValueChange?.(newActiveTab);
  };

  return (
    <TabsPrimitive.Root
      data-slot="tabs-root"
      onValueChange={handleTabChange}
      {...props}
    >
      {children}
    </TabsPrimitive.Root>
  );
}

function Tabs({
  value,
  defaultValue,
  onValueChange,
  setActiveTab,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & {
  setActiveTab?: (tabValue: string) => void;
}) {
  const [internalActiveTab, setInternalActiveTab] = React.useState<string>(
    defaultValue || ""
  );

  const isControlled = value !== undefined;
  const activeTab = isControlled ? value! : internalActiveTab;
  const uniqueId = React.useId();
  const layoutId = `tabs-anim-${uniqueId}`;
  const tabRefs = React.useRef<Map<string, React.RefObject<HTMLElement>>>(
    new Map()
  );

  const registerTab = (tabValue: string, ref: React.RefObject<HTMLElement>) => {
    tabRefs.current.set(tabValue, ref);
  };

  const listContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isControlled && value !== internalActiveTab) {
      setInternalActiveTab(value!);
    }
  }, [value, isControlled, internalActiveTab]);

  React.useEffect(() => {
    const activeTabRef = tabRefs.current.get(activeTab);
    const listRef = listContainerRef.current;
    if (activeTabRef?.current && listRef) {
      const tabElement = activeTabRef.current;
      const listElement = listRef;

      const tabRect = tabElement.getBoundingClientRect();
      const listRect = listElement.getBoundingClientRect();

      const tabCenter = tabRect.left + tabRect.width / 2;
      const listCenter = listRect.left + listRect.width / 2;
      const scrollOffset = tabCenter - listCenter;

      const newScrollLeft = listElement.scrollLeft + scrollOffset;

      listElement.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeTab]);

  const handleSetActiveTab = (tab: string) => {
    if (!isControlled) {
      setInternalActiveTab(tab);
    }
    setActiveTab?.(tab);
  };

  return (
    <TabsContext.Provider
      value={{
        activeTab,
        setActiveTab: handleSetActiveTab,
        layoutId,
        registerTab,
        listContainerRef,
      }}
    >
      <motion.div layout layoutRoot>
        <TabsRoot
          data-slot="tabs"
          value={activeTab}
          onValueChange={(tab) => {
            handleSetActiveTab(tab);
            if (onValueChange) {
              onValueChange(tab);
            }
          }}
          {...props}
        >
          {children}
        </TabsRoot>
      </motion.div>
    </TabsContext.Provider>
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const { listContainerRef } = useTabsContext();

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!listContainerRef.current || event.deltaY === 0 || event.deltaX !== 0) {
      return;
    }
    event.stopPropagation();
    listContainerRef.current?.scrollBy({
      left: event.deltaY,
      behavior: "smooth",
    });
  };

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-9 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground overflow-auto no-scrollbar max-w-full overscroll-contain",
        className
      )}
      ref={listContainerRef as React.RefObject<HTMLDivElement>}
      onWheel={handleWheel}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  value,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { activeTab, layoutId, registerTab } = useTabsContext();
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (value) {
      registerTab(value, triggerRef as React.RefObject<HTMLElement>);
    }
  }, [value, registerTab]);

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      ref={triggerRef}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground relative",
        className
      )}
      value={value}
      {...props}
    >
      <div className="z-10">{props.children}</div>
      {activeTab === value && (
        <motion.div
          className="absolute top-0 z-0 w-full h-full rounded-md shadow bg-background"
          layoutId={layoutId}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        />
      )}
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
