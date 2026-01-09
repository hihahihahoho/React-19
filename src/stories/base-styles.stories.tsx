import type { Meta, StoryObj } from "@storybook/react-vite"

/**
 * Base Styles provides foundational CSS for your application.
 *
 * This is a **recommended** package that sets up essential styles and utilities
 * for a consistent, polished UI experience.
 */
const meta: Meta = {
  title: "Styles/Base Styles",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/base-styles.json
\`\`\`

## 📦 What's Included

This package provides essential CSS styles and utilities:

| File | Layer | Description |
|------|-------|-------------|
| \`base.css\` | \`@layer base\` | Font family, scrollbar, border/outline defaults |
| \`components.css\` | \`@layer components\` | Reusable component utility classes |
| \`custom-utilities.css\` | - | Custom \`@utility\` directives for Tailwind v4 |

## 🔌 Tailwind Plugin

Includes **tailwindcss-safe-area** plugin for mobile safe area insets (notch, home indicator).

## 🎨 Key Features

### Background Shorthand Utility (\`bgs-*\`)
A powerful utility for theme-aware, multi-layer backgrounds. Define complex backgrounds once in CSS variables, then apply with a simple class.

### Custom Scrollbar
Thin, theme-aware scrollbar styling across all browsers.

### Safe Area Support
Mobile-first utilities for edge-to-edge designs on devices with notches and home indicators.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * The `bgs-*` (background shorthand) utility allows you to define complex backgrounds
 * as CSS variables and apply them with a single class. This makes theme switching
 * and multi-layer backgrounds much easier to manage.
 */
export const BackgroundShorthand: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-semibold">
          bgs-* (Background Shorthand)
        </h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Use <code className="bg-muted rounded px-1.5 py-0.5">bgs-*</code> for
          theme-aware, multi-layer backgrounds that are easy to switch.
        </p>

        <div className="space-y-4">
          {/* Step 1: @utility */}
          <div>
            <h4 className="mb-2 font-medium">
              1. @utility Directive{" "}
              <span className="text-muted-foreground text-sm font-normal">
                (already in custom-utilities.css)
              </span>
            </h4>
            <pre className="bg-muted overflow-x-auto rounded-md p-4 text-xs">
              {`/* custom-utilities.css */
@utility bgs-* {
  background: --value(--bgs-*);
}

/* This generates: .bgs-login { background: var(--bgs-login); } */`}
            </pre>
          </div>

          {/* Step 2: @theme inline */}
          <div>
            <h4 className="mb-2 font-medium">
              2. Register in @theme inline{" "}
              <span className="text-muted-foreground text-sm font-normal">
                (required to generate the class)
              </span>
            </h4>
            <pre className="bg-muted overflow-x-auto rounded-md p-4 text-xs">
              {`/* index.css */
@theme inline {
  /* ... other theme vars ... */
  --bgs-login: var(--bgs-login);
  --bgs-hero: var(--bgs-hero);
}`}
            </pre>
            <p className="text-muted-foreground mt-2 text-xs">
              ⚠️ Without this, Tailwind won't know the variable exists and won't
              generate the utility class!
            </p>
          </div>

          {/* Step 3: Define value */}
          <div>
            <h4 className="mb-2 font-medium">
              3. Define Actual Value in :root
            </h4>
            <pre className="bg-muted overflow-x-auto rounded-md p-4 text-xs">
              {`:root {
  --bgs-login: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --bgs-hero: 
    url('/pattern.svg'),
    linear-gradient(to bottom, rgba(0,0,0,0.5), transparent),
    #1a1a2e;
}

.dark {
  --bgs-login: linear-gradient(135deg, #2d3561 0%, #1e1e2e 100%);
}`}
            </pre>
          </div>

          {/* Step 4: Usage */}
          <div>
            <h4 className="mb-2 font-medium">4. Use in HTML</h4>
            <pre className="bg-muted overflow-x-auto rounded-md p-4 text-xs">
              {`<div class="bgs-login min-h-screen">
  <!-- Login form - background switches automatically in dark mode -->
</div>

<section class="bgs-hero py-20">
  <!-- Multi-layer background: image + gradient + color -->
</section>`}
            </pre>
          </div>

          {/* Why */}
          <div className="rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
            <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-100">
              💡 Why use bgs-*?
            </h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>
                • <strong>Theme switching:</strong> Change backgrounds globally
                by updating :root variables
              </li>
              <li>
                • <strong>Multi-layer backgrounds:</strong> Images + gradients +
                colors in one variable
              </li>
              <li>
                • <strong>Cleaner markup:</strong> Replace long{" "}
                <code>bg-[linear-gradient(...)]</code> classes with semantic
                names
              </li>
              <li>
                • <strong>Design tokens:</strong> Keep all backgrounds in one
                place, easy to update
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The \`bgs-*\` utility is a custom Tailwind v4 utility that maps to \`--bgs-*\` CSS variables.

**3-Step Process:**
1. \`@utility bgs-*\` - Defines the utility pattern (already included)
2. \`@theme inline { --bgs-X }\` - Registers the variable so Tailwind generates the class
3. \`:root { --bgs-X: value }\` - Defines the actual background value

**Perfect for:**
- Login/auth page backgrounds with gradients
- Hero sections with image + gradient overlays
- Dashboard areas with subtle patterns
- Any background that needs to change between light/dark themes
        `,
      },
    },
  },
}

