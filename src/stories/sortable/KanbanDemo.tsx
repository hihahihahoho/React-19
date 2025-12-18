import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  closestCorners,
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  getFirstCollision,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  pointerWithin,
  rectIntersection,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Plus } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import * as ReactDOM from "react-dom"

// Types
type Task = {
  id: string
  title: string
}

type Column = {
  id: string
  title: string
  color: string
  tasks: Task[]
}

// Initial data
const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    color: "border-t-blue-500",
    tasks: [
      { id: "task-1", title: "Design homepage" },
      { id: "task-2", title: "Write API docs" },
      { id: "task-3", title: "Code review" },
    ],
  },
  {
    id: "progress",
    title: "In Progress",
    color: "border-t-yellow-500",
    tasks: [
      { id: "task-4", title: "Implement login" },
      { id: "task-5", title: "Fix bugs" },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "border-t-green-500",
    tasks: [{ id: "task-6", title: "Setup project" }],
  },
]

// Sortable task card
const TaskCard = ({
  task,
  isDragging,
}: {
  task: Task
  isDragging?: boolean
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSorting,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-2 rounded-lg border bg-white p-3 dark:bg-zinc-900",
        isSorting && "opacity-40",
        isDragging && "ring-primary shadow-lg ring-2"
      )}
      {...attributes}
    >
      <button
        className="text-muted-foreground hover:text-foreground cursor-grab touch-none active:cursor-grabbing"
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <span className="flex-1 text-sm font-medium">{task.title}</span>
    </div>
  )
}

// Task overlay for drag preview
const TaskOverlay = ({ task }: { task: Task }) => {
  return (
    <div className="ring-primary flex items-center gap-2 rounded-lg border bg-white p-3 shadow-2xl ring-2 dark:bg-zinc-900">
      <GripVertical className="text-muted-foreground size-4" />
      <span className="text-sm font-medium">{task.title}</span>
    </div>
  )
}

