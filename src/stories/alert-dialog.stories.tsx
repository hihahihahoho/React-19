import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog/alert-dialog"
import { Button } from "@/components/ui/button"
import { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"

import { GlassIcon } from "@/components/ui/glass-icon"
import { Input } from "@/components/ui/input/input"
import { useAlertDialog } from "@/hooks/use-alert-dialog"
import { AlertCircle, Check, Info, Save, Trash, X } from "lucide-react"

/**
 * Alert Dialog component provides a modal dialog for important interactions
 * requiring user confirmation or acknowledgment.
 */
const meta = {
  title: "Overlays/Alert Dialog",
  component: AlertDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/alert-dialog.json
\`\`\`

Alert Dialog component presents critical information and requires user confirmation or acknowledgment
before proceeding with an action. Unlike regular dialogs, they're designed for cases where user
attention is essential.

## When to use
- For destructive actions (delete, remove, etc.)
- For important confirmations requiring user decision
- When users need to acknowledge important information
- For security-sensitive actions

## Accessibility
- Uses role="alertdialog" for proper screen reader announcement
- Manages focus appropriately with focus trapping
- Provides keyboard navigation and escape key support
- Clear action buttons with appropriate labeling
        `,
      },
    },
  },
  argTypes: {
    // These are the common props for the AlertDialogDemo
    open: {
      control: "boolean",
      description: "Controls whether the dialog is open",
    },
    onOpenChange: {
      description: "Event handler called when the open state changes",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The basic implementation of an Alert Dialog with a trigger,
 * confirmation message, and action buttons.
 */
export const Basic: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Open Alert Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A standard alert dialog with a trigger button, title, description, and action buttons.",
      },
    },
  },
}

/**
 * Alert dialogs for various confirmation types.
 */
export const ConfirmationVariants: Story = {
  render: () => {
    const DeleteConfirm = () => (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <Trash />
            Delete Item
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <GlassIcon color="red">
              <AlertCircle />
            </GlassIcon>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected item and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )

    const SaveConfirm = () => (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>
            <Save />
            Save Changes
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <GlassIcon color="green">
              <Check />
            </GlassIcon>
            <AlertDialogTitle>Save your changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Your changes will be saved and can be edited later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )

    const InfoAlert = () => (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">
            <Info />
            Information
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <GlassIcon color="blue">
              <Info />
            </GlassIcon>
            <AlertDialogTitle>Important Information</AlertDialogTitle>
            <AlertDialogDescription>
              This is an informational alert that requires acknowledgment.
              Please read carefully before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>I understand</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )

    return (
      <div className="flex flex-wrap gap-4">
        <DeleteConfirm />
        <SaveConfirm />
        <InfoAlert />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Different types of alert dialogs for various confirmation scenarios.",
      },
    },
  },
}

/**
 * Alert dialogs with different footer layouts.
 */
export const FooterVariants: Story = {
  render: () => {
    const HorizontalFooter = () => (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Horizontal Footer</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              This alert uses a horizontal footer layout with buttons side by
              side.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )

    const VerticalFooter = () => {
      // Custom implementation using the footerOrientation prop from AlertDialogFooter
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Vertical Footer</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Action</AlertDialogTitle>
              <AlertDialogDescription>
                This alert uses a vertical footer layout with stacked buttons.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter footerOrientation="vertical">
              <AlertDialogAction>Continue</AlertDialogAction>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    }

    return (
      <div className="flex flex-wrap gap-4">
        <HorizontalFooter />
        <VerticalFooter />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Alert dialogs with different footer layouts - horizontal and vertical.",
      },
    },
  },
}

/**
 * Alert dialog with form content for collecting input.
 */
export const WithFormContent: Story = {
  render: () => {
    // We need to use useState to manage form state
    function FormAlertDemo() {
      const [name, setName] = useState("")

      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>Edit Profile</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Profile</AlertDialogTitle>
              <AlertDialogDescription>
                Make changes to your profile here. Click save when you're done.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  formComposition={{
                    label: "Name",
                  }}
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={!name}>
                Save Changes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    }

    return <FormAlertDemo />
  },
  parameters: {
    docs: {
      description: {
        story:
          "Alert dialog with form inputs for collecting user information before proceeding.",
      },
    },
  },
}

/**
 * Example of using the alert dialog container with the useAlertDialog hook for dynamic alerts.
 */
