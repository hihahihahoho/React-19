# Select Component Documentation

## Overview

The Select component provides a dropdown selector with search capabilities, grouping options, and form integration. It integrates with FormComposition for styling and React Hook Form for validation.

> **IMPORTANT**: Before using the Select component, it is essential to read both the `form-composition.md` and `form.md` documentation.

## Import

```typescript
import { Select } from "@/components/ui/select/select"
import { SelectForm } from "@/components/ui/select/select-form"
```

## Types

```typescript
// Main Component Props
export interface SelectProps {
  placeholder?: string | React.ReactNode
  options?: SelectItems[] | SelectGroup[] // Options to display in dropdown
  value?: string | undefined // Controlled value
  defaultValue?: string | undefined // Uncontrolled initial value
  disabled?: boolean
  readonly?: boolean
  formComposition?: FormCompositionProps
  onValueChange?: (value: string | undefined) => void
  selectCommandProps?: {
    // Props for internal command component
    loading?: boolean // Show loading state in dropdown
    showSearch?: boolean // Enable/disable search input
    // Additional command props
  }
}
```

## Basic Usage

```tsx
<Select
  placeholder="Select a fruit"
  options={[
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" },
  ]}
  formComposition={{
    label: "Favorite Fruit",
    description: "Choose your preferred fruit",
  }}
/>
```

## Form Integration

```tsx
const formSchema = z.object({
  country: z.string().min(1, "Please select a country"),
})

type FormValues = z.infer<typeof formSchema>

function CountryForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
    },
  })

  return (
    <ZodSchemaProvider schema={formSchema}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <SelectForm
            control={form.control}
            name="country"
            options={countryOptions}
            formComposition={{
              label: "Country",
              description: "Select your country",
              labelPosition: "horizontal",
            }}
            placeholder="Choose a country"
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </ZodSchemaProvider>
  )
}
```

## Loading State

You can show a loading state while fetching options asynchronously:

```tsx
// Example with loading state
<Select
  placeholder="Select country"
  options={countries} // This might be empty while loading
  selectCommandProps={{
    loading: isLoading, // Boolean indicating loading state
  }}
  formComposition={{
    label: "Country",
  }}
/>
```

## Option Formatting

Options can be simple or grouped:

```tsx
// Simple options
const fruitOptions = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
]

// Grouped options
const foodOptions = [
  {
    heading: "Fruits",
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
    ],
  },
  {
    heading: "Vegetables",
    options: [
      { value: "carrot", label: "Carrot" },
      { value: "broccoli", label: "Broccoli" },
    ],
  },
]
```

## Integration with Zod Schema

When using with React Hook Form and Zod validation, the component automatically handles required field indicators:

```tsx
// Schema definition
const schema = z.object({
  country: z.string().min(1, "Country is required")
})

// In component (requiredSymbol is automatically set based on schema)
<ZodSchemaProvider schema={schema}>
  <SelectForm control={form.control} name="country" />
</ZodSchemaProvider>
```

## Best Practices

1. **Use Zod Schema Provider**: Always wrap your form with ZodSchemaProvider
2. **Provide Clear Labels**: Use descriptive labels and placeholders
3. **Use Form Integration**: Leverage SelectForm with React Hook Form
4. **Group Related Options**: Improve organization with option groups
5. **Handle Loading States**: Show loading indicator when fetching options
6. **Read Form Documentation**: Review form.md and form-composition.md

> **NOTE**: The FormComposition and Form systems are critical to using Select components effectively.
