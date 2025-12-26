import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form/form"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { GripVertical, Move, Package, Palette } from "lucide-react"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

// Types
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

// Change types for tracking
interface ItemChange {
  type: "item_moved"
  itemId: string
  itemName: string
  fromGroup: string
  toGroup: string
  fromIndex: number
  toIndex: number
  timestamp: Date
}

interface GroupChange {
  type: "group_reordered"
  groupId: string
  groupTitle: string
  fromIndex: number
  toIndex: number
  timestamp: Date
}

type Change = ItemChange | GroupChange

// Schema
const taskItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
})

const taskGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  items: z.array(taskItemSchema),
  bgColor: z.string(),
  icon: z.enum(["palette", "package"]),
})

const formSchema = z.object({
  groups: z.array(taskGroupSchema),
})

type FormValues = z.infer<typeof formSchema>

// Initial data
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
const defaultGroups: TaskGroup[] = generateData(20, 20)

// Icon component
const GroupIcon = ({ type }: { type: "palette" | "package" }) => {
  return type === "palette" ? (
    <Palette className="size-4" />
  ) : (
    <Package className="size-4" />
  )
}

// Helper to detect changes between old and new groups
function detectChanges(
  oldGroups: TaskGroup[],
  newGroups: TaskGroup[]
): Change[] {
  const changes: Change[] = []
  const now = new Date()

  // Build item location maps
  const oldItemLocations = new Map<
    string,
    { groupId: string; groupTitle: string; index: number }
  >()
  const newItemLocations = new Map<
    string,
    { groupId: string; groupTitle: string; index: number }
  >()

  oldGroups.forEach((group) => {
    group.items.forEach((item, index) => {
      oldItemLocations.set(item.id, {
        groupId: group.id,
        groupTitle: group.title,
        index,
      })
    })
  })

  newGroups.forEach((group) => {
    group.items.forEach((item, index) => {
      newItemLocations.set(item.id, {
        groupId: group.id,
        groupTitle: group.title,
        index,
      })
    })
  })

  // Detect item moves
  newItemLocations.forEach((newLoc, itemId) => {
    const oldLoc = oldItemLocations.get(itemId)
    if (oldLoc) {
      if (oldLoc.groupId !== newLoc.groupId || oldLoc.index !== newLoc.index) {
        const item = newGroups
          .flatMap((g) => g.items)
          .find((i) => i.id === itemId)
        if (item) {
          changes.push({
            type: "item_moved",
            itemId,
            itemName: item.name,
            fromGroup: oldLoc.groupTitle,
            toGroup: newLoc.groupTitle,
            fromIndex: oldLoc.index,
            toIndex: newLoc.index,
            timestamp: now,
          })
        }
      }
    }
  })

  // Detect group reorders (only if no item changes - pure reorder)
  if (changes.length === 0) {
    const oldGroupOrder = oldGroups.map((g) => g.id)
    const newGroupOrder = newGroups.map((g) => g.id)

    newGroupOrder.forEach((groupId, newIndex) => {
      const oldIndex = oldGroupOrder.indexOf(groupId)
      if (oldIndex !== -1 && oldIndex !== newIndex) {
        const group = newGroups.find((g) => g.id === groupId)
        if (group) {
          changes.push({
            type: "group_reordered",
            groupId,
            groupTitle: group.title,
            fromIndex: oldIndex,
            toIndex: newIndex,
            timestamp: now,
          })
        }
      }
    })
  }

  return changes
}

/**
 * Nested Grid with Change Detection
 * Detects exactly which item/group changed for efficient API updates
 */
