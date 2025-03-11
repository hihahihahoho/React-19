import type { Meta, StoryObj } from "@storybook/react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FormDemo } from "./forms/FormDemo"

const meta = {
  title: "Base/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="max-w-3xl"
        >
          <DialogHeader>
            <DialogTitle>Form</DialogTitle>
            <DialogDescription>This is a form</DialogDescription>
          </DialogHeader>
          <FormDemo />
          <DialogFooter>
            <Button variant="secondary">Cancel</Button>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
}
