import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/selection-controls/radio-group";
import {
  ItemRadioType,
  RadioGroupForm,
} from "@/components/ui/selection-controls/radio-group-form";
import { SelectionGroup } from "@/components/ui/selection-controls/selection-group";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const meta: Meta<typeof RadioGroup> = {
  title: "Base/Radio",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

const itemsRadio: ItemRadioType[] = [
  { value: "radioDisabled", label: "Raido disabled", disabled: true },
  { value: "include", label: "Include" },
  { value: "exclude", label: "Exclude" },
  { value: "pending", label: "Pending", disabled: true },
];

const FormSchema = z.object({
  radioGroupDemo: z.enum(["include", "exclude", "pending", "radioDisabled"], {
    required_error: "You need to select an option.",
  }),
});

const RadioFormDemo = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      radioGroupDemo: "radioDisabled",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <RadioGroupForm
          control={form.control}
          name="radioGroupDemo"
          formComposition={{
            label: "Radio Group",
            description: "Select your preference",
          }}
          items={itemsRadio}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

// Basic story
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="radioDisabled">
      {itemsRadio.map((item) => {
        const { value, ...props } = item;
        return (
          <SelectionGroup
            key={value}
            control={<RadioGroupItem value={value} {...props} />}
          >
            {item.label}
          </SelectionGroup>
        );
      })}
    </RadioGroup>
  ),
};
// Complete form with validation
export const CompleteForm: Story = {
  render: () => <RadioFormDemo />,
};
