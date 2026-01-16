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

### Form Components (use with react-hook-form)

Khi tạo form, luôn dùng version `*Form` với `control` prop:

| Component               | Import                                                     | Key Props                                         |
| ----------------------- | ---------------------------------------------------------- | ------------------------------------------------- |
| `InputForm`             | `@/components/ui/input/input-form`                         | `control`, `name`, `type`, `formComposition`      |
| `InputNumberForm`       | `@/components/ui/input/input-number-form`                  | `control`, `name`, `formComposition`              |
| `InputTagForm`          | `@/components/ui/input/input-tag-form`                     | `control`, `name`, `options`, `mode`              |
| `InputAutoCompleteForm` | `@/components/ui/input/input-auto-complete-form`           | `control`, `name`, `options`                      |
| `TextareaForm`          | `@/components/ui/textarea/textarea-form`                   | `control`, `name`, `maxLength`, `formComposition` |
| `SelectForm`            | `@/components/ui/select/select-form`                       | `control`, `name`, `options`, `formComposition`   |
| `MultiselectForm`       | `@/components/ui/select/multiselect-form`                  | `control`, `name`, `options`                      |
| `CheckboxForm`          | `@/components/ui/selection-controls/checkbox-form`         | `control`, `name`, children                       |
| `CheckboxGroupForm`     | `@/components/ui/selection-controls/checkbox-group-form`   | `control`, `name`, `options`                      |
| `RadioGroupForm`        | `@/components/ui/selection-controls/radio-group-form`      | `control`, `name`, `options`                      |
| `SwitchForm`            | `@/components/ui/selection-controls/switch-form`           | `control`, `name`                                 |
| `DatePickerForm`        | `@/components/ui/datepicker/datepicker-form`               | `control`, `name`, `formComposition`              |
| `DateRangePickerForm`   | `@/components/ui/date-range-picker/date-range-picker-form` | `control`, `name`                                 |
| `RatingForm`            | `@/components/ui/rating/rating-form`                       | `control`, `name`, `max`                          |
| `SliderForm`            | `@/components/ui/slider-form`                              | `control`, `name`, `min`, `max`                   |
| `InputOTPForm`          | `@/components/ui/input-otp-form`                           | `control`, `name`, `maxLength`                    |
| `FileUploadForm`        | `@/components/ui/file-upload/file-upload-form`             | `control`, `name`                                 |
| `ImageCropAvatarForm`   | `@/components/ui/image-crop-avatar-form`                   | `control`, `name`                                 |

### Layout Components

| Component                                                                                                      | Import                      | Key Props      |
| -------------------------------------------------------------------------------------------------------------- | --------------------------- | -------------- |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`                              | `@/components/ui/card`      | `className`    |
| `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` | `@/components/ui/dialog`    | -              |
| `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`                                           | `@/components/ui/sheet`     | `side`         |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`                                                               | `@/components/ui/tabs/tabs` | `defaultValue` |
| `Separator`                                                                                                    | `@/components/ui/separator` | `orientation`  |

### Data Display

| Component                                 | Import                                           | Key Props                      |
| ----------------------------------------- | ------------------------------------------------ | ------------------------------ |
| `DataTable`                               | `@/components/ui/table/data-table`               | `variant`, `showPagination`    |
| `DataTableProvider`                       | `@/components/ui/table/data-table-context`       | `columns`, `data`, `pageSize`  |
| `DataTableSelection`                      | `@/components/ui/table/data-table-selection`     | children (action buttons)      |
| `ShowHideColumnButton`                    | `@/components/ui/table/show-hide-collumn-button` | -                              |
| `Badge`                                   | `@/components/ui/badge`                          | `variant`                      |
| `Alert`, `AlertTitle`, `AlertDescription` | `@/components/ui/alert`                          | `variant`                      |
| `EmptyState`                              | `@/components/ui/empty-state`                    | `icon`, `title`, `description` |
| `Skeleton`                                | `@/components/ui/skeleton`                       | `className`                    |
| `CircleProgress`                          | `@/components/ui/circle-progress`                | `value`, `max`                 |

### Actions

| Component      | Import                          | Key Props                                                           |
| -------------- | ------------------------------- | ------------------------------------------------------------------- |
| `Button`       | `@/components/ui/button`        | `variant`, `size`, `iconOnly`, `isRounded`, `isLoading`, `disabled` |
| `DropdownMenu` | `@/components/ui/dropdown-menu` | -                                                                   |
| `ContextMenu`  | `@/components/ui/context-menu`  | -                                                                   |
| `CopyButton`   | `@/components/ui/copy-button`   | `value`                                                             |

> **Note**: `Button` giống shadcn/ui nhưng thêm:
>
> - `iconOnly` - button chỉ chứa icon, không padding sides
> - `isRounded` - bo tròn full (`rounded-full`)
> - `isLoading` - hiện loading spinner

### Feedback

| Component           | Import                   | Usage                                              |
| ------------------- | ------------------------ | -------------------------------------------------- |
| `toast`             | `sonner`                 | `toast.success("Message")`, `toast.error("Error")` |
| `Sonner` (provider) | `@/components/ui/sonner` | Add to layout once                                 |

### Special Components

| Component           | Import                                      | Key Props                                     |
| ------------------- | ------------------------------------------- | --------------------------------------------- |
| `InputTag`          | `@/components/ui/input/input-tag`           | `options`, `mode`, `maxTags`, `onValueChange` |
| `InputAutoComplete` | `@/components/ui/input/input-auto-complete` | `options`, `onSelect`                         |
| `Multiselect`       | `@/components/ui/select/multiselect`        | `options`, `value`, `onValueChange`           |
| `Sortable`          | `@/components/ui/sortable`                  | `items`, `onReorder`                          |
| `Swiper`            | `@/components/ui/swiper/swiper`             | `slides`                                      |
| `PhotoSwipe`        | `@/components/ui/photoswipe`                | `images`                                      |
| `ImageCrop`         | `@/components/ui/image-crop`                | `src`, `onCrop`                               |
| `FileUpload`        | `@/components/ui/file-upload/file-upload`   | `onFilesChange`, `accept`, `maxFiles`         |

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

Khi generate UI cho route page:

```
src/routes/{route-name}/
├── -components/           # Logic & reusable parts
│   ├── schema.ts          # Zod validation schema (if form)
│   ├── context.tsx        # Form context (if form)
│   └── {component}.tsx    # UI components
├── index.tsx              # Route page (main entry)
└── route.tsx              # Route definition (optional)
```

### Ví dụ: Contact Page

```
src/routes/contact/
├── -components/
│   ├── schema.ts
│   ├── context.tsx
│   └── contact-form.tsx
├── index.tsx              # Route page - import ContactForm
└── route.tsx              # createFileRoute('/contact')
```

### index.tsx (Route Page)

```tsx
import { createFileRoute } from "@tanstack/react-router"
import { ContactForm } from "./-components/contact-form"

export const Route = createFileRoute("/contact")({
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

### Dynamic Route Names

Route file có thể có tên khác ngoài `index.tsx`:

- `index.tsx` → `/route-name`
- `$id.tsx` → `/route-name/:id` (dynamic param)
- `card-abc.tsx` → `/route-name/card-abc`

```
src/routes/dashboard/
├── -components/
│   └── stats-card.tsx
├── index.tsx              # /dashboard
├── settings.tsx           # /dashboard/settings
└── $userId.tsx            # /dashboard/:userId
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

## Dialog Pattern

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
;<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button>Action</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

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
