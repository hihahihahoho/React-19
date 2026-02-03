# DataTable System

## Architecture

Uses Context Provider pattern for table state sharing:

```
DataTableProvider (provides table, sorting, pagination, selection)
  └── DataTable (UI component)
  └── OtherComponents (can access via useDataTable())
```

---

## Basic Usage

```tsx
import { DataTableProvider } from "@/components/ui/table/data-table-context"
import { DataTable } from "@/components/ui/table/data-table"
import { ColumnDef } from "@tanstack/react-table"

// Define columns
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    header: "",
    meta: { pinned: "right" }, // Pin column
    cell: ({ row }) => <ActionMenu user={row.original} />,
  },
]

// Render
<DataTableProvider columns={columns} data={users} pageSize={10}>
  <DataTable />
</DataTableProvider>
```

---

## useDataTable Hook

Access table state anywhere inside provider:

```tsx
import { useDataTable } from "@/components/ui/table/data-table-context"

function TableToolbar() {
  const { table, rowSelection } = useDataTable()

  const selectedCount = Object.keys(rowSelection).length

  return (
    <div>
      {selectedCount} selected
      <Button onClick={() => table.toggleAllRowsSelected(false)}>
        Clear selection
      </Button>
    </div>
  )
}
```

---

## DataTable Props

```tsx
<DataTable
  variant="rounded" // "default" | "rounded"
  fixedHeaderOffset="64px" // For sticky header
  showPagination={true} // Show pagination
  autoWidthTable={false} // Auto column width
  emptyState={<EmptyState />} // Custom empty state
/>
```

---

## Column Pinning

Use `meta.pinned` in column definition:

```tsx
const columns: ColumnDef<User>[] = [
  {
    id: "select",
    meta: { pinned: "left" },
    // ...
  },
  // ... other columns
  {
    id: "actions",
    meta: { pinned: "right" },
    // ...
  },
]
```

---

## Server-Side Table

For server pagination/sorting:

```tsx
import { DataTableServerProvider } from "@/components/ui/table/data-table-server-context"

;<DataTableServerProvider
  columns={columns}
  data={data}
  totalCount={totalCount}
  pageIndex={page}
  pageSize={pageSize}
  onPaginationChange={handlePaginationChange}
  isPending={isLoading}
>
  <DataTable />
</DataTableServerProvider>
```

---

## Floating Scroll Bar

DataTable includes sticky bottom scrollbar that appears when table is wider than viewport.

---

## Integration with React Query

```tsx
function UsersTable() {
  const { data, isPending } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  })

  return (
    <DataTableProvider
      columns={columns}
      data={data?.users || []}
      tableOptions={{
        state: {
          // Can override internal state
        },
      }}
    >
      <DataTable />
    </DataTableProvider>
  )
}
```
