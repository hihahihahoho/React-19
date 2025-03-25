# Form Component Documentation

## Overview

The Form system provides a comprehensive solution for creating, managing, and validating forms in React applications. It combines React Hook Form with Zod schema validation to deliver a type-safe, performant form handling experience while maintaining a clean, declarative API.

## Import

```typescript
import { Form, FormField } from "@/components/ui/form/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import { z } from "zod"
import { zodRequiredString, zodFile, zodDate, zodDateRange } from "@/lib/zod"
```

## Core Components

### Form

A wrapper around React Hook Form's `FormProvider` that provides form context to all child components.

### FormField

Connects form controls to React Hook Form's controller pattern, handling field registration, validation, and state management.

## Zod Schema Integration

The form system uses Zod for schema validation, providing type safety, clear error messages, and complex validation rules.

```typescript
// Define your schema
const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "Must be at least 18 years old"),
})

// TypeScript will infer this type from your schema
type FormValues = z.infer<typeof formSchema>
```

## Custom Zod Validators

The system provides specialized Zod validators to handle common validation scenarios:

### zodRequiredString

Creates a required string with custom validation message.

```typescript
// Usage
const schema = z.object({
  name: zodRequiredString("Name is required"),
})
```

### zodFile

Advanced file validation with support for file types, size limits, and quantity constraints.

```typescript
// Usage
const schema = z.object({
  profileImage: zodFile({
    accepted: ["image/jpeg", "image/png"],
    maxFileSize: 1000000, // 1MB
    length: { min: 1, max: 1 },
    required_error: "Please upload a profile image.",
  }),
})
```

### zodDate

Date validation with min/max date constraints.

```typescript
// Usage
const schema = z.object({
  birthdate: zodDate({
    minDate: new Date(1900, 0, 1),
    maxDate: new Date(),
    required_error: "Birth date is required.",
  }),
})
```

### zodDateRange

Date range validation with min/max constraints and range validation.

```typescript
// Usage
const schema = z.object({
  vacationPeriod: zodDateRange({
    minDate: new Date(),
    maxRange: 30, // Maximum 30 days
    required_error: "Vacation dates are required.",
  }),
})
```

## Basic Usage

```tsx
const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
})

type FormValues = z.infer<typeof formSchema>

function ProfileForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  })

  function onSubmit(data: FormValues) {
    console.log(data)
  }

  return (
    <ZodSchemaProvider schema={formSchema}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <InputForm
            control={form.control}
            name="username"
            type="text"
            formComposition={{
              label: "Username",
              description: "Enter your username",
              labelPosition: "horizontal",
            }}
          />

          <InputForm
            control={form.control}
            name="email"
            type="email"
            formComposition={{
              label: "Email",
              description: "Enter your email address",
              labelPosition: "horizontal",
            }}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </ZodSchemaProvider>
  )
}
```

## Form Integration Components

The library provides specialized form components that integrate with React Hook Form automatically:

- `InputForm`: For text, number, email, password, and file inputs
- `CheckboxForm`: For single checkboxes
- `CheckboxGroupForm`: For groups of related checkboxes
- `RadioGroupForm`: For radio button groups
- `SelectForm`: For dropdown selection
- `MultiSelectForm`: For multiple selections
- `DatePickerForm`: For date selection
- `TextareaForm`: For multiline text entry

Each of these components handle the React Hook Form integration, validation state, and error display automatically.

## ZodSchemaProvider

The `ZodSchemaProvider` component is used to provide Zod schema information to form components, enabling:

1. Automatic detection of required fields (`requiredSymbol` in formComposition)
2. Schema-based validation handling
3. Type safety throughout the form system

```tsx
<ZodSchemaProvider schema={formSchema}>
  <Form {...form}>{/* Form components here */}</Form>
</ZodSchemaProvider>
```

## Advanced Usage

### Custom Validation Functions

```tsx
const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
```

### Dynamic Forms

```tsx
const dynamicSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one item is required"),
})
```

## Best Practices

1. **Always use ZodSchemaProvider**: This ensures proper integration between your validation schema and form components
2. **Leverage specialized Form components**: Components like InputForm handle integration details for you
3. **Define clear validation messages**: Provide helpful error messages in your Zod schema
4. **Maintain type safety**: Use `z.infer<typeof schema>` to ensure type consistency
5. **Organize related fields**: Use form composition to create logical groupings
6. **Handle form state properly**: Use React Hook Form's watch, formState, and other utilities as needed
7. **Set appropriate defaultValues**: Always provide initial values that match your schema
8. **Use custom Zod validators**: Leverage the built-in validators like `zodFile`, `zodDate`, etc. for common use cases

## Integration with FormComposition

Form components work seamlessly with FormComposition to create a consistent design system:

```tsx
<SelectForm
  control={form.control}
  name="country"
  items={countryOptions}
  formComposition={{
    label: "Country",
    description: "Select your country of residence",
    labelPosition: "horizontal",
    variant: "default",
  }}
/>
```

> **IMPORTANT**: When using Form components with FormComposition, remember that certain properties like `requiredSymbol` are automatically determined by your Zod schema and should not be set manually.

The Form system provides a powerful foundation for creating complex, validatable forms with minimal boilerplate while maintaining excellent type safety and user experience.
