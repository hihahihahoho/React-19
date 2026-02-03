# Component Catalog Template

Copy and adapt this template for your component library.

---

# Component Catalog

## Inputs

### Input

Basic text input with optional icons and clear button.

**Import:** `import { Input } from "@/components/ui/input"`

**Props:**

- `type` (string) - Input type: text, email, password, etc.
- `placeholder` (string) - Placeholder text
- `disabled` (boolean) - Disable input
- `readOnly` (boolean) - Read-only mode

**Form variant:** `InputForm`

---

### Select

Single-value dropdown with search support.

**Import:** `import { Select } from "@/components/ui/select"`

**Props:**

- `options` (Option[]) - Array of { value, label } objects
- `value` (string) - Selected value
- `onValueChange` (fn) - Change handler
- `placeholder` (string) - Empty state text

**Form variant:** `SelectForm`

---

## Display

### Table

Basic table for data display.

**Import:** `import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"`

**Usage:**

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableCell>Name</TableCell>
      <TableCell>Email</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((row) => (
      <TableRow key={row.id}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

### DataTable

Advanced table with sorting, filtering, and selection.

**Import:** `import { DataTable } from "@/components/ui/data-table"`

**Props:**

- `columns` (ColumnDef[]) - Column definitions
- `data` (T[]) - Data array

**Usage:**

```tsx
<DataTableProvider columns={columns} data={data}>
  <DataTable />
</DataTableProvider>
```

---

## Feedback

### Toast

Transient notification.

**Import:** `import { toast } from "sonner"`

**Usage:**

```tsx
toast.success("Saved successfully")
toast.error("Something went wrong")
```

---

### AlertDialog

Confirmation dialog.

**Import:** `import { alertDialog } from "@/hooks/use-alert-dialog"`

**Usage:**

```tsx
alertDialog({
  status: "warning",
  title: "Confirm delete?",
  description: "This action cannot be undone.",
  action: <Button onClick={handleDelete}>Delete</Button>,
})
```

---

## Layout

### Card

Content container with optional header and footer.

**Import:** `import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"`

**Usage:**

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

---

## Missing Components

The following should be installed from native shadcn/ui:

- Accordion
- Breadcrumb
- Collapsible
- Context Menu
- Dropdown Menu
- Hover Card
- Menubar
- Navigation Menu
- Progress
- Separator
- Skeleton
- Toggle
- Tooltip
