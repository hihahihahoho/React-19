/* eslint-disable react-hooks/rules-of-hooks */
import { Badge } from "@/components/ui/badge/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { Meta, StoryObj } from "@storybook/react"
import {
  Code,
  Cog,
  FileText,
  Home,
  Image,
  MessageSquare,
  Music,
  Settings,
  Terminal,
  User,
  Video,
} from "lucide-react"
import React from "react"

/**
 * Tabs organize content into multiple sections and allow users to navigate between them.
 * Use tabs to separate different categories of content that occupy the same space.
 */
const meta = {
  title: "Controls/Tabs",
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/tabs.json
\`\`\`

Tabs allow users to navigate between related sections of content, displaying one section at a time.
They organize content into separate views where only one view is visible at a time.

## When to use
- When you need to organize content into logical sections
- When different sections of content share the same space
- When users need to switch between related views
- When the content is independent but related

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
    variant: {
      control: "select",
      options: ["default", "line"],
      description: "Controls the visual style of the tabs",
      table: {
        defaultValue: { summary: "default" },
      },
    },
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
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The standard tabs with different styles: default and line variants.
 */
export const BasicVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-2 text-sm font-medium">Default Variant</h3>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Account Settings</h3>
              <p className="text-sm text-muted-foreground">
                Manage your account settings and preferences.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="password">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Password</h3>
              <p className="text-sm text-muted-foreground">
                Change your password here. After saving, you'll be logged out.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure your application settings.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Line Variant</h3>
        <Tabs defaultValue="overview" variant="line">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Overview</h3>
              <p className="text-sm text-muted-foreground">
                View a summary of your account activity.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="analytics">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Analytics</h3>
              <p className="text-sm text-muted-foreground">
                View detailed analytics for your account.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="reports">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Reports</h3>
              <p className="text-sm text-muted-foreground">
                Download and view reports.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="notifications">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Manage your notification preferences.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The two primary tab variants: default (with background) and line (with underline indicator).",
      },
    },
  },
}

/**
 * Example of tabs with different sizes in both variants.
 */
export const SizesAndVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-2 text-sm font-medium">Default Variant</h3>
        <div className="grid gap-6">
          <Tabs defaultValue="sm" size="sm">
            <TabsList>
              <TabsTrigger value="sm">Small</TabsTrigger>
              <TabsTrigger value="md">Medium</TabsTrigger>
              <TabsTrigger value="lg">Large</TabsTrigger>
            </TabsList>
            <TabsContent value="sm">
              <div className="rounded-lg border p-3">
                <p className="text-xs">Small tabs content - default variant</p>
              </div>
            </TabsContent>
            <TabsContent value="md">
              <div className="rounded-lg border p-3">
                <p className="text-xs">Medium tabs content - default variant</p>
              </div>
            </TabsContent>
            <TabsContent value="lg">
              <div className="rounded-lg border p-3">
                <p className="text-xs">Large tabs content - default variant</p>
              </div>
            </TabsContent>
          </Tabs>

          <Tabs defaultValue="sm">
            <TabsList>
              <TabsTrigger value="sm">Small</TabsTrigger>
              <TabsTrigger value="md">Medium</TabsTrigger>
              <TabsTrigger value="lg">Large</TabsTrigger>
            </TabsList>
            <TabsContent value="sm">
              <div className="rounded-lg border p-4">
                <p className="text-sm">Small tabs content - default variant</p>
              </div>
            </TabsContent>
            <TabsContent value="md">
              <div className="rounded-lg border p-4">
                <p className="text-sm">Medium tabs content - default variant</p>
              </div>
            </TabsContent>
            <TabsContent value="lg">
              <div className="rounded-lg border p-4">
                <p className="text-sm">Large tabs content - default variant</p>
              </div>
            </TabsContent>
          </Tabs>

          <Tabs defaultValue="sm" size="lg">
            <TabsList>
              <TabsTrigger value="sm">Small</TabsTrigger>
              <TabsTrigger value="md">Medium</TabsTrigger>
              <TabsTrigger value="lg">Large</TabsTrigger>
            </TabsList>
            <TabsContent value="sm">
              <div className="rounded-lg border p-4">
                <p>Small tabs content - default variant</p>
              </div>
            </TabsContent>
            <TabsContent value="md">
              <div className="rounded-lg border p-4">
                <p>Medium tabs content - default variant</p>
              </div>
            </TabsContent>
            <TabsContent value="lg">
              <div className="rounded-lg border p-4">
                <p>Large tabs content - default variant</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Line Variant</h3>
        <div className="grid gap-6">
          <Tabs defaultValue="sm" variant="line" size="sm">
            <TabsList>
              <TabsTrigger value="sm">Small</TabsTrigger>
              <TabsTrigger value="md">Medium</TabsTrigger>
              <TabsTrigger value="lg">Large</TabsTrigger>
            </TabsList>
            <TabsContent value="sm">
              <div className="rounded-lg border p-3">
                <p className="text-xs">Small tabs content - line variant</p>
              </div>
            </TabsContent>
            <TabsContent value="md">
              <div className="rounded-lg border p-3">
                <p className="text-xs">Medium tabs content - line variant</p>
              </div>
            </TabsContent>
            <TabsContent value="lg">
              <div className="rounded-lg border p-3">
                <p className="text-xs">Large tabs content - line variant</p>
              </div>
            </TabsContent>
          </Tabs>

          <Tabs defaultValue="sm" variant="line">
            <TabsList>
              <TabsTrigger value="sm">Small</TabsTrigger>
              <TabsTrigger value="md">Medium</TabsTrigger>
              <TabsTrigger value="lg">Large</TabsTrigger>
            </TabsList>
            <TabsContent value="sm">
              <div className="rounded-lg border p-4">
                <p className="text-sm">Small tabs content - line variant</p>
              </div>
            </TabsContent>
            <TabsContent value="md">
              <div className="rounded-lg border p-4">
                <p className="text-sm">Medium tabs content - line variant</p>
              </div>
            </TabsContent>
            <TabsContent value="lg">
              <div className="rounded-lg border p-4">
                <p className="text-sm">Large tabs content - line variant</p>
              </div>
            </TabsContent>
          </Tabs>

          <Tabs defaultValue="sm" variant="line" size="lg">
            <TabsList>
              <TabsTrigger value="sm">Small</TabsTrigger>
              <TabsTrigger value="md">Medium</TabsTrigger>
              <TabsTrigger value="lg">Large</TabsTrigger>
            </TabsList>
            <TabsContent value="sm">
              <div className="rounded-lg border p-4">
                <p>Small tabs content - line variant</p>
              </div>
            </TabsContent>
            <TabsContent value="md">
              <div className="rounded-lg border p-4">
                <p>Medium tabs content - line variant</p>
              </div>
            </TabsContent>
            <TabsContent value="lg">
              <div className="rounded-lg border p-4">
                <p>Large tabs content - line variant</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Comparison of different tab sizes with both default and line variants.",
      },
    },
  },
}
/**
 * Showcase of tabs with icons to enhance visual recognition.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Tabs defaultValue="home">
        <TabsList>
          <TabsTrigger value="home">
            <Home />
            Home
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare />
            Messages
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings />
            Settings
          </TabsTrigger>
          <TabsTrigger value="user">
            <User />
            Profile
          </TabsTrigger>
        </TabsList>
        <TabsContent value="home">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Home</h3>
            <p className="text-sm text-muted-foreground">
              Welcome to your dashboard. Here's an overview of your activity.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="messages">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Messages</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your conversations.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure your application preferences.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="user">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Profile</h3>
            <p className="text-sm text-muted-foreground">
              Manage your profile information and preferences.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <Tabs defaultValue="code" variant="line">
        <TabsList>
          <TabsTrigger value="code">
            <Code />
            Code
          </TabsTrigger>
          <TabsTrigger value="terminal">
            <Terminal />
            Terminal
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Cog />
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="code">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Code Editor</h3>
            <p className="text-sm text-muted-foreground">
              Write and edit your code here.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="terminal">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Terminal</h3>
            <p className="text-sm text-muted-foreground">
              Access your command line interface.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Editor Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure your editor preferences.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Using icons with tabs improves visual recognition and provides additional context.",
      },
    },
  },
}

/**
 * Example of scrollable tabs when there are many items.
 */
export const ScrollableTabs: Story = {
  render: () => (
    <div>
      <Tabs defaultValue="tab1">
        <TabsList className="w-full max-w-full">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          <TabsTrigger value="tab4">Tab 4</TabsTrigger>
          <TabsTrigger value="tab5">Tab 5</TabsTrigger>
          <TabsTrigger value="tab6">Tab 6</TabsTrigger>
          <TabsTrigger value="tab7">Tab 7</TabsTrigger>
          <TabsTrigger value="tab8">Tab 8</TabsTrigger>
          <TabsTrigger value="tab9">Tab 9</TabsTrigger>
          <TabsTrigger value="tab10">Tab 10</TabsTrigger>
          <TabsTrigger value="tab11">Tab 11</TabsTrigger>
          <TabsTrigger value="tab12">Tab 12</TabsTrigger>
          <TabsTrigger value="tab13">Tab 13</TabsTrigger>
          <TabsTrigger value="tab14">Tab 14</TabsTrigger>
        </TabsList>
        {Array.from({ length: 14 }).map((_, i) => (
          <TabsContent key={i} value={`tab${i + 1}`}>
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Tab {i + 1} Content</h3>
              <p className="text-sm text-muted-foreground">
                This is the content for tab {i + 1}.
              </p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Tabs automatically become scrollable when there are too many to fit in the available space. Users can use mouse wheel or touch gestures to scroll.",
      },
    },
  },
}

// ...existing code...

/**
 * Showcase of vertical oriented tabs.
 */
export const VerticalTabs: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Default variant vertical tabs */}
      <div>
        <h3 className="mb-2 text-sm font-medium">Default Variant</h3>
        <Tabs
          defaultValue="general"
          orientation="vertical"
          className="flex max-w-3xl"
        >
          <TabsList className="w-40">
            <TabsTrigger value="general">
              <Cog />
              General
            </TabsTrigger>
            <TabsTrigger value="account">
              <User />
              Account
            </TabsTrigger>
            <TabsTrigger value="security">
              <Settings />
              Security
            </TabsTrigger>
          </TabsList>
          <div className="flex-1">
            <TabsContent value="general">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">General Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure general application settings.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="account">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Account Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your account information.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="security">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Security Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your security preferences.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Line variant vertical tabs */}
      <div>
        <h3 className="mb-2 text-sm font-medium">Line Variant</h3>
        <Tabs
          defaultValue="profile"
          orientation="vertical"
          variant="line"
          className="flex max-w-3xl"
        >
          <TabsList className="w-36">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <div className="flex-1">
            <TabsContent value="profile">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your personal information.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="preferences">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your experience.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="billing">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Billing</h3>
                <p className="text-sm text-muted-foreground">
                  Manage subscription and payments.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Scrollable vertical tabs */}
      <div>
        <h3 className="mb-2 text-sm font-medium">Scrollable Tabs</h3>
        <Tabs
          defaultValue="tab1"
          orientation="vertical"
          className="flex max-w-3xl"
        >
          <TabsList className="h-40 w-36 overflow-auto">
            {[...Array(12)].map((_, i) => (
              <TabsTrigger key={i} value={`tab${i + 1}`}>
                Tab {i + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex-1">
            {[...Array(12)].map((_, i) => (
              <TabsContent key={i} value={`tab${i + 1}`}>
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">Content {i + 1}</h3>
                  <p className="text-sm text-muted-foreground">
                    This is the content for tab {i + 1}.
                  </p>
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>

      {/* Responsive example */}
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
Vertical tabs with support for scrolling when content overflows. The tabs adjust to the available vertical space and scroll independently of the content.
        `,
      },
    },
  },
}

