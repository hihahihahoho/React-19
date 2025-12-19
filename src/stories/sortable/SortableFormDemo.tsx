import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form/form"
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@/components/ui/sortable"
import type { UniqueIdentifier } from "@dnd-kit/core"
import { zodResolver } from "@hookform/resolvers/zod"
import { GripVertical, Plus, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

// Schema for priority items
const priorityItemSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label is required"),
})

type PriorityItem = z.infer<typeof priorityItemSchema>

const formSchema = z.object({
  priorities: z
    .array(priorityItemSchema)
    .min(1, "At least one priority is required"),
})

type FormValues = z.infer<typeof formSchema>

const defaultItems: PriorityItem[] = [
  { id: "1", label: "High Priority Tasks" },
  { id: "2", label: "Medium Priority Tasks" },
  { id: "3", label: "Low Priority Tasks" },
  { id: "4", label: "Backlog Items" },
]

/**
 * Sortable with React Hook Form integration.
 * Priority list that can be reordered via drag-and-drop.
 */
export const SortableWithFormExample = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priorities: defaultItems,
    },
  })

  const priorities = form.watch("priorities")

  const onSubmit = (data: FormValues) => {
    toast.success("Form submitted!", {
      description: (
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(data.priorities, null, 2)}
          </code>
        </pre>
      ),
    })
  }

  const addItem = () => {
    const newId = Date.now().toString()
    form.setValue("priorities", [
      ...priorities,
      { id: newId, label: `New Priority ${priorities.length + 1}` },
    ])
  }

  const removeItem = (id: string) => {
    form.setValue(
      "priorities",
      priorities.filter((item) => item.id !== id)
    )
  }

  return (
    <div className="w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="priorities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority Order</FormLabel>
                <FormDescription>
                  Drag items to set their priority. Top items have higher
                  priority.
                </FormDescription>
                <FormControl>
                  <Sortable
                    value={field.value}
                    onValueChange={field.onChange}
                    getItemValue={(item: PriorityItem): UniqueIdentifier =>
                      item.id
                    }
                    orientation="vertical"
                  >
                    <SortableContent className="space-y-2">
                      {field.value.map((item: PriorityItem, index: number) => (
                        <SortableItem
                          key={item.id}
                          value={item.id}
                          className="bg-card flex items-center gap-3 rounded-lg border p-3"
                        >
                          <SortableItemHandle className="text-muted-foreground hover:text-foreground">
                            <GripVertical className="size-4" />
                          </SortableItemHandle>
                          <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                            #{index + 1}
                          </span>
                          <span className="flex-1 text-sm font-medium">
                            {item.label}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive size-8 p-0"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="size-4" />
                          </Button>
                        </SortableItem>
                      ))}
                    </SortableContent>
                    <SortableOverlay>
                      {({ value }) => {
                        const item = field.value.find(
                          (i: PriorityItem) => i.id === value
                        )
                        if (!item) return null
                        return (
                          <div className="bg-card ring-primary flex items-center gap-3 rounded-lg border p-3 shadow-lg ring-2">
                            <GripVertical className="text-muted-foreground size-4" />
                            <span className="text-sm font-medium">
                              {item.label}
                            </span>
                          </div>
                        )
                      }}
                    </SortableOverlay>
                  </Sortable>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="mr-1 size-4" />
              Add Priority
            </Button>
            <Button type="submit">Save Order</Button>
          </div>
        </form>
      </Form>

      {/* Current order display */}
      <div className="bg-muted/50 mt-6 rounded-lg border p-4">
        <h4 className="mb-2 text-sm font-semibold">Current Priority Order:</h4>
        <ol className="list-inside list-decimal space-y-1 text-sm">
          {priorities.map((item: PriorityItem) => (
            <li key={item.id}>{item.label}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}
