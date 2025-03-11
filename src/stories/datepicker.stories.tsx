/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker/datepicker";
import { DatePickerForm } from "@/components/ui/datepicker/datepicker-form";
import { Form } from "@/components/ui/form/form";
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context";
import { zodDate } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react";
import { addDays, addMonths, format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/**
 * DatePicker component allows users to select a date with a calendar interface.
 */
const meta = {
  title: "Forms/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
DatePicker components allow users to select a date from a calendar interface.
They can be used to input dates in forms or as standalone components.

## When to use
- When users need to select a specific date
- For form fields that require date input
- When a visual calendar selection is preferable to manual date entry

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
      description: "Text displayed when no date is selected",
    },
    value: {
      description: "Currently selected date (controlled)",
    },
    defaultValue: {
      description: "Default selected date (uncontrolled)",
    },
    disabled: {
      control: "boolean",
      description: "Whether the datepicker is disabled",
    },
    editable: {
      control: "boolean",
      description: "Whether the date can be manually typed",
    },
    inputTime: {
      control: "boolean",
      description: "Whether to include time selection",
    },
    formComposition: {
      description:
        "Configuration for form composition elements like label, help text",
    },
    onValueChange: {
      description: "Function called when date selection changes",
      action: "date changed",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic example of a datepicker component.
 */
export const Basic: Story = {
  args: {
    placeholder: "Select date",
    formComposition: {
      label: "Event Date",
      description: "Select a date for your event",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Basic datepicker component with label and description.",
      },
    },
  },
};

/**
 * Examples of different datepicker states.
 */
export const DatePickerStates: Story = {
  render: () => {
    // Today's date for reference
    const today = new Date();

    return (
      <div className="flex flex-col w-full gap-4">
        <DatePicker
          formComposition={{
            label: "Default",
            description: "Interactive datepicker",
          }}
          placeholder="Select date"
        />

        <DatePicker
          formComposition={{
            label: "With default value",
            description: "Pre-selected date",
          }}
          defaultValue={today}
        />

        <DatePicker
          formComposition={{
            label: "Disabled",
            description: "Cannot be interacted with",
          }}
          placeholder="Select date"
          disabled
        />

        <DatePicker
          formComposition={{
            label: "With custom placeholder",
            description: "Shows custom text when empty",
          }}
          placeholder="Choose event date"
        />

        <DatePicker
          formComposition={{
            label: "With date and time",
            description: "Includes time selection",
          }}
          inputTime
          defaultValue={today}
          editable
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "DatePicker fields in various states including default, with pre-selected date, disabled, and with custom placeholder.",
      },
    },
  },
};

/**
 * Examples of datepickers with different label positions.
 */
export const LabelPositioning: Story = {
  render: () => (
    <div className="flex flex-col w-full gap-4">
      <DatePicker
        formComposition={{
          label: "Vertical label (default)",
          description: "Label appears above the datepicker",
        }}
        placeholder="Select date"
      />

      <DatePicker
        formComposition={{
          label: "Horizontal label",
          labelPosition: "horizontal",
          description: "Label appears to the left of the datepicker",
        }}
        placeholder="Select date"
      />

      <DatePicker
        formComposition={{
          label: "Custom layout",
          labelPosition: "horizontal",
          layout: {
            leftColClass: "md:col-span-3",
            rightColClass: "md:col-span-9",
          },
          description: "With custom column sizes",
        }}
        placeholder="Select date"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "DatePicker fields with different label positioning options.",
      },
    },
  },
};

/**
 * Editable datepicker examples.
 */
export const EditableDatePicker: Story = {
  render: () => (
    <div className="flex flex-col w-full gap-4">
      <DatePicker
        formComposition={{
          label: "Date only",
          description: "Type or select a date",
        }}
        editable
        placeholder="Select date"
      />

      <DatePicker
        formComposition={{
          label: "Date and time",
          description: "Type or select a date and time",
        }}
        editable
        inputTime
        placeholder="Select date and time"
      />

      <DatePicker
        formComposition={{
          label: "With default value",
          description: "Pre-populated date that can be edited",
        }}
        editable
        defaultValue={new Date()}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "DatePicker fields that allow manual text input in addition to calendar selection.",
      },
    },
  },
};

/**
 * DatePicker with date restrictions.
 */
export const DateRestrictions: Story = {
  render: () => {
    const today = new Date();

    return (
      <div className="flex flex-col w-full gap-4">
        <DatePicker
          formComposition={{
            label: "Future dates only",
            description: "Can't select dates before today",
          }}
          calendarProps={{
            disabled: (date) => date < today,
          }}
          placeholder="Select future date"
        />

        <DatePicker
          formComposition={{
            label: "Date range",
            description: "Can only select dates within the next month",
          }}
          calendarProps={{
            disabled: (date) => date < today || date > addMonths(today, 1),
          }}
          placeholder="Select date"
        />

        <DatePicker
          formComposition={{
            label: "Weekend disabled",
            description: "Can't select weekends",
          }}
          calendarProps={{
            disabled: (date) => {
              const day = date.getDay();
              return day === 0 || day === 6;
            },
          }}
          placeholder="Select weekday"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "DatePicker with various date restrictions such as future-only dates, date ranges, and disabled weekends.",
      },
    },
  },
};

