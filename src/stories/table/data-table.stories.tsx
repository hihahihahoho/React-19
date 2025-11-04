import type { Meta, StoryObj } from "@storybook/react-vite"

import { Drawer } from "@/components/ui/drawer"
import DemoTableBasic from "./basic-table-demo"

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
        `,
      },
    },
  },
  component: Drawer,
} satisfies Meta<typeof Drawer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <DemoTableBasic />,
}
