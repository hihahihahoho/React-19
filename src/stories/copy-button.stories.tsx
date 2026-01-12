import { CopyButton } from "@/components/ui/copy-button"
import type { Meta, StoryObj } from "@storybook/react-vite"

/**
 * CopyButton is a pre-styled copy button with built-in toast notifications and icon states.
 * It's the "batteries included" version of the Copy component.
 */
const meta = {
  title: "Utilities/CopyButton",
  component: CopyButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/copy-button.json
\`\`\`

A pre-styled copy button with built-in toast notifications and animated icon states.

## Features
- **Ready to use** - No additional styling needed
- **Toast notifications** - Built-in success/error feedback via Sonner
- **Animated icons** - Smooth transitions between idle, copying, copied, error states
- **Customizable messages** - Configure or disable toast messages
- **Button variants** - Inherits all Button component props

## When to use
- When you need a quick, styled copy button
- When you want built-in toast feedback
- For consistent copy button appearance across your app

## For custom UI
Use [\`Copy\`](/docs/utilities-copy--docs) component for full control over the copy button UI.
        `,
      },
    },
  },
  argTypes: {
    content: {
      control: "text",
      description: "Text content to copy to clipboard",
    },
    resetDelay: {
      control: "number",
      description: "Time in ms before state resets to idle",
      table: {
        defaultValue: { summary: "2000" },
      },
    },
    successMessage: {
      control: "text",
      description: "Toast message on success. Set to false to disable.",
      table: {
        defaultValue: { summary: '"Copied to clipboard"' },
      },
    },
    errorMessage: {
      control: "text",
      description: "Toast message on error. Set to false to disable.",
      table: {
        defaultValue: { summary: '"Failed to copy"' },
      },
    },
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
      description: "Button variant",
      table: {
        defaultValue: { summary: '"outline"' },
      },
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg"],
      description: "Button size",
    },
    onCopied: {
      description: "Callback fired after successful copy",
      action: "copied",
    },
    onCopyError: {
      description: "Callback fired when copy fails",
      action: "copyError",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CopyButton>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default CopyButton with toast notification.
 */
export const Default: Story = {
  args: {
    content: "Hello, World!",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Basic CopyButton with default styling. Click to copy and see the toast notification.",
      },
    },
  },
}

/**
 * Different button variants.
 */
export const Variants: Story = {
  args: {
    content: "Variant demo",
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <CopyButton content="Default variant" variant="default" />
      <CopyButton content="Secondary variant" variant="secondary" />
      <CopyButton content="Outline variant" variant="outline" />
      <CopyButton content="Ghost variant" variant="ghost" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "CopyButton inherits all Button variants. Default is `outline`.",
      },
    },
  },
}

/**
 * Different button sizes.
 */
export const Sizes: Story = {
  args: {
    content: "Size demo",
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <CopyButton content="XS size" size="xs" />
      <CopyButton content="SM size" size="sm" />
      <CopyButton content="Default size" size="default" />
      <CopyButton content="LG size" size="lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "CopyButton supports all Button sizes.",
      },
    },
  },
}

/**
 * Custom toast messages.
 */
export const CustomMessages: Story = {
  args: {
    content: "Custom message example",
    successMessage: "✅ Text copied successfully!",
    errorMessage: "❌ Oops! Copy failed.",
  },
  parameters: {
    docs: {
      description: {
        story: `
Customize the toast messages with \`successMessage\` and \`errorMessage\` props.

\`\`\`tsx
<CopyButton
  content="..."
  successMessage="✅ Copied!"
  errorMessage="❌ Failed!"
/>
\`\`\`
        `,
      },
    },
  },
}

/**
 * Disable toast notifications.
 */
export const NoToast: Story = {
  args: {
    content: "No toast example",
    successMessage: false,
    errorMessage: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
Set \`successMessage\` and \`errorMessage\` to \`false\` to disable toast notifications.
Useful when you want to handle feedback yourself via callbacks.

\`\`\`tsx
<CopyButton
  content="..."
  successMessage={false}
  errorMessage={false}
  onCopied={() => console.log("Copied!")}
/>
\`\`\`
        `,
      },
    },
  },
}

/**
 * With text label instead of icon only.
 */
export const WithLabel: Story = {
  args: {
    content: "Label demo",
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <CopyButton content="Copy with label" iconOnly={false} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Set \`iconOnly={false}\` to include text label. Note: By default, CopyButton only shows the icon.
To add a custom label, use the base \`Copy\` component instead.
        `,
      },
    },
  },
}

/**
 * Rounded button style.
 */
export const Rounded: Story = {
  args: {
    content: "Rounded demo",
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <CopyButton content="Rounded button" isRounded />
      <CopyButton content="Rounded secondary" isRounded variant="secondary" />
      <CopyButton content="Rounded default" isRounded variant="default" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Use `isRounded` prop for circular button style.",
      },
    },
  },
}

/**
 * Complete showcase of CopyButton features.
 */
export const CompleteShowcase: Story = {
  args: {
    content: "Showcase demo",
  },
  render: () => (
    <div className="grid gap-6">
      <div>
        <h3 className="mb-2 text-sm font-medium">Variants</h3>
        <div className="flex flex-wrap gap-2">
          <CopyButton content="Default" variant="default" />
          <CopyButton content="Secondary" variant="secondary" />
          <CopyButton content="Outline" variant="outline" />
          <CopyButton content="Ghost" variant="ghost" />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Sizes</h3>
        <div className="flex flex-wrap items-center gap-2">
          <CopyButton content="XS" size="xs" />
          <CopyButton content="SM" size="sm" />
          <CopyButton content="Default" size="default" />
          <CopyButton content="LG" size="lg" />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Styles</h3>
        <div className="flex flex-wrap items-center gap-2">
          <CopyButton content="Normal" />
          <CopyButton content="Rounded" isRounded />
          <CopyButton
            content="Rounded Secondary"
            isRounded
            variant="secondary"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Custom Messages</h3>
        <div className="flex flex-wrap items-center gap-2">
          <CopyButton content="Custom success" successMessage="🎉 Copied!" />
          <CopyButton
            content="No toast"
            successMessage={false}
            errorMessage={false}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A comprehensive showcase of all CopyButton variants, sizes, and features.",
      },
    },
  },
}
