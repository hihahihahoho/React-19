import { DateRangePicker } from "@/components/ui/date-range-picker/date-range-picker";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Base/DatePicker/DateRangePicker",
  component: DateRangePicker,
  parameters: {},
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default dateRangePicker', with placeholder */
export const Default: Story = {
  args: {
    formComposition: {
      labelPosition: "horizontal",
      label: "DatePicker",
      inputClear: true,
    },
  },
};

export const DateRangPickerConfirmButton: Story = {
  args: {
    calendarProps: {
      showConfirmButton: true,
    },
    formComposition: {
      label: "DatePicker",
      labelPosition: "horizontal",
      inputClear: true,
    },
  },
};
