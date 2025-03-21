import { Badge } from "@/components/ui/badge/badge"
import type { Meta, StoryObj } from "@storybook/react"
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Check,
  ChevronRight,
  CircleX,
  Clock,
  Heart,
  Info,
  Mail,
  Settings,
  Star,
  Tag,
  Trash,
} from "lucide-react"

/**
 * Badge component displays short information, statuses, or categories.
 * Use badges to highlight status, categorize items, or display counts.
 */
const meta = {
  title: "BASE/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Badge components are used to highlight status, indicate categories, or show counts. 
They can include icons, display text, and have interactive elements like tooltips or clear buttons.

## When to use
- To highlight status information (success, warning, error)
- To categorize or label content
- To show counts or notifications
- To display compact, non-interactive information

## Accessibility
- Badges are primarily visual elements and should not be the only means of conveying important information
- When using badges for status, consider using appropriate colors that meet contrast requirements
- Interactive badges (with clear buttons) should have proper keyboard support
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
        "red",
        "orange",
        "amber",
        "yellow",
        "lime",
        "green",
        "emerald",
        "teal",
        "cyan",
        "sky",
        "blue",
        "indigo",
        "violet",
        "purple",
        "fuchsia",
        "pink",
        "rose",
        "zinc",
      ],
      description: "Controls the visual style of the badge",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Controls the size of the badge",
      table: {
        defaultValue: { summary: "sm" },
      },
    },
    children: {
      description: "The content displayed inside the badge",
      control: "text",
    },
    clearBtn: {
      control: "boolean",
      description:
        "When true, displays a clear button (×) on the right side of the badge",
    },
    onClearBtnClick: {
      description: "Function called when the clear button is clicked",
      action: "clear clicked",
    },
    iconLeft: {
      description: "Icon displayed on the left side of the badge",
    },
    iconRight: {
      description: "Icon displayed on the right side of the badge",
    },
    tooltip: {
      control: "text",
      description: "Text displayed in tooltip when hovering over the badge",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the badge",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The standard badge variations with different colors and styles.
 * Each variant conveys different levels of emphasis.
 */
export const BasicVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The standard badge variations that provide different levels of emphasis.",
      },
    },
  },
}

/**
 * Color variants for various contexts like success, warning, info, and error.
 */
export const ColorVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="green" iconLeft={<Check className="size-4" />}>
        Success
      </Badge>
      <Badge variant="orange" iconLeft={<AlertTriangle className="size-4" />}>
        Warning
      </Badge>
      <Badge variant="blue" iconLeft={<Info className="size-4" />}>
        Information
      </Badge>
      <Badge variant="red" iconLeft={<AlertCircle className="size-4" />}>
        Error
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Color variants are useful for status indicators with semantic meaning.",
      },
    },
  },
}

/**
 * Showcase of all available color variants for badges.
 */
export const AllColorVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      <Badge variant="red">Red</Badge>
      <Badge variant="orange">Orange</Badge>
      <Badge variant="amber">Amber</Badge>
      <Badge variant="yellow">Yellow</Badge>
      <Badge variant="lime">Lime</Badge>
      <Badge variant="green">Green</Badge>
      <Badge variant="emerald">Emerald</Badge>
      <Badge variant="teal">Teal</Badge>
      <Badge variant="cyan">Cyan</Badge>
      <Badge variant="sky">Sky</Badge>
      <Badge variant="blue">Blue</Badge>
      <Badge variant="indigo">Indigo</Badge>
      <Badge variant="violet">Violet</Badge>
      <Badge variant="purple">Purple</Badge>
      <Badge variant="fuchsia">Fuchsia</Badge>
      <Badge variant="pink">Pink</Badge>
      <Badge variant="rose">Rose</Badge>
      <Badge variant="zinc">Zinc</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Complete set of color variants available for badges to match your design system.",
      },
    },
  },
}

/**
 * Badges in different sizes to fit various UI contexts.
 */
export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge size="xs">XSmall</Badge>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Badges come in three sizes to accommodate different use cases and layouts.",
      },
    },
  },
}

/**
 * Showcase of badges with icons positioned on the left side.
 */
