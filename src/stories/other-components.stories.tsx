import type { Meta, StoryObj } from "@storybook/react-vite"
import { ExternalLinkIcon } from "lucide-react"

const externalComponents = [
  {
    name: "Stepper",
    description: "Components for multi-step processes",
    url: "https://coss.com/origin/stepper",
    source: "coss ui",
  },
  {
    name: "Timeline",
    description: "Display chronological events",
    url: "https://coss.com/origin/timeline",
    source: "coss ui",
  },
]

function OtherComponentsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Other Components</h1>
        <p className="text-muted-foreground">
          Additional UI components from external sources. Click to visit the
          original documentation.
        </p>
      </div>

      <div className="grid gap-3">
        {externalComponents.map((component) => (
          <a
            key={component.name}
            href={component.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group hover:bg-muted/50 flex items-center justify-between gap-4 rounded-lg border px-4 py-3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="font-medium group-hover:underline">
                {component.name}
              </span>
              <span className="text-muted-foreground text-sm">
                {component.description}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
                {component.source}
              </span>
              <ExternalLinkIcon className="text-muted-foreground size-4" />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

const meta = {
  title: "Other Components",
  component: OtherComponentsPage,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Additional UI components from external sources. Visit the links for full documentation and examples.",
      },
    },
  },
} satisfies Meta<typeof OtherComponentsPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
