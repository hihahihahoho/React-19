"use client"

import { useLocaleDateConfig } from "@/hooks/use-date-locale-config"
import { SegmentDateId } from "@/lib/locale-date"
import { format, getDaysInMonth, isValid, parse } from "date-fns"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useDateGroupContext } from "./date-time-input-group"

function isStringNumber(value: string) {
  return /^-?\d+(\.\d+)?$/.test(value)
}

/**
 * Clamp a numeric string value to valid range [1, max] for day/month segments.
 * Returns empty string if the value is empty or not a valid number.
 * Does NOT silently mutate - returns the value as-is if valid, or clamped if needed.
 */
function clampSegmentValue(val: string, min: number, max: number): string {
  if (!val) return ""
  const num = parseInt(val, 10)
  if (isNaN(num)) return ""
  if (num < min) return String(min)
  if (num > max) return String(max)
  return val
}

export type Granularity = "date" | "time" | "datetime"

interface DateSegmentProps {
  value: string
  onChange: (value: string) => void
  onPasteDate?: (pastedText: string) => void
  placeholder: string
  maxLength: number
  maxValue: number
  minValue: number
  segmentType: SegmentDateId
  id: string // For accessibility
  label: string // For accessibility
  resetKey: number
  segmentRefCallback?: (node: HTMLDivElement | null) => void
  disabled?: boolean
  readonly?: boolean
}

