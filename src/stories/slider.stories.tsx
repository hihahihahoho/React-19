import type { Meta, StoryObj } from "@storybook/react-vite"

import { Slider } from "@/components/ui/slilder"

const meta = {
  title: "Controls/Slider",
  tags: ["Doing"],

  component: Slider,
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "VND",
  },
}
