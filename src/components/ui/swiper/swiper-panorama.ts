/**
 * Swiper Panorama Effect Module
 *
 * A custom Swiper effect that creates a panoramic 3D carousel.
 * Based on UI Initiative's Panorama Slider: https://panorama-slider.uiinitiative.com/
 *
 * @example
 * ```tsx
 * import { EffectPanorama } from "@/components/ui/swiper-panorama"
 *
 * <Swiper
 *   modules={[EffectPanorama]}
 *   effect="panorama"
 *   slidesPerView={3}
 *   centeredSlides
 *   loop
 *   panoramaEffect={{
 *     depth: 200,
 *     rotate: 30
 *   }}
 * >
 *   ...
 * </Swiper>
 * ```
 */

import type { SwiperModule } from "swiper/types"

// Extend Swiper types with panorama effect options
declare module "swiper/types" {
  interface SwiperOptions {
    panoramaEffect?: PanoramaEffectOptions
  }
}

export interface PanoramaEffectOptions {
  /**
   * Depth of the panorama effect (distance in pixels)
   * Higher values = more pronounced 3D depth
   * @default 200
   */
  depth?: number
  /**
   * Rotation angle in degrees
   * Controls how much slides rotate as they move
   * @default 30
   */
  rotate?: number
}

/**
 * EffectPanorama - Swiper module for panoramic 3D carousel effect
 *
 * Creates a curved, panoramic carousel where slides appear to wrap around
 * the viewer in 3D space. Works best with:
 * - centeredSlides: true
 * - slidesPerView: 2-4 (or 'auto')
 * - loop: true (for infinite scrolling)
 */
export const EffectPanorama: SwiperModule = ({
  swiper,
  extendParams,
  on,
}) => {
  // Register default parameters
  extendParams({
    panoramaEffect: {
      depth: 200,
      rotate: 30,
    },
  })

  // On init, add necessary classes and enable watchSlidesProgress
  on("beforeInit", () => {
    if (swiper.params.effect !== "panorama") return

    // Required options for the effect to work properly
    const overwriteParams = {
      watchSlidesProgress: true,
    }

    Object.assign(swiper.params, overwriteParams)
    Object.assign(swiper.originalParams, overwriteParams)
  })

  // Add modifier classes after init and set up 3D perspective
  on("init", () => {
    if (swiper.params.effect !== "panorama") return

    // Add modifier classes for styling
    const containerModifier = swiper.params.containerModifierClass || "swiper-"
    swiper.el.classList.add(`${containerModifier}panorama`)
    swiper.el.classList.add(`${containerModifier}3d`)

    // Get panorama params for perspective calculation
    const panoramaParams = swiper.params.panoramaEffect || {}
    const depth = panoramaParams.depth ?? 200

    // Apply perspective to the container for 3D effect
    // Use depth * 4 for perspective to create good visual depth
    swiper.el.style.perspective = `${depth * 4}px`

    // Apply preserve-3d to wrapper so children inherit 3D context
    swiper.wrapperEl.style.transformStyle = "preserve-3d"
  })

  // Apply transforms on progress update
  on("progress", () => {
    if (swiper.params.effect !== "panorama") return

    const slideSizes = swiper.slidesSizesGrid
    const panoramaParams = swiper.params.panoramaEffect || {}
    const depth = panoramaParams.depth ?? 200
    const rotate = panoramaParams.rotate ?? 30

    // Convert rotation to radians for calculations
    const rotateRad = (rotate * Math.PI) / 180 / 2
    const angleMultiplier = 1 / (180 / rotate)

    for (let i = 0; i < swiper.slides.length; i += 1) {
      const slideEl = swiper.slides[i] as HTMLElement
      const progress = (slideEl as HTMLElement & { progress: number }).progress
      const slideSize = slideSizes[i]

      // Calculate offset based on centered slides setting
      const slidesPerViewOffset = swiper.params.centeredSlides
        ? 0
        : (((swiper.params.slidesPerView as number) || 1) - 1) * 0.5

      const progressOffset = progress + slidesPerViewOffset

      // Calculate the curve factor (how much the slide is "bent")
      const curveFactor = 1 - Math.cos(progressOffset * angleMultiplier * Math.PI)

      // Calculate translation along the main axis
      const translate = `${progressOffset * (slideSize / 3) * curveFactor}px`

      // Calculate rotation (how much the slide is angled)
      const rotationAngle = progressOffset * rotate

      // Calculate Z translation (depth - how far the slide is pushed back)
      const zTranslate = `${(slideSize * 0.5) / Math.sin(rotateRad) * curveFactor - depth}px`

      // Apply transforms based on direction
      if (swiper.params.direction === "horizontal") {
        slideEl.style.transform = `translateX(${translate}) translateZ(${zTranslate}) rotateY(${rotationAngle}deg)`
      } else {
        slideEl.style.transform = `translateY(${translate}) translateZ(${zTranslate}) rotateX(${-rotationAngle}deg)`
      }
    }
  })

  // Apply transition duration when set
  on("setTransition", (_swiper, duration) => {
    if (swiper.params.effect !== "panorama") return

    swiper.slides.forEach((slideEl) => {
      ; (slideEl as HTMLElement).style.transitionDuration = `${duration}ms`
    })
  })
}

export default EffectPanorama
