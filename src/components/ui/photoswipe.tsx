import "photoswipe/dist/photoswipe.css"
import React from "react"
import { Gallery, Item } from "react-photoswipe-gallery"

// Define type for gallery images - making width and height optional as we'll detect them dynamically
type GalleryImageType = {
  src: string
  thumbnail?: string
  width?: string | number
  height?: string | number
  alt?: string
}

function GalleryItem({
  image,
  index,
}: {
  image: GalleryImageType
  index: number
}) {
  // State to track dynamically loaded dimensions
  const [dimensions, setDimensions] = React.useState({
    width: image.width || 0,
    height: image.height || 0,
  })

  // Dynamically detect image dimensions
  React.useEffect(() => {
    if (!image.src) return

    // Skip if dimensions are already provided
    if (image.width && image.height) {
      setDimensions({
        width: Number(image.width),
        height: Number(image.height),
      })
      return
    }

    let checkInterval: NodeJS.Timeout | null = null
    const img = new Image()
    img.src = image.src

    const checkDimensions = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight })

        if (checkInterval) {
          clearInterval(checkInterval)
          checkInterval = null
        }
      }
    }

    checkInterval = setInterval(checkDimensions, 10)

    return () => {
      if (checkInterval) {
        clearInterval(checkInterval)
      }
    }
  }, [image.src, image.width, image.height])

  return (
    <Item
      key={index}
      original={image.src}
      thumbnail={image.thumbnail || image.src}
      width={dimensions.width}
      height={dimensions.height}
    >
      {({ ref, open }) => (
        <img
          ref={ref}
          onClick={open}
          src={image.thumbnail || image.src}
          alt={image.alt || ""}
          className="aspect-square h-full w-full rounded-md object-cover"
        />
      )}
    </Item>
  )
}

function PhotoSwipe({
  images = [
    // Default images if none provided
    {
      src: "https://pbs.twimg.com/media/Gk58xZCWUAABX7L?format=jpg&name=large",
      thumbnail:
        "https://pbs.twimg.com/media/Gk58xZCWUAABX7L?format=jpg&name=large",
      alt: "Nature image 1",
    },
    {
      src: "https://swiperjs.com/demos/images/nature-3.jpg",
      thumbnail: "https://swiperjs.com/demos/images/nature-3.jpg",
      alt: "Nature image 2",
    },
  ],
}: {
  images?: GalleryImageType[]
}) {
  return (
    <Gallery>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {images.map((image, index) => (
          <GalleryItem key={index} image={image} index={index} />
        ))}
      </div>
    </Gallery>
  )
}

export { PhotoSwipe }
