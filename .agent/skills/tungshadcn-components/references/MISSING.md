# Missing Components

The TungShadcn registry is a curated collection of **advanced** components. Many standard UI primitives are intentionally omitted because the native `shadcn/ui` versions are sufficient.

---

## Use Native shadcn/ui for:

If a component is not in TungShadcn, install it from the official registry:

### Feedback & Overlays

- Accordion
- Collapsible
- Context Menu
- Dropdown Menu
- Hover Card
- Popover (Basic version - use `ResponsivePopover` from TungShadcn otherwise)
- Sheet
- Tooltip

### Layout & Structure

- Aspect Ratio
- Breadcrumb
- Card
- Progress (Linear)
- Resizable
- Separator
- Skeleton

### Data Display & Navigation

- Menubar
- Navigation Menu
- Pagination (Basic - TungShadcn has its own `DataTablePagination`)
- Tabs (Basic - TungShadcn has `TabsLine`)

### Controls

- Label (Standalone)
- Toggle
- Toggle Group

---

## When to Switch

If you are currently using a native `shadcn/ui` component and need one of the following, switch to the TungShadcn version:

| Native shadcn/ui | Switch to TungShadcn if you need:                                      |
| ---------------- | ---------------------------------------------------------------------- |
| `Input`          | `FormComposition` patterns, `*Form` integration, or auto-placeholders. |
| `Select`         | Search, virtualization (1000+ items), or mobile drawer fallback.       |
| `Table`          | Pagination, sorting, row selection, or sticky headers/columns.         |
| `Dialog`         | Programmatic control via `alertDialog()` hook.                         |
| `Popover`        | Mobile-friendly behavior (see `ResponsivePopover`).                    |

---

## Installation Helper

```bash
# Add a native shadcn/ui component
npx shadcn@latest add [component-name]

# Add a TungShadcn component
npx shadcn@latest add https://react-19.octung112.workers.dev/r/[component].json
```
