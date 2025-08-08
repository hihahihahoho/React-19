import {
  Gallery,
  GalleryItem,
  type GalleryMedia,
} from "@/components/ui/photoswipe"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Utilities/Photo Swipe",
  component: Gallery,
  parameters: {
    docs: {
      description: {
        component: `
\n\nPhotoSwipe provides a responsive, touch-friendly image/media gallery with zoom and swipe support.\nSupports images, videos and PDFs via the same <GalleryItem /> component.\n        `,
      },
    },
  },
} satisfies Meta<typeof Gallery>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const items: GalleryMedia[] = [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&auto=format&fit=crop&q=60",
        thumbnail:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&auto=format&fit=crop&q=60",
        alt: "Desert mountain",
      },
      {
        type: "video",
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        thumbnail:
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&auto=format&fit=crop&q=60",
        poster:
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=60",
        alt: "Flower video",
      },
      {
        type: "pdf",
        src: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
        thumbnail:
          "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=400&auto=format&fit=crop&q=60",
        alt: "PDF Document",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=60",
        thumbnail:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&auto=format&fit=crop&q=60",
        alt: "Forest river",
      },
    ]
    return (
      <Gallery>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((item, i) => (
            <GalleryItem key={i} media={item} index={i} />
          ))}
        </div>
      </Gallery>
    )
  },
}
