import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion/accordion"
import { Badge } from "@/components/ui/badge/badge"
import { Button } from "@/components/ui/button"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  FileText,
  HelpCircle,
  Lock,
  Settings,
  Star,
  Users,
} from "lucide-react"

/**
 * Accordion component provides collapsible content sections that help organize
 * information in a space-efficient manner. Built on top of Radix UI Accordion.
 */
const meta = {
  title: "Display/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/accordion.json
\`\`\`

Accordion components allow users to toggle the display of sections of content.
They're ideal for organizing related information and helping users focus on specific content areas.

## When to use
- For FAQ sections where users need to find specific information
- To organize content into digestible sections
- When space is limited and content needs to be progressive disclosed
- For settings panels with grouped configurations

## Features
- Single or multiple item expansion
- Smooth open/close animations
- Keyboard navigation support
- Accessible with proper ARIA attributes
- Customizable trigger and content areas

## Accessibility
- Uses proper ARIA attributes for expandable content
- Keyboard navigation with Arrow keys, Space, and Enter
- Focus management follows WAI-ARIA guidelines
- Screen reader announcements for state changes
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["single", "multiple"],
      description: "Controls whether single or multiple items can be open",
      table: {
        defaultValue: { summary: "single" },
      },
    },
    collapsible: {
      control: "boolean",
      description: "Allows all items to be closed when type is 'single'",
    },
    defaultValue: {
      control: "text",
      description: "The default opened item value(s)",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof Accordion>

/**
 * Basic accordion with single item expansion (default behavior).
 */
export const SingleMode: Story = {
  render: () => (
    <Accordion type="single" collapsible={true}>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is React?</AccordionTrigger>
        <AccordionContent>
          React is a JavaScript library for building user interfaces. It allows
          you to create reusable UI components and manage application state
          efficiently using a virtual DOM.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How does state management work?</AccordionTrigger>
        <AccordionContent>
          State management in React involves controlling and updating component
          state over time. You can use built-in hooks like useState and
          useReducer, or external libraries like Redux or Zustand for complex
          applications.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What are React hooks?</AccordionTrigger>
        <AccordionContent>
          React hooks are functions that allow you to use state and other React
          features in functional components. Common hooks include useState,
          useEffect, useContext, and many others that provide powerful
          functionality.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Basic accordion where only one item can be open at a time. Click another trigger to close the current item and open the new one.",
      },
    },
  },
}

/**
 * Accordion allowing multiple items to be open simultaneously.
 */
export const MultipleMode: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={["item-1", "item-3"]}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Account Settings</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p>Manage your account preferences and personal information.</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Notifications</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p>Configure how you receive notifications and updates.</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">Email notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span className="text-sm">Push notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">Marketing emails</span>
              </label>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Privacy & Security</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p>Control your privacy settings and security options.</p>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Accordion allowing multiple items to be expanded simultaneously. Useful for settings panels or when users need to compare content across sections.",
      },
    },
  },
}

/**
 * Accordion with rich content including icons, badges, and interactive elements.
 */
export const RichContent: Story = {
  render: () => (
    <Accordion type="single" collapsible={true}>
      <AccordionItem value="pricing">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-blue-500" />
            <span>Pricing Plans</span>
            <Badge variant="blue">Popular</Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <p>Choose the plan that best fits your needs:</p>
            <div className="grid gap-3">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Starter</h4>
                    <p className="text-muted-foreground text-sm">
                      Perfect for small projects
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">$9/mo</div>
                    <Button size="sm">Choose Plan</Button>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Professional</h4>
                    <p className="text-muted-foreground text-sm">
                      For growing businesses
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">$29/mo</div>
                    <Button size="sm">Choose Plan</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="features">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Key Features</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Unlimited projects</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Advanced analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">24/7 support</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">API access</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="support">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-purple-500" />
            <span>Support & Help</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p>Get help when you need it:</p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Documentation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Community Forum
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Accordion with rich content including icons, badges, buttons, and structured layouts. Shows how to create engaging and interactive accordion sections.",
      },
    },
  },
}

/**
 * FAQ-style accordion with warning and information states.
 */
export const FAQStyle: Story = {
  render: () => (
    <Accordion type="single" collapsible={true}>
      <AccordionItem value="security">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <Lock className="h-4 w-4 text-green-600" />
            <span>Is my data secure?</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Your data is completely secure
                  </p>
                  <p className="mt-1 text-sm text-green-700">
                    We use industry-standard encryption and security measures to
                    protect your information.
                  </p>
                </div>
              </div>
            </div>
            <ul className="ml-4 space-y-1 text-sm">
              <li>• End-to-end encryption</li>
              <li>• SOC 2 compliance</li>
              <li>• Regular security audits</li>
              <li>• GDPR compliant</li>
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="billing">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-blue-600" />
            <span>How does billing work?</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p className="text-sm">
              We offer flexible billing options to suit your needs:
            </p>
            <div className="space-y-2">
              <div className="rounded border p-3">
                <h4 className="text-sm font-medium">Monthly billing</h4>
                <p className="text-muted-foreground text-xs">
                  Pay monthly with no long-term commitment
                </p>
              </div>
              <div className="rounded border p-3">
                <h4 className="text-sm font-medium">Annual billing</h4>
                <p className="text-muted-foreground text-xs">
                  Save 20% with annual subscriptions
                </p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="cancellation">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span>Can I cancel anytime?</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Yes, but please note
                  </p>
                  <p className="mt-1 text-sm text-amber-700">
                    You can cancel anytime, but refunds are only available
                    within 30 days of payment.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p>• No cancellation fees</p>
              <p>• Keep access until end of billing period</p>
              <p>• Export your data before canceling</p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "FAQ-style accordion with informational states, warnings, and structured content. Perfect for help sections and customer support.",
      },
    },
  },
}

/**
 * Minimal accordion with simple text content.
 */
export const Minimal: Story = {
  render: () => (
    <Accordion type="single" collapsible={true}>
      <AccordionItem value="what">
        <AccordionTrigger>What is your return policy?</AccordionTrigger>
        <AccordionContent>
          You can return any item within 30 days of purchase for a full refund.
          Items must be in original condition with tags attached.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="how">
        <AccordionTrigger>How long does shipping take?</AccordionTrigger>
        <AccordionContent>
          Standard shipping takes 3-5 business days. Express shipping is
          available for 1-2 business days delivery.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="where">
        <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
        <AccordionContent>
          Yes, we ship to over 50 countries worldwide. International shipping
          typically takes 7-14 business days.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Simple, minimal accordion with plain text content. Perfect for basic FAQ sections and simple information organization.",
      },
    },
  },
}
