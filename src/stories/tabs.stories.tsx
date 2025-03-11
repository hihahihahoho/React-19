/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@/components/ui/button"; // Adjust the import path as needed
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Adjust the import path as needed
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

// Meta Configuration
const meta: Meta<typeof Tabs> = {
  title: "Base/Tabs",
  component: Tabs,
  parameters: {
    // Optional: Add any Storybook parameters here
    // For example, to control backgrounds:
    // backgrounds: { default: 'light' },
  },
  argTypes: {
    // Define controls for props if needed
    // For example:
    // defaultValue: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Default Tabs with three tabs */
export const Default: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>

      <TabsContent value="tab1">
        <p>This is the content of Tab 1.</p>
      </TabsContent>

      <TabsContent value="tab2">
        <p>This is the content of Tab 2.</p>
      </TabsContent>

      <TabsContent value="tab3">
        <p>This is the content of Tab 3.</p>
      </TabsContent>
    </Tabs>
  ),
  args: {
    defaultValue: "tab1", // Set the default active tab
  },
};

/** Controlled Tabs with external control */
export const Controlled: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<string>("tab1");

    const handleChangeTab = (value: string) => {
      setActiveTab(value);
      console.log("Active Tab Changed To:", value);
    };

    return (
      <div>
        <Button onClick={() => setActiveTab("tab2")}>Activate Tab 2</Button>
        <Button onClick={() => setActiveTab("tab3")} className="ml-2">
          Activate Tab 3
        </Button>

        <Tabs
          {...args}
          value={activeTab}
          onValueChange={handleChangeTab}
          className="mt-4"
        >
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            <TabsTrigger value="tab4">Tab 4</TabsTrigger>
            <TabsTrigger value="tab5">Tab 5</TabsTrigger>
            <TabsTrigger value="tab6">Tab 6</TabsTrigger>
            <TabsTrigger value="tab7">Tab 7</TabsTrigger>
            <TabsTrigger value="tab8">Tab 8</TabsTrigger>
            <TabsTrigger value="tab9">Tab 9</TabsTrigger>
          </TabsList>

          <TabsContent value="tab1">
            <p>This is the content of Tab 1.</p>
          </TabsContent>

          <TabsContent value="tab2">
            <p>This is the content of Tab 2.</p>
          </TabsContent>

          <TabsContent value="tab3">
            <p>This is the content of Tab 3.</p>
          </TabsContent>
        </Tabs>
      </div>
    );
  },
  args: {
    defaultValue: "tab1", // Initial active tab
  },
};
