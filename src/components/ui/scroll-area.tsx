"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as React from "react";
import { createPortal } from "react-dom";

import { useMergedRef } from "@/hooks/use-merge-ref";
import useScrollPosition from "@/hooks/use-scroll-position";
import { cn } from "@/lib/utils";

interface ScrollAreaTableProps
  extends React.ComponentProps<typeof ScrollAreaPrimitive.Root> {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  srcollBarPortalRef: React.RefObject<HTMLDivElement | null>;
  scrollbarClassName?: string;
}

function ScrollAreaTable({
  className,
  children,
  viewportRef,
  srcollBarPortalRef,
  scrollbarClassName,
  ...props
}: ScrollAreaTableProps) {
  const internalViewportRef = React.useRef<HTMLDivElement>(null);
  const { isReachLeft, isReachRight } = useScrollPosition(internalViewportRef);
  const mergeRef = useMergedRef(internalViewportRef, viewportRef);

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area-table"
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

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-bar"
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
  );
}

export { ScrollArea, ScrollAreaTable, ScrollBar };
