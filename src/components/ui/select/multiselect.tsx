import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar"
import { OverflowBadgeGroup } from "../badge/overflow-badge-group"
import {
  FormComposition,
  FormCompositionProps,
  FormControlButton,
} from "../form/form"
import { Separator } from "../separator"
import { flatItems, SelectCommand, SelectCommandProps } from "./select-command"
import { SelectGroup, SelectItems } from "./select-interface"
import { SelectPopover } from "./select-popover"

export interface MultiSelectProps
  extends Omit<React.ComponentProps<"button">, "value"> {
  placeholder?: string | React.ReactNode
  placeholderColor?: string
  options?: SelectItems[] | SelectGroup[]
  value?: string[] | null
  defaultValue?: string[]
  className?: string
  badgeClassName?: string
  badgeMeasureClassName?: string
  overflowMeasureClassName?: string
  disabled?: boolean
  formComposition?: FormCompositionProps
  maxShownBadges?: number
  minShownBadges?: number
  onValueChange?: (value: string[]) => void
  readonly?: boolean
  showClear?: boolean
  selectCommandProps?: SelectCommandProps
  customDisplayValue?: SelectItems[]
  variant?: "default" | "button"
}

function MultiSelect({
  options,
  value,
  defaultValue = [],
  disabled = false,
  formComposition,
  onValueChange,
  readonly,
  className,
  badgeMeasureClassName,
  overflowMeasureClassName,
  placeholder = "Select",
  placeholderColor = "text-muted-foreground",
  maxShownBadges,
  minShownBadges,
  selectCommandProps,
  customDisplayValue,
  variant = "default",
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
  const currentItems =
    customDisplayValue ||
    flattenItems.filter((item) => currentValue.includes(item.value))

  return (
    <SelectPopover
      open={open}
      setOpen={setOpen}
      triggerContent={
        <FormComposition
          iconRight={
            variant !== "button" ? <ChevronDown className="opacity-50" /> : null
          }
          inputClear={true}
          {...formComposition}
          prefix={
            variant === "button" ? (
              <div
                className={cn(
                  "flex items-start gap-2",
                  currentValue.length && "pr-2.5"
                )}
              >
                {formComposition?.prefix}
                {currentValue.length > 0 && (
                  <Separator
                    className="h-auto self-stretch"
                    orientation="vertical"
                  />
                )}
              </div>
            ) : (
              formComposition?.prefix
            )
          }
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
              <OverflowBadgeGroup
                items={currentItems.map((optionValue) => {
                  return {
                    key: optionValue.value,
                    content: (
                      <div className="flex max-w-[90px] items-center gap-1 overflow-hidden text-ellipsis">
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
                      </div>
                    ),
                    removeButton: !optionValue?.disabled,
                    onRemove: () => handleRemove(optionValue.value),
                    badgeProps: optionValue?.badgeProps,
                  }
                })}
                maxShownItems={maxShownBadges}
                minShowItems={minShownBadges}
                className={cn("-ml-2", className)}
                badgeMeasureClassName={badgeMeasureClassName}
                overflowMeasureClassName={overflowMeasureClassName}
                badgeProps={{
                  clearBtn: true,
                  variant: "secondary",
                  size: "md",
                }}
              />
            ) : variant !== "button" ? (
              <div
                className={cn(
                  "flex h-full w-full items-center",
                  placeholderColor
                )}
              >
                {placeholder}
              </div>
            ) : null}
          </FormControlButton>
        </FormComposition>
      }
      label={formComposition?.label || placeholder}
    >
      <SelectCommand
        {...selectCommandProps}
        items={options}
        selected={currentValue}
        setSelected={handleValueChange}
        isCheckAll={true}
        allMultiSelect={true}
      />
    </SelectPopover>
  )
}

MultiSelect.displayName = "MultiSelect"

export { MultiSelect }