/**
 * DatePicker with custom icons.
 */
export const WithCustomIcon: Story = {
  render: () => (
    <div className="flex flex-col w-full gap-4">
      <DatePicker
        formComposition={{
          label: "Event Date",
          description: "Select a date for your event",
          iconLeft: <CalendarIcon className="text-primary" />,
        }}
        placeholder="Select date"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "DatePicker with custom icon styling.",
      },
    },
  },
};

/**
 * Example of a controlled datepicker.
 */
export const ControlledDatePicker: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [dateString, setDateString] = useState<string>(
      format(new Date(), "PPP")
    );

    return (
      <div className="flex flex-col w-full gap-4">
        <DatePicker
          formComposition={{
            label: "Controlled DatePicker",
            description: "This datepicker's value is controlled externally",
          }}
          value={date}
          onValueChange={(newDate) => {
            setDate(newDate);
            setDateString(
              newDate ? format(newDate, "PPP") : "No date selected"
            );
          }}
        />

        <div className="mt-2 text-sm">
          <p>
            <strong>Selected date:</strong> {dateString}
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            onClick={() => {
              const newDate = date ? addDays(date, 1) : new Date();
              setDate(newDate);
              setDateString(format(newDate, "PPP"));
            }}
          >
            Next Day
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const newDate = date ? subDays(date, 1) : new Date();
              setDate(newDate);
              setDateString(format(newDate, "PPP"));
            }}
          >
            Previous Day
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              setDate(undefined);
              setDateString("No date selected");
            }}
          >
            Clear
          </Button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Fully controlled DatePicker component with external state management and date manipulation buttons.",
      },
    },
  },
};

/**
 * Example of a datepicker in a form with validation.
 */
export const DatePickerInForm: Story = {
  render: function FormExample() {
    // Form setup
    const today = new Date();
    const formSchema = z.object({
      eventDate: zodDate({
        required_error: "Please select an event date",
        minDate: today,
        maxDate: addMonths(today, 6),
      }),
      birthDate: zodDate({
        required_error: "Please enter your birth date",
        minDate: new Date(1900, 0, 1),
        maxDate: subDays(today, 1),
      }),
      optionalDate: zodDate().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        eventDate: addDays(today, 7),
        birthDate: undefined,
        optionalDate: undefined,
      },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
      alert(
        `Form submitted!\n\n` +
          `Event Date: ${values.eventDate ? format(values.eventDate, "PPP") : "None"}\n` +
          `Birth Date: ${values.birthDate ? format(values.birthDate, "PPP") : "None"}\n` +
          `Optional Date: ${values.optionalDate ? format(values.optionalDate, "PPP") : "None"}`
      );
    }

    return (
      <ZodSchemaProvider schema={formSchema}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <DatePickerForm
              name="eventDate"
              control={form.control}
              formComposition={{
                label: "Event Date",
                description: "Must be in the next 6 months",
                requiredSymbol: true,
              }}
              calendarProps={{
                disabled: (date) => date < today || date > addMonths(today, 6),
              }}
            />

            <DatePickerForm
              name="birthDate"
              control={form.control}
              formComposition={{
                label: "Date of Birth",
                description: "Must be in the past",
                requiredSymbol: true,
              }}
              editable
            />

            <DatePickerForm
              name="optionalDate"
              control={form.control}
              formComposition={{
                label: "Optional Date",
                description: "This field is optional",
              }}
              inputTime
              editable
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
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "DatePicker integrated with React Hook Form and Zod validation. Shows required and optional date fields with different validation rules.",
      },
    },
  },
};

/**
 * DatePicker with different locales.
 */
export const LocalizedDatePicker: Story = {
  render: () => {
    const today = new Date();

    return (
      <div className="flex flex-col w-full gap-4">
        <DatePicker
          formComposition={{
            label: "Browser Default",
            description: "Using browser's default locale",
          }}
          defaultValue={today}
        />

        <DatePicker
          formComposition={{
            label: "Vietnamese",
            description: "Using Vietnamese locale",
          }}
          defaultValue={today}
          locale="vi"
        />

        <DatePicker
          formComposition={{
            label: "With Date Input (Default)",
            description: "Editable date field with browser's default locale",
          }}
          defaultValue={today}
          editable
        />

        <DatePicker
          formComposition={{
            label: "With Date Input (Vietnamese)",
            description: "Editable date field with Vietnamese locale",
          }}
          defaultValue={today}
          editable
          locale="vi"
        />

        <DatePicker
          formComposition={{
            label: "With Date and Time (Default)",
            description:
              "Date and time selection with browser's default locale",
          }}
          defaultValue={today}
          inputTime
          editable
        />

        <DatePicker
          formComposition={{
            label: "With Date and Time (Vietnamese)",
            description: "Date and time selection with Vietnamese locale",
          }}
          defaultValue={today}
          inputTime
          editable
          locale="vi"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "DatePicker with different locale settings. Shows how the component adapts to different languages and formatting conventions. The default locale is automatically detected from the browser, while the Vietnamese locale explicitly changes month/day names and date formats to match Vietnamese conventions.",
      },
    },
  },
};
