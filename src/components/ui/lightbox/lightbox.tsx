/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import React, { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";
import { FreeMode, Keyboard, Navigation, Thumbs, Zoom } from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import { Button } from "../button";

const LightboxIdContext = React.createContext<string | undefined>(undefined);
const MotionButton = motion(Button);

export const LightboxContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const id = React.useId(); // Generate a unique id for each component

  return (
    <LightboxIdContext.Provider value={id}>
      {children}
    </LightboxIdContext.Provider>
  );
};

export const useLightBoxId = () => {
  const context = React.useContext(LightboxIdContext);
  if (!context) {
    throw new Error("useLightBoxId must be used within a LightboxContext");
  }
  return context;
};

export type LightBoxImageType = {
  src: string;
  thumb?: string;
  alt?: string;
};

type LightboxItemProps = React.HTMLAttributes<HTMLDivElement> &
  Omit<LightBoxImageType, "thumb"> & {
    index: number;
    selectedIndex: number;
    onSelect: (index: number) => void;
  };

const LightboxItem = React.forwardRef<HTMLDivElement, LightboxItemProps>(
  ({ className, src, index, selectedIndex, onSelect, ...props }, ref) => {
    const id = useLightBoxId();
    return (
      <div
        ref={ref}
        className={cn(
          "thumbnail-item cursor-zoom-in aspect-square relative overflow-hidden",
          className
        )}
        {...props}
      >
        <motion.img
          layoutId={`${id}-image-${index}`}
          src={src}
          className="absolute z-10 object-cover w-full h-full col-start-1 row-start-1 rounded-lg pointer-events-none"
          transition={{
            duration: selectedIndex === index ? 0.3 : 0,
          }}
          alt=""
        />
        <img
          alt=""
          src={src}
          className="relative z-0 object-cover w-full h-full col-start-1 row-start-1 rounded-lg"
          onClick={() => onSelect(index)}
        />
      </div>
    );
  }
);

LightboxItem.displayName = "LightboxItem";

type LightboxRootProps = {
  images: LightBoxImageType[];
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultIndex?: number;
  index?: number;
  onIndexChange?: (index: number) => void;
  dragCloseThreshold?: number;
};