function DateSegment({
  value,
  onChange,
  onPasteDate,
  placeholder,
  maxLength,
  maxValue,
  minValue,
  segmentType,
  id,
  label,
  segmentRefCallback,
  resetKey,
  disabled,
  readonly,
}: DateSegmentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const dateGroup = useDateGroupContext()

  const [isFocused, setIsFocused] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [isOverwriteMode, setIsOverwriteMode] = useState(true)
  const [isComposing, setIsComposing] = useState(false)

  // Track previous props for detecting changes during render
  const [prevResetKey, setPrevResetKey] = useState(resetKey)
  const [prevValue, setPrevValue] = useState(value)

  // Register/unregister segment with group context
  useEffect(() => {
    const node = ref.current
    if (dateGroup && node) {
      dateGroup.registerSegment(node)
      return () => {
        dateGroup.unregisterSegment(node)
      }
    }
  }, [dateGroup])

  // Handle segment ref callback for parent component
  useEffect(() => {
    if (segmentRefCallback) {
      segmentRefCallback(ref.current)
      return () => {
        segmentRefCallback(null)
      }
    }
  }, [segmentRefCallback])

  // Sync inputValue with external value prop changes (when not focused)
  // React docs: "Adjusting state when props change" - setState during render is correct
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (!isFocused && value !== prevValue) {
    setPrevValue(value)
    setInputValue(value)
  }

  // Handle reset key changes - setState during render pattern
  if (resetKey > 0 && resetKey !== prevResetKey) {
    setPrevResetKey(resetKey)
    setInputValue("")
  }

  const focusNextSegment = useCallback(() => {
    if (dateGroup && ref.current) {
      dateGroup.moveFocus(ref.current, 1)
    }
  }, [dateGroup])

  const focusPrevSegment = useCallback(() => {
    if (dateGroup && ref.current) {
      dateGroup.moveFocus(ref.current, -1)
    }
  }, [dateGroup])

  // Handle IME composition events
  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLDivElement>) => {
    setIsComposing(false)
    // Extract only digits from composed text
    const digits = e.data.replace(/\D/g, "")
    if (digits) {
      processDigitInput(digits)
    }
  }

  // Process digit input (from keyboard, paste, or IME)
  const processDigitInput = (digits: string) => {
    if (isOverwriteMode) {
      // Take only what we need for this segment
      const newValue = digits.slice(0, maxLength)
      setInputValue(newValue)
      setIsOverwriteMode(false)
      onChange(newValue)

      if (newValue.length === maxLength || parseInt(newValue) * 10 > maxValue) {
        focusNextSegment()
      }
      return
    }

    // Append mode - add digits one by one
    let currentValue = inputValue
    for (const digit of digits) {
      const newValue = currentValue + digit

      if (newValue.length > maxLength) {
        // Overflow - commit current and start fresh
        onChange(currentValue)
        currentValue = digit
        focusNextSegment()
        break
      }

      const combinedNum = parseInt(newValue)

      if (maxLength === 2) {
        if (combinedNum > maxValue) {
          onChange(currentValue)
          currentValue = digit
          focusNextSegment()
          break
        }
        if (combinedNum * 10 > maxValue) {
          currentValue = newValue
          onChange(newValue)
          focusNextSegment()
          break
        }
        currentValue = newValue
      } else {
        // Year or other multi-digit segments
        if (combinedNum <= maxValue) {
          currentValue = newValue
        } else {
          onChange(currentValue)
          currentValue = digit
          focusNextSegment()
          break
        }
      }
    }

    setInputValue(currentValue)
    onChange(currentValue)

    if (currentValue.length === maxLength) {
      focusNextSegment()
    }
  }

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const pastedText = e.clipboardData.getData("text/plain").trim()
    console.log("[DateSegment] handlePaste called:", pastedText)

    // Check if the pasted text looks like a full date/time
    // Common patterns: "2024-01-15", "15/01/2024", "01-15-2024", "14:30", "2024-01-15 14:30"
    const hasDateSeparators = /[-/.,\s:]/.test(pastedText)

    if (hasDateSeparators && onPasteDate) {
      console.log("[DateSegment] Delegating to parent for full date parsing")
      // Delegate to parent to parse the full date/time
      onPasteDate(pastedText)
      return
    }

    // Otherwise, extract digits and process as segment input
    const digits = pastedText.replace(/\D/g, "")
    console.log("[DateSegment] Processing digits:", digits)
    if (digits) {
      processDigitInput(digits)
    }
  }

  const handleBeforeInput = (e: React.FormEvent<HTMLDivElement>) => {
    // Ignore if composing (IME will handle it)
    if (isComposing) return

    const event = e as unknown as InputEvent
    // Only allow digit input through keyboard
    if (event.data && !/^\d+$/.test(event.data)) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleNumberInput = (e: React.KeyboardEvent) => {
    e.preventDefault()
    e.stopPropagation()
    processDigitInput(e.key)
  }

  // Key handling
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || readonly) return
    if (isComposing) return // Don't handle keys during IME composition

    e.stopPropagation()

    // Handle Ctrl+V / Cmd+V for paste
    if ((e.ctrlKey || e.metaKey) && e.key === "v") {
      e.preventDefault()
      // Read from clipboard using Clipboard API
      navigator.clipboard
        .readText()
        .then((pastedText) => {
          pastedText = pastedText.trim()
          console.log("[DateSegment] Ctrl+V paste:", pastedText)

          // Check if the pasted text looks like a full date/time
          const hasDateSeparators = /[-/.,\s:]/.test(pastedText)

          if (hasDateSeparators && onPasteDate) {
            console.log(
              "[DateSegment] Delegating to parent for full date parsing"
            )
            onPasteDate(pastedText)
            return
          }

          // Otherwise, extract digits and process as segment input
          const digits = pastedText.replace(/\D/g, "")
          console.log("[DateSegment] Processing digits:", digits)
          if (digits) {
            processDigitInput(digits)
          }
        })
        .catch((err) => {
          console.error("[DateSegment] Failed to read clipboard:", err)
        })
      return
    }

    if (e.key === "Tab") {
      setIsOverwriteMode(true)
      return
    }

    if (/^\d$/.test(e.key)) {
      handleNumberInput(e)
      return
    }

    switch (e.key) {
      case "ArrowUp": {
        e.preventDefault()
        const currentNum = parseInt(inputValue) || minValue - 1
        const nextVal = Math.min(currentNum + 1, maxValue)
        const valStr =
          maxLength === 2
            ? nextVal.toString().padStart(2, "0")
            : nextVal.toString()
        setInputValue(valStr)
        onChange(valStr)
        break
      }
      case "ArrowDown": {
        e.preventDefault()
        const currentNum = parseInt(inputValue) || minValue + 1
        const nextVal = Math.max(currentNum - 1, minValue)
        const valStr =
          maxLength === 2
            ? nextVal.toString().padStart(2, "0")
            : nextVal.toString()
        setInputValue(valStr)
        onChange(valStr)
        break
      }
      case "Backspace":
        e.preventDefault()
        if (inputValue.length > 0) {
          const newVal = inputValue.slice(0, -1)
          setInputValue(newVal)
          onChange(newVal)
        } else {
          // Already empty => jump to previous
          focusPrevSegment()
        }
        setIsOverwriteMode(false)
        break
      case "Delete":
        e.preventDefault()
        setInputValue("")
        onChange("")
        setIsOverwriteMode(true)
        break
      case "ArrowLeft":
        e.preventDefault()
        focusPrevSegment()
        break
      case "ArrowRight":
        e.preventDefault()
        focusNextSegment()
        break
      default:
        e.preventDefault()
        break
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    setIsOverwriteMode(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setIsOverwriteMode(true)
  }

  const displayValue = isFocused ? inputValue : value

  // Compute aria attributes for spinbutton role
  const numericValue = parseInt(displayValue) || undefined
  const paddedValue =
    (segmentType === "year" && displayValue
      ? displayValue.padStart(4, "0")
      : displayValue
        ? displayValue.padStart(maxLength, "0")
        : placeholder) || placeholder

  return (
    <div>
      <div
        ref={ref}
        role="spinbutton"
        className={`relative cursor-text rounded-md px-1 text-center tabular-nums caret-transparent outline-hidden select-none ${
          !displayValue && "text-muted-foreground"
        } ${isFocused ? "bg-primary/20" : "hover:bg-primary/20"}`}
        id={id}
        aria-label={label}
        aria-valuenow={numericValue}
        aria-valuemin={minValue}
        aria-valuemax={maxValue}
        contentEditable={!disabled && !readonly}
        suppressContentEditableWarning
        inputMode="numeric"
        spellCheck="false"
        autoCorrect="off"
        tabIndex={0}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onBeforeInput={handleBeforeInput}
        onPaste={handlePaste}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {paddedValue}
      </div>
    </div>
  )
}