// Simplified helper component for responsive example
function ResponsiveTabsExample() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <Tabs
      defaultValue="dashboard"
      orientation={isDesktop ? "vertical" : "horizontal"}
      className={isDesktop ? "flex" : ""}
    >
      <TabsList className={isDesktop ? "w-32" : "w-full"}>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <div className={isDesktop ? "flex-1" : ""}>
        <TabsContent value="dashboard">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Dashboard Content</h3>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Analytics Content</h3>
          </div>
        </TabsContent>
        <TabsContent value="reports">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Reports Content</h3>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )
}

/**
 * Examples of various tab customizations for different design needs.
 */
export const Customization: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      {/* Centered Tabs */}
      <div>
        <h3 className="mb-2 text-sm font-medium">Centered Tabs</h3>
        <Tabs defaultValue="overview">
          <TabsList className="w-full justify-center">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="text-center">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Overview Content</h3>
              <p className="text-sm text-muted-foreground">
                Centered tabs work well for main page sections.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="text-center">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Analytics Content</h3>
              <p className="text-sm text-muted-foreground">
                View your data analytics here.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="reports" className="text-center">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Reports Content</h3>
              <p className="text-sm text-muted-foreground">
                Access and download your reports.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Icon-only Tabs with Custom Sizing */}
      <div>
        <h3 className="mb-2 text-sm font-medium">Compact Icon-only Tabs</h3>
        <Tabs defaultValue="image">
          <TabsList className="w-fit gap-1 p-1">
            <TabsTrigger value="image" className="h-8 w-8 p-0">
              <Image className="size-4" />
              <span className="sr-only">Images</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="h-8 w-8 p-0">
              <Video className="size-4" />
              <span className="sr-only">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="music" className="h-8 w-8 p-0">
              <Music className="size-4" />
              <span className="sr-only">Music</span>
            </TabsTrigger>
            <TabsTrigger value="document" className="h-8 w-8 p-0">
              <FileText className="size-4" />
              <span className="sr-only">Documents</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="image">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Images</h3>
              <p className="text-sm text-muted-foreground">
                Custom-sized icon tabs provide a compact interface.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="video">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Videos</h3>
              <p className="text-sm text-muted-foreground">
                View and manage your video files.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="music">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Music</h3>
              <p className="text-sm text-muted-foreground">
                Access your music collection.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="document">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Documents</h3>
              <p className="text-sm text-muted-foreground">
                Manage your document files.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Tabs with Badges */}
      <div>
        <h3 className="mb-2 text-sm font-medium">Tabs with Badges</h3>
        <Tabs defaultValue="inbox">
          <TabsList>
            <TabsTrigger value="inbox" className="flex gap-2">
              <span>Inbox</span>
              <Badge
                size="xs"
                variant="red"
                className="size-4 rounded-full px-1"
              >
                3
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex gap-2">
              <span>Sent</span>
              <Badge
                size="xs"
                variant="blue"
                className="size-4 rounded-full px-1"
              >
                12
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="drafts" className="flex gap-2">
              <span>Drafts</span>
              <Badge
                size="xs"
                variant="secondary"
                className="size-4 rounded-full px-1"
              >
                5
              </Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inbox">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Inbox (3)</h3>
              <p className="text-sm text-muted-foreground">
                You have 3 unread messages.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="sent">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Sent (12)</h3>
              <p className="text-sm text-muted-foreground">
                You sent 12 messages this week.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="drafts">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Drafts (5)</h3>
              <p className="text-sm text-muted-foreground">
                You have 5 draft messages.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Full-width Justified Tabs */}
      <div>
        <h3 className="mb-2 text-sm font-medium">Full-width Justified Tabs</h3>
        <Tabs defaultValue="tab1">
          <TabsList className="w-full">
            <TabsTrigger value="tab1" className="flex-1">
              First Tab
            </TabsTrigger>
            <TabsTrigger value="tab2" className="flex-1">
              Second Tab
            </TabsTrigger>
            <TabsTrigger value="tab3" className="flex-1">
              Third Tab
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">First Tab Content</h3>
              <p className="text-sm text-muted-foreground">
                Full-width tabs distribute space evenly.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Second Tab Content</h3>
              <p className="text-sm text-muted-foreground">
                Each tab takes up an equal portion of space.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="tab3">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Third Tab Content</h3>
              <p className="text-sm text-muted-foreground">
                Good for a small number of equally important tabs.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Custom Styled Tabs */}
      <div>
        <h3 className="mb-2 text-sm font-medium">Custom Styled Tabs</h3>
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-transparent p-0">
            <TabsTrigger
              value="home"
              className="rounded-b-none rounded-t-lg border border-b-0 border-muted bg-muted/50 data-[state=active]:border-border data-[state=active]:bg-background"
            >
              <Home />
              Home
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className="rounded-b-none rounded-t-lg border border-b-0 border-muted bg-muted/50 data-[state=active]:border-border data-[state=active]:bg-background"
            >
              <MessageSquare />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="rounded-b-none rounded-t-lg border border-b-0 border-muted bg-muted/50 data-[state=active]:border-border data-[state=active]:bg-background"
            >
              <Settings />
              Settings
            </TabsTrigger>
          </TabsList>
          <div className="rounded-b-lg border border-t-0 p-4">
            <TabsContent value="home">
              <h3 className="text-lg font-medium">Home</h3>
              <p className="text-sm text-muted-foreground">
                Custom tabs with unique styling that resemble browser tabs.
              </p>
            </TabsContent>
            <TabsContent value="dashboard">
              <h3 className="text-lg font-medium">Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                View your dashboard statistics and information.
              </p>
            </TabsContent>
            <TabsContent value="settings">
              <h3 className="text-lg font-medium">Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure your application settings.
              </p>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Various ways to customize the tabs component:

