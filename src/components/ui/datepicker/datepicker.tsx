"use client"

import { useLocaleDateConfig } from "@/hooks/use-date-locale-config"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { Measurable } from "@radix-ui/rect"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"
import { useCallback, useRef, useState } from "react"
import { Button } from "../button"
import { Calendar } from "../calendar/calendar"
import {
  DateTimeInput,
  DateTimeInputHandle,
} from "../date-time-input/date-time-input"
import { DateGroup } from "../date-time-input/date-time-input-group"
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
  FormControl,
  FormControlButton,
} from "../form/form"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "../popover"

export type OnValueChangeDatePicker = Date | undefined

export interface DatePickerProps
  extends Omit<React.ComponentProps<"button">, "value" | "defaultValue"> {
  placeholder?: React.ReactNode
  placeholderColor?: string
  defaultValue?: Date
  value?: Date | null
  formComposition?: FormCompositionProps
  editable?: boolean
  calendarProps?: React.ComponentProps<typeof Calendar>
  inputTime?: boolean
  onValueChange?: (value: OnValueChangeDatePicker) => void
  locale?: string
}

function DatePicker({
  placeholder,
  placeholderColor = "text-muted-foreground",
  value,
  className,
  disabled = false,
  formComposition,
  editable = false,
  onValueChange,
  calendarProps,
  defaultValue,
  inputTime = false,
  locale,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const DateTimeInputRef = useRef<DateTimeInputHandle>(null)
  const calendarButtonRef = useRef<HTMLButtonElement>(null)
  const localeConfig = useLocaleDateConfig(locale)
  const [isInvalid, setIsInvalid] = useState(false)

  const [internalDate, setInternalDate] = useState<OnValueChangeDatePicker>(
    (defaultValue as Date) || undefined
  )

  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleChange = useCallback(
    (value: Date | "invalid" | undefined) => {
      if (value && value !== "invalid") {
        setInternalDate(value)
        onValueChange?.(value)
        setIsInvalid(false)
      } else if (value === "invalid") {
        setInternalDate(undefined)
        onValueChange?.(undefined)
        setIsInvalid(true)
      } else {
        setIsInvalid(false)
        setInternalDate(undefined)
        onValueChange?.(undefined)
      }
    },
    [onValueChange]
  )

  const handleCalendarSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        // Preserve the time component from the existing date if available
        if (internalDate || value) {
          const currentDate = internalDate || value
          date = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            currentDate?.getHours(),
            currentDate?.getMinutes(),
            currentDate?.getSeconds(),
            currentDate?.getMilliseconds()
          )
        }

        setInternalDate(date)
        onValueChange?.(date)
      } else {
        setInternalDate(undefined)
        onValueChange?.(undefined)
      }
      setOpen(false)
    },
    [onValueChange, internalDate, value]
  )

  const handleClear = useCallback(() => {
    setInternalDate(undefined)
    setIsInvalid(false)
    onValueChange?.(undefined)
    formComposition?.onClear?.()
    DateTimeInputRef.current?.clear()
  }, [formComposition, onValueChange])

  const currentDate = value === null ? undefined : value || internalDate
  const currentInputValue = currentDate
    ? format(currentDate, localeConfig.format)
    : ""
  const hasValue = Boolean(currentDate || isInvalid)

  React.useEffect(() => {
    if (value === null && !isInvalid) {
      DateTimeInputRef.current?.clear()
    }
  }, [value, isInvalid])

  const triggerContent = (
    <FormComposition
      {...formComposition}
      asChild={!editable}
      clearWhenNotFocus={editable ? false : true}
      className={cn(!editable && "cursor-pointer", formComposition?.className)}
      hasValue={hasValue}
      onClear={handleClear}
      iconLeft={!editable && <CalendarIcon />}
      disabled={disabled}
      isFocused={isFocused}
      focusWithin={editable}
      onFormCompositionClick={() => {
        DateTimeInputRef.current?.focus()
      }}
      suffixNotFocusInput={
        editable
          ? {
              element: (
                <Button
                  ref={calendarButtonRef}
                  onClick={() => setOpen(!open)}
                  size="xs"
                  variant="outline"
                  iconOnly
                  disabled={disabled}
                  className="-mr-1"
                >
                  <CalendarIcon />
                </Button>
              ),
            }
          : undefined
      }
    >
      {editable ? (
        <div className={cn("flex h-full flex-1 items-center", className)}>
          <FormControl>
            <DateGroup onFocusWithin={handleFocus} onBlurWithin={handleBlur}>
              <DateTimeInput
                disabled={disabled}
                granularity={inputTime ? "datetime" : "date"}
                ref={DateTimeInputRef}
                value={currentDate}
                onValueChange={handleChange}
                locale={locale}
              />
            </DateGroup>
          </FormControl>
        </div>
      ) : (
        <FormControlButton disabled={disabled} {...props}>
          <div className={cn("flex h-full flex-1 items-center", className)}>
            {currentInputValue ? (
              <span>{currentInputValue}</span>
            ) : (
              <span className={cn(placeholderColor)}>
                {placeholder || localeConfig.format.toLowerCase()}
              </span>
            )}
          </div>
        </FormControlButton>
      )}
    </FormComposition>
  )

  const calendarContent = (
    <Calendar
      {...calendarProps}
      localeString={localeConfig.locale}
      defaultMonth={currentDate}
      mode="single"
      selected={currentDate}
      onSelect={handleCalendarSelect}
    />
  )

  return (
    <>
      {editable && triggerContent}
      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          {editable && calendarButtonRef && (
            <PopoverAnchor
              virtualRef={calendarButtonRef as React.RefObject<Measurable>}
            />
          )}
          <PopoverTrigger asChild>{!editable && triggerContent}</PopoverTrigger>
          <PopoverContent
            onInteractOutside={(e) => {
              if (editable) {
                if (
                  calendarButtonRef.current &&
                  calendarButtonRef.current.contains(e.target as Node)
                ) {
                  e.preventDefault()
                } else {
                  setOpen(false)
                }
              }
            }}
            align={editable ? "end" : "start"}
            className="p-0"
            style={{ width: "auto" }}
          >
            {calendarContent}
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>{!editable && triggerContent}</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              {formComposition?.label && (
                <DrawerTitle>{formComposition?.label}</DrawerTitle>
              )}
            </DrawerHeader>
            <div className="border-t">{calendarContent}</div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}

export { DatePicker }
