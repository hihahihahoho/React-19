import { Badge } from "@/components/ui/badge"
import type { Meta, StoryObj } from "@storybook/react-vite"
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
} from "lucide-react"

/**
 * Badge component displays short information, statuses, or categories.
 * Use badges to highlight status, categorize items, or display counts.
 */
const meta = {
  title: "Display/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/badge.json
\`\`\`

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
      <Badge variant="green">
        <Check className="size-4" />
        Success
      </Badge>
      <Badge variant="orange">
        <AlertTriangle className="size-4" />
        Warning
      </Badge>
      <Badge variant="blue">
        <Info className="size-4" />
        Information
      </Badge>
      <Badge variant="red">
        <AlertCircle className="size-4" />
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
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge>
        <Bell className="size-4" />
        Notifications
      </Badge>
      <Badge variant="secondary">
        <Star className="size-4" />
        Featured
      </Badge>
      <Badge variant="destructive">
        <AlertCircle className="size-4" />
        Critical
      </Badge>
      <Badge variant="outline">
        <Tag className="size-4" />
        Tagged
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Badges with icons as children for additional visual context.",
      },
    },
  },
}

/**
 * Badges with multiple icons as children.
 */
export const WithMultipleIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge>
        <Mail className="size-4" />
        Messages
        <Check className="size-4" />
      </Badge>
      <Badge variant="secondary">
        <Clock className="size-4" />
        Pending
        <ChevronRight className="size-4" />
      </Badge>
      <Badge variant="destructive">
        <AlertCircle className="size-4" />
        Error
        <CircleX className="size-4" />
      </Badge>
      <Badge variant="outline">
        <Tag className="size-4" />
        Category
        <Settings className="size-4" />
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Badges with multiple icons as children provide rich visual context for complex states or actions.",
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
      <Badge clearBtn>Default</Badge>
      <Badge variant="secondary" clearBtn>
        <Star className="size-4" />
        Starred
      </Badge>
      <Badge variant="destructive" clearBtn>
        Error
      </Badge>
      <Badge variant="outline" clearBtn>
        <Tag className="size-4" />
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
 * Combined showcase demonstrating different badge sizes with icons.
 */
export const SizesWithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <Badge size="xs">
          <Bell className="size-4" />
          XSmall
        </Badge>
        <Badge size="xs">
          XSmall
          <ChevronRight className="size-4" />
        </Badge>
        <Badge size="xs">
          <Star className="size-4" />
          XSmall
          <Check className="size-4" />
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Badge size="sm">
          <Bell className="size-4" />
          Small
        </Badge>
        <Badge size="sm">
          Small
          <ChevronRight className="size-4" />
        </Badge>
        <Badge size="sm">
          <Star className="size-4" />
          Small
          <Check className="size-4" />
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Badge size="md">
          <Bell className="size-4" />
          Medium
        </Badge>
        <Badge size="md">
          Medium
          <ChevronRight className="size-4" />
        </Badge>
        <Badge size="md">
          <Star className="size-4" />
          Medium
          <Check className="size-4" />
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Badge size="lg">
          <Bell className="size-4" />
          Large
        </Badge>
        <Badge size="lg">
          Large
          <ChevronRight className="size-4" />
        </Badge>
        <Badge size="lg">
          <Star className="size-4" />
          Large
          <Check className="size-4" />
        </Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Comparison of different badge sizes with icons as children.",
      },
    },
  },
}

// ...existing code...

/**
 * Example showing how badges can be customized with different shapes.
 */
export const Customization: Story = {
  render: () => (
    <div className="grid gap-6">
      <div>
        <h3 className="mb-2 text-sm font-medium">Circle Badges</h3>
        <div className="flex flex-wrap gap-4">
          <Badge className="flex aspect-square h-6 w-6 items-center justify-center rounded-full p-0">
            3
          </Badge>
          <Badge
            variant="secondary"
            className="flex aspect-square h-8 w-8 items-center justify-center rounded-full p-0"
          >
            <Bell className="size-4" />
          </Badge>
          <Badge
            variant="blue"
            className="flex aspect-square h-10 w-10 items-center justify-center rounded-full p-0"
          >
            <Mail className="size-5" />
          </Badge>
          <Badge
            variant="green"
            className="flex aspect-square h-12 w-12 items-center justify-center rounded-full p-0"
          >
            <Check className="size-6" />
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Square Badges</h3>
        <div className="flex flex-wrap gap-4">
          <Badge className="flex aspect-square h-6 w-6 items-center justify-center rounded-md p-0">
            5
          </Badge>
          <Badge
            variant="secondary"
            className="flex aspect-square h-8 w-8 items-center justify-center rounded-md p-0"
          >
            <Star className="size-4" />
          </Badge>
          <Badge
            variant="red"
            className="flex aspect-square h-10 w-10 items-center justify-center rounded-md p-0"
          >
            <AlertCircle className="size-5" />
          </Badge>
          <Badge
            variant="orange"
            className="flex aspect-square h-12 w-12 items-center justify-center rounded-sm p-0"
          >
            <AlertTriangle className="size-6" />
          </Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Custom-shaped badges provide versatile styling options:

- **Circle badges** are perfect for notification counts, status indicators, and avatar badges
- **Square badges** work well for app icons, feature highlights, and custom indicators
- Custom shapes can be easily created using Tailwind CSS classes
- Use \`aspect-square\`, \`rounded-full\`, \`p-0\` and specific height/width for perfect circles
- For notification indicators, use absolute positioning with negative offsets
        `,
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
          <Badge>
            <Bell className="size-4" />
            Notifications
          </Badge>
          <Badge>
            Messages
            <Mail className="size-4" />
          </Badge>
          <Badge>
            <Star className="size-4" />
            Favorite
            <Heart className="size-4" />
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Interactive Features</h3>
        <div className="flex flex-wrap gap-2">
          <Badge clearBtn>Clearable</Badge>
          <Badge clearBtn>
            <Tag className="size-4" />
            Interactive
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Common Use Cases</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="green">
            <Check className="size-4" />
            Completed
          </Badge>
          <Badge variant="blue">
            <Info className="size-4" />
            New
          </Badge>
          <Badge variant="orange">
            <Clock className="size-4" />
            Pending
          </Badge>
          <Badge variant="red">
            <AlertCircle className="size-4" />
            Failed
          </Badge>
          <Badge variant="secondary" clearBtn>
            Filter
          </Badge>
          <Badge variant="outline">
            <Tag className="size-4" />
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
      <Badge clearBtn>
        <Bell className="size-4" />
        Notifications
      </Badge>
      <Badge variant="secondary" clearBtn>
        <Star className="size-4" />
        Featured
      </Badge>
      <Badge variant="blue" clearBtn>
        <Info className="size-4" />
        Info
      </Badge>
      <Badge variant="red" clearBtn>
        <AlertCircle className="size-4" />
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
