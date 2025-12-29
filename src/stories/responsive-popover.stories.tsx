import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input/input"
import {
  ResponsivePopover,
  ResponsivePopoverClose,
  ResponsivePopoverContent,
  ResponsivePopoverHeader,
  ResponsivePopoverInner,
  ResponsivePopoverTitle,
  ResponsivePopoverTrigger,
} from "@/components/ui/responsive-popover"

/**
 * ResponsivePopover automatically switches between a Popover (on desktop)
 * and a Drawer (on mobile) for a consistent experience across devices.
 *
 * This pattern is commonly used for select dropdowns, date pickers, and
 * other UI elements that need to be responsive to screen size.
 */
const meta = {
  title: "Overlays/ResponsivePopover",
  component: ResponsivePopover,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/responsive-popover.json
\`\`\`

ResponsivePopover is a compound component that provides a consistent interface
for showing content in either a Popover (desktop) or Drawer (mobile).

## When to use
- Select dropdowns that need to work well on mobile
- Date pickers and other form controls
- Any popover content that should be a full-screen drawer on mobile

## Components
- \`ResponsivePopover\` - Root component that wraps both Popover and Drawer
- \`ResponsivePopoverTrigger\` - Button or element that opens the popover/drawer
- \`ResponsivePopoverContent\` - The content shown inside the popover/drawer
- \`ResponsivePopoverHeader\` - Header section (styled differently on mobile)
- \`ResponsivePopoverTitle\` - Title text
- \`ResponsivePopoverInner\` - Inner content wrapper with responsive padding
- \`ResponsivePopoverClose\` - Close button

## Breakpoint
By default, switches to Drawer when viewport is less than 640px (sm breakpoint).
        `,
      },
    },
  },
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls the controlled open state",
    },
    onOpenChange: {
      description: "Event handler called when open state changes",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResponsivePopover>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Basic example showing the responsive behavior.
 * Resize window to see it switch from Popover to Drawer.
 */
export const Basic: Story = {
  render: () => (
    <ResponsivePopover>
      <ResponsivePopoverTrigger asChild>
        <Button>Open Popover</Button>
      </ResponsivePopoverTrigger>
      <ResponsivePopoverContent className="w-80">
        <ResponsivePopoverHeader>
          <ResponsivePopoverTitle>Settings</ResponsivePopoverTitle>
        </ResponsivePopoverHeader>
        <ResponsivePopoverInner>
          <p className="text-muted-foreground text-sm">
            This content appears in a Popover on desktop and a Drawer on mobile.
          </p>
          <Input
            placeholder="Enter something..."
            formComposition={{ label: "Example Input" }}
          />
          <div className="flex justify-end gap-2">
            <ResponsivePopoverClose asChild>
              <Button variant="outline">Cancel</Button>
            </ResponsivePopoverClose>
            <Button>Save</Button>
          </div>
        </ResponsivePopoverInner>
      </ResponsivePopoverContent>
    </ResponsivePopover>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Basic responsive popover. Resize the viewport below 640px to see it transform into a drawer.",
      },
    },
  },
}

/**
 * Full width popover that matches trigger width.
 */
export const FullWidth: Story = {
  render: () => (
    <ResponsivePopover>
      <ResponsivePopoverTrigger asChild>
        <Button className="w-64">Select Option</Button>
      </ResponsivePopoverTrigger>
      <ResponsivePopoverContent
        className="popover-content-width-full p-0"
        align="start"
      >
        <ResponsivePopoverHeader className="border-b sm:hidden">
          <ResponsivePopoverTitle>Select an option</ResponsivePopoverTitle>
        </ResponsivePopoverHeader>
        <div className="divide-y">
          {["Option 1", "Option 2", "Option 3", "Option 4"].map((option) => (
            <ResponsivePopoverClose key={option} asChild>
              <button className="hover:bg-muted w-full px-4 py-3 text-left transition-colors">
                {option}
              </button>
            </ResponsivePopoverClose>
          ))}
        </div>
      </ResponsivePopoverContent>
    </ResponsivePopover>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Popover that matches the trigger width, commonly used for select-like components.",
      },
    },
  },
}

