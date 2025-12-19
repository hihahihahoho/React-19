import { Sortable } from "@/components/ui/sortable"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { KanbanExample } from "./KanbanDemo"
import { NestedGridExample } from "./NestedGridDemo"
import { NestedGridFormExample } from "./NestedGridFormDemo"
import {
  BasicVerticalExample,
  CustomStylingExample,
  DisabledItemsExample,
  GridExample,
  HorizontalCardsExample,
  TodoListExample,
} from "./SortableDemo"
import { SortableWithFormExample } from "./SortableFormDemo"
import {
  BasicTableExample,
  FormWithInputsExample,
  ProductInventoryExample,
  TeamMembersExample,
} from "./SortableTableDemo"

/**
 * Sortable components provide drag-and-drop reordering functionality.
 * Built on @dnd-kit for smooth, accessible interactions.
 */
const meta = {
  title: "Interaction/Sortable",
  component: Sortable,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/sortable.json
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/sortable-table.json
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
- **Nested support**: Create complex nested drag-and-drop interfaces

## Components
- **Sortable.Root**: Provides drag-and-drop context and handles reordering logic
- **Sortable.Content**: Defines the sortable container (list, grid, etc.)
- **Sortable.Item**: Individual draggable/sortable item
- **Sortable.ItemHandle**: Dedicated drag handle for items
- **Sortable.Overlay**: Visual feedback during dragging
- **SortableTable**: Table with sortable rows

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

// ============ Sortable Basic Examples ============

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

// ============ SortableTable Examples ============

export const BasicTable: Story = {
  render: () => <BasicTableExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A basic sortable table with tasks. Drag the grip icon to reorder rows. The data automatically updates when rows are moved.",
      },
    },
  },
}

export const TeamMembers: Story = {
  render: () => <TeamMembersExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A sortable table displaying team member information with contact details and roles. Reorder team members by dragging.",
      },
    },
  },
}

export const ProductInventory: Story = {
  render: () => <ProductInventoryExample />,
  parameters: {
    docs: {
      description: {
        story:
          "An inventory table with products, categories, pricing, and stock levels. Useful for managing display order or priority.",
      },
    },
  },
}

export const FormWithInputs: Story = {
  render: () => <FormWithInputsExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A sortable table with interactive form controls in each row. Drag to reorder tasks, use the dropdowns to change status/assignee, and edit the hours input. Submit to see the complete data payload.",
      },
    },
  },
}

// ============ Nested Grid Example ============

export const NestedGrid: Story = {
  render: () => <NestedGridExample />,
  parameters: {
    docs: {
      description: {
        story: `
## Usage Pattern - Single Container

\`\`\`tsx
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@/components/ui/sortable"

<Sortable value={items} onValueChange={setItems}>
  <SortableContent>
    <SortableItem value="a">
      <SortableItemHandle />
    </SortableItem>
  </SortableContent>
  <SortableOverlay />
</Sortable>
\`\`\`

## Usage Pattern - Multi Container (Groups)

\`\`\`tsx
import {
  Sortable,
  SortableContent,
  SortableGroup,
  SortableGroupContent,
  SortableGroupHandle,
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable"

<Sortable value={groups} onValueChange={setGroups}>
  <SortableGroupContent>
    <SortableGroup value="group-1">
      <SortableGroupHandle />
      <SortableContent>
        <SortableItem value="item-1">
          <SortableItemHandle />
        </SortableItem>
      </SortableContent>
    </SortableGroup>
  </SortableGroupContent>
</Sortable>
\`\`\`

---

A complex nested grid with cross-container drag and drop:

- **Grid layout**: Multiple containers arranged in a responsive grid
- **Sortable groups**: Drag the move icon to reorder entire containers
- **Sortable items**: Each container has its own list of sortable items  
- **Cross-container**: Drag items between any containers
- **Visual feedback**: Overlay shows the dragged item, containers highlight on hover
- **Empty state**: Empty containers show a drop zone placeholder
        `,
      },
    },
  },
}

// ============ Kanban Example ============

export const Kanban: Story = {
  render: () => <KanbanExample />,
  parameters: {
    docs: {
      description: {
        story: `
A fully functional Kanban board with cross-column drag and drop:

- **Multiple columns**: To Do, In Progress, and Done columns
- **Sortable tasks**: Drag tasks within columns to reorder
- **Cross-column**: Drag tasks between any columns
- **Add tasks**: Click the + button to add new tasks
- **Visual feedback**: Overlay shows dragged task, columns highlight on hover

This is a complete implementation of a Kanban board with all drag-and-drop features working.
        `,
      },
    },
  },
}

// ============ React Hook Form Example ============

export const ReactHookForm: Story = {
  render: () => <SortableWithFormExample />,
  parameters: {
    docs: {
      description: {
        story: `
## Usage with React Hook Form

\`\`\`tsx
import { useForm } from "react-hook-form"
import { Sortable, SortableContent, SortableItem } from "@/components/ui/sortable"

const form = useForm<FormValues>({
  defaultValues: { items: [...] }
})

<FormField
  control={form.control}
  name="items"
  render={({ field }) => (
    <Sortable
      value={field.value}
      onValueChange={field.onChange}
      getItemValue={(item) => item.id}
    >
      <SortableContent>
        {field.value.map((item) => (
          <SortableItem key={item.id} value={item.id}>
            {item.label}
          </SortableItem>
        ))}
      </SortableContent>
    </Sortable>
  )}\
/>
\`\`\`

---

A priority list with React Hook Form integration:

- **Form validation**: Zod schema validates the priority list
- **Drag to reorder**: Change priority by dragging items
- **Add/Remove**: Add new priorities or remove existing ones
- **Form submission**: Submit to see the final order
- **Live preview**: Shows current order in real-time
        `,
      },
    },
  },
}

// ============ Nested Grid + React Hook Form ============

export const NestedGridForm: Story = {
  render: () => <NestedGridFormExample />,
  parameters: {
    docs: {
      description: {
        story: `
## Multi Container + React Hook Form

\`\`\`tsx
import { useForm } from "react-hook-form"
import { Sortable, SortableGroup, SortableGroupContent, ... } from "@/components/ui/sortable"

const form = useForm<FormValues>({
  defaultValues: { groups: [...] }
})

<FormField
  control={form.control}
  name="groups"
  render={({ field }) => (
    <Sortable value={field.value} onValueChange={field.onChange}>
      <SortableGroupContent>
        {field.value.map((group) => (
          <SortableGroup key={group.id} value={group.id}>
            <SortableGroupHandle />
            <SortableContent>
              {group.items.map((item) => (
                <SortableItem key={item.id} value={item.id}>
                  <SortableItemHandle />
                </SortableItem>
              ))}
            </SortableContent>
          </SortableGroup>
        ))}
      </SortableGroupContent>
    </Sortable>
  )}
/>
\`\`\`

---

A complex nested grid with React Hook Form integration:

- **Form validation**: Zod schema validates groups and items
- **Drag groups**: Reorder entire groups by dragging
- **Drag items**: Reorder items within groups or move between groups
- **Add/Remove items**: Add new tasks or remove existing ones
- **Form state tracking**: Shows dirty state and changes
- **Submit & Reset**: Save changes or reset to initial state
        `,
      },
    },
  },
}
