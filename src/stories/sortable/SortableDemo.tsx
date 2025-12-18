import { Button } from "@/components/ui/button"
import {
  Content,
  Item,
  ItemHandle,
  Overlay,
  Root,
} from "@/components/ui/sortable"
import { cn } from "@/lib/utils"
import { GripVertical, Image, Music, Plus, Video, X } from "lucide-react"
import { useState } from "react"

/**
 * Basic vertical list with drag handles.
 */
export const BasicVerticalExample = () => {
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

/**
 * Horizontal list of cards.
 */
export const HorizontalCardsExample = () => {
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

/**
 * Grid layout with mixed orientation.
 */
export const GridExample = () => {
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

/**
 * Todo list with delete buttons.
 */
type TodoItem = {
  id: string
  text: string
  completed: boolean
}

export const TodoListExample = () => {
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

/**
 * Disabled items example.
 */
export const DisabledItemsExample = () => {
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

/**
 * Custom styling example.
 */
export const CustomStylingExample = () => {
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
