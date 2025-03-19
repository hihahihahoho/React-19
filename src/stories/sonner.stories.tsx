import { Button } from "@/components/ui/button"
import { sonnerToast, Toaster } from "@/components/ui/sonner"
import type { Meta, StoryObj } from "@storybook/react"
import { Bell, Clock, Coffee, Heart, MailWarning } from "lucide-react"

/**
 * Sonner toast component for displaying notifications.
 * Use toasts to provide feedback, alerts, or information to users.
 */
const meta = {
  title: "Base/Sonner Toast",
  component: Toaster,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Sonner toast components provide a non-disruptive way to show notifications, alerts, and feedback to users.
They come in various styles, can be positioned in different locations, and support custom content.

## When to use
- To provide feedback after user actions
- To display notifications or alerts
- To show success or error messages
- To indicate background processes

## Accessibility
- Toasts are non-modal and don't interrupt the user's flow
- Important notifications should use appropriate ARIA roles
- Critical information should not rely solely on toasts
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col items-center gap-6 p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic toast variants showing different styles for different contexts.
 */
export const BasicVariants: Story = {
  render: () => {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <Button
          onClick={() => {
            sonnerToast({
              title: "Default notification",
              variant: "default",
            })
          }}
        >
          Default Toast
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            sonnerToast({
              title: "Success! Your changes have been saved",
              variant: "success",
            })
          }}
        >
          Success Toast
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            sonnerToast({
              title: "Warning: Low disk space remaining",
              variant: "warning",
            })
          }}
        >
          Warning Toast
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            sonnerToast({
              title: "Error! Could not complete the operation",
              variant: "destructive",
            })
          }}
        >
          Destructive Toast
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            sonnerToast({
              title: "Loading your content...",
              variant: "loading",
              duration: 5000,
            })
          }}
        >
          Loading Toast
        </Button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "The standard toast variations for different types of notifications.",
      },
    },
  },
}

/**
 * Toast positions demonstration.
 */
export const Positions: Story = {
  render: () => {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <Button
          onClick={() => {
            sonnerToast({
              title: "Top center position",
              position: "top-center",
            })
          }}
        >
          Top Center
        </Button>
        <Button
          onClick={() => {
            sonnerToast({
              title: "Top right position",
              position: "top-right",
            })
          }}
        >
          Top Right
        </Button>
        <Button
          onClick={() => {
            sonnerToast({
              title: "Bottom center position",
              position: "bottom-center",
            })
          }}
        >
          Bottom Center
        </Button>
        <Button
          onClick={() => {
            sonnerToast({
              title: "Bottom left position",
              position: "bottom-left",
            })
          }}
        >
          Bottom Left
        </Button>
      </div>
    )
  },
}

/**
 * Toasts with action buttons that showcase the xs size and auto-dismissal.
 */
export const WithButtons: Story = {
  render: () => {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <Button
          onClick={() => {
            sonnerToast({
              title: "Would you like to undo this action?",
              variant: "default",
              button: {
                label: "Undo",
                onClick: () => console.log("Undo clicked"),
              },
            })
          }}
        >
          With Undo Button
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            sonnerToast({
              title: "Item will be deleted permanently",
              variant: "destructive",
              button: {
                label: "Cancel",
                onClick: () => console.log("Cancel deletion"),
                variant: "outline",
              },
            })
          }}
        >
          With Cancel Button
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            sonnerToast({
              title: "Download complete",
              variant: "success",
              button: {
                label: "View",
                onClick: () => console.log("View download"),
              },
            })
          }}
        >
          Success with Action
        </Button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Toast notifications with compact action buttons (size xs) that automatically dismiss the toast when clicked.",
      },
    },
  },
}

/**
 * Toasts with custom icons.
 */
export const CustomIcons: Story = {
  render: () => {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <Button
          onClick={() => {
            sonnerToast({
              title: "New notification received",
              variant: "default",
              icon: <Bell />,
            })
          }}
        >
          Bell Icon
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            sonnerToast({
              title: "Your coffee is ready!",
              variant: "success",
              icon: <Coffee />,
            })
          }}
        >
          Coffee Icon
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            sonnerToast({
              title: "Don't forget your meeting",
              variant: "warning",
              icon: <Clock />,
            })
          }}
        >
          Alarm Icon
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            sonnerToast({
              title: "Email could not be sent",
              variant: "destructive",
              icon: <MailWarning />,
            })
          }}
        >
          Mail Warning Icon
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            sonnerToast({
              title: "Thanks for your feedback!",
              variant: "success",
              icon: <Heart className="text-pink-500" />,
            })
          }}
        >
          Heart Icon
        </Button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Customize toasts with different icons to enhance visual communication.",
      },
    },
  },
}

/**
 * Toasts with different durations.
 */
export const Durations: Story = {
  render: () => {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <Button
          onClick={() => {
            sonnerToast({
              title: "Quick toast - 1.5 seconds",
              duration: 1500,
            })
          }}
        >
          Quick (1.5s)
        </Button>
        <Button
          onClick={() => {
            sonnerToast({
              title: "Normal toast - 4 seconds",
              duration: 4000,
            })
          }}
        >
          Normal (4s)
        </Button>
        <Button
          onClick={() => {
            sonnerToast({
              title: "Long toast - 8 seconds",
              duration: 8000,
            })
          }}
        >
          Long (8s)
        </Button>
        <Button
          onClick={() => {
            sonnerToast({
              title: "Persistent toast - Click to dismiss",
              duration: Infinity,
            })
          }}
        >
          Persistent
        </Button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Control how long toasts remain visible before automatically dismissing.",
      },
    },
  },
}

/**
 * Combined examples with buttons and icons.
 */
export const CombinedFeatures: Story = {
  render: () => {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <Button
          onClick={() => {
            sonnerToast({
              title: "File uploaded successfully",
              variant: "success",
              icon: <Coffee />,
              button: {
                label: "View",
                variant: "outline",
                onClick: () => console.log("View file"),
              },
            })
          }}
        >
          Icon + Button
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            sonnerToast({
              title: "Connection lost",
              variant: "destructive",
              icon: <MailWarning />,
              button: {
                label: "Retry",
                onClick: () => console.log("Retry connection"),
              },
              duration: 8000,
            })
          }}
        >
          Complete Example
        </Button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Combine different features like custom icons, buttons, and durations for rich notifications.",
      },
    },
  },
}
