import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/form";
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context";
import { InputAutoComplete } from "@/components/ui/input/input-auto-complete";
import { InputAutoCompleteForm } from "@/components/ui/input/input-auto-complete-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react";
import { Globe, Map, Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/**
 * InputAutoComplete component provides search functionality with autocomplete suggestions.
 * Use it when users need to select from predefined options while still allowing typing.
 */
const meta = {
  title: "Forms/InputAutoComplete",
  component: InputAutoComplete,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
InputAutoComplete provides an enhanced input field with dropdown suggestions as users type.
It supports two modes: "default" (free typing with suggestions) and "select" (only selected options are valid).

## When to use
- When users need to search from a set of predefined options
- For form fields where users should select from a list of valid choices
- When providing typeahead functionality to improve user experience

## Accessibility
- Handles keyboard navigation through suggestions
- Provides clear feedback on selection state
- Works with screen readers for accessibility
        `,
      },
    },
  },
  argTypes: {
    options: {
      description: "Array of options to display in the dropdown",
    },
    mode: {
      control: "radio",
      options: ["default", "select"],
      description:
        '"default": what you type is what you get, "select": only selected options are valid',
      table: {
        defaultValue: { summary: "default" },
      },
    },
    loading: {
      control: "boolean",
      description: "Whether the component is in a loading state",
    },
    minCharToSearch: {
      control: "number",
      description:
        "Minimum number of characters required before showing suggestions",
      table: {
        defaultValue: { summary: "1" },
      },
    },
    initialState: {
      description: "Content to display before search is triggered",
    },
    value: {
      control: "text",
      description: "Current value of the input",
    },
    onValueChange: {
      description: "Function called when the input value changes",
      action: "value changed",
    },
    popoverContentProps: {
      description: "Props to pass to the popover content component",
    },
    formComposition: {
      description:
        "Configuration for form composition elements like label, help text, etc.",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center md:w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputAutoComplete>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for autocomplete options
const countryOptions = [
  { value: "United States", icon: "https://flagsapi.com/US/flat/64.png" },
  { value: "Canada", icon: "https://flagsapi.com/CA/flat/64.png" },
  { value: "Mexico", icon: "https://flagsapi.com/MX/flat/64.png" },
  { value: "United Kingdom", icon: "https://flagsapi.com/GB/flat/64.png" },
  { value: "France", icon: "https://flagsapi.com/FR/flat/64.png" },
  { value: "Germany", icon: "https://flagsapi.com/DE/flat/64.png" },
  { value: "Italy", icon: "https://flagsapi.com/IT/flat/64.png" },
  { value: "Spain", icon: "https://flagsapi.com/ES/flat/64.png" },
  { value: "Australia", icon: "https://flagsapi.com/AU/flat/64.png" },
  { value: "South Africa", icon: "https://flagsapi.com/ZA/flat/64.png" },
  { value: "Japan", icon: "https://flagsapi.com/JP/flat/64.png" },
  { value: "China", icon: "https://flagsapi.com/CN/flat/64.png" },
  { value: "India", icon: "https://flagsapi.com/IN/flat/64.png" },
  { value: "Brazil", icon: "https://flagsapi.com/BR/flat/64.png" },
];

const cityOptions = [
  { value: "New York City" },
  { value: "Los Angeles" },
  { value: "Chicago" },
  { value: "Houston" },
  { value: "Philadelphia" },
  { value: "Phoenix" },
  { value: "San Francisco" },
  { value: "Seattle" },
  { value: "Miami" },
  { value: "Denver" },
];

const fruitOptions = {
  heading: "Fruits",
  options: [
    { value: "Apple" },
    { value: "Banana" },
    { value: "Orange" },
    { value: "Grape" },
    { value: "Kiwi" },
  ],
};

const vegetableOptions = {
  heading: "Vegetables",
  options: [
    { value: "Carrot" },
    { value: "Broccoli" },
    { value: "Spinach" },
    { value: "Potato" },
    { value: "Onion" },
  ],
};

/**
 * Basic usage of the InputAutoComplete component.
 */
export const Basic: Story = {
  render: () => (
    <InputAutoComplete
      options={countryOptions}
      formComposition={{ label: "Country" }}
      placeholder="Type to search countries"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: "Basic usage of InputAutoComplete with country options.",
      },
    },
  },
};

/**
 * Shows different modes of operation for InputAutoComplete.
 */
export const Modes: Story = {
  render: () => (
    <div className="flex flex-col w-full gap-4">
      <InputAutoComplete
        options={countryOptions}
        formComposition={{
          label: "Default Mode",
          description: "What you type is what you get (with suggestions)",
        }}
        placeholder="Type any value"
        mode="default"
      />

      <InputAutoComplete
        options={countryOptions}
        formComposition={{
          label: "Select Mode",
          description: "Only selected options are valid",
        }}
        placeholder="Must select from options"
        mode="select"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the two modes: 'default' allows free-form input while showing suggestions, 'select' only allows selecting from the provided options.",
      },
    },
  },
};

/**
 * InputAutoComplete with icons for better visual context.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col w-full gap-4">
      <InputAutoComplete
        options={countryOptions}
        formComposition={{
          label: "Country",
          prefix: <Globe className="size-4" />,
        }}
        placeholder="Select a country"
      />

      <InputAutoComplete
        options={cityOptions}
        formComposition={{
          label: "City",
          prefix: <Map className="size-4" />,
        }}
        placeholder="Select a city"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "InputAutoComplete with icons to provide visual context.",
      },
    },
  },
};

/**
 * InputAutoComplete with minimum character requirements.
 */
export const MinCharToSearch: Story = {
  render: () => (
    <div className="flex flex-col w-full gap-4">
      <InputAutoComplete
        options={countryOptions}
        formComposition={{
          label: "Country (min 1 char)",
          description: "Default behavior: Start typing to see suggestions",
        }}
        placeholder="Type to search"
        minCharToSearch={1}
      />

      <InputAutoComplete
        options={countryOptions}
        formComposition={{
          label: "Country (min 3 chars)",
          description: "Type at least 3 characters to see suggestions",
        }}
        placeholder="Type at least 3 characters"
        minCharToSearch={3}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Configure minimum characters required before showing suggestions with minCharToSearch.",
      },
    },
  },
};

/**
 * Demonstrates loading state.
 */
export const LoadingState: Story = {
  render: () => (
    <InputAutoComplete
      options={countryOptions}
      formComposition={{
        label: "Country",
        description: "Loading state simulation",
      }}
      placeholder="Searching..."
      loading={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: "Shows how the component looks when in a loading state.",
      },
    },
  },
};

/**
 * InputAutoComplete with grouped options.
 */
export const GroupedOptions: Story = {
  render: () => (
    <InputAutoComplete
      options={[fruitOptions, vegetableOptions]}
      formComposition={{
        label: "Food Items",
        description: "Select a fruit or vegetable",
      }}
      placeholder="Search foods"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: "InputAutoComplete with options organized into groups.",
      },
    },
  },
};

/**
 * Custom initial state display.
 */
export const CustomInitialState: Story = {
  render: () => (
    <InputAutoComplete
      options={countryOptions}
      formComposition={{
        label: "Country",
        description: "With custom initial state message",
      }}
      placeholder="Type to search"
      minCharToSearch={2}
      initialState={
        <div className="p-4 text-sm text-center">
          <Search className="inline-block mb-2 size-5 text-muted-foreground" />
          <p>Type at least 2 characters to search for countries</p>
        </div>
      }
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Customize what displays before search is triggered using initialState.",
      },
    },
  },
};

/**
 * Form integration with validation.
 */
export const WithFormValidation: Story = {
  render: () => {
    const formSchema = z.object({
      country: z.string().min(1, "Please select a country"),
      city: z.string().min(1, "Please select a city"),
      favoriteFood: z.string().optional(),
      readOnlyValue: z.string().optional(),
    });

    function FormExample() {
      const [isSubmitted, setIsSubmitted] = useState(false);
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          country: "United States",
          city: "",
          favoriteFood: "Apple",
          readOnlyValue: "This field is read-only",
        },
      });

      const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
      };

      const handleReset = () => {
        form.reset();
        setIsSubmitted(false);
      };

      return (
        <ZodSchemaProvider schema={formSchema}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 font-medium">Required Fields</h3>
                  <div className="space-y-3">
                    <InputAutoCompleteForm
                      name="country"
                      control={form.control}
                      options={countryOptions}
                      formComposition={{
                        label: "Country",
                        prefix: <Globe className="size-4" />,
                        description: "Required field with validation",
                      }}
                      placeholder="Select a country"
                      mode="select"
                    />

                    <InputAutoCompleteForm
                      name="city"
                      control={form.control}
                      options={cityOptions}
                      formComposition={{
                        label: "City",
                        iconLeft: <Map className="size-4" />,
                        description: "Required field with validation",
                      }}
                      placeholder="Select a city"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Optional & States</h3>
                  <div className="space-y-3">
                    <InputAutoCompleteForm
                      name="favoriteFood"
                      control={form.control}
                      options={[fruitOptions, vegetableOptions]}
                      formComposition={{
                        label: "Favorite Food",
                        description: "Optional field with initial value",
                      }}
                      placeholder="Select food"
                    />

                    <InputAutoCompleteForm
                      name="readOnlyValue"
                      control={form.control}
                      options={[]}
                      readOnly
                      formComposition={{
                        label: "Read-only Field",
                        description: "This field cannot be edited",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1" disabled={isSubmitted}>
                  {isSubmitted ? "Submitted!" : "Submit"}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>

              {isSubmitted && (
                <div className="p-3 text-sm text-green-800 border border-green-200 rounded bg-green-50">
                  Form submitted successfully!
                </div>
              )}
            </form>
          </Form>
        </ZodSchemaProvider>
      );
    }

    return <FormExample />;
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example of form validation using react-hook-form and zod with InputAutoCompleteForm component. Demonstrates various field states including required fields, fields with initial values, and read-only fields.",
      },
    },
  },
};

/**
 * A comprehensive showcase of InputAutoComplete features.
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div className="grid w-full gap-6">
      <div>
        <h3 className="mb-2 font-medium">Basic Usage</h3>
        <div className="space-y-3">
          <InputAutoComplete
            options={countryOptions}
            placeholder="Search countries"
            formComposition={{ label: "Simple autocomplete" }}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium">Operation Modes</h3>
        <div className="space-y-3">
          <InputAutoComplete
            options={countryOptions}
            placeholder="Free-form with suggestions"
            mode="default"
            formComposition={{ label: "Default mode" }}
          />
          <InputAutoComplete
            options={countryOptions}
            placeholder="Must select from list"
            mode="select"
            formComposition={{ label: "Select mode" }}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium">With Icons</h3>
        <div className="space-y-3">
          <InputAutoComplete
            options={countryOptions}
            placeholder="Search countries"
            formComposition={{
              label: "With left icon",
              iconLeft: <Globe className="size-4" />,
            }}
          />
          <InputAutoComplete
            options={[fruitOptions, vegetableOptions]}
            placeholder="Search foods"
            formComposition={{
              label: "With right icon",
              iconRight: <Search className="size-4" />,
            }}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium">Min Characters to Search</h3>
        <div className="space-y-3">
          <InputAutoComplete
            options={countryOptions}
            placeholder="Type 1+ characters"
            minCharToSearch={1}
            formComposition={{ label: "Min 1 character" }}
          />
          <InputAutoComplete
            options={countryOptions}
            placeholder="Type 3+ characters"
            minCharToSearch={3}
            formComposition={{ label: "Min 3 characters" }}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium">State Variations</h3>
        <div className="space-y-3">
          <InputAutoComplete
            options={countryOptions}
            placeholder="Loading..."
            loading={true}
            formComposition={{ label: "Loading state" }}
          />
          <InputAutoComplete
            options={countryOptions}
            placeholder="Disabled input"
            disabled
            formComposition={{ label: "Disabled" }}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A comprehensive showcase displaying key features of the InputAutoComplete component.",
      },
    },
  },
};

/**
 * Fully interactive example with configurable props.
 */
export const Interactive: Story = {
  args: {
    options: countryOptions,
    placeholder: "Search countries...",
    mode: "default",
    minCharToSearch: 1,
    loading: false,
    formComposition: {
      label: "Country",
      description: "Select or type a country name",
      iconLeft: <Globe className="size-4" />,
      inputClear: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "A fully interactive example that can be customized using the Controls panel.",
      },
    },
  },
};
