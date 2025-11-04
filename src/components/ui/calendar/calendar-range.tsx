"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import {
  addDays,
  differenceInDays,
  endOfDay,
  endOfMonth,
  isAfter,
  isBefore,
  isEqual,
  isValid,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns"
import { ArrowRightIcon, CalendarIcon, Check } from "lucide-react"
import * as React from "react"
import { Button } from "../button"
import { Calendar, CalendarProps } from "../calendar/calendar"
import {
  DateTimeInput,
  DateTimeInputHandle,
} from "../date-time-input/date-time-input"
import { DateGroup } from "../date-time-input/date-time-input-group"
import { FormComposition } from "../form/form"
import { Separator } from "../separator"

export interface DateRange {
  from?: Date
  to?: Date
}

export type CalendarRangeProps = CalendarProps & {
  /**
   * The currently selected date range.
   */
  selectedRange?: DateRange

  /**
   * Callback that is invoked whenever the user selects or updates the date range.
   */
  onConfirm?: (range: DateRange | undefined) => void
  onValueChange?: (value: DateRange | undefined) => void
  showConfirmButton?: boolean

  /**
   * Callback that is invoked whenever the component requests to be closed
   */
  onClose?: () => void
  setOpen?: (open: boolean) => void
  minRange?: number
  maxRange?: number
}

