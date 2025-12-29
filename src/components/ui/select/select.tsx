"use client"

import { getNodeText } from "@/lib/get-node-text"
import { cn } from "@/lib/utils"
import { lowercaseFirstChar } from "@/lib/utils-plus"
import { ChevronDown } from "lucide-react"
import React, { useCallback, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar"
import {
  FormComposition,
  FormCompositionProps,
  FormControlButton,
} from "../form/form"
import {
  ResponsivePopover,
  ResponsivePopoverContent,
  ResponsivePopoverHeader,
  ResponsivePopoverTitle,
  ResponsivePopoverTrigger,
} from "../responsive-popover"
import { flatItems, SelectCommand, SelectCommandProps } from "./select-command"
import { SelectCommandVirtualizeProps } from "./select-command-virtualize"
import { SelectGroup, SelectItems } from "./select-interface"

export type OnValueChangeSelect = string | undefined

export interface SelectProps extends React.ComponentProps<"button"> {
  placeholder?: string | React.ReactNode
  options?: SelectItems[] | SelectGroup[]
  value?: OnValueChangeSelect
  defaultValue?: OnValueChangeSelect
  disabled?: boolean
  formComposition?: FormCompositionProps

  onValueChange?: (value: OnValueChangeSelect) => void
  onFocus?: React.FocusEventHandler<HTMLButtonElement>
  onBlur?: React.FocusEventHandler<HTMLButtonElement>
  readonly?: boolean
  selectCommandProps?: SelectCommandProps &
    Partial<SelectCommandVirtualizeProps>
  customDisplayValue?: SelectItems
  virtualComponents?: React.ComponentType<SelectCommandVirtualizeProps>
}

function Select({
  placeholder,
  options,
  value,
  defaultValue,
  disabled = false,
  formComposition,
  onValueChange,
  onFocus,
  onBlur,
  readonly,
  selectCommandProps,
  customDisplayValue,
  virtualComponents,
  ...props
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [internalValue, setInternalValue] =
    useState<OnValueChangeSelect>(defaultValue)

  const flattenItems = flatItems(options)

  const handleValueChange = useCallback(
    (newValue: OnValueChangeSelect) => {
      setInternalValue(newValue)
      onValueChange?.(newValue)
    },
    [onValueChange]
  )

  const handleClear = useCallback(() => {
    handleValueChange(undefined)
    formComposition?.onClear?.()
  }, [formComposition, handleValueChange])

  const currentValue = value !== undefined ? value : internalValue
  const hasValue = Boolean(currentValue)
  const selectedOption =
    customDisplayValue ||
    flattenItems.find((item) => item.value === currentValue)

  const SelectComponentToUse = virtualComponents || SelectCommand
  const label = formComposition?.label || placeholder || "Chọn"

  return (
    <ResponsivePopover open={open} onOpenChange={setOpen}>
      <ResponsivePopoverTrigger asChild>
        <FormComposition
          clearWhenNotFocus={true}
          inputClear={false}
          iconRight={<ChevronDown className="opacity-50" />}
          {...formComposition}
          asChild
          hasValue={hasValue}
          className={cn("cursor-pointer", formComposition?.className)}
          onClear={handleClear}
          disabled={disabled}
          focusWithin={false}
          readonly={readonly}
          isFocused={isFocused}
        >
          <FormControlButton
            data-slot="select"
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true)
              onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              onBlur?.(e)
            }}
            {...props}
          >
            <div className={cn("flex h-full flex-1 items-center")}>
              <div className="line-clamp-1">
                {selectedOption?.label || value || selectedOption?.value ? (
                  <div className="flex items-center gap-2 [&_svg]:size-4">
                    {selectedOption?.icon &&
                      (typeof selectedOption.icon === "string" ? (
                        <Avatar size={"xs"}>
                          <AvatarImage src={selectedOption.icon} />
                          <AvatarFallback>
                            {(selectedOption.value || "").substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        selectedOption.icon
                      ))}
                    <span className="line-clamp-1">
                      {selectedOption?.label || value || selectedOption?.value}
                    </span>
                  </div>
                ) : (
                  <span
                    className={cn(!selectedOption && "text-muted-foreground")}
                  >
                    {placeholder ||
                      "Chọn " +
                        lowercaseFirstChar(
                          getNodeText(formComposition?.label) || ""
                        )}
                  </span>
                )}
              </div>
            </div>
          </FormControlButton>
        </FormComposition>
      </ResponsivePopoverTrigger>
      <ResponsivePopoverContent
        data-slot="select-popover-content"
        align="center"
        className="popover-content-width-full p-0"
        onWheel={(e) => e.stopPropagation()}
      >
        <ResponsivePopoverHeader className="border-b sm:hidden">
          {label && <ResponsivePopoverTitle>{label}</ResponsivePopoverTitle>}
        </ResponsivePopoverHeader>
        <SelectComponentToUse
          {...selectCommandProps}
          artificialFocus={true}
          items={options}
          selected={[currentValue || ""]}
          setSelected={(values) => handleValueChange(values[0])}
          onSelect={() => {
            setOpen(false)
          }}
        />
      </ResponsivePopoverContent>
    </ResponsivePopover>
  )
}

export { Select }
