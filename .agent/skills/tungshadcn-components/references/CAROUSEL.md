# Carousel (Swiper)

TungShadcn uses `Swiper.js` for its carousel functionality, wrapped in a developer-friendly compound component pattern.

---

## Architecture

```
Swiper (Root context)
  └── SwiperWrapper (Container layout)
        ├── SwiperContent (Slide viewport)
        │     └── SwiperItem (Individual slide)
        ├── SwiperPrevious/SwiperNext (Navigation buttons)
        └── SwiperDots/SwiperDynamicDots (Pagination)
```

---

## Basic Usage

```tsx
import {
  Swiper,
  SwiperContent,
  SwiperItem,
  SwiperNext,
  SwiperPrevious,
  SwiperWrapper,
  SwiperDots,
} from "@/components/ui/swiper/swiper"

function MyCarousel() {
  return (
    <Swiper loop={true} slidesPerView={1}>
      <SwiperWrapper>
        <SwiperPrevious />
        <SwiperContent>
          <SwiperItem>Slide 1</SwiperItem>
          <SwiperItem>Slide 2</SwiperItem>
          <SwiperItem>Slide 3</SwiperItem>
        </SwiperContent>
        <SwiperNext />
        <SwiperDots />
      </SwiperWrapper>
    </Swiper>
  )
}
```

---

## Dynamic Dots

Inspired by Instagram/mobile sliders, these dots scale down as you move away from the active slide.

```tsx
import { SwiperDynamicDots } from "@/components/ui/swiper/swiper"

;<SwiperDynamicDots
  visibleBullets={5}
  dynamicMainBullets={1}
  activeBulletWidth={2} // Pill shape
/>
```

---

## Advanced Controls

### 1. Counter & Progress

```tsx
import { SwiperCounter, SwiperProgress } from "@/components/ui/swiper/swiper"

;<SwiperWrapper>
  <SwiperContent>{/* ... */}</SwiperContent>
  <SwiperCounter /> {/* Shows "1 / 5" */}
  <SwiperProgress /> {/* Shows linear progress bar */}
</SwiperWrapper>
```

### 2. Autoplay & Effects

Pass standard Swiper modules and options to the root component:

```tsx
import { Autoplay, EffectFade } from "swiper/modules"

;<Swiper
  modules={[Autoplay, EffectFade]}
  autoplay={{ delay: 3000 }}
  effect="fade"
>
  {/* ... */}
</Swiper>
```

---

## Custom Effects

TungShadcn includes highly polished custom Swiper effects:

- **Panorama**: 3D panoramic perspective.
- **Expo**: Zoom + parallax effect with grayscale transitions.
- **Posters**: 3D stacked posters depth effect.

See `SwiperPanorama`, `SwiperExpo`, and `SwiperPosters` stories for examples.

---

## Do/Don't

- **Do** use `SwiperWrapper` to manage the layout of navigation buttons relative to the content.
- **Do** use `SwiperDynamicDots` for mobile-centric designs with many slides.
- **Don't** put logic inside `SwiperItem`; keep slides as pure presentation components for performance.
- **Don't** forget to add `modules` to the `Swiper` root if you need non-default features like Autoplay or Effects.