export interface DateTimeInputProps {
  locale?: string
  value?: Date
  defaultValue?: Date
  onValueChange?: (value: Date | undefined | "invalid") => void
  granularity?: Granularity
  disabled?: boolean
  readonly?: boolean
}

export interface DateTimeInputHandle {
  focus: () => void
  clear: () => void
}

/**
 * Try to parse a pasted date/time string into components.
 * Supports various common formats:
 * - ISO: "2024-01-15", "2024-01-15T14:30"
 * - Common: "15/01/2024", "01-15-2024", "15.01.2024"
 * - Time: "14:30", "2:30 PM"
 */
function parsePastedDateTime(
  text: string,
  granularity: Granularity
): {
  day?: string
  month?: string
  year?: string
  hour?: string
  minute?: string
} | null {
  const trimmed = text.trim()

  // Try ISO format first: YYYY-MM-DD or YYYY-MM-DDTHH:mm
  const isoMatch = trimmed.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](\d{1,2}):(\d{1,2}))?/
  )
  if (isoMatch) {
    return {
      year: isoMatch[1],
      month: isoMatch[2],
      day: isoMatch[3],
      hour: isoMatch[4],
      minute: isoMatch[5],
    }
  }

  // Try DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY format
  const dmyMatch = trimmed.match(
    /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})(?:[\s,]+(\d{1,2}):(\d{1,2}))?/
  )
  if (dmyMatch) {
    return {
      day: dmyMatch[1],
      month: dmyMatch[2],
      year: dmyMatch[3],
      hour: dmyMatch[4],
      minute: dmyMatch[5],
    }
  }

  // Try MM/DD/YYYY format (US style) - detect by checking if first number > 12
  const mdyMatch = trimmed.match(
    /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})(?:[\s,]+(\d{1,2}):(\d{1,2}))?/
  )
  if (mdyMatch) {
    const first = parseInt(mdyMatch[1])
    const second = parseInt(mdyMatch[2])
    // If second number > 12, assume first is month (US format)
    if (second > 12 && first <= 12) {
      return {
        month: mdyMatch[1],
        day: mdyMatch[2],
        year: mdyMatch[3],
        hour: mdyMatch[4],
        minute: mdyMatch[5],
      }
    }
  }

  // Try time-only format: HH:mm or H:mm
  if (granularity === "time" || granularity === "datetime") {
    const timeMatch = trimmed.match(/^(\d{1,2}):(\d{1,2})/)
    if (timeMatch) {
      return {
        hour: timeMatch[1],
        minute: timeMatch[2],
      }
    }
  }

  return null
}

