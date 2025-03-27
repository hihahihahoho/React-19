# MultiSelect Component Documentation

## Overview

The MultiSelect component provides a flexible, searchable dropdown that lets users select multiple options. It supports badge grouping of selected items, clear functionality, and integrates with FormComposition for consistent styling and layout. For form integration, use the `MultiSelectForm` wrapper, which automatically handles schema validation and clearing behavior.

> **IMPORTANT**: Before using the MultiSelect or MultiSelectForm components, please read the `form-composition.md` documentation to understand the styling and behavior based on your Zod schema. Also, ensure that the proper option format (flat list or grouped) is provided.

## Import

```typescript
import {
  MultiSelect,
  type MultiSelectProps,
} from "@/components/ui/select/multiselect"
import { MultiSelectForm } from "@/components/ui/select/multiselect-form"
```

## Props Explanation

The MultiSelect component accepts all standard HTML button attributes, plus these custom props:

| Prop                 | Type                                                       | Default                 | Description                                                                                    |
| -------------------- | ---------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| `placeholder`        | string \| React.ReactNode                                  | "Select"                | Text shown when no value is selected.                                                          |
| `placeholderColor`   | string                                                     | "text-muted-foreground" | CSS class for the placeholder text color.                                                      |
| `options`            | SelectItems[] \| SelectGroup[]                             | []                      | Data to display as selectable options.                                                         |
| `value`              | string[] \| null                                           | undefined               | Controlled array of selected option values.                                                    |
| `defaultValue`       | string[]                                                   | []                      | Initial selection when uncontrolled.                                                           |
| `disabled`           | boolean                                                    | false                   | Disables the component.                                                                        |
| `readonly`           | boolean                                                    | false                   | Makes the component read-only.                                                                 |
| `formComposition`    | FormCompositionProps                                       | undefined               | Styling and behavior settings (e.g. clear button, required symbol); see `form-composition.md`. |
| `selectCommandProps` | SelectCommandProps & Partial<SelectCommandVirtualizeProps> | undefined               | Props for the dropdown command list.                                                           |
| `onValueChange`      | (value: string[]) => void                                  | undefined               | Called when the selected values change.                                                        |
| `showClear`          | boolean                                                    | undefined               | Whether to show the clear (reset) button.                                                      |
| `customDisplayValue` | SelectItems[]                                              | undefined               | Custom display for selected values.                                                            |
| `bagdeGroupProps`    | Omit<OverflowBadgeGroupProps, "items">                     | undefined               | Props for configuring the badge display of selected items.                                     |
| `variant`            | "default" \| "button"                                      | "default"               | Determines whether the control appears as a standard input or as a button variant.             |

Additionally, in the MultiSelectForm wrapper, the component automatically sets the clear logic through the `onClear` callback and calculates the `requiredSymbol` based on the Zod schema – no extra configuration is needed for these behaviors.

## Example Usage

### As a Standalone Component

```tsx
<MultiSelect
  placeholder="Select your favorite fruits"
  options={[
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" },
  ]}
  formComposition={{
    label: "Favorite Fruits",
    description: "Select one or more fruits",
    // When the clear button is clicked, the selected values will be reset automatically.
  }}
  onValueChange={(values) => console.log(values)}
/>
```

### Form Integration Example

```tsx
<MultiSelectForm
  control={form.control}
  name="fruits"
  options={[
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" },
  ]}
  formComposition={{
    label: "Favorite Fruits",
    description: "Select one or more fruits",
    // The onClear function will automatically set the field value to an empty array.
  }}
/>
```

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

## Key Features

1. **Badge Grouping**: Selected items are displayed as badges with built-in removal functionality.
2. **Clear Button**: When in a form, the clear button automatically resets the selection.
3. **Flexible Options**: Supports both a flat list of items and grouped options.
4. **Form Integration**: MultiSelectForm handles schema-based required symbols and clearing logic.
5. **Custom Display**: Option to override the display of selected items using `customDisplayValue`.

## Best Practices

- **Read Documentation**: Ensure you read `form-composition.md` to understand how styling and form behaviors are applied.
- **Consistent Option Format**: Provide properly structured options (either as a flat array or group them using headings) for clarity.
- **Use MultiSelectForm for Forms**: For better integration with React Hook Form and automatic validation, always use the MultiSelectForm wrapper.
- **Test Clear Functionality**: Verify that the clear button resets the selection as expected.
