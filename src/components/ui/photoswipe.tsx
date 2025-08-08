import "photoswipe/dist/photoswipe.css"
import React from "react"
import { Item, Gallery as PrimitiveGallery } from "react-photoswipe-gallery"

// Types
export type GalleryImageType = {
  type?: "image"
  src: string
  thumbnail?: string
  width?: number
  height?: number
  alt?: string
}
export type GalleryVideoType = {
  type: "video"
  src: string
  thumbnail?: string
  width?: number | string
  height?: number | string
  alt?: string
  poster?: string
}
export type GalleryPdfType = {
  type: "pdf"
  src: string
  thumbnail?: string
  width?: number | string
  height?: number | string
  alt?: string
}
export type GalleryMedia = GalleryImageType | GalleryVideoType | GalleryPdfType

// Image item (minimal detection once)
export function ImageGalleryItem({
  image,
  index,
}: {
  image: GalleryImageType
  index: number
}) {
  const [dims, setDims] = React.useState({
    width: image.width || 0,
    height: image.height || 0,
  })

  React.useEffect(() => {
    if (image.width && image.height) return
    const img = new Image()
    img.onload = () => {
      setDims({
        width: img.naturalWidth || 800,
        height: img.naturalHeight || 600,
      })
    }
    img.src = image.src
  }, [image.src, image.width, image.height])

  const w = dims.width || 800
  const h = dims.height || 600
  const thumb = image.thumbnail || image.src

  return (
    <Item
      key={index}
      original={image.src}
      thumbnail={thumb}
      width={w}
      height={h}
    >
      {({ ref, open }) => (
        <img
          ref={ref}
          onClick={open}
          src={thumb}
          alt={image.alt || ""}
          className="aspect-square h-full w-full rounded-md object-cover"
          loading="lazy"
        />
      )}
    </Item>
  )
}

// Video item (html slide content)
export function VideoGalleryItem({
  video,
  index,
}: {
  video: GalleryVideoType
  index: number
}) {
  // Detect real video dimensions (metadata) if not provided
  const [dims, setDims] = React.useState<{ width: number; height: number }>(
    () => ({
      width:
        typeof video.width === "number"
          ? video.width
          : Number(video.width) || 0,
      height:
        typeof video.height === "number"
          ? video.height
          : Number(video.height) || 0,
    })
  )

  React.useEffect(() => {
    if (dims.width && dims.height) return // already have both
    const el = document.createElement("video")
    el.preload = "metadata"
    el.src = video.src
    const onLoaded = () => {
      if (el.videoWidth && el.videoHeight) {
        setDims({ width: el.videoWidth, height: el.videoHeight })
      } else {
        // fallback if metadata fails
        setDims({ width: 640, height: 360 })
      }
    }
    el.addEventListener("loadedmetadata", onLoaded)
    return () => {
      el.removeEventListener("loadedmetadata", onLoaded)
    }
  }, [video.src, dims.width, dims.height])

  const w = dims.width || 640
  const h = dims.height || 360
  const thumb = video.thumbnail || video.src
  const html = `\n<video controls style="max-width:100%;max-height:100vh;object-fit:contain;" onended="this.pause();this.currentTime=0;">\n  <source src="${video.src}" type="video/mp4" />\n  Your browser does not support the video tag.\n</video>`
  return (
    <Item key={index} html={html} thumbnail={thumb} width={w} height={h}>
      {({ ref, open }) => (
        <div
          ref={ref}
          onClick={open}
          className="relative aspect-square h-full w-full cursor-zoom-in overflow-hidden rounded-md"
        >
          <video
            src={video.src}
            className="h-full w-full object-cover object-center"
            muted
            playsInline
          />
          <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center bg-black/30 text-white">
            <svg viewBox="0 0 24 24" className="h-10 w-10 fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="absolute right-1 bottom-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {w}×{h}
          </div>
        </div>
      )}
    </Item>
  )
}

// PDF item
export function PdfGalleryItem({
  pdf,
  index,
}: {
  pdf: GalleryPdfType
  index: number
}) {
  const w = Number(pdf.width) || 800
  const h = Number(pdf.height) || 1131
  const thumb = pdf.thumbnail || pdf.src
  const html = `<iframe src="${pdf.src}" title="${pdf.alt || "PDF"}" style="width:100%;height:100%;border:0;"></iframe>`
  return (
    <Item key={index} html={html} thumbnail={thumb} width={w} height={h}>
      {({ ref, open }) => (
        <div
          ref={ref}
          onClick={open}
          className="bg-muted/40 relative aspect-square h-full w-full cursor-zoom-in overflow-hidden rounded-md"
        >
          <div className="flex h-full w-full items-center justify-center text-center">
            <div className="flex flex-col items-center gap-2 p-4 text-xs font-medium">
              <span className="bg-primary/10 text-primary rounded px-2 py-1">
                PDF
              </span>
              <span>{pdf.alt || "Open PDF"}</span>
            </div>
          </div>
        </div>
      )}
    </Item>
  )
}

// Unified (backward compatible) GalleryItem
function GalleryItem({
  media,
  image,
  index,
}: {
  media?: GalleryMedia
  image?: GalleryMedia
  index: number
}) {
  const data = media || image
  if (!data) return null
  if (data.type === "video")
    return <VideoGalleryItem video={data as GalleryVideoType} index={index} />
  if (data.type === "pdf")
    return <PdfGalleryItem pdf={data as GalleryPdfType} index={index} />
  return <ImageGalleryItem image={data as GalleryImageType} index={index} />
}

// Root gallery – no custom SVG overrides (defaults are fine)
function Gallery(props: React.ComponentProps<typeof PrimitiveGallery>) {
  return (
    <PrimitiveGallery
      onBeforeOpen={(pswp) => {
        const resetVideos = () => {
          document
            .querySelectorAll<HTMLVideoElement>(".pswp video")
            .forEach((v) => {
              v.pause()
              v.currentTime = 0
            })
        }
        pswp.on("change", resetVideos)
        pswp.on("close", resetVideos)
      }}
      {...props}
    />
  )
}

export { Gallery, GalleryItem }
