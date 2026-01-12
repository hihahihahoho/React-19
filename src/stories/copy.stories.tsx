import { Button } from "@/components/ui/button"
import { Copy, type CopyState } from "@/components/ui/copy"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Check, Copy as CopyIcon, Loader2, X } from "lucide-react"
import { toast } from "sonner"

/**
 * Copy component provides clipboard copy functionality with a render prop pattern.
 * It's designed to be flexible and composable - you control the UI, it handles the copy logic.
 */
const meta = {
  title: "Utilities/Copy",
  component: Copy,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/copy.json
\`\`\`

A flexible, headless copy-to-clipboard component with render prop pattern support.

## Features
- **Render prop pattern** - Full control over UI based on copy state
- **State management** - Tracks \`idle\`, \`copying\`, \`copied\`, \`error\` states
- **\`data-state\` attribute** - Enables CSS-based state styling
- **\`asChild\` pattern** - Compose with any clickable element
- **Memory-safe** - Proper cleanup of timeouts on unmount

## When to use
- When you need custom copy button UI
- When integrating copy functionality into existing components
- When you want CSS-based state transitions

## For a pre-built solution
Use [\`CopyButton\`](/docs/utilities-copybutton--docs) for a styled button with toast notifications.
        `,
      },
    },
  },
  argTypes: {
    content: {
      control: "text",
      description: "Text content to copy to clipboard",
    },
    asChild: {
      control: "boolean",
      description:
        "Merge props into child element instead of rendering a button",
    },
    resetDelay: {
      control: "number",
      description: "Time in ms before state resets to idle",
      table: {
        defaultValue: { summary: "2000" },
      },
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
} satisfies Meta<typeof Copy>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic usage with default button styling.
 */
export const Default: Story = {
  args: {
    content: "Text to copy",
    children: "Click to Copy",
    className:
      "px-4 py-2 border rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors cursor-pointer",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Basic copy button with default styling. Click to copy text to clipboard.",
      },
    },
  },
}

/**
 * Using `asChild` to compose with existing components.
 */
export const AsChild: Story = {
  args: {
    content: "Copied from button!",
    asChild: true,
  },
  render: (args) => (
    <Copy {...args} onCopied={() => toast.success("Copied to clipboard!")}>
      <Button>Copy via Button</Button>
    </Copy>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Use \`asChild\` to merge Copy's functionality into any clickable element.
The child element receives all Copy props including \`onClick\` and \`data-state\`.
        `,
      },
    },
  },
}

// Icon mapping for render prop examples
const stateIcons: Record<CopyState, React.ReactNode> = {
  idle: <CopyIcon className="h-4 w-4" />,
  copying: <Loader2 className="h-4 w-4 animate-spin" />,
  copied: <Check className="h-4 w-4 text-green-500" />,
  error: <X className="text-destructive h-4 w-4" />,
}

/**
 * Render prop pattern for full UI control based on copy state.
 */
export const WithRenderProp: Story = {
  args: {
    content: "Render prop pattern!",
  },
  render: (args) => (
    <Copy {...args}>
      {(state) => (
        <Button variant="outline" iconOnly>
          {stateIcons[state]}
          <span className="sr-only">Copy</span>
        </Button>
      )}
    </Copy>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The render prop pattern gives you complete control over the UI based on the current state.

\`\`\`tsx
<Copy content="...">
  {(state) => (
    <Button>
      {state === "copying" && <Loader2 className="animate-spin" />}
      {state === "copied" && <Check />}
      {state === "idle" && <CopyIcon />}
      {state === "error" && <X />}
    </Button>
  )}
</Copy>
\`\`\`

Available states: \`idle\`, \`copying\`, \`copied\`, \`error\`
        `,
      },
    },
  },
}

/**
 * CSS-based state transitions using `data-state` attribute.
 */
export const WithDataState: Story = {
  args: {
    content: "CSS-based transitions!",
    asChild: true,
  },
  render: (args) => (
    <Copy {...args}>
      <Button variant="outline" iconOnly className="group relative">
        <CopyIcon className="h-4 w-4 scale-100 rotate-0 transition-all group-data-[state=copied]:scale-0 group-data-[state=copied]:-rotate-90" />
        <Check className="absolute h-4 w-4 scale-0 rotate-90 text-green-500 transition-all group-data-[state=copied]:scale-100 group-data-[state=copied]:rotate-0" />
        <span className="sr-only">Copy</span>
      </Button>
    </Copy>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Use the \`data-state\` attribute with Tailwind's \`group-data-[state=*]\` variants for CSS-based state transitions.

\`\`\`tsx
<Copy content="..." asChild>
  <Button className="group">
    <CopyIcon className="group-data-[state=copied]:scale-0" />
    <Check className="absolute group-data-[state=copied]:scale-100" />
  </Button>
</Copy>
\`\`\`

Available data-state values: \`idle\`, \`copying\`, \`copied\`, \`error\`
        `,
      },
    },
  },
}

/**
 * All copy states demonstrated side by side.
 */
export const AllStates: Story = {
  args: {
    content: "State demo",
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Button variant="outline" iconOnly data-state="idle">
          <CopyIcon className="h-4 w-4" />
        </Button>
        <span className="text-muted-foreground text-xs">idle</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Button variant="outline" iconOnly data-state="copying">
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
        <span className="text-muted-foreground text-xs">copying</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Button variant="outline" iconOnly data-state="copied">
          <Check className="h-4 w-4 text-green-500" />
        </Button>
        <span className="text-muted-foreground text-xs">copied</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Button variant="outline" iconOnly data-state="error">
          <X className="text-destructive h-4 w-4" />
        </Button>
        <span className="text-muted-foreground text-xs">error</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Visual reference for all copy states that can be used with the render prop or data-state attribute.",
      },
    },
  },
}

/**
 * Consumer-controlled callbacks for custom feedback.
 */
export const WithCallbacks: Story = {
  args: {
    content: "Callback example!",
    asChild: true,
  },
  render: (args) => (
    <Copy
      {...args}
      onCopied={() => toast.success("Copied to clipboard!")}
      onCopyError={(error) => toast.error(`Failed: ${error.message}`)}
    >
      <Button>Copy with Toast</Button>
    </Copy>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Use \`onCopied\` and \`onCopyError\` callbacks for custom feedback.
This decouples the Copy component from any specific toast library.

\`\`\`tsx
<Copy
  content="..."
  onCopied={() => toast.success("Copied!")}
  onCopyError={(err) => toast.error(err.message)}
>
  <Button>Copy</Button>
</Copy>
\`\`\`
        `,
      },
    },
  },
}

/**
 * Custom reset delay to keep the copied state longer.
 */
export const CustomResetDelay: Story = {
  args: {
    content: "5 second delay!",
    resetDelay: 5000,
  },
  render: (args) => (
    <Copy {...args}>
      {(state) => (
        <Button variant="outline">
          {stateIcons[state]}
          <span className="ml-2">
            {state === "copied" ? "Copied! (5s)" : "Copy"}
          </span>
        </Button>
      )}
    </Copy>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Customize `resetDelay` to control how long the copied state persists before returning to idle.",
      },
    },
  },
}
