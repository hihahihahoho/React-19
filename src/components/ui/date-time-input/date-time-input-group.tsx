import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

interface DateGroupContextValue {
  registerSegment: (seg: HTMLDivElement) => void;
  unregisterSegment: (seg: HTMLDivElement) => void;
  moveFocus: (current: HTMLDivElement, direction: -1 | 1) => void;
  focusFirstEmptySegment: () => void; // New function for smart focusing
}

const DateGroupContext = createContext<DateGroupContextValue | null>(null);
function useDateGroupContext() {
  return useContext(DateGroupContext);
}

// Utility function to check if a string is a number
function isStringNumber(value: string | null) {
  if (!value) return false;
  return /^-?\d+(\.\d+)?$/.test(value);
}

export interface DateGroupProps extends React.ComponentProps<"div"> {
  onFocusWithin?: (event: React.FocusEvent<HTMLDivElement>) => void;
  onBlurWithin?: (event: React.FocusEvent<HTMLDivElement>) => void;
}

/**
 * Wrap multiple <DateTimeInput> components in <DateGroup> if you want arrow-key
 * navigation to cross from one date input to another.
 * Also supports onFocusWithin / onBlurWithin.
 */
function DateGroup({
  children,
  onFocusWithin,
  onBlurWithin,
  ...props
}: DateGroupProps) {
  // We'll store references to all segments here.
  const segmentRefs = useRef<HTMLDivElement[]>([]);

  // Track whether the group currently has focus (focus is within a child).
  const [isFocusWithin, setIsFocusWithin] = useState(false);

  // Called by each <DateSegment> on mount to register itself.
  const registerSegment = useCallback((seg: HTMLDivElement) => {
    segmentRefs.current.push(seg);
  }, []);

  // Called by each <DateSegment> on unmount to remove itself.
  const unregisterSegment = useCallback((seg: HTMLDivElement) => {
    segmentRefs.current = segmentRefs.current.filter((el) => el !== seg);
  }, []);

  // Move focus to next/previous segment in actual DOM order.
  const moveFocus = useCallback(
    (current: HTMLDivElement, direction: -1 | 1) => {
      // Filter out anything no longer in the DOM:
      const validRefs = segmentRefs.current.filter((el) =>
        document.contains(el)
      );

      // Sort by DOM order:
      validRefs.sort((a, b) => {
        const pos = a.compareDocumentPosition(b);
        if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
      });

      const currentIndex = validRefs.indexOf(current);
      if (currentIndex === -1) return;

      const targetIndex = currentIndex + direction;
      if (targetIndex >= 0 && targetIndex < validRefs.length) {
        validRefs[targetIndex].focus();
      }
    },
    []
  );

  // Focus the first empty (or first) segment - moved from DateTimeInput
  const focusFirstEmptySegment = useCallback(() => {
    // Filter out anything no longer in the DOM
    const validRefs = segmentRefs.current.filter((el) => document.contains(el));

    // Sort by DOM order
    validRefs.sort((a, b) => {
      const pos = a.compareDocumentPosition(b);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });

    if (validRefs.length === 0) return;

    // Try to find first empty segment
    let firstEmptySegment: HTMLDivElement | null = null;
    for (let i = 0; i < validRefs.length; i++) {
      const segment = validRefs[i];
      if (!isStringNumber(segment.textContent)) {
        firstEmptySegment = segment;
        break;
      }
    }

    // Focus first empty or last segment
    if (firstEmptySegment) {
      firstEmptySegment.focus();
    } else {
      validRefs[validRefs.length - 1].focus();
    }
  }, []);

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    // If we previously did NOT have focus, that means focus just entered.
    if (!isFocusWithin) {
      setIsFocusWithin(true);
      onFocusWithin?.(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // If focus is leaving the container entirely, call onBlurWithin.
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setIsFocusWithin(false);
      onBlurWithin?.(e);
    }
  };

  const contextValue: DateGroupContextValue = {
    registerSegment,
    unregisterSegment,
    moveFocus,
    focusFirstEmptySegment,
  };

  return (
    <DateGroupContext.Provider value={contextValue}>
      <div
        data-slot="date-group"
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={-1}
        {...props}
      >
        {children}
      </div>
    </DateGroupContext.Provider>
  );
}

export { DateGroup, useDateGroupContext };
