import { Button } from "@/components/ui/button"
import {
  Content,
  Item,
  ItemHandle,
  Overlay,
  Root,
} from "@/components/ui/sortable"
import { cn } from "@/lib/utils"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { GripVertical, Image, Music, Plus, Video, X } from "lucide-react"
import { useState } from "react"

/**
 * Sortable component provides drag-and-drop reordering functionality.
 * Built on @dnd-kit for smooth, accessible interactions.
 */
const meta = {
  title: "Interaction/Sortable",
  component: Root,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/sortable.json
\`\`\`
### Credit to https://www.diceui.com/docs/components/sortable

The Sortable component provides a flexible, accessible drag-and-drop interface for reordering items.
It's built on top of @dnd-kit and provides a simpler API through composable primitives.

## When to use
- To allow users to manually reorder lists, grids, or collections
- For building kanban boards, task lists, or priority queues
- When implementing custom ordering or arrangement interfaces
- For drag-and-drop file uploads or media galleries

## Features
- **Flexible layouts**: Supports vertical, horizontal, and mixed orientations
- **Accessible**: Built-in keyboard navigation and screen reader support
- **Visual feedback**: Smooth animations and drag overlays
- **Customizable**: Full control over styling and behavior
- **Type-safe**: Complete TypeScript support with generics
- **Composable**: Build complex interactions with simple primitives

## Components
- **Root**: Provides drag-and-drop context and handles reordering logic
- **Content**: Defines the sortable container (list, grid, etc.)
- **Item**: Individual draggable/sortable item
- **ItemHandle**: Dedicated drag handle for items
- **Overlay**: Visual feedback during dragging

## Accessibility
- Keyboard navigation with arrow keys for reordering
- Screen reader announcements for drag operations
- Focus management during drag interactions
- ARIA attributes for proper semantic meaning
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex w-full items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

/**
 * Basic vertical list with drag handles.
 */
const BasicVerticalExample = () => {
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3", "Item 4"])

  return (
    <div className="w-full max-w-md">
      <Root value={items} onValueChange={setItems} orientation="vertical">
        <Content className="space-y-2">
          {items.map((item) => (
            <Item
              key={item}
              value={item}
              className="bg-card flex items-center gap-3 rounded-lg border p-4"
            >
              <ItemHandle className="text-muted-foreground hover:text-foreground">
                <GripVertical className="size-5" />
              </ItemHandle>
              <span className="font-medium">{item}</span>
            </Item>
          ))}
        </Content>
        <Overlay>
          {({ value }) => (
            <div className="bg-card flex items-center gap-3 rounded-lg border p-4 shadow-lg">
              <GripVertical className="text-muted-foreground size-5" />
              <span className="font-medium">{value}</span>
            </div>
          )}
        </Overlay>
      </Root>
    </div>
  )
}

export const BasicVertical: Story = {
  render: () => <BasicVerticalExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A basic vertical list with drag handles. Click and drag the grip icon to reorder items.",
      },
    },
  },
}

/**
 * Horizontal list of cards.
 */
const HorizontalCardsExample = () => {
  const [items, setItems] = useState([
    { id: "1", emoji: "🎨", title: "Design", color: "bg-purple-500/10" },
    { id: "2", emoji: "💻", title: "Development", color: "bg-blue-500/10" },
    { id: "3", emoji: "🧪", title: "Testing", color: "bg-green-500/10" },
    { id: "4", emoji: "🚀", title: "Deploy", color: "bg-orange-500/10" },
  ])

  return (
    <div className="w-full max-w-4xl">
      <Root
        value={items}
        onValueChange={setItems}
        orientation="horizontal"
        getItemValue={(item) => item.id}
      >
        <Content className="flex gap-4">
          {items.map((item) => (
            <Item
              key={item.id}
              value={item.id}
              asHandle
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border p-6 text-center",
                "min-w-[140px]",
                item.color
              )}
            >
              <span className="mb-2 text-4xl">{item.emoji}</span>
              <span className="font-medium">{item.title}</span>
            </Item>
          ))}
        </Content>
        <Overlay>
          {({ value }) => {
            const item = items.find((i) => i.id === value)
            if (!item) return null
            return (
              <div
                className={cn(
                  "flex min-w-[140px] flex-col items-center justify-center rounded-lg border p-6 text-center shadow-lg",
                  item.color
                )}
              >
                <span className="mb-2 text-4xl">{item.emoji}</span>
                <span className="font-medium">{item.title}</span>
              </div>
            )
          }}
        </Overlay>
      </Root>
    </div>
  )
}

export const HorizontalCards: Story = {
  render: () => <HorizontalCardsExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A horizontal list of cards. Each card acts as its own drag handle (asHandle prop). Drag cards left or right to reorder.",
      },
    },
  },
}

/**
 * Grid layout with mixed orientation.
 */
const GridExample = () => {
  const [items, setItems] = useState([
    { id: "1", type: "image", name: "Photo 1.jpg" },
    { id: "2", type: "video", name: "Video 1.mp4" },
    { id: "3", type: "audio", name: "Song 1.mp3" },
    { id: "4", type: "image", name: "Photo 2.jpg" },
    { id: "5", type: "video", name: "Video 2.mp4" },
    { id: "6", type: "audio", name: "Song 2.mp3" },
  ])

  const getIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="size-6" />
      case "video":
        return <Video className="size-6" />
      case "audio":
        return <Music className="size-6" />
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <Root
        value={items}
        onValueChange={setItems}
        orientation="mixed"
        getItemValue={(item) => item.id}
      >
        <Content className="grid grid-cols-3 gap-4">
          {items.map((item) => (
            <Item
              key={item.id}
              value={item.id}
              className="group bg-card relative flex aspect-square flex-col items-center justify-center rounded-lg border p-4 text-center"
            >
              <ItemHandle className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                <GripVertical className="size-4" />
              </ItemHandle>
              <div className="text-muted-foreground mb-2">
                {getIcon(item.type)}
              </div>
              <span className="text-sm font-medium">{item.name}</span>
            </Item>
          ))}
        </Content>
        <Overlay>
          {({ value }) => {
            const item = items.find((i) => i.id === value)
            if (!item) return null
            return (
              <div className="bg-card flex aspect-square flex-col items-center justify-center rounded-lg border p-4 text-center shadow-lg">
                <div className="text-muted-foreground mb-2">
                  {getIcon(item.type)}
                </div>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            )
          }}
        </Overlay>
      </Root>
    </div>
  )
}

export const Grid: Story = {
  render: () => <GridExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A grid layout with mixed orientation (supports both horizontal and vertical dragging). Hover over items to reveal the drag handle.",
      },
    },
  },
}

/**
 * Todo list with delete buttons.
 */
type TodoItem = {
  id: string
  text: string
  completed: boolean
}

const TodoListExample = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: "1", text: "Review pull requests", completed: true },
    { id: "2", text: "Update documentation", completed: false },
    { id: "3", text: "Fix authentication bug", completed: false },
    { id: "4", text: "Deploy to staging", completed: false },
  ])
  const [newTodo, setNewTodo] = useState("")

  const handleAddTodo = () => {
    if (!newTodo.trim()) return
    setTodos([
      ...todos,
      {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
      },
    ])
    setNewTodo("")
  }

  const handleToggle = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const handleDelete = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
          placeholder="Add a new todo..."
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 flex-1 rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
        />
        <Button onClick={handleAddTodo} size="sm">
          <Plus className="mr-1 size-4" />
          Add
        </Button>
      </div>

      <Root
        value={todos}
        onValueChange={setTodos}
        orientation="vertical"
        getItemValue={(item) => item.id}
      >
        <Content className="space-y-2">
          {todos.map((todo) => (
            <Item
              key={todo.id}
              value={todo.id}
              className="bg-card flex items-center gap-3 rounded-lg border p-3"
            >
              <ItemHandle className="text-muted-foreground hover:text-foreground">
                <GripVertical className="size-4" />
              </ItemHandle>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id)}
                className="accent-primary size-4 cursor-pointer"
              />
              <span
                className={cn(
                  "flex-1",
                  todo.completed && "text-muted-foreground line-through"
                )}
              >
                {todo.text}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive size-8 p-0"
                onClick={() => handleDelete(todo.id)}
              >
                <X className="size-4" />
              </Button>
            </Item>
          ))}
        </Content>
        <Overlay>
          {({ value }) => {
            const todo = todos.find((t) => t.id === value)
            if (!todo) return null
            return (
              <div className="bg-card flex items-center gap-3 rounded-lg border p-3 shadow-lg">
                <GripVertical className="text-muted-foreground size-4" />
                <input
                  type="checkbox"
                  checked={todo.completed}
                  readOnly
                  className="accent-primary size-4"
                />
                <span
                  className={cn(
                    "flex-1",
                    todo.completed && "text-muted-foreground line-through"
                  )}
                >
                  {todo.text}
                </span>
              </div>
            )
          }}
        </Overlay>
      </Root>

      {todos.length === 0 && (
        <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
          No todos yet. Add one above to get started!
        </div>
      )}
    </div>
  )
}

export const TodoList: Story = {
  render: () => <TodoListExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A fully functional todo list with add, toggle, delete, and reorder functionality. Demonstrates combining Sortable with other interactive elements.",
      },
    },
  },
}

/**
 * Kanban board with multiple columns.
 */
type Task = {
  id: string
  title: string
  column: "todo" | "progress" | "done"
}

const KanbanExample = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Design homepage", column: "done" },
    { id: "2", title: "Write API docs", column: "progress" },
    { id: "3", title: "Fix bugs", column: "progress" },
    { id: "4", title: "Code review", column: "todo" },
    { id: "5", title: "Deploy to staging", column: "todo" },
  ])

  const columns: Array<{ id: Task["column"]; title: string }> = [
    { id: "todo", title: "To Do" },
    { id: "progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ]

  const getTasksByColumn = (column: Task["column"]) =>
    tasks.filter((task) => task.column === column)

  const handleReorder = (column: Task["column"], newOrder: Task[]) => {
    setTasks((prev) => {
      const otherTasks = prev.filter((task) => task.column !== column)
      return [...otherTasks, ...newOrder]
    })
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-3 gap-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-muted/50 flex flex-col rounded-lg border p-4"
          >
            <h3 className="mb-4 font-semibold">{column.title}</h3>
            <Root
              value={getTasksByColumn(column.id)}
              onValueChange={(newOrder) => handleReorder(column.id, newOrder)}
              orientation="vertical"
              getItemValue={(item) => item.id}
            >
              <Content className="flex-1 space-y-2">
                {getTasksByColumn(column.id).map((task) => (
                  <Item
                    key={task.id}
                    value={task.id}
                    asHandle
                    className="bg-card rounded-lg border p-3 text-sm font-medium"
                  >
                    {task.title}
                  </Item>
                ))}
                {getTasksByColumn(column.id).length === 0 && (
                  <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
                    No tasks
                  </div>
                )}
              </Content>
              <Overlay>
                {({ value }) => {
                  const task = tasks.find((t) => t.id === value)
                  if (!task) return null
                  return (
                    <div className="bg-card rounded-lg border p-3 text-sm font-medium shadow-lg">
                      {task.title}
                    </div>
                  )
                }}
              </Overlay>
            </Root>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground mt-4 text-sm">
        Note: This example shows sortable columns. For drag-and-drop between
        columns, you'll need additional logic to handle cross-column transfers.
      </p>
    </div>
  )
}

export const Kanban: Story = {
  render: () => <KanbanExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A kanban board with three columns. Each column is independently sortable. Drag tasks to reorder within each column.",
      },
    },
  },
}

/**
 * Disabled items example.
 */
const DisabledItemsExample = () => {
  const [items, setItems] = useState([
    { id: "1", text: "Draggable item 1", disabled: false },
    { id: "2", text: "Disabled item (locked)", disabled: true },
    { id: "3", text: "Draggable item 2", disabled: false },
    { id: "4", text: "Disabled item (locked)", disabled: true },
    { id: "5", text: "Draggable item 3", disabled: false },
  ])

  return (
    <div className="w-full max-w-md">
      <Root
        value={items}
        onValueChange={setItems}
        orientation="vertical"
        getItemValue={(item) => item.id}
      >
        <Content className="space-y-2">
          {items.map((item) => (
            <Item
              key={item.id}
              value={item.id}
              disabled={item.disabled}
              className="bg-card flex items-center gap-3 rounded-lg border p-4"
            >
              <ItemHandle
                disabled={item.disabled}
                className="text-muted-foreground hover:text-foreground"
              >
                <GripVertical className="size-5" />
              </ItemHandle>
              <span
                className={cn("font-medium", item.disabled && "opacity-50")}
              >
                {item.text}
              </span>
            </Item>
          ))}
        </Content>
        <Overlay>
          {({ value }) => {
            const item = items.find((i) => i.id === value)
            if (!item) return null
            return (
              <div className="bg-card flex items-center gap-3 rounded-lg border p-4 shadow-lg">
                <GripVertical className="text-muted-foreground size-5" />
                <span className="font-medium">{item.text}</span>
              </div>
            )
          }}
        </Overlay>
      </Root>
    </div>
  )
}

export const DisabledItems: Story = {
  render: () => <DisabledItemsExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Some items can be disabled to prevent dragging. Disabled items remain in place while other items can be reordered around them.",
      },
    },
  },
}

/**
 * Flat cursor example (no cursor change during drag).
 */
const FlatCursorExample = () => {
  const [items, setItems] = useState([
    "Apple",
    "Banana",
    "Cherry",
    "Date",
    "Elderberry",
  ])

  return (
    <div className="w-full max-w-md">
      <Root
        value={items}
        onValueChange={setItems}
        orientation="vertical"
        flatCursor
      >
        <Content className="space-y-2">
          {items.map((item) => (
            <Item
              key={item}
              value={item}
              className="bg-card flex items-center gap-3 rounded-lg border p-4"
            >
              <ItemHandle className="text-muted-foreground hover:text-foreground">
                <GripVertical className="size-5" />
              </ItemHandle>
              <span className="font-medium">{item}</span>
            </Item>
          ))}
        </Content>
        <Overlay>
          {({ value }) => (
            <div className="bg-card flex items-center gap-3 rounded-lg border p-4 shadow-lg">
              <GripVertical className="text-muted-foreground size-5" />
              <span className="font-medium">{value}</span>
            </div>
          )}
        </Overlay>
      </Root>
      <p className="text-muted-foreground mt-4 text-sm">
        The <code>flatCursor</code> prop prevents cursor changes during drag
        operations.
      </p>
    </div>
  )
}

export const FlatCursor: Story = {
  render: () => <FlatCursorExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Using the flatCursor prop keeps the cursor as the default pointer instead of changing to grab/grabbing cursors during drag operations.",
      },
    },
  },
}

/**
 * Custom styling example.
 */
const CustomStylingExample = () => {
  const [items, setItems] = useState([
    { id: "1", label: "High Priority", color: "border-red-500 bg-red-500/10" },
    {
      id: "2",
      label: "Medium Priority",
      color: "border-yellow-500 bg-yellow-500/10",
    },
    {
      id: "3",
      label: "Low Priority",
      color: "border-green-500 bg-green-500/10",
    },
    { id: "4", label: "Info", color: "border-blue-500 bg-blue-500/10" },
  ])

  return (
    <div className="w-full max-w-md">
      <Root
        value={items}
        onValueChange={setItems}
        orientation="vertical"
        getItemValue={(item) => item.id}
      >
        <Content className="space-y-3">
          {items.map((item) => (
            <Item
              key={item.id}
              value={item.id}
              asHandle
              className={cn(
                "flex items-center gap-3 rounded-lg border-2 p-4 transition-all",
                "hover:scale-105 hover:shadow-md",
                item.color
              )}
            >
              <GripVertical className="size-5 opacity-50" />
              <span className="font-semibold">{item.label}</span>
            </Item>
          ))}
        </Content>
        <Overlay>
          {({ value }) => {
            const item = items.find((i) => i.id === value)
            if (!item) return null
            return (
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg border-2 p-4 shadow-2xl",
                  item.color
                )}
              >
                <GripVertical className="size-5 opacity-50" />
                <span className="font-semibold">{item.label}</span>
              </div>
            )
          }}
        </Overlay>
      </Root>
    </div>
  )
}

export const CustomStyling: Story = {
  render: () => <CustomStylingExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Fully customizable styling with Tailwind classes. Add colors, borders, shadows, and hover effects to match your design system.",
      },
    },
  },
}

/**
 * Complete example showing all features.
 */
type Priority = "high" | "medium" | "low"

type CompleteTask = {
  id: string
  title: string
  description: string
  priority: Priority
  completed: boolean
}

const CompleteExample = () => {
  const [tasks, setTasks] = useState<CompleteTask[]>([
    {
      id: "1",
      title: "Review security audit",
      description: "Check all findings and implement fixes",
      priority: "high",
      completed: false,
    },
    {
      id: "2",
      title: "Update dependencies",
      description: "Upgrade to latest stable versions",
      priority: "medium",
      completed: false,
    },
    {
      id: "3",
      title: "Write unit tests",
      description: "Cover new authentication flow",
      priority: "high",
      completed: true,
    },
    {
      id: "4",
      title: "Refactor components",
      description: "Extract reusable UI components",
      priority: "low",
      completed: false,
    },
  ])

  const priorityColors: Record<Priority, string> = {
    high: "border-l-red-500",
    medium: "border-l-yellow-500",
    low: "border-l-green-500",
  }

  const handleToggle = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Project Tasks</h3>
          <p className="text-muted-foreground text-sm">
            {completedCount} of {tasks.length} completed
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 text-sm">
            <div className="size-3 rounded-full bg-red-500" />
            High
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="size-3 rounded-full bg-yellow-500" />
            Medium
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="size-3 rounded-full bg-green-500" />
            Low
          </div>
        </div>
      </div>

      <Root
        value={tasks}
        onValueChange={setTasks}
        orientation="vertical"
        getItemValue={(item) => item.id}
      >
        <Content className="space-y-2">
          {tasks.map((task) => (
            <Item
              key={task.id}
              value={task.id}
              className={cn(
                "bg-card flex gap-3 rounded-lg border border-l-4 p-4",
                priorityColors[task.priority]
              )}
            >
              <ItemHandle className="text-muted-foreground hover:text-foreground pt-1">
                <GripVertical className="size-5" />
              </ItemHandle>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task.id)}
                className="accent-primary mt-1 size-4 cursor-pointer"
              />
              <div className="flex-1">
                <div
                  className={cn(
                    "font-medium",
                    task.completed && "text-muted-foreground line-through"
                  )}
                >
                  {task.title}
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {task.description}
                </p>
              </div>
            </Item>
          ))}
        </Content>
        <Overlay>
          {({ value }) => {
            const task = tasks.find((t) => t.id === value)
            if (!task) return null
            return (
              <div
                className={cn(
                  "bg-card flex gap-3 rounded-lg border border-l-4 p-4 shadow-lg",
                  priorityColors[task.priority]
                )}
              >
                <GripVertical className="text-muted-foreground size-5" />
                <input
                  type="checkbox"
                  checked={task.completed}
                  readOnly
                  className="accent-primary mt-1 size-4"
                />
                <div className="flex-1">
                  <div
                    className={cn(
                      "font-medium",
                      task.completed && "text-muted-foreground line-through"
                    )}
                  >
                    {task.title}
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {task.description}
                  </p>
                </div>
              </div>
            )
          }}
        </Overlay>
      </Root>

      <div className="rounded-lg border border-dashed p-4">
        <p className="text-muted-foreground text-sm">
          <strong>Features demonstrated:</strong> Drag-and-drop reordering,
          priority indicators with color coding, checkbox interactions,
          completed task styling, progress tracking, and custom drag overlay.
        </p>
      </div>
    </div>
  )
}

export const Complete: Story = {
  render: () => <CompleteExample />,
  parameters: {
    docs: {
      description: {
        story: `
A complete task management example showcasing:

- **Priority levels** with color-coded borders
- **Checkboxes** for marking tasks complete
- **Progress tracking** showing completion stats
- **Rich content** with titles and descriptions
- **Custom styling** with conditional classes
- **Drag overlay** matching the item appearance

This demonstrates how to build a production-ready sortable interface with multiple interactive elements.
        `,
      },
    },
  },
}
