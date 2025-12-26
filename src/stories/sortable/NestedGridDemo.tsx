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
// Initial data generation
function generateData(groupCount: number, itemsPerGroup: number): TaskGroup[] {
  const groups: TaskGroup[] = []
  const icons: ("palette" | "package")[] = ["palette", "package"]
  const bgColors = [
    "bg-purple-500/10 border-purple-500/30",
    "bg-blue-500/10 border-blue-500/30",
    "bg-green-500/10 border-green-500/30",
    "bg-yellow-500/10 border-yellow-500/30",
    "bg-red-500/10 border-red-500/30",
    "bg-pink-500/10 border-pink-500/30",
    "bg-indigo-500/10 border-indigo-500/30",
    "bg-orange-500/10 border-orange-500/30",
  ]
  const colors = [
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
  ]

  let itemIdCounter = 1

  for (let i = 0; i < groupCount; i++) {
    const items: TaskItem[] = []
    for (let j = 0; j < itemsPerGroup; j++) {
      items.push({
        id: `item-${itemIdCounter}`,
        name: `Task Item ${itemIdCounter}`,
        color: colors[i % colors.length],
      })
      itemIdCounter++
    }

    groups.push({
      id: `group-${i + 1}`,
      title: `Group ${i + 1}`,
      bgColor: bgColors[i % bgColors.length],
      icon: icons[i % icons.length],
      items,
    })
  }

  return groups
}

// Generate ~400 items (20 groups * 20 items)
const initialGroups: TaskGroup[] = generateData(20, 20)

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
