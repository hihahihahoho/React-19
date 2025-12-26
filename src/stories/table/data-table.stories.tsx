import type { Meta, StoryObj } from "@storybook/react-vite"

import { Drawer } from "@/components/ui/drawer"
import DemoTableBasic from "./basic-table-demo"
import ServerSideTableDemo from "./server-side-table-demo"

const meta = {
  title: "Data Display/Data Table",
  tags: ["todo"],
  parameters: {
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/data-table.json
\`\`\`

## Server-Side Mode

For server-side pagination/sorting with URL sync, use \`DataTableProviderServer\`:

\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/data-table-server.json
# This component uses next/navigation for URL sync
\`\`\`

\`\`\`tsx
// app/users/page.tsx
import { DataTableProviderServer } from "@/components/ui/table/data-table-context-server"

export default async function UsersPage({ searchParams }) {
  const params = await searchParams
  const { data, totalCount } = await fetchUsers(params)

  return (
    <DataTableProviderServer
      columns={columns}
      data={data}
      rowCount={totalCount}
    >
      <DataTable />
    </DataTableProviderServer>
  )
}
\`\`\`

### URL Params
- \`page\` - Current page (1-indexed)
- \`size\` - Page size
- \`sort\` - Sort column
- \`order\` - Sort order (asc/desc)
        `,
      },
    },
  },
  component: Drawer,
} satisfies Meta<typeof Drawer>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Default client-side table with automatic pagination and sorting.
 */
export const Default: Story = {
  render: () => <DemoTableBasic />,
}

/**
 * Server-side table with URL sync.
 * Pagination and sorting are synced with URL search params.
 */
export const ServerSide: Story = {
  render: () => <ServerSideTableDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Server-side mode with URL sync. Try changing pages or sorting - the URL updates automatically. In a real Next.js app, this uses `DataTableProviderServer` from `data-table-context-server.tsx`.",
      },
    },
  },
}
