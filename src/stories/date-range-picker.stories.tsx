/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@/components/ui/button"
import {
  DateRangePicker,
  OnValueChangeDateRangePicker,
} from "@/components/ui/date-range-picker/date-range-picker"
import { DateRangePickerForm } from "@/components/ui/date-range-picker/date-range-picker-form"
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import { zodDateRange } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Meta, StoryObj } from "@storybook/react"
import { addDays, addMonths, format, getDay } from "date-fns"
import { Calendar } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

/**
 * DateRangePicker component allows users to select a date range with a calendar interface.
 */
const meta = {
  title: "Forms/Date Range Picker",
  component: DateRangePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/date-range-picker.json
\`\`\`

DateRangePicker components allow users to select a range of dates from a calendar interface.
They can be used to input date ranges in forms or as standalone components.

## When to use
- When users need to select a range of dates (from-to)
- For form fields that require date range input
- For booking systems, scheduling, and reporting interfaces

## Accessibility
- Keyboard navigable calendar
- Screen reader support
- Focus management
        `,
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Text displayed when no date range is selected",
    },
    value: {
      description: "Currently selected date range (controlled)",
    },
    defaultValue: {
      description: "Default selected date range (uncontrolled)",
    },
    disabled: {
      control: "boolean",
      description: "Whether the date range picker is disabled",
    },
    formComposition: {
      description:
        "Configuration for form composition elements like label, help text",
    },
    calendarProps: {
      description: "Props passed to the calendar component",
    },
    onValueChange: {
      description: "Function called when date range selection changes",
      action: "date range changed",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic example of a date range picker component.
 */
export const Basic: Story = {
  args: {
    placeholder: "Select date range",
    formComposition: {
      label: "Booking Period",
      description: "Select the start and end dates for your booking",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Basic date range picker component with label and description.",
      },
    },
  },
}

/**
 * Examples of different date range picker states.
 */
export const DateRangePickerStates: Story = {
  render: () => {
    // Today's date for reference
    const today = new Date()

    return (
      <div className="flex w-full flex-col gap-4">
        <DateRangePicker
          formComposition={{
            label: "Default",
            description: "Interactive date range picker",
          }}
          placeholder="Select date range"
        />

        <DateRangePicker
          formComposition={{
            label: "With default value",
            description: "Pre-selected date range",
          }}
          defaultValue={{
            from: today,
            to: addDays(today, 5),
          }}
        />

        <DateRangePicker
          formComposition={{
            label: "Disabled",
            description: "Cannot be interacted with",
          }}
          placeholder="Select date range"
          disabled
        />

        <DateRangePicker
          formComposition={{
            label: "With custom placeholder",
            description: "Shows custom text when empty",
          }}
          placeholder="Choose your stay dates"
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "DateRangePicker fields in various states including default, with pre-selected date range, disabled, and with custom placeholder.",
      },
    },
  },
}

/**
 * Examples of date range pickers with different label positions.
 */
export const LabelPositioning: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <DateRangePicker
        formComposition={{
          label: "Vertical label (default)",
          description: "Label appears above the date range picker",
        }}
        placeholder="Select date range"
      />

      <DateRangePicker
        formComposition={{
          label: "Horizontal label",
          labelPosition: "horizontal",
          description: "Label appears to the left of the date range picker",
        }}
        placeholder="Select date range"
      />

      <DateRangePicker
        formComposition={{
          label: "Custom layout",
          labelPosition: "horizontal",
          layout: {
            leftColClass: "md:col-span-3",
            rightColClass: "md:col-span-9",
          },
          description: "With custom column sizes",
        }}
        placeholder="Select date range"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "DateRangePicker fields with different label positioning options.",
      },
    },
  },
}

/**
 * DateRangePicker with different calendar constraints.
 */
