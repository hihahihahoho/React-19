# Selection Group Component Documentation

## Overview

The SelectionGroup component provides consistent layout and styling for selection controls like checkboxes and radio buttons. It handles the relationship between the control and its label, ensuring proper spacing, alignment, and accessibility.

## Import

```typescript
import { SelectionGroup } from "@/components/ui/selection-controls/selection-group"
```

## Props Explanation

| Prop        | Type                | Default   | Description                                              |
| ----------- | ------------------- | --------- | -------------------------------------------------------- |
| `control`   | React.ReactNode     | undefined | The form control to be rendered (Checkbox or RadioGroup) |
| `variant`   | "default" \| "card" | "default" | Visual style variant                                     |
| `children`  | React.ReactNode     | undefined | Content to display as the label                          |
| `className` | string              | undefined | Additional CSS classes                                   |

All standard HTML label attributes are also supported.

## Example Usage

### Default Variant

```tsx
<SelectionGroup control={<Checkbox />}>
  Accept terms and conditions
</SelectionGroup>
```

### Card Variant

```tsx
<SelectionGroup variant="card" control={<Checkbox />}>
  <div>
    <h3 className="font-medium">Premium Plan</h3>
    <p className="text-muted-foreground text-sm">
      Advanced features with priority support
    </p>
  </div>
</SelectionGroup>
```

## Variants

The SelectionGroup component has two variants:

- `default`: Standard layout with control on the left and label on the right
- `card`: Enhanced layout with a border and additional styling when selected

## Rich Content Labels

SelectionGroup supports rich content as labels, allowing for complex layouts:

```tsx
<SelectionGroup control={<Checkbox />}>
  <div className="flex items-center gap-2">
    <span className="font-medium">Premium Plan</span>
    <Badge variant="blue">Recommended</Badge>
  </div>
</SelectionGroup>
```

## Key Features

1. **Consistent Layout**: Maintains proper spacing between controls and labels
2. **Accessibility Support**: Ensures proper labeling for screen readers
3. **Disabled State Handling**: Properly styles both control and label when disabled
4. **Visual Feedback**: Card variant provides enhanced visual feedback for selected state
5. **Label Flexibility**: Supports simple text or complex React components as labels

## Best Practices

1. Always provide clear, descriptive label content for accessibility
2. Use the card variant for more prominent selection options
3. Consider using grid layouts for organizing multiple selection groups
4. Maintain consistent spacing between multiple selection groups
5. Group related selection controls using appropriate container elements
