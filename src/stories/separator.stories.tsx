import { Separator } from "@/components/ui/separator"
import type { Meta, StoryObj } from "@storybook/react"

/**
 * Separator component is used to visually divide content into distinct sections.
 * It provides a simple horizontal or vertical line for better content organization.
 */
const meta = {
  title: "Layout/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/separator.json
\`\`\`

Separator components are used to visually divide content into distinct sections.
They can be horizontal or vertical and are useful for improving content organization.

## When to use
- To separate sections of content
- To create visual distinction between elements
- To improve readability and structure

## Accessibility
- Separators are implemented using semantic HTML elements for proper screen reader support.
        `,
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Defines the orientation of the separator",
      table: {
        defaultValue: { summary: "horizontal" },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the separator",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Horizontal separator for dividing content sections.
 */
export const Horizontal: Story = {
  render: () => (
    <div className="space-y-4">
      <div>Section 1</div>
      <Separator orientation="horizontal" />
      <div>Section 2</div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "A horizontal separator for dividing content sections.",
      },
    },
  },
}

/**
 * Vertical separator for dividing content side-by-side.
 */
export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div>Item 1</div>
      <Separator
        orientation="vertical"
        className="h-auto flex-1 self-stretch"
      />
      <div>Item 2</div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "A vertical separator for dividing content side-by-side.",
      },
    },
  },
}
