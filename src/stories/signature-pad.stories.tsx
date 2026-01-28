import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import {
  SignaturePadCanvas,
  SignaturePadClearButton,
  SignaturePadData,
  SignaturePadRedoButton,
  SignaturePadRoot,
  SignaturePadUndoButton,
} from "@/components/ui/signature-pad/signature-pad"
import {
  SignaturePad,
  SignaturePadForm,
} from "@/components/ui/signature-pad/signature-pad-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

/**
 * Signature Pad component allows users to draw smooth signatures on a canvas.
 * It supports high DPI screens, undo/redo functionality, and seamless integration with forms.
 */
const meta = {
  title: "Forms/SignaturePad",
  component: SignaturePad,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
npx shadcn@latest add https://react-19.octung112.workers.dev/r/signature-pad.json
\`\`\`

Signature Pad is a sophisticated drawing component based on the signature_pad library. 
It provides a professional interface for capturing user signatures with features like canvas scaling for high resolution and full state management.

## When to use
- To capture user consent via digital signature
- To facilitate document signing workflows
- To collect hand-drawn notes or sketches in a fixed area

## Key Features
- **High DPI Support**: Automatic canvas scaling for sharp rendering on Retina displays
- **Undo/Redo**: Built-in history management for signature strokes
- **Grid Background**: Optional grid lines for better signing guidance
- **Form Integration**: Works out of the box with \`react-hook-form\` and \`zod\`
- **Multiple Formats**: Exportable to DataURL (PNG), SVG, or Point groups
        `,
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description:
        "When true, prevents user interaction with the canvas and toolbar",
    },
    readonly: {
      control: "boolean",
      description:
        "When true, the signature is displayed in read-only mode without toolbar",
    },
    formComposition: {
      description:
        "Configuration for form elements like label, description, and error messages",
    },
    canvas: {
      description:
        "Configuration for the canvas area including height, placeholder, and grid",
    },
    onSignatureChange: {
      description: "Function called whenever the signature content changes",
      action: "signature changed",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-100 min-w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SignaturePad>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic signature pad with default settings and form composition.
 */
export const Default: Story = {
  args: {
    formComposition: {
      label: "Signature",
      description: "Please sign inside the box below",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Standard usage with a label and description using the formComposition pattern.",
      },
    },
  },
}

/**
 * Signature pad with an optional grid background for better alignment.
 */
export const WithGrid: Story = {
  args: {
    formComposition: {
      label: "Signature with Grid",
    },
    canvas: {
      showGrid: true,
      placeholder: "Follow the grid lines",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Enable the grid background by setting `showGrid: true` in the canvas prop.",
      },
    },
  },
}

/**
 * Disabled state prevents all interactions and dims the component.
 */
export const Disabled: Story = {
  args: {
    formComposition: {
      label: "Signature (Disabled)",
    },
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Use the `disabled` prop to prevent any user interaction.",
      },
    },
  },
}

/**
 * Readonly state hides toolbar buttons and prevents drawing.
 */
export const Readonly: Story = {
  args: {
    formComposition: {
      label: "Signature (Read-only)",
      description: "This signature cannot be modified",
    },
    readonly: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Read-only mode is useful for displaying already captured signatures.",
      },
    },
  },
}

/**
 * Demonstrates real-time data capturing using the onSignatureChange callback.
 */
export const WithOnChange: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [data, setData] = useState<SignaturePadData | null>(null)

    return (
      <div className="space-y-4">
        <SignaturePad
          formComposition={{
            label: "Captured Data",
            description: "Sign to see the exported data formats",
          }}
          onSignatureChange={setData}
        />
        <div className="bg-muted/50 rounded-md border p-4 font-mono text-xs">
          <p>
            <strong className="text-foreground">isEmpty:</strong>{" "}
            {data?.isEmpty ? "true" : "false"}
          </p>
          <p>
            <strong className="text-foreground">hasDataUrl:</strong>{" "}
            {data?.dataUrl ? "Yes (Base64)" : "No"}
          </p>
          <p>
            <strong className="text-foreground">hasSvg:</strong>{" "}
            {data?.svg ? "Yes (XML)" : "No"}
          </p>
          <p>
            <strong className="text-foreground">points:</strong>{" "}
            {data?.points?.length ?? 0} strokes
          </p>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Access different export formats (PNG, SVG, Points) via the change callback.",
      },
    },
  },
}

/**
 * Full integration with react-hook-form and zod validation.
 */
export const WithFormValidation: Story = {
  render: () => {
    const formSchema = z.object({
      signature: z.string({
        message: "Signature is required",
      }),
    })

    function FormExample() {
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
      })

      const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
      }

      return (
        <ZodSchemaProvider schema={formSchema}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <SignaturePadForm
                name="signature"
                control={form.control}
                formComposition={{
                  label: "Confirmation Signature",
                  description:
                    "You must provide a signature to submit the form",
                }}
                canvas={{
                  showGrid: true,
                }}
              />

              <Button type="submit" className="w-full">
                Submit Agreement
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
          "Use `SignaturePadForm` for automatic integration with validation schemas.",
      },
    },
  },
}

/**
 * Build a custom interface using individual building blocks.
 */
export const CustomComposition: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Custom Styled Pad</label>
        <SignaturePadRoot penColor="rgb(220, 38, 38)">
          <SignaturePadCanvas
            height={150}
            placeholder="Sign with red ink"
            showGrid
            className="rounded-xl border-2 border-dashed border-red-200"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-red-500">
              Red Ink Mode
            </span>
            <div className="flex gap-1">
              <SignaturePadUndoButton iconOnly variant="outline" />
              <SignaturePadRedoButton iconOnly variant="outline" />
              <SignaturePadClearButton
                variant="outline"
                className="text-red-500"
              >
                Reset
              </SignaturePadClearButton>
            </div>
          </div>
        </SignaturePadRoot>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Compose your own UI using Root, Canvas, and Button components for total control.",
      },
    },
  },
}

/**
 * Canvas height can be customized freely.
 */
export const DifferentHeights: Story = {
  render: () => (
    <div className="space-y-6">
      <SignaturePad
        formComposition={{ label: "Small area (100px)" }}
        canvas={{ height: 100 }}
      />
      <SignaturePad
        formComposition={{ label: "Medium area (200px)" }}
        canvas={{ height: 200 }}
      />
      <SignaturePad
        formComposition={{ label: "Large area (400px)" }}
        canvas={{ height: 400 }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Adjust the vertical signing area using the `canvas.height` property.",
      },
    },
  },
}