/**
 * With controlled state for programmatic control.
 */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = React.useState(false)

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-muted-foreground text-sm">
          Popover is {open ? "open" : "closed"}
        </div>
        <ResponsivePopover open={open} onOpenChange={setOpen}>
          <ResponsivePopoverTrigger asChild>
            <Button>Controlled Popover</Button>
          </ResponsivePopoverTrigger>
          <ResponsivePopoverContent className="w-72">
            <ResponsivePopoverHeader>
              <ResponsivePopoverTitle>Controlled State</ResponsivePopoverTitle>
            </ResponsivePopoverHeader>
            <ResponsivePopoverInner>
              <p className="text-muted-foreground text-sm">
                This popover's state is controlled externally.
              </p>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close programmatically
              </Button>
            </ResponsivePopoverInner>
          </ResponsivePopoverContent>
        </ResponsivePopover>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates controlled state management for programmatic open/close.",
      },
    },
  },
}

import React from "react"

/**
 * Form inside a responsive popover.
 */
export const WithForm: Story = {
  render: () => (
    <ResponsivePopover>
      <ResponsivePopoverTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </ResponsivePopoverTrigger>
      <ResponsivePopoverContent className="w-80">
        <ResponsivePopoverHeader>
          <ResponsivePopoverTitle>Edit Profile</ResponsivePopoverTitle>
        </ResponsivePopoverHeader>
        <ResponsivePopoverInner>
          <Input
            formComposition={{ label: "Name" }}
            placeholder="Enter your name"
            defaultValue="John Doe"
          />
          <Input
            formComposition={{ label: "Email" }}
            type="email"
            placeholder="Enter your email"
            defaultValue="john@example.com"
          />
          <div className="flex justify-end gap-2">
            <ResponsivePopoverClose asChild>
              <Button variant="ghost">Cancel</Button>
            </ResponsivePopoverClose>
            <Button>Save Changes</Button>
          </div>
        </ResponsivePopoverInner>
      </ResponsivePopoverContent>
    </ResponsivePopover>
  ),
  parameters: {
    docs: {
      description: {
        story: "A form embedded within the responsive popover.",
      },
    },
  },
}

/**
 * Multiple popovers side by side.
 */
export const MultiplePopovers: Story = {
  render: () => (
    <div className="flex gap-4">
      <ResponsivePopover>
        <ResponsivePopoverTrigger asChild>
          <Button variant="outline">First</Button>
        </ResponsivePopoverTrigger>
        <ResponsivePopoverContent className="w-48">
          <ResponsivePopoverHeader>
            <ResponsivePopoverTitle>First Popover</ResponsivePopoverTitle>
          </ResponsivePopoverHeader>
          <ResponsivePopoverInner>
            Content for the first one.
          </ResponsivePopoverInner>
        </ResponsivePopoverContent>
      </ResponsivePopover>

      <ResponsivePopover>
        <ResponsivePopoverTrigger asChild>
          <Button variant="outline">Second</Button>
        </ResponsivePopoverTrigger>
        <ResponsivePopoverContent className="w-48">
          <ResponsivePopoverHeader>
            <ResponsivePopoverTitle>Second Popover</ResponsivePopoverTitle>
          </ResponsivePopoverHeader>
          <ResponsivePopoverInner>
            Content for the second one.
          </ResponsivePopoverInner>
        </ResponsivePopoverContent>
      </ResponsivePopover>

      <ResponsivePopover>
        <ResponsivePopoverTrigger asChild>
          <Button variant="outline">Third</Button>
        </ResponsivePopoverTrigger>
        <ResponsivePopoverContent className="w-48">
          <ResponsivePopoverHeader>
            <ResponsivePopoverTitle>Third Popover</ResponsivePopoverTitle>
          </ResponsivePopoverHeader>
          <ResponsivePopoverInner>
            Content for the third one.
          </ResponsivePopoverInner>
        </ResponsivePopoverContent>
      </ResponsivePopover>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Multiple responsive popovers can be used together.",
      },
    },
  },
}
