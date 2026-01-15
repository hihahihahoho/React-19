/**
 * Swiper Posters Effect Module
 *
 * A custom Swiper effect that creates a 3D stacked posters carousel.
 * Based on UI Initiative's Posters Slider: https://posters-slider.uiinitiative.com/
 *
 * API similar to Swiper's Creative Effect:
 * @see https://swiperjs.com/swiper-api#param-creativeEffect
 *
 * @example
 * ```tsx
 * import { EffectPosters } from "@/components/ui/swiper/swiper-posters"
 *
 * <Swiper
 *   modules={[EffectPosters]}
 *   effect="posters"
 *   slidesPerView={1}
 *   centeredSlides
 *   loop
 *   grabCursor
 *   speed={600}
 *   postersEffect={{
 *     limitProgress: 3,
 *     shadowPerProgress: true,
 *     progressMultiplier: 1,
 *     perspective: true,
 *     prev: {
 *       translate: ["-15%", 0, -200],
 *       shadow: true,
 *     },
 *     next: {
 *       translate: ["100%", 0, 0],
 *     },
 *   }}
 * >
 *   <SwiperItem>
 *     <img src="..." />
 *   </SwiperItem>
 * </Swiper>
 * ```
 */

import type { SwiperModule } from "swiper/types"

// Extend Swiper types with posters effect options
declare module "swiper/types" {
  interface SwiperOptions {
    postersEffect?: PostersEffectOptions
  }
}

export interface PostersEffectTransform {
  /**
   * Translate value [x, y, z]
   * Can use percentage strings (e.g., "-15%") or pixel numbers
   * @default [0, 0, 0]
   */
  translate?: [string | number, string | number, string | number]
  /**
   * Rotate value [x, y, z] in degrees
   * @default [0, 0, 0]
   */
  rotate?: [number, number, number]
  /**
   * Opacity value (0-1)
   * @default 1
   */
  opacity?: number
  /**
   * Scale value
   * @default 1
   */
  scale?: number
  /**
   * Enable shadow overlay
   * @default false for next, true for prev
   */
  shadow?: boolean
  /**
   * Transform origin (e.g., "left center", "right center")
   */
  origin?: string
}

export interface PostersEffectOptions {
  /**
   * Limit progress value for transform calculations
   * Higher values allow more slides to be visible with transforms
   * @default 3
   */
  limitProgress?: number
  /**
   * Whether shadow opacity is based on progress
   * @default true
   */
  shadowPerProgress?: boolean
  /**
   * Progress multiplier for transform calculations
   * @default 1
   */
  progressMultiplier?: number
  /**
   * Enable 3D perspective
   * @default true
   */
  perspective?: boolean
  /**
   * Transform settings for previous slide(s)
   */
  prev?: PostersEffectTransform
  /**
   * Transform settings for next slide(s)
   */
  next?: PostersEffectTransform
}

/**
 * EffectPosters - Swiper module for 3D stacked posters effect
 *
 * Creates a 3D carousel where slides are stacked like movie posters.
 * API is similar to Swiper's built-in Creative Effect.
 *
 * Works best with:
 * - centeredSlides: true
 * - slidesPerView: 1
 * - loop: true
 * - grabCursor: true
 * - speed: 600
 */
