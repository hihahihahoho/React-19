import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form/form"
import {
  getCroppedImage,
  ImageCropArea,
  ImageCropCancel,
  ImageCropConfirm,
  ImageCropContent,
  ImageCropControls,
  ImageCropFlipHorizontal,
  ImageCropFlipVertical,
  ImageCropResetRotation,
  ImageCropResult,
  ImageCropRoot,
  ImageCropRotateLeft,
  ImageCropRotateRight,
  ImageCropRotation,
  ImageCropZoom,
} from "@/components/ui/image-crop"
import {
  ImageCropAvatar,
  ImageCropAvatarTrigger,
  useImageCropAvatarContext,
} from "@/components/ui/image-crop-avatar-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  FlipHorizontal2,
  FlipVertical2,
  Pencil,
  RotateCcw,
  RotateCw,
  Undo2,
  User,
  X,
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Sample image for demo
const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"

/**
 * A flexible image cropping component with zoom, rotation, and flip controls.
 * Built with a composition/primitive pattern for maximum customization.
 */
const meta: Meta<typeof ImageCropRoot> = {
  title: "Media/ImageCrop",
  component: ImageCropRoot,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/image-crop.json
\`\`\`

A powerful image cropping component with modern features using primitive/headless pattern.

## Features
- **Crop**: Drag to reposition, resize crop area
- **Zoom**: Pinch or use slider to zoom in/out
- **Rotation**: Rotate image with slider or quick buttons
- **Flip**: Mirror image horizontally or vertically
- **Primitive API**: Headless components - you provide your own UI

## Primitive Components (use Slot - bring your own Button)
- \`ImageCropFlipHorizontal\` - Flip horizontal trigger
- \`ImageCropFlipVertical\` - Flip vertical trigger
- \`ImageCropRotateLeft\` - Rotate -90° trigger
- \`ImageCropRotateRight\` - Rotate +90° trigger
- \`ImageCropResetRotation\` - Reset rotation trigger
- \`ImageCropConfirm\` - Confirm crop trigger
- \`ImageCropCancel\` - Cancel crop trigger
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex w-125 items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ImageCropRoot>

// ============================================================================
// Basic Example
// ============================================================================

/**
 * Basic image cropper with composition pattern.
 */
export const Basic: Story = {
  render: function BasicExample() {
    const [result, setResult] = useState<ImageCropResult | null>(null)

    return (
      <div className="w-full space-y-4">
        <ImageCropRoot
          image={SAMPLE_IMAGE}
          aspect={16 / 9}
          onConfirm={(data) => {
            setResult(data)
            console.log("Crop result:", data)
          }}
          onCancel={() => console.log("Cancelled")}
        >
          <ImageCropContent className="w-full">
            <ImageCropArea className="h-72" />

            <ImageCropControls>
              <ImageCropZoom />
              <ImageCropRotation />

              {/* Flip buttons - you provide your own Button */}
              <div className="flex flex-col gap-2">
                <label className="text-muted-foreground text-sm font-medium">
                  Flip
                </label>
                <div className="flex gap-2">
                  <ImageCropFlipHorizontal>
                    <Button variant="outline" size="sm">
                      <FlipHorizontal2 className="mr-2 size-4" />
                      Horizontal
                    </Button>
                  </ImageCropFlipHorizontal>

                  <ImageCropFlipVertical>
                    <Button variant="outline" size="sm">
                      <FlipVertical2 className="mr-2 size-4" />
                      Vertical
                    </Button>
                  </ImageCropFlipVertical>
                </div>
              </div>
            </ImageCropControls>

            {/* Action buttons - you provide your own Button */}
            <div className="flex justify-end gap-2">
              <ImageCropCancel>
                <Button variant="outline">Cancel</Button>
              </ImageCropCancel>
              <ImageCropConfirm>
                <Button>Confirm</Button>
              </ImageCropConfirm>
            </div>
          </ImageCropContent>
        </ImageCropRoot>

        {result && (
          <div className="bg-muted rounded-lg p-4">
            <h4 className="mb-2 font-medium">Result:</h4>
            <pre className="text-muted-foreground overflow-auto text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Basic example using primitive components. You provide your own Button components as children.",
      },
    },
  },
}

// ============================================================================
// With Quick Rotate
// ============================================================================

/**
 * Image cropper with quick rotate buttons.
 */
export const WithQuickRotate: Story = {
  render: function QuickRotateExample() {
    return (
      <ImageCropRoot
        image={SAMPLE_IMAGE}
        aspect={4 / 3}
        onConfirm={(data) => console.log("Result:", data)}
        onCancel={() => console.log("Cancelled")}
      >
        <ImageCropContent className="w-full">
          <ImageCropArea className="h-72" />

          <ImageCropControls>
            <ImageCropZoom />
            <ImageCropRotation />

            {/* Quick rotate buttons */}
            <div className="flex flex-col gap-2">
              <label className="text-muted-foreground text-sm font-medium">
                Quick Rotate
              </label>
              <div className="flex gap-2">
                <ImageCropRotateLeft>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="mr-2 size-4" />
                    -90°
                  </Button>
                </ImageCropRotateLeft>

                <ImageCropResetRotation>
                  <Button variant="outline" size="sm">
                    <Undo2 className="mr-2 size-4" />
                    Reset
                  </Button>
                </ImageCropResetRotation>

                <ImageCropRotateRight>
                  <Button variant="outline" size="sm">
                    <RotateCw className="mr-2 size-4" />
                    +90°
                  </Button>
                </ImageCropRotateRight>
              </div>
            </div>

            {/* Flip buttons */}
            <div className="flex flex-col gap-2">
              <label className="text-muted-foreground text-sm font-medium">
                Flip
              </label>
              <div className="flex gap-2">
                <ImageCropFlipHorizontal>
                  <Button variant="outline" size="sm">
                    <FlipHorizontal2 className="mr-2 size-4" />
                    Horizontal
                  </Button>
                </ImageCropFlipHorizontal>

                <ImageCropFlipVertical>
                  <Button variant="outline" size="sm">
                    <FlipVertical2 className="mr-2 size-4" />
                    Vertical
                  </Button>
                </ImageCropFlipVertical>
              </div>
            </div>
          </ImageCropControls>

          <div className="flex justify-end gap-2">
            <ImageCropCancel>
              <Button variant="outline">Cancel</Button>
            </ImageCropCancel>
            <ImageCropConfirm>
              <Button>Crop Image</Button>
            </ImageCropConfirm>
          </div>
        </ImageCropContent>
      </ImageCropRoot>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Image cropper with quick rotate buttons for 90-degree rotations.",
      },
    },
  },
}

// ============================================================================
// Avatar Cropper (Circle)
// ============================================================================

/**
 * Circle crop for avatar images.
 */
export const AvatarCropper: Story = {
  render: function AvatarExample() {
    return (
      <ImageCropRoot
        image={SAMPLE_IMAGE}
        aspect={1}
        onConfirm={(data) => {
          console.log("Avatar crop result:", data)
          alert("Avatar cropped successfully!")
        }}
        onCancel={() => console.log("Cancelled")}
      >
        <ImageCropContent className="w-full">
          <ImageCropArea cropShape="round" className="h-72" />

          <ImageCropControls>
            <ImageCropZoom label="Zoom" />
          </ImageCropControls>

          <div className="flex justify-end gap-2">
            <ImageCropCancel>
              <Button variant="outline">Cancel</Button>
            </ImageCropCancel>
            <ImageCropConfirm>
              <Button>Save Avatar</Button>
            </ImageCropConfirm>
          </div>
        </ImageCropContent>
      </ImageCropRoot>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "A circular crop area perfect for avatar or profile picture editors.",
      },
    },
  },
}

// ============================================================================
// Minimal Controls
// ============================================================================

/**
 * Minimal cropper with only zoom control.
 */
export const MinimalControls: Story = {
  render: function MinimalExample() {
    return (
      <ImageCropRoot
        image={SAMPLE_IMAGE}
        aspect={16 / 9}
        onConfirm={(data) => console.log("Result:", data)}
      >
        <ImageCropContent className="w-full">
          <ImageCropArea className="h-72" />

          <ImageCropControls>
            <ImageCropZoom />
          </ImageCropControls>

          <div className="flex justify-end">
            <ImageCropConfirm>
              <Button>Crop</Button>
            </ImageCropConfirm>
          </div>
        </ImageCropContent>
      </ImageCropRoot>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "A minimal cropper with only the zoom slider, suitable for simple use cases.",
      },
    },
  },
}

// ============================================================================
// With Cropped Preview
// ============================================================================

/**
 * Shows cropped image preview after confirm.
 */
export const WithCroppedPreview: Story = {
  render: function PreviewExample() {
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null)

    const handleConfirm = async (data: ImageCropResult) => {
      try {
        const blob = await getCroppedImage(
          SAMPLE_IMAGE,
          data.croppedAreaPixels,
          data.rotation,
          data.flipHorizontal,
          data.flipVertical
        )
        if (blob) {
          const url = URL.createObjectURL(blob)
          setCroppedImageUrl(url)
        }
      } catch (error) {
        console.error("Error cropping image:", error)
      }
    }

    return (
      <div className="w-full">
        <ImageCropRoot
          image={SAMPLE_IMAGE}
          aspect={1}
          onConfirm={handleConfirm}
          onCancel={() => setCroppedImageUrl(null)}
        >
          <ImageCropContent>
            <ImageCropArea className="h-80 rounded-xl" />

            <ImageCropControls className="mt-4">
              <ImageCropZoom label="Zoom Level" />
              <ImageCropRotation label="Image Rotation" />

              <div className="flex flex-col gap-2">
                <label className="text-muted-foreground text-sm font-medium">
                  Transform
                </label>
                <div className="flex gap-2">
                  <ImageCropFlipHorizontal>
                    <Button variant="outline" size="sm">
                      <FlipHorizontal2 className="size-4" />
                    </Button>
                  </ImageCropFlipHorizontal>
                  <ImageCropFlipVertical>
                    <Button variant="outline" size="sm">
                      <FlipVertical2 className="size-4" />
                    </Button>
                  </ImageCropFlipVertical>
                  <ImageCropRotateLeft>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="size-4" />
                    </Button>
                  </ImageCropRotateLeft>
                  <ImageCropRotateRight>
                    <Button variant="outline" size="sm">
                      <RotateCw className="size-4" />
                    </Button>
                  </ImageCropRotateRight>
                </div>
              </div>
            </ImageCropControls>

            <div className="mt-4 flex justify-end gap-2">
              <ImageCropCancel>
                <Button variant="outline">Reset</Button>
              </ImageCropCancel>
              <ImageCropConfirm>
                <Button>Crop Image</Button>
              </ImageCropConfirm>
            </div>
          </ImageCropContent>
        </ImageCropRoot>

        {croppedImageUrl && (
          <div className="mt-6">
            <h4 className="text-muted-foreground mb-2 text-sm font-medium">
              Cropped Preview:
            </h4>
            <img
              src={croppedImageUrl}
              alt="Cropped preview"
              className="max-h-48 rounded-lg border shadow-sm"
            />
          </div>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Full example with cropped image preview using getCroppedImage utility.",
      },
    },
  },
}

// ============================================================================
// Icon Only Buttons
// ============================================================================

/**
 * Compact layout with icon-only buttons.
 */
export const IconOnlyButtons: Story = {
  render: function IconOnlyExample() {
    return (
      <ImageCropRoot
        image={SAMPLE_IMAGE}
        aspect={16 / 9}
        onConfirm={(data) => console.log("Result:", data)}
        onCancel={() => console.log("Cancelled")}
      >
        <ImageCropContent className="w-full">
          <ImageCropArea className="h-64" />

          <ImageCropControls>
            <ImageCropZoom />

            {/* Compact toolbar with icon-only buttons */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <ImageCropRotateLeft>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    title="Rotate Left"
                  >
                    <RotateCcw className="size-4" />
                  </Button>
                </ImageCropRotateLeft>
                <ImageCropRotateRight>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    title="Rotate Right"
                  >
                    <RotateCw className="size-4" />
                  </Button>
                </ImageCropRotateRight>
                <ImageCropFlipHorizontal>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    title="Flip Horizontal"
                  >
                    <FlipHorizontal2 className="size-4" />
                  </Button>
                </ImageCropFlipHorizontal>
                <ImageCropFlipVertical>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    title="Flip Vertical"
                  >
                    <FlipVertical2 className="size-4" />
                  </Button>
                </ImageCropFlipVertical>
              </div>

              <div className="flex gap-2">
                <ImageCropCancel>
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                </ImageCropCancel>
                <ImageCropConfirm>
                  <Button size="sm">Done</Button>
                </ImageCropConfirm>
              </div>
            </div>
          </ImageCropControls>
        </ImageCropContent>
      </ImageCropRoot>
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Compact layout with icon-only buttons for a cleaner interface.",
      },
    },
  },
}

// ============================================================================
// Different Aspect Ratios
// ============================================================================

/**
 * Different aspect ratio examples.
 */
export const AspectRatios: Story = {
  render: function AspectRatiosExample() {
    const [aspect, setAspect] = useState(16 / 9)

    const aspectOptions = [
      { label: "16:9", value: 16 / 9 },
      { label: "4:3", value: 4 / 3 },
      { label: "1:1", value: 1 },
      { label: "9:16", value: 9 / 16 },
      { label: "21:9", value: 21 / 9 },
    ]

    return (
      <div className="w-full space-y-4">
        {/* Aspect Ratio Selector */}
        <div className="flex flex-wrap gap-2">
          {aspectOptions.map((option) => (
            <Button
              key={option.label}
              variant={aspect === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setAspect(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <ImageCropRoot
          image={SAMPLE_IMAGE}
          aspect={aspect}
          onConfirm={(data) => console.log("Result:", data)}
        >
          <ImageCropContent>
            <ImageCropArea className="h-64" />
            <ImageCropControls>
              <ImageCropZoom />
            </ImageCropControls>
            <div className="flex justify-end">
              <ImageCropConfirm>
                <Button>Crop</Button>
              </ImageCropConfirm>
            </div>
          </ImageCropContent>
        </ImageCropRoot>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Showcase different aspect ratios. Click the buttons to change the crop area ratio.",
      },
    },
  },
}

// ============================================================================
// Controlled State
// ============================================================================

/**
 * Example with externally controlled zoom and rotation.
 */
export const ControlledState: Story = {
  render: function ControlledExample() {
    const [zoom, setZoom] = useState(1.5)
    const [rotation, setRotation] = useState(0)

    return (
      <div className="w-full">
        {/* External Controls */}
        <div className="mb-4 flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setZoom(1)}>
            Reset Zoom
          </Button>
          <Button variant="outline" size="sm" onClick={() => setRotation(0)}>
            Reset Rotation
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setZoom(2)
              setRotation(45)
            }}
          >
            Apply Preset
          </Button>
        </div>

        <ImageCropRoot
          image={SAMPLE_IMAGE}
          aspect={1}
          zoom={zoom}
          onZoomChange={setZoom}
          rotation={rotation}
          onRotationChange={setRotation}
          onConfirm={(data) => console.log("Result:", data)}
        >
          <ImageCropContent>
            <ImageCropArea className="h-64" />
            <ImageCropControls>
              <ImageCropZoom />
              <ImageCropRotation />
            </ImageCropControls>
            <div className="flex justify-end">
              <ImageCropConfirm>
                <Button>Crop</Button>
              </ImageCropConfirm>
            </div>
          </ImageCropContent>
        </ImageCropRoot>

        <div className="text-muted-foreground mt-4 text-center text-sm">
          Zoom: {zoom.toFixed(2)}x | Rotation: {rotation}°
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates controlled state where zoom and rotation are managed externally.",
      },
    },
  },
}

// ============================================================================
// Avatar Picker (Click to Crop)
// ============================================================================

// Custom trigger that gets everything from context
function CustomAvatarTrigger({
  onClear,
  size = "size-30",
}: {
  onClear?: () => void
  size?: string
}) {
  const { previewUrl } = useImageCropAvatarContext()

  return (
    <div className="group relative">
      <ImageCropAvatarTrigger className="group relative rounded-full">
        <Avatar className={size}>
          <AvatarImage src={previewUrl ?? undefined} alt="Avatar" />
          <AvatarFallback>
            <User className="size-1/2 opacity-50" />
          </AvatarFallback>
        </Avatar>

        {/* Edit overlay */}
        <div className="bg-foreground/60 absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100">
          <Pencil className="text-background size-6" />
        </div>
      </ImageCropAvatarTrigger>

      {/* Clear button - show when there's a preview */}
      {previewUrl && onClear && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClear()
          }}
          className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  )
}

/**
 * Avatar picker with custom trigger using ImageCropAvatarTrigger.
 * The trigger uses useImageCropAvatarContext() to get previewUrl from context.
 */
export const AvatarPicker: Story = {
  render: function AvatarPickerExample() {
    const [avatar, setAvatar] = useState<string | File | null>(SAMPLE_IMAGE)

    return (
      <div className="flex flex-col items-center gap-4">
        <ImageCropAvatar
          value={avatar}
          onChange={setAvatar}
          dialogTitle="Crop Avatar"
          dialogDescription="Adjust your profile picture"
        >
          <CustomAvatarTrigger onClear={() => setAvatar(null)} />
        </ImageCropAvatar>

        <p className="text-muted-foreground text-sm">
          {avatar
            ? avatar instanceof File
              ? `Selected: ${avatar.name}`
              : "Preloaded image"
            : "Click to upload avatar"}
        </p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Avatar picker using `useImageCropAvatarContext()` to get `previewUrl` from context.",
      },
    },
  },
}

// ============================================================================
// Avatar Form Integration
// ============================================================================

const AvatarFormSchema = z.object({
  avatar: z
    .union([z.string(), z.instanceof(File)])
    .nullable()
    .optional(),
})

/**
 * Avatar picker integrated with react-hook-form.
 * Uses form.watch() to pass value to ImageCropAvatar.
 * Trigger uses useImageCropAvatarContext() to get previewUrl.
 */
export const AvatarFormIntegration: Story = {
  render: function AvatarFormExample() {
    const form = useForm<z.infer<typeof AvatarFormSchema>>({
      resolver: zodResolver(AvatarFormSchema),
      defaultValues: {
        avatar: SAMPLE_IMAGE,
      },
    })

    const avatarValue = form.watch("avatar")

    const onSubmit = (data: z.infer<typeof AvatarFormSchema>) => {
      console.log("Form submitted:", data)
      alert(
        `Avatar: ${
          data.avatar
            ? data.avatar instanceof File
              ? data.avatar.name
              : "URL"
            : "None"
        }`
      )
    }

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-80 flex-col items-center gap-6"
        >
          <ImageCropAvatar
            value={avatarValue}
            onChange={(file) => form.setValue("avatar", file)}
            dialogTitle="Upload Avatar"
          >
            <CustomAvatarTrigger
              size="size-24"
              onClear={() => form.setValue("avatar", null)}
            />
          </ImageCropAvatar>

          <p className="text-muted-foreground text-center text-xs">
            Click avatar to change • Hover to see delete button
          </p>

          <div className="flex w-full gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" className="flex-1">
              Save Profile
            </Button>
          </div>
        </form>
      </Form>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Form with `form.watch()` passing value to `ImageCropAvatar`. Trigger uses `useImageCropAvatarContext()` to get `previewUrl`.",
      },
    },
  },
}
