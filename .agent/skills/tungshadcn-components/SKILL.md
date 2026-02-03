---
name: tungshadcn-components
description: TungShadcn component registry. Use when building UI with this registry, creating forms, or deciding between registry and native shadcn/ui.
---

# TungShadcn Components

> Custom shadcn/ui registry with advanced patterns.

## Documentation

- **Component list:** `https://react-19.octung112.workers.dev/llms.txt`
- **Examples:** `src/stories/`
- **Registry:** `https://react-19.octung112.workers.dev`

## Installation

```bash
npx shadcn@latest add https://react-19.octung112.workers.dev/r/[component].json
```

---

## Key Differences from Traditional shadcn/ui

### 1. FormComposition Pattern

All form inputs use `FormComposition` - a unified wrapper that handles label, icons, clear button, error messages:

```tsx
// TungShadcn way (unified formComposition prop)
<Input
  formComposition={{
    label: "Email",
    description: "Help text",
    iconLeft: <Mail />,
    inputClear: true,
  }}
/>

// NOT like vanilla shadcn (separate components)
<FormItem>
  <FormLabel>Email</FormLabel>
  <FormControl><Input /></FormControl>
  <FormDescription>Help text</FormDescription>
</FormItem>
```

### 2. ZodSchemaProvider for Auto Required Detection

Wrap forms with `ZodSchemaProvider` to auto-detect required fields:

```tsx
<ZodSchemaProvider schema={FormSchema}>
  <Form {...form}>
    {/* InputForm/SelectForm auto-show * for required fields */}
  </Form>
</ZodSchemaProvider>
```

### 3. \*Form Component Variants

Every input has a `*Form` variant for React Hook Form integration:

| Base Component | Form Variant     |
| -------------- | ---------------- |
| `Input`        | `InputForm`      |
| `Select`       | `SelectForm`     |
| `DatePicker`   | `DatePickerForm` |
| `Checkbox`     | `CheckboxForm`   |

```tsx
// Use *Form inside forms
<InputForm control={control} name="email" formComposition={{ label: "Email" }} />

// Use base component outside forms
<Input formComposition={{ label: "Search" }} />
```

### 4. Programmatic Alert Dialog

Call `alertDialog()` anywhere (no need for component):

```tsx
import { alertDialog } from "@/hooks/use-alert-dialog"

alertDialog({
  title: "Delete item?",
  description: "This cannot be undone.",
  action: <Button onClick={handleDelete}>Delete</Button>,
  status: "destructive", // "default" | "success" | "warning" | "destructive"
})
```

Requires `<AlertDialogContainer />` in root layout.

### 5. DataTable with Context Provider

Wrap table with `DataTableProvider`, use `useDataTable()` hook:

```tsx
<DataTableProvider columns={columns} data={data}>
  <DataTable />
  <SomeOtherComponent /> {/* Can access table via useDataTable() */}
</DataTableProvider>
```

### 6. ResponsivePopover

Automatically switches between Popover (desktop) and Drawer (mobile):

```tsx
<ResponsivePopover>
  <ResponsivePopoverTrigger asChild>
    <Button>Open</Button>
  </ResponsivePopoverTrigger>
  <ResponsivePopoverContent>
    {/* Popover on desktop, Drawer on mobile */}
  </ResponsivePopoverContent>
</ResponsivePopover>
```

### 7. Select with Virtualization

Handles 1000+ items efficiently:

```tsx
import { SelectCommandVirtualize } from "@/components/ui/select/select-command-virtualize"
;<Select options={largeOptions} virtualComponents={SelectCommandVirtualize} />
```

### 8. Vietnamese Default Placeholders

Components auto-generate Vietnamese placeholders from label:

```tsx
<Input formComposition={{ label: "Email" }} />
// Placeholder: "Nhập email"

<Select formComposition={{ label: "Quốc gia" }} />
// Placeholder: "Chọn quốc gia"
```

---

## Sub-Skills

- [Form patterns](form/SKILL.md) - React Hook Form + Zod integration

## References

- [Component Rules](references/RULES.md) - Core selection logic for TungShadcn vs Native, and Base vs `*Form` variants.
- [Input System](references/INPUT.md) - `Input`, `InputNumber`, `InputTag`, `InputOTP`, `Textarea`, and auto-placeholders.
- [Select System](references/SELECT.md) - Virtualization, multi-select, and server-side search patterns.
- [Selection Controls](references/SELECTION-CONTROLS.md) - `Checkbox`, `Radio`, `Switch`, `Rating`, `Slider`, and `CheckboxTree`.
- [Calendar & Dates](references/CALENDAR-DATE.md) - `Calendar`, `DatePicker`, `DateRangePicker`, and masked `DateTimeInput`.
- [Data Table](references/DATA-TABLE.md) - `DataTableProvider` context pattern, column pinning, and React Query integration.
- [Display Components](references/DISPLAY.md) - `Alert`, `Avatar`, `Badge`, `CircleProgress`, and `DataRow`.
- [Navigation & Tabs](references/NAVIGATION.md) - Responsive `CombinedPagination` and animated `TabsLine`.
- [Layout & Items](references/LAYOUT.md) - Responsive `OverflowGroup` calculations and `ScrollArea`.
- [Carousel (Swiper)](references/CAROUSEL.md) - Advanced `Swiper.js` implementation, dynamic dots, and 3D effects.
- [Sortable (D&D)](references/SORTABLE.md) - `dnd-kit` wrapper for lists and multi-container Kanban grids.
- [Alert Dialog](references/ALERT-DIALOG.md) - Programmatic `alertDialog()` system for status and confirmation prompts.
- [Overlays & Gallery](references/OVERLAYS.md) - `ResponsivePopover`, `sonnerToast`, and `Photoswipe` media gallery.
- [File Upload](references/FILE-UPLOAD.md) - `FileUploadGrid`, `FileUploadList`, `ImageCrop`, and remote file handling.
- [Signature Pad](references/SIGNATURE-PAD.md) - Compound drawing pad with auto-trimming and history management.
- [Common Hooks](references/HOOKS.md) - `useMobile`, `useMediaQuery`, `useResizeObserver`, and `useHistoryState`.
- [Utilities & Misc](references/UTILITIES.md) - `Copy`, `Sticky`, `SVGInline`, `GlassIcon`, `EmptyState`, and `Typography`.
- [Libraries & Utils](references/LIBRARY-UTILS.md) - Vietnamese transliteration, Number-to-Words, and Zod extensions.
- [Missing Guide](references/MISSING.md) - Quick list of when to stick with native `shadcn/ui` components.

## Quick Reference

| Need          | Use                                         |
| ------------- | ------------------------------------------- |
| Form inputs   | `InputForm`, `SelectForm`, `DatePickerForm` |
| Data table    | `DataTableProvider` + `DataTable`           |
| File upload   | `FileUpload`, `FileUploadList`              |
| Toast         | `toast` from sonner                         |
| Alert dialog  | `alertDialog()` from `use-alert-dialog`     |
| Carousel      | `Swiper`                                    |
| Mobile drawer | `ResponsivePopover`                         |
