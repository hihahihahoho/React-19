import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { PopoverContentProps } from "@radix-ui/react-popover";
import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../drawer";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

interface SelectPopoverProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  children: React.ReactNode;
  triggerContent: React.ReactNode;
  popoverWidthFull?: boolean;
  popoverContentProps?: PopoverContentProps;
  label?: React.ReactNode;
}

function SelectPopover({
  open,
  setOpen,
  children,
  triggerContent,
  label,
  popoverWidthFull = true,
  popoverContentProps,
}: SelectPopoverProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{triggerContent}</PopoverTrigger>
          <PopoverContent
            data-slot="select-popover-content"
            align="start"
            className={cn(
              "p-0",
              popoverWidthFull && "popover-content-width-full"
            )}
            onWheel={(e) => e.stopPropagation()}
            {...popoverContentProps}
          >
            {children}
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>{triggerContent}</DrawerTrigger>
          <DrawerContent data-slot="select-popover-drawer">
            <DrawerHeader>
              {label && <DrawerTitle>{label}</DrawerTitle>}
            </DrawerHeader>
            <div className="border-t">{children}</div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

export { SelectPopover };
