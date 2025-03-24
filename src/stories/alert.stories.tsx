/* eslint-disable react-hooks/rules-of-hooks */
import { Alert } from "@/components/ui/alert"
import type { Meta, StoryObj } from "@storybook/react"
import React from "react"

/**
 * Alert component provides feedback messages for user actions or system status.
 * Use alerts to display important information, notifications, or warnings.
 */
const meta = {
  title: "BASE/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Alert components are used to display important information, such as status notifications, 
warnings, errors, or success messages. They draw attention to important events or changes.

## When to use
- To notify users about important changes or events
- To provide feedback about user actions (success, error, warning, etc.)
- To present critical information that requires attention
- To guide users through key processes or information

## Accessibility
- Alerts use the appropriate ARIA role="alert"
- Color is not used as the only means of conveying information
- Each alert variant has distinct visual cues besides color
- Screen readers can identify and announce alert content
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "destructive"],
      description:
        "Controls the visual style and semantic meaning of the alert",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    title: {
      control: "text",
      description: "The title text displayed at the top of the alert",
    },
    description: {
      control: "text",
      description: "The main content text of the alert",
    },
    children: {
      description:
        "The content displayed inside the alert (alternative to description)",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the alert",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center md:w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The standard alert variations with different styles and semantic meanings.
 */
export const BasicVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert
        variant="default"
        title="Information"
        description="This is an informational message for your attention."
      />
      <Alert
        variant="success"
        title="Success"
        description="Your action was completed successfully!"
      />
      <Alert
        variant="warning"
        title="Warning"
        description="Proceed with caution. This action may have consequences."
      />
      <Alert
        variant="destructive"
        title="Error"
        description="An error occurred. Please try again later."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The four standard alert variations that provide different levels of emphasis and semantic meaning.",
      },
    },
  },
}

/**
 * Alerts with titles only, useful for simple notifications.
 */
export const TitleOnly: Story = {
  render: () => (
    <div className="w-full space-y-4">
      <Alert variant="default" title="Information alert" />
      <Alert variant="success" title="Success alert" />
      <Alert variant="warning" title="Warning alert" />
      <Alert variant="destructive" title="Error alert" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Alerts with only titles are useful for simple, concise notifications.",
      },
    },
  },
}

/**
 * Alerts with descriptions only, without titles.
 */
export const DescriptionOnly: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert
        variant="default"
        description="This is an informational message without a title."
      />
      <Alert
        variant="success"
        description="Action completed successfully without a title."
      />
      <Alert
        variant="warning"
        description="Warning message without a title for simpler presentation."
      />
      <Alert
        variant="destructive"
        description="Error occurred. This message has no title for brevity."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Alerts with only descriptions are useful when a title would be redundant or when space is limited.",
      },
    },
  },
}

/**
 * Alerts with both titles and rich content using children.
 */
export const WithRichContent: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert variant="default" title="System Update">
        <div className="space-y-2">
          <p>A new system update is available with the following changes:</p>
          <ul className="list-disc pl-6">
            <li>Improved performance</li>
            <li>Bug fixes</li>
            <li>New features</li>
          </ul>
        </div>
      </Alert>
      <Alert variant="success" title="Payment Successful">
        <div className="space-y-2">
          <p>
            Your payment of <strong>$24.99</strong> has been processed.
          </p>
          <p>
            Transaction ID: <code>TXN-12345-ABCDE</code>
          </p>
        </div>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Alerts can contain rich content like lists, strong text, code blocks, and custom elements.",
      },
    },
  },
}

// ...existing code...

/**
 * Alerts with custom styling through className and classNames props.
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4 [&>*]:flex-1">
      <Alert
        variant="default"
        title="Custom Root Styling"
        description="This alert has custom padding and background applied via className."
        className="bg-slate-50 p-6"
      />
      <Alert
        variant="success"
        title="Custom Icon and Title"
        description="This alert has custom styling for both the icon and title."
        classNames={{
          icon: "rounded-full bg-emerald-100 p-1",
          title: "text-lg font-bold text-emerald-700",
        }}
      />
      <Alert
        variant="warning"
        title="Custom Description"
        description="This alert has custom description styling with italic text."
        classNames={{
          description: "font-medium italic text-amber-700",
        }}
      />
      <Alert
        variant="destructive"
        title="Custom Appearance"
        description="This alert has a custom border and shadow via className, and custom dismiss button via classNames."
        dismissible
        className="border-2 border-dashed shadow-lg"
        classNames={{
          dismissButton: "bg-rose-100 hover:bg-rose-200",
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Alerts can be customized with the className prop for the root element and classNames object prop to target specific parts like icon, title, description and dismissButton.",
      },
    },
  },
}

// ...existing code...

/**
 * Interactive alert example showing how to implement dismissible alerts.
 */
export const DismissibleAlerts: Story = {
  render: () => {
    // Using React hooks for dismissible functionality
    const [isInfoVisible, setIsInfoVisible] = React.useState(true)
    const [isSuccessVisible, setIsSuccessVisible] = React.useState(true)
    const [isWarningVisible, setIsWarningVisible] = React.useState(true)
    const [isErrorVisible, setIsErrorVisible] = React.useState(true)

    return (
      <div className="flex w-full flex-col gap-4 [&>*]:flex-1">
        {isInfoVisible && (
          <Alert
            variant="default"
            title="Information"
            description="This is a dismissible information alert."
            dismissible
            onDismiss={() => setIsInfoVisible(false)}
          />
        )}

        {isSuccessVisible && (
          <Alert
            variant="success"
            title="Success"
            description="This is a dismissible success alert."
            dismissible
            onDismiss={() => setIsSuccessVisible(false)}
          />
        )}

        {isWarningVisible && (
          <Alert
            variant="warning"
            title="Warning"
            description="This is a dismissible warning alert."
            dismissible
            onDismiss={() => setIsWarningVisible(false)}
          />
        )}

        {isErrorVisible && (
          <Alert
            variant="destructive"
            title="Error"
            description="This is a dismissible error alert."
            dismissible
            onDismiss={() => setIsErrorVisible(false)}
          />
        )}

        {!isInfoVisible &&
          !isSuccessVisible &&
          !isWarningVisible &&
          !isErrorVisible && (
            <button
              onClick={() => {
                setIsInfoVisible(true)
                setIsSuccessVisible(true)
                setIsWarningVisible(true)
                setIsErrorVisible(true)
              }}
              className="bg-background-semantic-information-primary rounded-md px-4 py-2 text-white"
            >
              Reset Alerts
            </button>
          )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example of dismissible alerts using the built-in dismiss functionality. Set the dismissible prop to true and provide an onDismiss callback to handle dismissal logic in your application.",
      },
    },
  },
}
/**
 * Use cases for alerts in different contexts.
 */
export const CommonUseCases: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert
        variant="success"
        title="Form Submission Successful"
        description="Your form has been submitted and we've sent you a confirmation email."
      />

      <Alert
        variant="destructive"
        title="Connection Error"
        description="Unable to connect to the server. Please check your internet connection."
      />

      <Alert
        variant="warning"
        title="License Expiring Soon"
        description="Your license will expire in 7 days. Please renew to maintain access."
      />

      <Alert
        variant="default"
        title="New Feature Available"
        description="Try our new dashboard analytics feature to gain more insights into your data."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Common use cases for alerts in different application contexts, from form submissions to system notifications.",
      },
    },
  },
}
