import { Card, CardContent } from "@/components/ui/card"
import {
  Swiper,
  SwiperContent,
  SwiperDynamicDots,
  SwiperItem,
  SwiperWrapper,
} from "@/components/ui/swiper/swiper"
import { EffectExpo } from "@/components/ui/swiper/swiper-expo"
import { EffectPanorama } from "@/components/ui/swiper/swiper-panorama"
import EffectPosters from "@/components/ui/swiper/swiper-posters"
import type { Meta, StoryObj } from "@storybook/react-vite"

/**
 * Custom Swiper effect plugins that can be installed separately.
 *
 * Install the Panorama effect:
 * ```bash
 * pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/swiper-panorama.json
 * ```
 *
 * Install the Expo effect:
 * ```bash
 * pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/swiper-expo.json
 * ```
 *
 * Install the Posters effect:
 * ```bash
 * pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/swiper-posters.json
 * ```
 */
const meta: Meta<typeof Swiper> = {
  title: "Layout/Swiper/Custom Effects",
  component: Swiper,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Custom effect plugins for Swiper that can be installed separately.

## Available Custom Effects

### Panorama Effect
Creates a curved, panoramic 3D carousel where slides appear to wrap around the viewer.

\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/swiper-panorama.json
\`\`\`

### Expo Effect
Creates a zoom parallax effect with image offset, scale, rotation, and optional grayscale.

\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/swiper-expo.json
\`\`\`

### Posters Effect
Creates a 3D stacked posters carousel with depth, rotation, and shadow overlay.

\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/swiper-posters.json
\`\`\`

**Required HTML structure for Expo effect:**
\`\`\`html
<div class="expo-container">
  <img class="expo-image" src="..." />
  <div class="expo-content">Optional overlay</div>
</div>
\`\`\`
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col items-center gap-6 overflow-hidden p-6">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Swiper>

// ============================================================================
// PANORAMA EFFECT
// ============================================================================

export const PanoramaEffect: Story = {
  name: "Panorama Effect",
  render: () => (
    <div className="w-full max-w-3xl py-8">
      <Swiper
        modules={[EffectPanorama]}
        effect="panorama"
        slidesPerView={2.5}
        centeredSlides
        loop
        grabCursor
        panoramaEffect={{
          depth: 150,
          rotate: 30,
        }}
      >
        <SwiperWrapper className="w-full">
          <SwiperContent>
            {[
              "bg-linear-to-br from-rose-400 to-orange-300",
              "bg-linear-to-br from-cyan-400 to-blue-500",
              "bg-linear-to-br from-violet-400 to-purple-500",
              "bg-linear-to-br from-emerald-400 to-teal-500",
              "bg-linear-to-br from-amber-400 to-yellow-500",
              "bg-linear-to-br from-pink-400 to-fuchsia-500",
            ].map((gradient, index) => (
              <SwiperItem key={index}>
                <Card className={`${gradient}`}>
                  <CardContent className="flex aspect-4/3 items-center justify-center p-6">
                    <span className="text-5xl font-bold text-white drop-shadow-lg">
                      {index + 1}
                    </span>
                  </CardContent>
                </Card>
              </SwiperItem>
            ))}
          </SwiperContent>
          <SwiperDynamicDots className="mt-6" activeBulletWidth={2} />
        </SwiperWrapper>
      </Swiper>
    </div>
  ),
}

export const PanoramaWithImages: Story = {
  name: "Panorama with Images",
  render: () => (
    <div className="w-full max-w-4xl py-8">
      <Swiper
        modules={[EffectPanorama]}
        effect="panorama"
        slidesPerView={3}
        centeredSlides
        loop
        grabCursor
        panoramaEffect={{
          depth: 200,
          rotate: 25,
        }}
      >
        <SwiperWrapper className="w-full">
          <SwiperContent>
            {Array.from({ length: 8 }).map((_, index) => (
              <SwiperItem key={index}>
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={`https://picsum.photos/seed/${index + 10}/600/400`}
                    alt={`Image ${index + 1}`}
                    className="aspect-3/2 w-full object-cover"
                  />
                </div>
              </SwiperItem>
            ))}
          </SwiperContent>
          <SwiperDynamicDots className="mt-6" />
        </SwiperWrapper>
      </Swiper>
    </div>
  ),
}

