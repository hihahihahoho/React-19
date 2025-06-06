import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import {
  InputNumber,
  OnValueChangeInputNumber,
} from "@/components/ui/input/input-number"
import { InputNumberForm } from "@/components/ui/input/input-number-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { DollarSign, Hash, Percent, TrendingUp } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

/**
 * InputNumber component allows users to enter numeric values with formatting.
 * Use when you need validated and formatted number entry.
 */
const meta = {
  title: "Forms/Input Number",
  component: InputNumber,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
InputNumber components are specialized inputs for numeric data with formatting capabilities.
They support thousands separators, decimal places, and min/max constraints.

## When to use
- To collect numeric data from users
- When you need formatted numbers (currency, percentages, etc.)
- For numeric data that requires specific validation
        `,
      },
    },
  },
  argTypes: {
    maskitoOptions: {
      description: "Configuration options for number formatting",
    },
    value: {
      control: "number",
      description: "Current value of the input",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text displayed when the input is empty",
    },
    disabled: {
      control: "boolean",
      description: "When true, prevents user interaction with the input",
    },
    readOnly: {
      control: "boolean",
      description: "When true, makes the input read-only",
    },
    formComposition: {
      description:
        "Configuration for form composition elements like label, help text, etc.",
    },
    onValueChange: {
      description: "Function called when the input value changes",
      action: "value changed",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center md:w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputNumber>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default input number with formatting
 */
export const Default: Story = {
  args: {
    placeholder: "Enter number",
    value: 100000,
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(args.value)

    const handleIncrease = () => {
      setValue((prevValue) => (prevValue || 0) + 1)
    }

    const handleValueChange = (value: OnValueChangeInputNumber) => {
      setValue(value.unMaskedValue)
    }

    return (
      <div className="w-[250px] space-y-4">
        <InputNumber
          {...args}
          value={value}
          onValueChange={handleValueChange}
          formComposition={{ label: "Amount" }}
        />
        <Button onClick={handleIncrease}>Increase Number</Button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Basic number input with thousand separators and formatting.",
      },
    },
  },
}

/**
 * Examples of different number formatting options
 */
export const FormattingOptions: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <InputNumber
        formComposition={{
          label: "Integer (default)",
          description: "No decimal places",
        }}
        placeholder="Enter whole number"
        defaultValue={1234567}
      />

      <InputNumber
        formComposition={{
          label: "With decimals",
          description: "2 decimal places",
        }}
        placeholder="Enter decimal number"
        defaultValue={1234.56}
        maskitoOptions={{
          precision: 2,
        }}
      />

      <InputNumber
        formComposition={{
          label: "Custom separators",
          description: "Space as thousands separator, comma for decimals",
        }}
        placeholder="European format"
        defaultValue={9876.54}
        maskitoOptions={{
          precision: 2,
          thousandSeparator: " ",
          decimalSeparator: ",",
        }}
      />

      <InputNumber
        formComposition={{
          label: "Min/Max constraints",
          description: "Value between 0-100",
        }}
        placeholder="Enter percentage"
        defaultValue={75}
        maskitoOptions={{
          min: 0,
          max: 100,
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Different number formatting options using maskito configuration.",
      },
    },
  },
}

/**
 * InputNumber with various visual customizations
 */
export const WithCustomization: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <InputNumber
        formComposition={{
          label: "Amount",
          prefix: <span className="text-muted-foreground">$</span>,
          iconLeft: <DollarSign />,
        }}
        placeholder="Enter amount"
        defaultValue={1250}
        maskitoOptions={{ precision: 2 }}
      />

      <InputNumber
        formComposition={{
          label: "Percentage",
          suffix: <span className="text-muted-foreground">%</span>,
          iconRight: <Percent />,
        }}
        placeholder="Enter percentage"
        defaultValue={85}
        maskitoOptions={{ max: 100 }}
      />

      <InputNumber
        formComposition={{
          label: "Exchange Rate",
          prefix: <TrendingUp className="size-4 text-muted-foreground" />,
          inputClear: true,
          description: "Current exchange rate",
        }}
        placeholder="Enter rate"
        defaultValue={1.256}
        maskitoOptions={{ precision: 3 }}
      />

      <InputNumber
        formComposition={{
          label: "Quantity",
          variant: "white",
          suffixOutside: (
            <Button variant="outline" size="sm">
              Apply
            </Button>
          ),
        }}
        placeholder="Enter quantity"
        defaultValue={10}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "InputNumber with icons, prefixes, suffixes, and other customizations.",
      },
    },
  },
}

/**
 * InputNumber in different states
 */
export const InputStates: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <InputNumber
        formComposition={{
          label: "Default",
          description: "Regular input",
        }}
        placeholder="Enter number"
        defaultValue={1500}
      />

      <InputNumber
        formComposition={{
          label: "Disabled",
          description: "Cannot be edited",
        }}
        placeholder="Disabled input"
        defaultValue={2500}
        disabled
      />

      <InputNumber
        formComposition={{
          label: "Read-only",
          description: "Cannot be changed",
        }}
        placeholder="Read-only input"
        defaultValue={3500}
        readOnly
      />

      <InputNumber
        formComposition={{
          label: "With Error",
          customError: "Value must be positive",
          iconLeft: <Hash />,
        }}
        placeholder="Enter number"
        defaultValue={-100}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "InputNumber fields in various interactive states.",
      },
    },
  },
}

/**
 * Form with InputNumber validation
 */
export const WithFormValidation: Story = {
  render: () => {
    const formSchema = z.object({
      price: z.number().min(10, "Price must be at least $10"),
      quantity: z
        .number()
        .min(1, "Quantity must be at least 1")
        .max(100, "Maximum quantity is 100"),
      discount: z
        .number()
        .min(0, "Discount cannot be negative")
        .max(100, "Maximum discount is 100%"),
    })

    function FormExample() {
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          price: 0,
          quantity: 1,
          discount: 0,
        },
      })

      const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
        const total =
          values.price * values.quantity * (1 - values.discount / 100)
        alert(
          `Order Summary:\n` +
            `Price: $${values.price}\n` +
            `Quantity: ${values.quantity}\n` +
            `Discount: ${values.discount}%\n` +
            `Total: $${total.toFixed(2)}`
        )
      }

      return (
        <ZodSchemaProvider schema={formSchema}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <InputNumberForm
                name="price"
                control={form.control}
                maskitoOptions={{ precision: 2 }}
                formComposition={{
                  label: "Price ($)",
                  iconLeft: <DollarSign />,
                }}
                placeholder="Enter price"
              />

              <InputNumberForm
                name="quantity"
                control={form.control}
                formComposition={{
                  label: "Quantity",
                  iconLeft: <Hash />,
                }}
                placeholder="Enter quantity"
              />

              <InputNumberForm
                name="discount"
                control={form.control}
                formComposition={{
                  label: "Discount",
                  suffix: <span className="text-muted-foreground">%</span>,
                  iconLeft: <Percent />,
                }}
                placeholder="Enter discount"
              />

              <Button type="submit" className="w-full">
                Calculate Total
              </Button>
            </form>
          </Form>
        </ZodSchemaProvider>
      )
    }

    return <FormExample />
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example of form validation using react-hook-form and zod with InputNumberForm component.",
      },
    },
  },
}
