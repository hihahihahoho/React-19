````markdown
# InputAutoComplete Component Documentation

## Overview

The InputAutoComplete component provides a searchable input field with dropdown suggestions. It supports two modes: free text with suggestions ("default") or strict selection from options ("select"). It integrates with FormComposition for styling and React Hook Form for form management.

> **IMPORTANT**: Before using InputAutoComplete, read both `form-composition.md` and `form.md` documentation.

## Import

```typescript
import {
  InputAutoComplete,
  type InputAutoCompleteProps,
} from "@/components/ui/input/input-auto-complete"
import { InputAutoCompleteForm } from "@/components/ui/input/input-auto-complete-form"
import {
  SelectItems,
  SelectGroup,
} from "@/components/ui/select/select-interface"
```
````

## Props Explanation

| Prop              | Type                           | Default   | Description                               |
| ----------------- | ------------------------------ | --------- | ----------------------------------------- |
| `options`         | SelectItems[] \| SelectGroup[] | []        | Options to display in dropdown            |
| `onValueChange`   | (value: string) => void        | undefined | Called when value changes                 |
| `onSearchChange`  | (value: string) => void        | undefined | Called when search term changes           |
| `value`           | string                         | undefined | Controlled value                          |
| `defaultValue`    | string                         | undefined | Uncontrolled initial value                |
| `placeholder`     | string                         | undefined | Text displayed when input is empty        |
| `initialState`    | React.ReactNode                | undefined | Content shown before search               |
| `loading`         | boolean                        | false     | Show loading state when fetching options  |
| `minCharToSearch` | number                         | 0         | Minimum characters before showing results |
| `mode`            | "default" \| "select"          | "default" | Behavior mode for selection               |
| `formComposition` | FormCompositionProps           | undefined | Styling and layout options                |
| `disabled`        | boolean                        | false     | Disables the component                    |
| `readonly`        | boolean                        | false     | Makes the component read-only             |

## Example Usage

```tsx
<InputAutoComplete
  placeholder="Search countries..."
  options={[
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "ca", label: "Canada" },
  ]}
  formComposition={{
    label: "Country",
    description: "Type or select your country",
  }}
/>
```

## Form Integration

```tsx
<InputAutoCompleteForm
  control={form.control}
  name="country"
  options={countryOptions}
  mode="select"
  formComposition={{
    label: "Country",
    description: "Select your country",
  }}
/>
```

## Key Features

1. **FormComposition Integration**: Leverages all FormComposition styling and layout options
2. **Dual Mode Support**: "default" for free text with suggestions, "select" for strict selection
3. **Search Capability**: Built-in searching and filtering of options
4. **Loading States**: Visual indicator when options are being fetched
5. **Option Grouping**: Support for logical grouping of related options
6. **Minimum Character Search**: Configure minimum characters before searching

## Best Practices

1. **Read both form.md and form-composition.md thoroughly** to understand all available options
2. Use `mode="default"` for search inputs with suggestions, `mode="select"` for dropdown selection
3. Provide appropriate `minCharToSearch` value to optimize search performance
4. Handle loading states properly when fetching options asynchronously
5. Use `InputAutoCompleteForm` with React Hook Form for seamless form validation
