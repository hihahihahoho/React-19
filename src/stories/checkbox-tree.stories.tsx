import { Badge } from "@/components/ui/badge/badge"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import {
  CheckboxTree,
  TreeNode,
} from "@/components/ui/selection-controls/checkbox-tree"
import { CheckboxTreeForm } from "@/components/ui/selection-controls/checkbox-tree-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { FileText, Folder, Settings, Star } from "lucide-react"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

/**
 * CheckboxTree component allows users to select items from a hierarchical tree structure.
 * It supports multi-level selection with parent-child relationships and indeterminate states.
 */
const meta = {
  title: "Forms/CheckboxTree",
  component: CheckboxTreeForm,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/checkbox-tree.json
\`\`\`

CheckboxTree provides a hierarchical selection interface where users can select items in a tree structure.
It automatically handles parent-child relationships, showing indeterminate states when some children are selected.

## When to use
- When you need hierarchical multi-selection (folders and files, categories and subcategories)
- For organizing content in a tree structure with selection capabilities
- When parent-child relationships need to be visually represented
- For complex filtering or categorization scenarios

## Features
- Automatic parent-child state management
- Indeterminate states for partial selections
- Expandable/collapsible tree nodes
- Custom rendering for tree items
- Form integration with validation
- Keyboard accessibility

## Accessibility
- Tree structure is keyboard navigable
- ARIA attributes properly describe tree relationships
- Screen readers can understand the hierarchical structure
- Focus management follows tree navigation patterns
        `,
      },
    },
  },
  argTypes: {
    trees: {
      description: "Array of tree nodes with hierarchical structure",
    },
    renderNode: {
      description: "Custom renderer for tree nodes",
    },
    renderContent: {
      description: "Custom renderer for node content",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof CheckboxTreeForm>

export default meta
type Story = StoryObj<typeof meta>

// Sample tree data
const sampleTrees: TreeNode[] = [
  {
    id: "documents",
    label: "Documents",
    defaultExpanded: true,
    children: [
      {
        id: "reports",
        label: "Reports",
        children: [
          { id: "q1-report", label: "Q1 Financial Report" },
          { id: "q2-report", label: "Q2 Financial Report" },
          { id: "annual-report", label: "Annual Summary" },
        ],
      },
      {
        id: "presentations",
        label: "Presentations",
        children: [
          { id: "sales-deck", label: "Sales Deck 2024" },
          { id: "product-demo", label: "Product Demo" },
        ],
      },
      { id: "contracts", label: "Contracts" },
    ],
  },
  {
    id: "media",
    label: "Media Files",
    defaultExpanded: false,
    children: [
      {
        id: "images",
        label: "Images",
        children: [
          { id: "logo", label: "Company Logo" },
          { id: "banner", label: "Website Banner" },
          { id: "product-shots", label: "Product Photos" },
        ],
      },
      {
        id: "videos",
        label: "Videos",
        children: [
          { id: "intro-video", label: "Company Intro" },
          { id: "tutorial", label: "Product Tutorial" },
        ],
      },
    ],
  },
  {
    id: "archive",
    label: "Archive",
    children: [
      { id: "old-docs", label: "Old Documents" },
      { id: "backup", label: "Backup Files" },
    ],
  },
]

// Component wrappers to use hooks properly
function BasicExample() {
  const formSchema = z.object({
    selectedItems: z
      .array(z.string())
      .min(1, "Please select at least one item"),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedItems: [],
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Selected items:", data.selectedItems)
    alert(`Selected ${data.selectedItems.length} items`)
  }

  const selectedItems = useWatch({
    control: form.control,
    name: "selectedItems",
  })

  return (
    <ZodSchemaProvider schema={formSchema}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CheckboxTreeForm
            control={form.control}
            name="selectedItems"
            trees={sampleTrees}
            formComposition={{
              label: "Select Files and Folders",
              isMinHeight: true,
              description:
                "Choose the items you want to include in your selection.",
            }}
          />
          <div className="text-muted-foreground mt-4 text-sm">
            Selected: {selectedItems.length} items
          </div>
          <Button type="submit" className="w-full">
            Submit Selection
          </Button>
        </form>
      </Form>
    </ZodSchemaProvider>
  )
}

function CustomRenderingExample() {
  const departmentTrees: TreeNode[] = [
    {
      id: "engineering",
      label: "Engineering",
      defaultExpanded: true,
      children: [
        {
          id: "frontend",
          label: "Frontend Team",
          children: [
            {
              id: "react-team",
              label: "React Developers",
              defaultChecked: true,
            },
            { id: "vue-team", label: "Vue Developers" },
            { id: "angular-team", label: "Angular Developers" },
          ],
        },
        {
          id: "backend",
          label: "Backend Team",
          children: [
            { id: "node-team", label: "Node.js Developers" },
            {
              id: "python-team",
              label: "Python Developers",
              defaultChecked: true,
            },
            { id: "java-team", label: "Java Developers" },
          ],
        },
        {
          id: "devops",
          label: "DevOps Team",
          children: [
            { id: "aws-team", label: "AWS Engineers" },
            { id: "docker-team", label: "Container Engineers" },
          ],
        },
      ],
    },
    {
      id: "design",
      label: "Design",
      children: [
        { id: "ui-designers", label: "UI Designers" },
        { id: "ux-researchers", label: "UX Researchers" },
        { id: "graphic-designers", label: "Graphic Designers" },
      ],
    },
  ]

  const formSchema = z.object({
    selectedDepartments: z.array(z.string()),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedDepartments: ["react-team", "python-team"],
    },
  })

  const renderContent = (node: TreeNode, hasChildren: boolean) => {
    const getIcon = () => {
      if (hasChildren) {
        if (node.id === "engineering")
          return <Settings className="h-4 w-4 text-blue-500" />
        if (node.id === "design")
          return <Star className="h-4 w-4 text-purple-500" />
        return <Folder className="h-4 w-4 text-amber-500" />
      }
      return <FileText className="h-4 w-4 text-gray-500" />
    }

    const getBadge = () => {
      if (node.id === "react-team")
        return (
          <Badge variant="blue" className="ml-2">
            Popular
          </Badge>
        )
      if (node.id === "python-team")
        return (
          <Badge variant="green" className="ml-2">
            Growing
          </Badge>
        )
      if (node.id === "devops")
        return (
          <Badge variant="orange" className="ml-2">
            Critical
          </Badge>
        )
      return null
    }

    return (
      <div className="flex items-center gap-2">
        {getIcon()}
        <span className={hasChildren ? "font-medium" : ""}>{node.label}</span>
        {getBadge()}
      </div>
    )
  }

  const selectedDepartments = useWatch({
    control: form.control,
    name: "selectedDepartments",
  })

  return (
    <ZodSchemaProvider schema={formSchema}>
      <Form {...form}>
        <form className="space-y-4">
          <CheckboxTreeForm
            control={form.control}
            name="selectedDepartments"
            trees={departmentTrees}
            renderContent={renderContent}
            formComposition={{
              isMinHeight: true,
              label: "Department Selection",
              description: "Select teams and departments for your project.",
            }}
          />
          <div className="text-muted-foreground mt-4 text-sm">
            Selected: {selectedDepartments.length} items
          </div>
        </form>
      </Form>
    </ZodSchemaProvider>
  )
}

function ControlledExample() {
  const [checkedNodes, setCheckedNodes] = useState<Set<string>>(
    new Set(["q1-report", "logo"])
  )

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">File Selection</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Select files and folders to include in your backup.
        </p>
      </div>
      <CheckboxTree
        trees={sampleTrees}
        checkedNodes={checkedNodes}
        onCheckedNodesChange={setCheckedNodes}
        renderNode={({
          node,
          isChecked,
          isExpanded,
          hasChildren,
          onCheckedChange,
          onToggleExpand,
          children,
        }) => (
          <div key={node.id} className="space-y-1">
            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={isChecked === true}
                ref={(el) => {
                  if (el) el.indeterminate = isChecked === "indeterminate"
                }}
                onChange={onCheckedChange}
                className="rounded border-gray-300"
              />
              {hasChildren && (
                <button
                  type="button"
                  onClick={onToggleExpand}
                  className="rounded p-0.5 hover:bg-gray-100"
                >
                  {isExpanded ? "📂" : "📁"}
                </button>
              )}
              <span className={hasChildren ? "font-medium" : ""}>
                {node.label}
              </span>
            </div>
            {isExpanded && children && (
              <div className="ml-6 space-y-1">{children}</div>
            )}
          </div>
        )}
      />
      <div className="mt-4 rounded-lg bg-gray-50 p-3">
        <div className="text-muted-foreground text-sm">
          Selected items ({checkedNodes.size}):
        </div>
        <div className="mt-1 font-mono text-sm">
          {Array.from(checkedNodes).join(", ") || "None"}
        </div>
      </div>
    </div>
  )
}

/**
 * Basic checkbox tree showing file and folder structure.
 */
export const Basic: Story = {
  args: {
    name: "selectedItems",
    trees: sampleTrees,
  },
  render: () => <BasicExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Basic checkbox tree with file and folder structure. Shows hierarchical selection with parent-child relationships.",
      },
    },
  },
}

/**
 * Checkbox tree with custom icons and content rendering.
 */
export const CustomRendering: Story = {
  args: {
    name: "selectedDepartments",
    trees: [],
  },
  render: () => <CustomRenderingExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Checkbox tree with custom icons, badges, and content rendering. Shows how to customize the appearance of tree items.",
      },
    },
  },
}

/**
 * Controlled checkbox tree without form integration.
 */
export const Controlled: Story = {
  args: {
    name: "selectedItems",
    trees: sampleTrees,
  },
  render: () => <ControlledExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Controlled checkbox tree without form integration. Useful when you need direct control over the selection state.",
      },
    },
  },
}