// Column component
const ColumnContainer = ({
  column,
  children,
}: {
  column: Column
  children: React.ReactNode
}) => {
  const { setNodeRef, isOver } = useSortable({
    id: column.id,
    data: { type: "column", column },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "bg-muted/50 flex min-h-[400px] w-80 shrink-0 flex-col rounded-xl border-t-4 p-4",
        column.color,
        isOver && "ring-primary/50 ring-2"
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">{column.title}</h3>
        <span className="text-muted-foreground rounded-full bg-white/50 px-2 py-0.5 text-xs font-medium dark:bg-black/20">
          {column.tasks.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2">{children}</div>
    </div>
  )
}

/**
 * Kanban Board - Full working example with cross-column drag and drop
 */
export const KanbanExample = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const lastOverId = useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewColumn = useRef(false)
  const taskIdCounter = useRef(0)

  // Find task across all columns
  const findTask = useCallback(
    (id: UniqueIdentifier) => {
      for (const column of columns) {
        const task = column.tasks.find((t) => t.id === id)
        if (task) return task
      }
      return null
    },
    [columns]
  )

  // Find column containing the task or the column itself
  const findColumn = useCallback(
    (id: UniqueIdentifier) => {
      // Check if id is a column
      const column = columns.find((c) => c.id === id)
      if (column) return column.id

      // Otherwise check if it's a task
      for (const column of columns) {
        if (column.tasks.some((t) => t.id === id)) {
          return column.id
        }
      }
      return null
    },
    [columns]
  )

  const activeTask = activeId ? findTask(activeId) : null

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Custom collision detection
  const collisionDetection: CollisionDetection = useCallback(
    (args) => {
      const pointerIntersections = pointerWithin(args)
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args)

      let overId = getFirstCollision(intersections, "id")

      if (overId != null) {
        const overColumn = columns.find((c) => c.id === overId)
        if (overColumn && overColumn.tasks.length > 0) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) =>
                container.id !== overId &&
                overColumn.tasks.some((t) => t.id === container.id)
            ),
          })[0]?.id
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      if (recentlyMovedToNewColumn.current) {
        lastOverId.current = activeId
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeId, columns]
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id)
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const overId = over?.id
    if (overId == null || active.id === overId) return

    const overColumnId = findColumn(overId)
    const activeColumnId = findColumn(active.id)

    if (!overColumnId || !activeColumnId) return

    if (activeColumnId !== overColumnId) {
      setColumns((prev) => {
        const activeColumn = prev.find((c) => c.id === activeColumnId)
        const overColumn = prev.find((c) => c.id === overColumnId)

        if (!activeColumn || !overColumn) return prev

        const activeTasks = activeColumn.tasks
        const overTasks = overColumn.tasks

        const activeIndex = activeTasks.findIndex((t) => t.id === active.id)
        const overIndex = overTasks.findIndex((t) => t.id === overId)

        let newIndex: number
        if (overId === overColumnId) {
          newIndex = overTasks.length
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top >
              over.rect.top + over.rect.height

          newIndex =
            overIndex >= 0
              ? overIndex + (isBelowOverItem ? 1 : 0)
              : overTasks.length
        }

        recentlyMovedToNewColumn.current = true
        const taskToMove = activeTasks[activeIndex]

        return prev.map((column) => {
          if (column.id === activeColumnId) {
            return {
              ...column,
              tasks: column.tasks.filter((t) => t.id !== active.id),
            }
          }
          if (column.id === overColumnId) {
            return {
              ...column,
              tasks: [
                ...column.tasks.slice(0, newIndex),
                taskToMove,
                ...column.tasks.slice(newIndex),
              ],
            }
          }
          return column
        })
      })
    }
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeColumnId = findColumn(active.id)

    if (!activeColumnId) {
      setActiveId(null)
      return
    }

    const overId = over?.id
    if (overId == null) {
      setActiveId(null)
      return
    }

    const overColumnId = findColumn(overId)

    if (overColumnId && activeColumnId === overColumnId) {
      const column = columns.find((c) => c.id === activeColumnId)
      if (column) {
        const activeIndex = column.tasks.findIndex((t) => t.id === active.id)
        const overIndex = column.tasks.findIndex((t) => t.id === overId)

        if (activeIndex !== overIndex) {
          setColumns((prev) =>
            prev.map((c) => {
              if (c.id === overColumnId) {
                return {
                  ...c,
                  tasks: arrayMove(c.tasks, activeIndex, overIndex),
                }
              }
              return c
            })
          )
        }
      }
    }

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewColumn.current = false
    })
  }, [columns])

  const handleAddTask = (columnId: string) => {
    taskIdCounter.current += 1
    const newTask: Task = {
      id: `task-new-${taskIdCounter.current}`,
      title: `New Task ${taskIdCounter.current}`,
    }
    setColumns((prev) =>
      prev.map((c) =>
        c.id === columnId ? { ...c, tasks: [...c.tasks, newTask] } : c
      )
    )
  }

  return (
    <div className="w-full max-w-6xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Kanban Board</h3>
        <p className="text-muted-foreground text-sm">
          Drag tasks within columns to reorder, or drag between columns to move
          them. Click the + button to add new tasks.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        measuring={{
          droppable: { strategy: MeasuringStrategy.Always },
        }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <SortableContext
              key={column.id}
              items={column.tasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <ColumnContainer column={column}>
                {column.tasks.length > 0 ? (
                  column.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isDragging={activeId === task.id}
                    />
                  ))
                ) : (
                  <div className="text-muted-foreground/50 flex flex-1 items-center justify-center rounded-lg border-2 border-dashed text-sm">
                    Drop tasks here
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleAddTask(column.id)}
                >
                  <Plus className="mr-1 size-4" />
                  Add Task
                </Button>
              </ColumnContainer>
            </SortableContext>
          ))}
        </div>

        {typeof document !== "undefined" &&
          ReactDOM.createPortal(
            <DragOverlay>
              {activeTask ? <TaskOverlay task={activeTask} /> : null}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </div>
  )
}
