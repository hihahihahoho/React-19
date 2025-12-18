import {
  Container,
  ContainerHandle,
  Containers,
  Item,
  ItemHandle,
  Items,
  type NestedContainer,
  type NestedItem,
  Root,
} from "@/components/ui/sortable-nested"
import { cn } from "@/lib/utils"
import { GripVertical, Move, Package, Palette } from "lucide-react"
import { useState } from "react"
// Types extending the base NestedItem and NestedContainer
interface TaskItem extends NestedItem {
  id: string
  name: string
  color: string
}

interface TaskContainer extends NestedContainer<TaskItem> {
  id: string
  title: string
  items: TaskItem[]
  bgColor: string
  icon: "palette" | "package"
}

// Sample data
const initialContainers: TaskContainer[] = [
  {
    id: "container-1",
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
    id: "container-2",
    title: "Development",
    bgColor: "bg-blue-500/10 border-blue-500/30",
    icon: "package",
    items: [
      { id: "item-4", name: "API Integration", color: "bg-blue-500" },
      { id: "item-5", name: "Database Schema", color: "bg-cyan-500" },
    ],
  },
  {
    id: "container-3",
    title: "Testing",
    bgColor: "bg-green-500/10 border-green-500/30",
    icon: "package",
    items: [
      { id: "item-6", name: "Unit Tests", color: "bg-green-500" },
      { id: "item-7", name: "E2E Tests", color: "bg-emerald-500" },
    ],
  },
  {
    id: "container-4",
    title: "Deployment",
    bgColor: "bg-orange-500/10 border-orange-500/30",
    icon: "package",
    items: [{ id: "item-8", name: "CI/CD Pipeline", color: "bg-orange-500" }],
  },
  {
    id: "container-5",
    title: "Documentation",
    bgColor: "bg-pink-500/10 border-pink-500/30",
    icon: "package",
    items: [
      { id: "item-9", name: "API Docs", color: "bg-pink-500" },
      { id: "item-10", name: "User Guide", color: "bg-rose-500" },
    ],
  },
  {
    id: "container-6",
    title: "Review",
    bgColor: "bg-amber-500/10 border-amber-500/30",
    icon: "package",
    items: [],
  },
]

// Icon component
const ContainerIcon = ({ type }: { type: "palette" | "package" }) => {
  return type === "palette" ? (
    <Palette className="size-4" />
  ) : (
    <Package className="size-4" />
  )
}

/**
 * Nested Grid Demo - Grid with sortable containers AND sortable items.
 * - Containers can be reordered by dragging the Move icon
 * - Items can be sorted within containers using the grip handle
 * - Items can be dragged between containers
 */
export const NestedGridExample = () => {
  const [containers, setContainers] =
    useState<TaskContainer[]>(initialContainers)

  return (
    <div className="w-full max-w-5xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Nested Sortable Grid</h3>
        <p className="text-muted-foreground text-sm">
          <strong>Containers:</strong> Drag the{" "}
          <Move className="mb-0.5 inline size-4" /> icon to reorder grid cells.
          <br />
          <strong>Items:</strong> Drag the{" "}
          <GripVertical className="mb-0.5 inline size-4" /> handle to reorder
          within or move between containers.
        </p>
      </div>

      <Root containers={containers} onContainersChange={setContainers}>
        <Containers className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {containers.map((container) => (
            <Container
              key={container.id}
              containerId={container.id}
              className={cn(
                "flex flex-col rounded-xl border-2 p-3",
                container.bgColor,
                "data-over:ring-primary/50 data-over:ring-2"
              )}
            >
              {/* Container Header */}
              <div className="mb-3 flex items-center gap-2">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg",
                    container.bgColor
                  )}
                >
                  <ContainerIcon type={container.icon} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{container.title}</h3>
                  <p className="text-muted-foreground text-xs">
                    {container.items.length} items
                  </p>
                </div>
                <ContainerHandle className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                  <Move className="size-4" />
                </ContainerHandle>
              </div>

              {/* Items List */}
              <Items
                containerId={container.id}
                items={container.items}
                className="flex min-h-20 flex-1 flex-col gap-2"
              >
                {container.items.length > 0 ? (
                  container.items.map((item) => (
                    <Item
                      key={item.id}
                      itemId={item.id}
                      className="group flex items-center gap-2 rounded-md border bg-white p-2 dark:bg-zinc-900"
                    >
                      <ItemHandle className="text-muted-foreground hover:text-foreground">
                        <GripVertical className="size-4" />
                      </ItemHandle>
                      <div className={cn("size-3 rounded-full", item.color)} />
                      <span className="flex-1 truncate text-sm font-medium">
                        {item.name}
                      </span>
                    </Item>
                  ))
                ) : (
                  <div className="text-muted-foreground/50 flex flex-1 items-center justify-center rounded-lg border-2 border-dashed text-xs">
                    Drop items here
                  </div>
                )}
              </Items>
            </Container>
          ))}
        </Containers>
      </Root>

      <div className="mt-6 rounded-lg border border-dashed p-4">
        <p className="text-muted-foreground text-sm">
          <strong>Features:</strong>
          <br />• <strong>Sortable containers:</strong> Drag the move icon to
          reorder entire grid cells
          <br />• <strong>Sortable items:</strong> Drag items within their
          container
          <br />• <strong>Cross-container:</strong> Drag items between any
          containers
          <br />• <strong>Visual feedback:</strong> Overlay shows the dragged
          element
        </p>
      </div>

      {/* Debug info */}
      <div className="bg-muted/50 mt-4 rounded-lg border p-4">
        <h4 className="mb-2 text-sm font-semibold">
          Container Order: {containers.map((c) => c.title).join(" → ")}
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-3">
          {containers.map((container, index) => (
            <div key={container.id} className="rounded border p-2">
              <div className="font-medium">
                #{index + 1} {container.title}
              </div>
              <div className="text-muted-foreground">
                {container.items.map((item) => item.name).join(", ") || "Empty"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
