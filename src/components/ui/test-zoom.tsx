import { useGesture } from "@use-gesture/react";
import { animate, motion, useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

function TestZoom() {
  const [down, setDown] = useState(false);
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

  // Replace useSpring with useMotionValue
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const ref = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Combined function to handle bounds calculation and position updates
  const updatePosition = useCallback(
    (newX: number, newY: number, shouldAnimate = false) => {
      if (!ref.current || !containerRef.current)
        return { bounds: {}, x: newX, y: newY };

      const containerRect = containerRef.current.getBoundingClientRect();
      const cardRect = ref.current.getBoundingClientRect();
      console.log(cardRect.width, containerRect.height);

      // Calculate bounds
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

      const bounds = {
        left: leftBound,
        right: rightBound,
        top: topBound,
        bottom: bottomBound,
      };

      // Determine final positions
      let finalX = newX;
      let finalY = newY;

      // If image width is smaller than container width, center it horizontally
      if (cardRect.width < containerRect.width) {
        finalX = 0;
      } else {
        // Constrain to bounds
        finalX = Math.max(bounds.left, Math.min(bounds.right, finalX));
      }

      // If image height is smaller than container height, center it vertically
      if (cardRect.height < containerRect.height) {
        finalY = 0;
      } else {
        // Constrain to bounds
        finalY = Math.max(bounds.top, Math.min(bounds.bottom, finalY));
      }

      // Apply positions
      if (shouldAnimate) {
        animate(x, finalX, { type: "tween", duration: 0.2 });
        animate(y, finalY, { type: "tween", duration: 0.2 });
      } else {
        x.set(finalX);
        y.set(finalY);
      }

      return { bounds, x: finalX, y: finalY };
    },
    []
  );

  useGesture(
    {
      onDrag: ({ down, pinching, cancel, offset: [offsetX, offsetY] }) => {
        if (pinching) return cancel();
        setDown(down);

        if (ref.current && containerRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const cardRect = ref.current.getBoundingClientRect();
          if (cardRect.width > containerRect.width) {
            if (!down) {
              animate(x, offsetX, { type: "tween" });
            } else {
              x.set(offsetX);
            }
          }
          if (cardRect.height > containerRect.height) {
            if (!down) {
              animate(y, offsetY, { type: "tween" });
            } else {
              y.set(offsetY);
            }
          }
        }
      },
      onDragEnd: ({ down, velocity: [vx, vy], direction: [dx, dy] }) => {
        if (down) return;

        // Use smaller multiplier for velocity and apply deceleration
        const velocityFactor = Math.min(0.2, Math.max(0.05, 1 / scale.get()));
        const targetX = x.get() + vx * velocityFactor * 300 * dx;
        const targetY = y.get() + vy * velocityFactor * 300 * dy;

        // Use spring animation for smoother deceleration
        updatePosition(targetX, targetY, true);
      },
      onPinch: ({
        origin: [ox, oy],
        first,
        movement: [ms],
        offset: [s],
        memo,
      }) => {
        if (first) {
          const {
            width,
            height,
            x: rectX,
            y: rectY,
          } = ref.current!.getBoundingClientRect();
          const tx = ox - (rectX + width / 2);
          const ty = oy - (rectY + height / 2);
          memo = [x.get(), y.get(), tx, ty];
        }

        const newX = memo[0] - (ms - 1) * memo[2];
        const newY = memo[1] - (ms - 1) * memo[3];

        x.set(newX);
        y.set(newY);

        scale.set(s);

        return memo;
      },
      onPinchEnd: ({ velocity: [v], offset: [s] }) => {
        updatePosition(x.get() + v * 50 * s, y.get() + v * 50 * s, true);
        if (scale.get() < 1) {
          animate(scale, s, { type: "tween" });
        }
      },
    },
    {
      target: ref,
      drag: {
        from: () => [x.get(), y.get()],
        swipe: {
          velocity: 2,
        },
        bounds: () => {
          if (!containerRef.current || !ref.current) return {};

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
        },
        rubberband: 0.5,
      },
      pinch: {
        scaleBounds: { min: 1, max: 3 },
        rubberband: 0.5,
      },
    }
  );

  return (
    <div className="">
      <div
        className="container-main w-full h-[80svh] bg-white rounded-lg shadow-lg ring ring-red-600 overflow-hidden flex items-center justify-center"
        ref={containerRef}
      >
        <motion.img
          className="object-contain object-center max-w-full max-h-full rounded-lg select-none touch-none will-change-transform cursor-grab"
          src="https://images.pexels.com/photos/1007431/pexels-photo-1007431.jpeg"
          ref={ref}
          height={750}
          draggable={false}
          style={{
            x,
            y,
            scale,
          }}
        />
      </div>
      {down.toString()}
    </div>
  );
}

export { TestZoom };