// ============================================================================
// EXPO EFFECT (Parallax Zoom)
// ============================================================================

export const ExpoEffect: Story = {
  name: "Expo Effect",
  render: () => (
    <div className="w-full max-w-4xl py-8">
      <Swiper
        modules={[EffectExpo]}
        effect="expo"
        slidesPerView={1.5}
        spaceBetween={16}
        grabCursor
        expoEffect={{
          imageScale: 1.125,
          imageOffset: 1.25,
          scale: 1.25,
          rotate: 0,
          grayscale: true,
        }}
      >
        <SwiperWrapper className="w-full">
          <SwiperContent>
            {Array.from({ length: 6 }).map((_, index) => (
              <SwiperItem key={index} className="overflow-hidden rounded-xl">
                <div className="expo-container overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${index + 20}/800/600`}
                    alt={`Image ${index + 1}`}
                    className="expo-image aspect-4/3 w-full object-cover"
                  />
                </div>
              </SwiperItem>
            ))}
          </SwiperContent>
          <SwiperDynamicDots className="mt-6" activeBulletWidth={2} />
        </SwiperWrapper>
      </Swiper>
    </div>
  ),
}

export const ExpoWithRotation: Story = {
  name: "Expo with 3D Rotation",
  render: () => (
    <div className="w-full max-w-4xl py-8">
      <Swiper
        modules={[EffectExpo]}
        effect="expo"
        slidesPerView={1.5}
        spaceBetween={32}
        grabCursor
        expoEffect={{
          imageScale: 1.2,
          imageOffset: 1.3,
          scale: 1.3,
          rotate: 30,
          grayscale: true,
        }}
      >
        <SwiperWrapper className="w-full">
          <SwiperContent>
            {Array.from({ length: 6 }).map((_, index) => (
              <SwiperItem key={index}>
                <div className="expo-container overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={`https://picsum.photos/seed/${index + 30}/800/600`}
                    alt={`Image ${index + 1}`}
                    className="expo-image aspect-4/3 w-full object-cover"
                  />
                  <div className="expo-content absolute inset-0 flex items-end bg-linear-to-t from-black/60 to-transparent p-6">
                    <span className="text-2xl font-bold text-white">
                      Slide {index + 1}
                    </span>
                  </div>
                </div>
              </SwiperItem>
            ))}
          </SwiperContent>
          <SwiperDynamicDots className="mt-6" />
        </SwiperWrapper>
      </Swiper>
    </div>
  ),
}

// ============================================================================
// POSTERS EFFECT (3D Stacked Carousel)
// ============================================================================

export const PostersEffect: Story = {
  name: "Posters Effect",
  render: () => (
    <div className="flex w-5xl max-w-full items-center justify-center py-16">
      <Swiper
        modules={[EffectPosters]}
        effect="posters"
        slidesPerView={1}
        centeredSlides
        loop
        grabCursor
        speed={600}
        resistanceRatio={0}
        spaceBetween={24}
        postersEffect={{
          limitProgress: 3,
          shadowPerProgress: false, // Disable shadow - using opacity instead
          perspective: true,
          prev: {
            translate: ["-15%", 0, -200],
            rotate: [0, 0, 0],
            opacity: 0, // Hide previous slides completely
            shadow: false, // No shadow needed since slides are hidden
          },
          next: {
            translate: ["100%", 0, 0],
            opacity: 0, // Hide next slides
            shadow: false,
          },
        }}
        className="w-48 overflow-visible!"
      >
        <SwiperWrapper>
          <SwiperContent>
            {Array.from({ length: 8 }).map((_, index) => (
              <SwiperItem key={index} className="overflow-hidden rounded-xl">
                <img
                  src={`https://picsum.photos/seed/${index + 70}/400/600`}
                  alt={`Poster ${index + 1}`}
                  className="aspect-2/3 w-full object-cover"
                />
              </SwiperItem>
            ))}
          </SwiperContent>
          <SwiperDynamicDots className="mt-8" />
        </SwiperWrapper>
      </Swiper>
    </div>
  ),
}
