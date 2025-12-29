"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormField } from "@/components/ui/form/form"
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
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import {
  FlipHorizontal2,
  FlipVertical2,
  Loader2,
  RefreshCw,
  RotateCcw,
  RotateCw,
} from "lucide-react"
import * as React from "react"
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"

// ============================================================================
// Types
// ============================================================================

interface ImageCropAvatarContextValue {
  previewUrl: string | null
  triggerFileSelect: () => void
  disabled: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
}

const ImageCropAvatarContext =
  React.createContext<ImageCropAvatarContextValue | null>(null)

function useImageCropAvatarContext() {
  const context = React.useContext(ImageCropAvatarContext)
  if (!context) {
    throw new Error(
      "ImageCropAvatarTrigger must be used within ImageCropAvatar"
    )
  }
  return context
}

interface ImageCropAvatarProps extends Omit<
  React.ComponentProps<"div">,
  "onChange"
> {
  /** Current image URL or File */
  value?: string | File | null
  /** Callback when image changes (called on confirm) */
  onChange?: (file: File | null) => void
  /** Aspect ratio of the crop area */
  aspect?: number
  /** Dialog title */
  dialogTitle?: string
  /** Dialog description */
  dialogDescription?: string
  /** Disabled state */
  disabled?: boolean
  /** Children - use ImageCropAvatarTrigger for customization */
  children?: React.ReactNode
}

interface ImageCropAvatarTriggerProps extends React.ComponentProps<"button"> {
  /** Use child element as trigger */
  asChild?: boolean
}

// ============================================================================
// ImageCropAvatarTrigger Component
// ============================================================================

function ImageCropAvatarTrigger({
  asChild = false,
  className,
  children,
  onClick,
  ...props
}: ImageCropAvatarTriggerProps) {
  const { triggerFileSelect, disabled } = useImageCropAvatarContext()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    onClick?.(e)
    triggerFileSelect()
  }

  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}

// ============================================================================
// ImageCropAvatar Component
// ============================================================================

function ImageCropAvatar({
  className,
  value,
  onChange,
  aspect = 1,
  dialogTitle = "Crop Image",
  dialogDescription = "Adjust and crop your image",
  disabled = false,
  children,
  ...props
}: ImageCropAvatarProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [tempImage, setTempImage] = React.useState<string | null>(null)
  const [originalFileName, setOriginalFileName] =
    React.useState<string>("cropped.jpg")
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Get current preview URL
  const previewUrl = React.useMemo(() => {
    if (!value) return null
    if (typeof value === "string") return value
    return URL.createObjectURL(value)
  }, [value])

  // Cleanup blob URL
  React.useEffect(() => {
    return () => {
      if (previewUrl && typeof value !== "string") {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl, value])

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setTempImage(url)
      setOriginalFileName(file.name)
      setIsOpen(true)
    }
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  // Handle crop confirm - call onChange directly
  const handleConfirm = async (result: ImageCropResult) => {
    if (!tempImage) return

    setIsLoading(true)
    try {
      const blob = await getCroppedImage(
        tempImage,
        result.croppedAreaPixels,
        result.rotation,
        result.flipHorizontal,
        result.flipVertical
      )

      if (blob) {
        const file = new File([blob], originalFileName, { type: "image/jpeg" })
        // Call onChange directly
        onChange?.(file)
      }

      // Close dialog
      setIsOpen(false)
    } catch (error) {
      console.error("Error cropping image:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    setIsOpen(false)
  }

  // Handle dialog open change - cleanup tempImage when closing
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)

    if (!open && tempImage) {
      URL.revokeObjectURL(tempImage)
      setTempImage(null)
    }
  }

  // Trigger file select
  const triggerFileSelect = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  const contextValue: ImageCropAvatarContextValue = {
    previewUrl,
    triggerFileSelect,
    disabled,
    inputRef,
  }

  return (
    <ImageCropAvatarContext.Provider value={contextValue}>
      <div
        data-slot="image-crop-avatar"
        className={cn("relative inline-block", className)}
        {...props}
      >
        {children}

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Crop Dialog */}
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

          {tempImage && (
            <ImageCropRoot
              image={tempImage}
              aspect={aspect}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            >
              <ImageCropContent className="px-4 sm:px-6">
                <ImageCropArea cropShape="round" className="h-72" />

                <ImageCropControls>
                  <div className="flex justify-center gap-2">
                    <ImageCropFlipHorizontal>
                      <Button
                        iconOnly
                        variant="outline"
                        size="sm"
                        title="Flip Horizontal"
                      >
                        <FlipHorizontal2 className="size-4" />
                      </Button>
                    </ImageCropFlipHorizontal>
                    <ImageCropFlipVertical>
                      <Button
                        iconOnly
                        variant="outline"
                        size="sm"
                        title="Flip Vertical"
                      >
                        <FlipVertical2 className="size-4" />
                      </Button>
                    </ImageCropFlipVertical>
                    <div className="bg-border mx-2 h-8 w-px" />
                    <ImageCropRotateLeft>
                      <Button
                        iconOnly
                        variant="outline"
                        size="sm"
                        title="Rotate Left"
                      >
                        <RotateCcw className="size-4" />
                      </Button>
                    </ImageCropRotateLeft>
                    <ImageCropResetRotation>
                      <Button
                        iconOnly
                        variant="outline"
                        size="sm"
                        title="Reset Rotation"
                      >
                        <RefreshCw className="size-4" />
                      </Button>
                    </ImageCropResetRotation>
                    <ImageCropRotateRight>
                      <Button
                        iconOnly
                        variant="outline"
                        size="sm"
                        title="Rotate Right"
                      >
                        <RotateCw className="size-4" />
                      </Button>
                    </ImageCropRotateRight>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <ImageCropZoom />
                    <ImageCropRotation />
                  </div>
                </ImageCropControls>
              </ImageCropContent>

              <DialogFooter>
                <ImageCropCancel>
                  <Button variant="outline" disabled={isLoading}>
                    Cancel
                  </Button>
                </ImageCropCancel>
                <ImageCropConfirm>
                  <Button disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </ImageCropConfirm>
              </DialogFooter>
            </ImageCropRoot>
          )}
        </DialogContent>
      </Dialog>
    </ImageCropAvatarContext.Provider>
  )
}

// ============================================================================
// ImageCropAvatarForm Component
// ============================================================================

interface ImageCropAvatarFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>
  extends
    Omit<ControllerProps<TFieldValues, TName>, "render">,
    Omit<
      ImageCropAvatarProps,
      "value" | "onChange" | "name" | "defaultValue"
    > {}

function ImageCropAvatarForm<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  defaultValue,
  ...props
}: ImageCropAvatarFormProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      control={control}
      defaultValue={defaultValue as TFieldValues[TName]}
      render={({ field: { value, onChange } }) => {
        return (
          <ImageCropAvatar
            value={value}
            onChange={(file) => onChange(file as TFieldValues[TName])}
            {...props}
          />
        )
      }}
    />
  )
}

// ============================================================================
// Exports
// ============================================================================

export {
  ImageCropAvatar,
  ImageCropAvatarForm,
  ImageCropAvatarTrigger,
  useImageCropAvatarContext,
}

export type {
  ImageCropAvatarFormProps,
  ImageCropAvatarProps,
  ImageCropAvatarTriggerProps,
}
