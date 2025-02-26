import { Button } from "@/components/ui/button";
import {
  InputNumber,
  OnValueChangeInputNumber,
} from "@/components/ui/input-number/input-number";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta = {
  title: "Base/Input Number",
  component: InputNumber,
  parameters: {},
} satisfies Meta<typeof InputNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default input with placeholder */
export const Default: Story = {
  args: {
    placeholder: "Enter text",
    value: 100000,
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(args.value);

    const handleIncrease = () => {
      setValue((prevValue) => (prevValue || 0) + 1);
    };

    const handleValueChange = (value: OnValueChangeInputNumber) => {
      const newValue = value.unMaskedValue;
      setValue(newValue);
    };

    return (
      <div className="w-[200px]">
        <InputNumber />
        <InputNumber
          {...args}
          value={value}
          onValueChange={handleValueChange}
        />
        <Button onClick={handleIncrease}>Increase Number</Button>
      </div>
    );
  },
};
