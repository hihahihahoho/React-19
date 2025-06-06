import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import { Textarea } from "@/components/ui/textarea/textarea"
import { TextareaForm } from "@/components/ui/textarea/textarea-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  AlertCircle,
  Check,
  FileText,
  MessageSquare,
  Pencil,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

/**
 * Textarea component allows users to enter multi-line text.
 * Use textareas when users need to enter longer content such as comments, descriptions, or messages.
 */
const meta = {
  title: "Forms/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/textarea.json
\`\`\`

Textarea components are interactive controls that allow users to enter multiple lines of text.
They are useful for collecting longer form content and support various states, sizes, and compositions.

## When to use
- When collecting longer text input such as comments, feedback, or descriptions
- When users need to enter multi-paragraph content
- When presenting users with a larger writing space than a standard input field
- For content that might include line breaks

## Accessibility
- Textareas should always have associated labels for screen readers
- Error states should be communicated both visually and to screen readers
- Form elements should have proper tab order and keyboard accessibility
- Required fields should be clearly marked
        `,
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text displayed when the textarea is empty",
    },
    disabled: {
      control: "boolean",
      description: "When true, prevents user interaction with the textarea",
    },
    readOnly: {
      control: "boolean",
      description: "When true, makes the textarea read-only",
    },
    formComposition: {
      description:
        "Configuration for form composition elements like label, help text, etc.",
    },
    onValueChange: {
      description: "Function called when the textarea value changes",
      action: "value changed",
    },
    maxHeight: {
      control: "number",
      description: "Maximum height of the textarea in pixels",
    },
    minHeight: {
      control: "number",
      description: "Minimum height of the textarea in pixels",
    },
    maxLength: {
      control: "number",
      description: "Maximum number of characters allowed",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the textarea",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center md:w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic examples of textareas with different configurations.
 */
export const BasicExamples: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <Textarea
        formComposition={{ label: "Default Textarea" }}
        placeholder="Enter your comments here..."
      />
      <Textarea
        formComposition={{
          label: "Textarea with description",
          description: "Add your feedback below (max 200 characters)",
        }}
        placeholder="Your feedback matters to us!"
      />
      <Textarea
        formComposition={{ label: "Limited Text" }}
        placeholder="Limited to 100 characters"
        maxLength={100}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Basic textarea examples with different configurations.",
      },
    },
  },
}

/**
 * Textareas with different states (disabled, read-only).
 */
export const TextareaStates: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <Textarea
        formComposition={{ label: "Default" }}
        placeholder="Regular textarea"
        defaultValue="This is editable content that you can modify."
      />
      <Textarea
        formComposition={{ label: "Disabled" }}
        placeholder="Disabled textarea"
        defaultValue="This content cannot be edited because the textarea is disabled."
        disabled
      />
      <Textarea
        formComposition={{ label: "Read-only" }}
        placeholder="Read-only textarea"
        defaultValue="This content cannot be changed because the textarea is read-only."
        readOnly
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Textarea fields in various interactive states.",
      },
    },
  },
}

/**
 * Textareas with different form composition variations.
 */
export const WithFormComposition: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <Textarea
        formComposition={{
          label: "Feedback",
          description: "Share your thoughts about our service",
        }}
        placeholder="Tell us what you think..."
      />
      <Textarea
        formComposition={{
          label: "Product Review",
          requiredSymbol: true,
        }}
        placeholder="Write your review here"
      />
      <Textarea
        formComposition={{
          label: "Message",
          requiredSymbol: true,
          description: "Your message will be sent to our support team",
        }}
        placeholder="How can we help you?"
      />
      <Textarea
        formComposition={{
          label: "Additional Notes",
          description: "Any other information we should know",
          labelPosition: "horizontal",
        }}
        placeholder="Add any relevant details..."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Textarea fields with various form composition elements like labels, descriptions, and positioning.",
      },
    },
  },
}

/**
 * Textareas with different icon configurations.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <Textarea
        formComposition={{
          label: "Comment",
          iconLeft: <MessageSquare className="size-4" />,
        }}
        placeholder="Add your comment here..."
      />
      <Textarea
        formComposition={{
          label: "Notes",
          iconLeft: <Pencil className="size-4" />,
        }}
        placeholder="Add your notes here..."
      />
      <Textarea
        formComposition={{
          label: "Document",
          iconLeft: <FileText className="size-4" />,
        }}
        placeholder="Add your document content here..."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Textarea fields with icons to provide visual context.",
      },
    },
  },
}

/**
 * Textarea fields with prefix and suffix elements.
 */
