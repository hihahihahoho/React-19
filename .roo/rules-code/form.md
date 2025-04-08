````markdown
# Form Component Documentation

## Overview

The Form system integrates React Hook Form with Zod schema validation to provide type-safe form handling with a clean API. It offers specialized form components and custom validators for common validation scenarios.

## Import

```typescript
import { Form, FormField } from "@/components/ui/form/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import { z } from "zod"
import { zodRequiredString, zodFile, zodDate, zodDateRange } from "@/lib/zod"
```
````

## Core Components

| Component           | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `Form`              | Wrapper around React Hook Form's `FormProvider`      |
| `FormField`         | Connects form controls to React Hook Form controller |
| `ZodSchemaProvider` | Provides schema information to form components       |

## Custom Zod Validators

| Validator           | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `zodRequiredString` | Required string with custom validation message            |
| `zodFile`           | File validation with type, size, and quantity constraints |
| `zodDate`           | Date validation with min/max constraints                  |
| `zodDateRange`      | Date range validation with min/max and range constraints  |

## Example Usage

```tsx
const form_schema = z.object({
  user_name: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
})

type FormValues = z.infer<typeof form_schema>

function ProfileForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      user_name: "",
      email: "",
    },
  })

  function onSubmit(data: FormValues) {
    console.log(data)
  }

  return (
    <ZodSchemaProvider schema={form_schema}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <InputForm
            control={form.control}
            name="user_name"
            formComposition={{
              label: "Username",
              description: "Enter your username",
            }}
          />

          <InputForm
            control={form.control}
            name="email"
            type="email"
            formComposition={{
              label: "Email",
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

These components automatically integrate with React Hook Form:

- `InputForm`: Text, number, email, password, file inputs
- `CheckboxForm`: Single checkboxes
- `CheckboxGroupForm`: Groups of related checkboxes
- `RadioGroupForm`: Radio button groups
- `SelectForm`: Dropdown selection
- `MultiSelectForm`: Multiple selections
- `DatePickerForm`: Date selection
- `TextareaForm`: Multiline text entry

## Custom Validator Usage

```tsx
// Required string
const schema = z.object({
  full_name: zodRequiredString("Name is required"),
})

// File validation
const schema = z.object({
  profile_image: zodFile({
    accepted: ["image/jpeg", "image/png"],
    maxFileSize: 1000000, // 1MB
    length: { min: 1, max: 1 },
    required_error: "Please upload a profile image.",
  }),
})

// Date validation
const schema = z.object({
  birth_date: zodDate({
    minDate: new Date(1900, 0, 1),
    maxDate: new Date(),
    required_error: "Birth date is required.",
  }),
})
```

## Best Practices

1. **Always use ZodSchemaProvider**: Ensures proper integration between validation schema and form components
2. **Use specialized Form components**: Components like InputForm handle integration details automatically
3. **Use underscore naming in schemas**: Follow consistent naming conventions with underscores
4. **Set appropriate defaultValues**: Provide initial values that match your schema
5. **Let the system handle required indicators**: The `requiredSymbol` is automatically determined by your schema
