# Signature Pad

TungShadcn provides a professional signature capture system based on `signature_pad`. It includes a compound component system for custom layouts and a pre-configured form variant.

---

## Architecture

```
SignaturePadRoot (Provider)
  ├── SignaturePadCanvas (The drawing area)
  ├── SignaturePadClearButton (Reset)
  ├── SignaturePadUndoButton
  ├── SignaturePadRedoButton
  └── SignaturePadPreview (Display the result)
```

---

## Basic Usage

```tsx
import {
  SignaturePadRoot,
  SignaturePadCanvas,
  SignaturePadClearButton,
  SignaturePadUndoButton,
  SignaturePadRedoButton,
} from "@/components/ui/signature-pad/signature-pad"

function MySignature() {
  return (
    <SignaturePadRoot onSignatureChange={(data) => console.log(data)}>
      <SignaturePadCanvas height={200} placeholder="Ký tên vào đây" showGrid />
      <div className="flex gap-2">
        <SignaturePadUndoButton />
        <SignaturePadRedoButton />
        <SignaturePadClearButton />
      </div>
    </SignaturePadRoot>
  )
}
```

---

## Form Integration

Always use `SignaturePadForm` for React Hook Form integration. It automatically handles the conversion of canvas strokes to a `dataURL` string.

```tsx
import { SignaturePadForm } from "@/components/ui/signature-pad/signature-pad-form"

;<SignaturePadForm
  control={control}
  name="signature"
  formComposition={{
    label: "Chữ ký xác nhận",
    description: "Vui lòng ký vào khung trên",
  }}
  canvasProps={{
    height: 150,
    showGrid: true,
  }}
/>
```

---

## Features

- **Auto-Trim**: The `dataURL` returned automatically trims whitespace around the signature for a clean result.
- **High DPI Support**: Automatically scales for Retina/High-res displays.
- **Undo/Redo**: Built-in state management for stroke history.
- **Readonly Mode**: Disables the canvas and hides toolbar buttons.
- **Ref API**: Access low-level methods like `toSVG()`, `isEmpty()`, or `fromDataURL()` via `useImperativeHandle`.

---

## Do/Don't

- **Do** use `showGrid` to help users align their signature.
- **Do** provide a clear `placeholder` text (e.g., "Ký tên tại đây").
- **Don't** use extremely small heights for the canvas; users need space for natural motion.
- **Don't** forget that the value stored in the form is a Base64 `dataURL` string.
