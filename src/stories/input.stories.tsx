import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/form";
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context";
import { Input } from "@/components/ui/input/input";
import { InputForm } from "@/components/ui/input/input-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertCircle,
  Check,
  FileText,
  Globe,
  Info,
  Lock,
  Mail,
  Phone,
  Search,
  User,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/**
 * Input component allows users to enter text or other data in a form.
 * Use inputs to collect user information or data entry.
 */
const meta = {
  title: "Forms/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Input components are interactive controls that allow users to enter text and other data.
They can include various types, validation states, and additional elements like labels and help text.

## When to use
- To collect user input as part of a form
- To enable search functionality
- To receive free-text or structured data
- For file selection and uploads

## Accessibility
- Inputs should always have associated labels for screen readers
- Error states should be communicated both visually and to screen readers
- Form elements should have proper tab order and keyboard accessibility
- Required fields should be clearly marked
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: [
        "text",
        "password",
        "email",
        "number",
        "tel",
        "url",
        "search",
        "file",
      ],
      description: "The type of input field",
      table: {
        defaultValue: { summary: "text" },
      },
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
    onValueFileChange: {
      description: "Function called when a file input value changes",
      action: "file value changed",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the input",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center md:w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic examples of different input types.
 */
export const BasicTypes: Story = {
  render: () => (
    <div className="flex flex-col w-full gap-4">
      <Input formComposition={{ label: "Text" }} placeholder="Enter text" />
      <Input
        type="email"
        formComposition={{ label: "Email" }}
        placeholder="example@domain.com"
      />
      <Input
        type="password"
        formComposition={{ label: "Password" }}
        placeholder="Enter password"
      />
      <Input
        type="number"
        formComposition={{ label: "Number" }}
        placeholder="0"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Various basic input types for different data entry needs.",
      },
    },
  },
};

/**
 * Inputs with different states (disabled, read-only).
 */
export const InputStates: Story = {
  render: () => (
    <div className="flex flex-col w-full gap-4">
      <Input
        formComposition={{ label: "Default" }}
        placeholder="Regular input"
        defaultValue="Editable value"
      />
      <Input
        formComposition={{ label: "Disabled" }}
        placeholder="Disabled input"
        defaultValue="Cannot be edited"
        disabled
      />
      <Input
        formComposition={{ label: "Read-only" }}
        placeholder="Read-only input"
        defaultValue="Cannot be changed"
        readOnly
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Input fields in various interactive states.",
      },
    },
  },
};

/**
 * Inputs with different form composition variations.
 */
export const WithFormComposition: Story = {
  render: () => (
    <div className="flex flex-col w-full gap-4">
      <Input
        formComposition={{
          label: "Username",
          description: "Enter your username or email",
        }}
        placeholder="Username"
      />
      <Input
        formComposition={{
          label: "Email address",
          requiredSymbol: true,
        }}
        placeholder="example@domain.com"
        type="email"
      />
      <Input
        formComposition={{
          label: "Password",
          requiredSymbol: true,
          description: "Password must be at least 8 characters",
        }}
        placeholder="Enter password"
        type="password"
      />
      <Input
        formComposition={{
          label: "Profile URL",
          description: "Your public profile address",
          labelPosition: "horizontal",
        }}
        placeholder="https://example.com/profile"
        type="url"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Input fields with various form composition elements like labels, descriptions, and error messages.",
      },
    },
  },
};

/**
 * Inputs with different icon configurations.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col w-full gap-4">
      <Input
        formComposition={{
          label: "Search",
          iconLeft: <Search className="size-4" />,
        }}
        placeholder="Search..."
        type="search"
      />
      <Input
        formComposition={{
          label: "Email",
          iconLeft: <Mail className="size-4" />,
        }}
        placeholder="example@domain.com"
        type="email"
      />
      <Input
        formComposition={{
          label: "Password",
          iconLeft: <Lock className="size-4" />,
        }}
        placeholder="Enter password"
        type="password"
      />
      <Input
        formComposition={{
          label: "Username",
          iconRight: <User className="size-4" />,
        }}
        placeholder="Enter username"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Input fields with icons to provide visual context.",
      },
    },
  },
};

/**
 * Input fields with prefix and suffix elements.
 */
