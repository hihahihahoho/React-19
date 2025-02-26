import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/form";
import { SelectionGroup } from "@/components/ui/selection-controls/selection-group";
import { Switch } from "@/components/ui/selection-controls/switch";
import { SwitchForm } from "@/components/ui/selection-controls/switch-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const meta: Meta<typeof Switch> = {
  title: "Base/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

const FormSchema = z.object({
  switchDemo: z.boolean().refine((val) => val, {
    message: "Please read and accept the terms and conditions",
  }),
});

const SwitchFormDemo = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      switchDemo: true,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SwitchForm
          control={form.control}
          name="switchDemo"
          formComposition={{
            label: "Switch Group",
            description: "Select your preferences",
            labelPosition: "horizontal",
            variant: "empty",
          }}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export const Default: Story = {
  render: () => <Switch />,
};

export const Checked: Story = {
  render: () => <Switch defaultChecked />,
};

export const Disabled: Story = {
  render: () => <Switch disabled />,
};

export const WithLabel: Story = {
  render: () => (
    <SelectionGroup control={<Switch />}>Switch Label</SelectionGroup>
  ),
};

export const CompleteForm: Story = {
  render: () => <SwitchFormDemo />,
};