export const DynamicAlerts: Story = {
  render: () => {
    function DynamicAlertDemo() {
      // Use the alert dialog hook
      const { showAlertDialog } = useAlertDialog()

      const showSuccessAlert = () => {
        showAlertDialog({
          title: "Operation Successful",
          description: "Your changes have been saved successfully.",
          status: "success",
          showCancel: false,
          action: (
            <AlertDialogAction onClick={() => console.log("Acknowledged")}>
              OK
            </AlertDialogAction>
          ),
        })
      }

      const showDeleteAlert = () => {
        showAlertDialog({
          title: "Confirm Deletion",
          description:
            "Are you sure you want to delete this item? This action cannot be undone.",
          status: "destructive",
          showCancel: true,
          cancelContent: "Cancel",
          action: (
            <AlertDialogAction
              onClick={() => console.log("Delete confirmed")}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          ),
        })
      }

      const showInfoAlert = () => {
        showAlertDialog({
          title: "Information",
          description: "This is important information you should be aware of.",
          status: "default",
          showCancel: true,
          cancelContent: "Close",
          action: (
            <AlertDialogAction onClick={() => console.log("Understood")}>
              I understand
            </AlertDialogAction>
          ),
        })
      }

      const showWarningAlert = () => {
        showAlertDialog({
          title: "Warning",
          description: "This action might have unintended consequences.",
          status: "warning",
          showCancel: true,
          cancelContent: "Cancel",
          action: (
            <AlertDialogAction onClick={() => console.log("Proceed anyway")}>
              Proceed anyway
            </AlertDialogAction>
          ),
        })
      }

      return (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            <Button onClick={showSuccessAlert}>
              <Check />
              Show Success Alert
            </Button>
            <Button variant="destructive" onClick={showDeleteAlert}>
              <Trash />
              Show Delete Alert
            </Button>
            <Button variant="outline" onClick={showInfoAlert}>
              <Info />
              Show Info Alert
            </Button>
            <Button variant="outline" onClick={showWarningAlert}>
              <AlertCircle />
              Show Warning Alert
            </Button>
          </div>
        </div>
      )
    }

    return <DynamicAlertDemo />
  },
  parameters: {
    docs: {
      description: {
        story:
          "Using the AlertDialogContainer with the useAlertDialog hook for dynamically creating and managing alerts. Shows all available status types: default, success, warning, and destructive.",
      },
    },
  },
}

/**
 * Example with complex content and custom styling.
 */
export const CustomizedAlertDialog: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Open Custom Alert</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <div className="absolute top-4 right-4">
          <AlertDialogCancel className="h-auto rounded-full p-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </AlertDialogCancel>
        </div>
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <AlertDialogTitle className="text-center">
            Service Maintenance
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Our system will be undergoing scheduled maintenance on
            <strong className="font-semibold">
              {" "}
              March 30, 2025 from 2:00 AM to 4:00 AM UTC
            </strong>
            . During this period, services may be temporarily unavailable.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="bg-muted/50 mt-4 rounded-md p-4">
          <h4 className="mb-2 text-sm font-medium">What to expect:</h4>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Temporary service disruption</li>
            <li>Login services will be affected</li>
            <li>Automated processes will resume after maintenance</li>
          </ul>
        </div>
        <AlertDialogFooter className="mt-4">
          <AlertDialogAction>I understand</AlertDialogAction>
          <Button variant="link" className="text-sm">
            Add to calendar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A highly customized alert dialog with additional content formatting and styling.",
      },
    },
  },
}

/**
 * Demonstrates the overlayCloseable property that allows closing the dialog by clicking the overlay.
 */
export const OverlayCloseableVariants: Story = {
  render: () => {
    const DefaultBehavior = () => (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Default Behavior</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dialog with Default Overlay</AlertDialogTitle>
            <AlertDialogDescription>
              Clicking on the overlay (dark background) will not close this
              dialog. You must use the action buttons below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )

    const CloseableOverlay = () => (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Closeable Overlay</Button>
        </AlertDialogTrigger>
        <AlertDialogContent overlayCloseable={true}>
          <AlertDialogHeader>
            <AlertDialogTitle>Dialog with Closeable Overlay</AlertDialogTitle>
            <AlertDialogDescription>
              Clicking on the overlay (dark background) will close this dialog.
              This provides an additional way for users to dismiss the dialog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )

    return (
      <div className="flex flex-wrap gap-4">
        <DefaultBehavior />
        <CloseableOverlay />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
The \`overlayCloseable\` property determines whether clicking the dark overlay background closes the dialog:

- When \`false\` (default): Clicking the overlay does nothing, forcing users to make a clear choice using the buttons
- When \`true\`: Clicking the overlay acts as a cancel action and closes the dialog

**Usage considerations:**
- Use \`overlayCloseable={true}\` for less critical dialogs where quick dismissal is beneficial
- Keep the default (\`overlayCloseable={false}\`) for important confirmations where an explicit choice is required
`,
      },
    },
  },
}