export const DateRangeRestrictions: Story = {
  render: () => {
    const today = new Date()

    return (
      <div className="flex w-full flex-col gap-4">
        <DateRangePicker
          formComposition={{
            label: "Future dates only",
            description: "Can't select dates before today",
          }}
          calendarProps={{
            disabled: (date) => date < today,
          }}
          placeholder="Select future date range"
        />

        <DateRangePicker
          formComposition={{
            label: "Next 3 months only",
            description: "Can only select dates within the next 3 months",
          }}
          calendarProps={{
            disabled: (date) => date < today || date > addMonths(today, 3),
          }}
          placeholder="Select date range"
        />

        <DateRangePicker
          formComposition={{
            label: "Weekends disabled",
            description: "Can't select weekends",
          }}
          calendarProps={{
            disabled: (date) => {
              const day = getDay(date)
              return day === 0 || day === 6
            },
          }}
          placeholder="Select weekday range"
        />

        <DateRangePicker
          formComposition={{
            label: "Min/max range",
            description: "Must select between 3-7 days",
          }}
          calendarProps={{
            minRange: 3,
            maxRange: 7,
          }}
          placeholder="Select 3-7 day period"
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "DateRangePicker with various restrictions such as future-only dates, date boundaries, disabled weekends, and min/max range requirements.",
      },
    },
  },
}

/**
 * DateRangePicker with custom icons.
 */
export const WithCustomIcon: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <DateRangePicker
        formComposition={{
          label: "Vacation Period",
          description: "Select your vacation dates",
          iconLeft: <Calendar className="text-primary" />,
        }}
        placeholder="Select vacation dates"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "DateRangePicker with custom icon styling.",
      },
    },
  },
}

/**
 * Example of a controlled date range picker.
 */
export const ControlledDateRangePicker: Story = {
  render: () => {
    const today = new Date()
    const [dateRange, setDateRange] = useState<
      { from: Date; to: Date } | undefined
    >({
      from: today,
      to: addDays(today, 7),
    })

    const formatDateRange = (range?: { from?: Date; to?: Date }) => {
      if (!range) return "No date range selected"
      const fromStr = range.from ? format(range.from, "PP") : "..."
      const toStr = range.to ? format(range.to, "PP") : "..."
      return `${fromStr} to ${toStr}`
    }

    const handleDateRangeChange = (value: OnValueChangeDateRangePicker) => {
      if (!value) {
        setDateRange(undefined)
        return
      }

      if (value.from && value.to) {
        setDateRange({ from: value.from, to: value.to })
      }
    }

    return (
      <div className="flex w-full flex-col gap-4">
        <DateRangePicker
          formComposition={{
            label: "Controlled Date Range Picker",
            description: "This component's value is controlled externally",
          }}
          value={dateRange}
          onValueChange={handleDateRangeChange}
        />

        <div className="mt-2 text-sm">
          <p>
            <strong>Selected range:</strong> {formatDateRange(dateRange)}
          </p>
          {dateRange?.from && dateRange?.to && (
            <p className="text-muted-foreground">
              Duration:{" "}
              {(dateRange.to.getTime() - dateRange.from.getTime()) /
                (1000 * 60 * 60 * 24) +
                1}{" "}
              days
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => {
              // This week
              const start = today
              const end = addDays(today, 6)
              setDateRange({ from: start, to: end })
            }}
          >
            This Week
          </Button>

          <Button
            size="sm"
            onClick={() => {
              // Next week
              const start = addDays(today, 7)
              const end = addDays(today, 13)
              setDateRange({ from: start, to: end })
            }}
          >
            Next Week
          </Button>

          <Button
            size="sm"
            onClick={() => {
              // This month
              const start = today
              const end = addDays(addMonths(today, 1), -1)
              setDateRange({ from: start, to: end })
            }}
          >
            This Month
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDateRange(undefined)}
          >
            Clear
          </Button>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Fully controlled DateRangePicker component with external state management and quick selection buttons.",
      },
    },
  },
}