/**
 * Custom scrollbar styling that's thin, subtle, and matches your theme.
 */
export const CustomScrollbar: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-semibold">Custom Scrollbar</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Thin, theme-aware scrollbar that works across all modern browsers.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* With Scrollbar */}
          <div>
            <h4 className="mb-2 text-sm font-medium">Default Scrollbar</h4>
            <div className="bg-muted/30 h-40 overflow-auto rounded-md border p-4">
              <div className="h-80 space-y-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <p key={i} className="text-muted-foreground text-sm">
                    Scrollable content line {i + 1}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* No Scrollbar */}
          <div>
            <h4 className="mb-2 text-sm font-medium">
              .no-scrollbar (hidden but scrollable)
            </h4>
            <div className="no-scrollbar bg-muted/30 h-40 overflow-auto rounded-md border p-4">
              <div className="h-80 space-y-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <p key={i} className="text-muted-foreground text-sm">
                    Scrollable content line {i + 1}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <pre className="bg-muted overflow-x-auto rounded-md p-4 text-xs">
            {`/* Hide scrollbar but keep functionality */
<div class="no-scrollbar overflow-auto">
  <!-- Content still scrollable -->
</div>`}
          </pre>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Base styles include custom scrollbar styling:

- **5px width** for a modern, minimal look
- **Theme colors** using \`--border\` variable
- **Cross-browser** support (WebKit + Firefox)
- **\`.no-scrollbar\`** class to hide scrollbars while keeping scroll functionality
        `,
      },
    },
  },
}

/**
 * Safe area utilities for mobile devices with notches and home indicators.
 */
export const SafeAreaPlugin: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-semibold">
          tailwindcss-safe-area Plugin
        </h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Utilities for handling safe area insets on mobile devices with
          notches, rounded corners, or home indicators.
        </p>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-md border p-4">
              <h4 className="mb-2 font-medium">Padding</h4>
              <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                pt-safe pb-safe pl-safe pr-safe p-safe
              </code>
            </div>
            <div className="rounded-md border p-4">
              <h4 className="mb-2 font-medium">Margin</h4>
              <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                mt-safe mb-safe ml-safe mr-safe m-safe
              </code>
            </div>
            <div className="rounded-md border p-4">
              <h4 className="mb-2 font-medium">Height</h4>
              <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                h-screen-safe min-h-screen-safe
              </code>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">
              Example: Fixed Bottom Navigation
            </h4>
            <pre className="bg-muted overflow-x-auto rounded-md p-4 text-xs">
              {`<nav class="fixed bottom-0 left-0 right-0 pb-safe bg-background border-t">
  <div class="flex justify-around py-2">
    <button>Home</button>
    <button>Search</button>
    <button>Profile</button>
  </div>
</nav>`}
            </pre>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Example: Full-Height Page</h4>
            <pre className="bg-muted overflow-x-auto rounded-md p-4 text-xs">
              {`<main class="min-h-screen-safe pt-safe pb-safe">
  <header class="sticky top-0 pt-safe">...</header>
  <content>...</content>
  <footer class="pb-safe">...</footer>
</main>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The **tailwindcss-safe-area** plugin adds utilities for CSS \`env(safe-area-inset-*)\` values.

Essential for:
- Fixed headers and footers on notched devices
- Full-screen mobile web apps
- Edge-to-edge designs that respect device boundaries
        `,
      },
    },
  },
}

/**
 * Component utility classes for common patterns.
 */
