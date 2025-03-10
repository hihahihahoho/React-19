import type { Meta, StoryObj } from "@storybook/react";
import { FormDemo } from "./FormDemo";

const meta = {
  title: "Forms/Form",
  component: FormDemo,
  parameters: {},
} satisfies Meta<typeof FormDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default datePicker with placeholder */
export const Default: Story = {
  args: {},
};
