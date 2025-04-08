# Form Composition Component Documentation

## Overview

FormComposition is a versatile wrapper component that provides consistent styling, layout, and functionality for form controls in React applications. It serves as the foundation for Input, InputTag, DatePicker, Select, MultiSelect, InputAutoComplete and other form components.

> **IMPORTANT**: FormComposition is typically used internally by form control components rather than directly. When working with these components (like InputForm, SelectForm, etc.), you can pass formComposition props to customize their appearance and behavior.

## Import

```typescript
import {
  FormComposition,
  type FormCompositionProps,
} from "@/components/ui/form-composition"
```

## Props Explanation

| Prop                     | Type                                                   | Default    | Description                                                   |
| ------------------------ | ------------------------------------------------------ | ---------- | ------------------------------------------------------------- |
| **Styling**              |
| `variant`                | "default" \| "white" \| "ghost" \| "empty" \| "inline" | "default"  | Controls the visual style of the form control.                |
| `size`                   | "sm" \| "default" \| "lg"                              | "default"  | Determines the size/padding of the form control.              |
| `className`              | string                                                 | undefined  | Additional CSS classes for custom styling.                    |
| **Content & Layout**     |
| `label`                  | React.ReactNode                                        | undefined  | Text or component displayed as the form control's label.      |
| `labelPosition`          | "vertical" \| "horizontal"                             | "vertical" | Controls label placement - above or beside input.             |
| `description`            | React.ReactNode                                        | undefined  | Help text displayed below the form control.                   |
| `subDescription`         | React.ReactNode                                        | undefined  | Secondary description shown below the main description.       |
| **Error Handling**       |
| `showErrorMsg`           | boolean                                                | true       | Controls whether validation error messages are displayed.     |
| `customError`            | React.ReactNode                                        | undefined  | Custom error message to override validation error.            |
| **Visual Elements**      |
| `iconLeft`               | string \| React.ReactNode                              | undefined  | Icon displayed inside the input on the left side.             |
| `iconRight`              | string \| React.ReactNode                              | undefined  | Icon displayed inside the input on the right side.            |
| `prefix`                 | React.ReactNode                                        | undefined  | Content before the value; clicking focuses input.             |
| `suffix`                 | React.ReactNode                                        | undefined  | Content after the value; clicking focuses input.              |
| `prefixOutside`          | React.ReactNode                                        | undefined  | Content outside the input container before it.                |
| `suffixOutside`          | React.ReactNode                                        | undefined  | Content outside the input container after it.                 |
| `prefixNotFocusInput`    | React.ReactNode                                        | undefined  | Content before value that doesn't trigger input focus.        |
| `suffixNotFocusInput`    | React.ReactNode                                        | undefined  | Content after value that doesn't trigger input focus.         |
| **Interaction**          |
| `inputClear`             | boolean                                                | false      | Shows clear button (×) when input has a value.                |
| `clearWhenNotFocus`      | boolean                                                | false      | Shows clear button only when input is focused.                |
| `onClear`                | () => void                                             | undefined  | Called when clear button is clicked.                          |
| `onClick`                | (e: React.MouseEvent) => void                          | undefined  | Called when clicking the container.                           |
| `onFormCompositionClick` | () => void                                             | undefined  | Alternative click handler for the component.                  |
| **Advanced**             |
| `layout`                 | { leftColClass: string; rightColClass: string }        | undefined  | Custom layout classes for horizontal orientation.             |
| **DO NOT SET DIRECTLY**  |
| `disabled`               | boolean                                                | false      | **DO NOT SET DIRECTLY**. Set on parent component instead.     |
| `readonly`               | boolean                                                | false      | **DO NOT SET DIRECTLY**. Set on parent component instead.     |
| `isFocused`              | boolean                                                | false      | **DO NOT SET DIRECTLY**. Managed internally by components.    |
| `hasValue`               | boolean                                                | false      | **DO NOT SET DIRECTLY**. Managed internally by components.    |
| `isMinHeight`            | boolean                                                | false      | **DO NOT SET DIRECTLY**. Internal constraint management.      |
| `asChild`                | boolean                                                | false      | **DO NOT SET DIRECTLY**. Internal Radix UI property.          |
| `focusWithin`            | boolean                                                | false      | **DO NOT SET DIRECTLY**. Internal focus behavior.             |
| `styleButton`            | boolean                                                | false      | **DO NOT SET DIRECTLY**. Internal styling flag.               |
| `requiredSymbol`         | boolean                                                | false      | **DO NOT SET DIRECTLY**. Controlled by Zod schema validation. |

## Example Usage

```tsx
<InputForm
  control={form.control}
  name="email"
  type="email"
  formComposition={{
    label: "Email Address",
    description: "We'll never share your email with anyone else",
    iconLeft: <Mail className="h-4 w-4" />,
    suffix: "@example.com",
  }}
/>
```

## Key Features

1. **Consistent Layout**: Provides uniform horizontal or vertical layouts for form controls
2. **Built-in Error Display**: Handles showing validation errors from React Hook Form
3. **Rich Decoration**: Supports icons, prefixes, suffixes, both inside and outside the input
4. **Clear Button**: Automatic input clearing functionality with customizable behavior
5. **Description Text**: Support for help text, error messages, and sub-descriptions
6. **Flexible Styling**: Multiple variants and sizes for different UI requirements

## Important Note

> When using form components with Zod schema validation, do not set the `requiredSymbol` prop manually. This property is automatically controlled by the component based on the Zod schema's field requirements.

## Best Practices

1. Use `labelPosition="horizontal"` for forms with more space and better label-field alignment
2. Provide descriptive help text using the `description` prop
3. Use `suffixNotFocusInput` for interactive elements like buttons inside the input container
4. Use `suffixOutside` for elements that should appear outside the input container
5. Set appropriate `variant` and `size` to match your application's design system
6. **Never set state modifier props directly** (all props in the "DO NOT SET DIRECTLY" section)
