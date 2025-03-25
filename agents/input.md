# Input Component Documentation

## Overview

The Input component is a versatile form control for collecting user data through various input types. It provides rich functionality including form integration, validation, accessibility features, and extensive styling options.

## Types

```typescript
// Core Types
export type OnValueChangeInput = React.ComponentProps<"input">["value"]
export type OnValueFileChangeInput = FileList | null

// Main Component Props
export interface InputProps extends React.ComponentProps<"input"> {
  // All standard HTML input attributes plus:
  formComposition?: FormCompositionProps
  onValueChange?: (value: OnValueChangeInput) => void
  onValueFileChange?: (value: OnValueFileChangeInput) => void
  // Inherited props include:
  type?: "text" | "password" | "email" | "number" | "tel" | "url" | "search" | "file" | etc.
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  defaultValue?: string | ReadonlyArray<string> | number
  value?: string | ReadonlyArray<string> | number
  name?: string
  autoComplete?: string
  autoFocus?: boolean
  min?: number | string
  max?: number | string
  minLength?: number
  maxLength?: number
  pattern?: string
  required?: boolean
  multiple?: boolean
  step?: number | string
  className?: string
  id?: string
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

// Form Integration Props
export interface InputFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControllerProps<TFieldValues, TName>,
    Omit<InputProps, "defaultValue" | "name"> {
  // React Hook Form controller props:
  control: Control<TFieldValues>
  name: TName
  defaultValue?: unknown
  rules?: RegisterOptions
  shouldUnregister?: boolean
}

// Form Composition Props
export interface FormCompositionProps {
  // Styling variants
  variant?: "default" | "white" | "ghost" | "empty" | "inline"
  size?: "sm" | "default" | "lg"
  className?: string

  // Label configuration
  label?: React.ReactNode
  labelPosition?: "vertical" | "horizontal"
  requiredSymbol?: boolean

  // Description and error handling
  description?: React.ReactNode
  showErrorMsg?: boolean
  customError?: React.ReactNode

  // Visual elements
  iconLeft?: string | React.ReactNode
  iconRight?: string | React.ReactNode
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  prefixOutside?: React.ReactNode
  suffixOutside?: React.ReactNode
  prefixNotFocusInput?: { order?: number, element: React.ReactNode }
  suffixNotFocusInput?: { order?: number, element: React.ReactNode }

  // Interaction handling
  inputClear?: boolean
  clearWhenNotFocus?: boolean
  onClear?: () => void
  onClick?: (e: React.MouseEvent) => void
  onFormCompositionClick?: () => void

  // State modifiers
  disabled?: boolean
  readonly?: boolean
  isFocused?: boolean
  hasValue?: boolean
  isMinHeight?: boolean

  // Advanced configuration
  asChild?: boolean
  focusWithin?: boolean
  styleButton?: boolean
  layout?: string
  subDescription?: React.ReactNode
}
```
