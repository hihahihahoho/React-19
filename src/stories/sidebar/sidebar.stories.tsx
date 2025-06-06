import type { Meta, StoryObj } from "@storybook/react-vite"
import { SidebarDemo } from "./sidebar-demo"

const meta = {
  title: "Block/Sidebar",
  component: SidebarDemo,
  parameters: {
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/input.json
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/input-tag.json
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/input-auto-complete.json
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/select.json
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/multiselect.json
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/checkbox.json
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/radio-group.json
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/switch.json
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/datepicker.json
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/date-range-picker.json
\`\`\`

These commands install all form-related components from the registry.
        `,
      },
    },
  },
} satisfies Meta<typeof SidebarDemo>

export default meta
type Story = StoryObj<typeof meta>

/** Default datePicker with placeholder */
export const Default: Story = {
  args: {},
}
