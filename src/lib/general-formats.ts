import { format, FormatOptions } from "date-fns";

const DEFAULT_DATE_FORMAT = "dd/MM/yyyy"

type Nullable<T> = T | undefined | null
type DateRange = { from?: Date; to?: Date }

export function formatDate(
  date: Nullable<Date>,
  formatString = DEFAULT_DATE_FORMAT,
  options?: FormatOptions
): string {
  if (!date) {
    return 'N/A'
  }
  try {
    return format(date, formatString, options)
  } catch (error) {
    console.error("Invalid date provided to formatDate:", error)
    return 'N/A'
  }
}

export function formatDateRange(
  range: Nullable<Partial<DateRange>>,
  formatString = DEFAULT_DATE_FORMAT,
  options?: FormatOptions
): string {
  if (!range?.from || !range?.to) {
    return 'N/A'
  }
  try {
    const fromDate = format(range.from, formatString, options)
    const toDate = format(range.to, formatString, options)
    return `${fromDate} - ${toDate}`
  } catch (error) {
    console.error("Invalid date range provided to formatDateRange:", error)
    return 'N/A'
  }
}

/**
 * Validates if a value is a valid number.
 */
function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value)
}

export function formatCurrency(
  amount: Nullable<number>,
  {
    locale = "vi-VN",
    currency,
    fallback = "N/A",
    intlOptions,
    customSymbol,
  }: {
    locale: string
    currency: string
    fallback?: string
    intlOptions?: Intl.NumberFormatOptions
    customSymbol?: string
  }
): string {
  if (!isValidNumber(amount)) {
    return fallback
  }

  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: customSymbol ? "code" : undefined,
    ...intlOptions,
  }).format(amount)

  if (customSymbol) {
    return formatted.replace(currency, customSymbol).trim()
  }

  return formatted
}