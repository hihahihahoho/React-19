"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 grid place-items-center bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  innerScroll,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  innerScroll?: boolean
}) {
  const [currentScroll, setCurrentScroll] = React.useState(0)
  return (
    <DialogPortal>
      <DialogOverlay>
        <DialogPrimitive.Content
          data-slot="dialog-content"
          onScroll={(e) => {
            setCurrentScroll(e.currentTarget.scrollTop)
          }}
          className={cn(
            "margin-auto relative top-0 my-4 max-h-[calc(100vh_-_32px)] w-[calc(100%_-_32px)] max-w-xl gap-4 overflow-auto rounded-lg border bg-background p-0 shadow-lg duration-1000 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 -md:border-0",
            innerScroll
              ? "flex flex-col gap-0 overflow-hidden **:data-[slot=dialog-inner]:overflow-y-auto"
              : "overflow-auto",
            className
          )}
          {...props}
        >
          <div className="sticky top-0 z-50 w-full">
            <DialogPrimitive.Close
              className={cn(
                "absolute right-2 top-2 flex size-8 items-center justify-center rounded-full ring-offset-background backdrop-blur-sm transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                currentScroll > 20 &&
                  "bg-foreground/70 text-background shadow-xs"
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  )
}

function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "z-40 flex flex-col space-y-1.5 p-6 text-center sm:text-left",
        className
      )}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "z-40 flex flex-col-reverse gap-2 p-6 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function DialogInner({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-inner"
      className={cn("px-4 sm:px-6", className)}
      {...props}
    >
      {children}
    </div>
  )
}
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogInner,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
