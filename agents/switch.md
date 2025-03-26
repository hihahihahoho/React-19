# Switch Component Documentation

## Overview

The Switch component provides a toggle control that allows users to turn options on or off. Built on Radix UI primitives, it integrates with FormComposition for styling and React Hook Form for validation.

## Import

```typescript
import { Switch } from "@/components/ui/selection-controls/switch"
import { SwitchForm } from "@/components/ui/selection-controls/switch-form"
```

## Props Explanation

### Switch Props

| Prop              | Type                       | Description                                     |
| ----------------- | -------------------------- | ----------------------------------------------- |
| `checked`         | boolean                    | The controlled state of the switch              |
| `defaultChecked`  | boolean                    | The default state when uncontrolled             |
| `onCheckedChange` | (checked: boolean) => void | Called when the switch state changes            |
| `disabled`        | boolean                    | When true, prevents interaction with the switch |

Plus all standard HTML attributes.

### SwitchForm Props

| Prop              | Type                 | Description                                     |
| ----------------- | -------------------- | ----------------------------------------------- |
| `formComposition` | FormCompositionProps | Styling and layout options for the form control |

Plus all React Hook Form ControllerProps except "render".

## Example Usage

```tsx
// Basic usage
<Switch />

// Controlled usage
<Switch
  checked={enabled}
  onCheckedChange={setEnabled}
/>

// Disabled state
<Switch disabled defaultChecked />
```

## Form Integration

> **IMPORTANT**: SwitchForm uses FormComposition for styling, so you must read `form-composition.md` documentation before using it.

```tsx
<SwitchForm
  control={form.control}
  name="notifications"
  formComposition={{
    label: "Enable Notifications",
    description: "Receive updates about new features and announcements",
    labelPosition: "horizontal",
  }}
/>
```

## Key Features

1. **Visual Feedback**: Clear visual indication of on/off states
2. **Form Integration**: Seamless React Hook Form integration
3. **Accessibility**: Built on Radix UI primitives for robust accessibility
4. **Customization**: Supports custom styling through className prop
5. **Auto Required Symbol**: Displays required indicator (\*) based on Zod schema

## Best Practices

1. **Provide Clear Labels**: Always use descriptive labels that clearly indicate what the switch controls
2. **Use Horizontal Layout**: For better readability, use `labelPosition: "horizontal"` in formComposition
3. **Include Descriptions**: Add helpful descriptions to explain the implications of toggling the switch
4. **Default States**: Set sensible default states that align with user expectations
5. **Group Related Switches**: Keep related switches close together for logical organization
