"use client"

import { FileIcon } from "lucide-react"
import "photoswipe/dist/photoswipe.css"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
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
// New iframe type (supports either a src URL or a ReactNode)
export type GalleryIframeType = {
  type: "iframe"
  // Either supply an iframe src OR a ReactNode via `node` (e.g. custom <iframe /> / embed component)
  src?: string
  node?: React.ReactNode
  thumbnail?: string
  width?: number | string
  height?: number | string
  alt?: string
  allow?: string
  allowFullScreen?: boolean
  // Optional poster / placeholder use-case (not required, but keeps parity with video style props)
  poster?: string
}
export type GalleryMedia =
  | GalleryImageType
  | GalleryVideoType
  | GalleryPdfType
  | GalleryIframeType

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
  // Autoplay only inside the lightbox (not inline)
  const html = `\n<div data-pswp-video-slide>\n<video muted playsinline controls style="max-width:100%;max-height:100vh;object-fit:contain;" onended="this.pause();this.currentTime=0;">\n  <source src="${video.src}" type="video/mp4" />\n  Your browser does not support the video tag.\n</video>\n</div>`
  const hasCustomThumb = !!video.thumbnail && video.thumbnail !== video.src
  return (
    <Item key={index} html={html} thumbnail={thumb} width={w} height={h}>
      {({ ref, open }) => (
        <div
          ref={ref}
          onClick={(e) =>
            (open as unknown as (ev?: unknown) => void)(e.nativeEvent)
          }
          className="relative aspect-square h-full w-full cursor-zoom-in overflow-hidden rounded-md"
        >
          {hasCustomThumb ? (
            <img
              src={thumb}
              alt={video.alt || "Video thumbnail"}
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
          ) : (
            <video
              src={video.src}
              className="h-full w-full object-cover object-center"
              muted
              playsInline
              preload="metadata"
            />
          )}
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
  const w = Number(pdf.width) || 1200
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
              <FileIcon className="text-muted-foreground size-6" />
              <span>{pdf.alt || "Open PDF"}</span>
            </div>
          </div>
        </div>
      )}
    </Item>
  )
}

// Iframe / embed item
export function IframeGalleryItem({
  iframe,
  index,
}: {
  iframe: GalleryIframeType
  index: number
}) {
  const w = Number(iframe.width) || 1280
  const h = Number(iframe.height) || 720
  const thumb = iframe.thumbnail || iframe.poster || iframe.src || ""

  const html = React.useMemo(() => {
    if (iframe.node) {
      const markup = renderToStaticMarkup(
        <div className="pswp-embed-wrapper flex h-full w-full items-center justify-center bg-black/5">
          {iframe.node}
        </div>
      )
      return `<div data-pswp-iframe-slide>${markup}</div>`
    }
    const allow =
      iframe.allow ||
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    const allowFs = iframe.allowFullScreen === false ? "" : "allowfullscreen"
    let src = iframe.src || "about:blank"
    // Detect YouTube to inject enablejsapi=1 so we can stop playback
    const isYouTube =
      /^(https?:)?\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//i.test(src)
    if (isYouTube) {
      const url = new URL(src, window.location.origin)
      if (!url.searchParams.has("enablejsapi"))
        url.searchParams.set("enablejsapi", "1")
      // modest branding optional; keep if not set
      if (!url.searchParams.has("playsinline"))
        url.searchParams.set("playsinline", "1")
      src = url.toString()
    }
    return `<div data-pswp-iframe-slide><iframe ${isYouTube ? "data-yt-player" : ""} src="${src}" title="${iframe.alt || "Embedded content"}" style="width:100%;height:100%;border:0;" allow="${allow}" ${allowFs}></iframe></div>`
  }, [iframe])

  return (
    <Item key={index} html={html} thumbnail={thumb} width={w} height={h}>
      {({ ref, open }) => (
        <div
          ref={ref}
          onClick={open}
          className="bg-muted/40 relative aspect-square h-full w-full cursor-zoom-in overflow-hidden rounded-md"
        >
          {thumb ? (
            <img
              src={thumb}
              alt={iframe.alt || "Open embed"}
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
          ) : (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center text-center text-xs font-medium">
              {iframe.alt || "Open"}
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center bg-black/30 text-white">
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current">
              <path d="M4 4h16v16H4z" />
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
  if (data.type === "iframe")
    return (
      <IframeGalleryItem iframe={data as GalleryIframeType} index={index} />
    )
  return <ImageGalleryItem image={data as GalleryImageType} index={index} />
}

// Root gallery – no custom SVG overrides (defaults are fine)
function Gallery(props: React.ComponentProps<typeof PrimitiveGallery>) {
  return (
    <PrimitiveGallery
      options={{
        zoomSVG: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-in-icon lucide-zoom-in"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>`,
        closeSVG: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
      }}
      onBeforeOpen={(pswp) => {
        const resetMedia = () => {
          // HTML5 videos
          document
            .querySelectorAll<HTMLVideoElement>(".pswp video")
            .forEach((v) => {
              v.pause()
              v.currentTime = 0
            })
          // YouTube iframes (must have enablejsapi=1)
          document
            .querySelectorAll<HTMLIFrameElement>(".pswp iframe[data-yt-player]")
            .forEach((f) => {
              try {
                f.contentWindow?.postMessage(
                  JSON.stringify({
                    event: "command",
                    func: "stopVideo",
                    args: [],
                  }),
                  "*"
                )
              } catch {
                /* ignore */
              }
            })
        }
        pswp.on("change", resetMedia)
        pswp.on("close", resetMedia)
      }}
      {...props}
    />
  )
}

export { Gallery, GalleryItem }
