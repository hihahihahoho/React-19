import {
  formatCurrency,
  formatDate,
  formatDateRange,
} from "@/lib/general-formats"
import { type Meta, type StoryObj } from "@storybook/react-vite"
import { addDays, subDays } from "date-fns"

/**
 * General formatting utilities for dates, date ranges, and currency values.
 * These utilities provide consistent formatting across the application with proper null/undefined handling.
 */
const meta = {
  title: "Utils/General Formats",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Utility functions for formatting common data types consistently across the application.

## Features
- **Date Formatting**: Format dates with customizable patterns
- **Date Range Formatting**: Format date ranges with start and end dates
- **Currency Formatting**: Format monetary values with locale and currency support
- **Null Safety**: All functions handle null/undefined gracefully
- **Customization**: Support for custom formats, locales, and symbols

## Usage
\`\`\`tsx
import { formatDate, formatDateRange, formatCurrency } from "@/lib/general-formats"

// Format a date
formatDate(new Date(), "dd/MM/yyyy") // "17/11/2025"

// Format a date range
formatDateRange(
  { from: new Date(), to: addDays(new Date(), 7) },
  "dd/MM/yyyy"
) // "17/11/2025 - 24/11/2025"

// Format currency
formatCurrency(1234567, {
  locale: "vi-VN",
  currency: "VND",
}) // "1.234.567 ₫"
\`\`\`
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic date formatting examples with various formats.
 */
export const DateFormatting: Story = {
  render: () => {
    const today = new Date(2025, 10, 17) // November 17, 2025

    const formats = [
      { label: "Default Format", value: formatDate(today) },
      { label: "Short Format", value: formatDate(today, "dd/MM/yy") },
      { label: "Long Format", value: formatDate(today, "MMMM dd, yyyy") },
      { label: "ISO Format", value: formatDate(today, "yyyy-MM-dd") },
      { label: "With Time", value: formatDate(today, "dd/MM/yyyy HH:mm:ss") },
      {
        label: "Custom Format",
        value: formatDate(today, "EEEE, MMMM do, yyyy"),
      },
      { label: "Month Year", value: formatDate(today, "MMM yyyy") },
      { label: "Null Value", value: formatDate(null) },
      { label: "Undefined Value", value: formatDate(undefined) },
    ]

    return (
      <div className="w-full max-w-2xl space-y-2">
        <h3 className="mb-4 text-lg font-semibold">Date Formatting Examples</h3>
        {formats.map((format, index) => (
          <div
            key={index}
            className="flex justify-between border-b pb-2 last:border-0"
          >
            <span className="text-muted-foreground">{format.label}:</span>
            <code className="font-mono text-sm">{format.value}</code>
          </div>
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Various date formatting examples showing different format patterns. Returns 'N/A' for null or undefined values.",
      },
    },
  },
}

/**
 * Date range formatting examples.
 */
export const DateRangeFormatting: Story = {
  render: () => {
    const today = new Date(2025, 10, 17)
    const tomorrow = addDays(today, 1)
    const nextWeek = addDays(today, 7)
    const lastWeek = subDays(today, 7)
    const nextMonth = addDays(today, 30)

    const ranges = [
      {
        label: "Default Format",
        value: formatDateRange({ from: today, to: nextWeek }),
      },
      {
        label: "Short Format",
        value: formatDateRange({ from: today, to: nextWeek }, "dd/MM/yy"),
      },
      {
        label: "Long Format",
        value: formatDateRange({ from: today, to: nextWeek }, "MMMM dd, yyyy"),
      },
      {
        label: "ISO Format",
        value: formatDateRange({ from: today, to: nextWeek }, "yyyy-MM-dd"),
      },
      {
        label: "Single Day",
        value: formatDateRange({ from: today, to: tomorrow }),
      },
      {
        label: "Past Range",
        value: formatDateRange({ from: lastWeek, to: today }),
      },
      {
        label: "Month Range",
        value: formatDateRange({ from: today, to: nextMonth }, "dd MMM yyyy"),
      },
      {
        label: "Missing 'to' Date",
        value: formatDateRange({ from: today }),
      },
      {
        label: "Missing 'from' Date",
        value: formatDateRange({ to: today }),
      },
      {
        label: "Null Range",
        value: formatDateRange(null),
      },
    ]

    return (
      <div className="w-full max-w-2xl space-y-2">
        <h3 className="mb-4 text-lg font-semibold">
          Date Range Formatting Examples
        </h3>
        {ranges.map((range, index) => (
          <div
            key={index}
            className="flex justify-between border-b pb-2 last:border-0"
          >
            <span className="text-muted-foreground">{range.label}:</span>
            <code className="font-mono text-sm">{range.value}</code>
          </div>
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Date range formatting with various format patterns. Requires both 'from' and 'to' dates to be present, otherwise returns 'N/A'.",
      },
    },
  },
}

/**
 * Currency formatting with different locales and currencies.
 */
export const CurrencyFormatting: Story = {
  render: () => {
    const amount = 1234567.89

    const formats = [
      {
        label: "Vietnamese Dong (VND)",
        value: formatCurrency(amount, {
          locale: "vi-VN",
          currency: "VND",
        }),
      },
      {
        label: "US Dollar (USD)",
        value: formatCurrency(amount, {
          locale: "en-US",
          currency: "USD",
        }),
      },
      {
        label: "Euro (EUR)",
        value: formatCurrency(amount, {
          locale: "de-DE",
          currency: "EUR",
        }),
      },
      {
        label: "British Pound (GBP)",
        value: formatCurrency(amount, {
          locale: "en-GB",
          currency: "GBP",
        }),
      },
      {
        label: "Japanese Yen (JPY)",
        value: formatCurrency(amount, {
          locale: "ja-JP",
          currency: "JPY",
        }),
      },
      {
        label: "Custom Symbol",
        value: formatCurrency(amount, {
          locale: "vi-VN",
          currency: "VND",
          customSymbol: "VND",
        }),
      },
      {
        label: "With Custom Options",
        value: formatCurrency(amount, {
          locale: "en-US",
          currency: "USD",
          intlOptions: {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        }),
      },
      {
        label: "Null Value",
        value: formatCurrency(null, {
          locale: "en-US",
          currency: "USD",
        }),
      },
      {
        label: "Undefined Value",
        value: formatCurrency(undefined, {
          locale: "en-US",
          currency: "USD",
        }),
      },
      {
        label: "Custom Fallback",
        value: formatCurrency(null, {
          locale: "en-US",
          currency: "USD",
          fallback: "—",
        }),
      },
    ]

    return (
      <div className="w-full max-w-2xl space-y-2">
        <h3 className="mb-4 text-lg font-semibold">
          Currency Formatting Examples
        </h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Amount: <code className="font-mono">1234567.89</code>
        </p>
        {formats.map((format, index) => (
          <div
            key={index}
            className="flex justify-between border-b pb-2 last:border-0"
          >
            <span className="text-muted-foreground">{format.label}:</span>
            <code className="font-mono text-sm font-semibold">
              {format.value}
            </code>
          </div>
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Currency formatting with different locales, currencies, and custom options. Returns 'N/A' (or custom fallback) for invalid values.",
      },
    },
  },
}

/**
 * Comprehensive example showing all formatting utilities together.
 */
export const AllFormats: Story = {
  render: () => {
    const today = new Date(2025, 10, 17)
    const nextWeek = addDays(today, 7)
    const invoice = {
      id: "INV-2025-001",
      issueDate: today,
      dueDate: nextWeek,
      period: { from: subDays(today, 30), to: today },
      subtotal: 1000000,
      tax: 100000,
      total: 1100000,
    }

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="space-y-4 rounded-lg border p-6">
          <div className="flex items-start justify-between border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold">Invoice</h2>
              <p className="text-muted-foreground">{invoice.id}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm">Issue Date</p>
              <p className="font-semibold">
                {formatDate(invoice.issueDate, "dd MMM yyyy")}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Due Date:</span>
              <span>{formatDate(invoice.dueDate, "MMMM dd, yyyy")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Billing Period:</span>
              <span>{formatDateRange(invoice.period, "dd/MM/yyyy")}</span>
            </div>
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-mono">
                {formatCurrency(invoice.subtotal, {
                  locale: "vi-VN",
                  currency: "VND",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (10%):</span>
              <span className="font-mono">
                {formatCurrency(invoice.tax, {
                  locale: "vi-VN",
                  currency: "VND",
                })}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>Total:</span>
              <span className="font-mono">
                {formatCurrency(invoice.total, {
                  locale: "vi-VN",
                  currency: "VND",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="text-muted-foreground text-sm">
          <p>
            This example demonstrates all formatting utilities working together
            in a realistic invoice scenario.
          </p>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "A comprehensive example showing date, date range, and currency formatting working together in a realistic invoice UI.",
      },
    },
  },
}

/**
 * Edge cases and error handling examples.
 */
export const EdgeCases: Story = {
  render: () => {
    const validDate = new Date(2025, 10, 17)
    const invalidDate = new Date("invalid")

    const cases = [
      {
        category: "Date Formatting",
        items: [
          { label: "Valid Date", value: formatDate(validDate) },
          { label: "Null", value: formatDate(null) },
          { label: "Undefined", value: formatDate(undefined) },
          { label: "Invalid Date", value: formatDate(invalidDate) },
        ],
      },
      {
        category: "Date Range Formatting",
        items: [
          {
            label: "Valid Range",
            value: formatDateRange({
              from: validDate,
              to: addDays(validDate, 7),
            }),
          },
          { label: "Null Range", value: formatDateRange(null) },
          { label: "Undefined Range", value: formatDateRange(undefined) },
          { label: "Empty Object", value: formatDateRange({}) },
          { label: "Only From", value: formatDateRange({ from: validDate }) },
          { label: "Only To", value: formatDateRange({ to: validDate }) },
          {
            label: "Invalid Dates",
            value: formatDateRange({ from: invalidDate, to: invalidDate }),
          },
        ],
      },
      {
        category: "Currency Formatting",
        items: [
          {
            label: "Valid Number",
            value: formatCurrency(1234.56, {
              locale: "en-US",
              currency: "USD",
            }),
          },
          {
            label: "Zero",
            value: formatCurrency(0, { locale: "en-US", currency: "USD" }),
          },
          {
            label: "Negative",
            value: formatCurrency(-1234.56, {
              locale: "en-US",
              currency: "USD",
            }),
          },
          {
            label: "Null",
            value: formatCurrency(null, { locale: "en-US", currency: "USD" }),
          },
          {
            label: "Undefined",
            value: formatCurrency(undefined, {
              locale: "en-US",
              currency: "USD",
            }),
          },
          {
            label: "NaN",
            value: formatCurrency(NaN, { locale: "en-US", currency: "USD" }),
          },
          {
            label: "Custom Fallback",
            value: formatCurrency(null, {
              locale: "en-US",
              currency: "USD",
              fallback: "No amount",
            }),
          },
        ],
      },
    ]

    return (
      <div className="w-full max-w-2xl space-y-6">
        <h3 className="text-lg font-semibold">Edge Cases & Error Handling</h3>
        {cases.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-2">
            <h4 className="text-muted-foreground text-sm font-semibold">
              {category.category}
            </h4>
            {category.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="flex justify-between border-b pb-2 pl-4 last:border-0"
              >
                <span className="text-muted-foreground text-sm">
                  {item.label}:
                </span>
                <code className="font-mono text-sm">{item.value}</code>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates how the formatting utilities handle edge cases like null values, undefined, invalid dates, and NaN. All functions gracefully return 'N/A' or custom fallback values.",
      },
    },
  },
}
