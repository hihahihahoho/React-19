# InputTag Component Documentation

## Overview

The InputTag component lets users enter and manage multiple tags or keywords within a single text field. It supports both free-text entry (default mode) and selection-only mode from a predefined list. It also provides built-in tag history management (for undo/redo), duplicate prevention (configurable), and rich integrations with form libraries via InputTagForm. For styling and layout control, it leverages FormComposition – please refer to `form-composition.md` for full details.

> **IMPORTANT**: When integrating into forms, use the `InputTagForm` wrapper to automatically handle schema validation, clearing behavior, and required field indication.

## Import

```typescript
import { InputTag, type InputTagProps } from "@/components/ui/input/input-tag"
import {
  SelectItems,
  SelectGroup,
} from "@/components/ui/select/select-interface"
```

## Props Explanation

The InputTag component extends standard input props with additional properties:

| Prop                 | Type                         | Default        | Description                                                            |
| -------------------- | ---------------------------- | -------------- | ---------------------------------------------------------------------- |
| `options`            | SelectItems[] \| SelectGroup | `[]`           | List of suggestions for tag selection.                                 |
| `value`              | `string[]`                   | `undefined`    | Controlled array of tags.                                              |
| `defaultValue`       | `string[]`                   | `[]`           | Initial tags for uncontrolled usage.                                   |
| `onValueChange`      | `(value: string[]) => void`  | `undefined`    | Callback when tags change.                                             |
| `allowDuplicates`    | `boolean`                    | `false`        | If `true`, allows duplicate tags.                                      |
| `triggerKeys`        | `string[]`                   | `[",", "Tab"]` | Keys that trigger tag creation from the input.                         |
| `initialState`       | `React.ReactNode`            | `undefined`    | Content shown before searching (e.g. default suggestions).             |
| `minCharToSearch`    | `number`                     | `0`            | Minimum characters required before showing suggestions.                |
| `formComposition`    | `FormCompositionProps`       | `undefined`    | Styling and layout options (see `form-composition.md`).                |
| `badgeProps`         | `BadgeProps`                 | `undefined`    | Properties for styling each tag badge.                                 |
| `customDisplayValue` | `SelectItems[]`              | `undefined`    | Custom display values to override the default tag labels.              |
| `mode`               | `"default" \| "select"`      | `"default"`    | Defines whether the user can type freely or only select provided tags. |
| `disabled`           | `boolean`                    | `false`        | Disables the tag input.                                                |
| `onUndo` / `onRedo`  | `() => void`                 | `undefined`    | Callbacks for custom undo/redo actions.                                |

Additionally, the component supports all standard HTML input attributes and integrates with history management hooks for tag edits.

## Example Usage

### As a Standalone Component

```tsx
<InputTag
  placeholder="Enter tags..."
  options={[
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
  ]}
  formComposition={{
    label: "Technologies",
    description: "Type to add or select tags.",
  }}
  onValueChange={(tags) => console.log("Tags updated:", tags)}
/>
```

### For Form Integration

When used within a form, wrap the component with `InputTagForm`:

```tsx
import { InputTagForm } from "@/components/ui/input/input-tag-form"
;<InputTagForm
  control={form.control}
  name="skills"
  options={[
    { value: "react", label: "React" },
    { value: "typescript", label: "TypeScript" },
    { value: "node", label: "Node.js" },
  ]}
  formComposition={{
    label: "Skills",
    description: "Enter or select your technical skills.",
  }}
  placeholder="Enter skills..."
/>
```

## Key Features

1. **Dual Mode Operation**: Supports free text entry or selection-only mode.
2. **History Management**: Provides undo (Ctrl+Z) and redo (Ctrl+Y or Ctrl+Shift+Z) for tag changes.
3. **Duplicate Handling**: Optionally prevents duplicate tags.
4. **Rich Tag Display**: Uses badges (with customizable styles) to display tags.
5. **Integrated Clearing Behavior**: When the clear action is triggered, the tag list resets automatically via `formComposition.onClear`.

## Option Formatting

Options can be simple or grouped:

```tsx
// Simple options
const fruitOptions: SelectItems[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
]

// Grouped options
const foodOptions: SelectGroup[] = [
  {
    heading: "Fruits",
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
    ],
  },
  {
    heading: "Vegetables",
    options: [
      { value: "carrot", label: "Carrot" },
      { value: "broccoli", label: "Broccoli" },
    ],
  },
]
```

## Best Practices

- **Always Read Form Composition Docs**: For proper styling and layout, refer to `form-composition.md`.
- **Use InputTagForm for Forms**: Leverage `InputTagForm` to automatically wire form validation and required field logic.
- **Configure Trigger Keys Thoughtfully**: Adjust `triggerKeys` based on user expectations (default is comma and Tab).
- **Test Both Modes**: Verify behavior in both "default" (free text) and "select" (predefined options) modes.
- **Leverage Custom Display**: Use `customDisplayValue` if you need to show different content than the stored tag values.

```

```
