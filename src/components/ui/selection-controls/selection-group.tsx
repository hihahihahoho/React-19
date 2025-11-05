// SelectionGroup.tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, VariantProps } from "class-variance-authority"
import { FormControl } from "../form/form"

// Define the variant styles using cva
const selectionGroupVariants = cva(
  "group/group-selection group/group-selection flex flex-row gap-2 text-sm has-disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "",
        card: "ring-border has-data-[state=checked]:bg-primary/3 has-data-[state=checked]:ring-primary rounded-xl p-4 ring-1 has-data-[state=checked]:ring-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Interface for SelectionGroup props
export interface SelectionGroupProps
  extends VariantProps<typeof selectionGroupVariants>,
    React.ComponentProps<"label"> {
  control?: React.ReactNode
}

function SelectionGroup({
  control,
  variant,
  children,
  className,
  ...props
}: SelectionGroupProps) {
  return (
    <label
      data-slot="selection-control"
      className={cn(selectionGroupVariants({ variant }), className)}
      {...props}
    >
      <div>
        <div className="flex items-center">
          <span aria-hidden="true" className="w-0 select-none">
            &nbsp;
          </span>
          <FormControl>
            <Slot className={cn("align-middle")}>{control}</Slot>
          </FormControl>
        </div>
      </div>
      <div className="group-has-[button:disabled]/group-selection:opacity-60 group-has-[input:disabled]/group-selection:cursor-not-allowed group-has-[input:disabled]/group-selection:opacity-60 peer-disabled:cursor-not-allowed peer-disabled:opacity-60">
        {children}
      </div>
    </label>
  )
}

export { SelectionGroup }