export const EffectPosters: SwiperModule = ({ swiper, extendParams, on }) => {
  // Default parameters
  extendParams({
    postersEffect: {
      limitProgress: 3,
      shadowPerProgress: true,
      progressMultiplier: 1,
      perspective: true,
      prev: {
        translate: ["-15%", 0, -200],
        rotate: [0, 0, 0],
        opacity: 1,
        scale: 1,
        shadow: true, // Shadow enabled by default for prev slides
      },
      next: {
        translate: ["100%", 0, 0],
        rotate: [0, 0, 0],
        opacity: 1,
        scale: 1,
        shadow: false, // No shadow for next slides
      },
    },
  })

  // Helper to convert value to CSS string
  const toCssValue = (val: string | number): string => {
    if (typeof val === "string") return val
    return `${val}px`
  }

  // Create or get shadow element
  const getShadow = (slideEl: HTMLElement): HTMLElement => {
    let shadow = slideEl.querySelector(".swiper-slide-shadow") as HTMLElement
    if (!shadow) {
      shadow = document.createElement("div")
      shadow.classList.add("swiper-slide-shadow")
      slideEl.appendChild(shadow)
    }
    return shadow
  }

  // Remove shadow element
  const removeShadow = (slideEl: HTMLElement) => {
    const shadow = slideEl.querySelector(".swiper-slide-shadow")
    if (shadow) shadow.remove()
  }

  // Remove all shadows
  const removeShadows = () => {
    swiper.slides.forEach((slide) => {
      removeShadow(slide as HTMLElement)
    })
  }

  const setTranslate = () => {
    const { slides, wrapperEl, slidesSizesGrid } = swiper
    const params = swiper.params.postersEffect || {}
    console.log('[DEBUG] Posters Effect params:', JSON.stringify(params, null, 2))
    const {
      limitProgress = 3,
      shadowPerProgress = true,
      progressMultiplier = 1,
      prev = {},
      next = {},
    } = params
    console.log('[DEBUG] prev config:', prev)
    console.log('[DEBUG] next config:', next)

    const centeredSlides = swiper.params.centeredSlides

    // Parse spaceBetween value
    let spaceBetween = swiper.params.spaceBetween || 0
    // Use width for horizontal, height for vertical (swiper.size exists at runtime)
    const swiperSize = (swiper as unknown as { size: number }).size || swiper.width || 0
    if (typeof spaceBetween === "string" && spaceBetween.includes("%")) {
      spaceBetween = (parseFloat(spaceBetween) / 100) * swiperSize
    } else if (typeof spaceBetween === "string") {
      spaceBetween = parseFloat(spaceBetween)
    }

    // Apply wrapper offset for centered slides (like Creative Effect does)
    if (centeredSlides && !swiper.params.cssMode) {
      const firstSlideSize = slidesSizesGrid[0] || 0
      const offsetBefore = swiper.params.slidesOffsetBefore || 0
      const offset = firstSlideSize / 2 - offsetBefore
      wrapperEl.style.transform = `translateX(calc(50% - ${offset}px))`
    } else {
      wrapperEl.style.transform = ""
    }

    for (let i = 0; i < slides.length; i += 1) {
      const slideEl = slides[i] as HTMLElement
      const rawProgress = (slideEl as HTMLElement & { progress: number }).progress

      // Clamp progress
      const clampedProgress = Math.min(Math.max(rawProgress, -limitProgress), limitProgress)
      const absProgress = Math.abs(clampedProgress)

      // Get slide offset - this is the natural position of the slide
      const slideOffset =
        (slideEl as HTMLElement & { swiperSlideOffset?: number }).swiperSlideOffset || 0

      // Base translate to stack all slides at the same position (counteract natural slide position)
      const baseTranslateX = swiper.params.cssMode ? -slideOffset - swiper.translate : -slideOffset

      // Determine config based on progress direction
      let config: PostersEffectTransform
      let isTransformed = false

      if (clampedProgress < 0) {
        // Previous slides
        config = prev
        isTransformed = true
      } else if (clampedProgress > 0) {
        // Next slides
        config = next
        isTransformed = true
      } else {
        // Active slide - no transform, just stack at base position
        config = { translate: [0, 0, 0], rotate: [0, 0, 0], opacity: 1, scale: 1 }
      }

      // Get config values with defaults
      const translate = config.translate || [0, 0, 0]
      const rotate = config.rotate || [0, 0, 0]
      const configScale = config.scale ?? 1
      const configOpacity = config.opacity ?? 1

      // Calculate transform values based on progress
      const progress = absProgress * progressMultiplier

      // Add spaceBetween to translation for next slides (positive progress)
      const spaceOffset = clampedProgress > 0 ? spaceBetween * progress : 0

      // Translation - base counteracts natural position, config adds the effect offset
      const translateX = `calc(${baseTranslateX}px + (${toCssValue(translate[0])} * ${progress}) + ${spaceOffset}px)`
      const translateY = `calc(0px + (${toCssValue(translate[1])} * ${progress}))`
      const translateZ = `calc(0px + (${toCssValue(translate[2])} * ${progress}))`

      // Rotation
      const rotateX = rotate[0] * progress
      const rotateY = rotate[1] * progress
      const rotateZ = rotate[2] * progress

      // Scale - interpolate from 1 to configScale based on progress
      const scale =
        clampedProgress < 0
          ? 1 + (1 - configScale) * clampedProgress * progressMultiplier
          : 1 - (1 - configScale) * clampedProgress * progressMultiplier

      // Opacity calculation:
      // - Active slide (progress = 0): opacity = 1
      // - When configOpacity = 0: Only fade the immediate adjacent slide (absProgress < 1)
      //   All other slides remain hidden (opacity = 0)
      // - When configOpacity > 0: Use interpolation as before
      let opacity: number
      if (configOpacity === 0) {
        // Threshold mode: only the immediate adjacent slide fades during swipe
        if (absProgress >= 1) {
          opacity = 0 // Completely hidden
        } else {
          // Fade from 1 (active) to 0 (hidden) as absProgress goes from 0 to 1
          opacity = 1 - absProgress
        }
      } else {
        // Interpolation mode (original behavior)
        opacity =
          clampedProgress < 0
            ? 1 + (1 - configOpacity) * clampedProgress * progressMultiplier
            : 1 - (1 - configOpacity) * clampedProgress * progressMultiplier
      }

      // Build transform string
      const transform = `translate3d(${translateX}, ${translateY}, ${translateZ}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`

      // Apply styles to slide
      slideEl.style.zIndex = String(slides.length - Math.round(absProgress * 10))
      slideEl.style.transform = transform
      slideEl.style.opacity = String(opacity)

      // Transform origin
      if (config.origin) {
        slideEl.style.transformOrigin = config.origin
      }

      // Handle shadow
      // Shadow is only shown when:
      // 1. The slide is transformed (not active)
      // 2. The slide is a previous slide (negative progress, stacked behind)
      // 3. config.shadow is explicitly true (not undefined, not false)
      const shouldHaveShadow = isTransformed && clampedProgress < 0 && config.shadow === true

      if (shouldHaveShadow) {
        // Shadow only for previous slides (stacked behind)
        const shadow = getShadow(slideEl)

        // Calculate shadow opacity based on shadowPerProgress setting
        // When shadowPerProgress is true: opacity scales with progress (0.25, 0.5, 0.75 for limitProgress: 3)
        // When shadowPerProgress is false: use a fixed opacity based on progress
        const shadowOpacity = shadowPerProgress
          ? absProgress / (limitProgress + 1)
          : Math.min(absProgress * 0.25, 0.75)

        Object.assign(shadow.style, {
          position: "absolute",
          left: "0",
          top: "0",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: "10",
          background: "#000",
          opacity: String(shadowOpacity),
          borderRadius: "inherit",
        })
      } else {
        removeShadow(slideEl)
      }
    }
  }

  const setTransition = (duration: number) => {
    const { slides, wrapperEl } = swiper
    const durationStr = `${duration}ms`

    wrapperEl.style.transitionDuration = durationStr

    slides.forEach((slide) => {
      const slideEl = slide as HTMLElement
      slideEl.style.transitionDuration = durationStr

      const shadow = slideEl.querySelector(".swiper-slide-shadow") as HTMLElement
      if (shadow) {
        shadow.style.transitionDuration = durationStr
      }
    })
  }

  // Event handlers
  on("beforeInit", () => {
    if (swiper.params.effect !== "posters") return

    Object.assign(swiper.params, {
      watchSlidesProgress: true,
      virtualTranslate: !swiper.params.cssMode,
    })
    Object.assign(swiper.originalParams, {
      watchSlidesProgress: true,
      virtualTranslate: !swiper.params.cssMode,
    })
  })

  on("init", () => {
    if (swiper.params.effect !== "posters") return

    const containerModifier = swiper.params.containerModifierClass || "swiper-"
    swiper.el.classList.add(`${containerModifier}posters`)

    const { perspective = true } = swiper.params.postersEffect || {}

    if (perspective) {
      swiper.el.classList.add(`${containerModifier}3d`)
      swiper.el.style.perspective = "1200px"
      swiper.wrapperEl.style.transformStyle = "preserve-3d"
    }
  })

  on("setTranslate", () => {
    if (swiper.params.effect !== "posters") return
    setTranslate()
  })

  on("setTransition", (_swiper, duration) => {
    if (swiper.params.effect !== "posters") return
    setTransition(duration as number)
  })

  on("destroy", () => {
    if (swiper.params.effect !== "posters") return
    removeShadows()
  })

  on("resize", () => {
    if (swiper.params.effect !== "posters") return
    setTranslate()
  })
}

export default EffectPosters
