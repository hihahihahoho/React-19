import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select/select";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Base/Select",
  component: Select,
  parameters: {},
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default select with placeholder */
export const Default: Story = {
  args: {
    defaultValue: "Option 1",
    options: [
      {
        value: "Option 1",
        label: "Không có gì quầng mắt",
        icon: "https://github.com/shadcn.png",
        keywords: ["Tùng"],
      },
      { value: "Option 2", label: "Không có gì quầng mắt" },
      { value: "Option 3", label: "tùng Ốcc" },
      { value: "Option 4", label: "Option 2" },
      { value: "Option 5", label: "Option 1" },
      { value: "Option 6", label: "Option 2" },
      { value: "Option 7", label: "Option 1" },
      { value: "Option 8", label: "Option 2" },
      { value: "Option 9", label: "Option 1" },
      { value: "Option 10", label: "Option 2" },
      { value: "Option 11", label: "Option 1" },
      { value: "Option 12", label: "Option 2" },
      { value: "Option 13", label: "Option 1" },
    ],
    formComposition: {
      labelPosition: "horizontal",
      label: "Select",
      suffix: "VND",
      inputClear: true,
      suffixOutside: (
        <Button onClick={() => console.log("first")} variant={"secondary"}>
          Button
        </Button>
      ),
    },
  },
};
