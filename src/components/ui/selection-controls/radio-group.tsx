"use client"

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

type RadioGroupContextType = {
  layoutId: string
}

export const RadioGroupContext = React.createContext<
  RadioGroupContextType | undefined
>(undefined)

function RadioGroup({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  const uniqueId = React.useId()
  const layoutId = `radio-group-form.tsx-anim-${uniqueId}`
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-2", className)}
      {...props}
    >
      <RadioGroupContext.Provider value={{ layoutId }}>
        {children}
      </RadioGroupContext.Provider>
    </RadioGroupPrimitive.Root>
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow-sm focus:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="size-3.5! fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
