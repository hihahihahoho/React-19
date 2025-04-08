import { Button } from "@/components/ui/button"
import type { Meta, StoryObj } from "@storybook/react"
import {
  AlertCircle,
  Bell,
  Check,
  ChevronRight,
  Download,
  Mail,
  Plus,
  Save,
  Settings,
  Trash,
} from "lucide-react"

/**
 * Button component provides interactive elements for user actions.
 * Use buttons to enable users to trigger actions, navigate, or submit forms.
 */
const meta = {
  title: "Controls/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/button.json
\`\`\`

Button components are interactive elements that enable users to trigger actions, navigate, or submit forms.
They come in various styles, sizes, and can include icons or loading states.

## When to use
- To trigger an action or event
- To submit a form
- To navigate between pages or views
- To indicate a state change

## Accessibility
- Buttons use native HTML button elements for proper keyboard and screen reader support
- Interactive states (hover, focus, active) have appropriate visual indicators
- Loading states prevent multiple submissions while providing visual feedback
- Icon-only buttons should include aria-label for screen readers
        `,
      },
    },
  },
  argTypes: {
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
      description: "Controls the visual style of the button",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg"],
      description: "Controls the size of the button",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    children: {
      description: "The content displayed inside the button",
      control: "text",
    },
    isRounded: {
      control: "boolean",
      description: "When true, displays a fully rounded button",
    },
    iconOnly: {
      control: "boolean",
      description: "When true, optimizes the button for icon-only display",
    },
    isLoading: {
      control: "boolean",
      description:
        "When true, displays a loading spinner and disables the button",
    },
    disabled: {
      control: "boolean",
      description: "When true, disables the button",
    },
    iconLeft: {
      description: "Icon displayed on the left side of the button text",
    },
    iconRight: {
      description: "Icon displayed on the right side of the button text",
    },
    asChild: {
      control: "boolean",
      description:
        "When true, button will render as a child component (Radix UI Slot pattern)",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the button",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The standard button variations with different colors and styles.
 * Each variant conveys different levels of emphasis.
 */
export const BasicVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The standard button variations that provide different levels of emphasis and visual styling.",
      },
    },
  },
}

/**
 * Buttons in different sizes to fit various UI contexts.
 */
export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Buttons come in four sizes to accommodate different use cases and layouts.",
      },
    },
  },
}

/**
 * Showcase of buttons with icons positioned on the left side.
 */
export const WithLeftIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button iconLeft={<Plus />}>Add New</Button>
      <Button variant="secondary" iconLeft={<Download />}>
        Download
      </Button>
      <Button variant="destructive" iconLeft={<Trash />}>
        Delete
      </Button>
      <Button variant="outline" iconLeft={<Settings />}>
        Settings
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Buttons with left-aligned icons for additional visual context.",
      },
    },
  },
}

/**
 * Showcase of buttons with icons positioned on the right side.
 */
export const WithRightIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button iconRight={<ChevronRight />}>Next</Button>
      <Button variant="secondary" iconRight={<Mail />}>
        Send
      </Button>
      <Button variant="destructive" iconRight={<AlertCircle />}>
        Warning
      </Button>
      <Button variant="outline" iconRight={<Bell />}>
        Notifications
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Buttons with right-aligned icons, useful for actions or navigation cues.",
      },
    },
  },
}

/**
 * Buttons with icons on both sides for enhanced visual communication.
 */
export const WithIconsOnBothSides: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button iconLeft={<Mail />} iconRight={<ChevronRight />}>
        Messages
      </Button>
      <Button variant="secondary" iconLeft={<Save />} iconRight={<Check />}>
        Save Changes
      </Button>
      <Button
        variant="outline"
        iconLeft={<Settings />}
        iconRight={<ChevronRight />}
      >
        Advanced Settings
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Buttons with icons on both sides for enhanced visual communication.",
      },
    },
  },
}

/**
 * Icon-only buttons for compact UI elements.
 */
export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button iconLeft={<Plus />} iconOnly aria-label="Add item" />
      <Button
        variant="secondary"
        iconLeft={<Settings />}
        iconOnly
        aria-label="Settings"
      />
      <Button
        variant="destructive"
        iconLeft={<Trash />}
        iconOnly
        aria-label="Delete"
      />
      <Button
        variant="outline"
        iconLeft={<Bell />}
        iconOnly
        aria-label="Notifications"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Icon-only buttons for compact UI elements. Always include aria-label for accessibility.",
      },
    },
  },
}

/**
 * Rounded buttons for a softer, more modern appearance.
 */
export const RoundedButtons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button isRounded>Rounded</Button>
      <Button variant="secondary" isRounded iconLeft={<Plus />}>
        New Item
      </Button>
      <Button variant="outline" isRounded>
        Outline Rounded
      </Button>
      <Button
        variant="destructive"
        isRounded
        iconLeft={<Trash />}
        iconOnly
        aria-label="Delete"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Rounded buttons provide a softer, more modern appearance for specific design needs.",
      },
    },
  },
}

/**
 * Buttons in loading state to indicate processing.
 */
export const LoadingStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button isLoading>Loading</Button>
      <Button variant="secondary" isLoading>
        Processing
      </Button>
      <Button variant="outline" isLoading>
        Submitting
      </Button>
      <Button variant="destructive" isLoading>
        Deleting
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Loading states provide visual feedback during asynchronous operations and prevent multiple submissions.",
      },
    },
  },
}

/**
 * Disabled buttons to indicate unavailable actions.
 */
export const DisabledStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled>Disabled</Button>
      <Button variant="secondary" disabled>
        Unavailable
      </Button>
      <Button variant="outline" disabled iconLeft={<Settings />}>
        Settings
      </Button>
      <Button variant="destructive" disabled>
        Cannot Delete
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Disabled buttons indicate that an action is currently unavailable.",
      },
    },
  },
}

/**
 * Combined examples showing various button configurations.
 */
export const CombinedExamples: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      <Button size="lg" iconLeft={<Plus />}>
        Create New
      </Button>
      <Button variant="secondary" isRounded iconRight={<ChevronRight />}>
        Continue
      </Button>
      <Button variant="destructive" size="sm" iconLeft={<Trash />}>
        Remove Item
      </Button>
      <Button variant="outline" isLoading>
        Uploading...
      </Button>
      <Button variant="ghost" iconLeft={<Settings />}>
        Preferences
      </Button>
      <Button variant="link" iconRight={<ChevronRight />}>
        Learn More
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Various button configurations demonstrating the flexibility of the component.",
      },
    },
  },
}
