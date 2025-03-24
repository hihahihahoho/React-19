import type { Meta, StoryObj } from "@storybook/react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { FormDemo } from "./forms/FormDemo"

const meta = {
  title: "Overlays/Drawer",
  component: Drawer,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Drawer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Form</DrawerTitle>
          <DrawerDescription>This is a form</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <FormDemo />
        </div>
      </DrawerContent>
    </Drawer>
  ),
}
