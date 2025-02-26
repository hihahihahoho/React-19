"use client";

import { cn } from "@/lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react"; // Corrected import
import * as React from "react";

type TabsContextType = {
  activeTab: string;
  setActiveTab: (tabValue: string) => void;
  layoutId: string;
  registerTab: (tabValue: string, ref: React.RefObject<HTMLElement>) => void;
  listContainerRef: React.RefObject<HTMLDivElement>;
};

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("useTabsContext must be used within a TabsProvider");
  }
  return context;
};

// --- Tabs Component ---
const TabsRoot = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
    setActiveTab?: (tabValue: string) => void;
  }
>(({ onValueChange, children, setActiveTab, ...props }, ref) => {
  const { setActiveTab: setActive } = useTabsContext();

  const handleTabChange = (newActiveTab: string) => {
    setActive(newActiveTab);
    setActiveTab?.(newActiveTab);
    onValueChange?.(newActiveTab);
  };

  return (
    <TabsPrimitive.Root ref={ref} onValueChange={handleTabChange} {...props}>
      {children}
    </TabsPrimitive.Root>
  );
});
TabsRoot.displayName = "TabsRoot"; // For debugging

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
    setActiveTab?: (tabValue: string) => void;
  }
>(
  (
    { value, defaultValue, onValueChange, setActiveTab, children, ...props },
    ref
  ) => {
    const [internalActiveTab, setInternalActiveTab] = React.useState<string>(
      defaultValue || ""
    );

    // Determine if the component is controlled
    const isControlled = value !== undefined;

    // Active tab is either controlled or internal state
    const activeTab = isControlled ? value! : internalActiveTab;

    // Generate a unique ID for layoutId using React.useId
    const uniqueId = React.useId();
    const layoutId = `tabs-anim-${uniqueId}`;

    // Refs map
    const tabRefs = React.useRef<Map<string, React.RefObject<HTMLElement>>>(
      new Map()
    );

    // Function to register tab refs
    const registerTab = (
      tabValue: string,
      ref: React.RefObject<HTMLElement>
    ) => {
      tabRefs.current.set(tabValue, ref);
    };

    // Ref for the TabsList container
    const listContainerRef = React.useRef<HTMLDivElement>(null);

    // Sync internal state with value prop if controlled
    React.useEffect(() => {
      if (isControlled && value !== internalActiveTab) {
        setInternalActiveTab(value!);
      }
    }, [value, isControlled, internalActiveTab]);

    // Scroll active tab into view when it changes
    React.useEffect(() => {
      const activeTabRef = tabRefs.current.get(activeTab);
      const listRef = listContainerRef.current;
      if (activeTabRef?.current && listRef) {
        const tabElement = activeTabRef.current;
        const listElement = listRef;

        const tabRect = tabElement.getBoundingClientRect();
        const listRect = listElement.getBoundingClientRect();

        // Calculate the difference between tab's center and container's center
        const tabCenter = tabRect.left + tabRect.width / 2;
        const listCenter = listRect.left + listRect.width / 2;
        const scrollOffset = tabCenter - listCenter;

        // Calculate new scrollLeft
        const newScrollLeft = listElement.scrollLeft + scrollOffset;

        // Scroll the container smoothly
        listElement.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        });
      }
    }, [activeTab]);

    // Function to handle tab changes
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
          listContainerRef, // Provide the list container ref
        }}
      >
        <motion.div layout layoutRoot>
          <TabsRoot
            ref={ref}
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
);
Tabs.displayName = "Tabs"; // For debugging

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const { listContainerRef } = useTabsContext();
  React.useImperativeHandle(ref, () => listContainerRef.current!);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!listContainerRef.current || event.deltaY === 0 || event.deltaX !== 0) {
      return;
    }
    event.stopPropagation();
    listContainerRef.current?.scrollBy({
      left: event.deltaY, // Scroll by the amount of vertical wheel movement
      behavior: "smooth", // Optional: smooth scrolling
    });
  };

  React.useImperativeHandle(ref, () => listContainerRef.current!);

  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex h-9 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground overflow-auto no-scrollbar max-w-full overscroll-contain",
        className
      )}
      ref={listContainerRef}
      onWheel={handleWheel}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, value, ...props }, ref) => {
  const { activeTab, layoutId, registerTab } = useTabsContext();
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Expose the triggerRef via forwarded ref
  React.useImperativeHandle(ref, () => triggerRef.current!);

  // Register the tab ref on mount
  React.useEffect(() => {
    if (value) {
      registerTab(value, triggerRef);
    }
  }, [value, registerTab]);

  return (
    <TabsPrimitive.Trigger
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
          className="bg-background absolute w-full h-full top-0 z-0 rounded-md shadow"
          layoutId={layoutId} // Use the unique layoutId
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        />
      )}
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
