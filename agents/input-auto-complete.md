# InputAutoComplete Component Documentation

## Overview

The InputAutoComplete component provides a searchable input field with dropdown suggestions. It supports two modes: free text with suggestions ("default") or strict selection from options ("select"). It integrates with FormComposition for styling and React Hook Form for form management.

> **IMPORTANT**: Before using InputAutoComplete, read both `form-composition.md` and `form.md` documentation.

## Import

```typescript
import { InputAutoComplete } from "@/components/ui/input/input-auto-complete"
import { InputAutoCompleteForm } from "@/components/ui/input/input-auto-complete-form"
```

## Types

```typescript
export interface InputAutoCompleteProps {
  options?: SelectItems[] | SelectGroup[] // Options for dropdown
  onValueChange?: (value: string) => void // Called when value changes
  onSearchChange?: (value: string) => void // Called when search term changes
  value?: string // Controlled value
  defaultValue?: string // Uncontrolled initial value
  initialState?: React.ReactNode // Content shown before search
  loading?: boolean // Show loading state
  minCharToSearch?: number // Min chars before showing results
  mode?: "default" | "select" // Behavior mode
  formComposition?: FormCompositionProps // Styling options
}
```

## Basic Usage

```tsx
<InputAutoComplete
  placeholder="Search countries..."
  options={[
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "ca", label: "Canada" },
  ]}
  formComposition={{
    label: "Country",
    description: "Type or select your country",
  }}
/>
```

## Form Integration

```tsx
const formSchema = z.object({
  country: z.string().min(1, "Please select a country"),
})

function CountryForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  return (
    <ZodSchemaProvider schema={formSchema}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <InputAutoCompleteForm
            control={form.control}
            name="country"
            options={countryOptions}
            mode="select"
            formComposition={{
              label: "Country",
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

## Loading State

You can show a loading state while fetching options asynchronously:

```tsx
// Example with loading state
<InputAutoComplete
  placeholder="Search countries..."
  options={countries} // This might be empty while loading
  loading={isLoading} // Boolean indicating loading state
  onSearchChange={handleSearch}
  formComposition={{
    label: "Country",
  }}
/>
```

## Key Features

1. **Two Modes**: `default` for free text with suggestions, `select` for strict option selection
2. **Search**: Filter options as you type
3. **FormComposition**: Uses all FormComposition styling options
4. **React Hook Form Integration**: Works with form validation
5. **Grouped Options**: Support for option categories

## Options Format

```typescript
// Simple options
const options = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
]

// Grouped options
const groupedOptions = [
  {
    label: "North America",
    items: [{ value: "us", label: "United States" }],
  },
  {
    label: "Europe",
    items: [{ value: "uk", label: "United Kingdom" }],
  },
]
```

## Integration with Zod Schema

The component automatically handles required field indicators based on your schema:

```tsx
// Schema definition
const schema = z.object({
  country: z.string().min(1, "Country is required")
})

// In component
<ZodSchemaProvider schema={schema}>
  <InputAutoCompleteForm
    control={form.control}
    name="country"
    // requiredSymbol is automatically set based on schema
  />
</ZodSchemaProvider>
```

## Best Practices

1. Use `default` mode for search inputs, `select` for strict selection fields
2. Use InputAutoCompleteForm with React Hook Form for validation
3. Provide clear labels and descriptions via FormComposition
4. Handle loading states appropriately when fetching options
5. Read both form-composition.md and form.md documentation

> **NOTE**: The FormComposition and Form systems are critical to using InputAutoComplete effectively.