- **Centered Tabs**: Perfect for main page navigation with equal emphasis on options
- **Icon-only Tabs**: Great for compact interfaces with limited space
- **Tabs with Badges**: Useful for showing counts or status indicators
- **Full-width Justified Tabs**: Evenly distribute tabs across available space
- **Vertical Tabs**: Ideal for settings pages or when you have many tab options
- **Custom Styled Tabs**: Create unique tab designs to match your application's style

These customizations can be combined to create the perfect tab interface for your specific use case. Remember to maintain accessibility by using proper ARIA attributes and ensuring good keyboard navigation.
        `,
      },
    },
  },
}

/**
 * Example of programmatically controlling tabs.
 */
export const ControlledTabs: Story = {
  render: () => {
    const [activeTab, setActiveTab] = React.useState("first")

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <button
            className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground"
            onClick={() => setActiveTab("first")}
          >
            Activate First Tab
          </button>
          <button
            className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground"
            onClick={() => setActiveTab("second")}
          >
            Activate Second Tab
          </button>
          <button
            className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground"
            onClick={() => setActiveTab("third")}
          >
            Activate Third Tab
          </button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="first">First Tab</TabsTrigger>
            <TabsTrigger value="second">Second Tab</TabsTrigger>
            <TabsTrigger value="third">Third Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="first">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">First Tab Content</h3>
              <p className="text-sm text-muted-foreground">
                This is the content of the first tab.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="second">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Second Tab Content</h3>
              <p className="text-sm text-muted-foreground">
                This is the content of the second tab.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="third">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Third Tab Content</h3>
              <p className="text-sm text-muted-foreground">
                This is the content of the third tab.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="rounded-md bg-muted p-2 text-xs">
          <p>
            Current active tab: <strong>{activeTab}</strong>
          </p>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tabs can be controlled programmatically by setting the value prop and providing an onValueChange handler. This is useful for wizard-like interfaces or when tab changes should be triggered by external events.",
      },
    },
  },
}
