import { Card, CardContent } from "@/components/ui/card"
import {
  Swiper,
  SwiperContent,
  SwiperCounter,
  SwiperDots,
  SwiperDynamicDots,
  SwiperItem,
  SwiperNext,
  SwiperPrevious,
  SwiperProgress,
  type SwiperApi,
} from "@/components/ui/swiper"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
// Import additional modules as needed
import {
  Autoplay,
  EffectCards,
  EffectCoverflow,
  EffectFade,
  FreeMode,
  Thumbs,
} from "swiper/modules"
import { SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper/types"

/**
 * Swiper carousel component built on top of Swiper.js with shadcn/ui styling.
 * Supports various effects, navigation, pagination, and accessibility features.
 */
const meta: Meta<typeof Swiper> = {
  title: "Components/Swiper",
  component: Swiper,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/swiper.json
\`\`\`

A powerful carousel/slider component built on Swiper.js with shadcn/ui styling.

## Features
- Keyboard navigation (enabled by default)
- Touch/swipe support
- Multiple effects (fade, cards, coverflow, etc.)
- Custom pagination (dots, dynamic dots, counter, progress)
- Thumbnail gallery support
- Autoplay

## Accessibility
- Keyboard module enabled by default (arrow keys navigation)
- A11y module for screen reader support
- Proper ARIA labels on navigation controls
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col items-center gap-6 p-6">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Swiper>

// ============================================================================
// Basic Example
// ============================================================================

export const Basic: Story = {
  render: () => (
    <div className="w-full max-w-sm px-12">
      <Swiper className="w-full">
        <SwiperContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <SwiperItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </SwiperItem>
          ))}
        </SwiperContent>
        <SwiperPrevious />
        <SwiperNext />
      </Swiper>
    </div>
  ),
}

// ============================================================================
// With Pagination
// ============================================================================

export const WithPagination: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <Swiper className="w-full">
        <SwiperContent pagination={{ clickable: true }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <SwiperItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </SwiperItem>
          ))}
        </SwiperContent>
      </Swiper>
    </div>
  ),
}

// ============================================================================
// With Custom Dots
// ============================================================================

export const WithCustomDots: Story = {
  render: () => (
    <div className="w-full max-w-sm px-12">
      <Swiper className="w-full">
        <SwiperContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <SwiperItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </SwiperItem>
          ))}
        </SwiperContent>
        <SwiperPrevious />
        <SwiperNext />
        <SwiperDots />
      </Swiper>
    </div>
  ),
}

// ============================================================================
// With Dynamic Bullets (for many slides)
// ============================================================================

export const WithDynamicBullets: Story = {
  render: () => (
    <div className="w-full max-w-sm px-12">
      <Swiper className="w-full">
        <SwiperContent>
          {Array.from({ length: 15 }).map((_, index) => (
            <SwiperItem key={index}>
              <div className="p-1">
                <Card className="bg-linear-to-br from-violet-500 to-fuchsia-500">
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold text-white">
                      {index + 1}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </SwiperItem>
          ))}
        </SwiperContent>
        <SwiperPrevious />
        <SwiperNext />
        <SwiperDynamicDots />
      </Swiper>
    </div>
  ),
}

// ============================================================================
// Multiple Slides Per View
// ============================================================================

export const MultipleSlidesPerView: Story = {
  render: () => (
    <div className="w-full max-w-2xl px-12">
      <Swiper className="w-full">
        <SwiperContent slidesPerView={3} spaceBetween={16}>
          {Array.from({ length: 8 }).map((_, index) => (
            <SwiperItem key={index}>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </SwiperItem>
          ))}
        </SwiperContent>
        <SwiperPrevious />
        <SwiperNext />
      </Swiper>
    </div>
  ),
}

// ============================================================================
// With Autoplay (import Autoplay module)
// ============================================================================

export const WithAutoplay: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <Swiper modules={[Autoplay]} className="w-full">
        <SwiperContent
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <SwiperItem key={index}>
              <div className="p-1">
                <Card className="bg-linear-to-br from-purple-500 to-pink-500">
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold text-white">
                      {index + 1}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </SwiperItem>
          ))}
        </SwiperContent>
      </Swiper>
    </div>
  ),
}

// ============================================================================
// Fade Effect (import EffectFade module)
// ============================================================================

export const FadeEffect: Story = {
  render: () => (
    <div className="w-full max-w-sm px-12">
      <Swiper modules={[EffectFade]} className="w-full">
        <SwiperContent effect="fade" pagination={{ clickable: true }}>
          {["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"].map(
            (color, index) => (
              <SwiperItem key={index}>
                <Card className={color}>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold text-white">
                      Slide {index + 1}
                    </span>
                  </CardContent>
                </Card>
              </SwiperItem>
            )
          )}
        </SwiperContent>
        <SwiperPrevious />
        <SwiperNext />
      </Swiper>
    </div>
  ),
}

// ============================================================================
// Coverflow Effect (import EffectCoverflow module)
// ============================================================================

export const CoverflowEffect: Story = {
  render: () => (
    <div className="w-full max-w-2xl py-8">
      <Swiper modules={[EffectCoverflow]} className="w-full">
        <SwiperContent
          effect="coverflow"
          slidesPerView={3}
          centeredSlides
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
        >
          {Array.from({ length: 7 }).map((_, index) => (
            <SwiperItem key={index}>
              <Card className="bg-linear-to-br from-slate-700 to-slate-900">
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold text-white">
                    {index + 1}
                  </span>
                </CardContent>
              </Card>
            </SwiperItem>
          ))}
        </SwiperContent>
      </Swiper>
    </div>
  ),
}

// ============================================================================
// Cards Effect (import EffectCards module)
// ============================================================================

export const CardsEffect: Story = {
  render: () => (
    <div className="flex w-80 items-center justify-center py-8">
      <Swiper modules={[EffectCards]} className="w-64">
        <SwiperContent effect="cards">
          {[
            "bg-rose-500",
            "bg-orange-500",
            "bg-amber-500",
            "bg-lime-500",
            "bg-emerald-500",
          ].map((color, index) => (
            <SwiperItem key={index}>
              <Card className={`${color} shadow-xl`}>
                <CardContent className="flex aspect-3/4 items-center justify-center p-6">
                  <span className="text-5xl font-bold text-white">
                    {index + 1}
                  </span>
                </CardContent>
              </Card>
            </SwiperItem>
          ))}
        </SwiperContent>
      </Swiper>
    </div>
  ),
}

// ============================================================================
// Vertical
// ============================================================================

export const Vertical: Story = {
  render: () => (
    <div className="h-96 w-full max-w-sm py-12">
      <Swiper orientation="vertical" className="h-full w-full">
        <SwiperContent pagination={{ clickable: true }} className="h-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <SwiperItem key={index}>
              <Card className="h-full">
                <CardContent className="flex h-full items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </SwiperItem>
          ))}
        </SwiperContent>
        <SwiperPrevious />
        <SwiperNext />
      </Swiper>
    </div>
  ),
}

// ============================================================================
// With Counter & Progress
// ============================================================================

export const WithCounterAndProgress: Story = {
  render: () => (
    <div className="w-full max-w-sm px-12">
      <Swiper className="w-full">
        <SwiperContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <SwiperItem key={index}>
              <Card className="bg-linear-to-br from-blue-500 to-purple-600">
                <CardContent className="flex aspect-video items-center justify-center p-6">
                  <span className="text-4xl font-semibold text-white">
                    Slide {index + 1}
                  </span>
                </CardContent>
              </Card>
            </SwiperItem>
          ))}
        </SwiperContent>
        <SwiperPrevious />
        <SwiperNext />
        <SwiperProgress className="mt-4" />
        <SwiperCounter className="mt-2" />
      </Swiper>
    </div>
  ),
}

// ============================================================================
// With Thumbs Gallery (import FreeMode, Thumbs modules)
// ============================================================================

export const WithThumbsGallery: Story = {
  render: function Render() {
    const [thumbsSwiper, setThumbsSwiper] = React.useState<SwiperType | null>(
      null
    )

    const images = [
      "https://picsum.photos/seed/1/800/600",
      "https://picsum.photos/seed/2/800/600",
      "https://picsum.photos/seed/3/800/600",
      "https://picsum.photos/seed/4/800/600",
      "https://picsum.photos/seed/5/800/600",
    ]

    return (
      <div className="w-full max-w-lg px-12">
        <Swiper modules={[Thumbs]} className="mb-2 w-full">
          <SwiperContent
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
          >
            {images.map((src, index) => (
              <SwiperItem key={index}>
                <img
                  src={src}
                  alt={`Image ${index + 1}`}
                  className="aspect-video w-full rounded-lg object-cover"
                />
              </SwiperItem>
            ))}
          </SwiperContent>
          <SwiperPrevious />
          <SwiperNext />
        </Swiper>

        <Swiper modules={[FreeMode, Thumbs]} className="w-full">
          <SwiperContent
            onSwiper={setThumbsSwiper}
            slidesPerView={4}
            spaceBetween={8}
            freeMode
            watchSlidesProgress
            className="[&_.swiper-slide]:cursor-pointer [&_.swiper-slide]:opacity-50 [&_.swiper-slide-thumb-active]:opacity-100"
          >
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={`Thumb ${index + 1}`}
                  className="aspect-video w-full rounded-md object-cover"
                />
              </SwiperSlide>
            ))}
          </SwiperContent>
        </Swiper>
      </div>
    )
  },
}

// ============================================================================
// With API Control
// ============================================================================

export const WithApiControl: Story = {
  render: function Render() {
    const [api, setApi] = React.useState<SwiperApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
      if (!api) return

      setCount(api.slides.length)
      setCurrent(api.activeIndex + 1)

      api.on("slideChange", () => {
        setCurrent(api.activeIndex + 1)
      })
    }, [api])

    return (
      <div className="mx-auto w-full max-w-sm px-12">
        <Swiper setApi={setApi} className="w-full">
          <SwiperContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <SwiperItem key={index}>
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </SwiperItem>
            ))}
          </SwiperContent>
          <SwiperPrevious />
          <SwiperNext />
        </Swiper>
        <div className="text-muted-foreground py-2 text-center text-sm">
          Slide {current} of {count}
        </div>
      </div>
    )
  },
}

// ============================================================================
// Free Mode (import FreeMode module)
// ============================================================================

export const FreeModeExample: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Swiper modules={[FreeMode]} className="w-full">
        <SwiperContent
          slidesPerView={3}
          spaceBetween={16}
          freeMode
          pagination={{ clickable: true }}
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <SwiperItem key={index}>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </SwiperItem>
          ))}
        </SwiperContent>
      </Swiper>
    </div>
  ),
}

// ============================================================================
// Loop Mode with Navigation
// ============================================================================

export const LoopMode: Story = {
  render: () => (
    <div className="w-full max-w-sm px-12">
      <Swiper className="w-full">
        <SwiperContent loop pagination={{ clickable: true }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <SwiperItem key={index}>
              <Card className="bg-linear-to-r from-pink-500 via-red-500 to-yellow-500">
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold text-white">
                    {index + 1}
                  </span>
                </CardContent>
              </Card>
            </SwiperItem>
          ))}
        </SwiperContent>
        <SwiperPrevious />
        <SwiperNext />
      </Swiper>
    </div>
  ),
}
