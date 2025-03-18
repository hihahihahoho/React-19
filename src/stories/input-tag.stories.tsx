import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import { InputTag } from "@/components/ui/input/input-tag"
import { InputTagForm } from "@/components/ui/input/input-tag-form"
import {
  SelectGroup,
  SelectItems,
} from "@/components/ui/select/select-interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { Meta, StoryObj } from "@storybook/react"
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query"
import {
  AlertTriangle,
  ArrowDown,
  Ban,
  Briefcase,
  Calendar,
  Code,
  Flag,
  Globe,
  Loader2Icon,
  Tags,
  User,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

/**
 * InputTag component allows users to enter and manage multiple tags or keywords in a text input.
 */
const meta = {
  title: "Forms/InputTag",
  component: InputTag,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
InputTag components allow users to enter and manage multiple tags or keywords in a text input.
They are useful for collecting multiple related values like categories, skills, or keywords.

## When to use
- When users need to enter multiple related items
- When tagging or categorizing content
- When collecting keywords or search terms
- When managing a list of simple values

## Accessibility
- InputTag is keyboard navigable
- Tags can be deleted with Backspace or Delete
- Arrow keys can be used to navigate between tags
- Undo/redo support with Ctrl+Z and Ctrl+Y
        `,
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Text displayed when no tags are entered",
    },
    options: {
      description: "Array of options to display as suggestions",
    },
    value: {
      description: "Currently entered tags (controlled)",
    },
    defaultValue: {
      description: "Default tags (uncontrolled)",
    },
    mode: {
      control: { type: "radio" },
      options: ["default", "select"],
      description:
        "Input mode - default (free text) or select (from options only)",
    },
    allowDuplicates: {
      control: "boolean",
      description: "Whether to allow duplicate tags",
    },
    triggerKeys: {
      description: "Keys that trigger tag creation (default: comma, Tab)",
    },
    minCharToSearch: {
      control: { type: "number" },
      description: "Minimum characters required to show search results",
    },
    formComposition: {
      description:
        "Configuration for form composition elements like label, help text",
    },
  },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient()
      return (
        <QueryClientProvider client={queryClient}>
          <div className="mx-auto w-[384px] max-w-[80vw]">
            <Story />
          </div>
        </QueryClientProvider>
      )
    },
  ],
} satisfies Meta<typeof InputTag>

export default meta
type Story = StoryObj<typeof meta>

// Sample options
const techOptions: SelectItems[] = [
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "node", label: "Node.js" },
  { value: "nextjs", label: "Next.js" },
]

// Grouped options
const skillOptions: SelectGroup[] = [
  {
    heading: "Frontend",
    options: [
      { value: "react", label: "React" },
      { value: "angular", label: "Angular" },
      { value: "vue", label: "Vue" },
    ],
    isMultiSelect: true,
  },
  {
    heading: "Backend",
    options: [
      { value: "nodejs", label: "Node.js" },
      { value: "python", label: "Python" },
      { value: "java", label: "Java" },
    ],
    isMultiSelect: true,
  },
]

/**
 * Basic example of an input tag component.
 */
export const Basic: Story = {
  args: {
    placeholder: "Enter tags...",
    options: techOptions,
    formComposition: {
      label: "Skills",
      description: "Enter your programming skills",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Basic input tag component with technology options. Type to enter tags or select from dropdown.",
      },
    },
  },
}

/**
 * Example with grouped options.
 */
export const GroupedOptions: Story = {
  args: {
    placeholder: "Select skills...",
    options: skillOptions,
    formComposition: {
      label: "Skills",
      description: "Select your programming skills",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "InputTag with options organized into groups for better categorization.",
      },
    },
  },
}

/**
 * Examples of different input tag states.
 */
export const InputTagStates: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <InputTag
        options={techOptions}
        formComposition={{
          label: "Default",
          description: "Interactive input tag",
        }}
        placeholder="Enter tags..."
      />

      <InputTag
        options={techOptions}
        formComposition={{
          label: "Disabled",
          description: "Cannot be interacted with",
        }}
        placeholder="Enter tags..."
        disabled
      />

      <InputTag
        options={techOptions}
        formComposition={{
          label: "With default values",
        }}
        defaultValue={["react", "typescript"]}
      />

      <InputTag
        options={techOptions}
        formComposition={{
          label: "Select mode only",
          description: "Can only select from options, not free text",
        }}
        mode="select"
        placeholder="Select tags..."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "InputTag fields in various states including default, disabled, read-only, with default values, and select-only mode.",
      },
    },
  },
}

/**
 * Examples of input tags with different label positions.
 */
export const LabelPositioning: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <InputTag
        options={techOptions}
        formComposition={{
          label: "Vertical label (default)",
          description: "Label appears above the input",
        }}
        placeholder="Enter tags..."
      />

      <InputTag
        options={techOptions}
        formComposition={{
          label: "Horizontal label",
          labelPosition: "horizontal",
          description: "Label appears to the left of the input",
        }}
        placeholder="Enter tags..."
      />

      <InputTag
        options={techOptions}
        formComposition={{
          label: "Custom layout",
          labelPosition: "horizontal",
          layout: {
            leftColClass: "md:col-span-3",
            rightColClass: "md:col-span-9",
          },
          description: "With custom column sizes",
        }}
        placeholder="Enter tags..."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "InputTag fields with different label positioning options.",
      },
    },
  },
}

/**
 * InputTag with colored badges.
 */
export const ColoredBadges: Story = {
  render: () => {
    // Array of items with different colors assigned
    const priorityOptions: SelectItems[] = [
      {
        value: "high",
        label: "High",
        badgeProps: { variant: "red" },
      },
      {
        value: "medium",
        label: "Medium",
        badgeProps: { variant: "amber" },
      },
      {
        value: "low",
        label: "Low",
        badgeProps: { variant: "green" },
      },
    ]

    // Category options with assigned colors and icons
    const categoryOptions: SelectItems[] = [
      {
        value: "work",
        label: "Work",
        icon: <Briefcase className="size-4" />,
        badgeProps: { variant: "blue" },
      },
      {
        value: "personal",
        label: "Personal",
        icon: <User className="size-4" />,
        badgeProps: { variant: "purple" },
      },
      {
        value: "urgent",
        label: "Urgent",
        icon: <AlertTriangle className="size-4" />,
        badgeProps: { variant: "red" },
      },
      {
        value: "low-priority",
        label: "Low Priority",
        icon: <ArrowDown className="size-4" />,
        badgeProps: { variant: "green" },
      },
      {
        value: "planning",
        label: "Planning",
        icon: <Calendar className="size-4" />,
        badgeProps: { variant: "amber" },
      },
      {
        value: "blocked",
        label: "Blocked",
        icon: <Ban className="size-4" />,
        badgeProps: { variant: "orange" },
      },
    ]

    return (
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Priority Tags</h3>
          <InputTag
            options={priorityOptions}
            formComposition={{
              label: "Task Priority",
              description: "Select priority levels for tasks",
            }}
            placeholder="Select priority levels..."
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Category Tags with Icons</h3>
          <InputTag
            options={categoryOptions}
            formComposition={{
              label: "Task Categories",
              description: "Select categories for tasks",
              iconLeft: <Tags className="size-4" />,
            }}
            placeholder="Select categories..."
          />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "InputTag with colored badges to provide visual categorization. The badge colors are specified using the `badgeProps` property on each option. This can be useful for color-coding categories, priority levels, or statuses.",
      },
    },
  },
}

/**
 * Examples of InputTag with icons.
 */
export const WithIcons: Story = {
  render: () => {
    const countryOptions = [
      {
        value: "us",
        label: "United States",
        icon: <Flag className="text-blue-500" />,
      },
      {
        value: "gb",
        label: "United Kingdom",
        icon: <Flag className="text-red-500" />,
      },
      {
        value: "fr",
        label: "France",
        icon: <Flag className="text-indigo-500" />,
      },
      {
        value: "de",
        label: "Germany",
        icon: <Flag className="text-yellow-500" />,
      },
      {
        value: "jp",
        label: "Japan",
        icon: <Flag className="text-red-600" />,
      },
    ]

    return (
      <InputTag
        options={countryOptions}
        formComposition={{
          label: "Countries",
          description: "Select or type countries",
          iconLeft: <Globe className="size-4" />,
        }}
        placeholder="Enter countries..."
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: "InputTag with icons to provide visual context for options.",
      },
    },
  },
}

/**
 * Example demonstrating the ability to disable duplicates or allow them.
 */
export const DuplicateHandling: Story = {
  render: () => {
    const [allowDupes, setAllowDupes] = useState(false)

    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          <Button
            variant={allowDupes ? "default" : "outline"}
            onClick={() => setAllowDupes(false)}
          >
            Prevent Duplicates
          </Button>
          <Button
            variant={allowDupes ? "outline" : "default"}
            onClick={() => setAllowDupes(true)}
          >
            Allow Duplicates
          </Button>
        </div>

        <InputTag
          options={techOptions}
          allowDuplicates={allowDupes}
          formComposition={{
            label: "Technologies",
            description: allowDupes
              ? "Duplicate tags are allowed"
              : "Duplicate tags will be prevented",
          }}
          placeholder="Enter technologies..."
        />

        <div className="text-sm text-muted-foreground">
          Try entering the same tag multiple times to see the behavior
          difference. When duplicates are allowed, a tooltip will show the
          count.
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates how the component handles duplicate tags. When duplicates are not allowed, attempting to add the same tag again will be prevented. When allowed, duplicates will be added and marked with a red badge with a tooltip showing the count.",
      },
    },
  },
}

/**
 * Example of InputTag in a form with React Hook Form.
 */
export const InForm: Story = {
  render: function FormExample() {
    // Form setup
    const formSchema = z.object({
      skills: z
        .array(z.string())
        .min(2, { message: "Please select at least 2 skills" }),
      categories: z
        .array(z.string())
        .min(1, { message: "Please select at least one category" }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        skills: ["react"],
        categories: [],
      },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
      alert(JSON.stringify(values, null, 2))
    }

    const categoryOptions: SelectItems[] = [
      { value: "frontend", label: "Frontend", badgeProps: { variant: "blue" } },
      { value: "backend", label: "Backend", badgeProps: { variant: "green" } },
      { value: "devops", label: "DevOps", badgeProps: { variant: "cyan" } },
      { value: "design", label: "Design", badgeProps: { variant: "purple" } },
    ]

    return (
      <ZodSchemaProvider schema={formSchema}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <InputTagForm
              control={form.control}
              name="skills"
              options={techOptions}
              formComposition={{
                label: "Skills",
                description: "Add your programming skills (min 2 required)",
                labelPosition: "horizontal",
              }}
              placeholder="Enter skills..."
            />

            <InputTagForm
              control={form.control}
              name="categories"
              options={categoryOptions}
              mode="select"
              formComposition={{
                label: "Categories",
                description: "Select at least one category",
                labelPosition: "horizontal",
              }}
              placeholder="Select categories..."
            />

            <div className="flex justify-end gap-2">
              <Button type="submit">Submit</Button>
              <Button
                type="reset"
                onClick={() => form.reset()}
                variant="outline"
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </ZodSchemaProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "InputTag components integrated with React Hook Form and Zod validation. This shows how to use the InputTagForm component which connects InputTag to form libraries.",
      },
    },
  },
}

/**
 * Example demonstrating the history/undo functionality.
 */
export const HistoryAndUndo: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <InputTag
          options={techOptions}
          formComposition={{
            label: "Technologies with Undo/Redo",
            description:
              "Try using Ctrl+Z to undo and Ctrl+Y or Ctrl+Shift+Z to redo tag changes",
          }}
          placeholder="Enter tags and use keyboard shortcuts..."
          historyOptions={{
            maxHistory: 10, // Store up to 10 history states
          }}
        />

        <div className="rounded-md bg-muted p-3 text-sm">
          <p className="font-medium">Keyboard shortcuts:</p>
          <ul className="mt-2 list-disc pl-5 text-muted-foreground">
            <li>Add tags by typing and pressing Tab or comma</li>
            <li>Select a tag by clicking on it</li>
            <li>Delete selected tag with Delete or Backspace</li>
            <li>
              Use ← → arrow keys to navigate between tags when input is empty
            </li>
            <li>Press Ctrl+Z to undo the last change</li>
            <li>Press Ctrl+Y or Ctrl+Shift+Z to redo</li>
          </ul>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the history tracking functionality built into the InputTag component. Users can undo and redo tag additions and removals using standard keyboard shortcuts. The `shouldFilter: false` property is crucial here as it disables the component's built-in client-side filtering, allowing the server to handle filtering based on search input instead.",
      },
    },
  },
}

/**
 * Example with server-side data fetching.
 */

/**
 * Example with server-side data fetching in a form.
 */
export const ServerSideFetchingInForm: Story = {
  render: function ServerSideFormExample() {
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [countriesCache, setCountriesCache] = useState<Map<string, any>>(
      new Map()
    )

    // Form setup
    const formSchema = z.object({
      countries: z
        .array(z.string())
        .min(1, "Please select at least one country"),
    })

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        countries: ["US", "CA"],
      },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
      // Display selected values
      const selectedCountries = values.countries
        .filter((code) => countriesCache.has(code))
        .map((code) => countriesCache.get(code)?.name?.common)
        .join(", ")

      alert(`Form submitted!\nCountries: ${selectedCountries || "None"}`)
    }

    // Debounce the search input
    useEffect(() => {
      if (search) {
        setIsTyping(true)
      }

      const timer = setTimeout(() => {
        setDebouncedSearch(search)
        setIsTyping(false)
      }, 300)

      return () => clearTimeout(timer)
    }, [search])

    // Fetch country list based on search term
    const { data, isLoading: isLoadingResults } = useQuery({
      queryKey: ["countries", debouncedSearch],
      queryFn: async () => {
        const url = debouncedSearch
          ? `https://restcountries.com/v3.1/name/${debouncedSearch}`
          : "https://restcountries.com/v3.1/alpha?codes=US,CA,GB,FR,DE,JP&fields=name,flags,cca2"

        const response = await fetch(url)

        if (!response.ok) {
          if (response.status === 404) {
            return []
          }
          throw new Error("Network response was not ok")
        }

        const data = await response.json()

        // Update our cache with these results - using callback pattern
        setCountriesCache((prev) => {
          const newCache = new Map(prev)
          const countries = data
          countries.forEach((country: any) => {
            newCache.set(country.cca2, country)
          })
          return newCache
        })

        return data
      },
      refetchOnWindowFocus: false,
    })

    // Fetch specific country details for form's selected values
    const { isLoading: formSelectedCountryDataLoading } = useQuery({
      queryKey: ["selectedCountries", form.watch("countries")],
      queryFn: async () => {
        const countryCodes = form.watch("countries")
        if (!countryCodes || countryCodes.length === 0) return []

        // Filter out codes we already have in our cache
        const codesToFetch = countryCodes.filter(
          (code) => !countriesCache.has(code)
        )
        if (codesToFetch.length === 0) return []

        const codes = codesToFetch.join(",")
        const response = await fetch(
          `https://restcountries.com/v3.1/alpha?codes=${codes}`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch selected countries")
        }

        const data = await response.json()

        // Update our cache with these results - using callback pattern
        setCountriesCache((prev) => {
          const newCache = new Map(prev)
          data.forEach((country: any) => {
            newCache.set(country.cca2, country)
          })
          return newCache
        })

        return data
      },
      enabled: form.watch("countries")?.length > 0,
      refetchOnWindowFocus: false,
    })

    const isLoading = isTyping || isLoadingResults

    // Memoize country options to avoid recreation on each render
    const countryOptions = useMemo(() => {
      if (!data) return []

      return data.map((country: any) => ({
        value: country.cca2,
        label: country.name.common,
        icon: country.flags?.svg || country.flags?.png,
      }))
    }, [data])

    // Create display values for selected countries using the cache
    const formSelectedCountries = useMemo(() => {
      const orderedCountryCodes = form.watch("countries") || []
      const selectedItems: SelectItems[] = []

      for (const code of orderedCountryCodes) {
        // Try to find the country in our cache
        const country = countriesCache.get(code)

        if (country) {
          selectedItems.push({
            value: country.cca2,
            label: country.name.common,
            icon: country.flags?.svg || country.flags?.png,
            badgeProps: { variant: "blue" },
          })
        } else if (formSelectedCountryDataLoading) {
          // Only show loading state for countries not found in cache
          selectedItems.push({
            value: code,
            label: `Loading ${code}...`,
            icon: <Loader2Icon className="size-4 animate-spin" />,
            badgeProps: {
              clearBtn: false,
            },
          })
        }
      }

      return selectedItems
    }, [
      form.watch("countries"),
      countriesCache,
      formSelectedCountryDataLoading,
    ])

    return (
      <ZodSchemaProvider schema={formSchema}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <InputTagForm
              control={form.control}
              name="countries"
              options={countryOptions}
              mode="select" // Force select-only mode
              formComposition={{
                label: "Countries",
                description: "Search and select countries",
                iconLeft: <Globe className="size-4" />,
              }}
              placeholder="Search countries..."
              customDisplayValue={formSelectedCountries}
              commandProps={{
                shouldFilter: false,
              }}
              loading={isLoading}
              onSearchChange={setSearch}
            />

            <div className="flex justify-end gap-2">
              <Button type="submit">Submit</Button>
              <Button
                type="reset"
                onClick={() => form.reset()}
                variant="outline"
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </ZodSchemaProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "InputTag with server-side data fetching integrated in a form with React Hook Form and Zod validation. Demonstrates handling of selected values that are not in the current search results and maintains selected data in a cache.",
      },
    },
  },
}

