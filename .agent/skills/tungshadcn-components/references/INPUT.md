# Input System

## Architecture

All inputs use `FormComposition` wrapper internally:

```
Input/Select/DatePicker
  └── FormComposition (handles label, icons, clear, errors)
        └── FormControl (accessibility bindings)
              └── actual input element
```

---

## Base Input vs InputForm

**Base `Input`** - standalone use:

```tsx
import { Input } from "@/components/ui/input/input"
;<Input
  formComposition={{ label: "Search", iconLeft: <Search /> }}
  onValueChange={(value) => setSearch(value)}
/>
```

**`InputForm`** - inside forms:

```tsx
import { InputForm } from "@/components/ui/input/input-form"
;<InputForm
  control={control}
  name="email"
  type="email"
  formComposition={{ label: "Email" }}
/>
```

---

## Input Types

```tsx
// Text (default)
<InputForm name="name" formComposition={{ label: "Name" }} />

// Email
<InputForm type="email" name="email" formComposition={{ label: "Email" }} />

// Password
<InputForm type="password" name="password" formComposition={{ label: "Password" }} />

// File
<InputForm type="file" name="document" formComposition={{ label: "Document" }} />
```

---

## InputNumberForm

Number input with formatting using Maskito:

```tsx
import { InputNumberForm } from "@/components/ui/input/input-number-form"
;<InputNumberForm
  control={control}
  name="price"
  formComposition={{ label: "Price", prefix: <span>$</span> }}
  maskitoOptions={
    {
      // Maskito options for formatting
    }
  }
/>
```

---

## TextareaForm

Multi-line with auto-resize:

```tsx
import { TextareaForm } from "@/components/ui/textarea/textarea-form"
;<TextareaForm
  control={control}
  name="bio"
  rows={4}
  formComposition={{
    label: "Bio",
    subDescription: `${watch("bio")?.length || 0}/500`,
  }}
/>
```

---

## InputTagForm

Tags/chips input:

```tsx
import { InputTagForm } from "@/components/ui/input/input-tag-form"
;<InputTagForm
  control={control}
  name="skills"
  mode="input" // or "select" for predefined options
  options={[
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
  ]}
  formComposition={{ label: "Skills" }}
/>
```

---

## InputAutoCompleteForm

Autocomplete with search:

```tsx
import { InputAutoCompleteForm } from "@/components/ui/input/input-auto-complete-form"
;<InputAutoCompleteForm
  control={control}
  name="city"
  options={cities}
  formComposition={{ label: "City" }}
/>
```

## InputOTPForm

OTP input with segmented fields:

```tsx
import { InputOTPForm } from "@/components/ui/input-otp-form"

;<InputOTPForm
  control={control}
  name="otp"
  maxLength={6}
  formComposition={{ label: "Mã OTP" }}
/>
```

---

## PasswordValidator

Visual password strength feedback:

```tsx
import { PasswordValidator } from "@/components/ui/password-validator"

;<PasswordValidator
  password={watch("password")}
  requirements={["min8", "uppercase", "special"]}
/>
```

```tsx
<Input
  onValueChange={(value) => console.log(value)} // For text
  onValueFileChange={(files) => console.log(files)} // For file type
  formComposition={{
    onClear: () => console.log("cleared"),
  }}
/>
```

---

## Vietnamese Auto-Placeholder

If no `placeholder` provided, auto-generates from label:

```tsx
<Input formComposition={{ label: "Email" }} />
// Renders: placeholder="Nhập email"
```

To override:

```tsx
<Input placeholder="custom@email.com" formComposition={{ label: "Email" }} />
```
