/**
 * Swiper Expo/Parallax Effect Module
 *
 * A custom Swiper effect that creates a parallax zoom effect with image offset.
 * Based on UI Initiative's Expo Slider: https://expo-slider.uiinitiative.com/
 *
 * @example
 * ```tsx
 * import { EffectExpo } from "@/components/ui/swiper/swiper-expo"
 *
 * <Swiper
 *   modules={[EffectExpo]}
 *   effect="expo"
 *   slidesPerView={1.5}
 *   centeredSlides
 *   grabCursor
 *   expoEffect={{
 *     imageScale: 1.125,
 *     imageOffset: 1.25,
 *     scale: 1.25,
 *     rotate: 0,
 *     grayscale: true
 *   }}
 * >
 *   <SwiperItem>
 *     <div className="expo-container">
 *       <img className="expo-image" src="..." />
 *       <div className="expo-content">Optional overlay content</div>
 *     </div>
 *   </SwiperItem>
 * </Swiper>
 * ```
 */

import type { SwiperModule } from "swiper/types"

// Extend Swiper types with expo effect options
declare module "swiper/types" {
  interface SwiperOptions {
    expoEffect?: ExpoEffectOptions
  }
}

export interface ExpoEffectOptions {
  /**
   * Scale factor for the image when slide is not active
   * Higher values = more zoom on the image
   * @default 1.125
   */
  imageScale?: number
  /**
   * Offset factor for the image parallax movement
   * Controls how much the image moves within its container
   * @default 1.25
   */
  imageOffset?: number
  /**
   * Scale factor for the container when slide is not active
   * @default 1.25
   */
  scale?: number
  /**
   * Rotation angle in degrees for 3D perspective
   * Set to 0 for no rotation, 30 for dramatic effect
   * @default 0
   */
  rotate?: number
  /**
   * Apply grayscale filter to inactive slides
   * @default true
   */
  grayscale?: boolean
}

/**
 * EffectExpo - Swiper module for expo/parallax zoom effect
 *
 * Creates a zoom parallax carousel where images scale and offset
 * as slides transition. Works best with:
 * - centeredSlides: true
 * - slidesPerView: 1.2-2 (to show neighboring slides)
 * - grabCursor: true
 *
 * Required HTML structure:
 * ```html
 * <div class="expo-container">
 *   <img class="expo-image" src="..." />
 *   <div class="expo-content">Optional overlay</div>
 * </div>
 * ```
 */