export const WithPrefixAndSuffix: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <Textarea
        formComposition={{
          label: "Comment",
          prefix: <span className="text-muted-foreground">@</span>,
        }}
        placeholder="Add your comment..."
      />
      <Textarea
        formComposition={{
          label: "Editor",
          suffix: <span className="text-muted-foreground">.md</span>,
        }}
        placeholder="Type markdown content here..."
      />
      <Textarea
        formComposition={{
          label: "Custom",
          prefix: <span className="text-muted-foreground">&lt;p&gt;</span>,
          suffix: <span className="text-muted-foreground">&lt;/p&gt;</span>,
        }}
        placeholder="Enter paragraph content..."
      />
      <Textarea
        formComposition={{
          label: "Content",
          prefix: <span className="text-muted-foreground">&lt;div&gt;</span>,
          suffixOutside: <Button variant="outline">Format</Button>,
        }}
        placeholder="Enter HTML content..."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Textarea fields with prefix and suffix elements to provide context or additional functionality.",
      },
    },
  },
}

/**
 * Auto-resizing textareas with different configurations.
 */
export const AutoResize: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <Textarea
        formComposition={{
          label: "Auto-resize (default)",
          description: "Grows as you type, up to 300px by default",
        }}
        placeholder="Type multiple lines to see auto-resize in action..."
      />
      <Textarea
        formComposition={{
          label: "Limited height",
          description: "Maximum height of 100px",
        }}
        maxHeight={100}
        placeholder="This textarea will stop growing at 100px and show scrollbars instead..."
      />
      <Textarea
        formComposition={{
          label: "Taller minimum",
          description: "Starts at a taller height (100px)",
        }}
        minHeight={100}
        placeholder="This textarea has a larger starting height..."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Textarea fields that automatically resize based on content, with configurable min/max heights.",
      },
    },
  },
}

/**
 * Character counting in textareas.
 */
export const CharacterCounting: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <Textarea
        formComposition={{
          label: "Tweet",
          description: "Similar to Twitter/X character limit",
        }}
        placeholder="What's happening?"
        maxLength={280}
      />
      <Textarea
        formComposition={{
          label: "Short description",
          description: "Keep it brief and to the point",
        }}
        placeholder="Describe your product in under 100 characters"
        maxLength={100}
      />
      <Textarea
        formComposition={{
          label: "Custom message",
          description: "Use maxLength to set character limits",
        }}
        placeholder="Limited to 150 characters"
        maxLength={150}
        defaultValue="This text already takes up some of your character allowance. The counter shows how many you've used and how many remain."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Textarea fields with character counting to help users stay within limits.",
      },
    },
  },
}

/**
 * Form with textarea validation using react-hook-form and zod.
 */
export const WithFormValidation: Story = {
  render: () => {
    const formSchema = z.object({
      feedback: z
        .string()
        .min(10, "Feedback must be at least 10 characters")
        .max(500, "Feedback must not exceed 500 characters"),
      description: z
        .string()
        .min(20, "Description must be at least 20 characters"),
      summary: z.string().max(100, "Summary must not exceed 100 characters"),
    })

    function FormExample() {
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          feedback: "Hello, this is a test feedback message.",
          description: "",
          summary: "",
        },
      })

      const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
        alert(
          "Form submitted successfully!\n" + JSON.stringify(values, null, 2)
        )
      }

      return (
        <ZodSchemaProvider schema={formSchema}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <TextareaForm
                name="feedback"
                control={form.control}
                formComposition={{
                  label: "Feedback",
                  iconLeft: <MessageSquare className="size-4" />,
                }}
                placeholder="Tell us what you think..."
              />

              <TextareaForm
                name="description"
                control={form.control}
                formComposition={{
                  label: "Description",
                  iconLeft: <FileText className="size-4" />,
                }}
                placeholder="Provide a detailed description"
              />

              <TextareaForm
                name="summary"
                control={form.control}
                formComposition={{
                  label: "Summary",
                  iconLeft: <Pencil className="size-4" />,
                }}
                placeholder="Provide a brief summary"
                maxLength={100}
              />

              <Button type="submit" className="w-full">
                Submit
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
          "Example of form validation using react-hook-form and zod with TextareaForm component.",
      },
    },
  },
}

/**
 * Textareas with different variant styles.
 */
export const VariantStyles: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <Textarea
        formComposition={{
          label: "Default style",
          variant: "default",
        }}
        placeholder="Default textarea style"
      />

      <Textarea
        formComposition={{
          label: "White variant",
          variant: "white",
        }}
        placeholder="White background textarea"
      />

      <Textarea
        formComposition={{
          label: "Ghost variant",
          variant: "ghost",
        }}
        placeholder="Ghost style textarea"
      />

      <Textarea
        formComposition={{
          label: "Inline variant",
          variant: "inline",
        }}
        placeholder="Inline style textarea"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Textarea fields with different visual styles based on variants.",
      },
    },
  },
}

/**
 * Textarea fields with label positioning.
 */
