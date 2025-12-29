"use client"

import { cn } from "@/lib/utils"
import { ChevronDown, X } from "lucide-react"
import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar"
import { Badge } from "../badge"
import {
  FormComposition,
  FormCompositionProps,
  FormControlButton,
} from "../form/form"
import {
  OverflowGroup,
  OverflowGroupIndicator,
  OverflowGroupItem,
  OverflowGroupProps,
} from "../overflow-group"
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

export interface MultiSelectProps extends Omit<
  React.ComponentProps<"button">,
  "value"
> {
  placeholder?: string | React.ReactNode
  placeholderColor?: string
  options?: SelectItems[] | SelectGroup[]
  value?: string[] | null
  defaultValue?: string[]
  className?: string
  badgeClassName?: string
  disabled?: boolean
  formComposition?: FormCompositionProps
  selectCommandProps?: SelectCommandProps &
    Partial<SelectCommandVirtualizeProps>
  virtualComponents?: React.ComponentType<SelectCommandVirtualizeProps>
  onValueChange?: (value: string[]) => void
  readonly?: boolean
  showClear?: boolean
  customDisplayValue?: SelectItems[]
  overflowGroupProps?: Omit<
    OverflowGroupProps<SelectItems>,
    "children" | "items"
  >
}

function MultiSelect({
  options,
  value,
  defaultValue = [],
  disabled = false,
  formComposition,
  onValueChange,
  readonly,
  placeholder = "Select",
  placeholderColor = "text-muted-foreground",
  selectCommandProps,
  customDisplayValue,
  overflowGroupProps,
  virtualComponents,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const [internalValue, setInternalValue] =
    React.useState<string[]>(defaultValue)

  const flattenItems = flatItems(options)
  const currentValue = React.useMemo(
    () => (value !== undefined ? value || [] : internalValue),
    [value, internalValue]
  )
  const hasValue = currentValue.length > 0

  const handleValueChange = React.useCallback(
    (newOptions: string[]) => {
      setInternalValue(newOptions)
      onValueChange?.(newOptions)
    },
    [onValueChange]
  )

  const handleClear = React.useCallback(() => {
    handleValueChange([])
    formComposition?.onClear?.()
  }, [formComposition, handleValueChange])

  const handleRemove = React.useCallback(
    (optionValue: string) => {
      const newOptions = currentValue.filter((v) => v !== optionValue)
      handleValueChange(newOptions)
    },
    [currentValue, handleValueChange]
  )

  const currentItems = React.useMemo(() => {
    if (customDisplayValue) return customDisplayValue

    return currentValue
      .map((value) => flattenItems.find((item) => item.value === value))
      .filter(Boolean) as SelectItems[]
  }, [customDisplayValue, currentValue, flattenItems])

  // Reverse order for overflow display (newest first)
  const displayItems = React.useMemo(() => {
    const shouldReverse = overflowGroupProps?.overflowState !== "none"
    return shouldReverse ? [...currentItems].reverse() : currentItems
  }, [currentItems, overflowGroupProps?.overflowState])

  const SelectComponentToUse = virtualComponents || SelectCommand
  const label = formComposition?.label || placeholder

  return (
    <ResponsivePopover open={open} onOpenChange={setOpen}>
      <ResponsivePopoverTrigger asChild>
        <FormComposition
          iconRight={<ChevronDown className="opacity-50" />}
          inputClear={true}
          {...formComposition}
          className={cn("cursor-pointer", formComposition?.className)}
          asChild
          clearWhenNotFocus={true}
          isMinHeight={true}
          hasValue={hasValue}
          onClear={handleClear}
          disabled={disabled}
          readonly={readonly}
          isFocused={isFocused}
          focusWithin={false}
        >
          <FormControlButton
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          >
            {currentValue.length > 0 ? (
              <OverflowGroup
                items={displayItems}
                {...overflowGroupProps}
                className={cn(
                  "-ml-2 h-full py-0.75",
                  overflowGroupProps?.className
                )}
              >
                {displayItems.map((optionValue, index) => (
                  <OverflowGroupItem
                    key={optionValue.value}
                    index={index}
                    asChild
                  >
                    <Badge
                      variant="secondary"
                      size="md"
                      clearBtn={!optionValue?.disabled}
                      {...optionValue?.badgeProps}
                      className={cn("pr-1", optionValue?.badgeProps?.className)}
                    >
                      <div className="flex max-w-22.5 items-center gap-1 overflow-hidden text-ellipsis">
                        {optionValue?.icon &&
                          (typeof optionValue.icon === "string" ? (
                            <Avatar size={"xs"}>
                              <AvatarImage src={optionValue.icon} />
                              <AvatarFallback>
                                {(optionValue.value || "").substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            optionValue.icon
                          ))}

                        <span className="overflow-hidden text-ellipsis">
                          {optionValue?.label || optionValue.value}
                        </span>
                        <div
                          className="flex aspect-square h-5 cursor-pointer items-center justify-center opacity-40 hover:opacity-100"
                          onClick={() => {
                            handleRemove(optionValue.value)
                          }}
                        >
                          <X className="x-button" />
                        </div>
                      </div>
                    </Badge>
                  </OverflowGroupItem>
                ))}
                <OverflowGroupIndicator>
                  {(count) => (
                    <Badge variant="secondary" size="md" clearBtn={false}>
                      {count > 99 ? ">99" : `+${count}`}
                    </Badge>
                  )}
                </OverflowGroupIndicator>
              </OverflowGroup>
            ) : (
              <div
                className={cn(
                  "flex h-full w-full items-center",
                  placeholderColor
                )}
              >
                {placeholder}
              </div>
            )}
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
          items={options}
          selected={currentValue}
          setSelected={handleValueChange}
          isCheckAll={true}
          allMultiSelect={true}
        />
      </ResponsivePopoverContent>
    </ResponsivePopover>
  )
}

export { MultiSelect }
