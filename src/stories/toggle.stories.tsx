import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { Meta, StoryObj } from "@storybook/react-vite"

// Meta Configuration

const meta = {
  title: "Controls/Toggle Group",
  component: ToggleGroup,
  parameters: {},
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

/** Default ToggleGroup with Toggles inside */
export const Default: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="toggle1">Toggle 1</ToggleGroupItem>
      <ToggleGroupItem value="toggle2">Toggle 2</ToggleGroupItem>
      <ToggleGroupItem value="toggle3">Toggle 3</ToggleGroupItem>
    </ToggleGroup>
  ),
  args: {
    type: "single",
    variant: "default", // Default variant
    size: "default", // Default size
  },
}

/** Outline Variant ToggleGroup with Toggles */
export const Outline: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="toggle1">Toggle 1</ToggleGroupItem>
      <ToggleGroupItem value="toggle2">Toggle 2</ToggleGroupItem>
      <ToggleGroupItem value="toggle3">Toggle 3</ToggleGroupItem>
    </ToggleGroup>
  ),
  args: {
    type: "single",
    variant: "outline", // Outline variant
    size: "default", // Default size
  },
}

/** Large Size ToggleGroup with Toggles */
export const Large: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="toggle1">Toggle 1</ToggleGroupItem>
      <ToggleGroupItem value="toggle2">Toggle 2</ToggleGroupItem>
      <ToggleGroupItem value="toggle3">Toggle 3</ToggleGroupItem>
    </ToggleGroup>
  ),
  args: {
    type: "single",
    variant: "default", // Default variant
    size: "lg", // Large size
  },
}

/** Small Size ToggleGroup with Toggles */
export const Small: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="toggle1">Toggle 1</ToggleGroupItem>
      <ToggleGroupItem value="toggle2">Toggle 2</ToggleGroupItem>
      <ToggleGroupItem value="toggle3">Toggle 3</ToggleGroupItem>
    </ToggleGroup>
  ),
  args: {
    type: "single",
    variant: "default", // Default variant
    size: "sm", // Small size
  },
}

/** Demo Variant - Outline with Large Size */
export const DemoOutlineLarge: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="toggle1">Toggle 1</ToggleGroupItem>
      <ToggleGroupItem value="toggle2">Toggle 2</ToggleGroupItem>
      <ToggleGroupItem value="toggle3">Toggle 3</ToggleGroupItem>
    </ToggleGroup>
  ),
  args: {
    type: "single",
    variant: "outline", // Outline variant
    size: "lg", // Large size
  },
}
/** Demo Variant - Default with Medium Size */
export const DemoDefaultMedium: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="toggle1">Toggle 1</ToggleGroupItem>
      <ToggleGroupItem value="toggle2">Toggle 2</ToggleGroupItem>
      <ToggleGroupItem value="toggle3">Toggle 3</ToggleGroupItem>
    </ToggleGroup>
  ),
  args: {
    type: "single",
    variant: "default", // Default variant
    size: "default", // Default size
  },
}
