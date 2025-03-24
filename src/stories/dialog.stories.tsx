import type { Meta, StoryObj } from "@storybook/react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogInner,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input/input"
import { FormDemo } from "./forms/FormDemo"

/**
 * Dialog components provide modal interfaces for focused interactions.
 * Use dialogs to capture user attention for important actions, confirmations, or information.
 */
const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Dialog components provide modal interfaces that focus user attention on specific content or actions.
They appear above the page content and block interactions with the rest of the application until dismissed.

## When to use
- To capture user attention for important information
- To request user confirmation before proceeding with an action
- To collect information through focused forms
- To display detailed content without navigating away

## Accessibility
- Manages focus automatically when opened/closed
- Traps focus within the dialog when open
- Supports keyboard navigation and dismissal via Escape key
- Uses ARIA attributes for screen reader compatibility
        `,
      },
    },
  },
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Controls the default open state of the dialog",
    },
    open: {
      control: "boolean",
      description: "Controls the controlled open state of the dialog",
    },
    onOpenChange: {
      description: "Event handler called when open state changes",
    },
    modal: {
      control: "boolean",
      description:
        "Whether interaction outside the dialog is blocked when open",
      table: {
        defaultValue: { summary: "true" },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Basic dialog example with title, description, and actions.
 */
export const Basic: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <DialogInner>
          <div className="grid gap-4">
            <Input
              formComposition={{
                label: "Name",
                labelPosition: "horizontal",
              }}
            />
            <Input
              formComposition={{
                label: "Username",
                labelPosition: "horizontal",
              }}
            />
          </div>
        </DialogInner>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A standard dialog with header, content area, and footer actions.",
      },
    },
  },
}

/**
 * Dialog with scrollable content for displaying larger amounts of information.
 */
export const WithScrollableContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Long Content Dialog</Button>
      </DialogTrigger>
      <DialogContent innerScroll className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read our terms and conditions carefully before continuing.
          </DialogDescription>
        </DialogHeader>
        <DialogInner>
          <div className="space-y-4">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="text-lg font-medium">Section {i + 1}</h3>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quos assumenda numquam delectus culpa quae ipsum quidem
                    tempore necessitatibus iusto ducimus, aspernatur amet
                    consequuntur molestias illo facilis fugiat. Dolorum, enim
                    deserunt!
                  </p>
                </div>
              ))}
          </div>
        </DialogInner>
        <DialogFooter>
          <Button variant="outline">Decline</Button>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Dialog with scrollable content area for displaying larger amounts of information.",
      },
    },
  },
}

/**
 * Dialog with inner scrolling for complex content with fixed header and footer.
 */
export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Complex Form</Button>
      </DialogTrigger>
      <DialogContent innerScroll className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Complex Form</DialogTitle>
          <DialogDescription>
            This dialog uses inner scrolling, keeping the header and footer
            fixed.
          </DialogDescription>
        </DialogHeader>
        <DialogInner>
          <div className="pb-6">
            <FormDemo />
          </div>
        </DialogInner>
        <DialogFooter className="flex-1">
          <Button variant="secondary">Cancel</Button>
          <Button>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: "Dialog with form",
      },
    },
  },
}

/**
 * Alert dialog for confirming destructive actions.
 */
export const AlertDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="!pb-0">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Alert-style dialog for confirming destructive or important actions.",
      },
    },
  },
}

/**
 * Combination of dialog features to demonstrate flexibility.
 */
export const CombinedExample: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Simple Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quick Action</DialogTitle>
            <DialogDescription>Complete this action quickly.</DialogDescription>
          </DialogHeader>
          <DialogInner>
            <p>Some simple content that doesn't require scrolling.</p>
          </DialogInner>
          <DialogFooter>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Complex Dialog</Button>
        </DialogTrigger>
        <DialogContent innerScroll className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detailed Information</DialogTitle>
            <DialogDescription>
              This dialog contains a substantial amount of content.
            </DialogDescription>
          </DialogHeader>
          <DialogInner className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Section 1</h3>
              <p>Content for section 1 with important details.</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Section 2</h3>
              <p>Content for section 2 with some form elements.</p>
              <div className="grid gap-2 pt-2">
                <Input placeholder="Enter value..." />
              </div>
            </div>
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">
                    Additional Section {i + 1}
                  </h3>
                  <p>More content to demonstrate scrolling behavior.</p>
                </div>
              ))}
          </DialogInner>
          <DialogFooter>
            <Button variant="secondary">Cancel</Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Combination of dialog features showing the flexibility of the component.",
      },
    },
  },
}
