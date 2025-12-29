"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { PopoverClose } from "@radix-ui/react-popover"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

const RESPONSIVE_BREAKPOINT = "(min-width: 640px)"

function ResponsivePopover({
  children,
  ...props
}: React.ComponentProps<typeof Popover>) {
  return (
    <Drawer {...props}>
      <Popover {...props}>{children}</Popover>
    </Drawer>
  )
}

function ResponsivePopoverTrigger({
  children,
  ...props
}: React.ComponentProps<typeof PopoverTrigger>) {
  const isDesktop = useMediaQuery(RESPONSIVE_BREAKPOINT)

  if (isDesktop) {
    return <PopoverTrigger {...props}>{children}</PopoverTrigger>
  }

  return <DrawerTrigger {...props}>{children}</DrawerTrigger>
}

function ResponsivePopoverContent({
  children,
  className,
  ...props
}: React.ComponentProps<typeof PopoverContent>) {
  const isDesktop = useMediaQuery(RESPONSIVE_BREAKPOINT)

  if (isDesktop) {
    return (
      <PopoverContent className={className} {...props}>
        {children}
      </PopoverContent>
    )
  }

  return (
    <DrawerContent className={cn(className, !isDesktop && "w-full")} {...props}>
      {children}
    </DrawerContent>
  )
}

function ResponsivePopoverInner({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("space-y-4 p-4 pt-0 sm:p-0", className)} {...props} />
  )
}

function ResponsivePopoverTitle({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div" | typeof DrawerTitle>) {
  const isDesktop = useMediaQuery(RESPONSIVE_BREAKPOINT)
  if (isDesktop) {
    return (
      <div
        className={cn("text-foreground font-semibold", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
  return (
    <DrawerTitle className={className} {...props}>
      {children}
    </DrawerTitle>
  )
}

function ResponsivePopoverHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const isDesktop = useMediaQuery(RESPONSIVE_BREAKPOINT)
  if (isDesktop) {
    return <div className={cn("mb-4 space-y-1", className)} {...props} />
  }
  return <DrawerHeader className={className} {...props} />
}

function ResponsivePopoverClose({
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverClose | typeof DrawerClose>) {
  const isDesktop = useMediaQuery(RESPONSIVE_BREAKPOINT)
  if (isDesktop) {
    return <PopoverClose {...props} />
  }
  return <DrawerClose {...props} />
}

export {
  ResponsivePopover,
  ResponsivePopoverClose,
  ResponsivePopoverContent,
  ResponsivePopoverHeader,
  ResponsivePopoverInner,
  ResponsivePopoverTitle,
  ResponsivePopoverTrigger,
}
