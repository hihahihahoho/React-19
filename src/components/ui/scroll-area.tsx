"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as React from "react";

import { useMergedRef } from "@/hooks/use-merge-ref";
import useScrollPosition from "@/hooks/use-scroll-position";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

const ScrollAreaTable = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    viewportRef: React.RefObject<HTMLDivElement>;
    srcollBarPortalRef: React.RefObject<HTMLDivElement>;
    scrollbarClassName?: string;
  }
>(
  (
    {
      className,
      children,
      viewportRef,
      srcollBarPortalRef,
      scrollbarClassName,
      ...props
    },
    ref
  ) => {
    const internalViewportRef = React.useRef<HTMLDivElement>(null);
    const { isReachLeft, isReachRight } =
      useScrollPosition(internalViewportRef);
    const mergeRef = useMergedRef(internalViewportRef, viewportRef);

    return (
      <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn(
          "table-wrapper relative overflow-hidden",
          {
            "is-reach-left": !isReachLeft,
            "is-reach-right": !isReachRight,
          },
          className
        )}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          ref={mergeRef}
          className="h-full w-full rounded-[inherit]"
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        {srcollBarPortalRef?.current &&
          createPortal(
            <ScrollBar
              orientation="horizontal"
              className={cn("!sticky empty:hidden", scrollbarClassName)}
            />,
            srcollBarPortalRef?.current
          )}
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    );
  }
);

ScrollAreaTable.displayName = "ScrollAreaTable";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollAreaTable, ScrollBar };