export const WithLeftIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge iconLeft={<Bell className="size-4" />}>Notifications</Badge>
      <Badge variant="secondary" iconLeft={<Star className="size-4" />}>
        Featured
      </Badge>
      <Badge
        variant="destructive"
        iconLeft={<AlertCircle className="size-4" />}
      >
        Critical
      </Badge>
      <Badge variant="outline" iconLeft={<Tag className="size-4" />}>
        Tagged
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Badges with left-aligned icons for additional visual context.",
      },
    },
  },
}

/**
 * Showcase of badges with icons positioned on the right side.
 */
export const WithRightIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge iconRight={<Check className="size-4" />}>Status</Badge>
      <Badge
        variant="secondary"
        iconRight={<ChevronRight className="size-4" />}
      >
        Next
      </Badge>
      <Badge variant="destructive" iconRight={<Trash className="size-4" />}>
        Remove
      </Badge>
      <Badge variant="outline" iconRight={<Settings className="size-4" />}>
        Settings
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Badges with right-aligned icons, useful for actions or navigation cues.",
      },
    },
  },
}

/**
 * Badges with icons on both sides for enhanced visual communication.
 */
export const WithIconsOnBothSides: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge
        iconLeft={<Mail className="size-4" />}
        iconRight={<Check className="size-4" />}
      >
        Messages
      </Badge>
      <Badge
        variant="secondary"
        iconLeft={<Clock className="size-4" />}
        iconRight={<ChevronRight className="size-4" />}
      >
        Pending
      </Badge>
      <Badge
        variant="destructive"
        iconLeft={<AlertCircle className="size-4" />}
        iconRight={<CircleX className="size-4" />}
      >
        Error
      </Badge>
      <Badge
        variant="outline"
        iconLeft={<Tag className="size-4" />}
        iconRight={<Settings className="size-4" />}
      >
        Category
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Badges with icons on both sides provide rich visual context for complex states or actions.",
      },
    },
  },
}

/**
 * Badges with clear buttons for dismissible tags or filters.
 */
export const WithClearButtons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge clearBtn onClearBtnClick={() => console.log("Default cleared")}>
        Default
      </Badge>
      <Badge
        variant="secondary"
        clearBtn
        onClearBtnClick={() => console.log("Secondary cleared")}
        iconLeft={<Star className="size-4" />}
      >
        Starred
      </Badge>
      <Badge
        variant="destructive"
        clearBtn
        onClearBtnClick={() => console.log("Destructive cleared")}
      >
        Error
      </Badge>
      <Badge
        variant="outline"
        clearBtn
        onClearBtnClick={() => console.log("Outline cleared")}
        iconLeft={<Tag className="size-4" />}
      >
        Tag
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Badges with clear buttons are useful for dismissible tags, filters, or selections.",
      },
    },
  },
}

/**
 * Badges with tooltips to provide additional information or context.
 */
export const WithTooltips: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge
        tooltip="3 unread notifications"
        iconLeft={<Bell className="size-4" />}
      >
        3
      </Badge>
      <Badge
        variant="secondary"
        tooltip="Featured content"
        iconLeft={<Star className="size-4" />}
      >
        Featured
      </Badge>
      <Badge
        variant="destructive"
        tooltip="Critical system error"
        iconLeft={<AlertCircle className="size-4" />}
      >
        Critical
      </Badge>
      <Badge
        variant="blue"
        tooltip="System is running normally"
        iconLeft={<Info className="size-4" />}
      >
        System Status
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Badges with tooltips provide additional context or explanation when hovered.",
      },
    },
  },
}

/**
 * Combined showcase demonstrating different badge sizes with icons.
 */
export const SizesWithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <Badge size="xs" iconLeft={<Bell className="size-4" />}>
          XSmall
        </Badge>
        <Badge size="xs" iconRight={<ChevronRight className="size-4" />}>
          XSmall
        </Badge>
        <Badge
          size="xs"
          iconLeft={<Star className="size-4" />}
          iconRight={<Check className="size-4" />}
        >
          XSmall
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Badge size="sm" iconLeft={<Bell className="size-4" />}>
          Small
        </Badge>
        <Badge size="sm" iconRight={<ChevronRight className="size-4" />}>
          Small
        </Badge>
        <Badge
          size="sm"
          iconLeft={<Star className="size-4" />}
          iconRight={<Check className="size-4" />}
        >
          Small
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Badge size="md" iconLeft={<Bell className="size-4" />}>
          Medium
        </Badge>
        <Badge size="md" iconRight={<ChevronRight className="size-4" />}>
          Medium
        </Badge>
        <Badge
          size="md"
          iconLeft={<Star className="size-4" />}
          iconRight={<Check className="size-4" />}
        >
          Medium
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Badge size="lg" iconLeft={<Bell className="size-4" />}>
          Large
        </Badge>
        <Badge size="lg" iconRight={<ChevronRight className="size-4" />}>
          Large
        </Badge>
        <Badge
          size="lg"
          iconLeft={<Star className="size-4" />}
          iconRight={<Check className="size-4" />}
        >
          Large
        </Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Comparison of different badge sizes with icon placement variations.",
      },
    },
  },
}

