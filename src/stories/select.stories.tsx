import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import { Select } from "@/components/ui/select/select"
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
} from "@tanstack/react-query"
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
                iconLeft: isLoading ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <GlobeIcon />
                ),
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
    docs: {
      description: {
        story:
          "A simple form with a Select component that fetches countries data once on component mount. This example demonstrates fetching data separately from the search functionality, which is suitable when you have a manageable list of options that don't require server-side filtering.",
      },
    },
  },
}

/**
 * Example with server-side data fetching and debounce (standalone).
 */
export const ServerSideFetchingOnSearch: Story = {
  render: function ServerSideExample() {
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [selectedCountryCode, setSelectedCountryCode] = useState<
      string | undefined
    >()

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

        console.log(url)

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

    // Fetch specific country details for the selected value
    const { data: selectedCountryData, isLoading: isLoadingSelectedCountry } =
      useQuery({
        queryKey: ["country", selectedCountryCode],
        queryFn: async () => {
          if (!selectedCountryCode) return null

          const response = await fetch(
            `https://restcountries.com/v3.1/alpha/${selectedCountryCode}`
          )

          if (!response.ok) {
            throw new Error("Failed to fetch country details")
          }

          const data = await response.json()
          return data[0]
        },
        enabled: !!selectedCountryCode,
        refetchOnWindowFocus: false,
      })

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

    // Create display value for standalone select
    const customSelectedCountry = useMemo(() => {
      // If we have the country in the current search results, use that
      const fromResults = countryOptions.find(
        (option: any) => option.value === selectedCountryCode
      )
      if (fromResults) return fromResults

      // Otherwise use the separately fetched data
      if (selectedCountryData) {
        return {
          value: selectedCountryData.cca2,
          label: selectedCountryData.name.common,
          icon:
            selectedCountryData.flags?.svg || selectedCountryData.flags?.png,
        }
      }

      // Return nothing if we're still loading or have no data
      return undefined
    }, [selectedCountryCode, countryOptions, selectedCountryData])

    return (
      <Select
        options={countryOptions}
        formComposition={{
          label: "Select Country",
          description: "Type to search countries",
          iconLeft:
            (isLoadingSelectedCountry || isTyping) && !customSelectedCountry ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              !customSelectedCountry && <GlobeIcon />
            ),
        }}
        placeholder="Search for a country"
        onValueChange={(value) => {
          setSelectedCountryCode(value)
        }}
        customDisplayValue={customSelectedCountry}
        selectCommandProps={{
          loading: isLoading,
          minItemsToShowSearch: -1,
          shouldFilter: false,
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
          "Select with server-side data fetching from the REST Countries API with debounced search functionality. It's critical to set `shouldFilter: false` in selectCommandProps to disable client-side filtering, since filtering is already happening on the server. This prevents duplicate filtering and ensures the component correctly displays API-filtered results.",
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
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [isTyping, setIsTyping] = useState(false)

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

    const onSubmit = (values: z.infer<typeof FormSchema>) => {
      const countryName =
        countryOptions.find((c: any) => c.value === values.country)?.label ||
        formSelectedCountry?.label
      alert(`Selected country: ${countryName || values.country}`)
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

    // Show loading state when typing or when API is loading
    const isLoading = isTyping || isLoadingResults

    // Fetch specific country details for form's selected value
    const { data: formSelectedCountryData, isLoading: isLoadingFormCountry } =
      useQuery({
        queryKey: ["country", form.watch("country")],
        queryFn: async () => {
          const countryCode = form.watch("country")
          if (!countryCode) return null

          const response = await fetch(
            `https://restcountries.com/v3.1/alpha/${countryCode}`
          )

          if (!response.ok) {
            throw new Error("Failed to fetch country details")
          }

          const data = await response.json()
          return data[0]
        },
        enabled: !!form.watch("country"),
        refetchOnWindowFocus: false,
      })

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

    // Create display value for form select
    const formSelectedCountry = useMemo(() => {
      // Check if the selected country is in the current options
      const fromResults = countryOptions.find(
        (option: any) => option.value === form.watch("country")
      )
      if (fromResults) return fromResults

      // Otherwise use the separately fetched data
      if (formSelectedCountryData) {
        return {
          value: formSelectedCountryData.cca2,
          label: formSelectedCountryData.name.common,
          icon:
            formSelectedCountryData.flags?.svg ||
            formSelectedCountryData.flags?.png,
        }
      }

      // Return nothing if we're still loading or have no data
      return undefined
    }, [form, countryOptions, formSelectedCountryData])

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
                iconLeft:
                  (isLoadingFormCountry || isTyping) && !formSelectedCountry ? (
                    <GlobeIcon className="animate-spin" />
                  ) : (
                    !formSelectedCountry && <GlobeIcon />
                  ),
              }}
              customDisplayValue={formSelectedCountry}
              selectCommandProps={{
                loading: isLoading,
                minItemsToShowSearch: -1,
                shouldFilter: false,
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
          "Select with server-side data fetching integrated into a form with validation. Uses React Hook Form and demonstrates fetching initial value data separately. This example properly sets `shouldFilter: false` in selectCommandProps to disable client-side filtering when server-side filtering is in use, which is essential for correctly displaying API search results.",
      },
    },
  },
}

/**
 * Interactive example with all available props.
 */
export const Interactive: Story = {
  args: {
    placeholder: "Select an option",
    options: fruitOptions,
    disabled: false,
    readonly: false,
    formComposition: {
      label: "Interactive Select",
      description: "This is a customizable select field",
      variant: "default",
      size: "default",
      labelPosition: "vertical",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "A fully interactive select that can be customized using the Controls panel.",
      },
    },
  },
}
