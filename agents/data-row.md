# DataRow Component Documentation

## Overview

The DataRow components provide a structured layout for displaying information in a label-value format. They're commonly used in details pages, profiles, settings sections, and anywhere that requires displaying structured information with a clear label-value relationship.

## When to use

- When you see content organized in vertical key-value pairs
- When data is structured in a two-column format with consistent labels and values
- When information needs consistent horizontal alignment across multiple rows
- When multiple related data points need to be grouped with visual separation
- When UI displays form-like data in read-only presentation mode
- When content requires responsive adjustment between smaller and larger screens
- When labels and values need different styling treatments (muted labels with prominent values)

## Import

```typescript
import {
  DataRow,
  DataRowLabel,
  DataRowValue,
  DataRowWrapper,
} from "@/components/ui/data-row"
```

## Components

The DataRow system consists of four components: `DataRowWrapper` (container for grouping rows), `DataRow` (individual row with grid layout), `DataRowLabel` (left-side label component), and `DataRowValue` (right-side value component). All components accept standard HTML div attributes via `React.ComponentProps<"div">`.

## Example Usage

### Basic Example

```tsx
import {
  DataRow,
  DataRowLabel,
  DataRowValue,
  DataRowWrapper,
} from "@/components/ui/data-row"

export function UserProfile() {
  return (
    <DataRowWrapper>
      <DataRowLabel>
        <Mail className="size-4" />
        <span>Email</span>
      </DataRowLabel>
      <DataRow>
        <DataRowLabel>Email</DataRowLabel>
        <DataRowValue>john@example.com</DataRowValue>
      </DataRow>
    </DataRowWrapper>
  )
}
```

## Best Practices

- **Use Within a Wrapper**: Always wrap DataRow components in a DataRowWrapper for proper styling and border handling
- **Consistent Structure**: Maintain consistent label-value structure throughout your application
- **Responsive Considerations**: The component is responsive by default, with labels taking 5/12 columns on mobile and 4/12 on larger screens
- **Custom Styling**: Use the className prop to add custom styling for specific use cases
- **Long Content**: For long values, consider using className="break-all" on DataRowValue to prevent overflow
- **Complex Content**: DataRowValue can contain complex content including rich text, components, badges, or interactive elements
- **Interactive Elements**: When adding buttons or links, use appropriate styling and accessibility attributes
- **Grouping**: Use semantic grouping with headings before DataRowWrapper sections to organize related information
