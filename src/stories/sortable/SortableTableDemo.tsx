import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input/input"
import { Select } from "@/components/ui/select/select"
import {
  RowDragHandleCell,
  SortableTable,
} from "@/components/ui/table/sortable-table"
import { ColumnDef } from "@tanstack/react-table"
import { AlertCircle, Check, Clock, Mail, Phone, User } from "lucide-react"
import { useState } from "react"

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

type TaskWithInput = Task & {
  assignee: string
  estimatedHours: number
}

/**
 * Basic example with simple task data and drag-to-reorder functionality.
 */
export const BasicTableExample = () => {
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
          <Badge variant={config.variant}>
            {config.icon}
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

/**
 * Table with team members showing contact information.
 */
export const TeamMembersExample = () => {
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

/**
 * Product inventory table with pricing and stock information.
 */
export const ProductInventoryExample = () => {
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

/**
 * Form example with editable inputs and selects in each row.
 */
export const FormWithInputsExample = () => {
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
