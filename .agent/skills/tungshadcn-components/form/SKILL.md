---
name: tungshadcn-form
description: Form patterns for TungShadcn. Use when building forms with React Hook Form + Zod.
---

# TungShadcn Form Components

## Documentation

- Component list: `https://react-19.octung112.workers.dev/llms.txt`
- Examples: `src/stories/` (input.stories.tsx, select.stories.tsx, etc.)

---

## Key Pattern: FormComposition

Unlike vanilla shadcn/ui (FormItem/FormLabel/FormControl), TungShadcn uses a **single `formComposition` prop**:

```tsx
// TungShadcn pattern
<InputForm
  control={control}
  name="email"
  formComposition={{
    label: "Email",
    description: "Help text",
    iconLeft: <Mail />,
    iconRight: <Check />,
    prefix: <span>$</span>,
    suffix: <span>USD</span>,
    inputClear: true,
    variant: "default", // "white" | "ghost" | "inline"
    size: "default", // "sm" | "lg"
    labelPosition: "vertical", // "horizontal"
  }}
/>
```

---

## Form Setup (Three Layers)

```
-my-form/
  schema.ts    # Zod validation only
  context.tsx  # useForm + providers
  form.tsx     # UI only
```

### schema.ts

```ts
import { z } from "zod"

export const FormSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
})
```

### context.tsx

```tsx
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FormSchema } from "./schema"

export function MyFormContext({ children }: { children: React.ReactNode }) {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { name: "", email: "" },
  })

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

```tsx
import { InputForm } from "@/components/ui/input/input-form"
import { useFormContext } from "react-hook-form"

export function MyFormView() {
  const { control } = useFormContext()

  return (
    <>
      <InputForm
        control={control}
        name="name"
        formComposition={{ label: "Name" }}
      />
      <InputForm
        control={control}
        name="email"
        type="email"
        formComposition={{ label: "Email" }}
      />
      <Button type="submit">Submit</Button>
    </>
  )
}
```

---

## Component Selection

| Need           | Use                     |
| -------------- | ----------------------- |
| Text input     | `InputForm`             |
| Number input   | `InputNumberForm`       |
| Textarea       | `TextareaForm`          |
| Select         | `SelectForm`            |
| Multi-select   | `MultiSelectForm`       |
| Tags           | `InputTagForm`          |
| Autocomplete   | `InputAutoCompleteForm` |
| Date picker    | `DatePickerForm`        |
| Date range     | `DateRangePickerForm`   |
| Checkbox       | `CheckboxForm`          |
| Checkbox group | `CheckboxGroupForm`     |
| Checkbox tree  | `CheckboxTreeForm`      |
| Radio group    | `RadioGroupForm`        |
| Switch         | `SwitchForm`            |
| Rating         | `RatingForm`            |
| Signature      | `SignaturePadForm`      |
| OTP            | `InputOTPForm`          |
| Slider         | `SliderForm`            |
| File upload    | `FileUploadForm`        |

---

## Auto Required Detection

`ZodSchemaProvider` auto-detects required fields from Zod schema:

```tsx
// schema.ts
const schema = z.object({
  email: z.email(),              // Required → shows *
  nickname: z.string().optional(), // Optional → no *
})

// form.tsx - No need to pass requiredSymbol
<InputForm name="email" formComposition={{ label: "Email" }} />
// Automatically shows * after label
```

---

## formComposition Props

```ts
formComposition={{
  // Label
  label: "Field Label",           // Shows in label
  requiredSymbol: true,           // Auto from Zod

  // Help text
  description: "Below field",
  subDescription: "0/100",        // Right side (e.g., char count)

  // Layout
  labelPosition: "vertical",      // "horizontal"
  layout: {                       // For horizontal
    leftColClass: "md:col-span-3",
    rightColClass: "md:col-span-9",
  },

  // Icons (inside input)
  iconLeft: <SearchIcon />,
  iconRight: <ChevronDown />,

  // Prefix/Suffix (inside container)
  prefix: <span>$</span>,
  suffix: <span>USD</span>,

  // Prefix/Suffix (outside container)
  prefixOutside: <Button>...</Button>,
  suffixOutside: <Button>Check</Button>,

  // Clear button
  inputClear: true,
  clearWhenNotFocus: false,
  onClear: () => {},

  // Styling
  variant: "default",             // "white" | "ghost" | "inline"
  size: "default",                // "sm" | "lg"

  // Error
  showErrorMsg: true,
  customError: "Override error",
}}
```

---

## Do/Don't

**Do:**

- Use `*Form` components inside forms
- Wrap with `ZodSchemaProvider` for auto required detection
- Put `useForm` in context, not view component
- Pass `formComposition.label` for accessibility

**Don't:**

- Use base `Input`/`Select` inside forms
- Manually pass `requiredSymbol` (let Zod handle it)
- Use FormItem/FormLabel/FormControl pattern (it's built into FormComposition)
