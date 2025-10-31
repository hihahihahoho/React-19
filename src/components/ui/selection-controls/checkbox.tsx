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
        "peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground size-4 shrink-0 rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          "!text-primary-foreground flex items-center justify-center"
        )}
      >
        {isIndeterminate ? (
          <>
            <Minus className="!size-3.5" />
          </>
        ) : (
          <>
            <Check className="!size-3.5" />
          </>
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
