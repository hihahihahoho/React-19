"use client"

import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { Loader2 } from "lucide-react"
import * as React from "react"
import Cropper, {
  type Area,
  type CropperProps,
  type Point,
} from "react-easy-crop"

// ============================================================================
// Types
// ============================================================================

interface CropAreaPixels {
  x: number
  y: number
  width: number
  height: number
}

interface ImageCropResult {
  croppedAreaPixels: CropAreaPixels
  rotation: number
  flipHorizontal: boolean
  flipVertical: boolean
  zoom: number
}

// ============================================================================
// Context
// ============================================================================

interface ImageCropContextValue {
  image: string
  crop: Point
  setCrop: (crop: Point) => void
  zoom: number
  setZoom: (zoom: number) => void
  rotation: number
  setRotation: (rotation: number) => void
  flipHorizontal: boolean
  setFlipHorizontal: (flip: boolean) => void
  flipVertical: boolean
  setFlipVertical: (flip: boolean) => void
  croppedAreaPixels: CropAreaPixels | null
  setCroppedAreaPixels: (area: CropAreaPixels) => void
  aspect: number
  minZoom: number
  maxZoom: number
  onConfirm?: (result: ImageCropResult) => void
  onCancel?: () => void
}

const ImageCropContext = React.createContext<ImageCropContextValue | null>(null)

const useImageCropContext = () => {
  const context = React.useContext(ImageCropContext)
  if (!context) {
    throw new Error("ImageCrop components must be used within <ImageCropRoot>")
  }
  return context
}

// ============================================================================
// Root Component
// ============================================================================

interface ImageCropRootProps {
  /** Source image URL or base64 string */
  image: string
  /** Aspect ratio of the crop area (width/height) */
  aspect?: number
  /** Initial zoom level */
  defaultZoom?: number
  /** Controlled zoom level */
  zoom?: number
  /** Callback when zoom changes */
  onZoomChange?: (zoom: number) => void
  /** Initial rotation in degrees */
  defaultRotation?: number
  /** Controlled rotation value */
  rotation?: number
  /** Callback when rotation changes */
  onRotationChange?: (rotation: number) => void
  /** Minimum zoom level */
  minZoom?: number
  /** Maximum zoom level */
  maxZoom?: number
  /** Callback when confirm button is clicked */
  onConfirm?: (result: ImageCropResult) => void
  /** Callback when cancel button is clicked */
  onCancel?: () => void
  /** Children components */
  children: React.ReactNode
}

function ImageCropRoot({
  children,
  image,
  aspect = 1,
  defaultZoom = 1,
  zoom: controlledZoom,
  onZoomChange,
  defaultRotation = 0,
  rotation: controlledRotation,
  onRotationChange,
  minZoom = 1,
  maxZoom = 3,
  onConfirm,
  onCancel,
}: ImageCropRootProps) {
  const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 })
  const [internalZoom, setInternalZoom] = React.useState(defaultZoom)
  const [internalRotation, setInternalRotation] =
    React.useState(defaultRotation)
  const [flipHorizontal, setFlipHorizontal] = React.useState(false)
  const [flipVertical, setFlipVertical] = React.useState(false)
  const [croppedAreaPixels, setCroppedAreaPixels] =
    React.useState<CropAreaPixels | null>(null)

  const zoom = controlledZoom ?? internalZoom
  const rotation = controlledRotation ?? internalRotation

  const handleZoomChange = React.useCallback(
    (newZoom: number) => {
      if (controlledZoom === undefined) {
        setInternalZoom(newZoom)
      }
      onZoomChange?.(newZoom)
    },
    [controlledZoom, onZoomChange]
  )

  const handleRotationChange = React.useCallback(
    (newRotation: number) => {
      if (controlledRotation === undefined) {
        setInternalRotation(newRotation)
      }
      onRotationChange?.(newRotation)
    },
    [controlledRotation, onRotationChange]
  )

  const contextValue = React.useMemo(
    () => ({
      image,
      crop,
      setCrop,
      zoom,
      setZoom: handleZoomChange,
      rotation,
      setRotation: handleRotationChange,
      flipHorizontal,
      setFlipHorizontal,
      flipVertical,
      setFlipVertical,
      croppedAreaPixels,
      setCroppedAreaPixels,
      aspect,
      minZoom,
      maxZoom,
      onConfirm,
      onCancel,
    }),
    [
      image,
      crop,
      zoom,
      handleZoomChange,
      rotation,
      handleRotationChange,
      flipHorizontal,
      flipVertical,
      croppedAreaPixels,
      aspect,
      minZoom,
      maxZoom,
      onConfirm,
      onCancel,
    ]
  )

  return (
    <ImageCropContext.Provider value={contextValue}>
      {children}
    </ImageCropContext.Provider>
  )
}

