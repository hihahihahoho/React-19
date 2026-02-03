# SKILL.md Template

Copy and adapt this template for your component library.

---

```yaml
---
name: my-component-lib
description: [Brief description]. Use when building [types of UI], working with [framework], or needing [specific features].
---
```

# [Library Name]

> One-line description of the library.

## When to Use

- Building forms with [form library]
- Need [specific component types]
- Working with [framework/pattern]
- Deciding between [this] and [alternative]

## Quick Start

### Installation

```bash
npx shadcn@latest add [registry-url]/[component].json
```

### Component Discovery

Full component list: `[registry-url]/llms.txt`

## Core Concepts

### 1. Component Selection

| Need         | Use                    |
| ------------ | ---------------------- |
| Text input   | `Input`, `InputForm`   |
| Dropdown     | `Select`, `SelectForm` |
| Data display | `Table`, `DataTable`   |

### 2. Form Pattern

```
form-name/
  schema.ts    # Zod validation
  context.tsx  # Form logic
  form.tsx     # UI only
```

### 3. Form Component Props

All form inputs support `formComposition`:

```tsx
formComposition={{
  label: "Field Label",
  description: "Help text",
  iconLeft: <Icon />,
  inputClear: true,
}}
```

## Reference Files

- [Rules](references/RULES.md) - Component selection guidelines
- [Components](references/COMPONENTS.md) - Full component catalog
- [Form Patterns](references/FORM.md) - Form structure and validation

## Do's and Don'ts

### Do

- Use `*Form` variants inside React Hook Form
- Provide `formComposition.label` for accessibility
- Keep validation in separate schema file

### Don't

- Don't put `useForm` in view components
- Don't mix overlapping components from different libraries
- Don't handle validation in UI files
