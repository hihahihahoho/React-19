# Common Hooks

TungShadcn includes several utility hooks for responsive design, DOM interaction, and state management.

---

## Responsive Hooks

### 1. `useMediaQuery`

Detects if a media query matches.

```tsx
import { useMediaQuery } from "@/hooks/use-media-query"

const isDesktop = useMediaQuery("(min-width: 768px)")
```

### 2. `useMobile`

Shortcut for mobile breakpoint detection (default 768px).

```tsx
import { useMobile } from "@/hooks/use-mobile"

const isMobile = useMobile()
```

---

## DOM Hooks

### 1. `useResizeObserver`

Observes element dimension changes.

```tsx
import { useResizeObserver } from "@/hooks/use-resize-observer"

useResizeObserver({
  ref: elementRef,
  onResize: (entry) => console.log(entry.contentRect),
})
```

### 2. `useScrollPosition`

Tracks scroll coordinates.

```tsx
import { useScrollPosition } from "@/hooks/use-scroll-position"

const { x, y } = useScrollPosition(containerRef)
```

---

## State & Lifecycle

### 1. `useIsMounted`

Checks if the component is currently mounted to prevent state updates on unmounted components.

```tsx
import { useIsMounted } from "@/hooks/use-is-mounted"

const isMounted = useIsMounted()
if (isMounted.current) { ... }
```

### 2. `useHistoryState`

Manage state with undo/redo capabilities.

```tsx
import { useHistoryState } from "@/hooks/use-history-state"

const { state, set, undo, redo, canUndo, canRedo } =
  useHistoryState(initialValue)
```

---

## Do/Don't

- **Do** use `useMobile` for high-level layout switches (e.g., Sidebar vs Drawer).
- **Do** use `useIsMounted` when dealing with async fetching in standard `useEffect` (though React Query is preferred).
- **Don't** over-use `useResizeObserver`; it can be heavy if many elements are observed simultaneously.
- **Don't** assume `useMediaQuery` works during SSR; it will return `false` initially.
