import { Badge } from "@/components/ui/badge"
import {
  OverflowGroup,
  OverflowGroupHiddenItems,
  OverflowGroupIndicator,
  OverflowGroupItem,
} from "@/components/ui/overflow-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { User } from "lucide-react"

/**
 * OverflowGroup component handles dynamic overflow of items in a container.
 * It automatically hides items that overflow and shows an indicator with the count.
 */
const meta = {
  title: "Components/OverflowGroup",
  component: OverflowGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/overflow-group.json
\`\`\`

OverflowGroup is a composition-based component that automatically handles overflow of items.
It measures available space and hides items that don't fit, showing an indicator with the overflow count.

## Features
- Automatic overflow detection based on container width
- Configurable max items and min shown items
- Support for multi-line layouts
- Customizable indicator rendering
- Access to hidden items via context for custom implementations

## When to use
- Tag/badge lists that may overflow
- Multi-select displays
- Any dynamic list that needs overflow handling
        `,
      },
    },
  },
  argTypes: {
    maxShownItems: {
      control: "number",
      description: "Maximum number of items to show",
    },
    maxLine: {
      control: "number",
      description: "Maximum number of lines (for multi-line layouts)",
      table: {
        defaultValue: { summary: "1" },
      },
    },
    minShowItems: {
      control: "number",
      description: "Minimum number of items to always show",
      table: {
        defaultValue: { summary: "1" },
      },
    },
    overflowState: {
      control: "select",
      options: ["collapse", "none"],
      description: "Overflow behavior: collapse hides items, none shows all",
      table: {
        defaultValue: { summary: "collapse" },
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
} satisfies Meta<typeof OverflowGroup>

export default meta
type Story = StoryObj<typeof OverflowGroup>

const sampleItems = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Next.js",
  "Tailwind CSS",
  "Radix UI",
  "Storybook",
]

/**
 * Basic usage with Badge components showing overflow behavior.
 */
export const Basic: Story = {
  render: () => (
    <div className="w-[300px]">
      <OverflowGroup>
        {sampleItems.map((item, index) => (
          <OverflowGroupItem key={item} index={index} asChild>
            <Badge variant="secondary">{item}</Badge>
          </OverflowGroupItem>
        ))}
        <OverflowGroupIndicator>
          {(count) => <Badge variant="outline">+{count}</Badge>}
        </OverflowGroupIndicator>
      </OverflowGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Basic overflow group with badges. Resize the container to see items collapse.",
      },
    },
  },
}

/**
 * Limit the maximum number of visible items.
 */
export const MaxShownItems: Story = {
  render: () => (
    <div className="w-[500px]">
      <OverflowGroup maxShownItems={3}>
        {sampleItems.map((item, index) => (
          <OverflowGroupItem key={item} index={index} asChild>
            <Badge variant="secondary">{item}</Badge>
          </OverflowGroupItem>
        ))}
        <OverflowGroupIndicator>
          {(count) => <Badge variant="outline">+{count}</Badge>}
        </OverflowGroupIndicator>
      </OverflowGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Limit the maximum visible items regardless of available space using `maxShownItems`.",
      },
    },
  },
}

/**
 * Ensure a minimum number of items are always visible.
 */
export const MinShowItems: Story = {
  render: () => (
    <div className="w-[150px]">
      <OverflowGroup minShowItems={2}>
        {sampleItems.map((item, index) => (
          <OverflowGroupItem key={item} index={index} asChild>
            <Badge variant="secondary">{item}</Badge>
          </OverflowGroupItem>
        ))}
        <OverflowGroupIndicator>
          {(count) => <Badge variant="outline">+{count}</Badge>}
        </OverflowGroupIndicator>
      </OverflowGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use `minShowItems` to always show at least N items, even in very narrow containers.",
      },
    },
  },
}

/**
 * Allow items to wrap to multiple lines.
 */
export const MultiLine: Story = {
  render: () => (
    <div className="w-[300px]">
      <OverflowGroup maxLine={2}>
        {sampleItems.map((item, index) => (
          <OverflowGroupItem key={item} index={index} asChild>
            <Badge variant="secondary">{item}</Badge>
          </OverflowGroupItem>
        ))}
        <OverflowGroupIndicator>
          {(count) => <Badge variant="outline">+{count}</Badge>}
        </OverflowGroupIndicator>
      </OverflowGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use `maxLine` to allow items to wrap across multiple lines before collapsing.",
      },
    },
  },
}

/**
 * Disable overflow behavior to show all items.
 */
export const NoOverflow: Story = {
  render: () => (
    <div className="w-[500px]">
      <OverflowGroup overflowState="none">
        {sampleItems.map((item, index) => (
          <OverflowGroupItem key={item} index={index} asChild>
            <Badge variant="secondary">{item}</Badge>
          </OverflowGroupItem>
        ))}
        <OverflowGroupIndicator>
          {(count) => <Badge variant="outline">+{count}</Badge>}
        </OverflowGroupIndicator>
      </OverflowGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use `overflowState='none'` to disable overflow behavior and show all items.",
      },
    },
  },
}

