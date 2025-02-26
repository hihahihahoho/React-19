import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/select/multiselect";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Base/MultiSelect",
  component: MultiSelect,
  parameters: {},
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const names = [
  "John",
  "Jane",
  "Alex",
  "Sam",
  "Taylor",
  "Jordan",
  "Casey",
  "Morgan",
];
const roles = ["Engineer", "Designer", "Manager", "Developer", "Architect"];
const avatars = [
  "https://github.com/shadcn.png",
  "https://avatars.githubusercontent.com/u/1",
  "https://avatars.githubusercontent.com/u/2",
  "https://avatars.githubusercontent.com/u/3",
  "https://avatars.githubusercontent.com/u/4",
];

/** Default select with placeholder */
export const Default: Story = {
  args: {
    defaultValue: ["Option 4", "Option 5"],
    options: Array.from({ length: 10 }, (_, i) => ({
      value: `Option ${i + 1}`,
      label: `${names[i % names.length]} - ${roles[i % roles.length]}`,
      icon: avatars[i % avatars.length], // URL string or ReactNode
      disabled: i === 0,
    })),
    formComposition: {
      label: "Multi Select",
      labelPosition: "horizontal",
      suffix: "VND",
      suffixOutside: (
        <Button onClick={() => console.log("first")} variant={"secondary"}>
          Button
        </Button>
      ),
    },
  },
};
