# Form Patterns Template

Copy and adapt this template for your component library.

---

# Form Patterns

## Architecture

Forms use a three-layer separation:

```
-my-form/
  schema.ts    # Validation rules only
  context.tsx  # Form logic + providers
  form.tsx     # UI components only
```

## Layer Responsibilities

### schema.ts

- Define Zod schema
- No React, no UI
- Export schema for reuse

```ts
import { z } from "zod"

export const FormSchema = z.object({
  name: z.string().min(1, { error: "Required" }),
  email: z.email(),
})
```

### context.tsx

- Create form instance with `useForm`
- Wrap with providers
- Handle submit logic
- No UI rendering

```tsx
import { Form } from "@/components/ui/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FormSchema } from "./schema"

export function FormContext({ children }: { children: React.ReactNode }) {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { name: "", email: "" },
  })

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <ZodSchemaProvider schema={FormSchema}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
      </Form>
    </ZodSchemaProvider>
  )
}
```

### form.tsx

- Render form fields using `*Form` components
- Use `useFormContext` for control access
- Handle layout and styling
- No form logic

```tsx
import { InputForm } from "@/components/ui/input/input-form"
import { Button } from "@/components/ui/button"
import { useFormContext } from "react-hook-form"

export function FormView() {
  const { control } = useFormContext()

  return (
    <div className="space-y-4">
      <InputForm
        control={control}
        name="name"
        formComposition={{ label: "Name" }}
      />
      <InputForm
        control={control}
        name="email"
        formComposition={{ label: "Email" }}
      />
      <Button type="submit">Submit</Button>
    </div>
  )
}
```

## Form Component Pattern

Form-bound components follow this pattern:

### Props

- `control` - From `useFormContext`
- `name` - Field name in schema
- `formComposition` - Styling and layout options
- `...rest` - Passed to underlying input

### formComposition Options

```tsx
formComposition={{
  // Label & Description
  label: "Field Label",
  description: "Help text",
  requiredSymbol: true,

  // Layout
  labelPosition: "vertical" | "horizontal",

  // Icons
  iconLeft: <Icon />,
  iconRight: <Icon />,

  // Prefix/Suffix
  prefix: <span>$</span>,
  suffix: <span>USD</span>,

  // Clear button
  inputClear: true,

  // Variants
  variant: "default" | "white" | "ghost" | "empty" | "inline",
  size: "sm" | "default" | "lg",
}}
```

## Validation Integration

- `ZodSchemaProvider` enables automatic required field detection
- Form components read schema metadata for `requiredSymbol`
- Error messages display automatically from Zod

## Usage

```tsx
import { FormContext } from "./-components/-my-form/context"
import { FormView } from "./-components/-my-form/form"

function Page() {
  return (
    <FormContext>
      <FormView />
    </FormContext>
  )
}
```
