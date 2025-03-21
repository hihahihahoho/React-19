import { Badge } from "@/components/ui/badge/badge"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import { Checkbox } from "@/components/ui/selection-controls/checkbox"
import { CheckboxForm } from "@/components/ui/selection-controls/checkbox-form"
import { CheckboxGroupForm } from "@/components/ui/selection-controls/checkbox-group-form"
import { SelectionGroup } from "@/components/ui/selection-controls/selection-group"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

/**
 * Checkbox component allows users to select one or multiple items from a list.
 * Use checkboxes when users need to make multiple selections or toggle options on/off.
 */
const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Checkbox components provide a way for users to select multiple options from a set or toggle a single option on or off.
They can be used individually or in groups and support various states like checked, unchecked, indeterminate, and disabled.

## When to use
- When users need to select multiple items from a list
- For binary choices like accepting terms and conditions
- For toggling features or settings on/off
- When creating selectable lists of options

## Accessibility
- Checkboxes are keyboard accessible and can be toggled using the Space key
- Always provide visible labels for checkboxes to explain their purpose
- Use proper ARIA attributes for custom checkboxes
- Group related checkboxes with appropriate labels for screen readers
        `,
      },
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Controls whether the checkbox is checked or not",
    },
    defaultChecked: {
      control: "boolean",
      description: "Sets the initial checked state of an uncontrolled checkbox",
    },
    disabled: {
      control: "boolean",
      description: "When true, prevents user interaction with the checkbox",
    },
    required: {
      control: "boolean",
      description: "When true, indicates the field is required",
    },
    onCheckedChange: {
      description: "Function called when the checkbox state changes",
      action: "checked changed",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the checkbox",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The basic checkbox variants showing different states.
 */
export const BasicVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <SelectionGroup control={<Checkbox />}>Unchecked</SelectionGroup>
      <SelectionGroup control={<Checkbox defaultChecked />}>
        Checked
      </SelectionGroup>
      <SelectionGroup control={<Checkbox disabled />}>Disabled</SelectionGroup>
      <SelectionGroup control={<Checkbox disabled defaultChecked />}>
        Disabled & Checked
      </SelectionGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Basic checkbox variants showing different states.",
      },
    },
  },
}

/**
 * Checkboxes with different label positions and styles.
 */
export const LabelVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 text-sm font-medium">Standard Labels</h3>
        <div className="flex flex-wrap gap-4">
          <SelectionGroup control={<Checkbox />}>
            Standard Checkbox
          </SelectionGroup>
          <SelectionGroup control={<Checkbox defaultChecked />}>
            Checked Checkbox
          </SelectionGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">With Description</h3>
        <div className="space-y-4">
          <SelectionGroup control={<Checkbox />}>
            Checkbox with description
          </SelectionGroup>
          <SelectionGroup control={<Checkbox defaultChecked />}>
            Pre-selected option
          </SelectionGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Rich Content Labels</h3>
        <div className="space-y-4">
          <SelectionGroup control={<Checkbox />}>
            <div className="flex items-center gap-2">
              <span className="font-medium">Premium Plan</span>
              <Badge variant={"blue"}>Recommended</Badge>
            </div>
          </SelectionGroup>
          <SelectionGroup control={<Checkbox />}>
            <div className="flex items-center gap-2">
              <span className="font-medium">Enterprise Plan</span>
              <Badge variant={"green"}>New</Badge>
            </div>
          </SelectionGroup>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Checkboxes with different label positions and content styles.",
      },
    },
  },
}

/**
 * Example of checkboxes in a list with different states.
 */
export const CheckboxList: Story = {
  render: () => {
    const options = [
      { id: "1", label: "Email notifications", checked: true },
      { id: "2", label: "Push notifications", checked: false },
      { id: "3", label: "Monthly newsletter", checked: true },
      { id: "4", label: "Marketing emails", checked: false, disabled: true },
      { id: "5", label: "Product updates", checked: false },
    ]

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [items, setItems] = useState(options)

    const handleCheckedChange = (id: string, checked: boolean) => {
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, checked } : item))
      )
    }

    return (
      <div className="w-72 space-y-2 rounded-lg border p-4">
        <h3 className="mb-3 font-medium">Notification Settings</h3>
        {items.map((item) => (
          <SelectionGroup
            key={item.id}
            control={
              <Checkbox
                checked={item.checked}
                disabled={item.disabled}
                onCheckedChange={(checked) =>
                  handleCheckedChange(item.id, checked === true)
                }
              />
            }
          >
            {item.label}
          </SelectionGroup>
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example of checkboxes in a list representing settings or preferences.",
      },
    },
  },
}

/**
 * Checkbox group organized within a Form component.
 */
export const CheckboxGroupExample: Story = {
  render: () => {
    const formSchema = z.object({
      notificationPreferences: z
        .array(z.string())
        .min(2, { message: "Please select at least 2 notification channels" }),
    })

    function CheckboxGroupFormExample() {
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          notificationPreferences: ["email"],
        },
      })

      const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data)
        alert(
          `Selected preferences: ${data.notificationPreferences.join(", ")}`
        )
      }

      const items = [
        { value: "email", label: "Email" },
        { value: "sms", label: "SMS" },
        { value: "push", label: "Push notifications" },
        { value: "in_app", label: "In-app notifications" },
        { value: "none", label: "None", disabled: true },
      ]

      return (
        <ZodSchemaProvider schema={formSchema}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-96 space-y-6 rounded-lg border p-4"
            >
              <CheckboxGroupForm
                control={form.control}
                name="notificationPreferences"
                items={items}
                formComposition={{
                  label: "Notification Preferences",
                  description: "Select at least 2 notification channels",
                }}
                className="grid-cols-1"
              />

              <Button type="submit" className="w-full">
                Save Preferences
              </Button>
            </form>
          </Form>
        </ZodSchemaProvider>
      )
    }

    return <CheckboxGroupFormExample />
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example of a checkbox group with form handling, validation, and submission using ZodSchemaProvider and react-hook-form.",
      },
    },
  },
}
/**
 * Examples of using checkboxes in different layouts.
 */
export const LayoutVariants: Story = {
  render: () => (
    <div className="w-96 space-y-8">
      <div>
        <h3 className="mb-2 text-sm font-medium">Vertical Layout</h3>
        <div className="space-y-2 rounded-lg border p-4">
          <SelectionGroup control={<Checkbox />}>Option 1</SelectionGroup>
          <SelectionGroup control={<Checkbox />}>Option 2</SelectionGroup>
          <SelectionGroup control={<Checkbox />}>Option 3</SelectionGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Horizontal Layout</h3>
        <div className="flex flex-wrap gap-6 rounded-lg border p-4">
          <SelectionGroup control={<Checkbox />}>Option A</SelectionGroup>
          <SelectionGroup control={<Checkbox />}>Option B</SelectionGroup>
          <SelectionGroup control={<Checkbox />}>Option C</SelectionGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Grid Layout</h3>
        <div className="grid grid-cols-2 gap-2 rounded-lg border p-4">
          <SelectionGroup control={<Checkbox />}>Category 1</SelectionGroup>
          <SelectionGroup control={<Checkbox />}>Category 2</SelectionGroup>
          <SelectionGroup control={<Checkbox />}>Category 3</SelectionGroup>
          <SelectionGroup control={<Checkbox />}>Category 4</SelectionGroup>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Examples of checkbox arrangements in different layout patterns.",
      },
    },
  },
}

/**
 * Controlled checkbox example with indeterminate state.
 */
/**
 * Controlled checkbox example with indeterminate state.
 */
/**
 * Controlled checkbox example with indeterminate state.
 */
export const IndeterminateExample: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [options, setOptions] = useState([
      { id: "option1", label: "Option 1", checked: false },
      { id: "option2", label: "Option 2", checked: false },
      { id: "option3", label: "Option 3", checked: false },
    ])

    // Determine the state of the parent checkbox
    const allChecked = options.every((option) => option.checked)
    const someChecked = options.some((option) => option.checked)

    const handleParentChange = (checked: boolean) => {
      setOptions(options.map((option) => ({ ...option, checked })))
    }

    const handleChildChange = (id: string, checked: boolean) => {
      setOptions(
        options.map((option) =>
          option.id === id ? { ...option, checked } : option
        )
      )
    }

    return (
      <div className="w-72 space-y-3 rounded-lg border p-4">
        <SelectionGroup
          control={
            <Checkbox
              checked={allChecked || (someChecked && "indeterminate")}
              onCheckedChange={handleParentChange}
              aria-label="Select all options"
            />
          }
        >
          <span className="font-medium">Select All Options</span>
        </SelectionGroup>

        <div className="ml-6 space-y-2 border-l pl-3">
          {options.map((option) => (
            <SelectionGroup
              key={option.id}
              control={
                <Checkbox
                  checked={option.checked}
                  onCheckedChange={(checked) =>
                    handleChildChange(option.id, checked === true)
                  }
                />
              }
            >
              {option.label}
            </SelectionGroup>
          ))}
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example of a parent checkbox with indeterminate state when some child options are selected. Uses the same pattern as in data tables.",
      },
    },
  },
}
/**
 * Complex form with validation using CheckboxForm and react-hook-form.
 */
export const WithFormValidation: Story = {
  render: () => {
    const formSchema = z.object({
      acceptTerms: z.boolean().refine((value) => value === true, {
        message: "You must accept the terms and conditions.",
      }),
      preferences: z.array(z.string()).min(1, {
        message: "Please select at least one preference.",
      }),
    })

    function FormValidationExample() {
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          acceptTerms: false,
          preferences: [],
        },
      })

      const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data)
        alert(
          `Form submitted with:\nTerms Accepted: ${
            data.acceptTerms
          }\nPreferences: ${data.preferences.join(", ")}`
        )
      }

      return (
        <ZodSchemaProvider schema={formSchema}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-96 space-y-6 rounded-lg border p-6"
            >
              <CheckboxGroupForm
                control={form.control}
                name="preferences"
                formComposition={{
                  label: "Your Interests",
                  description: "Select at least one area of interest",
                }}
                items={[
                  { value: "technology", label: "Technology" },
                  { value: "design", label: "Design" },
                  { value: "business", label: "Business" },
                  { value: "marketing", label: "Marketing" },
                  { value: "development", label: "Development" },
                  { value: "other", label: "Other" },
                ]}
                className="grid-cols-1"
              />

              <CheckboxForm
                control={form.control}
                name="acceptTerms"
                formComposition={{
                  description: form.formState.errors.acceptTerms
                    ? form.formState.errors.acceptTerms.message
                    : undefined,
                }}
              >
                I accept the terms and conditions
              </CheckboxForm>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </ZodSchemaProvider>
      )
    }

    return <FormValidationExample />
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example of form validation with checkboxes using react-hook-form and zod.",
      },
    },
  },
}

/**
 * Custom styled checkboxes for different visual appearances.
 */
export const CustomStyledCheckboxes: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      <div className="space-y-3 rounded-lg border p-4">
        <h3 className="mb-2 text-sm font-medium">Feature Selection</h3>

        <SelectionGroup
          control={
            <Checkbox className="border-blue-500 data-[state=checked]:bg-blue-500" />
          }
        >
          <div className="flex flex-col">
            <span className="font-medium">Analytics Dashboard</span>
            <span className="text-xs text-muted-foreground">
              Track your app performance
            </span>
          </div>
        </SelectionGroup>

        <SelectionGroup
          control={
            <Checkbox className="border-purple-500 data-[state=checked]:bg-purple-500" />
          }
        >
          <div className="flex flex-col">
            <span className="font-medium">Team Collaboration</span>
            <span className="text-xs text-muted-foreground">
              Work together seamlessly
            </span>
          </div>
        </SelectionGroup>

        <SelectionGroup
          control={
            <Checkbox className="border-green-500 data-[state=checked]:bg-green-500" />
          }
        >
          <div className="flex flex-col">
            <span className="font-medium">API Access</span>
            <span className="text-xs text-muted-foreground">
              Connect with your tools
            </span>
          </div>
        </SelectionGroup>
      </div>

      <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
        <SelectionGroup
          control={
            <Checkbox className="h-5 w-5 rounded-full data-[state=checked]:bg-primary" />
          }
        >
          <span className="font-medium">Round checkbox style</span>
        </SelectionGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Examples of customized checkbox styles using CSS classes.",
      },
    },
  },
}

/**
 * A comprehensive showcase of all checkbox variants and use cases.
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div className="grid w-full max-w-2xl gap-6">
      <div>
        <h3 className="mb-2 text-sm font-medium">Basic States</h3>
        <div className="flex flex-wrap gap-6 rounded-lg border p-4">
          <SelectionGroup control={<Checkbox />}>Unchecked</SelectionGroup>
          <SelectionGroup control={<Checkbox defaultChecked />}>
            Checked
          </SelectionGroup>
          <SelectionGroup control={<Checkbox disabled />}>
            Disabled
          </SelectionGroup>
          <SelectionGroup control={<Checkbox disabled defaultChecked />}>
            Checked & Disabled
          </SelectionGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">With Status Indicators</h3>
        <div className="space-y-2 rounded-lg border p-4">
          <SelectionGroup control={<Checkbox defaultChecked />}>
            Verified Option
          </SelectionGroup>
          <SelectionGroup control={<Checkbox />}>
            Information Available
          </SelectionGroup>
          <SelectionGroup control={<Checkbox />}>
            Requires Attention
          </SelectionGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Common Use Cases</h3>
        <div className="space-y-4 rounded-lg border p-4">
          <SelectionGroup control={<Checkbox />}>
            Subscribe to newsletter
          </SelectionGroup>

          <SelectionGroup control={<Checkbox />}>
            <div className="flex items-center">
              <span>Remember me</span>
              <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs">
                Secure
              </span>
            </div>
          </SelectionGroup>

          <SelectionGroup control={<Checkbox />}>
            <div className="flex items-center gap-1">
              <span>I agree to the</span>
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>
              <span>and</span>
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </div>
          </SelectionGroup>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A comprehensive showcase displaying checkbox variations and common use cases.",
      },
    },
  },
}

/**
 * Card variant of SelectionGroup for more prominent selection options.
 */
export const CardVariants: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = useState<string[]>(["option2"])

    const handleToggle = (value: string) => {
      setSelected((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      )
    }

    const isSelected = (value: string) => selected.includes(value)

    return (
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectionGroup
          variant="card"
          control={
            <Checkbox
              checked={isSelected("option1")}
              onCheckedChange={() => handleToggle("option1")}
            />
          }
        >
          <div className="ml-2">
            <h3 className="font-medium">Basic Plan</h3>
            <p className="text-sm text-muted-foreground">
              All essential features for beginners
            </p>
          </div>
        </SelectionGroup>

        <SelectionGroup
          variant="card"
          control={
            <Checkbox
              checked={isSelected("option2")}
              onCheckedChange={() => handleToggle("option2")}
            />
          }
        >
          <div className="ml-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Premium Plan</h3>
              <Badge variant={"blue"}>Popular</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced features with priority support
            </p>
          </div>
        </SelectionGroup>

        <SelectionGroup
          variant="card"
          control={
            <Checkbox
              checked={isSelected("option3")}
              onCheckedChange={() => handleToggle("option3")}
              disabled
            />
          }
        >
          <div className="ml-2">
            <h3 className="font-medium">Team Plan</h3>
            <p className="text-sm text-muted-foreground">
              Collaboration tools for teams (disabled)
            </p>
          </div>
        </SelectionGroup>

        <SelectionGroup
          variant="card"
          control={
            <Checkbox
              checked={isSelected("option4")}
              onCheckedChange={() => handleToggle("option4")}
            />
          }
        >
          <div className="ml-2">
            <h3 className="font-medium">Enterprise Plan</h3>
            <p className="text-sm text-muted-foreground">
              Custom solutions for large organizations
            </p>
          </div>
        </SelectionGroup>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "The card variant of SelectionGroup provides a more prominent visual container for checkbox options. It shows a border around the entire content and highlights the selected items with a primary-colored ring.",
      },
    },
  },
}
