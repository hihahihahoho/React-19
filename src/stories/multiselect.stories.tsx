/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import { MultiSelect } from "@/components/ui/select/multiselect"
import { MultiSelectForm } from "@/components/ui/select/multiselect-form"
import {
  SelectGroup,
  SelectItems,
} from "@/components/ui/select/select-interface"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Meta, StoryObj } from "@storybook/react"
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query"
import {
  AlertTriangleIcon,
  ArrowDownIcon,
  BanIcon,
  BriefcaseIcon,
  BugIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClipboardIcon,
  EyeIcon,
  FileTextIcon,
  Flag,
  GlobeIcon,
  ListIcon,
  Loader2Icon,
  PlusCircleIcon,
  StarIcon,
  TagIcon,
  TimerIcon,
  User,
  ZapIcon,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

/**
 * MultiSelect component allows users to choose multiple values from a list of options.
 */
const meta = {
  title: "Forms/MultiSelect",
  component: MultiSelect,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
MultiSelect components allow users to choose multiple options from a dropdown list.
They are useful when you want to allow multiple selections from a set of options.

## When to use
- When users need to select multiple options from a list
- When showing multiple selections in a compact interface is important
- When filtering or categorizing items by multiple attributes

## Accessibility
- MultiSelects are keyboard navigable
- Proper ARIA roles and attributes are applied
- Selected items can be removed individually
        `,
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Text displayed when no options are selected",
    },
    options: {
      description: "Array of options to display in the dropdown",
    },
    value: {
      description: "Currently selected values (controlled)",
    },
    defaultValue: {
      description: "Default selected values (uncontrolled)",
    },
    disabled: {
      control: "boolean",
      description: "Whether the multiselect is disabled",
    },
    readonly: {
      control: "boolean",
      description: "Whether the multiselect is read-only",
    },
    formComposition: {
      description:
        "Configuration for form composition elements like label, help text",
    },
    onValueChange: {
      description: "Function called when selection changes",
      action: "values changed",
    },
    bagdeGroupProps: {
      description:
        "Configuration for the badge group display behavior including maxShownItems and overflowState",
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
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

// Sample options
const fruitOptions: SelectItems[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Orange" },
  { value: "strawberry", label: "Strawberry" },
  { value: "grape", label: "Grape" },
  { value: "watermelon", label: "Watermelon" },
]

// Grouped options
const groupedOptions: SelectGroup[] = [
  {
    heading: "Fruits",
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange" },
    ],
  },
  {
    heading: "Vegetables",
    options: [
      { value: "carrot", label: "Carrot" },
      { value: "broccoli", label: "Broccoli" },
      { value: "cucumber", label: "Cucumber" },
    ],
  },
]

/**
 * Basic example of a multiselect component.
 */
export const Basic: Story = {
  args: {
    placeholder: "Select fruits",
    options: fruitOptions,
    formComposition: {
      label: "Favorite Fruits",
      description: "Select multiple fruits",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Basic multiselect component with a list of fruit options.",
      },
    },
  },
}

/**
 * Example with grouped options.
 */
export const GroupedOptions: Story = {
  args: {
    placeholder: "Select food items",
    options: groupedOptions,
    formComposition: {
      label: "Food Items",
      description: "Choose your favorite foods",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "MultiSelect with options organized into groups.",
      },
    },
  },
}

/**
 * Examples of different multiselect states.
 */
export const MultiSelectStates: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <MultiSelect
        options={fruitOptions}
        formComposition={{
          label: "Default",
          description: "Interactive multiselect",
        }}
        placeholder="Select fruits"
      />

      <MultiSelect
        options={fruitOptions}
        formComposition={{
          label: "Disabled",
          description: "Cannot be interacted with",
        }}
        placeholder="Select fruits"
        disabled
      />

      <MultiSelect
        options={fruitOptions}
        defaultValue={["apple", "banana"]}
        formComposition={{
          label: "Read-only",
          description: "Can't be changed",
        }}
        readonly
      />

      <MultiSelect
        options={fruitOptions}
        formComposition={{
          label: "With default value",
        }}
        defaultValue={["apple", "banana"]}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "MultiSelect fields in various states including default, disabled, read-only, and with default values.",
      },
    },
  },
}

/**
 * Examples of multiselects with different label positions.
 */
export const LabelPositioning: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <MultiSelect
        options={fruitOptions}
        formComposition={{
          label: "Vertical label (default)",
          description: "Label appears above the multiselect",
        }}
        placeholder="Select fruits"
      />

      <MultiSelect
        options={fruitOptions}
        formComposition={{
          label: "Horizontal label",
          labelPosition: "horizontal",
          description: "Label appears to the left of the multiselect",
        }}
        placeholder="Select fruits"
      />

      <MultiSelect
        options={fruitOptions}
        formComposition={{
          label: "Custom layout",
          labelPosition: "horizontal",
          layout: {
            leftColClass: "md:col-span-3",
            rightColClass: "md:col-span-9",
          },
          description: "With custom column sizes",
        }}
        placeholder="Select fruits"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "MultiSelect fields with different label positioning options.",
      },
    },
  },
}

/**
 * MultiSelect with colored badges.
 */
export const ColoredBadges: Story = {
  render: () => {
    // Array of items with different colors assigned
    const colorOptions: SelectItems[] = [
      {
        value: "red",
        label: "Red",
        badgeProps: { variant: "red" },
      },
      {
        value: "blue",
        label: "Blue",
        badgeProps: { variant: "blue" },
      },
      {
        value: "green",
        label: "Green",
        badgeProps: { variant: "green" },
      },
      {
        value: "yellow",
        label: "Yellow",
        badgeProps: { variant: "yellow" },
      },
      {
        value: "purple",
        label: "Purple",
        badgeProps: { variant: "purple" },
      },
      {
        value: "orange",
        label: "Orange",
        badgeProps: { variant: "orange" },
      },
      {
        value: "teal",
        label: "Teal",
        badgeProps: { variant: "teal" },
      },
      {
        value: "pink",
        label: "Pink",
        badgeProps: { variant: "pink" },
      },
      {
        value: "indigo",
        label: "Indigo",
        badgeProps: { variant: "indigo" },
      },
      {
        value: "cyan",
        label: "Cyan",
        badgeProps: { variant: "cyan" },
      },
    ]

    // Category options with assigned colors and icons
    const categoryOptions: SelectItems[] = [
      {
        value: "work",
        label: "Work",
        icon: <BriefcaseIcon className="size-4" />,
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
        icon: <AlertTriangleIcon className="size-4" />,
        badgeProps: { variant: "red" },
      },
      {
        value: "low-priority",
        label: "Low Priority",
        icon: <ArrowDownIcon className="size-4" />,
        badgeProps: { variant: "green" },
      },
      {
        value: "planning",
        label: "Planning",
        icon: <CalendarIcon className="size-4" />,
        badgeProps: { variant: "amber" },
      },
      {
        value: "blocked",
        label: "Blocked",
        icon: <BanIcon className="size-4" />,
        badgeProps: { variant: "orange" },
      },
    ]

    return (
      <div className="flex w-full flex-col gap-4">
        <MultiSelect
          options={colorOptions}
          formComposition={{
            label: "Color Selection",
            description: "Choose colors (badges match the selected color)",
          }}
          placeholder="Select colors"
          defaultValue={["red", "blue", "green"]}
          bagdeGroupProps={{
            maxShownItems: 8,
          }}
        />

        <MultiSelect
          options={categoryOptions}
          formComposition={{
            label: "Task Categories",
          }}
          placeholder="Select categories"
          defaultValue={["urgent", "work"]}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "MultiSelect with colored badges to provide visual categorization. The badge colors are specified using the `badgeProps` property on each option. This can be useful for color-coding categories, priority levels, or statuses.",
      },
    },
  },
}

/**
 * Examples of MultiSelect with button variant styling.
 */
export const ButtonVariant: Story = {
  render: () => {
    const categoryOptions: SelectItems[] = [
      {
        value: "work",
        label: "Work",
        icon: <BriefcaseIcon className="size-4" />,
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
        icon: <AlertTriangleIcon className="size-4" />,
        badgeProps: { variant: "red" },
      },
      {
        value: "low-priority",
        label: "Low Priority",
        icon: <ArrowDownIcon className="size-4" />,
        badgeProps: { variant: "green" },
      },
    ]

    const statusOptions: SelectItems[] = [
      {
        value: "todo",
        label: "To Do",
        icon: <ClipboardIcon className="size-4" />,
        badgeProps: { variant: "secondary" },
      },
      {
        value: "in-progress",
        label: "In Progress",
        icon: <TimerIcon className="size-4" />,
        badgeProps: { variant: "blue" },
      },
      {
        value: "review",
        label: "In Review",
        icon: <EyeIcon className="size-4" />,
        badgeProps: { variant: "purple" },
      },
      {
        value: "done",
        label: "Done",
        icon: <CheckCircleIcon className="size-4" />,
        badgeProps: { variant: "green" },
      },
    ]

    const labelOptions: SelectItems[] = [
      {
        value: "feature",
        label: "Feature",
        icon: <StarIcon className="size-4" />,
        badgeProps: { variant: "yellow" },
      },
      {
        value: "bug",
        label: "Bug",
        icon: <BugIcon className="size-4" />,
        badgeProps: { variant: "red" },
      },
      {
        value: "enhancement",
        label: "Enhancement",
        icon: <ZapIcon className="size-4" />,
        badgeProps: { variant: "blue" },
      },
      {
        value: "documentation",
        label: "Documentation",
        icon: <FileTextIcon className="size-4" />,
        badgeProps: { variant: "default" },
      },
    ]

    return (
      <div className="flex w-full flex-col gap-4">
        <h3 className="text-sm font-medium">Basic button variants</h3>
        <div className="flex flex-wrap gap-2">
          <MultiSelect
            options={categoryOptions}
            variant="button"
            formComposition={{
              iconRight: null,
              iconLeft: <PlusCircleIcon className="size-4" />,
              prefix: "Category",
            }}
            placeholder="Select"
            defaultValue={["urgent"]}
          />

          <MultiSelect
            options={statusOptions}
            variant="button"
            formComposition={{
              iconRight: null,
              iconLeft: <ListIcon className="size-4" />,
              prefix: "Status",
            }}
            placeholder="Select"
            defaultValue={["in-progress", "review"]}
          />

          <MultiSelect
            options={labelOptions}
            variant="button"
            formComposition={{
              iconRight: null,
              iconLeft: <TagIcon className="size-4" />,
              prefix: "Labels",
            }}
            placeholder="Select"
          />
        </div>

        <h3 className="mt-4 text-sm font-medium">Different styling options</h3>
        <div className="flex flex-wrap gap-2">
          <MultiSelect
            options={categoryOptions}
            variant="button"
            formComposition={{
              iconRight: null,
              iconLeft: <PlusCircleIcon className="size-4" />,
              prefix: "Category",
              className: "border-dashed",
            }}
            placeholder="Select"
          />

          <MultiSelect
            options={statusOptions}
            variant="button"
            formComposition={{
              iconRight: null,
              iconLeft: <ListIcon className="size-4 text-primary" />,
              prefix: "Status",
              className: "bg-primary/5 border-primary/20",
            }}
            placeholder="Select"
            defaultValue={["todo"]}
          />

          <MultiSelect
            options={labelOptions}
            variant="button"
            formComposition={{
              iconRight: null,
              iconLeft: <TagIcon className="size-4" />,
              prefix: "Labels",
              className: "rounded-full px-4",
            }}
            placeholder="Select"
            defaultValue={["feature", "enhancement"]}
          />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "The button variant of MultiSelect is designed for inline usage in forms, toolbars, and filter interfaces. It uses a more compact button-like appearance with a prefix label and badges for selected items. This style is useful when you need multiple multiselect controls in a horizontal layout or when you want a more action-oriented appearance.",
      },
    },
  },
}

/**
 * Examples of multiselects with icons.
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
      <div className="flex w-full flex-col gap-4">
        <MultiSelect
          options={countryOptions}
          formComposition={{
            label: "Countries",
            description: "Select multiple countries",
          }}
          placeholder="Select countries"
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: "MultiSelect fields with icons to provide visual context.",
      },
    },
  },
}

/**
 * Example of badge overflow behavior (specific to MultiSelect).
 */
export const BadgeOverflow: Story = {
  render: () => {
    // Many options for testing overflow
    const languageOptions = [
      { value: "javascript", label: "JavaScript" },
      { value: "typescript", label: "TypeScript" },
      { value: "python", label: "Python" },
      { value: "java", label: "Java" },
      { value: "csharp", label: "C#" },
      { value: "cpp", label: "C++" },
      { value: "php", label: "PHP" },
      { value: "ruby", label: "Ruby" },
      { value: "go", label: "Go" },
      { value: "rust", label: "Rust" },
    ]

    const [maxBadges, setMaxBadges] = useState(3)

    return (
      <div className="flex w-full flex-col gap-4">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Max badges to show: {maxBadges}
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={maxBadges}
            onChange={(e) => setMaxBadges(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <MultiSelect
          options={languageOptions}
          formComposition={{
            label: "Programming Languages",
            description: `Select multiple languages (showing max ${maxBadges} badges)`,
          }}
          placeholder="Select languages"
          bagdeGroupProps={{
            maxShownItems: maxBadges,
          }}
          defaultValue={[
            "javascript",
            "typescript",
            "python",
            "java",
            "csharp",
            "cpp",
            "php",
          ]}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "MultiSelect with badge overflow handling, allowing control of how many selected items are shown before collapsing into a '+X more' indicator.",
      },
    },
  },
}

/**
 * Example of a multiselect in a form with pre-fetched data.
 */
export const MultiSelectInFormWithFetchedData: Story = {
  render: function FormWithFetchedDataExample() {
    // Form setup
    const formSchema = z.object({
      countries: z
        .array(z.string())
        .min(1, "Please select at least one country"),
    })

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        countries: [],
      },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
      // Display selected values
      const selectedCountries = countryOptions
        .filter((c) => values.countries.includes(c.value))
        .map((c) => c.label)
        .join(", ")

      alert(`Form submitted!\nCountries: ${selectedCountries || "None"}`)
    }

    // Fetch countries data once when the component mounts
    const { data, isLoading } = useQuery({
      queryKey: ["allCountries"],
      queryFn: async () => {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,cca2"
        )

        if (!response.ok) {
          throw new Error("Failed to fetch countries")
        }

        const data = await response.json()
        // Sort countries alphabetically by name
        return data.sort((a: any, b: any) =>
          a.name.common.localeCompare(b.name.common)
        )
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
    })

    // Transform API data into select options
    const countryOptions: SelectItems[] = useMemo(() => {
      if (!data) return []

      return data.map((country: any) => ({
        value: country.cca2,
        label: country.name.common,
        icon: country.flags?.svg || country.flags?.png,
      }))
    }, [data])

    return (
      <ZodSchemaProvider schema={formSchema}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <MultiSelectForm
              name="countries"
              control={form.control}
              options={countryOptions}
              formComposition={{
                label: "Countries",
                description: "Select countries you've visited",
                iconLeft: isLoading ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <GlobeIcon className="size-4" />
                ),
                requiredSymbol: true,
              }}
              placeholder="Choose countries"
              selectCommandProps={{
                loading: isLoading,
                // Show search only if we have a significant number of options
                minItemsToShowSearch: 5,
              }}
              bagdeGroupProps={{
                maxShownItems: 3,
              }}
            />

            <div className="flex justify-end gap-2">
              <Button className="flex-1" type="submit" disabled={isLoading}>
                Submit
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
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
          "A form with a MultiSelect component that fetches countries data once on component mount. This example demonstrates fetching data separately from the search functionality, which is suitable when you have a manageable list of options that don't require server-side filtering.",
      },
    },
  },
}

/**
 * Example with server-side data fetching and debounce (standalone).
 */
export const ServerSideFetching: Story = {
  render: function ServerSideExample() {
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [selectedCountryCodes, setSelectedCountryCodes] = useState<string[]>(
      []
    )

    // Debounce the search input
    useEffect(() => {
      // Set typing state to true whenever search changes
      if (search) {
        setIsTyping(true)
      }

      const timer = setTimeout(() => {
        setDebouncedSearch(search)
        // Only set typing to false after debounce completes
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
          : "https://restcountries.com/v3.1/all?fields=name,flags,cca2"

        const response = await fetch(url)

        if (!response.ok) {
          if (response.status === 404) {
            return []
          }
          throw new Error("Network response was not ok")
        }

        const data = await response.json()
        return debouncedSearch ? data : data.slice(0, 10)
      },
      refetchOnWindowFocus: false,
    })

    // Show loading state when typing or when API is loading
    const isLoading = isTyping || isLoadingResults

    // Memoize country options to avoid recreation on each render
    const countryOptions = useMemo(() => {
      if (!data) return []

      return data.map((country: any) => ({
        value: country.cca2,
        label: country.name.common,
        icon: country.flags?.svg || country.flags?.png,
        keywords: [country.name.common, country.cca2],
      }))
    }, [data])

    return (
      <MultiSelect
        options={countryOptions}
        formComposition={{
          label: "Select Countries",
          description: "Type to search countries",
          iconLeft: isLoading ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            !selectedCountryCodes.length && <GlobeIcon className="size-4" />
          ),
        }}
        placeholder="Search for countries"
        value={selectedCountryCodes}
        onValueChange={setSelectedCountryCodes}
        selectCommandProps={{
          loading: isLoading,
          minItemsToShowSearch: -1,
          commandInputProps: {
            value: search,
            onValueChange: (value) => {
              setSearch(value)
            },
          },
        }}
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "MultiSelect with server-side data fetching from the REST Countries API with debounced search functionality.",
      },
    },
  },
}

/**
 * Example with server-side data fetching in a form.
 */
export const ServerSideFetchingInForm: Story = {
  render: function ServerSideFormExample() {
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [isTyping, setIsTyping] = useState(false)

    // Form setup
    const formSchema = z.object({
      countries: z
        .array(z.string())
        .min(1, "Please select at least one country"),
    })

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        countries: ["US", "CA"], // Default to US and Canada
      },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
      // Get country names from codes
      const countryNames = formSelectedCountries
        .map((c: any) => c.label)
        .join(", ")

      alert(
        `Selected countries: ${countryNames || values.countries.join(", ")}`
      )
    }

    // Debounce the search input
    useEffect(() => {
      // Set typing state to true whenever search changes
      if (search) {
        setIsTyping(true)
      }

      const timer = setTimeout(() => {
        setDebouncedSearch(search)
        // Only set typing to false after debounce completes
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
          : "https://restcountries.com/v3.1/all?fields=name,flags,cca2"

        const response = await fetch(url)

        if (!response.ok) {
          if (response.status === 404) {
            return []
          }
          throw new Error("Network response was not ok")
        }

        const data = await response.json()
        return debouncedSearch ? data : data.slice(0, 10)
      },
      refetchOnWindowFocus: false,
    })

    // Fetch specific country details for form's selected values
    const { data: formSelectedCountryData } = useQuery({
      queryKey: ["selectedCountries", form.watch("countries")],
      queryFn: async () => {
        const countryCodes = form.watch("countries")
        if (!countryCodes || countryCodes.length === 0) return []

        // Create comma-separated list of country codes
        const codes = countryCodes.join(",")

        const response = await fetch(
          `https://restcountries.com/v3.1/alpha?codes=${codes}`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch selected countries")
        }

        const data = await response.json()
        return data
      },
      enabled: form.watch("countries")?.length > 0,
      refetchOnWindowFocus: false,
    })

    // Show loading state when typing or when API is loading
    const isLoading = isTyping || isLoadingResults

    // Memoize country options to avoid recreation on each render
    const countryOptions = useMemo(() => {
      if (!data) return []

      return data.map((country: any) => ({
        value: country.cca2,
        label: country.name.common,
        icon: country.flags?.svg || country.flags?.png,
        keywords: [country.name.common, country.cca2],
      }))
    }, [data])

    // Create display values for selected countries
    const formSelectedCountries = useMemo(() => {
      // Check if any of the selected countries are in the current options
      const selectedFromCurrent = form
        .watch("countries")
        .map((code) =>
          countryOptions.find((option: any) => option.value === code)
        )
        .filter(Boolean)

      // If all selected countries are in current options, use those
      if (
        selectedFromCurrent.length === form.watch("countries").length &&
        selectedFromCurrent.every(Boolean)
      ) {
        return selectedFromCurrent as SelectItems[]
      }

      // Otherwise, use the separately fetched data
      if (formSelectedCountryData) {
        return formSelectedCountryData.map((country: any) => ({
          value: country.cca2,
          label: country.name.common,
          icon: country.flags?.svg || country.flags?.png,
        }))
      }

      // Return empty array if still loading
      return []
    }, [form, countryOptions, formSelectedCountryData])

    return (
      <ZodSchemaProvider schema={formSchema}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <MultiSelectForm
              name="countries"
              control={form.control}
              options={countryOptions}
              formComposition={{
                label: "Countries",
                description: "Search and select countries",
                iconLeft: !form.watch("countries").length && (
                  <GlobeIcon className="size-4" />
                ),
                requiredSymbol: true,
              }}
              customDisplayValue={formSelectedCountries}
              selectCommandProps={{
                loading: isLoading,
                minItemsToShowSearch: -1,
                commandInputProps: {
                  value: search,
                  onValueChange: (value) => {
                    setSearch(value)
                  },
                },
              }}
            />

            <div className="flex justify-end gap-2">
              <Button className="flex-1" type="submit" disabled={isLoading}>
                Submit
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
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
          "MultiSelect with server-side data fetching integrated in a form with React Hook Form and Zod validation. Demonstrates handling of selected values that are not in the current search results.",
      },
    },
  },
}