/**
 * Use OverflowGroupHiddenItems to show hidden items in a popover.
 */
export const WithPopover: Story = {
  render: () => (
    <div className="w-[250px]">
      <OverflowGroup>
        {sampleItems.map((item, index) => (
          <OverflowGroupItem key={item} index={index} asChild>
            <Badge variant="secondary">{item}</Badge>
          </OverflowGroupItem>
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <OverflowGroupIndicator asChild>
              {(count) => (
                <button type="button" className="cursor-pointer">
                  <Badge variant="outline">+{count}</Badge>
                </button>
              )}
            </OverflowGroupIndicator>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <OverflowGroupHiddenItems>
              {(hiddenIndices) => (
                <div className="flex flex-wrap gap-1">
                  {hiddenIndices.map((index) => (
                    <Badge key={index} variant="secondary">
                      {sampleItems[index]}
                    </Badge>
                  ))}
                </div>
              )}
            </OverflowGroupHiddenItems>
          </PopoverContent>
        </Popover>
      </OverflowGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use `OverflowGroupHiddenItems` to access hidden item indices and render them in a popover.",
      },
    },
  },
}

/**
 * Custom styling with different badge variants.
 */
export const CustomStyling: Story = {
  render: () => {
    const colorfulItems = [
      { label: "Frontend", variant: "blue" as const },
      { label: "Backend", variant: "green" as const },
      { label: "DevOps", variant: "purple" as const },
      { label: "Design", variant: "pink" as const },
      { label: "Product", variant: "yellow" as const },
      { label: "QA", variant: "red" as const },
    ]

    return (
      <div className="w-[300px]">
        <OverflowGroup>
          {colorfulItems.map((item, index) => (
            <OverflowGroupItem key={item.label} index={index} asChild>
              <Badge variant={item.variant}>{item.label}</Badge>
            </OverflowGroupItem>
          ))}
          <OverflowGroupIndicator>
            {(count) => (
              <Badge variant="secondary" className="font-mono">
                +{count} more
              </Badge>
            )}
          </OverflowGroupIndicator>
        </OverflowGroup>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Combine with different Badge variants for colorful, themed displays.",
      },
    },
  },
}

/**
 * Items with icons for richer content.
 */
export const WithIcons: Story = {
  render: () => {
    const users = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"]

    return (
      <div className="w-[300px]">
        <OverflowGroup>
          {users.map((user, index) => (
            <OverflowGroupItem key={user} index={index} asChild>
              <Badge variant="secondary">
                <User className="size-3" />
                {user}
              </Badge>
            </OverflowGroupItem>
          ))}
          <OverflowGroupIndicator>
            {(count) => (
              <Badge variant="outline">
                <User className="size-3" />+{count}
              </Badge>
            )}
          </OverflowGroupIndicator>
        </OverflowGroup>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Items can include icons for richer visual content.",
      },
    },
  },
}

/**
 * Responsive example that adjusts based on container width.
 */
export const Responsive: Story = {
  render: () => {
    const items = sampleItems.slice(0, 5)
    return (
      <div className="flex flex-col gap-4">
        <div className="w-[150px] rounded border p-2">
          <p className="text-muted-foreground mb-2 text-xs">150px</p>
          <OverflowGroup>
            {items.map((item, index) => (
              <OverflowGroupItem key={item} index={index} asChild>
                <Badge variant="secondary" size="sm">
                  {item}
                </Badge>
              </OverflowGroupItem>
            ))}
            <OverflowGroupIndicator>
              {(count) => (
                <Badge variant="outline" size="sm">
                  +{count}
                </Badge>
              )}
            </OverflowGroupIndicator>
          </OverflowGroup>
        </div>

        <div className="w-[250px] rounded border p-2">
          <p className="text-muted-foreground mb-2 text-xs">250px</p>
          <OverflowGroup>
            {items.map((item, index) => (
              <OverflowGroupItem key={item} index={index} asChild>
                <Badge variant="secondary" size="sm">
                  {item}
                </Badge>
              </OverflowGroupItem>
            ))}
            <OverflowGroupIndicator>
              {(count) => (
                <Badge variant="outline" size="sm">
                  +{count}
                </Badge>
              )}
            </OverflowGroupIndicator>
          </OverflowGroup>
        </div>

        <div className="w-[400px] rounded border p-2">
          <p className="text-muted-foreground mb-2 text-xs">400px</p>
          <OverflowGroup>
            {items.map((item, index) => (
              <OverflowGroupItem key={item} index={index} asChild>
                <Badge variant="secondary" size="sm">
                  {item}
                </Badge>
              </OverflowGroupItem>
            ))}
            <OverflowGroupIndicator>
              {(count) => (
                <Badge variant="outline" size="sm">
                  +{count}
                </Badge>
              )}
            </OverflowGroupIndicator>
          </OverflowGroup>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstration of how overflow adjusts to different container widths.",
      },
    },
  },
}
