import { SVGInline } from "@/components/ui/svg-inline/svg-inline"
import type { Meta, StoryObj } from "@storybook/react-vite"

/**
 * SVGInline component loads and displays SVG files inline, allowing for dynamic styling with CSS.
 * It supports loading states with skeleton placeholders and automatic color inheritance.
 */
const meta = {
  title: "Display/SVG Inline",
  component: SVGInline,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/svg-inline.json
\`\`\`

SVGInline loads SVG files dynamically and injects them inline into the DOM.
This allows the SVG to be styled with CSS, including inheriting the current text color.

## When to use
- When you need SVG icons that respond to CSS color changes
- When SVGs need to inherit \`currentColor\` for dynamic theming
- When you want to load SVGs dynamically from a URL
- For icons that need to change color based on parent styles

## Features
- **Dynamic Loading**: Loads SVGs from URLs at runtime
- **CSS Styling**: SVGs can be styled with CSS since they're inline
- **Color Inheritance**: Automatically converts \`#141B34\` fill/stroke to \`currentColor\`
- **Loading State**: Shows a skeleton placeholder while loading
- **Responsive**: SVG scales to fit its container

## Accessibility
- Ensure SVGs have appropriate \`aria-label\` or \`title\` elements for screen readers
- Consider using \`role="img"\` for decorative SVGs
        `,
      },
    },
  },
  argTypes: {
    src: {
      control: "text",
      description: "URL or path to the SVG file",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SVGInline>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic example of an inline SVG that inherits the current text color.
 */
export const Basic: Story = {
  args: {
    src: "/images/icons/theme-switch.svg",
    className: "size-10",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A basic SVG inline component that loads an SVG file and displays it with the current text color.",
      },
    },
  },
}

/**
 * SVG Inline with different sizes using Tailwind classes.
 */
export const SizeVariants: Story = {
  args: { src: "/images/icons/theme-switch.svg" },
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      <div className="flex flex-col items-center">
        <SVGInline src="/images/icons/theme-switch.svg" className="size-4" />
        <span className="mt-2 text-xs">16px</span>
      </div>
      <div className="flex flex-col items-center">
        <SVGInline src="/images/icons/theme-switch.svg" className="size-6" />
        <span className="mt-2 text-xs">24px</span>
      </div>
      <div className="flex flex-col items-center">
        <SVGInline src="/images/icons/theme-switch.svg" className="size-8" />
        <span className="mt-2 text-xs">32px</span>
      </div>
      <div className="flex flex-col items-center">
        <SVGInline src="/images/icons/theme-switch.svg" className="size-10" />
        <span className="mt-2 text-xs">40px</span>
      </div>
      <div className="flex flex-col items-center">
        <SVGInline src="/images/icons/theme-switch.svg" className="size-12" />
        <span className="mt-2 text-xs">48px</span>
      </div>
      <div className="flex flex-col items-center">
        <SVGInline src="/images/icons/theme-switch.svg" className="size-16" />
        <span className="mt-2 text-xs">64px</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "SVGInline scales to fit its container. Use Tailwind size utilities to control the icon size.",
      },
    },
  },
}

/**
 * SVG Inline inherits the text color of its parent container.
 */
export const ColorInheritance: Story = {
  args: { src: "/images/icons/theme-switch.svg" },
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex flex-col items-center text-red-500">
        <SVGInline src="/images/icons/theme-switch.svg" className="size-10" />
        <span className="mt-2 text-xs">Red</span>
      </div>
      <div className="flex flex-col items-center text-blue-500">
        <SVGInline src="/images/icons/theme-switch.svg" className="size-10" />
        <span className="mt-2 text-xs">Blue</span>
      </div>
      <div className="flex flex-col items-center text-green-500">
        <SVGInline src="/images/icons/theme-switch.svg" className="size-10" />
        <span className="mt-2 text-xs">Green</span>
      </div>
      <div className="flex flex-col items-center text-purple-500">
        <SVGInline src="/images/icons/theme-switch.svg" className="size-10" />
        <span className="mt-2 text-xs">Purple</span>
      </div>
      <div className="flex flex-col items-center text-orange-500">
        <SVGInline src="/images/icons/theme-switch.svg" className="size-10" />
        <span className="mt-2 text-xs">Orange</span>
      </div>
      <div className="flex flex-col items-center text-pink-500">
        <SVGInline src="/images/icons/theme-switch.svg" className="size-10" />
        <span className="mt-2 text-xs">Pink</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "SVGInline automatically inherits the `currentColor` from the parent element, allowing icons to match text color.",
      },
    },
  },
}

/**
 * SVG Inline with hover color transitions.
 */
