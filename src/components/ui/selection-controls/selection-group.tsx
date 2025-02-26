// SelectionGroup.tsx
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
import { FormControl, FormItem, FormLabel } from "../form/form";

// Define the variant styles using cva
const selectionGroupVariants = cva(
  "font-normal group-has-[input:disabled]/group-checkbox:cursor-not-allowed group-has-[input:disabled]/group-checkbox:opacity-70 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 group-has-[button:disabled]/group-checkbox:opacity-70",
  {
    variants: {
      variant: {
        default: "pl-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Interface for SelectionGroup props
export interface SelectionGroupProps
  extends VariantProps<typeof selectionGroupVariants>,
    React.HTMLAttributes<HTMLDivElement> {
  control?: React.ReactNode;
}

// ForwardRef for the SelectionGroup component
const SelectionGroup = React.forwardRef<
  React.ElementRef<typeof Slot>,
  SelectionGroupProps & React.ComponentPropsWithoutRef<typeof Slot>
>(({ control, variant, children, className, ...props }, ref) => {
  return (
    <FormItem
      className={cn("flex flex-row text-sm group/group-checkbox")}
      {...props}
    >
      <div>
        <div className="flex items-center">
          <span aria-hidden="true" className="w-0">
            &nbsp;
          </span>
          <FormControl>
            <Slot className={cn("align-middle")} ref={ref}>
              {control}
            </Slot>
          </FormControl>
        </div>
      </div>

      <FormLabel className={cn(selectionGroupVariants({ variant }), className)}>
        {children}
      </FormLabel>
    </FormItem>
  );
});

// Set display name for better debugging
SelectionGroup.displayName = "SelectionGroup";

export { SelectionGroup };
