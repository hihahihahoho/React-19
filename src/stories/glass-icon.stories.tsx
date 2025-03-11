import { GlassIcon, glassIconColorVariants } from "@/components/ui/glass-icon"
import type { Meta, StoryObj } from "@storybook/react"
import {
  AlarmClock,
  AlignLeft,
  Bell,
  Calendar,
  Crown,
  FileText,
  Image,
  Mail,
  MessageCircle,
  Music,
  Settings,
  Star,
  UploadCloud,
  User,
} from "lucide-react"

/**
 * GlassIcon component creates stylish glass-effect icons with background shadows.
 * Use to add visual interest and depth to UI elements.
 */
const meta = {
  title: "BASE/Glass Icon",
  component: GlassIcon,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
GlassIcon components add depth and visual interest with a glassmorphic style.
These icons feature a frosted glass effect with subtle backgrounds and shadows.

## When to use
- To create visually distinctive icon elements
- To add depth to UI with minimal visual weight
- For feature highlights or marketing sections
- When you want to create a modern, light interface aesthetic

## Accessibility
- Icons should be used alongside descriptive text when conveying important information
- Ensure sufficient contrast between the icon and its background
- Consider using aria-label when icons are used alone for interactive elements
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "card"],
      description: "Controls the shape and style of the glass icon",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "lg"],
      description: "Controls the size of the glass icon",
      table: {
        defaultValue: { summary: "sm" },
      },
    },
    color: {
      control: "select",
      options: Object.keys(glassIconColorVariants),
      description: "Preset background color that adapts for light/dark modes",
      table: {
        defaultValue: { summary: "gray" },
      },
    },
    children: {
      description: "Icon element displayed inside the glass container",
    },
    backgroundClassName: {
      control: "text",
      description:
        "Additional CSS classes to customize the background element (overrides color prop)",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the glass icon wrapper",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GlassIcon>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic examples showing different variants and sizes of glass icons.
 */
export const BasicVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <GlassIcon>
        <UploadCloud />
      </GlassIcon>
      <GlassIcon size="lg">
        <UploadCloud />
      </GlassIcon>
      <GlassIcon color="blue" variant="card">
        <Music />
      </GlassIcon>
      <GlassIcon color="blue" variant="card" size="lg">
        <Music />
      </GlassIcon>
      <GlassIcon color="red" variant="default">
        <AlignLeft />
      </GlassIcon>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Basic examples showing the different variants and sizes of Glass Icons.",
      },
    },
  },
}

/**
 * Standard-sized glass icons with different background colors.
 */
export const ColorVariants: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6">
      <GlassIcon color="blue">
        <Mail />
      </GlassIcon>
      <GlassIcon color="green">
        <MessageCircle />
      </GlassIcon>
      <GlassIcon color="amber">
        <Bell />
      </GlassIcon>
      <GlassIcon color="purple">
        <User />
      </GlassIcon>
      <GlassIcon color="rose">
        <Image />
      </GlassIcon>
      <GlassIcon color="cyan">
        <FileText />
      </GlassIcon>
      <GlassIcon color="emerald">
        <Calendar />
      </GlassIcon>
      <GlassIcon color="indigo">
        <Settings />
      </GlassIcon>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Glass icons can be customized with different background colors using the color prop.",
      },
    },
  },
}

/**
 * Card-style glass icons with different background colors.
 */
export const CardVariants: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6">
      <GlassIcon variant="card" color="blue">
        <Mail />
      </GlassIcon>
      <GlassIcon variant="card" color="green">
        <MessageCircle />
      </GlassIcon>
      <GlassIcon variant="card" color="amber">
        <Bell />
      </GlassIcon>
      <GlassIcon variant="card" color="purple">
        <User />
      </GlassIcon>
      <GlassIcon variant="card" color="rose">
        <Image />
      </GlassIcon>
      <GlassIcon variant="card" color="cyan">
        <FileText />
      </GlassIcon>
      <GlassIcon variant="card" color="emerald">
        <Calendar />
      </GlassIcon>
      <GlassIcon variant="card" color="indigo">
        <Settings />
      </GlassIcon>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Card-style glass icons feature a taller, card-like shape that works well for UI cards and feature sections.",
      },
    },
  },
}

/**
 * Large-sized glass icons for greater visual impact.
 */
export const LargeSizes: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-10">
      <GlassIcon size="lg" color="blue">
        <Star />
      </GlassIcon>
      <GlassIcon size="lg" color="purple">
        <Crown />
      </GlassIcon>
      <GlassIcon variant="card" size="lg" color="amber">
        <AlarmClock />
      </GlassIcon>
      <GlassIcon variant="card" size="lg" color="rose">
        <Music />
      </GlassIcon>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Large glass icons provide greater visual impact and are suitable for feature highlights or marketing sections.",
      },
    },
  },
}

/**
 * Example showing custom colors using backgroundClassName.
 */
export const CustomColors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      <GlassIcon backgroundClassName="bg-pink-400 dark:bg-pink-500">
        <Mail />
      </GlassIcon>
      <GlassIcon backgroundClassName="bg-gradient-to-br from-purple-500 to-blue-600">
        <Star />
      </GlassIcon>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "For custom colors or gradients not in the preset list, you can still use backgroundClassName.",
      },
    },
  },
}

/**
 * Fully interactive example with all available props.
 */
export const Interactive: Story = {
  args: {
    variant: "default",
    size: "sm",
    color: "blue",
    children: <UploadCloud />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A fully interactive glass icon that can be customized using the Controls panel.",
      },
    },
  },
}