// ============================================================================
// Content Component (Styled container - optional)
// ============================================================================

type ImageCropContentProps = React.ComponentProps<"div">

function ImageCropContent({
  className,
  children,
  ...props
}: ImageCropContentProps) {
  return (
    <div
      data-slot="image-crop-content"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Cropper Area Component
// ============================================================================

interface ImageCropAreaProps extends Partial<
  Omit<
    CropperProps,
    | "image"
    | "crop"
    | "zoom"
    | "rotation"
    | "aspect"
    | "minZoom"
    | "maxZoom"
    | "onCropChange"
    | "onZoomChange"
    | "onCropComplete"
  >
> {
  className?: string
}

function ImageCropArea({
  className,
  cropShape = "rect",
  showGrid = true,
  ...props
}: ImageCropAreaProps) {
  const {
    image,
    crop,
    setCrop,
    zoom,
    setZoom,
    rotation,
    aspect,
    minZoom,
    maxZoom,
    setCroppedAreaPixels,
    flipHorizontal,
    flipVertical,
  } = useImageCropContext()

  const [isMediaLoaded, setIsMediaLoaded] = React.useState(false)

  const handleCropComplete = React.useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    [setCroppedAreaPixels]
  )

  // Transform for flip effects
  const transform = React.useMemo(() => {
    const transforms: string[] = []
    if (flipHorizontal) transforms.push("scaleX(-1)")
    if (flipVertical) transforms.push("scaleY(-1)")
    return transforms.length > 0 ? transforms.join(" ") : undefined
  }, [flipHorizontal, flipVertical])

  return (
    <div
      data-slot="image-crop-area"
      className={cn(
        "relative h-64 w-full overflow-hidden rounded-lg bg-black",
        className
      )}
    >
      {/* Loading overlay */}
      {!isMediaLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black text-white">
          <Loader2 className="size-6 animate-spin" />
        </div>
      )}

      <div className="absolute inset-0" style={{ transform }}>
        <Cropper
          key={image} // Force remount when image changes, resets loading state
          image={image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspect}
          minZoom={minZoom}
          maxZoom={maxZoom}
          cropShape={cropShape}
          showGrid={showGrid}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
          onMediaLoaded={() => setIsMediaLoaded(true)}
          {...props}
        />
      </div>
    </div>
  )
}

// ============================================================================
// Controls Container
// ============================================================================

type ImageCropControlsProps = React.ComponentProps<"div">

