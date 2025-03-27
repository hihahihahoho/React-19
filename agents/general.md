# General Design System Guidelines

### Code Comments

> **CRITICAL**: DO NOT write comments in your code unless absolutely essential. Comments should be used only in exceptional cases where complex logic cannot be understood from the code itself. Strive for self-documenting code that requires no explanation.

## Overview

This document provides essential guidelines for AI agents and ML systems working with our React UI component library. **Always strictly adhere to the visual design presented in user-provided images or mockups**.

> **CRITICAL**: Visual fidelity to the provided designs is the highest priority. Match the exact appearance, spacing, and interaction patterns shown.

## Visual Design Principles

1. **Respect Visual Hierarchy**: Maintain the exact visual weight, spacing, and alignment shown in designs
2. **Color Consistency**: Follow the color system precisely - grey/muted colors indicate disabled states
3. **Label Placement**: Position labels exactly as shown (above, beside, or within inputs as designed)
4. **Box Grouping**: Maintain the visual grouping of related elements as shown in mockups

## Key Visual Elements to Preserve

- **Input States**: Disabled (grey)
- **Spacing Patterns**: Maintain consistent spacing between form controls as shown
- **Typography Scale**: Use the exact font sizes, weights, and styles from mockups
- **Icon Usage**: Use icons only in positions shown in the designs, with correct sizing
- **Component Boundaries**: Respect the visual boundaries between components

## Implementation Guidelines

### Documentation Priority

> **CRITICAL**: Before implementing any component, agents MUST first read the corresponding documentation file in the `agents` folder matching the component name. Do not consult other documentation or implementation details unless explicitly specified or as a last resort.

```tsx
// Example: When implementing Button component
// FIRST: Read e:\work-out\react-19\agents\button.md for specific guidelines
// DO NOT examine existing button implementations unless directed or as last resort
```

### Import Patterns

> **CRITICAL**: Agents/LMs must strictly follow the import patterns shown in documentation. If imports aren't explicitly declared, default to using the shadcn import structure.

```tsx
// CORRECT - Using documented import paths
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"

// INCORRECT - Using incorrect paths
import { ZodSchemaProvider } from "@/components/ui/form/form"
```

When documentation doesn't specify imports, follow shadcn conventions:

```tsx
import { ComponentName } from "@/components/ui/component-name"
```

### Component Styling Integrity

> **CRITICAL**: Do not modify component `className` props unless specifically instructed to do so. The default styling system must remain intact.

```tsx
// CORRECT - Preserving original className
<Button className="existing-class">Submit</Button>

// INCORRECT - Modifying without instruction
<Button className="my-custom-class">Submit</Button>
```

### Layout Implementation

> **IMPORTANT**: Use appropriate Tailwind spacing utilities based on layout context:
>
> - Use `gap-x` and `gap-y` for flex layouts, grid layouts, and rows
> - Use `space-x-` and `space-y-` for regular block element flows

```tsx
// CORRECT - Using gap with flex/grid
<div className="flex gap-4">
  <Input />
  <Select />
  <Button />
</div>

<div className="grid grid-cols-2 gap-4">
  <Card />
  <Card />
</div>

// CORRECT - Using space with regular flow
<div className="space-y-4">
  <Input />
  <Select />
  <Button />
</div>

// INCORRECT - Mixing approaches inappropriately
<div className="flex space-x-4">
  <Input />
  <Select />
</div>
```

### Responsive Design

> **REQUIRED**: All implementations must automatically incorporate responsive design patterns using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, etc.)

```tsx
// CORRECT - With responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// INCORRECT - No responsive considerations
<div className="grid grid-cols-2 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### Implementation Flexibility

While visual fidelity is critical, you may:

- Implement custom UX logic where needed for better user experience
- Suggest alternative interaction patterns when they improve accessibility or usability
- Extend component functionality as long as visual appearance is preserved

> **IMPORTANT**: The final implementation should be visually indistinguishable from the provided design mockups, with every detail of spacing, color, typography, and interaction preserved.
