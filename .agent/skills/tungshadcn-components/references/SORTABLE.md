# Sortable (Drag & Drop)

TungShadcn provides an extremely powerful drag-and-drop system built on top of `@dnd-kit`. It supports both single lists and multi-container reordering.

---

## Architecture

The system uses a highly flexible compound component pattern:

```
Sortable (Root detection - single or multi mode)
  └── SortableContent (Droppable context)
        └── SortableItem (Draggable wrapper)
              ├── SortableItemHandle? (Optional handle)
              └── Your content...
```

---

## Single Container List

```tsx
import {
  Sortable,
  SortableContent,
  SortableItem,
} from "@/components/ui/sortable"

function MySortableList() {
  const [items, setItems] = useState([
    { id: "1", name: "A" },
    { id: "2", name: "B" },
  ])

  return (
    <Sortable
      value={items}
      onValueChange={setItems}
      getItemValue={(item) => item.id}
    >
      <SortableContent className="space-y-2">
        {items.map((item) => (
          <SortableItem key={item.id} value={item.id}>
            <div className="rounded border p-4">{item.name}</div>
          </SortableItem>
        ))}
      </SortableContent>
    </Sortable>
  )
}
```

---

## Multi-Container (Kanban/Groups)

The system automatically switches to Multi-Mode if the items follow the `SortableGroupData` structure (an object with an `items` array).

```tsx
const groups = [
  { id: "todo", items: [{ id: "1", task: "T1" }] },
  { id: "done", items: [{ id: "2", task: "T2" }] }
]

<Sortable value={groups} onValueChange={setGroups}>
  {groups.map(group => (
    <SortableGroup key={group.id} value={group.id}>
      <SortableContent>
         {group.items.map(item => (
           <SortableItem key={item.id} value={item.id}>...</SortableItem>
         ))}
      </SortableContent>
    </SortableGroup>
  ))}
</Sortable>
```

---

## Handles & Overlays

### 1. Drag Handles

If you don't want the entire item to be draggable, use a handle:

```tsx
<SortableItem value={id}>
  <div className="flex items-center gap-2">
    <SortableItemHandle>
      <GripVerticalIcon />
    </SortableItemHandle>
    <span>Drag me here</span>
  </div>
</SortableItem>
```

### 2. Custom Overlays

To control how the floating "ghost" item looks while dragging:

```tsx
<SortableOverlay>
  {(activeId) => (
    <div className="bg-primary p-4 text-white">Dragging: {activeId}</div>
  )}
</SortableOverlay>
```

---

## Props & Options

- **`orientation`**: `vertical` (default), `horizontal`, or `mixed` (grid).
- **`flatCursor`**: Set to `true` to disable the "grabbing" cursor.
- **`modifiers`**: dnd-kit modifiers like `restrictToParentElement`.
- **`collisionDetection`**: `closestCenter` (default), `closestCorners`, etc.

---

## Do/Don't

- **Do** provide a stable `id` for every item. Using array index as an ID will break ordering.
- **Do** use `SortableItemHandle` for complex items that contain interactive elements (buttons, inputs).
- **Don't** try to wrap `SortableItem` around components that don't accept a `ref` or forward props.
- **Don't** forget `getItemValue` in single mode if your items are objects.
