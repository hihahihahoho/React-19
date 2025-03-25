# Input Component Documentation

## Overview

The Input component is a versatile form control for collecting user data through various input types. It provides rich functionality including form integration, validation, accessibility features, and extensive styling options through FormComposition.

> **IMPORTANT**: Before using the Input component, it is essential to read both the `form-composition.md` and `form.md` documentation. Input relies heavily on FormComposition for styling and layout, while InputForm integrates with React Hook Form through components defined in form.md.

## Import

```typescript
import { Input } from "@/components/ui/input/input"
import { InputForm } from "@/components/ui/input/input-form"
```

## Types

```typescript
// Core Types
export type OnValueChangeInput = React.ComponentProps<"input">["value"]
export type OnValueFileChangeInput = FileList | null

// Main Component Props
export interface InputProps extends React.ComponentProps<"input"> {
  formComposition?: FormCompositionProps // Styling and layout options (see form-composition.md)
  onValueChange?: (value: OnValueChangeInput) => void // Simplified value change handler
  onValueFileChange?: (value: OnValueFileChangeInput) => void // File input value handler
  // Inherits all standard HTML input attributes
}

// Form Integration Props
export interface InputFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControllerProps<TFieldValues, TName>,
    Omit<InputProps, "defaultValue" | "name"> {
  // React Hook Form controller props (see form.md)
}
```

## Basic Usage

```tsx
// Standard Input
<Input
  type="text"
  placeholder="Enter your name"
  formComposition={{
    label: "Full Name",
    description: "As it appears on your ID"
  }}
/>

// File Input
<Input
  type="file"
  accept="image/*"
  formComposition={{
    label: "Profile Picture",
    description: "JPEG or PNG, max 2MB"
  }}
/>
```

## Form Integration

```tsx
// React Hook Form integration
<InputForm
  control={form.control}
  name="username"
  type="text"
  formComposition={{
    label: "Username",
    description: "Choose a unique username",
    variant: "default",
    labelPosition: "horizontal",
    inputClear: true,
  }}
/>
```

## Key Features

1. **FormComposition Integration**: Leverages all FormComposition styling and layout options
2. **Value Change Handling**: Simplified value handling with `onValueChange` and `onValueFileChange`
3. **Automatic Placeholder**: Generates placeholders based on label if not provided
4. **Clear Button**: Optional clear functionality with `inputClear` prop
5. **File Input Support**: Specialized handling for file inputs
6. **Focus Management**: Proper focus handling for accessibility
7. **Form Integration**: Seamless integration with React Hook Form via InputForm

## Important Documentation References

- **form-composition.md**: Essential for understanding styling and layout options
- **form.md**: Critical for understanding form state management and validation integration

## Best Practices

1. **Read both form.md and form-composition.md thoroughly** to understand all available options
2. Use `onValueChange` instead of `onChange` for simpler value handling
3. For file inputs, use `onValueFileChange` to access the FileList directly
4. Leverage FormComposition's rich styling API for consistent form design
5. Use `InputForm` with React Hook Form for seamless form state management
6. Understand how Zod schema validation integrates with InputForm components

> **NOTE**: The FormComposition and Form systems are critical to using Input components effectively. Please refer to both documentation files for detailed information about all available customization options and integration patterns.