/**
 * Simplified example with server-side data fetching in a form.
 */
export const ServerSideFetchingInSimpleForm: Story = {
  render: function SimpleServerSideFormExample() {
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Form setup
    const formSchema = z.object({
      tailwind_classes: z
        .array(z.string())
        .min(1, "Please select at least one CSS class"),
    })

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        tailwind_classes: ["flex", "p-4", "rounded"],
      },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
      alert(`Applied Tailwind classes: ${values.tailwind_classes.join(" ")}`)
    }

    // Simulate server-side data fetching with a timeout
    useEffect(() => {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 200)

      return () => clearTimeout(timer)
    }, [search])

    // Simplified mock CSS classes filtered by search term
    const tailwindClasses = useMemo(() => {
      const allClasses = [
        // Layout
        { value: "flex", label: "flex" },
        { value: "grid", label: "grid" },
        { value: "block", label: "block" },
        // Spacing
        { value: "p-2", label: "p-2" },
        { value: "p-4", label: "p-4" },
        { value: "m-2", label: "m-2" },
        // Colors
        { value: "bg-blue-100", label: "bg-blue-100" },
        { value: "bg-red-100", label: "bg-red-100" },
        { value: "text-blue-500", label: "text-blue-500" },
        // Borders
        { value: "rounded", label: "rounded" },
        { value: "border", label: "border" },
      ]

      if (!search) return allClasses

      // Simple client-side filtering (simulating server filtering)
      return allClasses.filter((item) =>
        item.value.toLowerCase().includes(search.toLowerCase())
      )
    }, [search])

    // Preview component showing applied classes
    const PreviewComponent = () => {
      const classes = form.watch("tailwind_classes")
      return (
        <div className="mt-4 rounded-lg border border-gray-200 p-4">
          <p className="mb-2 text-xs text-muted-foreground">Preview:</p>
          <div className={classes.join(" ")}>Element with Tailwind classes</div>
          <p className="mt-2 text-xs text-muted-foreground">
            Applied classes: <code>{classes.join(" ")}</code>
          </p>
        </div>
      )
    }

    return (
      <ZodSchemaProvider schema={formSchema}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputTagForm
              control={form.control}
              name="tailwind_classes"
              options={tailwindClasses}
              onSearchChange={(value) => {
                setSearch(value)
              }}
              loading={isLoading}
              formComposition={{
                label: "Tailwind CSS Classes",
                description:
                  "Search and select Tailwind classes, or type custom ones",
                iconLeft: <Code className="size-4" />,
              }}
              placeholder="Search classes..."
              triggerKeys={[" "]}
            />

            <PreviewComponent />

            <Button type="submit">Apply Classes</Button>
          </form>
        </Form>
      </ZodSchemaProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "A simplified version of server-side fetching integrated with a form. This example uses Tailwind CSS classes as suggestions and shows a live preview of the applied classes.",
      },
    },
  },
}

