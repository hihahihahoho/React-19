# Input Component Documentation

## Overview

The Input component is a versatile form control for collecting user data through various input types with rich functionality including form integration, validation, and extensive styling options.

> **IMPORTANT**: Before using the Input component, it is essential to read both the `form-composition.md` and `form.md` documentation. Input relies heavily on FormComposition for styling and layout, while InputForm integrates with React Hook Form.

## Import

```typescript
import { Input, type InputProps } from "@/components/ui/input/input"
import { InputForm } from "@/components/ui/input/input-form"
```

## Props Explanation

The Input component extends React.ComponentProps<"input"> to accept all standard HTML input attributes (type, value, placeholder, disabled, etc.) plus the following:

| Prop                | Type                                                                | Default   | Description                                            |
| ------------------- | ------------------------------------------------------------------- | --------- | ------------------------------------------------------ |
| `formComposition`   | FormCompositionProps                                                | undefined | Styling and layout options from FormComposition system |
| `onValueChange`     | (value: string \| number \| readonly string[] \| undefined) => void | undefined | Simplified handler for input value changes             |
| `onValueFileChange` | (value: FileList \| null) => void                                   | undefined | Specialized handler for file input changes             |

## Example Usage

```tsx
<Input
  type="text"
  placeholder="Enter your name"
  formComposition={{
    label: "Full Name",
    description: "Please enter your legal full name",
    iconLeft: <User className="h-4 w-4" />,
  }}
  onValueChange={(value) => console.log(value)}
/>
```

## Form Integration

```tsx
<InputForm
  control={form.control}
  name="email"
  type="email"
  formComposition={{
    label: "Email Address",
    description: "We'll never share your email with anyone else",
  }}
/>
```

## Key Features

1. **FormComposition Integration**: Leverages all FormComposition styling and layout options
2. **Value Change Handling**: Simplified value handling with `onValueChange` and `onValueFileChange`
3. **Automatic Placeholder**: Generates placeholders based on label if not provided
4. **Clear Button**: Optional clear functionality with `inputClear` prop
5. **File Input Support**: Specialized handling for file inputs

## Best Practices

1. **Read both form.md and form-composition.md thoroughly** to understand all available options
2. Use `onValueChange` instead of `onChange` for simpler value handling
3. For file inputs, use `onValueFileChange` to access the FileList directly
4. Use `InputForm` with React Hook Form for seamless form state management and validation