const DateTimeInput = React.forwardRef<DateTimeInputHandle, DateTimeInputProps>(
  function DateTimeInput(
    {
      locale,
      value,
      defaultValue,
      onValueChange,
      granularity = "date",
      disabled,
      readonly,
    }: DateTimeInputProps,
    ref
  ) {
    const uid = React.useId()
    const dateGroup = useDateGroupContext()
    const localeConfig = useLocaleDateConfig(locale)

    const [resetKey, setResetKey] = useState(0)

    const [day, setDay] = useState(isValid(value) ? format(value!, "d") : "")
    const [month, setMonth] = useState(
      isValid(value) ? format(value!, "M") : ""
    )
    const [year, setYear] = useState(
      isValid(value) ? format(value!, "yyyy") : ""
    )
    const [hour, setHour] = useState(isValid(value) ? format(value!, "H") : "")
    const [minute, setMinute] = useState(
      isValid(value) ? format(value!, "m") : ""
    )

    // Track previous props for change detection
    const [prevValue, setPrevValue] = useState(value)
    const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue)
    const [prevGranularity, setPrevGranularity] = useState(granularity)

    const segmentRefs = useRef<HTMLDivElement[]>([])

    const segmentRefCallback = useCallback((node: HTMLDivElement | null) => {
      if (node) {
        if (!segmentRefs.current.includes(node)) {
          segmentRefs.current.push(node)
        }
      } else {
        segmentRefs.current = segmentRefs.current.filter((el) => el !== node)
      }
    }, [])

    // Handle defaultValue changes when value is not set
    // React docs: setState during render pattern
    // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
    if (
      !value &&
      defaultValue &&
      (defaultValue !== prevDefaultValue || granularity !== prevGranularity)
    ) {
      setPrevDefaultValue(defaultValue)
      setPrevGranularity(granularity)
      if (granularity !== "time") {
        setDay(format(defaultValue, "d"))
        setMonth(format(defaultValue, "M"))
        setYear(format(defaultValue, "yyyy"))
      }
      if (granularity !== "date") {
        setHour(format(defaultValue, "H"))
        setMinute(format(defaultValue, "m"))
      }
    }

    // Handle value prop changes (controlled mode)
    if (value && (value !== prevValue || granularity !== prevGranularity)) {
      setPrevValue(value)
      setPrevGranularity(granularity)
      if (granularity !== "time") {
        setDay(format(value, "d"))
        setMonth(format(value, "M"))
        setYear(format(value, "yyyy"))
      }
      if (granularity !== "date") {
        setHour(format(value, "H"))
        setMinute(format(value, "m"))
      }
    }

    const updateFinalValue = useCallback(
      (d: string, m: string, y: string, h: string, min: string) => {
        let parsed: Date | null = null

        if (granularity === "date") {
          // Validate that we have all required parts
          if (!d || !m || !y || y.length < 4) {
            if (d || m || y) {
              onValueChange?.("invalid")
            } else {
              onValueChange?.(undefined)
            }
            return
          }
          const str = `${y.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
          parsed = parse(str, "yyyy-MM-dd", new Date())
        } else if (granularity === "time") {
          if (!h || !min) {
            if (h || min) {
              onValueChange?.("invalid")
            } else {
              onValueChange?.(undefined)
            }
            return
          }
          const str = `${h.padStart(2, "0")}:${min.padStart(2, "0")}`
          parsed = parse(str, "HH:mm", new Date())
        } else {
          // datetime - need both date and time parts
          if (!d || !m || !y || y.length < 4 || !h || !min) {
            if (d || m || y || h || min) {
              onValueChange?.("invalid")
            } else {
              onValueChange?.(undefined)
            }
            return
          }
          const dateStr = `${y.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
          const timeStr = `${h.padStart(2, "0")}:${min.padStart(2, "0")}`
          parsed = parse(
            `${dateStr} ${timeStr}`,
            "yyyy-MM-dd HH:mm",
            new Date()
          )
        }

        if (parsed && isValid(parsed)) {
          onValueChange?.(parsed)
        } else {
          onValueChange?.("invalid")
        }
      },
      [granularity, onValueChange]
    )

    const getSegmentDateIds = useCallback((): SegmentDateId[] => {
      const ids: SegmentDateId[] = []
      if (granularity !== "time") {
        ids.push(...localeConfig.segments.map((s) => s.id))
      }
      if (granularity !== "date") {
        ids.push("hour", "minute")
      }
      return ids
    }, [granularity, localeConfig.segments])

    const getSegmentConfig = useCallback(
      (id: SegmentDateId) => {
        switch (id) {
          case "day": {
            const yInt = parseInt(year)
            const mInt = parseInt(month)
            if (isNaN(yInt) || isNaN(mInt)) {
              return { maxLength: 2, maxValue: 31, minValue: 1 }
            }
            const days = getDaysInMonth(
              parse(`${yInt}-${mInt}-01`, "yyyy-MM-dd", new Date())
            )
            return { maxLength: 2, maxValue: days, minValue: 1 }
          }
          case "month":
            return { maxLength: 2, maxValue: 12, minValue: 1 }
          case "year":
            return { maxLength: 4, maxValue: 9999, minValue: 1 }
          case "hour":
            return { maxLength: 2, maxValue: 23, minValue: 0 }
          case "minute":
            return { maxLength: 2, maxValue: 59, minValue: 0 }
          default:
            return { maxLength: 2, maxValue: 99, minValue: 0 }
        }
      },
      [year, month]
    )

    const getSegmentMeta = useCallback(
      (id: SegmentDateId) => {
        const dateSeg = localeConfig.segments.find((s) => s.id === id)
        if (dateSeg)
          return { placeholder: dateSeg.placeholder, label: dateSeg.label }

        if (id === "hour") {
          return { placeholder: "hh", label: "Hour" }
        }
        if (id === "minute") {
          return { placeholder: "mm", label: "Minute" }
        }
        return { placeholder: "", label: "" }
      },
      [localeConfig.segments]
    )

    const getSegmentValue = useCallback(
      (id: SegmentDateId) => {
        switch (id) {
          case "day":
            return day
          case "month":
            return month
          case "year":
            return year
          case "hour":
            return hour
          case "minute":
            return minute
          default:
            return ""
        }
      },
      [day, month, year, hour, minute]
    )

    const setSegmentValue = useCallback(
      (id: SegmentDateId, newVal: string) => {
        let d = day,
          m = month,
          y = year,
          h = hour,
          min = minute

        switch (id) {
          case "day":
            // Clamp to valid range instead of magic mutation
            d = clampSegmentValue(newVal, 1, 31)
            setDay(d)
            break
          case "month":
            m = clampSegmentValue(newVal, 1, 12)
            setMonth(m)
            {
              // Adjust day if it exceeds days in new month
              const yInt = parseInt(y)
              const mInt = parseInt(m)
              if (!isNaN(yInt) && !isNaN(mInt) && d) {
                const dim = getDaysInMonth(
                  parse(`${yInt}-${mInt}-01`, "yyyy-MM-dd", new Date())
                )
                if (parseInt(d) > dim) {
                  d = String(dim)
                  setDay(d)
                }
              }
            }
            break
          case "year":
            y = newVal // Year doesn't need clamping during input
            setYear(y)
            {
              // Adjust day if it exceeds days in month (leap year change)
              const yInt = parseInt(y)
              const mInt = parseInt(m)
              if (!isNaN(yInt) && !isNaN(mInt) && d) {
                const dim = getDaysInMonth(
                  parse(`${yInt}-${mInt}-01`, "yyyy-MM-dd", new Date())
                )
                if (parseInt(d) > dim) {
                  d = String(dim)
                  setDay(d)
                }
              }
            }
            break
          case "hour":
            h = clampSegmentValue(newVal, 0, 23)
            setHour(h)
            break
          case "minute":
            min = clampSegmentValue(newVal, 0, 59)
            setMinute(min)
            break
        }

        updateFinalValue(d, m, y, h, min)
      },
      [day, month, year, hour, minute, updateFinalValue]
    )

    // Handle paste from any segment - parse and distribute to all segments
    const handlePasteDate = useCallback(
      (pastedText: string) => {
        console.log("[DateTimeInput] handlePasteDate called:", pastedText)
        const parsed = parsePastedDateTime(pastedText, granularity)
        console.log("[DateTimeInput] Parsed result:", parsed)
        if (!parsed) return

        let d = day,
          m = month,
          y = year,
          h = hour,
          min = minute

        if (granularity !== "time") {
          if (parsed.day) {
            d = clampSegmentValue(parsed.day, 1, 31)
            setDay(d)
          }
          if (parsed.month) {
            m = clampSegmentValue(parsed.month, 1, 12)
            setMonth(m)
          }
          if (parsed.year) {
            y = parsed.year
            setYear(y)
          }
        }

        if (granularity !== "date") {
          if (parsed.hour) {
            h = clampSegmentValue(parsed.hour, 0, 23)
            setHour(h)
          }
          if (parsed.minute) {
            min = clampSegmentValue(parsed.minute, 0, 59)
            setMinute(min)
          }
        }

        // Adjust day for month/year
        const yInt = parseInt(y)
        const mInt = parseInt(m)
        if (!isNaN(yInt) && !isNaN(mInt) && d) {
          const dim = getDaysInMonth(
            parse(`${yInt}-${mInt}-01`, "yyyy-MM-dd", new Date())
          )
          if (parseInt(d) > dim) {
            d = String(dim)
            setDay(d)
          }
        }

        updateFinalValue(d, m, y, h, min)

        // Blur current element to trigger sync in DateSegment
        // (DateSegment only syncs inputValue when not focused)
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      },
      [granularity, day, month, year, hour, minute, updateFinalValue]
    )

    const segmentDateIds = getSegmentDateIds()

    React.useImperativeHandle(ref, () => ({
      focus: () => {
        if (dateGroup) {
          dateGroup.focusFirstEmptySegment()
        } else if (segmentRefs.current.length > 0) {
          let firstUneditedSegment: HTMLDivElement | null = null
          for (let i = 0; i < segmentRefs.current.length; i++) {
            const segment = segmentRefs.current[i]
            if (!isStringNumber(segment.textContent || "")) {
              firstUneditedSegment = segment
              break
            }
          }
          if (firstUneditedSegment) {
            firstUneditedSegment.focus()
          } else {
            const lastSegment =
              segmentRefs.current[segmentRefs.current.length - 1]
            lastSegment.focus()
          }
        }
      },
      clear: () => {
        setDay("")
        setMonth("")
        setYear("")
        setHour("")
        setMinute("")
        onValueChange?.(undefined)
        setResetKey((k) => k + 1)
      },
    }))

    return (
      <div
        className="-mx-px flex gap-px select-none"
        aria-label="Date/Time Input"
      >
        {segmentDateIds.map((segId, index) => {
          const segmentValue = getSegmentValue(segId)
          const { maxLength, maxValue, minValue } = getSegmentConfig(segId)
          const { placeholder, label } = getSegmentMeta(segId)

          let sep: string | undefined
          const dateConfig = localeConfig

          if (segId === "hour" && index < segmentDateIds.length - 1) {
            sep = ":"
          } else if (
            (segId === "day" || segId === "month" || segId === "year") &&
            index < segmentDateIds.length - 1
          ) {
            const nextSegId = segmentDateIds[index + 1]
            if (["day", "month", "year"].includes(nextSegId)) {
              sep = dateConfig.separator ?? "/"
            } else {
              sep = ","
            }
          }

          return (
            <React.Fragment key={segId}>
              <DateSegment
                id={`${uid}-${segId}`}
                value={segmentValue}
                onChange={(v) => setSegmentValue(segId, v)}
                onPasteDate={handlePasteDate}
                placeholder={placeholder}
                label={label}
                maxLength={maxLength}
                maxValue={maxValue}
                minValue={minValue}
                segmentType={segId}
                segmentRefCallback={segmentRefCallback}
                resetKey={resetKey}
                disabled={disabled}
                readonly={readonly}
              />
              {sep && (
                <span aria-hidden="true" className="text-muted-foreground">
                  {sep}
                </span>
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }
)

export { DateTimeInput }