/**
 * Example demonstrating the two input modes: default and select-only.
 */
export const InputModes: Story = {
  render: () => {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Default Mode</h3>
          <InputTag
            options={techOptions}
            mode="default"
            formComposition={{
              label: "Technologies",
              description:
                "Type to add custom tags or select from suggestions (default mode)",
            }}
            placeholder="Enter technologies..."
          />
          <div className="text-sm text-muted-foreground">
            In default mode, you can both create custom tags by typing and
            pressing Tab/comma, or select from the suggestion dropdown.
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Select-Only Mode</h3>
          <InputTag
            options={techOptions}
            mode="select"
            formComposition={{
              label: "Technologies",
              description:
                "Only tags from the predefined list can be selected (select mode)",
            }}
            placeholder="Select technologies..."
          />
          <div className="text-sm text-muted-foreground">
            In select mode, only tags from the predefined options can be
            selected. The component won't allow creating custom tags from free
            text.
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the two input modes available: 'default' which allows both free text entry and selecting from options, and 'select' which only allows selecting from predefined options.",
      },
    },
  },
}

/**
 * Example demonstrating focus behaviors.
 */
export const FocusBehaviors: Story = {
  render: () => {
    const [minChars, setMinChars] = useState(0)

    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Show Suggestions Immediately</h3>
          <InputTag
            options={techOptions}
            minCharToSearch={0}
            formComposition={{
              label: "Technologies",
              description:
                "Dropdown appears as soon as input is focused (minCharToSearch: 0)",
            }}
            placeholder="Focus to see suggestions..."
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Show Suggestions After Typing</h3>
          <div className="flex gap-2 pb-2">
            <Button
              variant={minChars === 1 ? "default" : "outline"}
              onClick={() => setMinChars(1)}
              size="sm"
            >
              1 character
            </Button>
            <Button
              variant={minChars === 2 ? "default" : "outline"}
              onClick={() => setMinChars(2)}
              size="sm"
            >
              2 characters
            </Button>
            <Button
              variant={minChars === 3 ? "default" : "outline"}
              onClick={() => setMinChars(3)}
              size="sm"
            >
              3 characters
            </Button>
          </div>
          <InputTag
            options={techOptions}
            minCharToSearch={minChars}
            formComposition={{
              label: "Technologies",
              description: `Dropdown appears after typing ${minChars} character(s)`,
            }}
            placeholder={`Type ${minChars} character(s) to see suggestions...`}
          />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates different focus behaviors based on the `minCharToSearch` prop. Setting to 0 shows suggestions immediately on focus, while higher values require typing that many characters before showing suggestions.",
      },
    },
  },
}