export const LabelPositioning: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <Textarea
        formComposition={{
          label: "Vertical label (default)",
          description: "Label appears above the textarea",
        }}
        placeholder="Vertical label position"
      />

      <Textarea
        formComposition={{
          label: "Horizontal label",
          labelPosition: "horizontal",
          description: "Label appears to the left of the textarea",
        }}
        placeholder="Horizontal label position"
      />

      <Textarea
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
        story: "Textarea fields with different label positioning options.",
      },
    },
  },
}

/**
 * A comprehensive showcase of all textarea variants and features.
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div className="grid w-full gap-6">
      <div>
        <h3 className="mb-2 text-sm font-medium">Basic Textareas</h3>
        <div className="space-y-2">
          <Textarea placeholder="Basic textarea" />
          <Textarea
            placeholder="With default value"
            defaultValue="This is some default content that appears in the textarea when it's first loaded."
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">With Labels</h3>
        <div className="space-y-2">
          <Textarea
            formComposition={{ label: "Comments" }}
            placeholder="Enter your comments"
          />
          <Textarea
            formComposition={{ label: "Feedback", requiredSymbol: true }}
            placeholder="Enter your feedback"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">With Description Text</h3>
        <div className="space-y-2">
          <Textarea
            formComposition={{
              label: "Bio",
              description: "Tell us about yourself in 200 characters or less",
              requiredSymbol: true,
            }}
            placeholder="Write a short bio"
            maxLength={200}
          />
          <Textarea
            formComposition={{
              label: "Review",
              description: "Share your experience with our product",
              customError: "Please be more specific in your review",
            }}
            placeholder="Write your review here"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">With Icons</h3>
        <div className="space-y-2">
          <Textarea
            formComposition={{
              label: "Comment",
              iconLeft: <MessageSquare className="size-4" />,
            }}
            placeholder="Enter your comment"
          />
          <Textarea
            formComposition={{
              label: "Notes",
              iconRight: <Pencil className="size-4" />,
            }}
            placeholder="Add your notes"
          />
          <Textarea
            formComposition={{
              label: "Documentation",
              iconLeft: <FileText className="size-4" />,
              iconRight: <Check className="size-4" />,
            }}
            placeholder="Add documentation"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">States</h3>
        <div className="space-y-2">
          <Textarea
            formComposition={{
              label: "Disabled textarea",
            }}
            placeholder="Cannot be edited"
            disabled
          />
          <Textarea
            formComposition={{
              label: "Read-only textarea",
            }}
            defaultValue="This content cannot be changed because the textarea is read-only."
            readOnly
          />
          <Textarea
            formComposition={{
              label: "With error",
              customError: "This field is required",
            }}
            placeholder="Required field"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Auto-resize Behavior</h3>
        <div className="space-y-2">
          <Textarea
            formComposition={{
              label: "Default auto-resize",
              description: "Grows up to 300px by default",
            }}
            placeholder="Type multiple lines to see auto-resize in action..."
          />
          <Textarea
            formComposition={{
              label: "Limited height",
              description: "Maximum height of 100px",
            }}
            maxHeight={100}
            placeholder="This textarea has a height limit of 100px"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Status Indicators</h3>
        <div className="space-y-2">
          <Textarea
            formComposition={{
              label: "Success state",
              iconLeft: <Check className="size-4 text-green-500" />,
              description: "Input value is valid",
            }}
            defaultValue="This is a valid comment that meets all our requirements."
          />
          <Textarea
            formComposition={{
              label: "Error state",
              iconLeft: <AlertCircle className="size-4 text-red-500" />,
              customError: "Comment is too short",
            }}
            defaultValue="Too short"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A comprehensive showcase displaying all textarea variants and features for reference.",
      },
    },
  },
}

/**
 * Textareas with line limits to restrict the number of lines a user can enter.
 */
export const LineLimits: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <Textarea
        formComposition={{
          label: "Max 5 Lines",
          description: "This textarea will only allow up to 5 lines of text",
        }}
        placeholder="Try typing multiple lines here (max 5)..."
        maxLines={5}
      />

      <Textarea
        formComposition={{
          label: "Max 3 Lines",
          description: "This textarea is limited to just 3 lines",
        }}
        placeholder="Limited to 3 lines only..."
        maxLines={3}
      />

      <Textarea
        formComposition={{
          label: "Single Line Only",
          description: "This behaves more like a regular input field",
        }}
        placeholder="Only one line allowed here..."
        maxLines={1}
      />

      <Textarea
        formComposition={{
          label: "Default (No Line Limit)",
          description: "Standard textarea with unlimited lines",
        }}
        placeholder="This has no line restriction..."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Textareas with different line limits to control how many lines of text a user can enter. This is useful for enforcing specific formatting requirements or preventing excessively long entries.",
      },
    },
  },
}