/**
 * A comprehensive showcase of all badge variants, sizes, and features.
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div className="grid gap-6">
      <div>
        <h3 className="mb-2 text-sm font-medium">Standard Variants</h3>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Status Color Variants</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="green">Success</Badge>
          <Badge variant="red">Error</Badge>
          <Badge variant="blue">Information</Badge>
          <Badge variant="orange">Warning</Badge>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Additional Color Variants</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="amber">Amber</Badge>
          <Badge variant="yellow">Yellow</Badge>
          <Badge variant="lime">Lime</Badge>
          <Badge variant="emerald">Emerald</Badge>
          <Badge variant="teal">Teal</Badge>
          <Badge variant="cyan">Cyan</Badge>
          <Badge variant="sky">Sky</Badge>
          <Badge variant="indigo">Indigo</Badge>
          <Badge variant="violet">Violet</Badge>
          <Badge variant="purple">Purple</Badge>
          <Badge variant="fuchsia">Fuchsia</Badge>
          <Badge variant="pink">Pink</Badge>
          <Badge variant="rose">Rose</Badge>
          <Badge variant="zinc">Zinc</Badge>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Sizes</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">With Icons</h3>
        <div className="flex flex-wrap gap-2">
          <Badge iconLeft={<Bell className="size-4" />}>Notifications</Badge>
          <Badge iconRight={<Mail className="size-4" />}>Messages</Badge>
          <Badge
            iconLeft={<Star className="size-4" />}
            iconRight={<Heart className="size-4" />}
          >
            Favorite
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Interactive Features</h3>
        <div className="flex flex-wrap gap-2">
          <Badge clearBtn onClearBtnClick={() => console.log("Cleared")}>
            Clearable
          </Badge>
          <Badge tooltip="Additional information displayed on hover">
            With Tooltip
          </Badge>
          <Badge
            clearBtn
            onClearBtnClick={() => console.log("Cleared")}
            tooltip="Click × to remove"
            iconLeft={<Tag className="size-4" />}
          >
            Interactive
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Common Use Cases</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="green" iconLeft={<Check className="size-4" />}>
            Completed
          </Badge>
          <Badge variant="blue" iconLeft={<Info className="size-4" />}>
            New
          </Badge>
          <Badge variant="orange" iconLeft={<Clock className="size-4" />}>
            Pending
          </Badge>
          <Badge variant="red" iconLeft={<AlertCircle className="size-4" />}>
            Failed
          </Badge>
          <Badge variant="secondary" clearBtn>
            Filter
          </Badge>
          <Badge variant="outline" iconLeft={<Tag className="size-4" />}>
            Category
          </Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A comprehensive showcase displaying all badge variants, sizes, and features for reference.",
      },
    },
  },
}

/**
 * Example showing how to use badges with both icons and clear functionality.
 */
export const WithIconsAndClear: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge
        clearBtn
        onClearBtnClick={() => console.log("Default cleared")}
        iconLeft={<Bell className="size-4" />}
      >
        Notifications
      </Badge>
      <Badge
        variant="secondary"
        clearBtn
        onClearBtnClick={() => console.log("Secondary cleared")}
        iconLeft={<Star className="size-4" />}
      >
        Featured
      </Badge>
      <Badge
        variant="blue"
        clearBtn
        onClearBtnClick={() => console.log("Info cleared")}
        iconLeft={<Info className="size-4" />}
      >
        Info
      </Badge>
      <Badge
        variant="red"
        clearBtn
        onClearBtnClick={() => console.log("Error cleared")}
        iconLeft={<AlertCircle className="size-4" />}
      >
        Error
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Badges with both icons and clear functionality, useful for dismissible notifications or tags.",
      },
    },
  },
}