export const ComponentClasses: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-semibold">Component Classes</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Reusable utility classes for common component patterns.
        </p>

        <div className="space-y-4">
          <div className="rounded-md border p-4">
            <h4 className="mb-2 font-medium">.popover-content-width-full</h4>
            <p className="text-muted-foreground mb-2 text-sm">
              Makes popover/dropdown content match the width of its trigger
              element.
            </p>
            <pre className="bg-muted overflow-x-auto rounded-md p-4 text-xs">
              {`.popover-content-width-full {
  width: var(--radix-popover-trigger-width) !important;
  min-width: 12.5rem; /* 200px minimum */
}

/* Usage with Select/Combobox */
<SelectContent class="popover-content-width-full">
  ...
</SelectContent>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Component classes provide reusable patterns that are commonly needed across UI components.

These are placed in \`@layer components\` to ensure proper specificity ordering.
        `,
      },
    },
  },
}

/**
 * Base styles for fonts, borders, and defaults.
 */
export const BaseDefaults: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-semibold">Base Defaults</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Foundational styles applied globally.
        </p>

        <div className="space-y-6">
          {/* Font */}
          <div>
            <h4 className="mb-2 font-medium">Inter Font Family</h4>
            <div className="bg-muted/30 space-y-1 rounded-md border p-4">
              <p className="font-normal">Regular (400)</p>
              <p className="font-medium">Medium (500)</p>
              <p className="font-semibold">Semibold (600)</p>
              <p className="font-bold">Bold (700)</p>
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              Fallbacks: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI,
              Roboto...
            </p>
          </div>

          {/* Border & Outline */}
          <div>
            <h4 className="mb-2 font-medium">Border & Outline Defaults</h4>
            <div className="flex gap-4">
              <div className="flex size-24 items-center justify-center rounded-md border text-xs">
                border-border
              </div>
              <button className="flex size-24 items-center justify-center rounded-md border text-xs outline-2 outline-offset-2 focus:outline">
                Focus me
              </button>
            </div>
            <pre className="bg-muted mt-2 overflow-x-auto rounded-md p-4 text-xs">
              {`* {
  @apply border-border outline-ring/50;
}
body {
  @apply bg-background text-foreground;
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Base defaults ensure consistent styling across your entire application:

- **Inter font** as the primary typeface with comprehensive fallbacks
- **Border color** defaults to \`--border\` theme variable
- **Outline** defaults to \`--ring\` with 50% opacity for focus states
- **Body** uses theme \`--background\` and \`--foreground\` colors
        `,
      },
    },
  },
}

/**
 * Complete overview of all base styles features.
 */
export const Overview: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="from-primary/10 via-background to-secondary/10 rounded-lg border bg-linear-to-br p-6">
        <h2 className="mb-2 text-xl font-bold">📦 Base Styles</h2>
        <p className="text-muted-foreground">
          Essential CSS foundation for TungShadcn components
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">🎨 Styling</h3>
          <ul className="text-muted-foreground space-y-1 text-sm">
            <li>• Inter font with fallbacks</li>
            <li>• Custom thin scrollbar</li>
            <li>• Theme-aware borders & outlines</li>
            <li>• Background shorthand utility</li>
          </ul>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">📱 Mobile</h3>
          <ul className="text-muted-foreground space-y-1 text-sm">
            <li>• Safe area padding/margin</li>
            <li>• Safe area heights</li>
            <li>• Edge-to-edge support</li>
            <li>• Notch-aware layouts</li>
          </ul>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">🔧 Utilities</h3>
          <ul className="text-muted-foreground space-y-1 text-sm">
            <li>
              • <code className="text-xs">.no-scrollbar</code> - Hidden
              scrollbar
            </li>
            <li>
              • <code className="text-xs">.popover-content-width-full</code>
            </li>
            <li>
              • <code className="text-xs">bgs-*</code> - Background shorthand
            </li>
          </ul>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">📁 Files</h3>
          <ul className="text-muted-foreground space-y-1 text-sm">
            <li>
              • <code className="text-xs">styles/base.css</code>
            </li>
            <li>
              • <code className="text-xs">styles/components.css</code>
            </li>
            <li>
              • <code className="text-xs">styles/custom-utilities.css</code>
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
        <h4 className="mb-2 font-medium text-green-900 dark:text-green-100">
          ✅ Recommended
        </h4>
        <p className="text-sm text-green-800 dark:text-green-200">
          This package is recommended for all projects using TungShadcn
          components. It provides the foundational styles that many components
          depend on.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Complete overview of all features included in the base-styles package.",
      },
    },
  },
}
