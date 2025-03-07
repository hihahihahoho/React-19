import { TestZoom } from "@/components/ui/test-zoom";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Base/TestZoom",
  component: TestZoom,
  parameters: {},
} satisfies Meta<typeof TestZoom>;

export default meta;
type Story = StoryObj<typeof meta>;
/** Default select with placeholder */
export const Default: Story = {};