function ImageCropControls({
  className,
  children,
  ...props
}: ImageCropControlsProps) {
  return (
    <div
      data-slot="image-crop-controls"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Zoom Slider
// ============================================================================

interface ImageCropZoomProps extends React.ComponentProps<"div"> {
  /** Label for the zoom slider */
  label?: React.ReactNode
  /** Show value display */
  showValue?: boolean
}

function ImageCropZoom({
  className,
  label = "Zoom",
  showValue = true,
  ...props
}: ImageCropZoomProps) {
  const { zoom, setZoom, minZoom, maxZoom } = useImageCropContext()

  // Convert zoom value to percentage for display
  const zoomPercentage = Math.round((zoom / maxZoom) * 100)

  return (
    <div
      data-slot="image-crop-zoom"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <label className="text-muted-foreground text-sm font-medium">
          {label}
        </label>
        {showValue && (
          <span className="text-muted-foreground text-sm tabular-nums">
            {zoomPercentage}%
          </span>
        )}
      </div>
      <Slider
        min={minZoom}
        max={maxZoom}
        step={0.1}
        value={[zoom]}
        onValueChange={(values) => setZoom(values[0])}
        className="w-full"
      />
    </div>
  )
}

// ============================================================================
// Rotation Slider
// ============================================================================

interface ImageCropRotationProps extends React.ComponentProps<"div"> {
  /** Label for the rotation slider */
  label?: React.ReactNode
  /** Show value display */
  showValue?: boolean
  /** Minimum rotation in degrees */
  min?: number
  /** Maximum rotation in degrees */
  max?: number
}

function ImageCropRotation({
  className,
  label = "Rotate",
  showValue = true,
  min = -180,
  max = 180,
  ...props
}: ImageCropRotationProps) {
  const { rotation, setRotation } = useImageCropContext()

  return (
    <div
      data-slot="image-crop-rotation"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <label className="text-muted-foreground text-sm font-medium">
          {label}
        </label>
        {showValue && (
          <span className="text-muted-foreground text-sm tabular-nums">
            {rotation}°
          </span>
        )}
      </div>
      <Slider
        min={min}
        max={max}
        step={1}
        value={[rotation]}
        onValueChange={(values) => setRotation(values[0])}
        className="w-full"
      />
    </div>
  )
}

// ============================================================================
// Flip Horizontal (Primitive - uses Slot)
// ============================================================================

type ImageCropFlipHorizontalProps = React.ComponentProps<"button">

function ImageCropFlipHorizontal({
  children,
  ...props
}: ImageCropFlipHorizontalProps) {
  const { flipHorizontal, setFlipHorizontal } = useImageCropContext()

  return (
    <Slot
      data-slot="image-crop-flip-horizontal"
      data-active={flipHorizontal}
      onClick={() => setFlipHorizontal(!flipHorizontal)}
      {...props}
    >
      {children}
    </Slot>
  )
}

// ============================================================================
// Flip Vertical (Primitive - uses Slot)
// ============================================================================

type ImageCropFlipVerticalProps = React.ComponentProps<"button">

function ImageCropFlipVertical({
  children,
  ...props
}: ImageCropFlipVerticalProps) {
  const { flipVertical, setFlipVertical } = useImageCropContext()

  return (
    <Slot
      data-slot="image-crop-flip-vertical"
      data-active={flipVertical}
      onClick={() => setFlipVertical(!flipVertical)}
      {...props}
    >
      {children}
    </Slot>
  )
}

// ============================================================================
// Rotate Left (Primitive - uses Slot)
// ============================================================================

type ImageCropRotateLeftProps = React.ComponentProps<"button">

function ImageCropRotateLeft({ children, ...props }: ImageCropRotateLeftProps) {
  const { rotation, setRotation } = useImageCropContext()

  return (
    <Slot
      data-slot="image-crop-rotate-left"
      onClick={() => setRotation((rotation - 90) % 360)}
      {...props}
    >
      {children}
    </Slot>
  )
}

// ============================================================================
// Rotate Right (Primitive - uses Slot)
// ============================================================================

type ImageCropRotateRightProps = React.ComponentProps<"button">

function ImageCropRotateRight({
  children,
  ...props
}: ImageCropRotateRightProps) {
  const { rotation, setRotation } = useImageCropContext()

  return (
    <Slot
      data-slot="image-crop-rotate-right"
      onClick={() => setRotation((rotation + 90) % 360)}
      {...props}
    >
      {children}
    </Slot>
  )
}

// ============================================================================
// Reset Rotation (Primitive - uses Slot)
// ============================================================================

type ImageCropResetRotationProps = React.ComponentProps<"button">

function ImageCropResetRotation({
  children,
  ...props
}: ImageCropResetRotationProps) {
  const { setRotation } = useImageCropContext()

  return (
    <Slot
      data-slot="image-crop-reset-rotation"
      onClick={() => setRotation(0)}
      {...props}
    >
      {children}
    </Slot>
  )
}

// ============================================================================
// Confirm Button (Primitive - uses Slot)
// ============================================================================

type ImageCropConfirmProps = React.ComponentProps<"button">

function ImageCropConfirm({ children, ...props }: ImageCropConfirmProps) {
  const {
    croppedAreaPixels,
    rotation,
    flipHorizontal,
    flipVertical,
    zoom,
    onConfirm,
  } = useImageCropContext()

  const handleConfirm = React.useCallback(() => {
    if (croppedAreaPixels && onConfirm) {
      onConfirm({
        croppedAreaPixels,
        rotation,
        flipHorizontal,
        flipVertical,
        zoom,
      })
    }
  }, [
    croppedAreaPixels,
    rotation,
    flipHorizontal,
    flipVertical,
    zoom,
    onConfirm,
  ])

  return (
    <Slot
      data-slot="image-crop-confirm"
      onClick={handleConfirm}
      disabled={!croppedAreaPixels}
      {...props}
    >
      {children}
    </Slot>
  )
}

// ============================================================================
// Cancel Button (Primitive - uses Slot)
// ============================================================================

type ImageCropCancelProps = React.ComponentProps<"button">

function ImageCropCancel({ children, ...props }: ImageCropCancelProps) {
  const { onCancel } = useImageCropContext()

  if (!onCancel) return null

  return (
    <Slot data-slot="image-crop-cancel" onClick={onCancel} {...props}>
      {children}
    </Slot>
  )
}

// ============================================================================
// Utility: Get Cropped Image
// ============================================================================

async function getCroppedImage(
  imageSrc: string,
  pixelCrop: CropAreaPixels,
  rotation = 0,
  flipHorizontal = false,
  flipVertical = false
): Promise<Blob | null> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) return null

  const rotRad = getRadianAngle(rotation)

  // Calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  )

  // Set canvas size to match the bounding box
  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  // Translate canvas context to center before rotation
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)

  // Apply flip transformations
  ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1)

  ctx.translate(-image.width / 2, -image.height / 2)

  // Draw rotated image
  ctx.drawImage(image, 0, 0)

  // Extract the cropped image
  const croppedCanvas = document.createElement("canvas")
  const croppedCtx = croppedCanvas.getContext("2d")

  if (!croppedCtx) return null

  croppedCanvas.width = pixelCrop.width
  croppedCanvas.height = pixelCrop.height

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve) => {
    croppedCanvas.toBlob((blob) => {
      resolve(blob)
    }, "image/jpeg")
  })
}

// Helper functions
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.setAttribute("crossOrigin", "anonymous")
    image.src = url
  })
}

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation)
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

// ============================================================================
// Exports
// ============================================================================

export {
  getCroppedImage,
  ImageCropArea,
  ImageCropCancel,
  ImageCropConfirm,
  ImageCropContent,
  ImageCropControls,
  ImageCropFlipHorizontal,
  ImageCropFlipVertical,
  ImageCropResetRotation,
  ImageCropRoot,
  ImageCropRotateLeft,
  ImageCropRotateRight,
  ImageCropRotation,
  ImageCropZoom,
  useImageCropContext,
}

export type {
  CropAreaPixels,
  ImageCropAreaProps,
  ImageCropCancelProps,
  ImageCropConfirmProps,
  ImageCropContentProps,
  ImageCropControlsProps,
  ImageCropFlipHorizontalProps,
  ImageCropFlipVerticalProps,
  ImageCropResetRotationProps,
  ImageCropResult,
  ImageCropRootProps,
  ImageCropRotateLeftProps,
  ImageCropRotateRightProps,
  ImageCropRotationProps,
  ImageCropZoomProps,
}