const CalendarRange: React.FC<CalendarRangeProps> = ({
  selectedRange,
  onConfirm,
  onValueChange,
  showConfirmButton = false,
  onClose,
  setOpen,
  minRange,
  maxRange,
  localeString,
  ...props
}) => {
  const [isSelecting, setIsSelecting] = React.useState(false)
  const [hoverDate, setHoverDate] = React.useState<Date | undefined>(undefined)
  const [month, setMonth] = React.useState<Date>(
    selectedRange?.to || new Date()
  )
  const [draftRange, setDraftRange] = React.useState<DateRange | undefined>(
    selectedRange
  )

  // Separate state for the input values, initialized from draftRange
  const [inputFrom, setInputFrom] = React.useState<Date | undefined>(
    selectedRange?.from
  )
  const [inputTo, setInputTo] = React.useState<Date | undefined>(
    selectedRange?.to
  )

  const isDesktop = useMediaQuery("(min-width: 768px)")
  const isNotSmallScreen = useMediaQuery("(min-width: 480px)")

  const DateTimeInputFromRef = React.useRef<DateTimeInputHandle>(null)
  const DateTimeInputToRef = React.useRef<DateTimeInputHandle>(null)

  // --- Preset date ranges ---
  const presetRanges = React.useMemo(() => {
    const today = new Date()
    const allRanges = {
      today: {
        label: "Hôm nay",
        from: startOfDay(today),
        to: endOfDay(today),
      },
      yesterday: {
        label: "Hôm qua",
        from: startOfDay(subDays(today, 1)),
        to: endOfDay(subDays(today, 1)),
      },
      last7Days: {
        label: "7 ngày qua",
        from: startOfDay(subDays(today, 6)),
        to: endOfDay(today),
      },
      last30Days: {
        label: "30 ngày qua",
        from: startOfDay(subDays(today, 29)),
        to: endOfDay(today),
      },
      thisMonth: {
        label: "Tháng này",
        from: startOfMonth(today),
        to: endOfDay(today),
      },
      lastMonth: {
        label: "Tháng trước",
        from: startOfMonth(subMonths(today, 1)),
        to: endOfMonth(subMonths(today, 1)),
      },
    }

    // Filter ranges based on minRange and maxRange
    return Object.fromEntries(
      Object.entries(allRanges).filter(([, range]) => {
        // Use differenceInDays from date-fns
        const daysDifference = differenceInDays(range.to, range.from) + 1

        const meetsMinRange =
          minRange === undefined || daysDifference >= minRange
        const meetsMaxRange =
          maxRange === undefined || daysDifference <= maxRange

        return meetsMinRange && meetsMaxRange
      })
    )
  }, [minRange, maxRange])

  // --- Handler for date selection ---
  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate || !isValid(newDate)) return

    if (!isSelecting) {
      const newRange = {
        from: newDate,
        to: undefined,
      }
      setDraftRange(newRange)
      onValueChange?.(newRange) // Apply onValueChange here
      setInputFrom(newDate)
      setInputTo(undefined)
      setIsSelecting(true)
    } else {
      if (draftRange?.from) {
        const firstDate = draftRange.from
        const isNewDateBefore = isBefore(newDate, firstDate)
        const [fromDate, toDate] = isNewDateBefore
          ? [newDate, firstDate]
          : [firstDate, newDate]

        const newRange = {
          from: fromDate,
          to: toDate,
        }
        setDraftRange(newRange)
        onValueChange?.(newRange) // Apply onValueChange here
        setInputFrom(fromDate)
        setInputTo(toDate)
        setIsSelecting(false)
        setHoverDate(undefined)
      }
    }
  }

  const handleDayMouseEnter = (date: Date | undefined) => {
    if (isSelecting) {
      setHoverDate(date || undefined)
    }
  }

  const handleDayMouseLeave = () => {
    if (isSelecting) {
      setHoverDate(undefined)
    }
  }

  const rangeMiddleModifier = React.useMemo(() => {
    if (!isSelecting) return undefined

    const fromDate = draftRange?.from
    const hDate = hoverDate
    if (fromDate && hDate) {
      const isHoverBefore = isBefore(hDate, fromDate)
      const start = isHoverBefore ? addDays(hDate, 1) : addDays(fromDate, 1)
      const end = isHoverBefore ? subDays(fromDate, 1) : subDays(hDate, 1)
      if (isAfter(start, end)) return undefined
      return { from: start, to: end }
    }
    return undefined
  }, [isSelecting, draftRange?.from, hoverDate])

  const adjustedRangeStart = React.useMemo(() => {
    if (isSelecting && draftRange?.from && hoverDate) {
      if (isBefore(hoverDate, draftRange.from)) {
        return hoverDate
      }
    }
    return draftRange?.from
  }, [isSelecting, draftRange, hoverDate])

  const adjustedRangeEnd = React.useMemo(() => {
    if (isSelecting && draftRange?.from && hoverDate) {
      if (isBefore(hoverDate, draftRange.from)) {
        return draftRange.from
      }
      return hoverDate
    }
    return draftRange?.to
  }, [isSelecting, draftRange, hoverDate])

  const fullRangeMiddleModifier = React.useMemo(() => {
    if (isSelecting) return undefined

    const fromDate = draftRange?.from
    const toDate = draftRange?.to
    if (fromDate && toDate) {
      const start = addDays(fromDate, 1)
      const end = subDays(toDate, 1)
      if (isAfter(start, end)) return undefined
      return { from: start, to: end }
    }
    return undefined
  }, [isSelecting, draftRange])

  const selectedRangeModifier = React.useMemo(() => {
    const fromDate = draftRange?.from
    const toDate = draftRange?.to
    if (fromDate && toDate) {
      return { from: fromDate, to: toDate }
    }
    return undefined
  }, [draftRange])

  const finalModifiers = React.useMemo(() => {
    // Case 1: When actively selecting with mouse
    if (isSelecting) {
      return {
        range_start: adjustedRangeStart,
        range_end: adjustedRangeEnd,
        range_middle: rangeMiddleModifier,
      }
    }

    // Case 2: When both input fields have valid dates
    if (inputFrom && inputTo && isValid(inputFrom) && isValid(inputTo)) {
      const normalizedFrom = startOfDay(inputFrom)
      const normalizedTo = endOfDay(inputTo)

      // Handle case where dates might be in wrong order
      const [start, end] = isAfter(normalizedFrom, normalizedTo)
        ? [normalizedTo, normalizedFrom]
        : [normalizedFrom, normalizedTo]

      return {
        range_start: start,
        range_end: end,
        range_middle: { from: start, to: end },
        selected: { from: start, to: end },
      }
    }

    // Case 3: When only one input has a valid date
    if (inputFrom && isValid(inputFrom)) {
      return {
        range_start: startOfDay(inputFrom),
      }
    }
    if (inputTo && isValid(inputTo)) {
      return {
        range_end: endOfDay(inputTo),
      }
    }

    // Case 4: Fallback to selected range if it exists
    if (selectedRangeModifier) {
      return {
        range_start: selectedRangeModifier.from,
        range_end: selectedRangeModifier.to,
        range_middle: fullRangeMiddleModifier,
        selected: selectedRangeModifier,
      }
    }

    return {}
  }, [
    isSelecting,
    adjustedRangeStart,
    adjustedRangeEnd,
    rangeMiddleModifier,
    selectedRangeModifier,
    fullRangeMiddleModifier,
    inputFrom,
    inputTo,
  ])

  const handlePresetSelect = (range: DateRange) => {
    setDraftRange(range)
    onValueChange?.(range) // Apply onValueChange here
    setInputFrom(range.from)
    setInputTo(range.to)
    setIsSelecting(false)
    setHoverDate(undefined)
  }

  const areDateRangesEqual = (
    range1: DateRange | undefined,
    range2: DateRange | undefined
  ) => {
    if (!range1?.from || !range1?.to || !range2?.from || !range2?.to) {
      return false
    }
    return (
      isEqual(startOfDay(range1.from), startOfDay(range2.from)) &&
      isEqual(endOfDay(range1.to), endOfDay(range2.to))
    )
  }

  const handleConfirm = () => {
    onConfirm?.(draftRange)
    onClose?.()
    setOpen?.(false)
  }

  const handleCancel = () => {
    setDraftRange(selectedRange)
    onValueChange?.(selectedRange) // Apply onValueChange here
    setInputFrom(selectedRange?.from)
    setInputTo(selectedRange?.to)
    setIsSelecting(false)
    setHoverDate(undefined)
    onClose?.()
    setOpen?.(false)
  }

  // --- Input change handler (LIVE update) ---
  const handleInputChange = React.useCallback(
    (value: Date | "invalid" | undefined, type: "from" | "to") => {
      // Update input state immediately
      setIsSelecting(false)
      setHoverDate(undefined)

      if (type === "from") {
        setInputFrom(value === "invalid" ? undefined : value)
      } else {
        setInputTo(value === "invalid" ? undefined : value)
      }

      // Update draftRange *only if* the new value is valid
      if (value !== "invalid" && isValid(value)) {
        // Calculate the updated range outside of setDraftRange
        const updatedRange = { ...(draftRange || {}) }
        if (type === "from") {
          updatedRange.from = value
        } else {
          updatedRange.to = value
        }

        // Check for date order and create final range
        let finalRange = updatedRange
        if (
          updatedRange.from &&
          updatedRange.to &&
          isAfter(updatedRange.from, updatedRange.to)
        ) {
          finalRange = { from: updatedRange.to, to: updatedRange.from }
        }

        // Call onValueChange with the correct updated range
        onValueChange?.(finalRange)

        // Update state with the same value
        setDraftRange(finalRange)
      }
    },
    [onValueChange, draftRange]
  )

  const handleInputBlur = React.useCallback(() => {
    // Swap input values if needed, on blur
    if (inputFrom && inputTo && isAfter(inputFrom, inputTo)) {
      setInputFrom(inputTo)
      setInputTo(inputFrom)

      // update draft only on blur.
      const newRange = { from: inputTo, to: inputFrom }
      setDraftRange(newRange)
      onValueChange?.(newRange) // Apply onValueChange here
    }

    setIsSelecting(false)
  }, [inputFrom, inputTo, onValueChange])

  // Add this new useEffect
  React.useEffect(() => {
    if (!isSelecting && inputFrom && isValid(inputFrom)) {
      if (isDesktop) {
        setMonth(inputFrom)
      }
    }
    if (!isSelecting && inputTo && isValid(inputTo)) {
      if (!isDesktop) {
        setMonth(inputTo)
      }
    }
  }, [inputFrom, inputTo, isSelecting, isDesktop])

  const renderPresetButtons = () => {
    return (
      <div
        className={cn(
          "w-40 space-y-1 px-2 py-3",
          !isDesktop &&
            "flex w-full gap-1 space-y-0 overflow-x-auto border-b whitespace-nowrap"
        )}
      >
        {Object.entries(presetRanges).map(([key, preset]) => (
          <Button
            key={key}
            variant={isDesktop ? "ghost" : "secondary"}
            className={cn(
              "h-auto w-full min-w-min flex-1 p-2",
              isDesktop ? "justify-between" : "w-auto",
              areDateRangesEqual(draftRange, {
                from: preset.from,
                to: preset.to,
              }) &&
                !isDesktop &&
                "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            onClick={() =>
              handlePresetSelect({ from: preset.from, to: preset.to })
            }
          >
            <span>{preset.label}</span>
            {areDateRangesEqual(draftRange, {
              from: preset.from,
              to: preset.to,
            }) &&
              isDesktop && <Check className="size-5" />}
          </Button>
        ))}
      </div>
    )
  }

  const calendarContent = (
    <div className={cn("flex gap-0", !isDesktop && "flex-col")}>
      {renderPresetButtons()}
      <Separator
        orientation="vertical"
        className={cn(isDesktop ? "h-auto self-stretch" : "hidden")}
      />
      <div className="relative flex-1">
        <Calendar
          {...props}
          month={month}
          onMonthChange={setMonth}
          showOutsideDays={false}
          numberOfMonths={isNotSmallScreen ? 2 : 1}
          onDayClick={(date) => handleDateSelect(date || undefined)}
          onDayMouseEnter={handleDayMouseEnter}
          onDayMouseLeave={handleDayMouseLeave}
          modifiers={finalModifiers}
          localeString={localeString}
        />
        <div className="sticky bottom-0 flex items-center gap-4 border-t p-4 backdrop-blur-xl max-md:flex-col">
          <div className="flex flex-1 items-center justify-center gap-2">
            <FormComposition
              iconRight={<CalendarIcon />}
              showErrorMsg={false}
              onFormCompositionClick={() => {
                DateTimeInputFromRef.current?.focus()
              }}
              className="min-w-36"
            >
              <div className="flex h-full flex-1 items-center">
                <DateGroup onBlurWithin={handleInputBlur}>
                  <DateTimeInput
                    value={inputFrom}
                    ref={DateTimeInputFromRef}
                    locale={localeString}
                    onValueChange={(value) => handleInputChange(value, "from")}
                  />
                </DateGroup>
              </div>
            </FormComposition>
            <ArrowRightIcon className="text-muted-foreground size-4" />
            <FormComposition
              iconRight={<CalendarIcon />}
              showErrorMsg={false}
              onFormCompositionClick={() => {
                DateTimeInputToRef.current?.focus()
              }}
              className="min-w-36"
            >
              <div className="flex h-full flex-1 items-center">
                <DateGroup onBlurWithin={handleInputBlur}>
                  <DateTimeInput
                    value={inputTo}
                    ref={DateTimeInputToRef}
                    locale={localeString}
                    onValueChange={(value) => handleInputChange(value, "to")}
                  />
                </DateGroup>
              </div>
            </FormComposition>
          </div>
          {showConfirmButton && (
            <div className="flex grid-cols-2 gap-3 max-md:grid max-md:w-full">
              <Button variant={"secondary"} onClick={handleCancel}>
                Hủy bỏ
              </Button>
              <Button onClick={handleConfirm}>Xác nhận</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
  return calendarContent
}

export { CalendarRange }
