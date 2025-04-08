# Button Component Documentation

## Overview

The Button component provides a flexible, accessible button with multiple variants, sizes, and states. It supports icons, loading states, and compositional patterns using Radix UI's Slot.

## Import

```typescript
import { Button } from "@/components/ui/button"
```

## Props Explanation

| Prop        | Type                                                                        | Default   | Description                                                 |
| ----------- | --------------------------------------------------------------------------- | --------- | ----------------------------------------------------------- |
| `variant`   | "default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link" | "default" | Visual style variant                                        |
| `size`      | "xs" \| "sm" \| "default" \| "lg"                                           | "default" | Size of the button                                          |
| `iconOnly`  | boolean                                                                     | false     | When true, removes padding for icon-only buttons            |
| `isRounded` | boolean                                                                     | false     | When true, applies fully rounded corners                    |
| `disabled`  | boolean                                                                     | false     | Disables the button                                         |
| `isLoading` | boolean                                                                     | false     | Shows loading spinner and disables the button               |
| `iconLeft`  | string \| React.ReactNode                                                   | undefined | Content to display before button text                       |
| `iconRight` | string \| React.ReactNode                                                   | undefined | Content to display after button text                        |
| `asChild`   | boolean                                                                     | false     | Merges props onto child element instead of rendering button |
| `type`      | "button" \| "submit" \| "reset"                                             | "button"  | HTML button type attribute                                  |

Plus all standard HTML button attributes (except "disabled" which is handled differently).

> **IMPORTANT**: When `isLoading` is true, the button is automatically disabled and displays a spinner icon.

## Example Usage

```tsx
// Basic button
<Button>Click me</Button>

// Button with variant and size
<Button variant="destructive" size="lg">Delete</Button>

// Button with icon
<Button iconLeft={<Trash />}>Delete</Button>

// Loading state
<Button isLoading>Processing...</Button>

// Icon-only button
<Button iconOnly size="sm" iconLeft={<Plus />} aria-label="Add item" />

// As child (composition)
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```

## Button Variants

- `default`: Primary action, solid background
- `destructive`: Dangerous actions (delete, remove), red background
- `outline`: Secondary actions, bordered with transparent background
- `secondary`: Alternative actions, light background
- `ghost`: Subtle actions, transparent background until hovered
- `link`: Appears as text link with underline on hover

## Button Sizes

- `xs`: Extra small (h-6)
- `sm`: Small (h-8)
- `default`: Medium (h-9)
- `lg`: Large (h-10)

## Key Features

1. **Multiple Variants**: Six visual styles for different purposes
2. **Flexible Sizing**: Four size options from extra small to large
3. **Icon Support**: Optional icons before and/or after text
4. **Loading State**: Built-in loading spinner with auto-disable
5. **Composition**: Can wrap other elements via asChild prop
6. **Accessibility**: Follows best practices for button accessibility

## Best Practices

1. Use the appropriate variant for the action's importance
2. Include descriptive text for accessibility (or aria-label for icon-only buttons)
3. Use loading state for async actions to prevent multiple submissions
4. Match button size to surrounding UI elements
5. Keep button text concise and action-oriented
6. **DO NOT add custom classes to icons** when using `iconLeft` or `iconRight` props - spacing and sizing are automatically handled by the component
