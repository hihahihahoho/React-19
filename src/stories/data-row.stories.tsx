import { Badge } from "@/components/ui/badge/badge"
import {
  DataRow,
  DataRowLabel,
  DataRowValue,
  DataRowWrapper,
} from "@/components/ui/data-row"
import type { Meta, StoryObj } from "@storybook/react"
import { Edit, ExternalLink, Github, Mail, Phone } from "lucide-react"

/**
 * DataRow components provide a structured layout for displaying label-value pairs,
 * commonly used in details pages, profiles, or settings sections.
 */
const meta = {
  title: "BASE/Data Row",
  component: DataRow,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
DataRow components create structured layouts for displaying information in a label-value format.
They organize content in a responsive grid that adapts to different screen sizes.

## When to use
- To display form data in a read-only format
- For user profiles and account details pages
- In settings sections or configuration displays
- To show structured information that needs a clear label-value relationship

## Accessibility
- The grid layout ensures proper alignment across different screen sizes
- The component provides clear visual separation between items with bottom borders
- Text maintains appropriate contrast and readability at different viewport widths
        `,
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the data row",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex w-full max-w-3xl items-center justify-center rounded-lg bg-white p-6 shadow-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DataRow>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic usage of DataRow components to display information in a structured format.
 */
export const Basic: Story = {
  render: () => (
    <DataRowWrapper>
      <DataRow>
        <DataRowLabel>Full Name</DataRowLabel>
        <DataRowValue>John Doe</DataRowValue>
      </DataRow>
      <DataRow>
        <DataRowLabel>Email Address</DataRowLabel>
        <DataRowValue>john.doe@example.com</DataRowValue>
      </DataRow>
      <DataRow>
        <DataRowLabel>Phone Number</DataRowLabel>
        <DataRowValue>(123) 456-7890</DataRowValue>
      </DataRow>
    </DataRowWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Basic implementation of DataRow components for displaying structured information.",
      },
    },
  },
}

/**
 * DataRow components with icons to provide visual cues for different types of information.
 */
export const WithIcons: Story = {
  render: () => (
    <DataRowWrapper>
      <DataRow>
        <DataRowLabel className="flex items-center gap-2">
          <Mail className="size-4" />
          <span>Email</span>
        </DataRowLabel>
        <DataRowValue>contact@example.com</DataRowValue>
      </DataRow>
      <DataRow>
        <DataRowLabel className="flex items-center gap-2">
          <Phone className="size-4" />
          <span>Phone</span>
        </DataRowLabel>
        <DataRowValue>(123) 456-7890</DataRowValue>
      </DataRow>
      <DataRow>
        <DataRowLabel className="flex items-center gap-2">
          <Github className="size-4" />
          <span>GitHub</span>
        </DataRowLabel>
        <DataRowValue>github.com/username</DataRowValue>
      </DataRow>
    </DataRowWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Adding icons to DataRowLabel components enhances visual identification of different information types.",
      },
    },
  },
}

/**
 * DataRow components with interactive elements like buttons or links.
 */
export const WithInteractiveElements: Story = {
  render: () => (
    <DataRowWrapper>
      <DataRow>
        <DataRowLabel>Username</DataRowLabel>
        <DataRowValue className="flex items-center justify-between">
          <span>johndoe123</span>
          <button className="text-blue-500 hover:text-blue-700">
            <Edit className="size-4" />
          </button>
        </DataRowValue>
      </DataRow>
      <DataRow>
        <DataRowLabel>Website</DataRowLabel>
        <DataRowValue>
          <a
            href="#"
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
          >
            example.com
            <ExternalLink className="size-4" />
          </a>
        </DataRowValue>
      </DataRow>
      <DataRow>
        <DataRowLabel>Privacy Settings</DataRowLabel>
        <DataRowValue className="flex items-center justify-between">
          <span>Private Profile</span>
        </DataRowValue>
      </DataRow>
    </DataRowWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "DataRows can include interactive elements like buttons, links, or toggle switches.",
      },
    },
  },
}

/**
 * Nested DataRow components for organizing complex hierarchical information.
 */
export const NestedDataRows: Story = {
  render: () => (
    <DataRowWrapper>
      <DataRow>
        <DataRowLabel>Contact Information</DataRowLabel>
        <DataRowValue>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Email:</span>
              <span>contact@example.com</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Phone:</span>
              <span>(123) 456-7890</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Address:</span>
              <span>123 Main St, Anytown</span>
            </div>
          </div>
        </DataRowValue>
      </DataRow>
      <DataRow>
        <DataRowLabel>Account Details</DataRowLabel>
        <DataRowValue>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Username:</span>
              <span>johndoe123</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Member since:</span>
              <span>January 2023</span>
            </div>
          </div>
        </DataRowValue>
      </DataRow>
    </DataRowWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "For complex data, nested structures within DataRowValue can organize related information.",
      },
    },
  },
}

/**
 * DataRow components styled differently to match various UI contexts.
 */
export const StyledVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <DataRowWrapper className="rounded-lg bg-gray-50 px-4">
        <DataRow>
          <DataRowLabel className="text-gray-600">Name</DataRowLabel>
          <DataRowValue>John Doe</DataRowValue>
        </DataRow>
        <DataRow>
          <DataRowLabel className="text-gray-600">Email</DataRowLabel>
          <DataRowValue>john.doe@example.com</DataRowValue>
        </DataRow>
      </DataRowWrapper>

      <DataRowWrapper className="rounded-lg border px-4">
        <DataRow className="border-b-0">
          <DataRowLabel className="font-bold">Product</DataRowLabel>
          <DataRowValue>Premium Plan</DataRowValue>
        </DataRow>
        <DataRow className="border-b-0">
          <DataRowLabel className="font-bold">Price</DataRowLabel>
          <DataRowValue className="font-semibold text-green-600">
            $99.99
          </DataRowValue>
        </DataRow>
      </DataRowWrapper>

      <DataRowWrapper className="rounded-lg bg-blue-50 px-4">
        <DataRow className="border-b border-blue-100">
          <DataRowLabel className="text-blue-700">Status</DataRowLabel>
          <DataRowValue className="font-medium">Active</DataRowValue>
        </DataRow>
        <DataRow className="border-b-0">
          <DataRowLabel className="text-blue-700">Updated</DataRowLabel>
          <DataRowValue>2 days ago</DataRowValue>
        </DataRow>
      </DataRowWrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "DataRow components can be styled differently to match various UI contexts and design requirements.",
      },
    },
  },
}

/**
 * DataRow components with longer content handling.
 */
export const WithLongContent: Story = {
  render: () => (
    <DataRowWrapper>
      <DataRow>
        <DataRowLabel>Short Label</DataRowLabel>
        <DataRowValue>
          This is a very long piece of content that demonstrates how the DataRow
          component handles text wrapping for longer strings of information. The
          grid layout ensures that this content will wrap appropriately while
          maintaining the alignment with the label.
        </DataRowValue>
      </DataRow>
      <DataRow>
        <DataRowLabel>
          This is a much longer label that also demonstrates wrapping behavior
        </DataRowLabel>
        <DataRowValue>Short value</DataRowValue>
      </DataRow>
      <DataRow>
        <DataRowLabel>Technical Details</DataRowLabel>
        <DataRowValue className="break-all">
          https://very-long-url-example.com/path/to/resource?param1=value1&param2=value2&param3=value3#section
        </DataRowValue>
      </DataRow>
    </DataRowWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "DataRow components handle longer content with appropriate wrapping and maintain alignment.",
      },
    },
  },
}

/**
 * DataRow customized for different content types.
 */
export const ContentVariants: Story = {
  render: () => (
    <DataRowWrapper>
      <DataRow>
        <DataRowLabel>Text</DataRowLabel>
        <DataRowValue>Standard text content</DataRowValue>
      </DataRow>
      <DataRow>
        <DataRowLabel>Rich Text</DataRowLabel>
        <DataRowValue>
          <span className="font-semibold">Important</span> information with{" "}
          <span className="text-blue-500">colored text</span> and{" "}
          <span className="underline">underlined elements</span>.
        </DataRowValue>
      </DataRow>
      <DataRow>
        <DataRowLabel>Lists</DataRowLabel>
        <DataRowValue>
          <ul className="list-inside list-disc">
            <li>First item</li>
            <li>Second item</li>
            <li>Third item</li>
          </ul>
        </DataRowValue>
      </DataRow>
      <DataRow>
        <DataRowLabel>Badge</DataRowLabel>
        <DataRowValue>
          <Badge variant="green">Completed</Badge>
        </DataRowValue>
      </DataRow>
    </DataRowWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "DataRow components can contain various content types including text, rich text, lists, and other UI elements.",
      },
    },
  },
}

/**
 * Responsive behavior of DataRow components at different viewport sizes.
 */
export const Responsive: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="mb-4 text-center text-sm text-gray-500">
        Resize the browser window to see how the grid adapts
      </div>
      <DataRowWrapper>
        <DataRow>
          <DataRowLabel>Default Behavior</DataRowLabel>
          <DataRowValue>
            The grid uses 5/12 columns for labels and 7/12 columns for values on
            mobile, changing to 4/12 and 8/12 on larger screens.
          </DataRowValue>
        </DataRow>
        <DataRow>
          <DataRowLabel>Responsive Layout</DataRowLabel>
          <DataRowValue>
            This provides better readability on small screens while utilizing
            space more effectively on larger displays.
          </DataRowValue>
        </DataRow>
      </DataRowWrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The DataRow component adapts its layout at different viewport sizes for optimal readability.",
      },
    },
  },
}

/**
 * Example of a complete form display using DataRow components.
 */
export const ProfileExample: Story = {
  render: () => (
    <div className="w-full">
      <h2 className="mb-4 text-xl font-semibold">User Profile</h2>
      <DataRowWrapper className="mb-8">
        <DataRow>
          <DataRowLabel>Full Name</DataRowLabel>
          <DataRowValue>Jane Smith</DataRowValue>
        </DataRow>
        <DataRow>
          <DataRowLabel>Email Address</DataRowLabel>
          <DataRowValue>jane.smith@example.com</DataRowValue>
        </DataRow>
        <DataRow>
          <DataRowLabel>Phone Number</DataRowLabel>
          <DataRowValue>(555) 123-4567</DataRowValue>
        </DataRow>
        <DataRow>
          <DataRowLabel>Location</DataRowLabel>
          <DataRowValue>San Francisco, CA</DataRowValue>
        </DataRow>
      </DataRowWrapper>

      <h2 className="mb-4 text-xl font-semibold">Account Details</h2>
      <DataRowWrapper>
        <DataRow>
          <DataRowLabel>Username</DataRowLabel>
          <DataRowValue className="flex items-center justify-between">
            <span>janesmith</span>
            <button className="text-sm text-blue-500 hover:text-blue-700">
              Edit
            </button>
          </DataRowValue>
        </DataRow>
        <DataRow>
          <DataRowLabel>Account Type</DataRowLabel>
          <DataRowValue>
            <Badge variant="blue">Premium</Badge>
          </DataRowValue>
        </DataRow>
        <DataRow>
          <DataRowLabel>Member Since</DataRowLabel>
          <DataRowValue>March 15, 2022</DataRowValue>
        </DataRow>
        <DataRow>
          <DataRowLabel>Last Login</DataRowLabel>
          <DataRowValue>Today at 9:30 AM</DataRowValue>
        </DataRow>
      </DataRowWrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "A complete profile display example using DataRow components.",
      },
    },
  },
}

/**
 * Fully interactive example with all available props.
 */
export const Interactive: Story = {
  args: {
    className: "bg-gray-50 px-4 rounded",
    children: (
      <>
        <DataRowLabel>Interactive Example</DataRowLabel>
        <DataRowValue>
          This example can be customized using the Controls panel
        </DataRowValue>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "An interactive example that can be customized using the Controls panel.",
      },
    },
  },
}

/**
 * A comprehensive showcase of all DataRow features and use cases.
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div className="w-full space-y-8">
      <div>
        <h3 className="mb-2 text-sm font-medium">Basic Usage</h3>
        <DataRowWrapper>
          <DataRow>
            <DataRowLabel>Name</DataRowLabel>
            <DataRowValue>John Doe</DataRowValue>
          </DataRow>
          <DataRow>
            <DataRowLabel>Email</DataRowLabel>
            <DataRowValue>john.doe@example.com</DataRowValue>
          </DataRow>
        </DataRowWrapper>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">With Icons</h3>
        <DataRowWrapper>
          <DataRow>
            <DataRowLabel className="flex items-center gap-2">
              <Mail className="size-4" />
              <span>Email</span>
            </DataRowLabel>
            <DataRowValue>support@example.com</DataRowValue>
          </DataRow>
          <DataRow>
            <DataRowLabel className="flex items-center gap-2">
              <Phone className="size-4" />
              <span>Phone</span>
            </DataRowLabel>
            <DataRowValue>(123) 456-7890</DataRowValue>
          </DataRow>
        </DataRowWrapper>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Custom Styling</h3>
        <DataRowWrapper className="rounded bg-gray-50 px-4">
          <DataRow className="border-gray-200">
            <DataRowLabel className="text-gray-600">Status</DataRowLabel>
            <DataRowValue className="font-medium text-green-600">
              Active
            </DataRowValue>
          </DataRow>
          <DataRow className="border-gray-200">
            <DataRowLabel className="text-gray-600">Updated</DataRowLabel>
            <DataRowValue>Yesterday</DataRowValue>
          </DataRow>
        </DataRowWrapper>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">With Interactive Elements</h3>
        <DataRowWrapper>
          <DataRow>
            <DataRowLabel>Profile</DataRowLabel>
            <DataRowValue className="flex items-center justify-between">
              <span>Public</span>
              <button className="rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200">
                Change
              </button>
            </DataRowValue>
          </DataRow>
          <DataRow>
            <DataRowLabel>Website</DataRowLabel>
            <DataRowValue>
              <a
                href="#"
                className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
              >
                example.com
                <ExternalLink className="size-4" />
              </a>
            </DataRowValue>
          </DataRow>
        </DataRowWrapper>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Complex Content</h3>
        <DataRowWrapper>
          <DataRow>
            <DataRowLabel>Skills</DataRowLabel>
            <DataRowValue>
              <div className="flex flex-wrap gap-1">
                <Badge variant="blue">React</Badge>
                <Badge variant="blue">TypeScript</Badge>
                <Badge variant="blue">Node.js</Badge>
              </div>
            </DataRowValue>
          </DataRow>
          <DataRow>
            <DataRowLabel>Description</DataRowLabel>
            <DataRowValue>
              <p className="mb-2">Senior Developer with expertise in:</p>
              <ul className="list-inside list-disc text-sm">
                <li>Frontend development</li>
                <li>API design</li>
                <li>Performance optimization</li>
              </ul>
            </DataRowValue>
          </DataRow>
        </DataRowWrapper>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A comprehensive showcase of different DataRow configurations, styles, and content types.",
      },
    },
  },
}
