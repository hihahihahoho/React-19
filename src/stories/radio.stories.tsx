import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/form";
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/selection-controls/radio-group";
import {
  ItemRadioType,
  RadioGroupForm,
} from "@/components/ui/selection-controls/radio-group-form";
import { SelectionGroup } from "@/components/ui/selection-controls/selection-group";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/**
 * Radio buttons allow users to select one option from a set.
 * Use radio buttons when the user needs to see all available options and select exactly one.
 */
const meta: Meta<typeof RadioGroup> = {
  title: "Base/Radio",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Radio button components provide a way for users to select a single option from a list of predefined choices.
Unlike checkboxes, radio buttons enforce a single selection within a group and cannot be unchecked directly.

## When to use
- When users need to select exactly one option from a set of mutually exclusive choices
- When all available options can be displayed
- When the user needs to see all options before making a decision
- When options are mutually exclusive and clearly distinct

## Accessibility
- Radio buttons are keyboard accessible and can be navigated using arrow keys
- Always provide visible labels for radio buttons to explain their purpose
- Use proper grouping with fieldset and legend for related radio buttons
- Ensure proper ARIA attributes for custom radio buttons
        `,
      },
    },
  },
  argTypes: {
    defaultValue: {
      control: "text",
      description: "Sets the default selected value in the radio group",
    },
    value: {
      control: "text",
      description: "Controls the selected value in a controlled radio group",
    },
    disabled: {
      control: "boolean",
      description: "When true, prevents user interaction with the radio group",
    },
    required: {
      control: "boolean",
      description: "When true, indicates the field is required",
    },
    onValueChange: {
      description: "Function called when the selected value changes",
      action: "value changed",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the radio group",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

const itemsRadio: ItemRadioType[] = [
  { value: "radioDisabled", label: "Radio disabled", disabled: true },
  { value: "include", label: "Include" },
  { value: "exclude", label: "Exclude" },
  { value: "pending", label: "Pending", disabled: true },
];

const FormSchema = z.object({
  radioGroupDemo: z.enum(["include", "exclude", "pending", "radioDisabled"], {
    required_error: "You need to select an option.",
  }),
});

const RadioFormDemo = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      radioGroupDemo: "radioDisabled",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    alert(`Selected option: ${data.radioGroupDemo}`);
  };

  return (
    <ZodSchemaProvider schema={FormSchema}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <RadioGroupForm
            control={form.control}
            name="radioGroupDemo"
            formComposition={{
              label: "Radio Group",
              description: "Select your preference",
            }}
            items={itemsRadio}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </ZodSchemaProvider>
  );
};

/**
 * Basic radio button variants showing different states.
 */
export const BasicVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <RadioGroup defaultValue="include">
        {itemsRadio.map((item) => {
          const { value, ...props } = item;
          return (
            <SelectionGroup
              key={value}
              control={<RadioGroupItem value={value} {...props} />}
            >
              {item.label}
            </SelectionGroup>
          );
        })}
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Basic radio button variants showing different states including disabled items.",
      },
    },
  },
};

/**
 * Default radio group configuration with automatic layout.
 */
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="radioDisabled">
      {itemsRadio.map((item) => {
        const { value, ...props } = item;
        return (
          <SelectionGroup
            key={value}
            control={<RadioGroupItem value={value} {...props} />}
          >
            {item.label}
          </SelectionGroup>
        );
      })}
    </RadioGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: "Default radio group with standard layout and behavior.",
      },
    },
  },
};

/**
 * Radio buttons with different label positions and styles.
 */
export const LabelVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 text-sm font-medium">Standard Labels</h3>
        <RadioGroup defaultValue="option1">
          <SelectionGroup control={<RadioGroupItem value="option1" />}>
            Standard Radio
          </SelectionGroup>
          <SelectionGroup control={<RadioGroupItem value="option2" />}>
            Another Option
          </SelectionGroup>
        </RadioGroup>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">With Description</h3>
        <RadioGroup defaultValue="detail1">
          <SelectionGroup control={<RadioGroupItem value="detail1" />}>
            <div className="flex flex-col">
              <span>Radio with description</span>
              <span className="text-xs text-muted-foreground">
                Additional details about this option
              </span>
            </div>
          </SelectionGroup>
          <SelectionGroup control={<RadioGroupItem value="detail2" />}>
            <div className="flex flex-col">
              <span>Pre-selected option</span>
              <span className="text-xs text-muted-foreground">
                This is the recommended choice
              </span>
            </div>
          </SelectionGroup>
        </RadioGroup>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Rich Content Labels</h3>
        <RadioGroup defaultValue="plan1">
          <SelectionGroup control={<RadioGroupItem value="plan1" />}>
            <div className="flex items-center gap-2">
              <span className="font-medium">Premium Plan</span>
              <Badge variant={"blue"}>Recommended</Badge>
            </div>
          </SelectionGroup>
          <SelectionGroup control={<RadioGroupItem value="plan2" />}>
            <div className="flex items-center gap-2">
              <span className="font-medium">Enterprise Plan</span>
              <Badge variant={"purple"}>Recommended</Badge>
            </div>
          </SelectionGroup>
        </RadioGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Radio buttons with different label positions and content styles.",
      },
    },
  },
};

/**
 * Complete form with validation using RadioGroupForm and react-hook-form.
 */
export const CompleteForm: Story = {
  render: () => <RadioFormDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Example of a form with radio buttons, validation, and submission using react-hook-form and zod validation.",
      },
    },
  },
};

/**
 * Examples of radio buttons in different layouts.
 */
export const LayoutVariants: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <div>
        <h3 className="mb-2 text-sm font-medium">Vertical Layout</h3>
        <div className="p-4 space-y-2 border rounded-lg">
          <RadioGroup defaultValue="vertical1">
            <SelectionGroup control={<RadioGroupItem value="vertical1" />}>
              Option 1
            </SelectionGroup>
            <SelectionGroup control={<RadioGroupItem value="vertical2" />}>
              Option 2
            </SelectionGroup>
            <SelectionGroup control={<RadioGroupItem value="vertical3" />}>
              Option 3
            </SelectionGroup>
          </RadioGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Horizontal Layout</h3>
        <div className="p-4 border rounded-lg">
          <RadioGroup defaultValue="horizontal1" className="flex gap-6">
            <SelectionGroup control={<RadioGroupItem value="horizontal1" />}>
              Option A
            </SelectionGroup>
            <SelectionGroup control={<RadioGroupItem value="horizontal2" />}>
              Option B
            </SelectionGroup>
            <SelectionGroup control={<RadioGroupItem value="horizontal3" />}>
              Option C
            </SelectionGroup>
          </RadioGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Grid Layout</h3>
        <div className="p-4 border rounded-lg">
          <RadioGroup defaultValue="grid1" className="grid grid-cols-2 gap-2">
            <SelectionGroup control={<RadioGroupItem value="grid1" />}>
              Category 1
            </SelectionGroup>
            <SelectionGroup control={<RadioGroupItem value="grid2" />}>
              Category 2
            </SelectionGroup>
            <SelectionGroup control={<RadioGroupItem value="grid3" />}>
              Category 3
            </SelectionGroup>
            <SelectionGroup control={<RadioGroupItem value="grid4" />}>
              Category 4
            </SelectionGroup>
          </RadioGroup>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Examples of radio button arrangements in different layout patterns.",
      },
    },
  },
};

/**
 * Controlled radio group example with state management.
 */
export const ControlledExample: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState("radio2");

    const options = [
      { value: "radio1", label: "Option 1", description: "First choice" },
      { value: "radio2", label: "Option 2", description: "Second choice" },
      { value: "radio3", label: "Option 3", description: "Third choice" },
    ];

    return (
      <div className="p-4 space-y-3 border rounded-lg w-80">
        <h3 className="text-sm font-medium">Select an option</h3>
        <RadioGroup
          value={value}
          onValueChange={setValue}
          className="space-y-3"
        >
          {options.map((option) => (
            <SelectionGroup
              key={option.value}
              control={<RadioGroupItem value={option.value} />}
            >
              <div className="flex flex-col">
                <span>{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </div>
            </SelectionGroup>
          ))}
        </RadioGroup>
        <div className="pt-2 text-sm">
          Currently selected: <span className="font-medium">{value}</span>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example of a controlled radio group with state management using React useState.",
      },
    },
  },
};

/**
 * Advanced form with complex validation using RadioGroupForm and ZodSchemaProvider.
 */
export const AdvancedForm: Story = {
  render: () => {
    const formSchema = z.object({
      subscriptionPlan: z.enum(["free", "premium", "enterprise"], {
        required_error: "Please select a subscription plan",
      }),
      contactPreference: z.enum(["email", "phone", "mail"], {
        required_error: "Please select how you'd like to be contacted",
      }),
    });

    function AdvancedFormExample() {
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          subscriptionPlan: "free",
          contactPreference: undefined,
        },
      });

      const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
        alert(
          `Form submitted with:\nPlan: ${data.subscriptionPlan}\nContact Preference: ${data.contactPreference}`
        );
      };

      const subscriptionPlans = [
        {
          value: "free",
          label: "Free Plan",
          description: "Basic features for personal use",
        },
        {
          value: "premium",
          label: "Premium Plan",
          description: "Advanced features for professionals",
        },
        {
          value: "enterprise",
          label: "Enterprise Plan",
          description: "Full feature set for organizations",
        },
      ];

      const contactMethods = [
        { value: "email", label: "Email" },
        { value: "phone", label: "Phone" },
        { value: "mail", label: "Mail", disabled: true },
      ];

      return (
        <ZodSchemaProvider schema={formSchema}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-4 space-y-6 border rounded-lg w-96"
            >
              <RadioGroupForm
                control={form.control}
                name="subscriptionPlan"
                formComposition={{
                  label: "Subscription Plan",
                  description: "Select the plan that works for you",
                }}
                selectionGroup={{
                  variant: "card",
                }}
                items={subscriptionPlans.map((plan) => ({
                  value: plan.value,
                  label: (
                    <div className="flex flex-col">
                      <span className="font-medium">{plan.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {plan.description}
                      </span>
                    </div>
                  ),
                }))}
                className="grid-cols-1 gap-4"
              />

              <RadioGroupForm
                control={form.control}
                name="contactPreference"
                formComposition={{
                  label: "Contact Preference",
                  description: "How should we contact you?",
                }}
                items={contactMethods}
              />

              <Button type="submit" className="w-full">
                Complete Subscription
              </Button>
            </form>
          </Form>
        </ZodSchemaProvider>
      );
    }

    return <AdvancedFormExample />;
  },
  parameters: {
    docs: {
      description: {
        story:
          "Advanced form example with multiple radio groups and complex validation.",
      },
    },
  },
};

/**
 * Custom styled radio buttons for different visual appearances.
 */
export const CustomStyledRadios: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div className="p-4 space-y-3 border rounded-lg">
        <h3 className="mb-2 text-sm font-medium">Payment Methods</h3>
        <RadioGroup defaultValue="credit">
          <SelectionGroup
            control={
              <RadioGroupItem
                value="credit"
                className="text-blue-500 border-blue-500"
              />
            }
          >
            <div className="flex flex-col">
              <span className="font-medium">Credit Card</span>
              <span className="text-xs text-muted-foreground">
                Pay securely with your card
              </span>
            </div>
          </SelectionGroup>

          <SelectionGroup
            control={
              <RadioGroupItem
                value="paypal"
                className="text-purple-500 border-purple-500"
              />
            }
          >
            <div className="flex flex-col">
              <span className="font-medium">PayPal</span>
              <span className="text-xs text-muted-foreground">
                Fast and secure payment
              </span>
            </div>
          </SelectionGroup>

          <SelectionGroup
            control={
              <RadioGroupItem
                value="bank"
                className="text-green-500 border-green-500"
              />
            }
          >
            <div className="flex flex-col">
              <span className="font-medium">Bank Transfer</span>
              <span className="text-xs text-muted-foreground">
                Direct payment from your bank
              </span>
            </div>
          </SelectionGroup>
        </RadioGroup>
      </div>

      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
        <RadioGroup defaultValue="large" className="space-y-2">
          <SelectionGroup
            control={<RadioGroupItem value="large" className="w-5 h-5" />}
          >
            <span className="font-medium">Large radio style</span>
          </SelectionGroup>
          <SelectionGroup
            control={<RadioGroupItem value="small" className="w-3 h-3" />}
          >
            <span className="font-medium">Small radio style</span>
          </SelectionGroup>
        </RadioGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Examples of customized radio button styles using CSS classes.",
      },
    },
  },
};

/**
 * Card variant of SelectionGroup for more prominent radio options.
 */
export const CardVariants: Story = {
  render: () => (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
      <RadioGroup defaultValue="option2">
        <SelectionGroup
          variant="card"
          control={<RadioGroupItem value="option1" />}
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
          control={<RadioGroupItem value="option2" />}
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
          control={<RadioGroupItem value="option3" disabled />}
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
          control={<RadioGroupItem value="option4" />}
        >
          <div className="ml-2">
            <h3 className="font-medium">Enterprise Plan</h3>
            <p className="text-sm text-muted-foreground">
              Custom solutions for large organizations
            </p>
          </div>
        </SelectionGroup>
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The card variant of SelectionGroup provides a more prominent visual container for radio options. It shows a border around the entire content and highlights the selected item with a primary-colored ring.",
      },
    },
  },
};

/**
 * A comprehensive showcase of all radio button variants and use cases.
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div className="grid w-full max-w-2xl gap-6">
      <div>
        <h3 className="mb-2 text-sm font-medium">Basic States</h3>
        <div className="p-4 border rounded-lg">
          <RadioGroup defaultValue="checked">
            <div className="flex flex-wrap gap-6">
              <SelectionGroup control={<RadioGroupItem value="unchecked" />}>
                Unchecked
              </SelectionGroup>
              <SelectionGroup control={<RadioGroupItem value="checked" />}>
                Checked
              </SelectionGroup>
              <SelectionGroup
                control={<RadioGroupItem value="disabled" disabled />}
              >
                Disabled
              </SelectionGroup>
              <SelectionGroup
                control={<RadioGroupItem value="disabledChecked" disabled />}
              >
                Disabled & Selected
              </SelectionGroup>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Common Use Cases</h3>
        <div className="p-4 space-y-4 border rounded-lg">
          <h4 className="text-sm font-medium">Shipping Options</h4>
          <RadioGroup defaultValue="standard">
            <SelectionGroup control={<RadioGroupItem value="standard" />}>
              <div className="flex justify-between w-full">
                <span>Standard Shipping</span>
                <span className="font-medium">Free</span>
              </div>
            </SelectionGroup>
            <SelectionGroup control={<RadioGroupItem value="express" />}>
              <div className="flex justify-between w-full">
                <span>Express Shipping</span>
                <span className="font-medium">$9.99</span>
              </div>
            </SelectionGroup>
            <SelectionGroup control={<RadioGroupItem value="overnight" />}>
              <div className="flex justify-between w-full">
                <span>Overnight Shipping</span>
                <span className="font-medium">$19.99</span>
              </div>
            </SelectionGroup>
          </RadioGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">With Icons</h3>
        <div className="p-4 space-y-2 border rounded-lg">
          <RadioGroup defaultValue="card" className="space-y-2">
            <SelectionGroup control={<RadioGroupItem value="card" />}>
              <div className="flex items-center">
                <span className="mr-2">💳</span>
                <span>Credit Card</span>
              </div>
            </SelectionGroup>
            <SelectionGroup control={<RadioGroupItem value="paypal" />}>
              <div className="flex items-center">
                <span className="mr-2">🅿️</span>
                <span>PayPal</span>
              </div>
            </SelectionGroup>
            <SelectionGroup control={<RadioGroupItem value="bank" />}>
              <div className="flex items-center">
                <span className="mr-2">🏦</span>
                <span>Bank Transfer</span>
              </div>
            </SelectionGroup>
          </RadioGroup>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A comprehensive showcase displaying radio button variations and common use cases.",
      },
    },
  },
};

/**
 * Fully interactive example with all available props.
 */
export const Interactive: Story = {
  args: {
    defaultValue: "option1",
    disabled: false,
    required: false,
  },
  render: (args) => (
    <RadioGroup {...args}>
      <SelectionGroup control={<RadioGroupItem value="option1" />}>
        First Option
      </SelectionGroup>
      <SelectionGroup control={<RadioGroupItem value="option2" />}>
        Second Option
      </SelectionGroup>
      <SelectionGroup control={<RadioGroupItem value="option3" disabled />}>
        Third Option (Disabled)
      </SelectionGroup>
    </RadioGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A fully interactive radio group that can be customized using the Controls panel.",
      },
    },
  },
};
