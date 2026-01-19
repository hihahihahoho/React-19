---
name: UI From Design
description: Generate React components from design using available UI components
---

# UI From Design Skill

Generate React UI components from design input (image, Figma, or text description).

## Workflow

1. **Analyze design** - Xác định components cần dùng
2. **Write code** - Viết React code trực tiếp
3. **Save files** - Ghi vào path chỉ định

---

## Available Components

**Đọc kỹ danh sách component tại:** https://react-19.octung112.workers.dev/llms.txt

Link trên chứa đầy đủ:

- Tất cả UI components có sẵn
- Import paths
- Props và cách sử dụng
- Form components với `*Form` pattern

---

## Form Patterns

### Basic Form Structure

```tsx
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFormContext } from "react-hook-form"
import { z } from "zod"

// 1. Schema
const schema = z.object({
  name: z.string().min(1, { error: "Name is required" }),
  email: z.email(),
})

// 2. Context wrapper
function FormContext({ children }: { children: React.ReactNode }) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  })

  return (
    <ZodSchemaProvider schema={schema}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(console.log)}>{children}</form>
      </Form>
    </ZodSchemaProvider>
  )
}

// 3. Form UI
function FormInner() {
  const { control } = useFormContext<z.infer<typeof schema>>()

  return (
    <div className="space-y-4">
      <InputForm
        control={control}
        name="name"
        formComposition={{ label: "Name" }}
      />
      <InputForm
        control={control}
        name="email"
        type="email"
        formComposition={{ label: "Email" }}
      />
      <Button type="submit">Submit</Button>
    </div>
  )
}

// 4. Export
function MyForm() {
  return (
    <FormContext>
      <FormInner />
    </FormContext>
  )
}
```

### formComposition Props

Đây là interface đầy đủ cho form field styling:

```tsx
formComposition={{
  // Label & Description
  label: "Field Label",              // Label text
  description: "Help text",          // Description bên dưới input
  subDescription: "0/100",           // Sub description (ví dụ: đếm ký tự) - hiện bên phải
  requiredSymbol: true,              // Hiện dấu * bên cạnh label

  // Layout
  labelPosition: "vertical" | "horizontal",  // Vị trí label (default: vertical)
  layout: {                          // Custom layout cho horizontal
    leftColClass: "md:col-span-4",
    rightColClass: "md:col-span-8",
  },

  // Icons
  iconLeft: <Search className="size-4" />,   // Icon bên trái trong input
  iconRight: <ChevronDown className="size-4" />, // Icon bên phải trong input

  // Prefix/Suffix (trong input container)
  prefix: <span className="text-muted-foreground">$</span>,
  suffix: <span className="text-muted-foreground">VND</span>,

  // Prefix/Suffix (ngoài input container)
  prefixOutside: <Button>Action</Button>,
  suffixOutside: <Button variant="outline">Check</Button>,

  // Clear button
  inputClear: true,                  // Hiện nút xoá khi có value (default: true)
  clearWhenNotFocus: false,          // Hiện nút xoá cả khi không focus

  // Variants
  variant: "default" | "white" | "ghost" | "empty" | "inline",
  size: "sm" | "default" | "lg",

  // States
  disabled: boolean,
  readonly: boolean,

  // Error handling
  showErrorMsg: true,                // Hiện error message từ form validation
  customError: "Custom error text",  // Custom error message (override validation)
}}
```

### formComposition Variants

| Variant   | Mô tả                                  |
| --------- | -------------------------------------- |
| `default` | Border + shadow, phổ biến nhất         |
| `white`   | Background trắng, không border         |
| `ghost`   | Không border, không shadow, trong suốt |
| `empty`   | Minimal, không styling                 |
| `inline`  | Dùng trong table cell                  |

### Ví dụ sử dụng

```tsx
// Basic với label
<InputForm
  control={control}
  name="email"
  formComposition={{ label: "Email", requiredSymbol: true }}
/>

// Với icons
<InputForm
  control={control}
  name="search"
  formComposition={{
    label: "Search",
    iconLeft: <Search className="size-4" />,
    inputClear: true,
  }}
/>

// Với prefix/suffix
<InputForm
  control={control}
  name="price"
  formComposition={{
    label: "Price",
    prefix: <span className="text-muted-foreground">$</span>,
    suffix: <span className="text-muted-foreground">USD</span>,
  }}
/>

// Horizontal layout
<InputForm
  control={control}
  name="username"
  formComposition={{
    label: "Username",
    labelPosition: "horizontal",
    layout: {
      leftColClass: "md:col-span-3",
      rightColClass: "md:col-span-9",
    },
  }}
/>

// Với button bên ngoài
<InputForm
  control={control}
  name="domain"
  formComposition={{
    label: "Domain",
    prefix: <span>https://</span>,
    suffixOutside: <Button variant="outline">Check</Button>,
  }}
/>
```

