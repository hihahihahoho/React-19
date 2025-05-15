/* eslint-disable react-hooks/rules-of-hooks */
import {
  TabsContentLine,
  TabsLine,
  TabsListLine,
  TabsTriggerLine,
} from "@/components/ui/tabs/tabs-line"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { Meta, StoryObj } from "@storybook/react"
import { Code, Cog, Terminal } from "lucide-react"

/**
 * Line Tabs organize content into multiple sections with minimalist styling.
 * They use an underline indicator for the active tab.
 */
const meta = {
  title: "Controls/Tabs/Line",
  component: TabsLine,
  parameters: {
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/tabs-line.json
\`\`\`

Line tabs provide a minimalist style with an underline indicator for the active tab. 
They're ideal for interfaces where you want a cleaner, less prominent tab style.

## When to use
- For a cleaner, more minimalist interface
- When you want less visual weight in your tabs
- For content that needs a more subtle separation
- When space is at a premium

## Accessibility
- Tabs use the WAI-ARIA Tabs pattern with proper keyboard navigation
- Arrow keys allow navigation between tabs
- Tab key follows the page's tab sequence
- Each tab panel is associated with its triggering tab
- Active tabs are clearly indicated visually and through ARIA attributes
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Controls the size of the tabs",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    value: {
      control: "text",
      description: "The controlled value of the selected tab",
    },
    defaultValue: {
      control: "text",
      description: "The default value of the selected tab (uncontrolled)",
    },
    onValueChange: {
      description: "Callback function called when the selected tab changes",
      action: "tab changed",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TabsLine>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The standard tabs with line variant.
 */
export const Basic: Story = {
  render: () => (
    <div>
      <h3 className="mb-2 text-sm font-medium">Line Variant</h3>
      <TabsLine defaultValue="overview">
        <TabsListLine>
          <TabsTriggerLine value="overview">Overview</TabsTriggerLine>
          <TabsTriggerLine value="analytics">Analytics</TabsTriggerLine>
          <TabsTriggerLine value="reports">Reports</TabsTriggerLine>
          <TabsTriggerLine value="notifications">Notifications</TabsTriggerLine>
        </TabsListLine>
        <TabsContentLine value="overview">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Overview</h3>
            <p className="text-muted-foreground text-sm">
              View a summary of your account activity.
            </p>
          </div>
        </TabsContentLine>
        <TabsContentLine value="analytics">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Analytics</h3>
            <p className="text-muted-foreground text-sm">
              View detailed analytics for your account.
            </p>
          </div>
        </TabsContentLine>
        <TabsContentLine value="reports">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Reports</h3>
            <p className="text-muted-foreground text-sm">
              Download and view reports.
            </p>
          </div>
        </TabsContentLine>
        <TabsContentLine value="notifications">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <p className="text-muted-foreground text-sm">
              Manage your notification preferences.
            </p>
          </div>
        </TabsContentLine>
      </TabsLine>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The line variant provides a minimalist tab style with an underline indicator.",
      },
    },
  },
}

/**
 * Example of tabs with different sizes in line variant.
 */
export const Sizes: Story = {
  render: () => (
    <div className="grid gap-6">
      <div>
        <h3 className="mb-2 text-sm font-medium">Small Size</h3>
        <TabsLine defaultValue="sm" size="sm">
          <TabsListLine>
            <TabsTriggerLine value="sm">Small</TabsTriggerLine>
            <TabsTriggerLine value="md">Medium</TabsTriggerLine>
            <TabsTriggerLine value="lg">Large</TabsTriggerLine>
          </TabsListLine>
          <TabsContentLine value="sm">
            <div className="rounded-lg border p-3">
              <p className="text-xs">Small tabs content - line variant</p>
            </div>
          </TabsContentLine>
          <TabsContentLine value="md">
            <div className="rounded-lg border p-3">
              <p className="text-xs">Medium tabs content - line variant</p>
            </div>
          </TabsContentLine>
          <TabsContentLine value="lg">
            <div className="rounded-lg border p-3">
              <p className="text-xs">Large tabs content - line variant</p>
            </div>
          </TabsContentLine>
        </TabsLine>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Default Size</h3>
        <TabsLine defaultValue="sm">
          <TabsListLine>
            <TabsTriggerLine value="sm">Small</TabsTriggerLine>
            <TabsTriggerLine value="md">Medium</TabsTriggerLine>
            <TabsTriggerLine value="lg">Large</TabsTriggerLine>
          </TabsListLine>
          <TabsContentLine value="sm">
            <div className="rounded-lg border p-4">
              <p className="text-sm">Small tabs content - line variant</p>
            </div>
          </TabsContentLine>
          <TabsContentLine value="md">
            <div className="rounded-lg border p-4">
              <p className="text-sm">Medium tabs content - line variant</p>
            </div>
          </TabsContentLine>
          <TabsContentLine value="lg">
            <div className="rounded-lg border p-4">
              <p className="text-sm">Large tabs content - line variant</p>
            </div>
          </TabsContentLine>
        </TabsLine>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Large Size</h3>
        <TabsLine defaultValue="sm" size="lg">
          <TabsListLine>
            <TabsTriggerLine value="sm">Small</TabsTriggerLine>
            <TabsTriggerLine value="md">Medium</TabsTriggerLine>
            <TabsTriggerLine value="lg">Large</TabsTriggerLine>
          </TabsListLine>
          <TabsContentLine value="sm">
            <div className="rounded-lg border p-4">
              <p>Small tabs content - line variant</p>
            </div>
          </TabsContentLine>
          <TabsContentLine value="md">
            <div className="rounded-lg border p-4">
              <p>Medium tabs content - line variant</p>
            </div>
          </TabsContentLine>
          <TabsContentLine value="lg">
            <div className="rounded-lg border p-4">
              <p>Large tabs content - line variant</p>
            </div>
          </TabsContentLine>
        </TabsLine>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different tab sizes in the line variant style.",
      },
    },
  },
}

/**
 * Showcase of tabs with icons to enhance visual recognition.
 */
export const WithIcons: Story = {
  render: () => (
    <div>
      <TabsLine defaultValue="code">
        <TabsListLine>
          <TabsTriggerLine value="code">
            <Code />
            Code
          </TabsTriggerLine>
          <TabsTriggerLine value="terminal">
            <Terminal />
            Terminal
          </TabsTriggerLine>
          <TabsTriggerLine value="settings">
            <Cog />
            Settings
          </TabsTriggerLine>
        </TabsListLine>
        <TabsContentLine value="code">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Code Editor</h3>
            <p className="text-muted-foreground text-sm">
              Write and edit your code here.
            </p>
          </div>
        </TabsContentLine>
        <TabsContentLine value="terminal">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Terminal</h3>
            <p className="text-muted-foreground text-sm">
              Access your command line interface.
            </p>
          </div>
        </TabsContentLine>
        <TabsContentLine value="settings">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Editor Settings</h3>
            <p className="text-muted-foreground text-sm">
              Configure your editor preferences.
            </p>
          </div>
        </TabsContentLine>
      </TabsLine>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Using icons with line-style tabs improves visual recognition while maintaining a clean aesthetic.",
      },
    },
  },
}

/**
 * Showcase of vertical oriented tabs with line style.
 */
export const VerticalTabs: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-2 text-sm font-medium">Line Variant - Vertical</h3>
        <TabsLine
          defaultValue="profile"
          orientation="vertical"
          className="flex max-w-3xl"
        >
          <TabsListLine className="w-36">
            <TabsTriggerLine value="profile">Profile</TabsTriggerLine>
            <TabsTriggerLine value="preferences">Preferences</TabsTriggerLine>
            <TabsTriggerLine value="billing">Billing</TabsTriggerLine>
          </TabsListLine>
          <div className="flex-1">
            <TabsContentLine value="profile">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-muted-foreground text-sm">
                  Manage your personal information.
                </p>
              </div>
            </TabsContentLine>
            <TabsContentLine value="preferences">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Preferences</h3>
                <p className="text-muted-foreground text-sm">
                  Customize your experience.
                </p>
              </div>
            </TabsContentLine>
            <TabsContentLine value="billing">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Billing</h3>
                <p className="text-muted-foreground text-sm">
                  Manage subscription and payments.
                </p>
              </div>
            </TabsContentLine>
          </div>
        </TabsLine>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">
          Responsive (Resize Browser)
        </h3>
        <ResponsiveTabsExample />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Vertical tabs with the line variant style. The vertical line indicator provides a clean, subtle way to show the active tab.
        `,
      },
    },
  },
}

// Simplified helper component for responsive example
function ResponsiveTabsExample() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <TabsLine
      defaultValue="dashboard"
      orientation={isDesktop ? "vertical" : "horizontal"}
      className={isDesktop ? "flex" : ""}
    >
      <TabsListLine className={isDesktop ? "w-32" : "w-full"}>
        <TabsTriggerLine value="dashboard">Dashboard</TabsTriggerLine>
        <TabsTriggerLine value="analytics">Analytics</TabsTriggerLine>
        <TabsTriggerLine value="reports">Reports</TabsTriggerLine>
      </TabsListLine>
      <div className={isDesktop ? "flex-1" : ""}>
        <TabsContentLine value="dashboard">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Dashboard Content</h3>
          </div>
        </TabsContentLine>
        <TabsContentLine value="analytics">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Analytics Content</h3>
          </div>
        </TabsContentLine>
        <TabsContentLine value="reports">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Reports Content</h3>
          </div>
        </TabsContentLine>
      </div>
    </TabsLine>
  )
}
