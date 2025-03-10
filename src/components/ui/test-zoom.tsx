import { animate, motion, useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

function TestZoom() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const ref = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastDragPos = useRef({ x: 0, y: 0 });
  const lastDragTime = useRef(0); // Track timestamp of last drag event
  const velocityTracker = useRef({ x: 0, y: 0 });

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);
  const [clickStartPos, setClickStartPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const clickThreshold = 5; // pixels of movement allowed to still count as a click
  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    document.addEventListener("gesturechange", handler);
    document.addEventListener("gestureend", handler);

    return () => {
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gesturechange", handler);
      document.removeEventListener("gestureend", handler);
    };
  }, []);

  const getBounds = useCallback(() => {
    if (!ref.current || !containerRef.current) return {};

    const containerRect = containerRef.current.getBoundingClientRect();
    const cardRect = ref.current.getBoundingClientRect();

    const leftBound =
      cardRect.width < containerRect.width
        ? -(containerRect.width / 2 - cardRect.width / 2)
        : -(cardRect.width / 2 - containerRect.width / 2);
    const rightBound =
      cardRect.width < containerRect.width
        ? containerRect.width / 2 - cardRect.width / 2
        : cardRect.width / 2 - containerRect.width / 2;

    const topBound =
      cardRect.height < containerRect.height
        ? -(containerRect.height / 2 - cardRect.height / 2)
        : -(cardRect.height / 2 - containerRect.height / 2);
    const bottomBound =
      cardRect.height < containerRect.height
        ? containerRect.height / 2 - cardRect.height / 2
        : cardRect.height / 2 - containerRect.height / 2;

    return {
      left: leftBound,
      right: rightBound,
      top: topBound,
      bottom: bottomBound,
    };
  }, []);

  const updatePosition = useCallback(
    (
      newX: number,
      newY: number,
      shouldAnimate = false,
      newScale?: number,
      animateScale = false
    ) => {
      if (!ref.current || !containerRef.current)
        return { bounds: {}, x: newX, y: newY };

      const containerRect = containerRef.current.getBoundingClientRect();
      const currentScale = newScale !== undefined ? newScale : scale.get();

      // We need to calculate the scaled dimensions of the image
      const naturalWidth = ref.current.naturalWidth;
      const naturalHeight = ref.current.naturalHeight;

      // Calculate aspect ratio
      const imageAspectRatio = naturalWidth / naturalHeight;
      const containerAspectRatio = containerRect.width / containerRect.height;

      // Calculate the effective dimensions of the image at scale = 1
      let baseWidth, baseHeight;
      if (imageAspectRatio > containerAspectRatio) {
        // Image is wider than container (relative to height)
        baseWidth = containerRect.width;
        baseHeight = baseWidth / imageAspectRatio;
      } else {
        // Image is taller than container (relative to width)
        baseHeight = containerRect.height;
        baseWidth = baseHeight * imageAspectRatio;
      }

      // Calculate scaled dimensions
      const scaledWidth = baseWidth * currentScale;
      const scaledHeight = baseHeight * currentScale;

      let finalX = newX;
      let finalY = newY;

      // Calculate boundaries based on scaled dimensions
      const maxOffsetX = Math.max(0, (scaledWidth - containerRect.width) / 2);
      const maxOffsetY = Math.max(0, (scaledHeight - containerRect.height) / 2);

      // Apply boundaries
      finalX = Math.max(-maxOffsetX, Math.min(maxOffsetX, finalX));
      finalY = Math.max(-maxOffsetY, Math.min(maxOffsetY, finalY));

      // Center image if smaller than container in any dimension
      if (scaledWidth <= containerRect.width) {
        finalX = 0;
      }

      if (scaledHeight <= containerRect.height) {
        finalY = 0;
      }

      // Apply with or without animation
      if (shouldAnimate) {
        animate(x, finalX, { type: "tween", duration: 0.2 });
        animate(y, finalY, { type: "tween", duration: 0.2 });

        // Animate scale if provided and animation is requested
        if (newScale !== undefined && animateScale) {
          animate(scale, newScale, {
            type: "tween",
            duration: 0.2,
          });
        }
      } else {
        x.set(finalX);
        y.set(finalY);

        // Set scale immediately if provided
        if (newScale !== undefined) {
          scale.set(newScale);
        }
      }

      getBounds();

      return {
        bounds: {
          left: -maxOffsetX,
          right: maxOffsetX,
          top: -maxOffsetY,
          bottom: maxOffsetY,
        },
        x: finalX,
        y: finalY,
      };
    },
    [x, y, scale, getBounds]
  );

  const applyMomentum = useCallback(() => {
    const vx = velocityTracker.current.x * 450; // Convert to pixels/second
    const vy = velocityTracker.current.y * 450;

    // Only apply momentum if velocity is significant
    if (Math.abs(vx) > 50 || Math.abs(vy) > 50) {
      // Calculate target position based on velocity
      const newX = x.get() + vx * 0.3; // Adjust multiplier for momentum strength
      const newY = y.get() + vy * 0.3;

      // Remove this line as it's redundant
      // updatePosition(newX, newY, true);

      // iOS-like behavior with proper animation API
      animate(x, newX, {
        type: "tween",
        velocity: vx / 450, // Convert back to appropriate velocity unit
        onUpdate: (latest) => {
          updatePosition(latest, y.get(), false);
        },
      });

      animate(y, newY, {
        type: "tween",
        velocity: vy / 450, // Convert back to appropriate velocity unit
        onUpdate: (latest) => {
          updatePosition(x.get(), latest, false);
        },
      });
    }
  }, [x, y, updatePosition]);

  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(
    null
  );
  const [initialScale, setInitialScale] = useState<number>(1);

  // Add these utility functions before the useGesture hook
  const getDistance = (p1: Touch, p2: Touch) => {
    return Math.sqrt(
      Math.pow(p2.clientX - p1.clientX, 2) +
        Math.pow(p2.clientY - p1.clientY, 2)
    );
  };

  const getMidpoint = (p1: Touch, p2: Touch) => {
    return {
      x: (p1.clientX + p2.clientX) / 2,
      y: (p1.clientY + p2.clientY) / 2,
    };
  };

  // Add these touch handlers
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 1) {
        // Start of a drag gesture
        setIsDragging(true);
        lastDragPos.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        lastDragTime.current = performance.now();
        velocityTracker.current = { x: 0, y: 0 };
      } else if (e.touches.length === 2) {
        // Start of a pinch gesture
        const distance = getDistance(e.touches[0], e.touches[1]);
        setTouchStartDistance(distance);
        setInitialScale(scale.get());
        e.preventDefault();
      }
    },
    [scale]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      // Only handle pinch gestures (2 fingers)
      if (e.touches.length === 1 && isDragging && scale.get() > 1) {
        // Handle drag
        const now = performance.now();
        const deltaTime = now - lastDragTime.current;
        const deltaX = e.touches[0].clientX - lastDragPos.current.x;
        const deltaY = e.touches[0].clientY - lastDragPos.current.y;

        // Update velocity (pixels per millisecond)
        if (deltaTime > 0) {
          velocityTracker.current = {
            x: deltaX / deltaTime,
            y: deltaY / deltaTime,
          };
        }

        lastDragPos.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        lastDragTime.current = now;

        // Update position with the delta
        updatePosition(x.get() + deltaX, y.get() + deltaY, false);
        e.preventDefault();
      }
      // Only handle pinch gestures (2 fingers)
      else if (e.touches.length === 2 && touchStartDistance !== null) {
        e.preventDefault();

        // Calculate new scale
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const scaleFactor = currentDistance / touchStartDistance;
        const newScale = Math.min(Math.max(initialScale * scaleFactor, 1), 3);

        // Calculate midpoint (center of pinch)
        const midpoint = getMidpoint(e.touches[0], e.touches[1]);

        if (ref.current) {
          const imgRef = ref.current.getBoundingClientRect();

          // Get position relative to the image center
          const pinchX = midpoint.x - imgRef.left - imgRef.width / 2;
          const pinchY = midpoint.y - imgRef.top - imgRef.height / 2;

          // Convert to image coordinates with current panning
          const pinchOnImageX = pinchX - x.get();
          const pinchOnImageY = pinchY - y.get();

          // Calculate new position to keep the pinch point fixed during zoom
          const currentScale = scale.get();
          const newX =
            x.get() + pinchOnImageX - pinchOnImageX * (newScale / currentScale);
          const newY =
            y.get() + pinchOnImageY - pinchOnImageY * (newScale / currentScale);

          // Update position and scale
          updatePosition(newX, newY, false, newScale);
        }
      }
    },
    [touchStartDistance, initialScale, scale, x, y, updatePosition, isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    if (touchStartDistance !== null) {
      setTouchStartDistance(null);
    }

    // Apply momentum if we were dragging
    if (isDragging && scale.get() > 1) {
      applyMomentum();
    }

    setIsDragging(false);
  }, [touchStartDistance, scale, applyMomentum, isDragging]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      // Determine zoom direction
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const currentScale = scale.get();
      const newScale = Math.min(Math.max(currentScale * zoomFactor, 1), 3);

      if (newScale === currentScale) return; // No change needed

      // Get container dimensions
      const imgRef = ref.current!.getBoundingClientRect();

      // Calculate mouse position relative to the container center
      const mouseX = e.clientX - imgRef.left - imgRef.width / 2;
      const mouseY = e.clientY - imgRef.top - imgRef.height / 2;

      // Convert mouse position to image coordinates by accounting for current panning
      const mouseOnImageX = mouseX - x.get();
      const mouseOnImageY = mouseY - y.get();

      // Calculate new position to keep the mouse point fixed during zoom
      const newX =
        x.get() + mouseOnImageX - mouseOnImageX * (newScale / currentScale);
      const newY =
        y.get() + mouseOnImageY - mouseOnImageY * (newScale / currentScale);

      // Update the scale first
      scale.set(newScale);

      // Update position with bounds check
      updatePosition(newX, newY, false);

      // Prevent default scrolling behavior
      e.preventDefault();
    },
    [scale, x, y, updatePosition]
  );

  const handleMouseDown = useCallback((e: MouseEvent) => {
    setClickStartPos({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
    lastDragPos.current = { x: e.clientX, y: e.clientY };
    lastDragTime.current = performance.now();
    velocityTracker.current = { x: 0, y: 0 };

    if (ref.current) {
      ref.current.style.cursor = "grabbing";
    }
  }, []);
  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.cursor = "grab";
      }

      // Apply momentum if we were dragging
      if (isDragging && scale.get() > 1) {
        applyMomentum();
      }

      // Check if this was a click or a drag
      if (clickStartPos) {
        const dx = Math.abs(e.clientX - clickStartPos.x);
        const dy = Math.abs(e.clientY - clickStartPos.y);

        // If minimal movement occurred, treat as a click
        if (dx <= clickThreshold && dy <= clickThreshold) {
          const currentScale = scale.get();
          // If zoomed in, reset to 1x, otherwise zoom to 2x
          const newScale =
            currentScale > 1.5 ? 1 : Math.min(currentScale * 2, 3);

          if (newScale === currentScale) return; // No change needed

          // Get container dimensions
          const imgRef = ref.current!.getBoundingClientRect();

          // Calculate mouse position relative to the container center
          const mouseX = e.clientX - imgRef.left - imgRef.width / 2;
          const mouseY = e.clientY - imgRef.top - imgRef.height / 2;

          // Convert mouse position to image coordinates
          const mouseOnImageX = mouseX - x.get();
          const mouseOnImageY = mouseY - y.get();

          // Calculate new position to keep the mouse point fixed during zoom
          const newX =
            x.get() + mouseOnImageX - mouseOnImageX * (newScale / currentScale);
          const newY =
            y.get() + mouseOnImageY - mouseOnImageY * (newScale / currentScale);

          // Update position with bounds check and animate scale
          updatePosition(newX, newY, true, newScale, true);
        }

        setClickStartPos(null);
      }

      // End drag regardless of whether it was a click or drag
      setIsDragging(false);
    },
    [
      clickStartPos,
      scale,
      x,
      y,
      updatePosition,
      clickThreshold,
      applyMomentum,
      isDragging,
    ]
  );

  // Add new handler for mouse move during drag
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && scale.get() > 1) {
        const now = performance.now();
        const deltaTime = now - lastDragTime.current;
        const deltaX = e.clientX - lastDragPos.current.x;
        const deltaY = e.clientY - lastDragPos.current.y;

        // Update velocity (pixels per millisecond)
        if (deltaTime > 0) {
          velocityTracker.current = {
            x: deltaX / deltaTime,
            y: deltaY / deltaTime,
          };
        }

        lastDragPos.current = { x: e.clientX, y: e.clientY };
        lastDragTime.current = now;

        // Update position with the delta
        updatePosition(x.get() + deltaX, y.get() + deltaY, false);
      }
    },
    [isDragging, scale, x, y, updatePosition]
  );

  const handleZoomOnClick = useCallback(
    (e: MouseEvent) => {
      const currentScale = scale.get();
      // If zoomed in, reset to 1x, otherwise zoom to 2x
      const newScale = currentScale > 1.5 ? 1 : Math.min(currentScale * 3, 3);

      if (newScale === currentScale) return; // No change needed

      // Get container dimensions
      const imgRef = ref.current!.getBoundingClientRect();

      // Calculate mouse position relative to the container center
      const mouseX = e.clientX - imgRef.left - imgRef.width / 2;
      const mouseY = e.clientY - imgRef.top - imgRef.height / 2;

      // Convert mouse position to image coordinates by accounting for current panning
      const mouseOnImageX = mouseX - x.get();
      const mouseOnImageY = mouseY - y.get();

      // Calculate new position to keep the mouse point fixed during zoom
      const newX =
        x.get() + mouseOnImageX - mouseOnImageX * (newScale / currentScale);
      const newY =
        y.get() + mouseOnImageY - mouseOnImageY * (newScale / currentScale);

      // Update position with bounds check and animate scale together
      updatePosition(newX, newY, true, newScale, true);

      e.preventDefault();
    },
    [scale, x, y, updatePosition]
  );

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });

      if (isTouchDevice) {
        container.addEventListener("dblclick", handleZoomOnClick);
        container.addEventListener("touchstart", handleTouchStart, {
          passive: false,
        });
        container.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
        container.addEventListener("touchend", handleTouchEnd);
      } else {
        container.addEventListener("mousedown", handleMouseDown);
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseup", handleMouseUp);
        // Add mouseleave to handle case when cursor leaves container while dragging
        container.addEventListener("mouseleave", handleMouseUp);
      }

      return () => {
        container.removeEventListener("wheel", handleWheel);

        if (isTouchDevice) {
          container.removeEventListener("dblclick", handleZoomOnClick);
          container.removeEventListener("touchstart", handleTouchStart);
          container.removeEventListener("touchmove", handleTouchMove);
          container.removeEventListener("touchend", handleTouchEnd);
        } else {
          container.removeEventListener("mousedown", handleMouseDown);
          container.removeEventListener("mousemove", handleMouseMove);
          container.removeEventListener("mouseup", handleMouseUp);
          container.removeEventListener("mouseleave", handleMouseUp);
        }
      };
    }
  }, [
    handleWheel,
    handleZoomOnClick,
    isTouchDevice,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  ]);

  return (
    <div>
      <div
        className="container-main w-full h-[70svh] bg-white rounded-lg shadow-lg ring ring-red-600 overflow-hidden flex items-center justify-center"
        ref={containerRef}
      >
        <motion.img
          className="object-contain object-center max-w-full max-h-full rounded-lg select-none touch-none cursor-grab"
          src="https://images.pexels.com/photos/1007431/pexels-photo-1007431.jpeg"
          ref={ref}
          draggable={false}
          onDrag={(e) => {
            e.preventDefault();
          }}
          style={{
            x,
            y,
            scale,
            backfaceVisibility: "hidden",
          }}
        />
      </div>
    </div>
  );
}

export { TestZoom };
