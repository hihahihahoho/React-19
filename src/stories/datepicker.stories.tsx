import { DatePicker } from "@/components/ui/datepicker/datepicker";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Base/DatePicker/DatePicker",
  component: DatePicker,
  parameters: {},
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default datePicker with placeholder */
export const Default: Story = {
  args: {
    defaultValue: new Date(),
    formComposition: {
      label: "DatePicker",
      labelPosition: "horizontal",
      inputClear: true,
    },
  },
};

export const Editable: Story = {
  args: {
    defaultValue: new Date(),
    editable: true,
    locale: "ko-KR",
    formComposition: {
      label: "DatePicker Editable",
      labelPosition: "horizontal",
      inputClear: true,
    },
  },
};
