import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@/components/ui/slider"
import { SliderForm } from "@/components/ui/slider-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

/**
 * Slider components for selecting values from a range.
 * Supports single value, range selection, indicators, and labels.
 */
const meta: Meta<typeof SliderRoot> = {
  title: "Forms/Slider",
  component: SliderRoot,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/slider.json
\`\`\`

Slider components for selecting numeric values from a range.

## Features
- Single value and range selection
- Customizable indicators with clickable marks
- Thumb labels with tooltips
- Range display header
- Vertical orientation support
- Form integration with react-hook-form

## When to use
- Price range filters
- Volume/brightness controls
- Numeric value selection within bounds
- Any value selection from a continuous range
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex w-96 items-center justify-center p-10">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SliderRoot>

// ============================================================================
// Basic Slider (Simple Shadcn-style)
// ============================================================================

/**
 * Basic slider using the simple Slider component (without composition).
 */
export const BasicSimple: Story = {
  render: () => <Slider defaultValue={[50]} className="w-full" />,
  parameters: {
    docs: {
      description: {
        story:
          "A basic single-value slider using the simplified Slider component.",
      },
    },
  },
}

// ============================================================================
// Basic Example (Compositional)
// ============================================================================

/**
 * Basic slider with single value using composition.
 */
export const Basic: Story = {
  render: () => (
    <SliderRoot defaultValue={[50]} className="w-full">
      <SliderControl>
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb />
      </SliderControl>
    </SliderRoot>
  ),
  parameters: {
    docs: {
      description: {
        story: "A basic single-value slider using the compositional API.",
      },
    },
  },
}

// ============================================================================
// With Label on Thumb
// ============================================================================

/**
 * Slider with label tooltip on thumb.
 */
export const WithThumbLabel: Story = {
  render: function WithLabelExample() {
    const [value, setValue] = useState([50])

    return (
      <SliderRoot
        value={value}
        onValueChange={setValue}
        suffix=" VND"
        className="w-full"
      >
        <SliderControl>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          <SliderThumb>
            <SliderLabel value={value[0]} position="top" />
          </SliderThumb>
        </SliderControl>
      </SliderRoot>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Slider with a label tooltip showing the current value above the thumb.",
      },
    },
  },
}

// ============================================================================
// With Indicator
// ============================================================================

/**
 * Slider with clickable indicator marks.
 */
export const WithIndicator: Story = {
  render: function IndicatorExample() {
    const [value, setValue] = useState([40])

    return (
      <SliderRoot
        value={value}
        onValueChange={setValue}
        min={0}
        max={100}
        className="w-full"
      >
        <SliderIndicator step={25} />
        <SliderControl>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          <SliderThumb />
        </SliderControl>
      </SliderRoot>
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Slider with clickable indicator marks above the track.",
      },
    },
  },
}

// ============================================================================
// Indicator Bottom
// ============================================================================

/**
 * Slider with indicator marks below the track.
 */
export const IndicatorBottom: Story = {
  render: function IndicatorBottomExample() {
    const [value, setValue] = useState([40])

    return (
      <SliderRoot
        value={value}
        onValueChange={setValue}
        min={0}
        max={100}
        className="w-full"
      >
        <SliderControl>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          <SliderThumb />
        </SliderControl>
        <SliderIndicator step={25} position="bottom" />
      </SliderRoot>
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Slider with indicator marks positioned below the track.",
      },
    },
  },
}

// ============================================================================
// Range Slider
// ============================================================================

/**
 * Range slider with two thumbs.
 */
export const RangeSlider: Story = {
  render: function RangeExample() {
    const [value, setValue] = useState([20, 80])

    return (
      <SliderRoot
        value={value}
        onValueChange={setValue}
        suffix=" VND"
        className="w-full"
      >
        <SliderControl>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          <SliderThumb>
            <SliderLabel value={value[0]} position="top" />
          </SliderThumb>
          <SliderThumb>
            <SliderLabel value={value[1]} position="top" />
          </SliderThumb>
        </SliderControl>
      </SliderRoot>
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Range slider with two thumbs for selecting a value range.",
      },
    },
  },
}

// ============================================================================
// Full Featured Example
// ============================================================================

/**
 * Full featured slider with range display, indicator, and labels.
 */
export const FullFeatured: Story = {
  render: function FullExample() {
    const [value, setValue] = useState([25, 75])

    return (
      <SliderRoot
        value={value}
        onValueChange={setValue}
        min={0}
        max={100}
        suffix=" triệu"
        className="w-full"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Price Range</span>
          <div className="flex items-center gap-1 text-sm font-medium">
            <SliderValue valueIndex={0} />
            <span className="text-muted-foreground">-</span>
            <SliderValue valueIndex={1} />
          </div>
        </div>

        <SliderIndicator step={25} />

        <SliderControl>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          <SliderThumb>
            <SliderLabel value={value[0]} position="bottom" />
          </SliderThumb>
          <SliderThumb>
            <SliderLabel value={value[1]} position="bottom" />
          </SliderThumb>
        </SliderControl>
      </SliderRoot>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "A full-featured slider with range display header, indicator marks, and thumb labels.",
      },
    },
  },
}

// ============================================================================
// With Value Display
// ============================================================================

/**
 * Slider with static value display.
 */
export const WithValueDisplay: Story = {
  render: function ValueDisplayExample() {
    const [value, setValue] = useState([50])

    return (
      <SliderRoot
        value={value}
        onValueChange={setValue}
        suffix="%"
        className="w-full"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Volume</span>
          <SliderValue className="text-sm" />
        </div>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          <SliderThumb />
        </SliderControl>
      </SliderRoot>
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Slider with a static value display outside the slider.",
      },
    },
  },
}

// ============================================================================
// Disabled
// ============================================================================

/**
 * Disabled slider.
 */
export const Disabled: Story = {
  render: () => (
    <SliderRoot defaultValue={[50]} disabled className="w-full">
      <SliderControl>
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb />
      </SliderControl>
    </SliderRoot>
  ),
  parameters: {
    docs: {
      description: {
        story: "A disabled slider that prevents user interaction.",
      },
    },
  },
}

// ============================================================================
// Form Validation - Single Value
// ============================================================================

/**
 * SliderForm with single value validation.
 */
export const WithFormSingleValue: Story = {
  render: () => {
    const formSchema = z.object({
      volume: z
        .number()
        .min(20, "Volume must be at least 20")
        .max(80, "Volume cannot exceed 80"),
    })

    function FormExample() {
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          volume: 50,
        },
      })

      const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
        alert("Volume: " + values.volume)
      }

      return (
        <ZodSchemaProvider schema={formSchema}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <SliderForm
                name="volume"
                min={0}
                max={100}
                showIndicator
                indicatorStep={20}
                showThumbLabel
                formComposition={{
                  label: "Volume",
                  description: "Select volume between 20 and 80",
                }}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </ZodSchemaProvider>
      )
    }

    return <FormExample />
  },
  parameters: {
    docs: {
      description: {
        story:
          "SliderForm integrated with react-hook-form and zod validation for single value.",
      },
    },
  },
}

// ============================================================================
// Form Validation - Range
// ============================================================================

/**
 * SliderForm with range value validation.
 */
export const WithFormRange: Story = {
  render: () => {
    const formSchema = z.object({
      priceRange: z
        .array(z.number())
        .length(2)
        .refine(
          (val) => val[1] - val[0] >= 20,
          "Range must be at least 20 apart"
        ),
    })

    function FormExample() {
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          priceRange: [25, 75],
        },
      })

      const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
        alert(
          `Price Range: ${values.priceRange[0]} - ${values.priceRange[1]} triệu`
        )
      }

      return (
        <ZodSchemaProvider schema={formSchema}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <SliderForm
                name="priceRange"
                min={0}
                max={100}
                suffix=" triệu"
                showIndicator
                indicatorStep={25}
                showThumbLabel
                thumbLabelPosition="bottom"
                formComposition={{
                  label: "Select Price Range",
                  description: "Choose minimum and maximum price",
                }}
              />
              <Button type="submit">Apply Filter</Button>
            </form>
          </Form>
        </ZodSchemaProvider>
      )
    }

    return <FormExample />
  },
  parameters: {
    docs: {
      description: {
        story:
          "SliderForm with range values, integrated with react-hook-form and zod validation.",
      },
    },
  },
}

// ============================================================================
// Custom Label Function
// ============================================================================

/**
 * Slider with custom label rendering function.
 */
export const CustomLabelFunction: Story = {
  render: function CustomLabelExample() {
    const [value, setValue] = useState([50])

    const formatCurrency = (val: number | undefined) =>
      val !== undefined
        ? new Intl.NumberFormat("vi-VN").format(val * 1000000) + " VND"
        : ""

    return (
      <SliderRoot
        value={value}
        onValueChange={setValue}
        min={0}
        max={100}
        suffix={formatCurrency}
        className="w-full"
      >
        <SliderControl>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          <SliderThumb>
            <SliderLabel value={value[0]} position="top" />
          </SliderThumb>
        </SliderControl>
      </SliderRoot>
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Slider with a custom label function for formatting values.",
      },
    },
  },
}
