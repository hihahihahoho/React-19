"use client"

import { useLocaleDateConfig } from "@/hooks/use-date-locale-config"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ArrowRightIcon, CalendarDays } from "lucide-react"
import * as React from "react"
import {
  CalendarRange,
  CalendarRangeProps,
  DateRange,
} from "../calendar/calendar-range"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../drawer"
import {
  FormComposition,
  FormCompositionProps,
  FormControlButton,
} from "../form/form"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"
import { Separator } from "../separator"

export type OnValueChangeDateRangePicker = DateRange | undefined

export interface DateRangePickerProps
  extends Omit<
    React.ComponentProps<typeof FormControlButton>,
    "placeholder" | "defaultValue" | "value"
  > {
  placeholder?: React.ReactNode
  placeholderColor?: string
  disabled?: boolean
  defaultValue?: DateRange
  value?: DateRange | null
  onValueChange?: (value: OnValueChangeDateRangePicker) => void
  formComposition?: FormCompositionProps
  calendarProps?: CalendarRangeProps
  locale?: string
}

function DateRangePicker({
  placeholder,
  placeholderColor = "text-muted-foreground",
  disabled = false,
  defaultValue,
  value,
  onValueChange,
  formComposition,
  className,
  calendarProps,
  locale,
  ...props
}: DateRangePickerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [open, setOpen] = React.useState(false)

  const localeConfig = useLocaleDateConfig(locale)

  const [internalRange, setInternalRange] = React.useState<
    DateRange | undefined
  >(defaultValue)

  const currentRange = value ?? internalRange

  const handleSelect = React.useCallback(
    (range: DateRange | undefined) => {
      setInternalRange(range)
      onValueChange?.(range)
    },
    [onValueChange]
  )

  const handleClear = React.useCallback(() => {
    setInternalRange(undefined)
    onValueChange?.(undefined)
    formComposition?.onClear?.()
  }, [onValueChange, formComposition])

  const fromFormatted =
    value === null
      ? undefined
      : currentRange?.from
        ? format(currentRange.from, localeConfig.format)
        : ""
  const toFormatted =
    value === null
      ? undefined
      : currentRange?.to
        ? format(currentRange.to, localeConfig.format)
        : ""
  const displayRange =
    fromFormatted || toFormatted ? (
      <>
        {fromFormatted}
        {fromFormatted && toFormatted ? (
          <ArrowRightIcon className="size-4 text-muted-foreground" />
        ) : (
          ""
        )}
        {toFormatted}
      </>
    ) : (
      ""
    )

  const hasValue = Boolean(fromFormatted || toFormatted)
  const triggerContent = (
    <FormComposition
      data-slot="date-range-picker"
      {...formComposition}
      asChild
      clearWhenNotFocus
      disabled={disabled}
      hasValue={hasValue}
      onClear={handleClear}
      iconLeft={<CalendarDays />}
      className={cn("cursor-pointer", formComposition?.className)}
    >
      <FormControlButton disabled={disabled} {...props}>
        <div className={cn("flex h-full flex-1 items-center", className)}>
          {hasValue ? (
            <span className="flex items-center gap-1">{displayRange}</span>
          ) : (
            <span className={cn(placeholderColor)}>
              {placeholder || (
                <div className="flex items-center gap-1">
                  {localeConfig.format.toLowerCase()}
                  <ArrowRightIcon className="size-4" />
                  {localeConfig.format.toLowerCase()}
                </div>
              )}
            </span>
          )}
        </div>
      </FormControlButton>
    </FormComposition>
  )

  const calendarRangeContent = (
    <CalendarRange
      setOpen={setOpen}
      selectedRange={currentRange}
      onValueChange={
        !calendarProps?.showConfirmButton
          ? handleSelect
          : calendarProps?.onValueChange
      }
      onConfirm={
        calendarProps?.showConfirmButton
          ? handleSelect
          : calendarProps?.onConfirm
      }
      localeString={localeConfig.locale}
      {...calendarProps}
    />
  )

  return (
    <>
      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{triggerContent}</PopoverTrigger>
          <PopoverContent
            align="start"
            className="p-0"
            style={{ width: "auto" }}
          >
            {calendarRangeContent}
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>{triggerContent}</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              {formComposition?.label && (
                <DrawerTitle>{formComposition?.label}</DrawerTitle>
              )}
            </DrawerHeader>
            <Separator />
            {calendarRangeContent}
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}

export { DateRangePicker }
