"use client"

import { cn } from "@/lib/utils"
import { CheckboxProps } from "@radix-ui/react-checkbox"
import * as React from "react"
import { Checkbox } from "./checkbox"

// Context for CheckboxGroup
interface CheckboxGroupContextValue {
  value: string[]
  onValueChange: (value: string[]) => void
  disabled?: boolean
}

const CheckboxGroupContext =
  React.createContext<CheckboxGroupContextValue | null>(null)

function useCheckboxGroup() {
  const context = React.useContext(CheckboxGroupContext)
  if (!context) {
    throw new Error("useCheckboxGroup must be used within a CheckboxGroup")
  }
  return context
}

// CheckboxGroup Root
export interface CheckboxGroupProps extends React.ComponentProps<"div"> {
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  disabled?: boolean
}

function CheckboxGroup({
  value: controlledValue,
  defaultValue = [],
  onValueChange,
  disabled,
  className,
  children,
  ...props
}: CheckboxGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const handleValueChange = React.useCallback(
    (newValue: string[]) => {
      if (!isControlled) {
        setUncontrolledValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [isControlled, onValueChange]
  )

  const contextValue = React.useMemo(
    () => ({
      value,
      onValueChange: handleValueChange,
      disabled,
    }),
    [value, handleValueChange, disabled]
  )

  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <div
        role="group"
        data-slot="checkbox-group"
        className={cn("grid grid-cols-2 gap-2", className)}
        {...props}
      >
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  )
}

// CheckboxGroupItem - KHÔNG wrap SelectionGroup, chỉ là Checkbox thuần
export interface CheckboxGroupItemProps extends Omit<
  CheckboxProps,
  "checked" | "onCheckedChange"
> {
  value: string
}

function CheckboxGroupItem({
  value,
  disabled: itemDisabled,
  ...props
}: CheckboxGroupItemProps) {
  const {
    value: groupValue,
    onValueChange,
    disabled: groupDisabled,
  } = useCheckboxGroup()

  const isChecked = groupValue.includes(value)
  const isDisabled = itemDisabled || groupDisabled

  const handleCheckedChange = (checked: boolean | "indeterminate") => {
    if (checked === "indeterminate") return

    const newValue = checked
      ? [...groupValue, value]
      : groupValue.filter((v) => v !== value)

    onValueChange(newValue)
  }

  return (
    <Checkbox
      {...props}
      checked={isChecked}
      onCheckedChange={handleCheckedChange}
      disabled={isDisabled}
    />
  )
}

export { CheckboxGroup, CheckboxGroupItem, useCheckboxGroup }