export const HoverEffects: Story = {
  args: { src: "/images/icons/theme-switch.svg" },
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex flex-col items-center">
        <div className="cursor-pointer text-gray-400 transition-colors duration-300 hover:text-blue-500">
          <SVGInline src="/images/icons/theme-switch.svg" className="size-10" />
        </div>
        <span className="text-muted-foreground mt-2 text-xs">Hover me</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="cursor-pointer text-gray-400 transition-colors duration-300 hover:text-green-500">
          <SVGInline src="/images/icons/theme-switch.svg" className="size-10" />
        </div>
        <span className="text-muted-foreground mt-2 text-xs">Hover me</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="cursor-pointer text-gray-400 transition-colors duration-300 hover:text-red-500">
          <SVGInline src="/images/icons/theme-switch.svg" className="size-10" />
        </div>
        <span className="text-muted-foreground mt-2 text-xs">Hover me</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Because SVGInline uses `currentColor`, you can create hover effects by changing the parent's text color.",
      },
    },
  },
}

/**
 * Using SVGInline in different contexts like buttons and cards.
 */
export const UsageInContext: Story = {
  args: { src: "/images/icons/theme-switch.svg" },
  render: () => (
    <div className="flex flex-col gap-8">
      {/* In buttons */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium">In Buttons</h3>
        <div className="flex gap-4">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 transition-colors">
            <SVGInline
              src="/images/icons/theme-switch.svg"
              className="size-4"
            />
            Toggle Theme
          </button>
          <button className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center gap-2 rounded-md border px-4 py-2 transition-colors">
            <SVGInline
              src="/images/icons/theme-switch.svg"
              className="size-4"
            />
            Settings
          </button>
        </div>
      </div>

      {/* In cards */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium">In Cards</h3>
        <div className="bg-card text-card-foreground flex items-center gap-4 rounded-lg border p-4 shadow-sm">
          <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-lg">
            <SVGInline
              src="/images/icons/theme-switch.svg"
              className="size-6"
            />
          </div>
          <div>
            <p className="font-medium">Theme Settings</p>
            <p className="text-muted-foreground text-sm">
              Switch between light and dark mode
            </p>
          </div>
        </div>
      </div>

      {/* Icon grid */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium">Icon Grid</h3>
        <div className="border-border grid grid-cols-4 gap-4 rounded-lg border p-4">
          {[
            "text-blue-500",
            "text-green-500",
            "text-red-500",
            "text-purple-500",
          ].map((color, i) => (
            <div
              key={i}
              className={`bg-muted/50 hover:bg-muted flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg p-4 transition-colors ${color}`}
            >
              <SVGInline
                src="/images/icons/theme-switch.svg"
                className="size-8"
              />
              <span className="text-foreground text-xs">Theme {i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Examples of SVGInline being used in common UI patterns like buttons, cards, and icon grids.",
      },
    },
  },
}

/**
 * A comprehensive showcase of all SVGInline features.
 */
export const CompleteShowcase: Story = {
  args: { src: "/images/icons/theme-switch.svg" },
  render: () => (
    <div className="grid gap-12">
      <div>
        <h3 className="mb-4 text-lg font-medium">Size Variants</h3>
        <div className="flex flex-wrap items-end gap-6">
          {[4, 6, 8, 10, 12, 16].map((size) => (
            <div key={size} className="flex flex-col items-center">
              <SVGInline
                src="/images/icons/theme-switch.svg"
                className={`size-${size}`}
              />
              <span className="text-muted-foreground mt-2 text-xs">
                size-{size}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Color Inheritance</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { color: "text-slate-600", label: "Slate" },
            { color: "text-red-500", label: "Red" },
            { color: "text-orange-500", label: "Orange" },
            { color: "text-amber-500", label: "Amber" },
            { color: "text-green-500", label: "Green" },
            { color: "text-teal-500", label: "Teal" },
            { color: "text-blue-500", label: "Blue" },
            { color: "text-indigo-500", label: "Indigo" },
            { color: "text-purple-500", label: "Purple" },
            { color: "text-pink-500", label: "Pink" },
          ].map(({ color, label }) => (
            <div key={color} className={`flex flex-col items-center ${color}`}>
              <SVGInline
                src="/images/icons/theme-switch.svg"
                className="size-8"
              />
              <span className="mt-1 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Interactive States</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex cursor-pointer flex-col items-center text-gray-400 transition-all duration-300 hover:scale-110 hover:text-blue-500">
            <SVGInline
              src="/images/icons/theme-switch.svg"
              className="size-10"
            />
            <span className="mt-2 text-xs">Scale + Color</span>
          </div>
          <div className="flex cursor-pointer flex-col items-center opacity-50 transition-all duration-300 hover:opacity-100">
            <SVGInline
              src="/images/icons/theme-switch.svg"
              className="size-10"
            />
            <span className="mt-2 text-xs">Opacity</span>
          </div>
          <div className="flex cursor-pointer flex-col items-center text-gray-400 transition-all duration-300 hover:rotate-180 hover:text-purple-500">
            <SVGInline
              src="/images/icons/theme-switch.svg"
              className="size-10"
            />
            <span className="mt-2 text-xs">Rotate + Color</span>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A comprehensive showcase displaying all SVGInline features including sizes, colors, and interactive states.",
      },
    },
  },
}