---

## File Structure Pattern (TanStack Router)

### Cách TanStack Router hoạt động

Khi tạo thư mục và file trong `src/routes/`:

- TanStack **tự động sinh template** khi tạo `index.tsx` hoặc `route.tsx`
- Chỉ cần tạo file, template sẽ được fill sẵn

### Các loại file

| File         | Mô tả                                                                                |
| ------------ | ------------------------------------------------------------------------------------ |
| `index.tsx`  | Entry point của route - hiển thị content chính                                       |
| `route.tsx`  | Layout wrapper - dùng `<Outlet />` cho sub-routes, thường có `staticData: { title }` |
| `$param.tsx` | Dynamic route với parameter                                                          |

### Cấu trúc chuẩn

```
src/routes/{route-name}/
├── (index)/               # Group folder cho index page (không ảnh hưởng URL)
│   ├── -components/       # Components cho index page
│   │   └── {component}.tsx
│   └── index.tsx          # Route entry - TanStack tự sinh
└── route.tsx              # Layout wrapper với Outlet - TanStack tự sinh
```

> **Lưu ý**: Form trong dialog hoặc component nhỏ → gộp schema + context + UI vào **1 file**. Chỉ tách file khi form phức tạp.

### Ví dụ: Contact Page

```
src/routes/contact/
├── (index)/
│   ├── -components/
│   │   └── contact-form.tsx   # Gộp schema + form UI trong 1 file
│   └── index.tsx
└── route.tsx
```

### index.tsx (Route Entry)

TanStack tự sinh template này khi tạo file:

```tsx
import { createFileRoute } from "@tanstack/react-router"
import { ContactForm } from "./-components/contact-form"

export const Route = createFileRoute("/contact/")({
  component: ContactPage,
})

function ContactPage() {
  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold">Contact Us</h1>
      <ContactForm />
    </div>
  )
}
```

### route.tsx (Layout Wrapper)

TanStack tự sinh template, cần sửa thêm:

- `<Outlet />` để render sub-routes
- `staticData: { title }` cho breadcrumb/navigation

```tsx
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/contact")({
  staticData: {
    title: "Liên hệ", // Dùng cho breadcrumb, document title
  },
  component: ContactLayout,
})

function ContactLayout() {
  return (
    <div>
      {/* Có thể thêm header, sidebar riêng cho section này */}
      <Outlet />
    </div>
  )
}
```

### Dynamic Routes

| File           | URL                    |
| -------------- | ---------------------- |
| `index.tsx`    | `/route-name`          |
| `$id.tsx`      | `/route-name/:id`      |
| `settings.tsx` | `/route-name/settings` |

```
src/routes/dashboard/
├── -components/
│   └── stats-card.tsx
├── route.tsx              # Layout với Outlet
├── index.tsx              # /dashboard
├── settings.tsx           # /dashboard/settings
└── $userId.tsx            # /dashboard/:userId
```

### Group Routes (folders)

Dùng `(folder)` để group mà không ảnh hưởng URL:

```
src/routes/admin/
├── (management)/          # Group không ảnh hưởng URL
│   ├── users.tsx          # /admin/users
│   └── roles.tsx          # /admin/roles
├── route.tsx
└── index.tsx
```

---

## DataTable Pattern

DataTable sử dụng Context pattern với `DataTableProvider`:

```tsx
import { DataTable } from "@/components/ui/table/data-table"
import { DataTableProvider } from "@/components/ui/table/data-table-context"
import { DataTableSelection } from "@/components/ui/table/data-table-selection"
import { ShowHideColumnButton } from "@/components/ui/table/show-hide-collumn-button"
import { ColumnDef } from "@tanstack/react-table"

// 1. Define columns in separate file: columns.tsx
export const columns: ColumnDef<DataType>[] = [
  {
    accessorKey: "index",
    header: "STT",
    size: 56,
    meta: { align: "center", pinned: "left" },
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ cell }) => <Badge>{cell.getValue() as string}</Badge>,
  },
  {
    id: "actions",
    size: 56,
    meta: { align: "center", pinned: "right" },
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button iconOnly variant="outline">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// 2. Use in component with DataTableProvider wrapper
function MyTablePage() {
  const data = getData() // your data

  return (
    <DataTableProvider columns={columns} data={data}>
      <div className="space-y-4">
        <div className="flex justify-end">
          <ShowHideColumnButton />
        </div>
        <DataTable variant="rounded" />
        <DataTableSelection>
          <Button variant="outline" isRounded>
            <Download /> Download
          </Button>
          <Button variant="destructive" isRounded>
            <Trash /> Delete
          </Button>
        </DataTableSelection>
      </div>
    </DataTableProvider>
  )
}
```

