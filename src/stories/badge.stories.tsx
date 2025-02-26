import { Badge } from "@/components/ui/badge/badge";
import type { Meta, StoryObj } from "@storybook/react";
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
} from "lucide-react";

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
        "lightGreen",
        "lightRed",
        "lightBlue",
        "lightOrange",
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
      <div className="p-6 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The standard badge variations with different colors and styles.
 * Each variant conveys different levels of emphasis.
 */
export const BasicVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
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
};

/**
 * Light colored variants for various contexts like success, warning, info, and error.
 */
export const LightColorVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Badge variant="lightGreen">
        <Check className="size-4" /> Success
      </Badge>
      <Badge variant="lightOrange">
        <AlertTriangle className="size-4" /> Warning
      </Badge>
      <Badge variant="lightBlue">
        <Info className="size-4" /> Information
      </Badge>
      <Badge variant="lightRed">
        <AlertCircle className="size-4" /> Error
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Light colored variants are useful for status indicators with reduced visual weight.",
      },
    },
  },
};

/**
 * Badges in different sizes to fit various UI contexts.
 */
export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
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
};

/**
 * Showcase of badges with icons positioned on the left side.
 */
export const WithLeftIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge>
        <Bell className="size-4" /> Notifications
      </Badge>
      <Badge variant="secondary">
        <Star className="size-4" /> Featured
      </Badge>
      <Badge variant="destructive">
        <AlertCircle className="size-4" /> Critical
      </Badge>
      <Badge variant="outline">
        <Tag className="size-4" /> Tagged
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
};

/**
 * Showcase of badges with icons positioned on the right side.
 */
export const WithRightIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge>
        Status <Check className="size-4" />
      </Badge>
      <Badge variant="secondary">
        Next <ChevronRight className="size-4" />
      </Badge>
      <Badge variant="destructive">
        Remove <Trash className="size-4" />
      </Badge>
      <Badge variant="outline">
        Settings <Settings className="size-4" />
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
};

/**
 * Badges with icons on both sides for enhanced visual communication.
 */
export const WithIconsOnBothSides: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge>
        <Mail className="size-4" /> Messages <Check className="size-4" />
      </Badge>
      <Badge variant="secondary">
        <Clock className="size-4" /> Pending <ChevronRight className="size-4" />
      </Badge>
      <Badge variant="destructive">
        <AlertCircle className="size-4" /> Error <CircleX className="size-4" />
      </Badge>
      <Badge variant="outline">
        <Tag className="size-4" /> Category <Settings className="size-4" />
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
};

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
      >
        <Star className="size-4" /> Starred
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
      >
        <Tag className="size-4" /> Tag
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
};

/**
 * Badges with tooltips to provide additional information or context.
 */
export const WithTooltips: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge tooltip="3 unread notifications">
        <Bell className="size-4" /> 3
      </Badge>
      <Badge variant="secondary" tooltip="Featured content">
        <Star className="size-4" /> Featured
      </Badge>
      <Badge variant="destructive" tooltip="Critical system error">
        <AlertCircle className="size-4" /> Critical
      </Badge>
      <Badge variant="lightBlue" tooltip="System is running normally">
        <Info className="size-4" /> System Status
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
};

/**
 * Combined showcase demonstrating different badge sizes with icons.
 */
export const SizesWithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4 items-center">
        <Badge size="sm">
          <Bell className="size-4" /> Small
        </Badge>
        <Badge size="sm">
          Small <ChevronRight className="size-4" />
        </Badge>
        <Badge size="sm">
          <Star className="size-4" /> Small <Check className="size-4" />
        </Badge>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <Badge size="md">
          <Bell className="size-4" /> Medium
        </Badge>
        <Badge size="md">
          Medium <ChevronRight className="size-4" />
        </Badge>
        <Badge size="md">
          <Star className="size-4" /> Medium <Check className="size-4" />
        </Badge>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <Badge size="lg">
          <Bell className="size-4" /> Large
        </Badge>
        <Badge size="lg">
          Large <ChevronRight className="size-4" />
        </Badge>
        <Badge size="lg">
          <Star className="size-4" /> Large <Check className="size-4" />
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
};

/**
 * A comprehensive showcase of all badge variants, sizes, and features.
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div className="grid gap-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Standard Variants</h3>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Light Color Variants</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="lightGreen">Success</Badge>
          <Badge variant="lightRed">Error</Badge>
          <Badge variant="lightBlue">Information</Badge>
          <Badge variant="lightOrange">Warning</Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Sizes</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">With Icons</h3>
        <div className="flex flex-wrap gap-2">
          <Badge>
            <Bell className="size-4" /> Notifications
          </Badge>
          <Badge>
            Messages <Mail className="size-4" />
          </Badge>
          <Badge>
            <Star className="size-4" /> Favorite <Heart className="size-4" />
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Interactive Features</h3>
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
          >
            <Tag className="size-4" /> Interactive
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Common Use Cases</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="lightGreen">
            <Check className="size-4" /> Completed
          </Badge>
          <Badge variant="lightBlue">
            <Info className="size-4" /> New
          </Badge>
          <Badge variant="lightOrange">
            <Clock className="size-4" /> Pending
          </Badge>
          <Badge variant="lightRed">
            <AlertCircle className="size-4" /> Failed
          </Badge>
          <Badge variant="secondary" clearBtn>
            Filter
          </Badge>
          <Badge variant="outline">
            <Tag className="size-4" /> Category
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
};

/**
 * Fully interactive example with all available props.
 */
export const Interactive: Story = {
  args: {
    children: "Interactive Badge",
    variant: "default",
    size: "md",
    clearBtn: false,
    tooltip: "This is a customizable badge",
    onClearBtnClick: () => alert("Badge cleared"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A fully interactive badge that can be customized using the Controls panel.",
      },
    },
  },
};

/**
 * Example showing how to use badges with both icons and clear functionality.
 */
export const WithIconsAndClear: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge clearBtn onClearBtnClick={() => console.log("Default cleared")}>
        <Bell className="size-4" /> Notifications
      </Badge>
      <Badge
        variant="secondary"
        clearBtn
        onClearBtnClick={() => console.log("Secondary cleared")}
      >
        <Star className="size-4" /> Featured
      </Badge>
      <Badge
        variant="lightBlue"
        clearBtn
        onClearBtnClick={() => console.log("Info cleared")}
      >
        <Info className="size-4" /> Info
      </Badge>
      <Badge
        variant="lightRed"
        clearBtn
        onClearBtnClick={() => console.log("Error cleared")}
      >
        <AlertCircle className="size-4" /> Error
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
};