const LightboxRoot = ({
  images,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  defaultIndex = 0,
  index: controlledIndex,
  onIndexChange,
  dragCloseThreshold = 100,
}: LightboxRootProps) => {
  const id = useLightBoxId();
  const [scope, animate] = useAnimate();

  const [thumbsSwiper, setThumbsSwiper] = React.useState<SwiperType | null>(
    null
  );

  // Internal state for uncontrolled mode
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [uncontrolledIndex, setUncontrolledIndex] =
    React.useState(defaultIndex);

  // Determine if we're in controlled mode
  const isOpenControlled = controlledOpen !== undefined;
  const isIndexControlled = controlledIndex !== undefined;

  // Use controlled or uncontrolled values
  const open = isOpenControlled ? controlledOpen : uncontrolledOpen;
  const selectedIndex = isIndexControlled ? controlledIndex : uncontrolledIndex;

  // Handler functions that work in both controlled and uncontrolled modes
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!isOpenControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isOpenControlled, onOpenChange]
  );

  const handleIndexChange = useCallback(
    (newIndex: number) => {
      if (!isIndexControlled) {
        setUncontrolledIndex(newIndex);
      }
      onIndexChange?.(newIndex);
    },
    [isIndexControlled, onIndexChange]
  );

  const y = useMotionValue(0);
  const opacity = useTransform(
    y,
    [-dragCloseThreshold * 1, 0, dragCloseThreshold * 1],
    [0, 1, 0]
  );
  const ref = React.useRef<SwiperRef | null>(null);
  const [scale, setScale] = React.useState(1);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        event.stopPropagation();
        handleOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleOpenChange]);

  useMotionValueEvent(y, "change", () => {
    if (open) {
      animate(
        scope.current,
        { opacity: opacity.get() },
        {
          duration: 0,
        }
      );
    }
  });
  React.useEffect(() => {
    if (!open) {
      setThumbsSwiper(null);
    }
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <RemoveScroll>
          <motion.div
            className="fixed inset-0 z-50 text-white pointer-events-auto"
            initial={false}
            animate="animate"
            exit="exit"
          >
            <motion.div
              ref={scope}
              className="absolute inset-0 top-0 left-0 bg-black cursor-pointer backdrop bg-opacity-80 backdrop-blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleOpenChange(false)}
            ></motion.div>
            <div className="relative z-10 flex flex-col h-full pointer-events-none">
              <motion.div
                initial={{ opacity: 0 }}
                transition={{
                  ease: "anticipate",
                  duration: 0.15,
                }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 p-4 md:py-6 md:px-8"
              >
                <div className="flex-1 truncate">
                  {images[selectedIndex].src.split("/").pop()}
                </div>

                <Button
                  size={"lg"}
                  iconOnly
                  variant="ghost"
                  className={cn(
                    "bg-transparent rounded-full backdrop-blur-lg [&_svg]:text-white hover:bg-black/60"
                  )}
                  onClick={() => {
                    ref.current?.swiper.zoom.toggle();
                  }}
                >
                  {scale === 1 ? (
                    <ZoomIn className="!size-6" />
                  ) : (
                    <ZoomOut className="!size-6" />
                  )}
                </Button>
                <Button
                  size={"lg"}
                  iconOnly
                  variant="ghost"
                  className="bg-transparent rounded-full backdrop-blur-lg hover:bg-black/60 [&_svg]:text-white"
                  onClick={() => {
                    handleOpenChange(false);
                  }}
                >
                  <X className="!size-6" />
                </Button>
              </motion.div>
              <div className="relative flex-1 overflow-y-auto pointer-events-auto">
                <MotionButton
                  initial={{ opacity: 0 }}
                  transition={{
                    ease: "anticipate",
                    duration: 0.15,
                  }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  size={"lg"}
                  iconOnly
                  variant="ghost"
                  className="absolute top-0 bottom-0 right-4 md:right-20 m-auto md:size-14 rounded-full bg-black/80 backdrop-blur-lg z-20 hover:bg-black/60 disabled:!pointer-events-auto disabled:cursor-not-allowed disabled:!opacity-50"
                  disabled={selectedIndex === images.length - 1}
                  onClick={() => {
                    ref.current?.swiper.slideNext();
                  }}
                >
                  <ChevronRight
                    className="md:!size-12 !text-white"
                    strokeWidth="1"
                  />
                </MotionButton>
                <MotionButton
                  initial={{ opacity: 0 }}
                  transition={{
                    ease: "anticipate",
                    duration: 0.15,
                  }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  size={"lg"}
                  iconOnly
                  variant="ghost"
                  className="absolute top-0 bottom-0 left-4 md:left-20 m-auto md:size-14 rounded-full bg-black/80 backdrop-blur-lg z-20 hover:bg-black/60 disabled:!pointer-events-auto disabled:cursor-not-allowed disabled:!opacity-50"
                  disabled={selectedIndex === 0}
                  onClick={() => {
                    ref.current?.swiper.slidePrev();
                  }}
                >
                  <ChevronLeft
                    className="md:!size-12 !text-white"
                    strokeWidth="1"
                  />
                </MotionButton>
                <Swiper
                  ref={ref}
                  zoom={{
                    panOnMouseMove: true,
                  }}
                  spaceBetween={24}
                  pagination={{
                    clickable: true,
                  }}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[Zoom, Thumbs, Keyboard]}
                  className="w-full h-full"
                  onSlideChangeTransitionEnd={(swiper) => {
                    handleIndexChange(swiper.activeIndex);
                  }}
                  initialSlide={selectedIndex}
                  onZoomChange={(_swiper, scale) => {
                    setScale(scale);
                  }}
                  keyboard={true}
                >
                  {images.map((image, i) => (
                    <SwiperSlide className="overflow-hidden" key={i}>
                      <div
                        className="swiper-zoom-container"
                        onClick={() => handleOpenChange(false)}
                      >
                        <motion.div
                          className={cn(
                            "flex items-center justify-center w-fit h-full",
                            scale === 1
                              ? "pointer-events-auto"
                              : "pointer-events-none"
                          )}
                          drag={"y"}
                          dragDirectionLock
                          dragConstraints={{
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                          }}
                          onDragEnd={(_e, { offset }) => {
                            if (Math.abs(offset.y) > dragCloseThreshold) {
                              handleOpenChange(false);
                            }
                          }}
                          style={{ y }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <motion.div
                            className="flex items-center h-full max-h-full w-fit pointer-events-auto"
                            layoutId={`${id}-image-${i}`}
                            transition={{
                              duration: selectedIndex === i ? 0.3 : 0,
                            }}
                          >
                            <img
                              onClick={(e) => e.stopPropagation()}
                              src={image.src}
                              alt={image.alt || ""}
                              className="max-h-full"
                            />
                          </motion.div>
                        </motion.div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <motion.div
                initial={{ opacity: 0, y: "100%" }}
                transition={{
                  ease: "anticipate",
                  duration: 0.15,
                }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                className="max-w-full mx-auto"
              >
                <Swiper
                  onSwiper={setThumbsSwiper}
                  className="!h-auto p-4 pointer-events-auto"
                  slidesPerView={"auto"}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  initialSlide={selectedIndex}
                  centeredSlides={true}
                  centeredSlidesBounds={true}
                  spaceBetween={0}
                >
                  {images.map((image, i) => (
                    <SwiperSlide
                      key={i}
                      className="w-[100px] [&.swiper-slide-thumb-active_.img-wraper]:ring-border [&.swiper-slide-thumb-active_.img-wraper]:ring-1 overflow-hidden"
                    >
                      <div className="p-2">
                        <div className="aspect-square img-wraper ring-transparent rounded-xl ring-offset-1">
                          <img
                            onClick={(e) => e.stopPropagation()}
                            src={image.thumb || image.src}
                            alt={image.alt || ""}
                            className="object-cover w-full h-full rounded-xl"
                          />
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </motion.div>
            </div>
          </motion.div>
        </RemoveScroll>
      )}
    </AnimatePresence>,
    document.body
  );
};

export { LightboxRoot as Lightbox, LightboxItem };
