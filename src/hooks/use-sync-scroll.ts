import React from "react";

export function useSyncScroll(
  containerRef: React.RefObject<HTMLElement>,
  syncWithContainer?: React.RefObject<HTMLElement>
) {
  React.useEffect(() => {
    const container = containerRef.current;
    const targetContainer = syncWithContainer?.current;
    if (!container || !targetContainer) return;

    container.style.overflowX = "hidden";
    container.scrollLeft = targetContainer.scrollLeft;

    const handleTargetScroll = () => {
      requestAnimationFrame(() => {
        const newScrollLeft = Math.round(targetContainer.scrollLeft);
        if (container.scrollLeft !== newScrollLeft) {
          container.scrollLeft = newScrollLeft;
          // Trigger scroll event to update hook state
          container.dispatchEvent(new Event("scroll", { bubbles: true }));
        }
      });
    };

    targetContainer.addEventListener("scroll", handleTargetScroll, {
      passive: true,
    });

    return () => {
      targetContainer.removeEventListener("scroll", handleTargetScroll);
      container.style.overflowX = "";
    };
  }, [containerRef, syncWithContainer]);
}