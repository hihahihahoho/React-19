import { PhotoSwipe } from "@/components/ui/photoswipe"
import { Select } from "@/components/ui/select/select"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Utilities/Photo Swipe",
  component: PhotoSwipe,
  parameters: {},
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

/** Default select with placeholder */
export const Default: Story = {
  args: {},
}
