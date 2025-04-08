# Checkbox Component Documentation

## Overview

The Checkbox component allows users to select one or multiple items from a list or toggle options on/off. It integrates with FormComposition for styling and React Hook Form for validation.

> **IMPORTANT**: Before using the Checkbox component, you must also read `selection-group.md` documentation as Checkbox is typically used within a SelectionGroup container.

## Import

```typescript
import { Checkbox } from "@/components/ui/selection-controls/checkbox"
import { CheckboxForm } from "@/components/ui/selection-controls/checkbox-form"
import { CheckboxGroupForm } from "@/components/ui/selection-controls/checkbox-group-form"
```

## Props Explanation

The Checkbox component extends RadixUI's CheckboxPrimitive.Root props:

| Prop              | Type                                          | Default   | Description                                       |
| ----------------- | --------------------------------------------- | --------- | ------------------------------------------------- |
| `checked`         | boolean \| "indeterminate"                    | undefined | Controls the checked state                        |
| `defaultChecked`  | boolean                                       | undefined | The default checked state when uncontrolled       |
| `disabled`        | boolean                                       | false     | When true, prevents interaction with the checkbox |
| `required`        | boolean                                       | false     | When true, indicates input is required            |
| `name`            | string                                        | undefined | The name of the checkbox                          |
| `value`           | string                                        | undefined | The value of the checkbox                         |
| `onCheckedChange` | (checked: boolean \| "indeterminate") => void | undefined | Called when the checked state changes             |
| `className`       | string                                        | undefined | Additional CSS classes                            |

## Example Usage

```tsx
<SelectionGroup control={<Checkbox />}>Accept terms and conditions</SelectionGroup>

<SelectionGroup control={<Checkbox defaultChecked />}>Subscribe to newsletter</SelectionGroup>

<SelectionGroup control={<Checkbox disabled />}>Premium feature (disabled)</SelectionGroup>
```

## Form Integration

```tsx
<CheckboxForm control={form.control} name="acceptTerms">
  I accept the terms and conditions
</CheckboxForm>
```

## Multiple Checkboxes

> **IMPORTANT**: When working with multiple related checkboxes, use the CheckboxGroupForm component for better organization and form handling. This component accepts both `formComposition` and `selectionGroup` props, so you **must read both `form-composition.md` and `selection-group.md`** before using it.

```tsx
<CheckboxGroupForm
  control={form.control}
  name="preferences"
  items={[
    { value: "email", label: "Email notifications" },
    { value: "sms", label: "SMS notifications" },
    { value: "push", label: "Push notifications" },
  ]}
  formComposition={{
    label: "Notification Preferences",
    description: "Select your preferred notification methods",
  }}
  selectionGroup={{
    variant: "card",
  }}
/>
```

## CheckboxGroupForm Props

| Prop              | Type                 | Default   | Description                                             |
| ----------------- | -------------------- | --------- | ------------------------------------------------------- |
| `items`           | ItemCheckboxType[]   | required  | Array of checkbox items with label and value            |
| `formComposition` | FormCompositionProps | undefined | Styling and layout options for the group container      |
| `selectionGroup`  | SelectionGroupProps  | undefined | Props applied to each SelectionGroup wrapper            |
| `className`       | string               | undefined | Additional CSS classes for the checkbox group container |

## Key Features

1. **State Support**: Standard, checked, indeterminate, and disabled states
2. **Custom Styling**: Easily customizable appearance through className prop
3. **Form Integration**: Seamless React Hook Form integration with CheckboxForm
4. **Accessibility**: Built on Radix UI primitives for robust accessibility

## Best Practices

1. **Read selection-group.md and form-composition.md thoroughly** to understand proper checkbox styling and layout
2. Always wrap individual checkboxes in a SelectionGroup for proper labeling
3. Use CheckboxGroupForm for groups of related checkboxes with a unified label
4. Provide clear, descriptive labels for each checkbox
5. Use the card variant for more prominent selection options

```

```