export const EffectExpo: SwiperModule = ({ swiper, on, extendParams }) => {
  // Register default parameters
  extendParams({
    expoEffect: {
      imageScale: 1.125,
      imageOffset: 1.25,
      scale: 1.25,
      rotate: 0,
      grayscale: true,
    },
  })

  const setTranslate = () => {
    const { slides, rtlTranslate } = swiper
    const slidesPerView = swiper.params.slidesPerView as number
    const isHorizontal = swiper.isHorizontal()

    // Calculate offset based on slides per view
    let offset = 0.5
    const expoParams = swiper.params.expoEffect || {}
    const imageOffset = Math.max(1.25, expoParams.imageOffset ?? 1.25)

    if (slidesPerView > 1.5) {
      const offsetCalc = (imageOffset - 1) / 2 / imageOffset
      offset = Math.max(offsetCalc, 0.5 - (slidesPerView - 1.5))
    }

    const imageScale = Math.max(1.125, expoParams.imageScale ?? 1.125)
    const scale = Math.max(1.25, expoParams.scale ?? 1.25)
    const direction = rtlTranslate ? -1 : 1

    for (let i = 0; i < slides.length; i += 1) {
      const slideEl = slides[i] as HTMLElement
      const container = slideEl.querySelector(".expo-container") as HTMLElement
      const content = slideEl.querySelector(".expo-content") as HTMLElement
      const image = slideEl.querySelector(".expo-image") as HTMLElement

      // Get slide progress (0 = active, negative = before, positive = after)
      const progress = (slideEl as HTMLElement & { progress: number }).progress
      const clampedProgress = Math.max(Math.min(progress, 1), -1)

      // Apply image parallax transform
      if (image) {
        const translateValue = clampedProgress * offset * 100 * direction
        const scaleValue = 1 + (imageScale - 1) * Math.abs(clampedProgress)

        image.style.transform = `translate${isHorizontal ? "X" : "Y"}(${translateValue}%) scale(${scaleValue})`

        // Apply grayscale filter to inactive slides
        if (expoParams.grayscale) {
          image.style.filter = `grayscale(${Math.abs(clampedProgress)})`
        }
      }

      // Set transform origin based on progress direction
      const origins = isHorizontal
        ? rtlTranslate
          ? ["right", "left"]
          : ["left", "right"]
        : ["top", "bottom"]

      if (Math.abs(progress) > 0.01) {
        if (image) {
          image.style.transformOrigin = progress > 0 ? origins[0] : origins[1]
        }
        if (container) {
          container.style.transformOrigin = progress > 0 ? origins[1] : origins[0]
        }
      }

      // Apply container scale and rotation
      if (container) {
        const containerScale = 1 + (scale - 1) * Math.abs(clampedProgress)
        const rotateValue =
          (expoParams.rotate ?? 0) * clampedProgress * (isHorizontal ? 1 : -1) * direction

        container.style.transform = `scale(${containerScale}) rotate${isHorizontal ? "Y" : "X"}(${rotateValue}deg)`
      }

      // Apply content offset for parallax effect
      if (content) {
        const contentTranslate = clampedProgress * 100 * direction
        content.style.transform = `translate${isHorizontal ? "X" : "Y"}(${contentTranslate}%)`
        content.style.opacity = `${1 - Math.abs(clampedProgress) * 2}`
      }
    }
  }

  const setTransition = (duration: number) => {
    const { slides } = swiper

    for (let i = 0; i < slides.length; i += 1) {
      const slideEl = slides[i] as HTMLElement
      const elements = slideEl.querySelectorAll(
        ".expo-container, .expo-image, .expo-content"
      )

      elements.forEach((el) => {
        ; (el as HTMLElement).style.transitionDuration = `${duration}ms`
      })
    }
  }

  const updatePadding = () => {
    const rect = swiper.el.getBoundingClientRect()
    const size = swiper.isHorizontal() ? rect.height : rect.width
    const { rotate, scale } = swiper.params.expoEffect || {}

    const actualScale = scale ?? 1.25
    const containerSize = size / actualScale
    let padding = (size - containerSize) / 2

    if (rotate) {
      padding = padding * 1.35
    }

    padding = Math.round(padding)

    const currentPadding = swiper.el.style.getPropertyValue("--expo-padding")
    const parsedPadding = parseInt(currentPadding, 10) || 0

    if (!currentPadding || isNaN(parsedPadding) || Math.abs(padding - parsedPadding) >= 5) {
      swiper.el.style.setProperty("--expo-padding", `${padding}px`)
    }
  }

  // Event handlers
  on("beforeInit", () => {
    if (swiper.params.effect !== "expo") return

    // Required options for the effect to work properly
    const overwriteParams = {
      centeredSlides: true,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
    }

    Object.assign(swiper.params, overwriteParams)
    Object.assign(swiper.originalParams, overwriteParams)
  })

  on("init", () => {
    if (swiper.params.effect !== "expo") return

    // Add modifier classes for styling
    const containerModifier = swiper.params.containerModifierClass || "swiper-"
    swiper.el.classList.add(`${containerModifier}expo`)
    swiper.el.classList.add(`${containerModifier}3d`)

    // Apply perspective for 3D effect
    swiper.el.style.perspective = "1200px"
    swiper.wrapperEl.style.transformStyle = "preserve-3d"

    // Set image offset CSS variable
    const imageOffset = swiper.params.expoEffect?.imageOffset ?? 1.25
    swiper.el.style.setProperty("--expo-image-offset", String(imageOffset))

    updatePadding()
  })

  on("resize", () => {
    if (swiper.params.effect !== "expo") return
    updatePadding()
  })

  on("update", () => {
    if (swiper.params.effect !== "expo") return
    updatePadding()
  })

  on("progress", () => {
    if (swiper.params.effect !== "expo") return
    setTranslate()
  })

  on("setTransition", (_swiper, duration) => {
    if (swiper.params.effect !== "expo") return
    setTransition(duration as number)
  })
}

export default EffectExpo