### Column Meta Options

```tsx
meta: {
  // Text alignment
  align?: "left" | "right" | "center",

  // Header
  hideActionsButton?: boolean,   // Ẩn button dropdown ở header
  headerClassName?: string,      // Custom class cho header

  // Cell
  cellClassName?: string,        // Custom class cho cell
  link?: (row: TData) => LinkProps, // Link props cho cell content

  // Pinning
  pinned?: "left" | "right",     // Vị trí pin mặc định
  pinnedLocked?: boolean,        // Không cho phép user thay đổi pin
  pinnable?: boolean,            // Cho phép pin column (default: true)
  pinOrder?: number,             // Thứ tự pin - số lớn hơn = gần edge hơn
}
```

---

## Alert Dialog (Programmatic)

Dùng `alertDialog` để hiện dialog confirm/warning mà không cần render component:

```tsx
import { alertDialog } from "@/hooks/use-alert-dialog"

// Confirm action
alertDialog({
  status: "warning",
  title: "Xác nhận xoá",
  description: "Bạn có chắc chắn muốn xoá?",
  showCancel: true,
  action: (
    <Button variant="destructive" onClick={() => handleDelete()}>
      Xoá
    </Button>
  ),
})

// Success notification
alertDialog({
  status: "success",
  title: "Thành công",
  description: "Đã lưu thay đổi.",
})
```

### alertDialog Options

```tsx
{
  status?: "default" | "success" | "warning" | "destructive",
  title: ReactNode,
  description?: ReactNode,
  content?: ReactNode,           // Custom content
  action?: ReactNode,            // Action button
  showCancel?: boolean,          // Hiện nút Cancel
  cancelContent?: ReactNode,     // Custom cancel text
  showFooter?: boolean,
  footerOrientation?: "horizontal" | "vertical",
}
```

> **Note**: Cần có `<AlertDialogContainer />` trong layout để render dialogs.

---

## Toast (Sonner) Usage

```tsx
import { toast } from "sonner"

// Success
toast.success("Saved successfully")

// Error
toast.error("Something went wrong")

// With description
toast.success("Title", { description: "Details here" })

// Promise
toast.promise(asyncFn(), {
  loading: "Loading...",
  success: "Done!",
  error: "Failed",
})
```

---

## Quick Reference

### Zod Validators (v4)

```tsx
z.string() // String
z.string().min(1, { error: "Required" })
z.email() // Email (NOT z.string().email())
z.number() // Number
z.boolean() // Boolean
z.date() // Date
z.array(z.string()) // Array of strings
z.enum(["a", "b"]) // Enum
```

---

## Custom Zod Helpers

Import từ `@/lib/zod`:

### zodFile - File Upload Validation

```tsx
import { zodFile } from "@/lib/zod"

const schema = z.object({
  files: zodFile({
    accepted: ["image/png", "image/jpeg", "application/pdf"],
    maxFileSize: 5000000, // 5MB in bytes
    length: { min: 1, max: 5 },
    error: "Vui lòng tải lên ít nhất 1 file.",
  }),
})
```

### zodDate - Date Validation

```tsx
import { zodDate } from "@/lib/zod"

const schema = z.object({
  birthDate: zodDate({
    minDate: new Date("1900-01-01"),
    maxDate: new Date(),
    error: "Ngày sinh là bắt buộc.",
    min_error: "Ngày không hợp lệ.",
    max_error: "Ngày phải trong quá khứ.",
  }),
})
```

### zodDateRange - Date Range Validation

```tsx
import { zodDateRange } from "@/lib/zod"

const schema = z.object({
  dateRange: zodDateRange({
    minDate: new Date("2024-01-01"),
    maxDate: new Date("2025-12-31"),
    minRange: 1, // Ít nhất 1 ngày
    maxRange: 30, // Tối đa 30 ngày
  }),
})

// Returns { from: Date, to: Date }
```
