# Custom Shadcn Components Usage Guide

This repository uses a **customized version of shadcn/ui components**. They are enhanced with additional features and standard patterns, particularly around form handling.

**CRITICAL RULE:** Do NOT use standard shadcn implementation patterns blindly. Always check the specific component interface.

## 1. Form Composition (Core Concept)

The most significant change is the `FormComposition` component, which acts as a "super-wrapper" for form controls (`Input`, `Select`, `DatePicker`, etc.).

*   **Standard shadcn:** You manually wrap `Input` with `FormItem`, `FormLabel`, `FormControl`, `FormMessage`.
*   **Custom shadcn:** You pass a `formComposition` prop to the component, which handles the layout, label, error message, and description for you.

### `FormComposition` Features
*   **Automatic Layout:** Handles `vertical` (default) or `horizontal` labels via `labelPosition`.
*   **Built-in Clearing:** Shows a clear (X) button automatically when `inputClear={true}` and the field has a value.
*   **Adornments:** Props for `prefix`, `suffix`, `iconLeft`, `iconRight`, `prefixOutside`, `suffixOutside`.
*   **Descriptions:** Props for `description` and `subDescription`.
*   **Error Handling:** Automatically renders `FormMessage` unless `showErrorMsg={false}`.

## 2. Component Specifics

### Button (`src/components/ui/button.tsx`)
*   **Enhanced Props:**
    *   `isLoading={true}`: Shows a spinner and disables the button.
    *   `iconLeft` / `iconRight`: Easily add icons.
    *   `isRounded`: Applies full rounding.
    *   `iconOnly`: Optimized padding for icon-only buttons.
    *   `size`: Supports `xs`, `sm`, `default`, `lg`.

### Input (`src/components/ui/input.tsx`)
*   **Usage:** Pass `formComposition` object instead of external wrappers.
    ```tsx
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <Input
          {...field}
          placeholder="Enter username"
          formComposition={{
            label: "Username",
            description: "Your unique handle",
            iconLeft: <UserIcon />,
            inputClear: true // Enable clear button
          }}
        />
      )}
    />
    ```
*   **File Support:** Has built-in `type="file"` handling via `onValueFileChange`.

### Select (`src/components/ui/select.tsx`)
*   **Data Structure:** `options` prop takes `SelectItems[]` or `SelectGroup[]`.
    *   `SelectItems`: `{ value, label, icon, description, ... }`
*   **Usage:**
    ```tsx
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <Select
          {...field} // Handles value and onChange
          options={[{ value: "admin", label: "Admin" }, { value: "user", label: "User" }]}
          formComposition={{
            label: "Role",
            prefix: <ShieldIcon />
          }}
        />
      )}
    />
    ```
*   **Virtualization:** Supports `virtualComponents` for large lists.
*   **Features:** Searchable by default (via command), avatar support in items.

### DatePicker (`src/components/ui/datepicker/datepicker.tsx`)
*   **Usage:**
    ```tsx
    <FormField
      control={form.control}
      name="dob"
      render={({ field }) => (
        <DatePicker
          {...field} // Handles value (Date object)
          formComposition={{ label: "Date of Birth" }}
          editable={true} // Allows typing the date manually
          inputTime={false} // Set true to include time selection
        />
      )}
    />
    ```
*   **Key Props:**
    *   `editable`: If `true`, renders an input for typing; otherwise, a button trigger.
    *   `inputTime`: Enables time selection granularity.

## 3. General "Gotchas" for Agents
1.  **Do not** wrap `Input`, `Select`, or `DatePicker` in `FormItem > FormLabel` manually if you can use `formComposition`. It duplicates logic and styles.
2.  **Do not** create custom loading states for buttons; use `isLoading`.
3.  **Do not** manually implement "clear value" buttons for inputs; use `inputClear={true}` in `formComposition`.
4.  **Icons:** Use `iconLeft`/`iconRight` props instead of manually placing SVGs inside buttons or inputs.
