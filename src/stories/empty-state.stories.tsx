import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state/empty-state"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Display/Empty State",
  component: EmptyState,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
EmptyState component displays a clear, informative message for scenarios when no data is available,
an error occurs, or a specific state needs to be communicated.

## When to use
- When there’s no content to display.
- For error states like API failures or connection issues.
- As a placeholder during maintenance or scheduled downtime.

## Accessibility
- Ensure that the state message is descriptive.
- Provide action elements, like buttons, when user intervention is required.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["search", "api-fail", "disconnected", "empty-data", "maintain"],
      description:
        "Determines the default icon and content to display for the chosen state",
    },
    title: {
      control: "text",
      description:
        "Custom title to override the default for the selected variant",
    },
    description: {
      control: "text",
      description:
        "Custom description to override the default for the selected variant",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to be applied to the component",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: "empty-data",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The default empty state with standard messaging and iconography.",
      },
    },
  },
}

export const SearchResults: Story = {
  args: {
    variant: "search",
    title: "No matching results",
    description: "Try adjusting your search criteria or filters.",
  },
  parameters: {
    docs: {
      description: {
        story: "Displayed when search yields no results.",
      },
    },
  },
}

export const APIFailure: Story = {
  args: {
    variant: "api-fail",
    title: "Unable to load data",
    description: "Please check your connection and try again.",
  },
  parameters: {
    docs: {
      description: {
        story: "Shown when API errors prevent data retrieval.",
      },
    },
  },
}

export const Disconnected: Story = {
  args: {
    variant: "disconnected",
    title: "Disconnected",
    description: "A connection issue has occurred. Please verify your network.",
  },
  parameters: {
    docs: {
      description: {
        story: "Indicates a network disconnection.",
      },
    },
  },
}

export const Maintenance: Story = {
  args: {
    variant: "maintain",
    title: "Under Maintenance",
    description:
      "This feature is currently under maintenance. Please check back later.",
  },
  parameters: {
    docs: {
      description: {
        story: "Displayed during maintenance periods.",
      },
    },
  },
}

export const WithAction: Story = {
  render: (args) => (
    <EmptyState {...args}>
      <Button>Reload</Button>
    </EmptyState>
  ),
  args: {
    variant: "api-fail",
    title: "Connection Lost",
    description: "We are experiencing issues connecting to the server.",
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state with an actionable button to retry the connection.",
      },
    },
  },
}

export const CustomStyling: Story = {
  args: {
    variant: "empty-data",
    title: "Your Cart is Empty",
    description: "Browse our collection and add items to your cart.",
    className: "bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg",
  },
  parameters: {
    docs: {
      description: {
        story: "A custom styled empty state for specific scenarios.",
      },
    },
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
      <EmptyState variant="search" />
      <EmptyState variant="api-fail" />
      <EmptyState variant="disconnected" />
      <EmptyState variant="empty-data" />
      <EmptyState variant="maintain" />
    </div>
  ),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: "A comprehensive overview of all empty state variants.",
      },
    },
  },
}
