import React from "react"

/**
 * Custom hook to determine if a referenced element has display: none
 * @param ref - The ref of the DOM element to observe
 * @returns - True if the element's display is 'none', false otherwise
 */
function useIsDisplayNone<T extends HTMLElement>(
  ref: React.RefObject<T | null>
): boolean {
  const [isDisplayNone, setIsDisplayNone] = React.useState<boolean>(false)

  React.useEffect(() => {
    const currentElement = ref.current
    console.log(currentElement)
    if (!currentElement) {
      return
    }

    // Function to check the current display style
    const checkDisplay = () => {
      if (ref.current) {
        const display = window.getComputedStyle(ref.current).display
        setIsDisplayNone(display === "none")
      }
    }

    // Initial check
    checkDisplay()

    // Create a MutationObserver to watch for attribute changes
    const observer = new MutationObserver(checkDisplay)
    observer.observe(currentElement, {
      attributes: true,
      attributeFilter: ["style", "class"], // Watch for style and class changes
    })

    // Optional: Create a ResizeObserver if size changes might affect display
    const resizeObserver = new ResizeObserver(() => {
      checkDisplay()
    })
    resizeObserver.observe(currentElement)

    // Cleanup observers on unmount
    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
    }
  }, [ref])

  return isDisplayNone
}

export default useIsDisplayNone