/**
 * Example of a date range picker with confirmation button.
 */
export const WithConfirmation: Story = {
  render: () => (
    <DateRangePicker
      formComposition={{
        label: "Date Range with Confirmation",
        description: "Changes will only apply when confirmed",
      }}
      calendarProps={{
        showConfirmButton: true,
      }}
      placeholder="Select and confirm date range"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "DateRangePicker with a confirmation button. The selected range is only applied after clicking the confirm button.",
      },
    },
  },
}

/**
 * Example of a date range picker in a form with validation.
 */
export const DateRangePickerInForm: Story = {
  render: function FormExample() {
    // Form setup
    const today = new Date()
    const formSchema = z.object({
      bookingPeriod: zodDateRange({
        required_error: "Please select a booking period",
        minDate: today,
        maxDate: addMonths(today, 6),
        minRange: 1,
        maxRange: 14,
      }),
      pastExperience: zodDateRange({
        minDate: subYears(today, 10),
        maxDate: today,
      }).optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        bookingPeriod: {
          from: addDays(today, 1),
          to: addDays(today, 5),
        },
        pastExperience: undefined,
      },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
      const formatRange = (range?: { from?: Date; to?: Date }) => {
        if (!range?.from || !range?.to) return "None"
        return `${format(range.from, "PPP")} to ${format(range.to, "PPP")}`
      }

      alert(
        `Form submitted!\n\n` +
          `Booking Period: ${formatRange(values.bookingPeriod)}\n` +
          `Past Experience: ${formatRange(values.pastExperience)}`
      )
    }

    return (
      <ZodSchemaProvider schema={formSchema}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <DateRangePickerForm
              name="bookingPeriod"
              control={form.control}
              formComposition={{
                label: "Booking Period",
                description: "Select start and end dates (max 14 days)",
                requiredSymbol: true,
              }}
            />

            <DateRangePickerForm
              name="pastExperience"
              control={form.control}
              formComposition={{
                label: "Past Experience (Optional)",
                description: "When did you work with us previously?",
              }}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </ZodSchemaProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "DateRangePicker integrated with React Hook Form and Zod validation. Shows required and optional date range fields with different validation rules.",
      },
    },
  },
}

/**
 * DateRangePicker with different locales.
 */
export const LocalizedDateRangePicker: Story = {
  render: () => {
    const today = new Date()
    const nextWeek = addDays(today, 7)

    return (
      <div className="flex w-full flex-col gap-4">
        <DateRangePicker
          formComposition={{
            label: "Browser Default",
            description: "Using browser's default locale",
          }}
          defaultValue={{
            from: today,
            to: nextWeek,
          }}
        />

        <DateRangePicker
          formComposition={{
            label: "Vietnamese",
            description: "Using Vietnamese locale",
          }}
          defaultValue={{
            from: today,
            to: nextWeek,
          }}
          locale="vi"
        />

        <DateRangePicker
          formComposition={{
            label: "With Confirmation (Default)",
            description: "Confirm selection with browser's default locale",
          }}
          defaultValue={{
            from: today,
            to: nextWeek,
          }}
          calendarProps={{
            showConfirmButton: true,
          }}
        />

        <DateRangePicker
          formComposition={{
            label: "With Confirmation (Vietnamese)",
            description: "Confirm selection with Vietnamese locale",
          }}
          defaultValue={{
            from: today,
            to: nextWeek,
          }}
          locale="vi"
          calendarProps={{
            showConfirmButton: true,
          }}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "DateRangePicker with different locale settings. Shows how the component adapts to different languages and formatting conventions. The default locale is automatically detected from the browser, while the Vietnamese locale explicitly changes month/day names and date formats to match Vietnamese conventions.",
      },
    },
  },
}

// Helper function to subtract years for the past experience example
function subYears(date: Date, years: number) {
  return new Date(date.getFullYear() - years, date.getMonth(), date.getDate())
}