export const NestedGridFormExample = () => {
  const [changeLog, setChangeLog] = React.useState<Change[]>([])
  const prevGroupsRef = React.useRef<TaskGroup[]>(defaultGroups)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groups: defaultGroups,
    },
  })

  // Handle value change with change detection
  const handleValueChange = React.useCallback(
    (newGroups: TaskGroup[]) => {
      const changes = detectChanges(prevGroupsRef.current, newGroups)

      if (changes.length > 0) {
        setChangeLog((prev) => [...changes, ...prev].slice(0, 10))

        // Show toast for each change
        changes.forEach((change) => {
          if (change.type === "item_moved") {
            if (change.fromGroup === change.toGroup) {
              toast.info(`Item reordered`, {
                description: `"${change.itemName}" moved from position ${change.fromIndex + 1} to ${change.toIndex + 1} in ${change.fromGroup}`,
              })
            } else {
              toast.info(`Item moved`, {
                description: `"${change.itemName}" moved from ${change.fromGroup} to ${change.toGroup}`,
              })
            }
          } else {
            toast.info(`Group reordered`, {
              description: `"${change.groupTitle}" moved from position ${change.fromIndex + 1} to ${change.toIndex + 1}`,
            })
          }
        })
      }

      prevGroupsRef.current = newGroups
      form.setValue("groups", newGroups)
    },
    [form]
  )

  const onSubmit = (_data: FormValues) => {
    toast.success("Changes saved!", {
      description: `${changeLog.length} changes would be sent to API`,
    })
  }

  const clearLog = () => {
    setChangeLog([])
    toast.success("Change log cleared")
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">
          Nested Grid + Change Detection
        </h3>
        <p className="text-muted-foreground text-sm">
          Detects exactly which item/group changed. Perfect for efficient API
          updates (only update what changed).
        </p>
      </div>

      {/* Sortable Grid */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="groups"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Groups</FormLabel>
                <FormDescription>
                  Drag items between groups or reorder groups. Changes are
                  tracked below.
                </FormDescription>
                <FormControl>
                  <Sortable
                    value={field.value}
                    onValueChange={handleValueChange}
                  >
                    <SortableGroupContent className="grid grid-cols-3 gap-3">
                      {field.value.map((group: TaskGroup) => (
                        <SortableGroup
                          key={group.id}
                          value={group.id}
                          className={cn(
                            "flex flex-col rounded-xl border-2 p-3",
                            group.bgColor
                          )}
                        >
                          {/* Group Header */}
                          <div className="mb-2 flex items-center gap-2">
                            <div
                              className={cn(
                                "flex size-7 items-center justify-center rounded-lg",
                                group.bgColor
                              )}
                            >
                              <GroupIcon type={group.icon} />
                            </div>
                            <span className="flex-1 text-sm font-semibold">
                              {group.title}
                            </span>
                            <SortableGroupHandle className="text-muted-foreground hover:text-foreground rounded p-1">
                              <Move className="size-4" />
                            </SortableGroupHandle>
                          </div>

                          {/* Items */}
                          <SortableContent
                            items={group.items.map((item: TaskItem) => item.id)}
                            className="flex min-h-16 flex-1 flex-col gap-1.5"
                          >
                            {group.items.length > 0 ? (
                              group.items.map((item: TaskItem) => (
                                <SortableItem
                                  key={item.id}
                                  value={item.id}
                                  className="flex items-center gap-2 rounded-md border bg-white p-2 text-sm dark:bg-zinc-900"
                                >
                                  <SortableItemHandle className="text-muted-foreground">
                                    <GripVertical className="size-3.5" />
                                  </SortableItemHandle>
                                  <div
                                    className={cn(
                                      "size-2.5 rounded-full",
                                      item.color
                                    )}
                                  />
                                  <span className="truncate text-xs font-medium">
                                    {item.name}
                                  </span>
                                </SortableItem>
                              ))
                            ) : (
                              <div className="text-muted-foreground/50 flex flex-1 items-center justify-center rounded border-2 border-dashed text-xs">
                                Empty
                              </div>
                            )}
                          </SortableContent>
                        </SortableGroup>
                      ))}
                    </SortableGroupContent>
                  </Sortable>
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Save Changes ({changeLog.length} pending)
          </Button>
        </form>
      </Form>

      {/* Change Log - Fixed at bottom */}
      <div className="mt-6 rounded-lg border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold">
            Change Log ({changeLog.length})
          </h4>
          <Button variant="ghost" size="sm" onClick={clearLog}>
            Clear
          </Button>
        </div>

        {changeLog.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-xs">
            Drag items or groups to see changes
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {changeLog.map((change, i) => (
              <div
                key={i}
                className="rounded-md border bg-white p-2 text-xs dark:bg-zinc-900"
              >
                {change.type === "item_moved" ? (
                  <>
                    <div className="font-semibold text-blue-600">
                      Item Moved
                    </div>
                    <div className="text-muted-foreground mt-1">
                      <strong>{change.itemName}</strong>
                      {change.fromGroup === change.toGroup ? (
                        <>
                          {" "}
                          pos {change.fromIndex + 1} → {change.toIndex + 1}
                        </>
                      ) : (
                        <>
                          {" "}
                          {change.fromGroup} → {change.toGroup}
                        </>
                      )}
                    </div>
                    <code className="mt-1 block rounded bg-slate-100 p-1 text-[10px] dark:bg-slate-800">
                      {`PATCH /items/${change.itemId}`}
                    </code>
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-green-600">
                      Group Reordered
                    </div>
                    <div className="text-muted-foreground mt-1">
                      <strong>{change.groupTitle}</strong> pos{" "}
                      {change.fromIndex + 1} → {change.toIndex + 1}
                    </div>
                    <code className="mt-1 block rounded bg-slate-100 p-1 text-[10px] dark:bg-slate-800">
                      {`PATCH /groups/${change.groupId}`}
                    </code>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
