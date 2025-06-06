import { PhotoSwipe } from "@/components/ui/photoswipe"
import { Select } from "@/components/ui/select/select"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Utilities/Photo Swipe",
  component: PhotoSwipe,
  parameters: {
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/photoswipe.json
\`\`\`

PhotoSwipe provides a responsive, touch-friendly image gallery with zoom and swipe support.
        `,
      },
    },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

/** Default select with placeholder */
export const Default: Story = {
  args: {},
}
