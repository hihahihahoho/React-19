import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import { Rating, RatingItem } from "@/components/ui/rating/rating"
import { RatingForm } from "@/components/ui/rating/rating-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Heart, Star, ThumbsUp } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

/**
 * Rating component allows users to provide feedback by selecting a rating value.
 * Use ratings to collect user opinions or display product/service quality.
 */
const meta = {
  title: "Forms/Rating",
  component: Rating,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add "pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/rating.json"
\`\`\`

### Credit to https://www.diceui.com/docs/components/rating

Rating components are interactive controls that allow users to provide feedback by selecting a rating value.
They can include various types, sizes, and custom icons.

## When to use
- To collect user feedback or reviews
- To display product or service ratings
- To enable users to express satisfaction levels
- For star ratings, like/dislike systems, or custom rating scales

## Accessibility
- Rating controls should have proper ARIA labels for screen readers
- Keyboard navigation should be supported (arrow keys, Enter, Space)
- The current rating value should be announced to screen readers
- Focus indicators should be clearly visible
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: "number",
      description: "The current rating value (controlled)",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    defaultValue: {
      control: "number",
      description: "The default rating value (uncontrolled)",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    max: {
      control: "number",
      description: "Maximum rating value",
      table: {
        defaultValue: { summary: "5" },
      },
    },
    step: {
      control: "select",
      options: [0.5, 1],
      description: "The increment step for rating values",
      table: {
        defaultValue: { summary: "1" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Size of the rating icons",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    disabled: {
      control: "boolean",
      description: "When true, prevents user interaction with the rating",
    },
    readOnly: {
      control: "boolean",
      description: "When true, makes the rating read-only",
    },
    clearable: {
      control: "boolean",
      description:
        "When true, allows clearing the rating by clicking the same value",
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Layout orientation of rating items",
      table: {
        defaultValue: { summary: "horizontal" },
      },
    },
    onValueChange: {
      description: "Function called when the rating value changes",
      action: "value changed",
    },
    onHover: {
      description: "Function called when hovering over rating items",
      action: "hover changed",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Rating>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic examples of different rating configurations.
 */
export const BasicTypes: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium">Default (5 stars)</p>
        <Rating defaultValue={3}>
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <Star />
            </RatingItem>
          ))}
        </Rating>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">10 stars</p>
        <Rating defaultValue={7} max={10}>
          {Array.from({ length: 10 }, (_, i) => (
            <RatingItem key={i}>
              <Star />
            </RatingItem>
          ))}
        </Rating>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Half star increments</p>
        <Rating defaultValue={3.5} step={0.5}>
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <Star />
            </RatingItem>
          ))}
        </Rating>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Custom icons (Hearts)</p>
        <Rating defaultValue={4}>
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <Heart />
            </RatingItem>
          ))}
        </Rating>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Various basic rating configurations for different use cases.",
      },
    },
  },
}

/**
 * Ratings with different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium">Small</p>
        <Rating defaultValue={3} size="sm">
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <Star />
            </RatingItem>
          ))}
        </Rating>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Default</p>
        <Rating defaultValue={3} size="default">
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <Star />
            </RatingItem>
          ))}
        </Rating>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Large</p>
        <Rating defaultValue={3} size="lg">
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <Star />
            </RatingItem>
          ))}
        </Rating>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Rating components in different sizes.",
      },
    },
  },
}

/**
 * Ratings with different states (disabled, read-only).
 */
export const RatingStates: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium">Default (interactive)</p>
        <Rating defaultValue={3}>
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <Star />
            </RatingItem>
          ))}
        </Rating>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Disabled</p>
        <Rating defaultValue={3} disabled>
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <Star />
            </RatingItem>
          ))}
        </Rating>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Read-only</p>
        <Rating defaultValue={3.5} step={0.5} readOnly>
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <Star />
            </RatingItem>
          ))}
        </Rating>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Clearable</p>
        <Rating defaultValue={3} clearable>
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <Star />
            </RatingItem>
          ))}
        </Rating>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Rating fields in various interactive states.",
      },
    },
  },
}

/**
 * Controlled rating example with value display.
 */
export const ControlledRating: Story = {
  render: () => {
    function ControlledExample() {
      const [value, setValue] = useState(3)

      return (
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-sm font-medium">
              Current rating: {value} / 5
            </p>
            <Rating value={value} onValueChange={setValue}>
              {Array.from({ length: 5 }, (_, i) => (
                <RatingItem key={i}>
                  <Star />
                </RatingItem>
              ))}
            </Rating>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setValue(Math.max(0, value - 1))}
            >
              Decrease
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setValue(Math.min(5, value + 1))}
            >
              Increase
            </Button>
            <Button variant="outline" size="sm" onClick={() => setValue(0)}>
              Clear
            </Button>
          </div>
        </div>
      )
    }

    return <ControlledExample />
  },
  parameters: {
    docs: {
      description: {
        story:
          "Controlled rating with external state management and value display.",
      },
    },
  },
}

/**
 * Rating with hover feedback.
 */
export const WithHoverFeedback: Story = {
  render: () => {
    function HoverExample() {
      const [value, setValue] = useState(3)
      const [hoveredValue, setHoveredValue] = useState<number | null>(null)

      const labels = ["Terrible", "Bad", "Okay", "Good", "Excellent"]

      return (
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-sm font-medium">
              {hoveredValue !== null
                ? labels[hoveredValue - 1]
                : value > 0
                  ? labels[value - 1]
                  : "Not rated"}
            </p>
            <Rating
              value={value}
              onValueChange={setValue}
              onHover={setHoveredValue}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <RatingItem key={i}>
                  <Star />
                </RatingItem>
              ))}
            </Rating>
          </div>
        </div>
      )
    }

    return <HoverExample />
  },
  parameters: {
    docs: {
      description: {
        story: "Rating with text feedback on hover.",
      },
    },
  },
}

/**
 * Ratings with custom icons.
 */
export const CustomIcons: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium">Stars (default)</p>
        <Rating defaultValue={4}>
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <Star />
            </RatingItem>
          ))}
        </Rating>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Hearts</p>
        <Rating defaultValue={3}>
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <Heart />
            </RatingItem>
          ))}
        </Rating>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Thumbs up</p>
        <Rating defaultValue={2} max={3}>
          {Array.from({ length: 3 }, (_, i) => (
            <RatingItem key={i}>
              <ThumbsUp />
            </RatingItem>
          ))}
        </Rating>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Custom render function</p>
        <Rating defaultValue={3}>
          {Array.from({ length: 5 }).map((_, i) => (
            <RatingItem key={i}>
              {(state) => (
                <Star
                  className={
                    state === "full"
                      ? "text-yellow-500"
                      : state === "partial"
                        ? "text-yellow-300"
                        : "text-gray-300"
                  }
                />
              )}
            </RatingItem>
          ))}
        </Rating>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Rating components with various custom icons.",
      },
    },
  },
}

/**
 * Rating with vertical orientation.
 */
export const VerticalOrientation: Story = {
  render: () => (
    <div className="flex gap-8">
      <div>
        <p className="mb-2 text-sm font-medium">Horizontal (default)</p>
        <Rating defaultValue={3} orientation="horizontal">
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <Star />
            </RatingItem>
          ))}
        </Rating>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Vertical</p>
        <Rating defaultValue={3} orientation="vertical">
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <Star />
            </RatingItem>
          ))}
        </Rating>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Rating components with different orientations.",
      },
    },
  },
}

/**
 * Form with rating validation using react-hook-form and zod.
 */
export const WithFormValidation: Story = {
  render: () => {
    const formSchema = z.object({
      productRating: z
        .number()
        .min(1, "Please provide a rating")
        .max(5, "Rating must be between 1 and 5"),
      serviceRating: z
        .number()
        .min(1, "Please rate our service")
        .max(5, "Rating must be between 1 and 5"),
      wouldRecommend: z
        .number()
        .min(1, "Please let us know if you would recommend us")
        .max(5),
      readOnlyRating: z.number(),
      disabledRating: z.number(),
    })

    function FormExample() {
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          productRating: 0,
          serviceRating: 0,
          wouldRecommend: 0,
          readOnlyRating: 4,
          disabledRating: 3,
        },
      })

      const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
        alert(
          "Form submitted successfully!\n" + JSON.stringify(values, null, 2)
        )
      }

      return (
        <ZodSchemaProvider schema={formSchema}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6 md:w-96"
            >
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Product Quality
                </label>
                <RatingForm
                  name="productRating"
                  control={form.control}
                  icon={Star}
                  totalRating={5}
                />
                {form.formState.errors.productRating && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.productRating.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Customer Service
                </label>
                <RatingForm
                  name="serviceRating"
                  control={form.control}
                  icon={Star}
                  totalRating={5}
                />
                {form.formState.errors.serviceRating && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.serviceRating.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Would Recommend?
                </label>
                <RatingForm
                  name="wouldRecommend"
                  control={form.control}
                  clearable
                  icon={ThumbsUp}
                  totalRating={5}
                />
                {form.formState.errors.wouldRecommend && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.wouldRecommend.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Average Rating (Read-only)
                </label>
                <RatingForm
                  name="readOnlyRating"
                  control={form.control}
                  icon={Star}
                  totalRating={5}
                  readOnly
                />
                <p className="text-muted-foreground mt-1 text-sm">
                  This rating cannot be changed
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Disabled Rating
                </label>
                <RatingForm
                  name="disabledRating"
                  control={form.control}
                  icon={Star}
                  totalRating={5}
                  disabled
                />
                <p className="text-muted-foreground mt-1 text-sm">
                  This rating is disabled
                </p>
              </div>

              <Button type="submit" className="w-full">
                Submit Review
              </Button>
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
          "Example of form validation using react-hook-form and zod with RatingForm component, including read-only and disabled states.",
      },
    },
  },
}

/**
 * Half-star rating examples.
 */
export const HalfStarRating: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium">Rating: 2.5 / 5</p>
        <Rating defaultValue={2.5} step={0.5} readOnly>
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <Star />
            </RatingItem>
          ))}
        </Rating>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">
          Rating: 3.5 / 5 (interactive)
        </p>
        <Rating defaultValue={3.5} step={0.5}>
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <Star />
            </RatingItem>
          ))}
        </Rating>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Rating: 4.5 / 5 (large)</p>
        <Rating defaultValue={4.5} step={0.5} size="lg" readOnly>
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <Star />
            </RatingItem>
          ))}
        </Rating>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Rating components with half-star increments.",
      },
    },
  },
}
