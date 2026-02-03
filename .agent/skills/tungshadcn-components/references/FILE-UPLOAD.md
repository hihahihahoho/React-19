# File Upload System

TungShadcn provides advanced file upload components with drag-and-drop, preview support, validation, and seamless form integration.

---

## FileUpload vs FileUploadList

| Component        | Layout     | Best For                                         |
| ---------------- | ---------- | ------------------------------------------------ |
| `FileUpload`     | Grid-based | Primarily images, gallery-style layouts          |
| `FileUploadList` | List-based | Documents, long file names, clean line-item look |

---

## Usage (Inside Forms)

Always use the `*Form` variants for automatic integration with React Hook Form.

```tsx
import { FileUploadForm } from "@/components/ui/file-upload/file-upload-form"
;<FileUploadForm
  control={control}
  name="attachments"
  maxFiles={5}
  accept={["image/png", "image/jpeg", "application/pdf"]}
  maxFileSize={5 * 1024 * 1024} // 5MB
  formComposition={{
    label: "Tài liệu đính kèm",
    description: "Tải lên tối đa 5 tệp (PNG, JPG, PDF)",
  }}
/>
```

---

## Remote Files Pattern

You can pass "remote" files (files already on the server) by prefixing the filename with `REMOTE_FILE::`.

```tsx
const existingFiles = [
  new File([], "REMOTE_FILE::https://example.com/image.jpg", { type: "image/jpeg" })
]

<FileUploadForm
  control={control}
  name="images"
  defaultValue={existingFiles}
/>
```

The `useFileUpload` hook automatically detects this prefix and handling preview/download URLs correctly.

---

## Props

- `maxFiles`: Maximum number of files allowed (default: 5). If set to 1, it replaces the current file when a new one is picked.
- `accept`: Array of MIME types (e.g., `["image/*", "application/pdf"]`).
- `maxFileSize`: Maximum size in bytes.
- `onFileChange`: Callback when files change (returns `FileList`).

---

## ImageCrop & Avatar

For profile pictures or specific aspect ratios:

```tsx
import { ImageCropAvatarForm } from "@/components/ui/image-crop-avatar-form"
;<ImageCropAvatarForm
  control={control}
  name="avatar"
  aspect={1} // Square
  formComposition={{ label: "Ảnh đại diện" }}
/>
```

### Manual ImageCrop (Compound)

If you need a custom cropping UI, use the compound components:

```tsx
import {
  ImageCropRoot,
  ImageCropArea,
  ImageCropZoom,
  ImageCropRotation,
  ImageCropConfirm,
  getCroppedImage,
} from "@/components/ui/image-crop"

function MyCropper({ src }) {
  const handleConfirm = async (result) => {
    const blob = await getCroppedImage(
      src,
      result.croppedAreaPixels,
      result.rotation
    )
    // Upload blob...
  }

  return (
    <ImageCropRoot image={src} aspect={16 / 9} onConfirm={handleConfirm}>
      <ImageCropArea />
      <ImageCropZoom />
      <ImageCropRotation />
      <ImageCropConfirm>Crop & Save</ImageCropConfirm>
    </ImageCropRoot>
  )
}
```

---

## Do/Don't

- **Do** provide specific `accept` types to guide the user.
- **Do** use `FileUploadList` if the filenames are long or if you have many documents.
- **Do** use `REMOTE_FILE::` prefix for pre-existing server files.
- **Don't** forget that `onFileChange` provides a `FileList`, while the internal state uses `File[]`. The `*Form` components handle this translation for you.
