# Custom Shadcn Components Usage Guide

This repository uses a **customized version of shadcn/ui components**. They are enhanced with additional features and standard patterns, particularly around form handling.

**CRITICAL RULE:** Do NOT use standard shadcn implementation patterns (manually wrapping `Input` with `FormField`, `FormItem`, etc.). Use the specialized `*Form` components.

## 1. The `*Form` Components Pattern

Instead of writing the verbose shadcn `FormField` boilerplate, this project provides dedicated wrapper components for each input type. These wrappers handle the `control`, `name`, and `FormComposition` internally.

### Key Components
*   `InputForm`
*   `InputNumberForm`
*   `SelectForm`
*   `DatePickerForm`
*   `DateRangePickerForm`
*   `TextareaForm`
*   `CheckboxGroupForm` / `RadioGroupForm`
*   `FileUploadForm`

### Usage Example

**Standard Shadcn (DO NOT USE):**
```tsx
// ❌ Verbose and discouraged
<FormField
  control={form.control}
  name="username"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Username</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Custom Pattern (USE THIS):**
```tsx
// ✅ Clean and preferred
<InputForm
  control={form.control}
  name="username"
  formComposition={{
    label: "Username",
    description: "Your unique handle",
    inputClear: true
  }}
/>
```

## 2. Form Composition

The `formComposition` prop is the standard way to configure the layout and labels of any form component.

*   **`label`**: The label text or node.
*   **`labelPosition`**: `"vertical"` (default) or `"horizontal"`.
*   **`inputClear`**: If `true`, adds a clear (X) button when value exists.
*   **`suffixOutside` / `prefixOutside`**: Elements to render outside the input wrapper (e.g., a Button).
*   **`description`**: Helper text below the input.

## 3. ZodSchemaProvider

Wrap your form in `ZodSchemaProvider` to automatically pass context (like error messages) down to components.

```tsx
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"

<ZodSchemaProvider schema={FormSchema}>
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* ... Form Components ... */}
    </form>
  </Form>
</ZodSchemaProvider>
```

## 4. Component Specifics

### Input (`InputForm`)
*   Supports standard props plus `formComposition`.
*   Example:
    ```tsx
    <InputForm
      control={form.control}
      name="email"
      type="email"
      formComposition={{ label: "Email", iconLeft: <MailIcon /> }}
    />
    ```

### Select (`SelectForm`)
*   Takes `options` as an array of objects `{ label, value, ... }`.
*   Example:
    ```tsx
    <SelectForm
      control={form.control}
      name="role"
      options={[
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" }
      ]}
      formComposition={{ label: "Role" }}
    />
    ```

### DatePicker (`DatePickerForm`)
*   Supports `editable` (text input) and `inputTime`.
*   Example:
    ```tsx
    <DatePickerForm
      control={form.control}
      name="dob"
      editable
      inputTime
      formComposition={{ label: "Date of Birth" }}
    />
    ```

### Checkbox/Radio (`CheckboxGroupForm`, `RadioGroupForm`)
*   Takes `items` array.
*   Example:
    ```tsx
    <CheckboxGroupForm
      control={form.control}
      name="hobbies"
      items={[
        { label: "Reading", value: "reading" },
        { label: "Gaming", value: "gaming" }
      ]}
      formComposition={{ label: "Hobbies" }}
    />
    ```

## 5. General "Gotchas" for Agents
1.  **Always look for the `*Form` suffix component first.** (e.g., `InputForm` instead of `Input`).
2.  **Use `formComposition`** for all layout, labelling, and description needs.
3.  **Do not** manually implement `FormField` unless absolutely necessary for a custom non-standard input.
4.  **Button:** Use `isLoading` for loading states and `iconLeft`/`iconRight` for icons.
