"use client"

import React from "react";

export type ScrollPosition = 'center' | 'start' | 'end';
export type ScrollAxis = 'x' | 'y' | 'both';

export interface ScrollIntoViewHookOptions {
  /**
   * Only scroll if element is not fully in view
   * @default true
   */
  onlyIfNeeded?: boolean;

  /**
   * Position to scroll the element to
   * @default 'center'
   */
  position?: ScrollPosition;

  /**
   * Additional offset in pixels
   * @default 0
   */
  offset?: number;

  /**
   * Smooth scrolling behavior
   * @default true
   */
  smooth?: boolean;

  /**
   * Which axis to scroll on
   * @default 'both'
   */
  axis?: ScrollAxis;

  /**
   * Custom container to scroll within (defaults to window)
   */
  container?: HTMLElement | null;
}

/**
 * Hook for scrolling elements into view with configurable options
 */
export const useScrollIntoView = () => {
  return React.useCallback((element: HTMLElement | null, options: ScrollIntoViewHookOptions = {}) => {
    if (!element) return;

    const {
      onlyIfNeeded = true,
      position = 'center',
      offset = 0,
      smooth = true,
      axis = 'both',
      container = null
    } = options;

    // Determine if we're scrolling the window or a specific container
    const isWindowScroll = !container;
    const scrollContainer = container || document.documentElement;

    // Get element and container dimensions
    const elementRect = element.getBoundingClientRect();
    const containerRect = isWindowScroll
      ? {
        top: 0,
        left: 0,
        bottom: window.innerHeight,
        right: window.innerWidth,
        width: window.innerWidth,
        height: window.innerHeight
      }
      : scrollContainer.getBoundingClientRect();

    // Check if scrolling is needed
    const isFullyVisibleHorizontally =
      elementRect.left >= containerRect.left &&
      elementRect.right <= containerRect.right;

    const isFullyVisibleVertically =
      elementRect.top >= containerRect.top &&
      elementRect.bottom <= containerRect.bottom;

    const shouldScrollHorizontally = axis === 'x' || axis === 'both';
    const shouldScrollVertically = axis === 'y' || axis === 'both';

    // Calculate scroll positions
    let scrollLeft = scrollContainer.scrollLeft;
    let scrollTop = scrollContainer.scrollTop;

    // Handle horizontal scrolling if needed
    if (shouldScrollHorizontally && (!onlyIfNeeded || !isFullyVisibleHorizontally)) {
      const elementOffsetLeft = isWindowScroll
        ? elementRect.left + window.scrollX
        : element.offsetLeft;

      switch (position) {
        case 'start':
          scrollLeft = elementOffsetLeft - offset;
          break;
        case 'end':
          scrollLeft = elementOffsetLeft + elementRect.width - containerRect.width + offset;
          break;
        case 'center':
        default:
          scrollLeft = elementOffsetLeft - (containerRect.width / 2) + (elementRect.width / 2) + offset;
          break;
      }
    }

    // Handle vertical scrolling if needed
    if (shouldScrollVertically && (!onlyIfNeeded || !isFullyVisibleVertically)) {
      const elementOffsetTop = isWindowScroll
        ? elementRect.top + window.scrollY
        : element.offsetTop;

      switch (position) {
        case 'start':
          scrollTop = elementOffsetTop - offset;
          break;
        case 'end':
          scrollTop = elementOffsetTop + elementRect.height - containerRect.height + offset;
          break;
        case 'center':
        default:
          scrollTop = elementOffsetTop - (containerRect.height / 2) + (elementRect.height / 2) + offset;
          break;
      }
    }

    // Apply scrolling
    if (isWindowScroll) {
      window.scrollTo({
        left: scrollLeft,
        top: scrollTop,
        behavior: smooth ? 'smooth' : 'auto'
      });
    } else {
      if (shouldScrollHorizontally) {
        scrollContainer.scrollLeft = scrollLeft;
      }
      if (shouldScrollVertically) {
        scrollContainer.scrollTop = scrollTop;
      }

      // If the container supports smooth scrolling, use it
      if ('scrollBehavior' in scrollContainer.style) {
        scrollContainer.style.scrollBehavior = smooth ? 'smooth' : 'auto';
      }
    }
  }, []);
};