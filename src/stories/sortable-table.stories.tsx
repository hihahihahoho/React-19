import { Badge } from "@/components/ui/badge/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input/input"
import { Select } from "@/components/ui/select/select"
import {
  RowDragHandleCell,
  SortableTable,
} from "@/components/ui/table/sortable-table"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ColumnDef } from "@tanstack/react-table"
import { AlertCircle, Check, Clock, Mail, Phone, User } from "lucide-react"
import { useState } from "react"

/**
 * SortableTable component allows users to reorder table rows via drag and drop.
 * Built with the Sortable component and @tanstack/react-table for smooth interactions.
 */
const meta = {
  title: "Data Display/SortableTable",
  component: SortableTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/sortable-table.json
\`\`\`

SortableTable provides drag-and-drop functionality for table rows, allowing users to manually reorder data.
It integrates seamlessly with TanStack Table and uses the Sortable component for smooth drag interactions.

## When to use
- To allow users to prioritize or organize items manually
- For kanban boards, task lists, or custom ordering scenarios
- When the order of items matters and should be user-controlled
- For building dashboards with customizable widget arrangements

## Features
- **Drag handle**: Each row has a dedicated drag handle for intuitive interaction
- **Visual feedback**: Rows become semi-transparent while dragging with overlay effect
- **Smooth animations**: Transitions provide polish during reordering
- **Type-safe**: Full TypeScript support with generic data types
- **Flexible**: Works with any data structure that includes a \`uid\` property
- **Accessible**: Built-in keyboard support and screen reader announcements

## Accessibility
- Drag handles are keyboard accessible with proper ARIA attributes
- Screen reader announcements for drag and drop actions
- Keyboard navigation with arrow keys for reordering
- Visual indicators show dragging state
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex w-full items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

// Sample data types
type Task = {
  uid: string
  name: string
  status: "completed" | "in-progress" | "pending"
  priority: number
}

type Person = {
  uid: string
  name: string
  email: string
  phone: string
  role: string
}

type Product = {
  uid: string
  product: string
  category: string
  price: number
  stock: number
}

/**
 * Basic example with simple task data and drag-to-reorder functionality.
 */
const BasicExample = () => {
  const [data, setData] = useState<Task[]>([
    {
      uid: "1",
      name: "Review pull requests",
      status: "completed",
      priority: 1,
    },
    {
      uid: "2",
      name: "Update documentation",
      status: "in-progress",
      priority: 2,
    },
    {
      uid: "3",
      name: "Fix bug in authentication",
      status: "pending",
      priority: 3,
    },
    { uid: "4", name: "Implement new feature", status: "pending", priority: 4 },
  ])

  const columns: ColumnDef<Task>[] = [
    {
      id: "drag-handle",
      header: "",
      cell: () => <RowDragHandleCell />,
      size: 60,
      meta: { cellClassName: "w-[60px]" },
    },
    {
      accessorKey: "name",
      header: "Task",
      cell: (info) => (
        <div className="font-medium">{info.getValue() as string}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as Task["status"]
        const statusConfig = {
          completed: {
            variant: "green" as const,
            icon: <Check className="size-4" />,
          },
          "in-progress": {
            variant: "blue" as const,
            icon: <Clock className="size-4" />,
          },
          pending: {
            variant: "orange" as const,
            icon: <AlertCircle className="size-4" />,
          },
        }
        const config = statusConfig[status]
        return (
          <Badge variant={config.variant} iconLeft={config.icon}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: (info) => (
        <span className="text-muted-foreground">
          {info.getValue() as number}
        </span>
      ),
    },
  ]

  return (
    <div className="w-full max-w-3xl">
      <SortableTable columns={columns} data={data} onDataChange={setData} />
    </div>
  )
}

export const Basic: Story = {
  render: () => <BasicExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A basic sortable table with tasks. Drag the grip icon to reorder rows. The data automatically updates when rows are moved.",
      },
    },
  },
}

/**
 * Table with team members showing contact information.
 */
const TeamMembersExample = () => {
  const [data, setData] = useState<Person[]>([
    {
      uid: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1 234-567-8901",
      role: "Frontend Developer",
    },
    {
      uid: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "+1 234-567-8902",
      role: "Backend Developer",
    },
    {
      uid: "3",
      name: "Carol White",
      email: "carol@example.com",
      phone: "+1 234-567-8903",
      role: "Designer",
    },
    {
      uid: "4",
      name: "David Brown",
      email: "david@example.com",
      phone: "+1 234-567-8904",
      role: "Product Manager",
    },
    {
      uid: "5",
      name: "Eve Davis",
      email: "eve@example.com",
      phone: "+1 234-567-8905",
      role: "DevOps Engineer",
    },
  ])

  const columns: ColumnDef<Person>[] = [
    {
      id: "drag-handle",
      header: "",
      cell: () => <RowDragHandleCell />,
      size: 60,
      meta: { cellClassName: "w-[60px]" },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <User className="text-muted-foreground size-4" />
          <span className="font-medium">{info.getValue() as string}</span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: (info) => (
        <Badge variant="secondary" size="sm">
          {info.getValue() as string}
        </Badge>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Mail className="size-4" />
          {info.getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: (info) => (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Phone className="size-4" />
          {info.getValue() as string}
        </div>
      ),
    },
  ]

  return (
    <div className="w-full max-w-5xl">
      <SortableTable columns={columns} data={data} onDataChange={setData} />
    </div>
  )
}

export const TeamMembers: Story = {
  render: () => <TeamMembersExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A sortable table displaying team member information with contact details and roles. Reorder team members by dragging.",
      },
    },
  },
}

/**
 * Product inventory table with pricing and stock information.
 */
const ProductInventoryExample = () => {
  const [data, setData] = useState<Product[]>([
    {
      uid: "1",
      product: "Wireless Mouse",
      category: "Electronics",
      price: 29.99,
      stock: 150,
    },
    {
      uid: "2",
      product: "Mechanical Keyboard",
      category: "Electronics",
      price: 89.99,
      stock: 75,
    },
    {
      uid: "3",
      product: "USB-C Cable",
      category: "Accessories",
      price: 12.99,
      stock: 300,
    },
    {
      uid: "4",
      product: "Laptop Stand",
      category: "Accessories",
      price: 49.99,
      stock: 50,
    },
    {
      uid: "5",
      product: "Webcam HD",
      category: "Electronics",
      price: 79.99,
      stock: 100,
    },
    {
      uid: "6",
      product: 'Monitor 27"',
      category: "Electronics",
      price: 299.99,
      stock: 25,
    },
    {
      uid: "7",
      product: "Desk Mat",
      category: "Accessories",
      price: 24.99,
      stock: 200,
    },
  ])

  const columns: ColumnDef<Product>[] = [
    {
      id: "drag-handle",
      header: "",
      cell: () => <RowDragHandleCell />,
      size: 60,
      meta: { cellClassName: "w-[60px]" },
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: (info) => (
        <div className="font-medium">{info.getValue() as string}</div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: (info) => {
        const category = info.getValue() as string
        return (
          <Badge
            variant={category === "Electronics" ? "blue" : "purple"}
            size="sm"
          >
            {category}
          </Badge>
        )
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: (info) => (
        <span className="font-mono text-sm">
          ${(info.getValue() as number).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: (info) => {
        const stock = info.getValue() as number
        return (
          <Badge
            variant={stock > 100 ? "green" : stock > 50 ? "orange" : "red"}
            size="sm"
          >
            {stock} units
          </Badge>
        )
      },
    },
  ]

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Product Inventory</h3>
        <p className="text-muted-foreground text-sm">
          Drag to reorder products by priority or display order
        </p>
      </div>
      <SortableTable columns={columns} data={data} onDataChange={setData} />
    </div>
  )
}

export const ProductInventory: Story = {
  render: () => <ProductInventoryExample />,
  parameters: {
    docs: {
      description: {
        story:
          "An inventory table with products, categories, pricing, and stock levels. Useful for managing display order or priority.",
      },
    },
  },
}

/**
 * Compact table with minimal styling for space-constrained layouts.
 */
const CompactExample = () => {
  const [data, setData] = useState<Task[]>([
    { uid: "1", name: "Design homepage", status: "completed", priority: 1 },
    { uid: "2", name: "Write API docs", status: "in-progress", priority: 2 },
    { uid: "3", name: "Code review", status: "pending", priority: 3 },
    { uid: "4", name: "Deploy to staging", status: "pending", priority: 4 },
    { uid: "5", name: "Update dependencies", status: "pending", priority: 5 },
  ])

  const columns: ColumnDef<Task>[] = [
    {
      id: "drag-handle",
      header: "",
      cell: () => <RowDragHandleCell />,
      size: 40,
      meta: { cellClassName: "w-[40px]" },
    },
    {
      accessorKey: "name",
      header: "Task",
      cell: (info) => (
        <div className="text-sm">{info.getValue() as string}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as Task["status"]
        const statusConfig = {
          completed: { variant: "green" as const, text: "Done" },
          "in-progress": { variant: "blue" as const, text: "Active" },
          pending: { variant: "zinc" as const, text: "Todo" },
        }
        const config = statusConfig[status]
        return (
          <Badge variant={config.variant} size="sm">
            {config.text}
          </Badge>
        )
      },
    },
  ]

  return (
    <div className="w-full max-w-2xl">
      <SortableTable columns={columns} data={data} onDataChange={setData} />
    </div>
  )
}

export const Compact: Story = {
  render: () => <CompactExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A compact version of the sortable table with minimal styling, ideal for sidebars or smaller spaces.",
      },
    },
  },
}

/**
 * Table with many rows to demonstrate scrolling behavior.
 */
const WithManyRowsExample = () => {
  const [data, setData] = useState<Task[]>(
    Array.from({ length: 20 }, (_, i) => ({
      uid: `${i + 1}`,
      name: `Task ${i + 1}: ${["Design", "Development", "Testing", "Deployment", "Documentation"][i % 5]}`,
      status: ["completed", "in-progress", "pending"][i % 3] as Task["status"],
      priority: i + 1,
    }))
  )

  const columns: ColumnDef<Task>[] = [
    {
      id: "drag-handle",
      header: "",
      cell: () => <RowDragHandleCell />,
      size: 60,
      meta: { cellClassName: "w-[60px]" },
    },
    {
      accessorKey: "priority",
      header: "#",
      cell: (info) => (
        <span className="text-muted-foreground font-mono text-sm">
          {info.getValue() as number}
        </span>
      ),
      size: 60,
    },
    {
      accessorKey: "name",
      header: "Task Name",
      cell: (info) => (
        <div className="font-medium">{info.getValue() as string}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as Task["status"]
        const statusConfig = {
          completed: {
            variant: "green" as const,
            icon: <Check className="size-4" />,
          },
          "in-progress": {
            variant: "blue" as const,
            icon: <Clock className="size-4" />,
          },
          pending: {
            variant: "orange" as const,
            icon: <AlertCircle className="size-4" />,
          },
        }
        const config = statusConfig[status]
        return (
          <Badge variant={config.variant} iconLeft={config.icon} size="sm">
            {status}
          </Badge>
        )
      },
    },
  ]

  const handleDataChange = (newData: Task[]) => {
    // Update priority based on new position
    const updatedData = newData.map((item, index) => ({
      ...item,
      priority: index + 1,
    }))
    setData(updatedData)
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Task Priority List</h3>
        <p className="text-muted-foreground text-sm">
          {data.length} tasks • Drag to reorder by priority
        </p>
      </div>
      <SortableTable
        columns={columns}
        data={data}
        onDataChange={handleDataChange}
      />
    </div>
  )
}

export const WithManyRows: Story = {
  render: () => <WithManyRowsExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A table with many rows demonstrating smooth scrolling behavior. The priority numbers automatically update when rows are reordered.",
      },
    },
  },
}

/**
 * Complete example showing all features and best practices.
 */
const CompleteExampleDemo = () => {
  const [data, setData] = useState<Task[]>([
    {
      uid: "1",
      name: "Fix authentication bug",
      status: "in-progress",
      priority: 1,
    },
    { uid: "2", name: "Review security audit", status: "pending", priority: 2 },
    {
      uid: "3",
      name: "Deploy v2.0 to production",
      status: "pending",
      priority: 3,
    },
    {
      uid: "4",
      name: "Update user documentation",
      status: "completed",
      priority: 4,
    },
    {
      uid: "5",
      name: "Optimize database queries",
      status: "in-progress",
      priority: 5,
    },
    {
      uid: "6",
      name: "Implement new dashboard",
      status: "pending",
      priority: 6,
    },
  ])

  const columns: ColumnDef<Task>[] = [
    {
      id: "drag-handle",
      header: "Reorder",
      cell: () => <RowDragHandleCell />,
      size: 80,
      meta: { cellClassName: "w-[80px]" },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: (info) => (
        <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm font-semibold">
          {info.getValue() as number}
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: "name",
      header: "Task Description",
      cell: (info) => (
        <div className="font-medium">{info.getValue() as string}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as Task["status"]
        const statusConfig = {
          completed: {
            variant: "green" as const,
            icon: <Check className="size-4" />,
            label: "Completed",
          },
          "in-progress": {
            variant: "blue" as const,
            icon: <Clock className="size-4" />,
            label: "In Progress",
          },
          pending: {
            variant: "orange" as const,
            icon: <AlertCircle className="size-4" />,
            label: "Pending",
          },
        }
        const config = statusConfig[status]
        return (
          <Badge variant={config.variant} iconLeft={config.icon}>
            {config.label}
          </Badge>
        )
      },
    },
  ]

  const handleDataChange = (newData: Task[]) => {
    // Update priority to reflect new order
    const updatedData = newData.map((item, index) => ({
      ...item,
      priority: index + 1,
    }))
    setData(updatedData)
  }

  const completedCount = data.filter(
    (task) => task.status === "completed"
  ).length
  const inProgressCount = data.filter(
    (task) => task.status === "in-progress"
  ).length

  return (
    <div className="w-full max-w-5xl space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Project Tasks</h3>
        <p className="text-muted-foreground text-sm">
          Drag tasks to reorder by priority • {completedCount} completed •{" "}
          {inProgressCount} in progress
        </p>
      </div>

      <div className="flex gap-2">
        <Badge variant="green" iconLeft={<Check className="size-4" />}>
          {completedCount} Completed
        </Badge>
        <Badge variant="blue" iconLeft={<Clock className="size-4" />}>
          {inProgressCount} Active
        </Badge>
        <Badge variant="orange" iconLeft={<AlertCircle className="size-4" />}>
          {data.length - completedCount - inProgressCount} Pending
        </Badge>
      </div>

      <SortableTable
        columns={columns}
        data={data}
        onDataChange={handleDataChange}
      />

      <div className="rounded-lg border border-dashed p-4">
        <p className="text-muted-foreground text-sm">
          <strong>Tip:</strong> Click and drag the grip icon to reorder tasks.
          The priority numbers will automatically update based on the new order.
        </p>
      </div>
    </div>
  )
}

export const CompleteExample: Story = {
  render: () => <CompleteExampleDemo />,
  parameters: {
    docs: {
      description: {
        story: `
A complete example demonstrating all features:

- **Drag handles** for intuitive reordering
- **Priority indicators** that update automatically
- **Status badges** with icons and colors
- **Summary statistics** showing task counts
- **User guidance** with helpful tips

This example shows best practices for implementing sortable tables in production applications.
        `,
      },
    },
  },
}

/**
 * Form example that submits only the reordered IDs.
 * Useful for updating priorities or display order on the server.
 */
const FormSubmitIdsExample = () => {
  const [data, setData] = useState<Task[]>([
    {
      uid: "task-1",
      name: "Design homepage",
      status: "completed",
      priority: 1,
    },
    {
      uid: "task-2",
      name: "Write API docs",
      status: "in-progress",
      priority: 2,
    },
    { uid: "task-3", name: "Code review", status: "pending", priority: 3 },
    {
      uid: "task-4",
      name: "Deploy to staging",
      status: "pending",
      priority: 4,
    },
    {
      uid: "task-5",
      name: "Update dependencies",
      status: "pending",
      priority: 5,
    },
  ])

  const [submittedOrder, setSubmittedOrder] = useState<string[] | null>(null)

  const columns: ColumnDef<Task>[] = [
    {
      id: "drag-handle",
      header: "",
      cell: () => <RowDragHandleCell />,
      size: 60,
      meta: { cellClassName: "w-[60px]" },
    },
    {
      accessorKey: "priority",
      header: "#",
      cell: (info) => (
        <span className="text-muted-foreground font-mono text-sm">
          {info.getValue() as number}
        </span>
      ),
      size: 60,
    },
    {
      accessorKey: "name",
      header: "Task",
      cell: (info) => (
        <div className="font-medium">{info.getValue() as string}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as Task["status"]
        const statusConfig = {
          completed: {
            variant: "green" as const,
            icon: <Check className="size-4" />,
          },
          "in-progress": {
            variant: "blue" as const,
            icon: <Clock className="size-4" />,
          },
          pending: {
            variant: "orange" as const,
            icon: <AlertCircle className="size-4" />,
          },
        }
        const config = statusConfig[status]
        return (
          <Badge variant={config.variant} iconLeft={config.icon} size="sm">
            {status}
          </Badge>
        )
      },
    },
  ]

  const handleDataChange = (newData: Task[]) => {
    const updatedData = newData.map((item, index) => ({
      ...item,
      priority: index + 1,
    }))
    setData(updatedData)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Extract only the IDs in the current order
    const orderedIds = data.map((item) => item.uid)
    setSubmittedOrder(orderedIds)

    // In a real application, you would send this to your API:
    // await fetch('/api/tasks/reorder', {
    //   method: 'POST',
    //   body: JSON.stringify({ orderedIds })
    // })

    console.log("Submitted order:", orderedIds)
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Submit Reordered IDs</h3>
        <p className="text-muted-foreground text-sm">
          Drag to reorder tasks, then submit to save the new order
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <SortableTable
          columns={columns}
          data={data}
          onDataChange={handleDataChange}
        />

        <div className="flex gap-2">
          <Button type="submit">Save Order</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setSubmittedOrder(null)}
          >
            Clear Result
          </Button>
        </div>
      </form>

      {submittedOrder && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
          <p className="mb-2 font-semibold text-green-700 dark:text-green-400">
            Submitted Order:
          </p>
          <code className="text-muted-foreground block font-mono text-sm">
            {JSON.stringify(submittedOrder, null, 2)}
          </code>
        </div>
      )}

      <div className="rounded-lg border border-dashed p-4">
        <p className="text-muted-foreground text-sm">
          <strong>Use Case:</strong> This pattern is ideal when you only need to
          save the new order to the server without editing other fields. The
          form submits an array of IDs in the reordered sequence.
        </p>
      </div>
    </div>
  )
}

export const FormSubmitIds: Story = {
  render: () => <FormSubmitIdsExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A form that submits only the reordered task IDs. Drag tasks to change their order, then click 'Save Order' to see the ID array that would be sent to your API.",
      },
    },
  },
}

/**
 * Form example with editable inputs and selects in each row.
 * Demonstrates combining sortable table with form controls.
 */
type TaskWithInput = Task & {
  assignee: string
  estimatedHours: number
}

const FormWithInputsExample = () => {
  const [data, setData] = useState<TaskWithInput[]>([
    {
      uid: "task-1",
      name: "Design homepage",
      status: "completed",
      priority: 1,
      assignee: "alice",
      estimatedHours: 8,
    },
    {
      uid: "task-2",
      name: "Write API docs",
      status: "in-progress",
      priority: 2,
      assignee: "bob",
      estimatedHours: 4,
    },
    {
      uid: "task-3",
      name: "Code review",
      status: "pending",
      priority: 3,
      assignee: "carol",
      estimatedHours: 2,
    },
    {
      uid: "task-4",
      name: "Deploy to staging",
      status: "pending",
      priority: 4,
      assignee: "alice",
      estimatedHours: 1,
    },
  ])

  const [submittedData, setSubmittedData] = useState<TaskWithInput[] | null>(
    null
  )

  const assigneeOptions = [
    { label: "Alice Johnson", value: "alice" },
    { label: "Bob Smith", value: "bob" },
    { label: "Carol White", value: "carol" },
    { label: "David Brown", value: "david" },
  ]

  const statusOptions = [
    { label: "Completed", value: "completed" },
    { label: "In Progress", value: "in-progress" },
    { label: "Pending", value: "pending" },
  ]

  const handleInputChange = (
    uid: string,
    field: keyof TaskWithInput,
    value: string | number
  ) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.uid === uid ? { ...item, [field]: value } : item
      )
    )
  }

  const columns: ColumnDef<TaskWithInput>[] = [
    {
      id: "drag-handle",
      header: "",
      cell: () => <RowDragHandleCell />,
      size: 60,
      meta: { cellClassName: "w-[60px]" },
    },
    {
      accessorKey: "priority",
      header: "#",
      cell: (info) => (
        <span className="text-muted-foreground font-mono text-sm">
          {info.getValue() as number}
        </span>
      ),
      size: 60,
    },
    {
      accessorKey: "name",
      header: "Task",
      cell: (info) => (
        <div className="font-medium">{info.getValue() as string}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 150,
      cell: (info) => {
        const row = info.row.original
        return (
          <Select
            value={row.status}
            onValueChange={(value) =>
              handleInputChange(row.uid, "status", value as Task["status"])
            }
            options={statusOptions}
            placeholder="Select status"
            className="w-[140px]"
          />
        )
      },
    },
    {
      accessorKey: "assignee",
      size: 150,
      header: "Assignee",
      cell: (info) => {
        const row = info.row.original
        return (
          <Select
            value={row.assignee}
            onValueChange={(value) =>
              handleInputChange(row.uid, "assignee", value || "")
            }
            options={assigneeOptions}
            placeholder="Select assignee"
            className="w-40"
          />
        )
      },
    },
    {
      accessorKey: "estimatedHours",
      size: 150,
      header: "Hours",
      cell: (info) => {
        const row = info.row.original
        return (
          <Input
            type="number"
            value={row.estimatedHours}
            onChange={(e) =>
              handleInputChange(
                row.uid,
                "estimatedHours",
                parseInt(e.target.value) || 0
              )
            }
            min={0}
            max={100}
            className="w-20"
          />
        )
      },
    },
  ]

  const handleDataChange = (newData: TaskWithInput[]) => {
    const updatedData = newData.map((item, index) => ({
      ...item,
      priority: index + 1,
    }))
    setData(updatedData)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittedData([...data])
    console.log("Submitted data:", data)
  }

  const totalHours = data.reduce((sum, task) => sum + task.estimatedHours, 0)

  return (
    <div className="w-full max-w-5xl space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Interactive Form Table</h3>
        <p className="text-muted-foreground text-sm">
          Reorder tasks and edit fields inline • Total: {totalHours} hours
          estimated
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <SortableTable
          columns={columns}
          data={data}
          onDataChange={handleDataChange}
        />

        <div className="flex gap-2">
          <Button type="submit">Save All Changes</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setSubmittedData(null)}
          >
            Clear Result
          </Button>
        </div>
      </form>

      {submittedData && (
        <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
          <p className="mb-2 font-semibold text-blue-700 dark:text-blue-400">
            Submitted Data:
          </p>
          <code className="text-muted-foreground block max-h-[300px] overflow-auto font-mono text-xs">
            {JSON.stringify(submittedData, null, 2)}
          </code>
        </div>
      )}

      <div className="rounded-lg border border-dashed p-4">
        <p className="text-muted-foreground text-sm">
          <strong>Use Case:</strong> This pattern combines sortable rows with
          editable form controls. Users can reorder tasks via drag-and-drop
          while also updating status, assignee, and estimated hours inline.
          Perfect for sprint planning or task management interfaces.
        </p>
      </div>
    </div>
  )
}

export const FormWithInputs: Story = {
  render: () => <FormWithInputsExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A sortable table with interactive form controls in each row. Drag to reorder tasks, use the dropdowns to change status/assignee, and edit the hours input. Submit to see the complete data payload.",
      },
    },
  },
}