/**
 * Example demonstrating badge overflow state options.
 */
export const BadgeOverflowStates: Story = {
  render: () => {
    // Many options for testing overflow
    const languageOptions = [
      { value: "javascript", label: "JavaScript" },
      { value: "typescript", label: "TypeScript" },
      { value: "python", label: "Python" },
      { value: "java", label: "Java" },
      { value: "csharp", label: "C#" },
      { value: "cpp", label: "C++" },
      { value: "php", label: "PHP" },
      { value: "ruby", label: "Ruby" },
      { value: "go", label: "Go" },
      { value: "rust", label: "Rust" },
    ]

    const [maxBadges, setMaxBadges] = useState(3)

    return (
      <div className="flex w-full flex-col gap-6">
        <div className="mb-2">
          <label className="mb-2 block text-sm font-medium">
            Max badges to show: {maxBadges}
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={maxBadges}
            onChange={(e) => setMaxBadges(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Collapse Mode (Default)</h3>
          <MultiSelect
            options={languageOptions}
            formComposition={{
              label: "Programming Languages",
              description: `Shows max ${maxBadges} badges and collapses the rest with +X indicator`,
            }}
            placeholder="Select languages"
            bagdeGroupProps={{
              maxShownItems: maxBadges,
              overflowState: "collapse", // Default behavior
            }}
            defaultValue={[
              "javascript",
              "typescript",
              "python",
              "java",
              "csharp",
              "cpp",
              "php",
            ]}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">None Mode</h3>
          <MultiSelect
            options={languageOptions}
            formComposition={{
              label: "Programming Languages",
            }}
            placeholder="Select languages"
            bagdeGroupProps={{
              overflowState: "none", // No collapse, just show up to maxShownItems
            }}
            defaultValue={[
              "javascript",
              "typescript",
              "python",
              "java",
              "csharp",
              "cpp",
              "php",
            ]}
          />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "This example demonstrates the two different overflow states for badges:\n\n" +
          "- **collapse**: The default mode that shows a '+X' indicator when there are more items than can fit.\n" +
          "- **none**: Shows exactly up to `maxShownItems` badges without a '+X' indicator.\n\n" +
          "Both modes respect the `maxShownItems` setting, but handle overflow differently. " +
          "The 'collapse' mode tries to fit as many badges as possible while ensuring the '+X' indicator is visible, " +
          "while 'none' mode simply shows up to the maximum number specified.",
      },
    },
  },
}
