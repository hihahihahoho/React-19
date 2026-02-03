# Overlays & Feedback

TungShadcn provides enhanced overlay components with smart responsive behavior and unified styling.

---

## ResponsivePopover

A smart component that automatically switches between **Popover** (on desktop) and **Drawer** (on mobile).

### Usage

```tsx
import {
  ResponsivePopover,
  ResponsivePopoverContent,
  ResponsivePopoverTrigger,
} from "@/components/ui/responsive-popover"

function MyComponent() {
  return (
    <ResponsivePopover>
      <ResponsivePopoverTrigger asChild>
        <Button>Open Menu</Button>
      </ResponsivePopoverTrigger>
      <ResponsivePopoverContent>
        <div className="p-4">{/* Content here */}</div>
      </ResponsivePopoverContent>
    </ResponsivePopover>
  )
}
```

### Components

- `ResponsivePopover`: The root container.
- `ResponsivePopoverTrigger`: The trigger element.
- `ResponsivePopoverContent`: The content panel (Drawer on mobile, Popover on desktop).
- `ResponsivePopoverHeader`/`Title`: Optional header components for mobile drawers.
- `ResponsivePopoverClose`: Helper to close the overlay.
- `ResponsivePopoverInner`: Wrapper for content with consistent padding.

---

## Sonner (Toast)

TungShadcn uses a custom-styled `sonner` for toast notifications.

### Global Setup

Ensure `<Toaster />` is in your root layout.

### Usage

```tsx
import { sonnerToast as toast } from "@/components/ui/sonner"

// Basic
toast({ title: "Updated successfully!" })

// Variants
toast({
  title: "Error occurred",
  variant: "destructive",
})

// With action button
toast({
  title: "Item deleted",
  variant: "warning",
  button: {
    label: "Undo",
    onClick: () => handleUndo(),
  },
})
```

### Variants

- `default`: Info style.
- `success`: Green background + check icon.
- `warning`: Amber background + alert icon.
- `destructive`: Red background + alert icon.
- `loading`: Includes a spinner.

---

## Photoswipe (Media Gallery)

A high-performance lightbox for images, videos, PDFs, and iframes.

### Usage

```tsx
import { Gallery, GalleryItem } from "@/components/ui/photoswipe"

const mediaItems = [
  { src: "img1.jpg", type: "image", width: 1200, height: 800 },
  { src: "video.mp4", type: "video" },
  { src: "document.pdf", type: "pdf" },
  { src: "https://example.com", type: "iframe" },
]

function MyGallery() {
  return (
    <Gallery>
      <div className="grid grid-cols-4 gap-4">
        {mediaItems.map((item, i) => (
          <GalleryItem key={i} media={item} index={i} />
        ))}
      </div>
    </Gallery>
  )
}
```

### Media Types

- **`image`**: Standard image with auto-dimension detection.
- **`video`**: HTML5 video with autoplay/pause logic in the lightbox.
- **`pdf`**: Embedded PDF viewer inside the lightbox.
- **`iframe`**: Supports external URLs and custom React nodes. Includes YouTube playback control.

---

## Dialog & Drawer

These components follow the standard shadcn/ui pattern but with enhanced styling and transition effects.

- Use **`Dialog`** for modal windows that should stay centred.
- Use **`Drawer`** for mobile-first bottom sheets.

**Pro Tip:** Use `ResponsivePopover` instead of `Popover` for most dropdown/menu scenarios to ensure mobile usability.

---

## Do/Don't

- **Do** use `ResponsivePopover` for any dropdown that contains complex content or forms.
- **Do** use `sonnerToast` for non-blocking feedback.
- **Don't** use a standard `Popover` if you expect the application to be used on mobile devices.
- **Don't** use multiple `Toaster` components.
