````markdown
# General Design System Guidelines

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

### Import Patterns

> **CRITICAL**: Agents/LMs must strictly follow the import patterns shown in documentation. If imports aren't explicitly declared, default to using the shadcn import structure.

```tsx
// CORRECT - Using documented import paths
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input/input"
import { SelectForm } from "@/components/ui/select/select-form"

// INCORRECT - Using incorrect paths
import { Button } from "@/ui/button"
import { Input } from "@/components/form/input"
```
````

When documentation doesn't specify imports, follow shadcn conventions:

```tsx
import { ComponentName } from "@/components/ui/component-name"
```

### Implementation Flexibility

While visual fidelity is critical, you may:

- Implement custom UX logic where needed for better user experience
- Suggest alternative interaction patterns when they improve accessibility or usability
- Extend component functionality as long as visual appearance is preserved

> **IMPORTANT**: The final implementation should be visually indistinguishable from the provided design mockups, with every detail of spacing, color, typography, and interaction preserved.
