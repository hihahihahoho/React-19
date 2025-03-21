import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import { Select } from "@/components/ui/select/select"
import { SelectCommandVirtualize } from "@/components/ui/select/select-command-virtualize"
import { SelectForm } from "@/components/ui/select/select-form"
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
  useQueryClient,
} from "@tanstack/react-query"
import axios from "axios"
import {
  Flag,
  GlobeIcon,
  Loader2Icon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

/**
 * Select component allows users to choose a single value from a list of options.
 */
const meta = {
  title: "Forms/Select",
  component: Select,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Select components allow users to choose a single option from a dropdown list.
They are useful when you have a list of options but want to save space by showing them only when needed.

## When to use
- When users need to select one option from a list
- When space is limited and you want to keep the UI clean

## Accessibility
- Selects are keyboard navigable
- Proper ARIA roles and attributes are applied
- Label associations are maintained for screen readers
        `,
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Text displayed when no option is selected",
    },
    options: {
      description: "Array of options to display in the dropdown",
    },
    value: {
      description: "Currently selected value (controlled)",
    },
    defaultValue: {
      description: "Default selected value (uncontrolled)",
    },
    disabled: {
      control: "boolean",
      description: "Whether the select is disabled",
    },
    readonly: {
      control: "boolean",
      description: "Whether the select is read-only",
    },
    formComposition: {
      description:
        "Configuration for form composition elements like label, help text",
    },
    onValueChange: {
      description: "Function called when selection changes",
      action: "value changed",
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
} satisfies Meta<typeof Select>

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
 * Basic example of a select component.
 */
export const Basic: Story = {
  args: {
    placeholder: "Select a fruit",
    options: fruitOptions,
    formComposition: {
      label: "Favorite Fruit",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Basic select component with a list of fruit options.",
      },
    },
  },
}

/**
 * Example with grouped options.
 */
export const GroupedOptions: Story = {
  args: {
    placeholder: "Select a food item",
    options: groupedOptions,
    formComposition: {
      label: "Food Item",
      description: "Choose your favorite food item",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Select with options organized into groups.",
      },
    },
  },
}

/**
 * Examples of different select states.
 */
export const SelectStates: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <Select
        options={fruitOptions}
        formComposition={{
          label: "Default",
          description: "Interactive select",
        }}
        placeholder="Select a fruit"
      />

      <Select
        options={fruitOptions}
        formComposition={{
          label: "Disabled",
          description: "Cannot be interacted with",
        }}
        placeholder="Select a fruit"
        disabled
      />

      <Select
        options={fruitOptions}
        defaultValue="apple"
        formComposition={{
          label: "Read-only",
          description: "Can't be changed",
        }}
        readonly
      />

      <Select
        options={fruitOptions}
        formComposition={{
          label: "With default value",
        }}
        defaultValue="banana"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Select fields in various states including default, disabled, read-only, and with a default value.",
      },
    },
  },
}

/**
 * Examples of selects with different label positions.
 */
export const LabelPositioning: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <Select
        options={fruitOptions}
        formComposition={{
          label: "Vertical label (default)",
          description: "Label appears above the select",
        }}
        placeholder="Select a fruit"
      />

      <Select
        options={fruitOptions}
        formComposition={{
          label: "Horizontal label",
          labelPosition: "horizontal",
          description: "Label appears to the left of the select",
        }}
        placeholder="Select a fruit"
      />

      <Select
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
        placeholder="Select a fruit"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Select fields with different label positioning options.",
      },
    },
  },
}

/**
 * Examples of selects with icons.
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
        <Select
          options={countryOptions}
          formComposition={{
            label: "Select Country",
            iconLeft: <GlobeIcon />,
          }}
          placeholder="Choose a country"
        />

        <Select
          options={[
            {
              value: "email",
              label: "Email",
              icon: <MailIcon />,
            },
            {
              value: "phone",
              label: "Phone",
              icon: <PhoneIcon />,
            },
            {
              value: "address",
              label: "Address",
              icon: <MapPinIcon />,
            },
          ]}
          formComposition={{
            label: "Contact Method",
          }}
          placeholder="How should we contact you?"
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Select fields with icons to provide visual context.",
      },
    },
  },
}

/**
 * Example of a select in a form with pre-fetched data.
 */
export const SelectInFormWithFetchedData: Story = {
  render: function FormWithFetchedDataExample() {
    // Form setup
    const FormSchema = z.object({
      country: z.string().min(1, "Please select a country"),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        country: "",
      },
    })

    function onSubmit(values: z.infer<typeof FormSchema>) {
      // Display the selected values
      const countryName = countryOptions.find(
        (c) => c.value === values.country
      )?.label
      alert(`Form submitted!\nCountry: ${countryName || values.country}`)
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
      <ZodSchemaProvider schema={FormSchema}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <SelectForm
              name="country"
              control={form.control}
              options={countryOptions}
              formComposition={{
                label: "Country",
                description: "Select your country",
                iconLeft: !form.watch("country").length ? (
                  isLoading ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <GlobeIcon className="size-4" />
                  )
                ) : undefined,
                requiredSymbol: true,
              }}
              placeholder="Choose a country"
              selectCommandProps={{
                loading: isLoading,
                // Show search only if we have a significant number of options
                minItemsToShowSearch: 5,
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
    reactQuery: {
      devtools: true,
    },
    docs: {
      description: {
        story:
          "A simple form with a Select component that fetches countries data once on component mount. This example demonstrates fetching data separately from the search functionality, which is suitable when you have a manageable list of options that don't require server-side filtering.",
      },
    },
  },
}

/**
 * Example with server-side data fetching in a form.
 */
export const ServerSideFetchingOnSearchInForm: Story = {
  render: function ServerSideFormExample() {
    const [search, setSearch] = useState("")
    const queryClient = useQueryClient()

    const countriesData =
      queryClient.getQueryData<any[]>(["countries", "cache"]) || []

    // Form setup
    const FormSchema = z.object({
      country: z.string().min(1, "Please select a country"),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        country: "VN", // Vietnam
      },
    })

    // Fetch country list based on search term
    const { data, isLoading: isLoadingResults } = useQuery({
      queryKey: ["countries", search], // Use search directly, not debounced search
      queryFn: async ({ signal }) => {
        // React Query provides the AbortSignal
        // If we have a search term, fetch filtered results
        // Otherwise fetch the default options or a limited set
        const selectedCode = form.watch("country")
        const defaultCountries = [
          "VN",
          "US",
          "CA",
          "GB",
          "FR",
          "DE",
          "JP",
          "AU",
        ]

        const url = search
          ? `https://restcountries.com/v3.1/name/${search}`
          : `https://restcountries.com/v3.1/alpha?codes=${[selectedCode, ...defaultCountries].join(",")}&fields=name,flags,cca2`

        try {
          const { data } = await axios.get(url, { signal })

          const countries = Array.isArray(data) ? data : [data]

          // Merge new countries with existing cache
          const updatedCache = [...countriesData]

          countries.forEach((country) => {
            const existingIndex = updatedCache.findIndex(
              (c) => c.cca2 === country.cca2
            )
            if (existingIndex >= 0) {
              updatedCache[existingIndex] = country
            } else {
              updatedCache.push(country)
            }
          })

          // Update the cache
          queryClient.setQueryData(["countries", "cache"], updatedCache)

          return countries
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
              return []
            }
          }
          throw error
        }
      },
      refetchOnWindowFocus: false,
      enabled: search.length > 0 || search.length === 0, // Only run if empty or 3+ characters
      // Add built-in debounce instead of setTimeout
      refetchOnMount: true,
      staleTime: 0,
      gcTime: 5 * 60 * 1000,
      // Don't keep fetching when typing fast
    })

    const isLoading = isLoadingResults

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

    // Create display value for selected country using the query cache
    const formSelectedCountry = useMemo(() => {
      const selectedCountryCode = form.watch("country")
      if (!selectedCountryCode) return undefined

      // First check if the selected country is in the current search results
      const fromResults = countryOptions.find(
        (option) => option.value === selectedCountryCode
      )
      if (fromResults) return fromResults

      // Then check our central cache
      const cachedCountry = countriesData.find(
        (c) => c.cca2 === selectedCountryCode
      )

      if (cachedCountry) {
        return {
          value: cachedCountry.cca2,
          label: cachedCountry.name.common,
          icon: cachedCountry.flags?.svg || cachedCountry.flags?.png,
        }
      }

      // If not found anywhere, show a simple loading state
      return {
        value: selectedCountryCode,
        label: `Loading ${selectedCountryCode}...`,
        icon: <Loader2Icon className="size-4 animate-spin" />,
      }
    }, [form.watch("country"), countryOptions, countriesData])

    function onSubmit(values: z.infer<typeof FormSchema>) {
      // Get country data from the query cache to display proper name
      const countriesData =
        queryClient.getQueryData<any[]>(["countries", "cache"]) || []
      const country = countriesData.find((c) => c.cca2 === values.country)

      alert(`Selected country: ${country?.name?.common || values.country}`)
    }

    return (
      <ZodSchemaProvider schema={FormSchema}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <SelectForm
              name="country"
              control={form.control}
              options={countryOptions}
              formComposition={{
                label: "Country",
                description: "Search and select your country",
                iconLeft: !formSelectedCountry ? (
                  isLoading ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <GlobeIcon className="size-4" />
                  )
                ) : undefined,
                requiredSymbol: true,
              }}
              customDisplayValue={formSelectedCountry}
              selectCommandProps={{
                loading: isLoading,
                minItemsToShowSearch: -1,
                shouldFilter: false, // Important! Disable client-side filtering
                commandInputProps: {
                  value: search,
                  onValueChange: (value) => {
                    setSearch(value) // React Query will handle debouncing internally
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
    reactQuery: {
      devtools: true,
    },
    docs: {
      description: {
        story:
          "Select with server-side data fetching using Axios and React Query. This implementation automatically handles cancellation of pending requests when new searches are triggered. No manual debounce setTimeout needed.",
      },
    },
  },
}

/**
 * Example of a select with virtualization for efficient rendering of large datasets.
 */
export const VirtualizedSelect: Story = {
  render: function VirtualizedLargeDatasetExample() {
    const [isLoading, setIsLoading] = useState(true)
    const [largeOptions, setLargeOptions] = useState<SelectItems[]>([])

    // Generate a large dataset of 1000 items
    useEffect(() => {
      const generateLargeDataset = () => {
        setIsLoading(true)

        // Create an array of 1000 items
        const items: SelectItems[] = Array.from(
          { length: 1000 },
          (_, index) => {
            return {
              value: `item-${index}`,
              label: `Item ${index} - ${Math.random().toString(36).substring(2, 10)}`,
              description: `Description for item ${index}`,
              keywords: [`keyword-${index}`, `tag-${index % 10}`],
            }
          }
        )

        setLargeOptions(items)
        setIsLoading(false)
      }

      // Simulate network delay
      const timer = setTimeout(generateLargeDataset, 500)
      return () => clearTimeout(timer)
    }, [])

    // Using SelectForm here to demonstrate in a more realistic context
    const FormSchema = z.object({
      item: z.string().min(1, "Please select an item"),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        item: "",
      },
    })

    function onSubmit(values: z.infer<typeof FormSchema>) {
      const selectedItem = largeOptions.find(
        (item) => item.value === values.item
      )
      alert(`Selected: ${selectedItem?.label || values.item}`)
    }

    return (
      <ZodSchemaProvider schema={FormSchema}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <SelectForm
              name="item"
              control={form.control}
              options={largeOptions}
              formComposition={{
                label: "Select Item",
                description: "Virtualized select with 1000 items",
                requiredSymbol: true,
              }}
              placeholder="Choose from 1000 items"
              selectCommandProps={{
                loading: isLoading,
                minItemsToShowSearch: 5,
                virtualizerOptions: {
                  overscan: 20,
                  estimateSize: () => 40,
                },
              }}
              virtualComponents={SelectCommandVirtualize}
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
          "This example demonstrates a virtualized Select component that efficiently handles a large dataset (1000 items). Using the `SelectCommandVirtualize` component with the `virtualComponents` prop enables windowed rendering, where only visible items are actually rendered in the DOM. The `virtualizerOptions` prop allows fine-tuning the virtualization behavior, such as setting the estimated item size and overscan. This approach dramatically improves performance when working with long lists by reducing memory usage and DOM nodes.",
      },
    },
  },
}
