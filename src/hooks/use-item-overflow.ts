import { useResizeObserver } from "@/hooks/use-resize-observer";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseItemOverflowProps {
  totalItems: number;
  maxShownItems?: number;
  minShowItems?: number; // Add this new prop
  itemClassName?: string;
  plusItemClassName?: string;
}

interface UseItemOverflowReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  visibleCount: number;
  overflowCount: number;
  isVisible: (index: number) => boolean;
}

export const useItemOverflow = ({
  totalItems,
  maxShownItems = Infinity,
  minShowItems = 1,
  itemClassName = "measured-item",
  plusItemClassName = "measured-plus",
}: UseItemOverflowProps): UseItemOverflowReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(0);

  const calculateOverflow = useCallback(() => {
    const containerWidth = containerRef.current?.getBoundingClientRect().width;
    if (!containerWidth) return;
    if (!containerRef.current) return;
    if (totalItems === 0) {
      setVisibleCount(0);
      return;
    }

    const itemNodes = containerRef.current.querySelectorAll<HTMLDivElement>(`.${itemClassName}`);
    const itemGap = parseInt(getComputedStyle(containerRef.current).gap);
    const plusNode = containerRef.current.querySelector<HTMLDivElement>(`.${plusItemClassName}`);

    const itemArray = Array.from(itemNodes);
    const plusWidth = (plusNode?.getBoundingClientRect().width || 0) + itemGap;

    let widthSoFar = 0;
    let count = 0;

    for (let i = 0; i < itemArray.length; i++) {
      const w = itemArray[i].getBoundingClientRect().width + itemGap;
      if (widthSoFar + w <= containerWidth) {
        widthSoFar += w;
        count++;
        if (count >= maxShownItems) break;
      } else {
        break;
      }
    }

    if (count === totalItems) {
      setVisibleCount(count);
    } else {
      while (count > 0) {
        let testWidth = 0;
        for (let i = 0; i < count; i++) {
          testWidth += itemArray[i].getBoundingClientRect().width + itemGap;
        }
        if (testWidth + plusWidth <= containerWidth) {
          setVisibleCount(Math.max(count, minShowItems)); // Ensure we show at least minShowItems
          return;
        }
        count--;
      }
      setVisibleCount(minShowItems); // Even if no items fit, show minShowItems
    }
  }, [totalItems, maxShownItems, minShowItems, itemClassName, plusItemClassName]);

  useResizeObserver({
    ref: containerRef,
    onResize: calculateOverflow,
  });

  useEffect(() => {
    calculateOverflow();
  }, [calculateOverflow]);

  const showCount = Math.min(Math.max(visibleCount, minShowItems), totalItems);
  const overflowCount = totalItems - showCount;
  const isVisible = (index: number) => index < minShowItems || index < showCount;

  return {
    containerRef,
    visibleCount: showCount,
    overflowCount,
    isVisible,
  };
};