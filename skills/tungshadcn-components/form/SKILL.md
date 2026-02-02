---
name: tungshadcn-form
description: Patterns for TungShadcn form building using FormComposition, Input, InputForm, and Select. Use for consistent form layouts, validation wiring, and input behaviors.
license: MIT
metadata:
  author: project
  version: "1.0"
---

# TungShadcn Form Structure

## Table of Contents

- [When to Use](#when-to-use)
- [Mental Model](#mental-model)
- [Canonical Structure](#canonical-structure)
- [Responsibility Split](#responsibility-split)
- [How to Build a New Form](#how-to-build-a-new-form)
- [Input and Select Rules](#input-and-select-rules)
- [Validation Rules](#validation-rules)
- [Do and Don’t](#do-and-dont)
- [Reference Files](#reference-files)

## When to Use

- Building or refactoring forms that use the TungShadcn component registry
- Wiring React Hook Form + Zod with TungShadcn inputs
- Standardizing labels, errors, and layout across form fields
- Implementing Select with the TungShadcn select system

## Mental Model

Every form is split into three layers:

1. Schema: validation rules only
2. Context: form logic and wiring
3. View: UI layout and fields

This keeps logic out of the view and makes forms predictable when adding new fields or cloning for new routes.

## Canonical Structure

Mirror this structure for any form under a route:

```
(index)
  -components
    -my-form
      context.tsx
      schema.ts
      form.tsx
  index.tsx
```

Route usage pattern (example: `quan-ly-cts`):

- `index.tsx` renders the page shell and composes the form context + view
- `context.tsx` owns `useForm`, `onSubmit`, and providers
- `schema.ts` owns Zod validation
- `form.tsx` (view) renders fields and actions

## Responsibility Split

### schema.ts

- Define Zod schema only
- No UI and no React Hook Form
- Use optional fields for filters

### context.tsx

- Create form instance (`useForm`) and `onSubmit`
- Wrap children with `ZodSchemaProvider`, `Form`, and native `<form>`
- Expose no UI here; this is logic only

### form.tsx (view)

- Use `useFormContext` for `control`, `reset`, and state
- Render fields using `InputForm` or other form-bound components
- Render action buttons (submit/reset)
- Layout with `Card`, `CardFilter`, or other view components

### index.tsx

- Compose the page shell, then wrap `FormView` inside `FormContext`
- Keep page actions (export, add, etc.) at the route level

## How to Build a New Form

1. Create `schema.ts` with Zod rules.
2. Create `context.tsx` that wraps children with providers and `onSubmit`.
3. Create `form.tsx` that renders fields and uses `useFormContext`.
4. In `index.tsx`, wrap `Form` view with `FormContext`.

Minimal templates:

```ts
// schema.ts
import { z } from "zod"

const FormSchema = z.object({
  field_name: z.string().optional(),
})

export { FormSchema }
```

```tsx
// context.tsx
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FormSchema } from "./schema"

function FormContext({ children }: { children: React.ReactNode }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data)
  }

  return (
    <ZodSchemaProvider schema={FormSchema}>
      <Form {...form}>
        <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
          {children}
        </form>
      </Form>
    </ZodSchemaProvider>
  )
}

export { FormContext }
```

```tsx
// form.tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CardFilter } from "@/components/ui/card-filter"
import { InputForm } from "@/components/ui/input/input-form"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { FormSchema } from "./schema"

function FormView() {
  const { control, reset } = useFormContext<z.infer<typeof FormSchema>>()

  return (
    <Card>
      <CardFilter variant="col-2">
        <InputForm
          control={control}
          name="field_name"
          placeholder="Placeholder"
          formComposition={{ label: "Label" }}
        />
        <div className="flex items-end gap-2">
          <Button type="submit">Submit</Button>
          <Button type="button" variant="ghost" onClick={() => reset()}>
            Reset
          </Button>
        </div>
      </CardFilter>
    </Card>
  )
}

export { FormView }
```

```tsx
// index.tsx
import { FormContext } from "./-components/-my-form/context"
import { FormView } from "./-components/-my-form/form"

function RouteComponent() {
  return (
    <>
      {/* Page header/actions */}
      <FormContext>
        <FormView />
      </FormContext>
      {/* Page content/table */}
    </>
  )
}
```

## Input and Select Rules

- Use `InputForm` for any field managed by React Hook Form.
- Use `Input` only for uncontrolled fields.
- `InputForm` derives `requiredSymbol` from Zod via `ZodSchemaProvider`.
- File inputs clear to `null` and pass `files` to `onChange`.
- `Select` uses `ResponsivePopover` and `SelectCommand` under the hood.
- For large datasets, pass `virtualComponents` to `Select`.

## Validation Rules

- Keep Zod schema in `schema.ts` next to the form.
- Use optional fields for filters (`z.string().optional()`).
- Keep defaults in `useForm`, not in schema.
- Always wrap with `ZodSchemaProvider` so required fields are inferred.

## Do and Don’t

- Do keep logic in `context.tsx` and UI in `form.tsx`.
- Do keep schemas isolated in `schema.ts`.
- Do wrap forms using the route-level composition in `index.tsx`.
- Don’t put `useForm` inside the view component.
- Don’t handle validation logic inside the UI file.

## Reference Files

- `src/components/ui/form/form.tsx`
- `src/components/ui/input/input-form.tsx`
- `src/components/ui/select/select.tsx`
- `src/routes/_authed/quan-ly-cts/(index)/index.tsx`
- `src/routes/_authed/quan-ly-cts/(index)/-components/-filter-form/context.tsx`
- `src/routes/_authed/quan-ly-cts/(index)/-components/-filter-form/filter-form.tsx`
- `src/routes/_authed/quan-ly-cts/(index)/-components/-filter-form/schema.ts`
