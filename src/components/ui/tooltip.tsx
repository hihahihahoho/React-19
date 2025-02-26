"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

const TooltipTriggerContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => {
    //
  },
});

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = ({
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <TooltipPrimitive.Root
      delayDuration={0}
      open={open}
      onOpenChange={setOpen}
      {...props}
    >
      <TooltipTriggerContext.Provider value={{ open, setOpen }}>
        {children}
      </TooltipTriggerContext.Provider>
    </TooltipPrimitive.Root>
  );
};

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { setOpen } = React.useContext(TooltipTriggerContext);

  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      className={cn(className)}
      onClick={(e) => {
        if (!isDesktop) {
          e.preventDefault();
          setOpen(true);
        }
      }}
      {...props}
    />
  );
});
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-w-[320px]",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
