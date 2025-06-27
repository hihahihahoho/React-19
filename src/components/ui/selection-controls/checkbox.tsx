"use client"

import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  isIndeterminate,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  isIndeterminate?: boolean
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer focus-visible:ring-ring data-[state=checked]:text-primary-foreground data-[state=unchecked]:border-secondary size-4 shrink-0 shadow-sm focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:border-1",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center")}
      >
        {isIndeterminate ? (
          <>
            <Minus className="bg-base-primary size-4 rounded-xs text-white" />
          </>
        ) : (
          <>
            <Check className="bg-base-primary size-4 rounded-xs text-white" />
          </>
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
