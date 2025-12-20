"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"
import { A11y, Keyboard, Navigation } from "swiper/modules"
import { Swiper as SwiperPrimitive, SwiperSlide } from "swiper/react"
import type {
  SwiperModule,
  SwiperOptions,
  Swiper as SwiperType,
} from "swiper/types"

// Re-export types for user convenience
export type { SwiperModule, SwiperOptions }

// ============================================================================
// Types
// ============================================================================

type CarouselApi = SwiperType

type SwiperContextProps = {
  swiper: SwiperType | null
  orientation: "horizontal" | "vertical"
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollPrev: () => void
  scrollNext: () => void
  activeIndex: number
  slidesCount: number
  // For SwiperContent to receive config
  modules: SwiperModule[]
  swiperProps: Partial<React.ComponentProps<typeof SwiperPrimitive>>
  onSwiper: (swiper: SwiperType) => void
  onSlideChange: (swiper: SwiperType) => void
}

// ============================================================================
// Context
// ============================================================================

const SwiperContext = React.createContext<SwiperContextProps | null>(null)

function useSwiperContext() {
  const context = React.useContext(SwiperContext)
  if (!context) {
    throw new Error("useSwiper must be used within a <Swiper />")
  }
  return context
}

// Re-export for external usage
export { useSwiperContext as useSwiper }

// ============================================================================
// Swiper (Root - provides context only, no wrapper rendering)
// ============================================================================

type SwiperProps = Omit<
  React.ComponentProps<typeof SwiperPrimitive>,
  "onSwiper" | "children"
> & {
  children: React.ReactNode
  setApi?: (api: CarouselApi) => void
  orientation?: "horizontal" | "vertical"
}