export const WithPrefixAndSuffix: Story = {
  render: () => (
    <div className="flex flex-col w-full gap-4">
      <Input
        formComposition={{
          label: "Amount",
          prefix: <span className="text-muted-foreground">$</span>,
        }}
        placeholder="0.00"
        type="number"
      />
      <Input
        formComposition={{
          label: "Weight",
          suffix: <span className="text-muted-foreground">kg</span>,
        }}
        placeholder="Enter weight"
        type="number"
      />
      <Input
        formComposition={{
          label: "Domain",
          prefix: <span className="text-muted-foreground">https://</span>,
          suffix: <span className="text-muted-foreground">.com</span>,
        }}
        placeholder="example"
      />
      <Input
        formComposition={{
          label: "Custom Domain",
          prefix: <span className="text-muted-foreground">www.</span>,
          suffixOutside: <Button variant="outline">Check</Button>,
        }}
        placeholder="yourdomain"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Input fields with prefix and suffix elements to provide context or additional functionality.",
      },
    },
  },
};

/**
 * Input fields with clearable values.
 */
export const WithClearButton: Story = {
  render: () => (
    <div className="flex flex-col w-full gap-4">
      <Input
        formComposition={{
          label: "Username",
          inputClear: true,
        }}
        placeholder="Enter username"
        defaultValue="johndoe"
      />
      <Input
        formComposition={{
          label: "Search",
          iconLeft: <Search className="size-4" />,
          inputClear: true,
        }}
        placeholder="Search..."
        type="search"
        defaultValue="react components"
      />
      <Input
        formComposition={{
          label: "Email",
          iconLeft: <Mail className="size-4" />,
          inputClear: true,
          description: "Click the × to clear",
        }}
        placeholder="example@domain.com"
        type="email"
        defaultValue="example@domain.com"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Input fields with clear buttons to easily remove content.",
      },
    },
  },
};

/**
 * File input examples.
 */
export const FileInputs: Story = {
  render: () => (
    <div className="flex flex-col w-full gap-4">
      <Input
        type="file"
        formComposition={{
          label: "Upload file",
          description: "Max file size: 5MB",
        }}
      />
      <Input
        type="file"
        formComposition={{
          label: "Profile picture",
          description: "JPG, PNG or GIF (max. 1MB)",
          iconLeft: <FileText className="size-4" />,
        }}
        accept="image/*"
      />
      <Input
        type="file"
        formComposition={{
          label: "Multiple files",
          description: "Select multiple documents",
        }}
        multiple
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "File input fields for uploading documents and images.",
      },
    },
  },
};

/**
 * Form with input validation using react-hook-form and zod.
 */
export const WithFormValidation: Story = {
  render: () => {
    const formSchema = z.object({
      username: z.string().min(3, "Username must be at least 3 characters"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
    });

    function FormExample() {
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          email: "",
          password: "",
        },
      });

      const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
        alert(
          "Form submitted successfully!\n" + JSON.stringify(values, null, 2)
        );
      };

      return (
        <ZodSchemaProvider schema={formSchema}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <InputForm
                name="username"
                control={form.control}
                formComposition={{
                  label: "Username",
                  iconLeft: <User className="size-4" />,
                }}
                placeholder="Enter username"
              />

              <InputForm
                name="email"
                control={form.control}
                type="email"
                formComposition={{
                  label: "Email",
                  iconLeft: <Mail className="size-4" />,
                }}
                placeholder="example@domain.com"
              />

              <InputForm
                name="password"
                control={form.control}
                type="password"
                formComposition={{
                  label: "Password",
                  iconLeft: <Lock className="size-4" />,
                }}
                placeholder="Enter password"
              />

              <Button type="submit" className="w-full">
                Submit
              </Button>
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
          "Example of form validation using react-hook-form and zod with InputForm component.",
      },
    },
  },
};

/**
 * Various input field types for different data formats.
 */
export const VariousInputTypes: Story = {
  render: () => (
    <div className="flex flex-col w-full gap-4">
      <Input
        type="tel"
        formComposition={{
          label: "Phone Number",
          iconLeft: <Phone className="size-4" />,
        }}
        placeholder="(123) 456-7890"
      />

      <Input
        type="url"
        formComposition={{
          label: "Website",
          iconLeft: <Globe className="size-4" />,
        }}
        placeholder="https://example.com"
      />

      <Input
        type="search"
        formComposition={{
          label: "Search",
          iconLeft: <Search className="size-4" />,
          inputClear: true,
        }}
        placeholder="Search..."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Different input types for specialized data formats like phone numbers, URLs, and search queries.",
      },
    },
  },
};

/**
 * Inputs with different variant styles.
 */
