import { RefObject, useEffect, useState } from 'react';

type ScrollPosition = {
  isReachTop: boolean;
  isReachBottom: boolean;
  isReachLeft: boolean;
  isReachRight: boolean;
};

function useScrollPosition(ref: RefObject<Element>): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({
    isReachTop: true,
    isReachBottom: false,
    isReachLeft: true,
    isReachRight: false,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollLeft,
        scrollWidth,
        clientWidth,
      } = element;

      const vertical = {
        isReachTop: scrollTop <= 0,
        isReachBottom: scrollTop + clientHeight >= scrollHeight,
      };

      const horizontal = {
        isReachRight: scrollLeft <= 0,
        isReachLeft: scrollLeft + clientWidth >= scrollWidth,
      };

      setPosition(prev => {
        const newState = { ...vertical, ...horizontal };
        return JSON.stringify(prev) === JSON.stringify(newState) ? prev : newState;
      });
    };

    // Initial check
    handleScroll();

    // Add scroll event listener
    element.addEventListener('scroll', handleScroll, { passive: true });

    // Add resize observer
    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(element);

    // Cleanup
    return () => {
      element.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [ref]);

  return position;
}

export default useScrollPosition;