function Swiper({
  children,
  setApi,
  orientation = "horizontal",
  modules = [],
  ...props
}: SwiperProps) {
  const [swiperInstance, setSwiperInstance] = React.useState<SwiperType | null>(
    null
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [slidesCount, setSlidesCount] = React.useState(0)

  // Combine user modules with essential modules (A11y, Keyboard, Navigation for accessibility)
  const allModules = React.useMemo(() => {
    return [A11y, Keyboard, Navigation, ...modules]
  }, [modules])

  const updateState = React.useCallback((swiper: SwiperType) => {
    setCanScrollPrev(!swiper.isBeginning)
    setCanScrollNext(!swiper.isEnd)
    setActiveIndex(swiper.activeIndex)
    setSlidesCount(swiper.slides.length)
  }, [])

  const handleSwiper = React.useCallback(
    (swiper: SwiperType) => {
      setSwiperInstance(swiper)
      setApi?.(swiper)
      updateState(swiper)
    },
    [setApi, updateState]
  )

  const scrollPrev = React.useCallback(() => {
    swiperInstance?.slidePrev()
  }, [swiperInstance])

  const scrollNext = React.useCallback(() => {
    swiperInstance?.slideNext()
  }, [swiperInstance])

  const contextValue = React.useMemo<SwiperContextProps>(
    () => ({
      swiper: swiperInstance,
      orientation,
      canScrollPrev,
      canScrollNext,
      scrollPrev,
      scrollNext,
      activeIndex,
      slidesCount,
      // Pass config to SwiperContent
      modules: allModules,
      swiperProps: {
        direction: orientation === "vertical" ? "vertical" : "horizontal",
        ...props,
      },
      onSwiper: handleSwiper,
      onSlideChange: updateState,
    }),
    [
      swiperInstance,
      orientation,
      canScrollPrev,
      canScrollNext,
      scrollPrev,
      scrollNext,
      activeIndex,
      slidesCount,
      allModules,
      props,
      handleSwiper,
      updateState,
    ]
  )

  return (
    <SwiperContext.Provider value={contextValue}>
      {children}
    </SwiperContext.Provider>
  )
}

// ============================================================================
// SwiperWrapper (Container wrapper - for layout and positioning)
// ============================================================================

type SwiperWrapperProps = React.HTMLAttributes<HTMLDivElement>

function SwiperWrapper({ className, children, ...props }: SwiperWrapperProps) {
  const { orientation } = useSwiperContext()

  return (
    <div
      className={cn("relative", className)}
      data-slot="swiper"
      data-orientation={orientation}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// SwiperContent - The actual Swiper carousel (receives config from Swiper via context)
// ============================================================================

type SwiperContentProps = {
  className?: string
  children?: React.ReactNode
  /** Only used for thumbs gallery - to get the swiper instance for linking */
  onSwiper?: (swiper: SwiperType) => void
}

function SwiperContent({
  className,
  children,
  onSwiper: onSwiperProp,
}: SwiperContentProps) {
  const {
    modules,
    swiperProps,
    onSwiper: onSwiperContext,
    onSlideChange,
    orientation,
  } = useSwiperContext()

  // Handle both context onSwiper and prop onSwiper (for thumbs)
  const handleSwiper = (swiper: SwiperType) => {
    onSwiperContext(swiper)
    onSwiperProp?.(swiper)
  }

  return (
    <SwiperPrimitive
      modules={modules}
      onSwiper={handleSwiper}
      onSlideChange={onSlideChange}
      onReachBeginning={onSlideChange}
      onReachEnd={onSlideChange}
      keyboard={true}
      className={cn(
        "w-full",
        // Custom styles for scrollbar
        "[&_.swiper-scrollbar]:bg-muted [&_.swiper-scrollbar-drag]:bg-primary/50",
        swiperProps.className,
        className
      )}
      data-slot="swiper-content"
      data-orientation={orientation}
      {...swiperProps}
    >
      {children}
    </SwiperPrimitive>
  )
}

// ============================================================================
// SwiperItem - Re-export SwiperSlide directly
// Swiper React identifies slides by component type, wrapping breaks this
// ============================================================================

const SwiperItem = SwiperSlide

// ============================================================================
// SwiperPrevious
// ============================================================================

type SwiperPreviousProps = React.ComponentProps<typeof Button>

function SwiperPrevious({
  className,
  variant = "outline",
  ...props
}: SwiperPreviousProps) {
  const { scrollPrev, canScrollPrev, orientation } = useSwiperContext()

  return (
    <Button
      data-slot="swiper-previous"
      variant={variant}
      iconOnly
      className={cn(
        "absolute z-10 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeft className="size-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

// ============================================================================
// SwiperNext
// ============================================================================

type SwiperNextProps = React.ComponentProps<typeof Button>

function SwiperNext({
  className,
  variant = "outline",
  ...props
}: SwiperNextProps) {
  const { scrollNext, canScrollNext, orientation } = useSwiperContext()

  return (
    <Button
      data-slot="swiper-next"
      variant={variant}
      iconOnly
      className={cn(
        "absolute z-10 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRight className="size-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

// ============================================================================
// SwiperDots (Simple pagination dots)
// ============================================================================

type SwiperDotsProps = React.HTMLAttributes<HTMLDivElement>

function SwiperDots({ className, ...props }: SwiperDotsProps) {
  const { swiper, activeIndex, slidesCount, orientation } = useSwiperContext()

  if (slidesCount === 0) return null

  return (
    <div
      data-slot="swiper-dots"
      className={cn(
        "mt-3 flex items-center justify-center gap-1.5",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className
      )}
      {...props}
    >
      {Array.from({ length: slidesCount }).map((_, index) => (
        <button
          key={index}
          type="button"
          className={cn(
            "flex size-2 rounded-full transition-all",
            index === activeIndex
              ? "bg-primary"
              : "bg-primary/30 hover:bg-primary/50"
          )}
          onClick={() => swiper?.slideTo(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
}

// ============================================================================
// SwiperDynamicDots (Dynamic pagination - shows limited bullets with animation)
// Like Swiper's dynamicBullets but custom React implementation
// ============================================================================

type SwiperDynamicDotsProps = React.HTMLAttributes<HTMLDivElement> & {
  /** The number of main bullets visible at full size (default: 1) */
  dynamicMainBullets?: number
  /** Total number of visible bullets including scaled ones (default: 5) */
  visibleBullets?: number
  /** Bullet size in Tailwind units (default: 2 = size-2 = 0.5rem) */
  size?: number
  /** Gap between bullets in Tailwind units (default: 1.5 = gap-1.5 = 0.375rem) */
  gap?: number
  /** Custom render function for bullets */
  renderBullet?: (
    index: number,
    props: {
      isActive: boolean
      scale: number
      onClick: () => void
    }
  ) => React.ReactNode
}

function SwiperDynamicDots({
  className,
  style,
  dynamicMainBullets = 1,
  visibleBullets = 5,
  size = 2,
  gap = 1.5,
  renderBullet,
  ...props
}: SwiperDynamicDotsProps) {
  const { swiper, activeIndex, slidesCount, orientation } = useSwiperContext()

  if (slidesCount === 0) return null

  // Convert Tailwind units to rem (1 unit = 0.25rem)
  const bulletSizeRem = size * 0.25
  const gapRem = gap * 0.25
  const bulletWidthRem = bulletSizeRem + gapRem

  // Calculate how many bullets to scale on each side
  const scaledPerSide = Math.floor((visibleBullets - dynamicMainBullets) / 2)

  // Calculate container size
  const containerSizeCalc = `calc(${visibleBullets} * ${bulletSizeRem}rem + ${visibleBullets - 1} * ${gapRem}rem)`

  // Ghost bullets needed for centering at edges
  const ghostCount = Math.floor(visibleBullets / 2)

  // Calculate transform offset - always center on active bullet
  const centerOffset = ghostCount
  const transformValue =
    -(activeIndex + ghostCount - centerOffset) * bulletWidthRem

  // Calculate scale for each bullet based on distance from active
  const getScale = (index: number) => {
    const distance = Math.abs(index - activeIndex)

    // Main bullets at full size
    const mainRadius = Math.floor((dynamicMainBullets - 1) / 2)
    if (distance <= mainRadius) return 1

    // Calculate scale for bullets outside main area
    const scaleDistance = distance - mainRadius
    if (scaleDistance <= scaledPerSide) {
      // Linear scale from 1 to 0.33
      return 1 - (scaleDistance / (scaledPerSide + 1)) * 0.67
    }

    return 0
  }

  const cssVars = {
    "--swiper-bullet-size": `${bulletSizeRem}rem`,
    "--swiper-bullet-gap": `${gapRem}rem`,
  } as React.CSSProperties

  // Create array with ghost slots at beginning and end
  const totalSlots = slidesCount + ghostCount * 2

  return (
    <div
      data-slot="swiper-dynamic-dots"
      className={cn("mt-3 flex items-center justify-center", className)}
      style={{ ...cssVars, ...style }}
      {...props}
    >
      <div
        className="overflow-hidden"
        style={
          orientation === "vertical"
            ? { height: containerSizeCalc }
            : { width: containerSizeCalc }
        }
      >
        <div
          className={cn(
            "flex items-center transition-transform duration-300 ease-out",
            orientation === "vertical" ? "flex-col" : "flex-row"
          )}
          style={{
            gap: "var(--swiper-bullet-gap)",
            transform:
              orientation === "vertical"
                ? `translateY(${transformValue}rem)`
                : `translateX(${transformValue}rem)`,
          }}
        >
          {Array.from({ length: totalSlots }).map((_, slotIndex) => {
            // Ghost slots at beginning
            if (slotIndex < ghostCount) {
              return (
                <span
                  key={`ghost-start-${slotIndex}`}
                  style={{
                    width: "var(--swiper-bullet-size)",
                    height: "var(--swiper-bullet-size)",
                    flexShrink: 0,
                  }}
                />
              )
            }

            // Ghost slots at end
            if (slotIndex >= ghostCount + slidesCount) {
              return (
                <span
                  key={`ghost-end-${slotIndex}`}
                  style={{
                    width: "var(--swiper-bullet-size)",
                    height: "var(--swiper-bullet-size)",
                    flexShrink: 0,
                  }}
                />
              )
            }

            // Actual bullet
            const index = slotIndex - ghostCount
            const scale = getScale(index)
            const isActive = index === activeIndex
            const onClick = () => swiper?.slideTo(index)

            // Custom render
            if (renderBullet) {
              return (
                <span key={index} style={{ display: "contents" }}>
                  {renderBullet(index, { isActive, scale, onClick })}
                </span>
              )
            }

            // Default render
            return (
              <button
                key={index}
                type="button"
                className={cn(
                  "flex shrink-0 rounded-full transition-all duration-300",
                  isActive ? "bg-primary" : "bg-primary/30 hover:bg-primary/50"
                )}
                style={{
                  width: "var(--swiper-bullet-size)",
                  height: "var(--swiper-bullet-size)",
                  transform: `scale(${scale})`,
                  opacity: scale,
                }}
                onClick={onClick}
                aria-label={`Go to slide ${index + 1}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SwiperCounter (Slide counter display)
// ============================================================================

type SwiperCounterProps = React.HTMLAttributes<HTMLDivElement>

function SwiperCounter({ className, ...props }: SwiperCounterProps) {
  const { activeIndex, slidesCount } = useSwiperContext()

  return (
    <div
      data-slot="swiper-counter"
      className={cn("text-muted-foreground text-center text-sm", className)}
      {...props}
    >
      {activeIndex + 1} / {slidesCount}
    </div>
  )
}

// ============================================================================
// SwiperProgress (Progress bar)
// ============================================================================

type SwiperProgressProps = React.HTMLAttributes<HTMLDivElement>

function SwiperProgress({ className, ...props }: SwiperProgressProps) {
  const { activeIndex, slidesCount } = useSwiperContext()

  const progress =
    slidesCount > 1 ? ((activeIndex + 1) / slidesCount) * 100 : 100

  return (
    <div
      data-slot="swiper-progress"
      className={cn(
        "bg-muted h-1 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <div
        className="bg-primary h-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// ============================================================================
// Exports
// ============================================================================

export {
  Swiper,
  SwiperContent,
  SwiperCounter,
  SwiperDots,
  SwiperDynamicDots,
  SwiperItem,
  SwiperNext,
  SwiperPrevious,
  SwiperProgress,
  SwiperWrapper,
  type CarouselApi as SwiperApi,
}
