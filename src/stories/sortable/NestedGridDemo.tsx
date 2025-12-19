import {
  Sortable,
  SortableContent,
  SortableGroup,
  SortableGroupContent,
  SortableGroupHandle,
  SortableItem,
  SortableItemHandle,
  type SortableGroupData,
  type SortableGroupItem,
} from "@/components/ui/sortable"
import { cn } from "@/lib/utils"
import { GripVertical, Move, Package, Palette } from "lucide-react"
import { useState } from "react"

// Types extending the base types
interface TaskItem extends SortableGroupItem {
  id: string
  name: string
  color: string
}

interface TaskGroup extends SortableGroupData<TaskItem> {
  id: string
  title: string
  items: TaskItem[]
  bgColor: string
  icon: "palette" | "package"
}

// Sample data
const initialGroups: TaskGroup[] = [
  {
    id: "group-1",
    title: "Design Tasks",
    bgColor: "bg-purple-500/10 border-purple-500/30",
    icon: "palette",
    items: [
      { id: "item-1", name: "UI Components", color: "bg-purple-500" },
      { id: "item-2", name: "Color Palette", color: "bg-violet-500" },
      { id: "item-3", name: "Typography", color: "bg-fuchsia-500" },
    ],
  },
  {
    id: "group-2",
    title: "Development",
    bgColor: "bg-blue-500/10 border-blue-500/30",
    icon: "package",
    items: [
      { id: "item-4", name: "API Integration", color: "bg-blue-500" },
      { id: "item-5", name: "Database Schema", color: "bg-cyan-500" },
    ],
  },
  {
    id: "group-3",
    title: "Testing",
    bgColor: "bg-green-500/10 border-green-500/30",
    icon: "package",
    items: [
      { id: "item-6", name: "Unit Tests", color: "bg-green-500" },
      { id: "item-7", name: "E2E Tests", color: "bg-emerald-500" },
    ],
  },
  {
    id: "group-4",
    title: "Deployment",
    bgColor: "bg-orange-500/10 border-orange-500/30",
    icon: "package",
    items: [{ id: "item-8", name: "CI/CD Pipeline", color: "bg-orange-500" }],
  },
  {
    id: "group-5",
    title: "Documentation",
    bgColor: "bg-pink-500/10 border-pink-500/30",
    icon: "package",
    items: [
      { id: "item-9", name: "API Docs", color: "bg-pink-500" },
      { id: "item-10", name: "User Guide", color: "bg-rose-500" },
    ],
  },
  {
    id: "group-6",
    title: "Review",
    bgColor: "bg-amber-500/10 border-amber-500/30",
    icon: "package",
    items: [],
  },
]

// Icon component
const GroupIcon = ({ type }: { type: "palette" | "package" }) => {
  return type === "palette" ? (
    <Palette className="size-4" />
  ) : (
    <Package className="size-4" />
  )
}

/**
 * Nested Grid Demo - Using UNIFIED Sortable component with multi-container mode
 * - Groups can be reordered by dragging the Move icon
 * - Items can be sorted within groups using the grip handle
 * - Items can be dragged between groups
 */
export const NestedGridExample = () => {
  const [groups, setGroups] = useState<TaskGroup[]>(initialGroups)

  return (
    <div className="w-full max-w-5xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Unified Sortable - Multi Mode</h3>
        <p className="text-muted-foreground text-sm">
          <strong>Groups:</strong> Drag the{" "}
          <Move className="mb-0.5 inline size-4" /> icon to reorder grid cells.
          <br />
          <strong>Items:</strong> Drag the{" "}
          <GripVertical className="mb-0.5 inline size-4" /> handle to reorder
          within or move between groups.
        </p>
      </div>

      {/* Multi-container mode: use value/onValueChange props */}
      <Sortable value={groups} onValueChange={setGroups}>
        <SortableGroupContent className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {groups.map((group) => (
            <SortableGroup
              key={group.id}
              value={group.id}
              className={cn(
                "flex flex-col rounded-xl border-2 p-3",
                group.bgColor,
                "data-over:ring-primary/50 data-over:ring-2"
              )}
            >
              {/* Group Header */}
              <div className="mb-3 flex items-center gap-2">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg",
                    group.bgColor
                  )}
                >
                  <GroupIcon type={group.icon} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{group.title}</h3>
                  <p className="text-muted-foreground text-xs">
                    {group.items.length} items
                  </p>
                </div>
                <SortableGroupHandle className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                  <Move className="size-4" />
                </SortableGroupHandle>
              </div>

              {/* Items List - SortableContent works inside SortableGroup */}
              <SortableContent
                items={group.items.map((item) => item.id)}
                className="flex min-h-20 flex-1 flex-col gap-2"
              >
                {group.items.length > 0 ? (
                  group.items.map((item) => (
                    <SortableItem
                      key={item.id}
                      value={item.id}
                      className="group flex items-center gap-2 rounded-md border bg-white p-2 dark:bg-zinc-900"
                    >
                      <SortableItemHandle className="text-muted-foreground hover:text-foreground">
                        <GripVertical className="size-4" />
                      </SortableItemHandle>
                      <div className={cn("size-3 rounded-full", item.color)} />
                      <span className="flex-1 truncate text-sm font-medium">
                        {item.name}
                      </span>
                    </SortableItem>
                  ))
                ) : (
                  <div className="text-muted-foreground/50 flex flex-1 items-center justify-center rounded-lg border-2 border-dashed text-xs">
                    Drop items here
                  </div>
                )}
              </SortableContent>
            </SortableGroup>
          ))}
        </SortableGroupContent>
      </Sortable>

      <div className="mt-6 rounded-lg border border-dashed p-4">
        <p className="text-muted-foreground text-sm">
          <strong>🎉 Using Unified Sortable Component!</strong>
          <br />• Same <code>SortableItem</code> &{" "}
          <code>SortableItemHandle</code> for both modes
          <br />• <code>SortableGroup</code> + <code>SortableGroupHandle</code>{" "}
          for multi-container
          <br />• Cross-group drag using <code>onGroupsChange</code>
        </p>
      </div>

      {/* Debug info */}
      <div className="bg-muted/50 mt-4 rounded-lg border p-4">
        <h4 className="mb-2 text-sm font-semibold">
          Group Order: {groups.map((g) => g.title).join(" → ")}
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-3">
          {groups.map((group, index) => (
            <div key={group.id} className="rounded border p-2">
              <div className="font-medium">
                #{index + 1} {group.title}
              </div>
              <div className="text-muted-foreground">
                {group.items.map((item) => item.name).join(", ") || "Empty"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