export const VariantStyles: Story = {
  render: () => (
    <div className="flex flex-col w-full gap-4">
      <Input
        formComposition={{
          label: "Default style",
          variant: "default",
        }}
        placeholder="Default input style"
      />

      <Input
        formComposition={{
          label: "White variant",
          variant: "white",
        }}
        placeholder="White background input"
      />

      <Input
        formComposition={{
          label: "Ghost variant",
          variant: "ghost",
        }}
        placeholder="Ghost style input"
      />

      <Input
        formComposition={{
          label: "Inline variant",
          variant: "inline",
        }}
        placeholder="Inline style input"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Input fields with different visual styles based on variants.",
      },
    },
  },
};

/**
 * Input fields with label positioning.
 */
export const LabelPositioning: Story = {
  render: () => (
    <div className="flex flex-col w-full gap-4">
      <Input
        formComposition={{
          label: "Vertical label (default)",
          description: "Label appears above the input",
        }}
        placeholder="Vertical label position"
      />

      <Input
        formComposition={{
          label: "Horizontal label",
          labelPosition: "horizontal",
          description: "Label appears to the left of the input",
        }}
        placeholder="Horizontal label position"
      />

      <Input
        formComposition={{
          label: "Horizontal with custom layout",
          labelPosition: "horizontal",
          layout: {
            leftColClass: "md:col-span-3",
            rightColClass: "md:col-span-9",
          },
          description: "Custom column span",
        }}
        placeholder="Custom layout"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Input fields with different label positioning options.",
      },
    },
  },
};

/**
 * A comprehensive showcase of all input variants and features.
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div className="grid w-full gap-6">
      <div>
        <h3 className="mb-2 text-sm font-medium">Basic Inputs</h3>
        <div className="space-y-2">
          <Input placeholder="Basic text input" />
          <Input type="email" placeholder="Email input" />
          <Input type="password" placeholder="Password input" />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">With Labels</h3>
        <div className="space-y-2">
          <Input
            formComposition={{ label: "Username" }}
            placeholder="Enter username"
          />
          <Input
            formComposition={{ label: "Email", requiredSymbol: true }}
            placeholder="Enter email"
            type="email"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">With Description Text</h3>
        <div className="space-y-2">
          <Input
            formComposition={{
              label: "Password",
              description: "Must be at least 8 characters",
              requiredSymbol: true,
            }}
            type="password"
            placeholder="Enter password"
          />
          <Input
            formComposition={{
              label: "Username",
              description: "Choose a unique username",
              customError: "Username already taken",
            }}
            placeholder="Enter username"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">With Icons</h3>
        <div className="space-y-2">
          <Input
            formComposition={{
              label: "Search",
              iconLeft: <Search className="size-4" />,
            }}
            type="search"
            placeholder="Search..."
          />
          <Input
            formComposition={{
              label: "Email",
              iconRight: <Mail className="size-4" />,
            }}
            type="email"
            placeholder="example@domain.com"
          />
          <Input
            formComposition={{
              label: "Information",
              iconLeft: <Info className="size-4" />,
              iconRight: <Check className="size-4" />,
            }}
            placeholder="Enter information"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">States</h3>
        <div className="space-y-2">
          <Input
            formComposition={{
              label: "Disabled input",
            }}
            placeholder="Cannot be edited"
            disabled
          />
          <Input
            formComposition={{
              label: "Read-only input",
            }}
            defaultValue="Cannot be changed"
            readOnly
          />
          <Input
            formComposition={{
              label: "With error",
              customError: "This field is required",
            }}
            placeholder="Required field"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">File Input</h3>
        <div className="space-y-2">
          <Input
            type="file"
            formComposition={{
              label: "Upload file",
              description: "Max 5MB",
            }}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Status Indicators</h3>
        <div className="space-y-2">
          <Input
            formComposition={{
              label: "Success state",
              iconLeft: <Check className="text-green-500 size-4" />,
              description: "Input value is valid",
            }}
            defaultValue="valid@email.com"
            type="email"
          />
          <Input
            formComposition={{
              label: "Error state",
              iconLeft: <AlertCircle className="text-red-500 size-4" />,
              customError: "Invalid input value",
            }}
            defaultValue="invalid-value"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A comprehensive showcase displaying all input variants and features for reference.",
      },
    },
  },
};

/**
 * Fully interactive example with all available props.
 */
export const Interactive: Story = {
  args: {
    placeholder: "Interactive input",
    type: "text",
    disabled: false,
    readOnly: false,
    formComposition: {
      label: "Interactive Input",
      description: "This is a customizable input field",
      inputClear: true,
      iconLeft: <User className="size-4" />,
      variant: "default",
      size: "default",
      labelPosition: "vertical",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "A fully interactive input that can be customized using the Controls panel.",
      },
    },
  },
};
