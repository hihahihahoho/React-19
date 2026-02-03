# Layout Components

Advanced layout utilities for scrolling and responsive item groups.

---

## Overflow Group

A powerful component that manages a group of items and automatically handles overflow by hiding excess items and showing an indicator (e.g., "+3").

### Features

- **Auto-calculation**: Uses `ResizeObserver` to detect available width.
- **Dynamic Indicator**: Customizable overflow counter.
- **Hidden Item Access**: Provides access to hidden items via a render prop (perfect for dropdowns).

### Usage

```tsx
import {
  OverflowGroup,
  OverflowGroupItem,
  OverflowGroupIndicator,
  OverflowGroupHiddenItems,
} from "@/components/ui/overflow-group"

function TagsList({ tags }) {
  return (
    <OverflowGroup items={tags}>
      {tags.map((tag, i) => (
        <OverflowGroupItem key={tag} index={i}>
          <Badge>{tag}</Badge>
        </OverflowGroupItem>
      ))}

      <OverflowGroupIndicator className="text-xs font-bold" />

      {/* Optional: Show hidden items in a popover */}
      <OverflowGroupHiddenItems>
        {(hidden) => (
          <ResponsivePopover trigger={<Button>View All</Button>}>
            {hidden.map((t) => (
              <div key={t}>{t}</div>
            ))}
          </ResponsivePopover>
        )}
      </OverflowGroupHiddenItems>
    </OverflowGroup>
  )
}
```

---

## Scroll Area

Custom scrollbar component with enhanced styling and scroll position tracking.

```tsx
import { ScrollArea } from "@/components/ui/scroll-area"

;<ScrollArea className="h-72 w-48 rounded-md border">
  <div className="p-4">{/* Large content... */}</div>
</ScrollArea>
```

### Scroll Position Hooks

Combine with `useScrollPosition` to detect scroll direction or reached-bottom state.

---

## Do/Don't

- **Do** use `OverflowGroup` for tag lists, breadcrumbs, or toolbar buttons that must fit in one line.
- **Do** provide the `items` array to `OverflowGroup` root so it can track indices correctly.
- **Don't** use `ScrollArea` if native scrolling is sufficient and no custom styling is needed.
- **Don't** forget to set a fixed height or `max-height` on the `ScrollArea` container.
