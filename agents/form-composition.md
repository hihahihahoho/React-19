# Form Composition Component Documentation

## Overview

FormComposition is a versatile wrapper component that provides consistent styling, layout, and functionality for form controls in React applications. It serves as the foundation for Input, InputTag, DatePicker, Select, MultiSelect, InputAutoComplete and other form components.

## FormCompositionProps Type

```typescript
export interface FormCompositionProps {
  // Styling variants
  variant?: "default" | "white" | "ghost" | "empty" | "inline" // Controls the visual style of the input container
  size?: "sm" | "default" | "lg" // Controls the size of the component
  className?: string // Additional CSS classes for customization

  // Label configuration
  label?: React.ReactNode // Text or custom element for the field label
  labelPosition?: "vertical" | "horizontal" // Determines label placement relative to the input

  // Description and error handling
  description?: React.ReactNode // Help text displayed below the input
  showErrorMsg?: boolean // Whether to display validation error messages
  customError?: React.ReactNode // Custom error message overriding form validation errors

  // Visual elements
  iconLeft?: string | React.ReactNode // Icon displayed at the left inside the input
  iconRight?: string | React.ReactNode // Icon displayed at the right inside the input
  prefix?: React.ReactNode // Content displayed before the input (inside container)
  suffix?: React.ReactNode // Content displayed after the input (inside container)
  prefixOutside?: React.ReactNode // Content displayed before input container (outside)
  suffixOutside?: React.ReactNode // Content displayed after input container (outside)
  prefixNotFocusInput?: React.ReactNode // Interactive element inside the input that won't focus the input when clicked (like buttons)
  suffixNotFocusInput?: React.ReactNode // Interactive element inside the input that won't focus the input when clicked (like buttons)

  // Interaction handling
  inputClear?: boolean // Enable/disable the clear button when input has value
  clearWhenNotFocus?: boolean // Whether to show clear button only on focus
  onClear?: () => void // Function called when clear button is clicked
  onClick?: (e: React.MouseEvent) => void // Handler for clicks on the form composition
  onFormCompositionClick?: () => void // Alternative click handler for the whole component

  // State modifiers - DO NOT SET DIRECTLY (controlled by components)
  disabled?: boolean // Pass to the parent component instead
  readonly?: boolean // Pass to the parent component instead
  isFocused?: boolean // Managed internally by components
  hasValue?: boolean // Managed internally by components
  isMinHeight?: boolean // Managed internally by components
  asChild?: boolean // Internal Radix UI property, do not set directly
  focusWithin?: boolean // Internal focus highlight behavior, do not set directly
  styleButton?: boolean // Internal button styling flag, do not set directly
  requiredSymbol?: boolean // DO NOT SET DIRECTLY - controlled by Zod schema validation

  // Advanced configuration
  layout?: { leftColClass: string; rightColClass: string } // Custom layout classes for horizontal mode
  subDescription?: React.ReactNode // Secondary description content
}
```

## How to Use

FormComposition is typically used internally by form control components rather than directly. When working with these components (like InputForm, SelectForm, etc.), you can pass formComposition props to customize their appearance and behavior.

### Basic Example

```tsx
<InputForm
  control={form.control}
  name="username"
  type="text"
  formComposition={{
    label: "Username",
    description: "Enter your username",
    inputClear: true,
    variant: "default",
    size: "default",
    labelPosition: "horizontal",
  }}
/>
```

### Key Features

1. **Consistent Layout**: Provides uniform horizontal or vertical layouts for form controls
2. **Built-in Error Display**: Handles showing validation errors from React Hook Form
3. **Rich Decoration**: Supports icons, prefixes, suffixes, both inside and outside the input
4. **Clear Button**: Automatic input clearing functionality with customizable behavior
5. **Description Text**: Support for help text, error messages, and sub-descriptions
6. **Flexible Styling**: Multiple variants and sizes for different UI requirements

### Important Props

- **labelPosition**: Controls layout orientation (`"vertical"` or `"horizontal"`)
- **variant**: Changes visual styling (`"default"`, `"white"`, `"ghost"`, `"empty"`, `"inline"`)
- **size**: Sets component size (`"sm"`, `"default"`, `"lg"`)
- **inputClear**: Enables/disables clear button on inputs when they have a value
- **icons/prefix/suffix**: Various ways to add decorative or functional elements
- **prefixNotFocusInput/suffixNotFocusInput**: Interactive elements inside the input container that won't trigger input focus when clicked (useful for buttons)
- **prefixOutside/suffixOutside**: Elements that appear completely outside the input container

### Integration with React Hook Form

FormComposition components typically accept a `control` prop from React Hook Form and handle form state management automatically. They can display validation errors and work with Zod schema validation.

```tsx
<DatePickerForm
  control={form.control}
  name="dob"
  formComposition={{
    label: "Date of Birth",
    labelPosition: "horizontal",
    description: "Select your date of birth",
  }}
/>
```

> **IMPORTANT NOTE**: When using form components with Zod schema validation, do not set the `requiredSymbol` prop manually. This property is automatically controlled by the component based on the Zod schema's field requirements. Setting it manually may cause inconsistencies between the UI and the actual validation behavior.

## Best Practices

1. Use `labelPosition="horizontal"` for forms with more space and better label-field alignment
2. Provide descriptive help text using the `description` prop
3. Use `suffixNotFocusInput` for interactive elements like buttons that should be inside the input container
4. Use `suffixOutside` for elements that should appear outside the input container
5. Set appropriate `variant` and `size` to match your application's design system
6. Provide descriptive error messages through your validation schema
7. Do not set state modifier props directly (disabled, readonly, isFocused, hasValue, isMinHeight, asChild, focusWithin, styleButton, requiredSymbol) - these should be controlled by the parent component

The FormComposition system provides a comprehensive solution for creating consistent, accessible, and feature-rich form interfaces with minimal boilerplate.
