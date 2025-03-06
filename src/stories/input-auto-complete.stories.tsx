/* eslint-disable react-hooks/rules-of-hooks */
import { Input } from "@/components/ui/input/input";
import { InputAutoComplete } from "@/components/ui/input/input-auto-complete";
import { SelectItems } from "@/components/ui/select/select-interface";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

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

function DemoFetching() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // Options for autocomplete
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

  // Handle different behaviors based on input length
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);

    // For 4 chars, show loading
    console.log(value.length);
    if (value.length === 3) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  };

  // Determine which options to show based on input length
  let currentOptions: SelectItems[] = [];
  if (searchTerm.length >= 4 && searchTerm.length < 5) {
    currentOptions = allOptions;
  }

  // Initial state for less than 3 chars
  const initialStateMessage =
    searchTerm.length < 3 ? (
      <div className="p-6 text-sm text-center">
        Vui lòng nhập ít nhất 3 kí tự
      </div>
    ) : null;

  return (
    <div className="flex flex-col w-full gap-4">
      <InputAutoComplete
        formComposition={{ label: "Text" }}
        placeholder="Enter text"
        options={currentOptions}
        onChange={handleChange}
        loading={isLoading}
        initialState={initialStateMessage}
        value={searchTerm}
      />
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
