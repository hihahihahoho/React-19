import { Sticky } from "@/components/ui/sticky"
import type { Meta, StoryObj } from "@storybook/react-vite"

/**
 * Sticky component detects when a sticky positioned element becomes "stuck".
 * Uses the -1px trick with IntersectionObserver + rootMargin for reliable detection.
 */
const meta = {
  title: "Layout/Sticky",
  component: Sticky,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/sticky.json
\`\`\`

Sticky component provides a reliable way to detect when a sticky positioned element becomes "stuck" to the viewport.

## How it works
Uses the **-1px trick** with IntersectionObserver:
1. Element is positioned at \`top: offset-1\` (e.g., \`offset=0\` → \`top: -1px\`)
2. When stuck, 1px is hidden outside viewport → \`intersectionRatio < 1\`
3. \`rootMargin\` adjusts detection boundary for different offset values

## When to use
- To apply visual changes (shadows, backdrop blur) when headers become sticky
- To track sticky state for analytics or UI feedback
- To create "stuck" indicators for navigation elements

## Features
- **No extra DOM elements** - Uses the element itself for detection
- **Direction support** - Works with top, bottom, left, right
- **\`offset\` prop** - Handles any position value automatically
- **\`stickyClassName\`** - Automatically applies classes when stuck
- **\`data-sticky\` attribute** - For CSS-only styling
        `,
      },
    },
  },
  argTypes: {
    direction: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Direction of stickiness",
    },
    stickyClassName: {
      control: "text",
      description: "Additional classes when sticky",
    },
    asChild: {
      control: "boolean",
      description: "Render as child element (Radix Slot pattern)",
    },
  },
} satisfies Meta<typeof Sticky>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Basic Usage
// ============================================================================

/**
 * Basic sticky header with shadow when stuck.
 * No offset needed for `top: 0` (actually `top: -1px` for detection).
 */
export const Basic: Story = {
  render: () => (
    <div className="h-[200vh] bg-linear-to-b from-slate-100 to-slate-300 p-4">
      <div className="mb-4 text-center text-slate-600">
        ↓ Scroll down to see sticky header
      </div>

      <div className="mt-8 space-y-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-white p-4 shadow-sm">
            Content block {i + 1}
          </div>
        ))}
      </div>
      <Sticky
        className="mt-4 rounded-lg bg-white p-4 transition-all duration-300"
        direction="bottom"
        stickyClassName="shadow-lg bg-indigo-500"
      >
        <h1 className="text-lg font-semibold group-data-sticky:text-indigo-100">
          Sticky Header
        </h1>
        <p className="text-sm text-slate-500 group-data-sticky:text-indigo-200">
          Sticks at top: -1px (virtually top: 0)
        </p>
      </Sticky>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Basic usage with no offset. The component automatically positions at `top: -1px` for detection to work.",
      },
    },
  },
}
