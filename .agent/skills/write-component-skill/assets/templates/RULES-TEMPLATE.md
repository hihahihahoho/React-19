# Rules Template

Copy and adapt this template for your component library.

---

# Core Rules

## Component Selection

1. Prefer [library-name] components when they exist and provide [advantage].
2. Use native [alternative] components for items listed in MISSING.md.
3. Avoid mixing overlapping components from multiple libraries.
4. Keep component usage consistent within a page.

## Installation

```bash
# Install command template
npx shadcn@latest add [registry-url]/[component].json
```

- Dependencies are pulled automatically
- No need to install sub-components manually

## Usage by Category

### Inputs

- Use `Input` for text entry
- Use `InputForm` when inside React Hook Form
- Use `Select` for single selection
- Use `MultiSelect` for multiple selections

### Display

- Use `Table` for simple data display
- Use `DataTable` for sortable/filterable data
- Use `Card` for content containers

### Feedback

- Use `Toast` for transient notifications
- Use `AlertDialog` for confirmations
- Use `Dialog` for forms and complex content

### Layout

- Use `ScrollArea` for scrollable containers
- Use `Tabs` for content organization

## Form Integration

- Always use `*Form` variants inside forms
- Wrap forms with schema provider for required field detection
- Keep validation in separate schema file

## AI-Ready Guidance

- When asked "add [component]," install from registry URL
- When asked "what's available," list relevant category
- When asked for missing component, suggest native alternative
