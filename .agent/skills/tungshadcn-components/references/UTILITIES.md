# Utilities & Misc Components

TungShadcn includes several utility components for common UI patterns.

---

## Copy & CopyButton

The `Copy` component uses a **render prop pattern** to share clipboard state.

### Usage

```tsx
import { Copy } from "@/components/ui/copy"
import { CopyButton } from "@/components/ui/copy-button"

// Simple pre-styled button with toast feedback
<CopyButton content="Text to copy" />

// Custom UI using render prop
<Copy content="https://example.com">
  {(state) => (
    <span>
      {state === "copied" ? "Saved!" : "Click to copy"}
    </span>
  )}
</Copy>
```

### States

- `idle`: Initial state.
- `copying`: Briefly active during the copy operation.
- `copied`: Active for `resetDelay` (default 2s) after success.
- `error`: Active if copy fails.

---

## Sticky

A wrapper that detects when an element becomes "stuck" using IntersectionObserver.

### Usage

```tsx
import { Sticky } from "@/components/ui/sticky"

;<Sticky
  direction="top"
  stickyClassName="bg-white/80 backdrop-blur-md shadow-md"
  onStickyChange={(isSticky) => console.log(isSticky)}
>
  <nav>My Sticky Header</nav>
</Sticky>
```

- Tracks `isSticky` state automatically.
- Adds `data-sticky` attribute when stuck.
- Perfect for changing styles (background, padding, etc.) when the header sticks.

---

## SVGInline

Dynamically loads SVG files and renders them inline to allow styling via CSS (`currentColor`).

### Usage

```tsx
import { SVGInline } from "@/components/ui/svg-inline"

;<SVGInline src="/images/icons/my-icon.svg" className="text-primary size-6" />
```

- Includes a built-in `Skeleton` loader while fetching the SVG.
- Automatically adds a CSS class based on filename (e.g., `icon-svg-my-icon`).

---

## GlassIcon

A glassmorphism-styled icon container.

### Usage

```tsx
import { GlassIcon } from "@/components/ui/glass-icon"
import { Mail } from "lucide-react"

;<GlassIcon variant="blue">
  <Mail />
</GlassIcon>
```

---

## EmptyState

Consistent placeholder for empty data scenarios.

### Usage

```tsx
import { EmptyState } from "@/components/ui/empty-state"

;<EmptyState title="No items found" description="Try adjusting your filters">
  <Button>Clear Filters</Button>
</EmptyState>
```

---

## Typography

Unified typography components for consistent text styling.

### Usage

```tsx
import { Typography } from "@/components/ui/typography"

<Typography variant="h1">Page Title</Typography>
<Typography variant="p" className="text-muted-foreground">Description</Typography>
```
