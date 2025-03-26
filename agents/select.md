# Select Component Documentation

## Overview

The Select component provides a dropdown selector with search capabilities, grouping options, and form integration. It integrates with FormComposition for styling and React Hook Form for validation.

> **IMPORTANT**: Before using the Select component, it is essential to read both the `form-composition.md` and `form.md` documentation.

## Import

```typescript
import { Select, type SelectProps } from "@/components/ui/select/select"
import { SelectForm } from "@/components/ui/select/select-form"
import {
  SelectItems,
  SelectGroup,
} from "@/components/ui/select/select-interface"
```

## Props Explanation

| Prop                 | Type                                             | Default   | Description                              |
| -------------------- | ------------------------------------------------ | --------- | ---------------------------------------- |
| `placeholder`        | string \| React.ReactNode                        | undefined | Text displayed when no value is selected |
| `options`            | SelectItems[] \| SelectGroup[]                   | []        | Options to display in dropdown           |
| `value`              | string \| undefined                              | undefined | Controlled value                         |
| `defaultValue`       | string \| undefined                              | undefined | Uncontrolled initial value               |
| `disabled`           | boolean                                          | false     | Disables the select component            |
| `readonly`           | boolean                                          | false     | Makes the select read-only               |
| `formComposition`    | FormCompositionProps                             | undefined | Styling and layout options               |
| `onValueChange`      | (value: string \| undefined) => void             | undefined | Called when selection changes            |
| `selectCommandProps` | { loading?: boolean; showSearch?: boolean; ... } | undefined | Props for internal command component     |

## Example Usage

```tsx
<Select
  placeholder="Select a fruit"
  options={[
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" },
  ]}
  formComposition={{
    label: "Favorite Fruit",
    description: "Choose your preferred fruit",
  }}
/>
```

## Form Integration

```tsx
<SelectForm
  control={form.control}
  name="country"
  options={countryOptions}
  formComposition={{
    label: "Country",
    description: "Select your country",
  }}
  placeholder="Choose a country"
/>
```

## Key Features

1. **FormComposition Integration**: Leverages all FormComposition styling and layout options
2. **Value Change Handling**: Simplified value handling with `onValueChange`
3. **Search Capability**: Built-in searching through options with filtering
4. **Option Grouping**: Support for logical grouping of related options
5. **Clear Button**: Optional clear functionality with `inputClear` prop in formComposition

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

1. **Read both form.md and form-composition.md thoroughly** to understand all available options
2. Use `onValueChange` instead of handling native events for simpler value handling
3. Group related options using the SelectGroup format for better organization
4. Use `SelectForm` with React Hook Form for seamless form state management and validation
