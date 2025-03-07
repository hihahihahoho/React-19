/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/form";
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context";
import { Input } from "@/components/ui/input/input";
import { InputAutoCompleteForm } from "@/components/ui/input/input-auto-complete-form";
import { SelectItems } from "@/components/ui/select/select-interface";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/**
 * Input component allows users to enter text or other data in a form.
 * Use inputs to collect user information or data entry.
 */
const meta = {
  title: "BASE/Input Auto Complete",
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

const allOptions = [
  {
    icon: "https://github.com/shadcn.png",
    label: "John - Engineer",
    value: "John - Engineer",
  },
  {
    icon: "https://avatars.githubusercontent.com/u/1",
    label: "Jane - Designer",
    value: "Jane - Designer",
  },
  {
    icon: "https://avatars.githubusercontent.com/u/2",
    label: "Alex - Manager",
    value: "Alex - Manager",
  },
  {
    icon: "https://avatars.githubusercontent.com/u/3",
    label: "Sam - Developer",
    value: "Sam - Developer",
  },
  {
    icon: "https://avatars.githubusercontent.com/u/4",
    label: "Taylor - Architect",
    value: "Taylor - Architect",
  },
  {
    icon: "https://github.com/shadcn.png",
    label: "Jordan - Engineer",
    value: "Jordan - Engineer",
  },
  {
    icon: "https://avatars.githubusercontent.com/u/1",
    label: "Casey - Designer",
    value: "Casey - Designer",
  },
  {
    icon: "https://avatars.githubusercontent.com/u/2",
    label: "Morgan - Manager",
    value: "Morgan - Manager",
  },
  {
    icon: "https://avatars.githubusercontent.com/u/3",
    label: "John - Developer",
    value: "John - Developer",
  },
  {
    icon: "https://avatars.githubusercontent.com/u/4",
    label: "Jane - Architect",
    value: "Jane - Architect",
  },
];

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

function DemoFetching() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    alert("Form submitted successfully!\n" + JSON.stringify(values, null, 2));
  };

  const [searchTerm, setSearchTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);

    // For 3 chars, show loading
    if (value.length === 3) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  };

  let currentOptions: SelectItems[] = [];
  if (searchTerm.length >= 4 && searchTerm.length < 8) {
    currentOptions = allOptions;
  } else {
    currentOptions = [];
  }

  return (
    <div className="w-full">
      <ZodSchemaProvider schema={formSchema}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <InputAutoCompleteForm
              control={form.control}
              name="username"
              formComposition={{ label: "Text" }}
              placeholder="Enter text"
              options={currentOptions}
              onChange={handleChange}
              loading={isLoading}
              minCharToSearch={3}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </ZodSchemaProvider>
    </div>
  );
}

/**
 * Basic examples of different input types.
 */
export const BasicTypes: Story = {
  render: () => <DemoFetching />,
  parameters: {
    docs: {
      description: {
        story:
          "Auto-complete with different states based on input length:\n\n" +
          "- Less than 3 chars: Shows message 'Vui lòng nhập ít nhất 3 kí tự'\n" +
          "- 4 chars: Shows loading state\n" +
          "- 5 chars: Shows the full option list\n" +
          "- 6 or more chars: Shows empty options list",
      },
    },
  },
};
