import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/form";
import { Checkbox } from "@/components/ui/selection-controls/checkbox";
import { CheckboxGroupForm } from "@/components/ui/selection-controls/checkbox-group-form";
import { SelectionGroup } from "@/components/ui/selection-controls/selection-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const meta: Meta<typeof Checkbox> = {
  title: "Base/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

const itemsCheckbox = [
  { value: "recents", label: "Recents" },
  { value: "home", label: "Home" },
  { value: "applications", label: "Applications" },
  { value: "desktop", label: "Desktop" },
  { value: "downloads", label: "Downloads" },
  { value: "documents", label: "Documents", disabled: true },
];

const FormSchema = z.object({
  checkboxDemo: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
  marketing_emails: z.boolean().default(false),
});

const CheckboxGroupFormDemo = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      checkboxDemo: ["recents", "home"],
      marketing_emails: false,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CheckboxGroupForm
          control={form.control}
          name="checkboxDemo"
          formComposition={{
            label: "Checkbox Group",
            description: "Select your preferences",
          }}
          items={itemsCheckbox}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export const Default: Story = {
  render: () => <Checkbox />,
};

export const Checked: Story = {
  render: () => <Checkbox defaultChecked />,
};

export const Disabled: Story = {
  render: () => <Checkbox disabled />,
};

export const WithLabel: Story = {
  render: () => (
    <SelectionGroup control={<Checkbox />}>Checkbox Label</SelectionGroup>
  ),
};

export const CompleteForm: Story = {
  render: () => <CheckboxGroupFormDemo />,
};
