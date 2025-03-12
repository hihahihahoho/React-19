import { Badge } from "@/components/ui/badge/badge"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import { InputAutoComplete } from "@/components/ui/input/input-auto-complete"
import { InputAutoCompleteForm } from "@/components/ui/input/input-auto-complete-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Meta, StoryObj } from "@storybook/react"
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query"
import {
  Clock,
  Globe,
  History,
  Loader2Icon,
  Map,
  Search,
  Star,
  TrendingUp,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

/**
 * InputAutoComplete component provides search functionality with autocomplete suggestions.
 * Use it when users need to select from predefined options while still allowing typing.
 */
const meta = {
  title: "Forms/InputAutoComplete",
  component: InputAutoComplete,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
InputAutoComplete provides an enhanced input field with dropdown suggestions as users type.
It supports two modes: "default" (free typing with suggestions) and "select" (only selected options are valid).

## When to use
- When users need to search from a set of predefined options
- For form fields where users should select from a list of valid choices
- When providing typeahead functionality to improve user experience

## Accessibility
- Handles keyboard navigation through suggestions
- Provides clear feedback on selection state
- Works with screen readers for accessibility
        `,
      },
    },
  },
  argTypes: {
    options: {
      description: "Array of options to display in the dropdown",
    },
    mode: {
      control: "radio",
      options: ["default", "select"],
      description:
        '"default": what you type is what you get, "select": only selected options are valid',
      table: {
        defaultValue: { summary: "default" },
      },
    },
    loading: {
      control: "boolean",
      description: "Whether the component is in a loading state",
    },
    minCharToSearch: {
      control: "number",
      description:
        "Minimum number of characters required before showing suggestions",
      table: {
        defaultValue: { summary: "1" },
      },
    },
    initialState: {
      description: "Content to display before search is triggered",
    },
    value: {
      control: "text",
      description: "Current value of the input",
    },
    onValueChange: {
      description: "Function called when the input value changes",
      action: "value changed",
    },
    popoverContentProps: {
      description: "Props to pass to the popover content component",
    },
    formComposition: {
      description:
        "Configuration for form composition elements like label, help text, etc.",
    },
  },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient()
      return (
        <QueryClientProvider client={queryClient}>
          <div className="flex items-center justify-center md:w-96">
            <Story />
          </div>
        </QueryClientProvider>
      )
    },
  ],
} satisfies Meta<typeof InputAutoComplete>

export default meta
type Story = StoryObj<typeof meta>

// Sample data for autocomplete options
const countryOptions = [
  { value: "United States", icon: "https://flagsapi.com/US/flat/64.png" },
  { value: "Canada", icon: "https://flagsapi.com/CA/flat/64.png" },
  { value: "Mexico", icon: "https://flagsapi.com/MX/flat/64.png" },
  { value: "United Kingdom", icon: "https://flagsapi.com/GB/flat/64.png" },
  { value: "France", icon: "https://flagsapi.com/FR/flat/64.png" },
  { value: "Germany", icon: "https://flagsapi.com/DE/flat/64.png" },
  { value: "Italy", icon: "https://flagsapi.com/IT/flat/64.png" },
  { value: "Spain", icon: "https://flagsapi.com/ES/flat/64.png" },
  { value: "Australia", icon: "https://flagsapi.com/AU/flat/64.png" },
  { value: "South Africa", icon: "https://flagsapi.com/ZA/flat/64.png" },
  { value: "Japan", icon: "https://flagsapi.com/JP/flat/64.png" },
  { value: "China", icon: "https://flagsapi.com/CN/flat/64.png" },
  { value: "India", icon: "https://flagsapi.com/IN/flat/64.png" },
  { value: "Brazil", icon: "https://flagsapi.com/BR/flat/64.png" },
]

const cityOptions = [
  { value: "New York City" },
  { value: "Los Angeles" },
  { value: "Chicago" },
  { value: "Houston" },
  { value: "Philadelphia" },
  { value: "Phoenix" },
  { value: "San Francisco" },
  { value: "Seattle" },
  { value: "Miami" },
  { value: "Denver" },
]

const fruitOptions = {
  heading: "Fruits",
  options: [
    { value: "Apple" },
    { value: "Banana" },
    { value: "Orange" },
    { value: "Grape" },
    { value: "Kiwi" },
  ],
}

const vegetableOptions = {
  heading: "Vegetables",
  options: [
    { value: "Carrot" },
    { value: "Broccoli" },
    { value: "Spinach" },
    { value: "Potato" },
    { value: "Onion" },
  ],
}

/**
 * Basic usage of the InputAutoComplete component.
 */
export const Basic: Story = {
  render: () => (
    <InputAutoComplete
      options={countryOptions}
      formComposition={{ label: "Country" }}
      placeholder="Type to search countries"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: "Basic usage of InputAutoComplete with country options.",
      },
    },
  },
}

/**
 * Shows different modes of operation for InputAutoComplete.
 */
export const Modes: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <InputAutoComplete
        options={countryOptions}
        formComposition={{
          label: "Default Mode",
          description: "What you type is what you get (with suggestions)",
        }}
        placeholder="Type any value"
        mode="default"
      />

      <InputAutoComplete
        options={countryOptions}
        formComposition={{
          label: "Select Mode",
          description: "Only selected options are valid",
        }}
        placeholder="Must select from options"
        mode="select"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the two modes: 'default' allows free-form input while showing suggestions, 'select' only allows selecting from the provided options.",
      },
    },
  },
}

/**
 * InputAutoComplete with initial state showing suggestion badges.
 */
export const InitialStateSuggestions: Story = {
  render: () => {
    // Mock history of recent searches
    const recentSearches = ["Paris", "Tokyo", "New York", "London", "Rome"]

    // Mock trending searches
    const trendingSearches = ["Beach vacation", "Mountain resort", "City break"]

    // Mock popular destinations
    const popularDestinations = ["Bali", "Prague", "Bangkok", "Dubai", "Sydney"]

    const badgeStyles = [
      "blue",
      "green",
      "purple",
      "amber",
      "rose",
      "indigo",
      "teal",
      "cyan",
      "emerald",
      "pink",
    ]

    const SuggestionGroups = () => (
      <div className="flex flex-col gap-4 p-3">
        {/* Recent searches */}
        <div>
          <div className="mb-2 flex items-center text-sm text-muted-foreground">
            <History className="mr-2 size-4" />
            <span>Recent Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((item, i) => (
              <Badge
                key={item}
                variant={badgeStyles[i % badgeStyles.length] as any}
                iconLeft={<Clock className="size-3" />}
              >
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* Trending searches */}
        <div>
          <div className="mb-2 flex items-center text-sm text-muted-foreground">
            <TrendingUp className="mr-2 size-4" />
            <span>Trending Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((item, i) => (
              <Badge
                key={item}
                variant={badgeStyles[(i + 3) % badgeStyles.length] as any}
                iconLeft={<TrendingUp className="size-3" />}
              >
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* Popular destinations */}
        <div>
          <div className="mb-2 flex items-center text-sm text-muted-foreground">
            <Star className="mr-2 size-4" />
            <span>Popular Destinations</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularDestinations.map((item, i) => (
              <Badge
                key={item}
                variant={badgeStyles[(i + 6) % badgeStyles.length] as any}
                iconLeft={<Star className="size-3" />}
              >
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    )

    return (
      <div className="flex w-full flex-col gap-4">
        <InputAutoComplete
          options={countryOptions}
          formComposition={{
            label: "Travel Destination",
            description: "With suggested searches as initial state",
            iconLeft: <Search className="size-4" />,
          }}
          placeholder="Search destinations"
          initialState={<SuggestionGroups />}
          minCharToSearch={1}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "InputAutoComplete with an initial state showing suggestion badges grouped by type (recent, trending, popular).",
      },
    },
  },
}

/**
 * InputAutoComplete with server-side data fetching and debounce.
 */
export const ServerSideFetchingOnSearch: Story = {
  render: function ServerSideExample() {
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [selectedCity, setSelectedCity] = useState<string | undefined>()

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

    // Fetch countries by capital city
    const { data, isLoading: isLoadingResults } = useQuery({
      queryKey: ["capitals", debouncedSearch],
      queryFn: async () => {
        if (!debouncedSearch || debouncedSearch.length < 2) {
          return []
        }

        try {
          // Use REST Countries API to search by capital city
          const response = await fetch(
            `https://restcountries.com/v3.1/capital/${encodeURIComponent(debouncedSearch)}`
          )

          if (response.status === 404) {
            // No results found
            return []
          }

          if (!response.ok) {
            throw new Error("Network response was not ok")
          }

          const data = await response.json()

          // Transform API response to SelectItems format
          return data.map((country: any) => ({
            value: country.capital[0],
            label: `${country.capital[0]} (${country.name.common})`,
            description: `Capital of ${country.name.common}`,
            // Pass icon as URL string
            icon: country.flags.svg || "",
          }))
        } catch (error) {
          console.error("Failed to fetch countries by capital:", error)
          return []
        }
      },
      staleTime: 30000,
    })

    // Show loading state when typing or when API is loading
    const isLoading = isTyping || isLoadingResults

    // Initial state with history and suggestions
    const recentSearches = ["London", "Paris", "Washington D.C."]
    const suggestedCities = ["Berlin", "Tokyo", "Ottawa"]

    // Only show initial state when search has less than 2 characters
    const showInitialState = search.length < 2

    const historyAndSuggestions = (
      <div className="flex flex-col gap-3 p-3">
        {/* Recent searches */}
        <div>
          <div className="mb-2 flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 size-4" />
            <span>Recent Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((city) => (
              <Badge
                key={city}
                variant="blue"
                iconLeft={<History className="size-3" />}
                onClick={() => {
                  setSelectedCity(city)
                  setSearch(city) // Update search when badge is clicked
                }}
              >
                {city}
              </Badge>
            ))}
          </div>
        </div>

        {/* Suggested cities */}
        <div>
          <div className="mb-2 flex items-center text-sm text-muted-foreground">
            <Star className="mr-2 size-4" />
            <span>Suggested Capital Cities</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedCities.map((city) => (
              <Badge
                key={city}
                variant="emerald"
                iconLeft={<Map className="size-3" />}
                onClick={() => {
                  setSelectedCity(city)
                  setSearch(city) // Update search when badge is clicked
                }}
              >
                {city}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-1 border-t pt-2 text-center text-xs text-muted-foreground">
          Type at least 2 characters to search for capital cities
        </div>
      </div>
    )

    return (
      <InputAutoComplete
        value={selectedCity}
        onValueChange={(value) => {
          setSelectedCity(value)
        }}
        onSearchChange={(value) => {
          // Use onSearchChange to update search state
          setSearch(value)
        }}
        options={data || []}
        formComposition={{
          label: "Search Capital Cities",
          description: "Type to search capital cities worldwide",
          iconLeft: isLoading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <Globe />
          ),
        }}
        placeholder="Type a capital city name"
        minCharToSearch={2}
        loading={isLoading}
        initialState={showInitialState ? historyAndSuggestions : undefined}
        mode="select"
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "InputAutoComplete with server-side data fetching using the REST Countries API to find countries by capital city. Features debounced search and history suggestions as badges.",
      },
    },
  },
}
/**
 * Integration with a REST API for real data fetching.
 */
export const LocationSearchWithAPI: Story = {
  render: function LocationAPIExample() {
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState<string>("")

    // Debounce the search input
    useEffect(() => {
      if (search) {
        setIsTyping(true)
      }

      const timer = setTimeout(() => {
        setDebouncedSearch(search)
        setIsTyping(false)
      }, 500)

      return () => clearTimeout(timer)
    }, [search])

    // Fetch locations from API
    const { data, isLoading: isLoadingResults } = useQuery({
      queryKey: ["locations", debouncedSearch],
      queryFn: async () => {
        if (!debouncedSearch || debouncedSearch.length < 3) {
          return []
        }

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedSearch)}&limit=5`
          )

          if (!response.ok) {
            throw new Error("Network response was not ok")
          }

          const data = await response.json()
          return data.map((item: any) => ({
            value: item.display_name,
            keywords: [item.display_name, item.type],
            description: `${item.type} in ${item.address?.country || ""}`,
            icon: <Map className="text-blue-500" />,
          }))
        } catch (error) {
          console.error("Failed to fetch locations:", error)
          return []
        }
      },
      enabled: debouncedSearch.length >= 3,
      staleTime: 60000,
    })

    // Show loading state when typing or when API is loading
    const isLoading = isTyping || isLoadingResults

    // Popular locations for initial state
    const popularLocations = [
      "New York, USA",
      "London, UK",
      "Tokyo, Japan",
      "Paris, France",
      "Sydney, Australia",
    ]

    const initialStateContent = (
      <div className="flex flex-col gap-3 p-3">
        <div className="mb-2 flex items-center text-sm">
          <Star className="mr-2 size-4 text-amber-500" />
          <span className="font-medium">Popular Locations</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {popularLocations.map((location) => (
            <Badge
              key={location}
              variant="amber"
              iconLeft={<Map className="size-3" />}
              onClick={() => {
                setSelectedLocation(location)
                setSearch(location)
              }}
            >
              {location}
            </Badge>
          ))}
        </div>

        <div className="mt-1 border-t pt-2 text-center text-xs text-muted-foreground">
          Type at least 3 characters to search for locations
        </div>
      </div>
    )

    return (
      <InputAutoComplete
        value={selectedLocation}
        onValueChange={(value) => {
          setSelectedLocation(value)
          setSearch(value) // Update the search value to match selection
        }}
        options={data || []}
        formComposition={{
          label: "Location Search",
          description: "Search for locations worldwide",
          iconLeft: isLoading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <Search />
          ),
        }}
        placeholder="Type location name (min 3 chars)"
        minCharToSearch={3}
        loading={isLoading}
        initialState={initialStateContent}
        mode="default"
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "InputAutoComplete integrated with OpenStreetMap's Nominatim API to search for real locations worldwide. Includes popular location badges as initial state and handles debounced API requests.",
      },
    },
  },
}

/**
 * Form integration with InputAutoComplete and validation.
 */
export const FormIntegrationWithHistory: Story = {
  render: function FormIntegrationExample() {
    const FormSchema = z.object({
      destination: z.string().min(1, "Please enter a destination"),
      preferredCity: z.string().min(1, "Please select a city"),
    })

    function FormExample() {
      const [searchHistory] = useState([
        "Barcelona",
        "Tokyo",
        "New York",
        "Paris",
        "Rome",
        "Amsterdam",
      ])

      const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          destination: "Hanoi",
          preferredCity: "HCM",
        },
      })

      const onSubmit = (values: z.infer<typeof FormSchema>) => {
        alert(
          `Submitted form with destination: ${values.destination} and preferred city: ${values.preferredCity}`
        )
        console.log(values)
      }

      const HistoryInitialState = () => (
        <div className="p-3">
          <div className="mb-2 flex items-center text-sm text-muted-foreground">
            <History className="mr-2 size-4" />
            <span>Previous Destinations</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item, i) => (
              <Badge
                key={item}
                variant={
                  ["blue", "green", "purple", "amber", "teal", "rose"][
                    i % 6
                  ] as any
                }
                iconLeft={<History className="size-3" />}
                onClick={() =>
                  form.setValue("destination", item, { shouldValidate: true })
                }
              >
                {item}
              </Badge>
            ))}
          </div>
        </div>
      )

      return (
        <ZodSchemaProvider schema={FormSchema}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <InputAutoCompleteForm
                name="destination"
                control={form.control}
                options={countryOptions}
                formComposition={{
                  label: "Travel Destination",
                  description: "Enter where you want to go",
                  iconLeft: <Globe className="size-4" />,
                }}
                placeholder="Enter destination"
                mode="default"
                initialState={<HistoryInitialState />}
              />

              <InputAutoCompleteForm
                name="preferredCity"
                control={form.control}
                options={cityOptions}
                formComposition={{
                  label: "Preferred City",
                  description: "Select a city from the list",
                  iconLeft: <Map className="size-4" />,
                }}
                placeholder="Select a city"
                mode="select"
              />

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </ZodSchemaProvider>
      )
    }

    return <FormExample />
  },
  parameters: {
    docs: {
      description: {
        story:
          "Form integration example showing how to use InputAutoCompleteForm with search history in the initial state as suggestion badges. Clicking on badges populates the form field.",
      },
    },
  },
}

/**
 * Form Integration with Location Search API
 */
export const FormIntegrationWithLocationSearch: Story = {
  render: function FormWithAPIExample() {
    // Define form schema with Zod
    const FormSchema = z.object({
      location: z.string().min(3, "Please enter a valid location"),
    })

    function LocationSearchForm() {
      const [search, setSearch] = useState("")
      const [debouncedSearch, setDebouncedSearch] = useState("")
      const [isTyping, setIsTyping] = useState(false)
      const [showInitialState, setShowInitialState] = useState(true)

      // Form setup with react-hook-form and zod validation
      const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          location: "",
        },
      })

      // Handle form submission
      const onSubmit = (values: z.infer<typeof FormSchema>) => {
        alert(`Selected location: ${values.location}}`)
        console.log(values)
      }

      // Debounce the search input
      useEffect(() => {
        console.log(search)
        if (search) {
          setIsTyping(true)
        }
        setShowInitialState(search.length < 3 || !search)

        const timer = setTimeout(() => {
          setDebouncedSearch(search)
          setIsTyping(false)
        }, 500)

        return () => clearTimeout(timer)
      }, [search])

      // Fetch locations from API
      const { data, isLoading: isLoadingResults } = useQuery({
        queryKey: ["form-locations", debouncedSearch],
        queryFn: async () => {
          if (!debouncedSearch || debouncedSearch.length < 3) {
            return []
          }

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                debouncedSearch
              )}&limit=5`
            )

            if (!response.ok) {
              throw new Error("Network response was not ok")
            }

            const data = await response.json()
            return data.map((item: any) => ({
              value: item.display_name,
              label: item.display_name,
              description: `${item.type} in ${item.address?.country || ""}`,
              // Pass icon as URL string if available, otherwise use a marker icon
              icon: item.icon
                ? `https://nominatim.openstreetmap.org/ui/mapicons/${item.icon}.png`
                : "https://nominatim.openstreetmap.org/ui/mapicons/place.png",
            }))
          } catch (error) {
            console.error("Failed to fetch locations:", error)
            return []
          }
        },
        enabled: debouncedSearch.length >= 3,
        staleTime: 60000,
      })

      // Show loading state when typing or when API is loading
      const isLoading = isTyping || isLoadingResults

      // Popular locations for initial state
      const popularLocations = [
        "New York, USA",
        "London, UK",
        "Tokyo, Japan",
        "Paris, France",
        "Sydney, Australia",
      ]

      const initialStateContent = (
        <div className="flex flex-col gap-3 p-3">
          <div className="mb-2 flex items-center text-sm">
            <Star className="mr-2 size-4 text-amber-500" />
            <span className="font-medium">Popular Locations</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {popularLocations.map((location) => (
              <Badge
                key={location}
                variant="amber"
                iconLeft={<Map className="size-3" />}
                onClick={() => {
                  // Update form field value with location from badge
                  form.setValue("location", location, { shouldValidate: true })
                  setSearch(location)
                  setShowInitialState(false)
                }}
              >
                {location}
              </Badge>
            ))}
          </div>

          <div className="mt-1 border-t pt-2 text-center text-xs text-muted-foreground">
            Type at least 3 characters to search for locations
          </div>
        </div>
      )

      return (
        <ZodSchemaProvider schema={FormSchema}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <InputAutoCompleteForm
                name="location"
                control={form.control}
                options={data || []}
                formComposition={{
                  label: "Search Location",
                  description: "Search for locations worldwide",
                  iconLeft: isLoading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <Search />
                  ),
                }}
                placeholder="Type location name (min 3 chars)"
                minCharToSearch={3}
                loading={isLoading}
                initialState={
                  showInitialState ? initialStateContent : undefined
                }
                mode="default"
                onSearchChange={(value) => {
                  // Update search state when input changes
                  setSearch(value)
                }}
              />

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset()
                    setSearch("")
                    setShowInitialState(true)
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </ZodSchemaProvider>
      )
    }

    return <LocationSearchForm />
  },
  parameters: {
    docs: {
      description: {
        story:
          "Form integration example with server-side location search API. Demonstrates how to use InputAutoCompleteForm with external API data, debounced search, and form validation.",
      },
    },
  },
}

/**
 * A comprehensive showcase of InputAutoComplete features.
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div className="grid w-full gap-6">
      <div>
        <h3 className="mb-2 font-medium">Basic Usage</h3>
        <div className="space-y-3">
          <InputAutoComplete
            options={countryOptions}
            placeholder="Search countries"
            formComposition={{ label: "Simple autocomplete" }}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium">Operation Modes</h3>
        <div className="space-y-3">
          <InputAutoComplete
            options={countryOptions}
            placeholder="Free-form with suggestions"
            mode="default"
            formComposition={{ label: "Default mode" }}
          />
          <InputAutoComplete
            options={countryOptions}
            placeholder="Must select from list"
            mode="select"
            formComposition={{ label: "Select mode" }}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium">With Icons</h3>
        <div className="space-y-3">
          <InputAutoComplete
            options={countryOptions}
            placeholder="Search countries"
            formComposition={{
              label: "With left icon",
              iconLeft: <Globe className="size-4" />,
            }}
          />
          <InputAutoComplete
            options={[fruitOptions, vegetableOptions]}
            placeholder="Search foods"
            formComposition={{
              label: "With right icon",
              iconRight: <Search className="size-4" />,
            }}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium">Initial States</h3>
        <div className="space-y-3">
          <InputAutoComplete
            options={countryOptions}
            placeholder="With history badges"
            formComposition={{ label: "History suggestions" }}
            initialState={
              <div className="p-3">
                <div className="mb-2 text-sm text-muted-foreground">
                  Recent searches:
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Japan", "France", "Brazil"].map((country) => (
                    <Badge
                      key={country}
                      variant="blue"
                      iconLeft={<History className="size-3" />}
                    >
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>
            }
          />
          <InputAutoComplete
            options={countryOptions}
            placeholder="With trending suggestions"
            formComposition={{ label: "Trending suggestions" }}
            initialState={
              <div className="p-3">
                <div className="mb-2 text-sm text-muted-foreground">
                  Trending now:
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Italy", "Spain", "Greece"].map((country) => (
                    <Badge
                      key={country}
                      variant="purple"
                      iconLeft={<TrendingUp className="size-3" />}
                    >
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>
            }
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium">State Variations</h3>
        <div className="space-y-3">
          <InputAutoComplete
            options={countryOptions}
            placeholder="Loading..."
            loading={true}
            formComposition={{ label: "Loading state" }}
          />
          <InputAutoComplete
            options={countryOptions}
            placeholder="Disabled input"
            disabled
            formComposition={{ label: "Disabled" }}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A comprehensive showcase displaying key features of the InputAutoComplete component including various initial states with suggestion badges.",
      },
    },
  },
}

/**
 * Fully interactive example with configurable props.
 */
export const Interactive: Story = {
  args: {
    options: countryOptions,
    placeholder: "Search countries...",
    mode: "default",
    minCharToSearch: 1,
    loading: false,
    formComposition: {
      label: "Country",
      description: "Select or type a country name",
      iconLeft: <Globe className="size-4" />,
      inputClear: true,
    },
    initialState: (
      <div className="p-3">
        <div className="mb-2 text-sm text-muted-foreground">
          Suggested countries:
        </div>
        <div className="flex flex-wrap gap-2">
          {["United States", "Canada", "United Kingdom"].map((country) => (
            <Badge
              key={country}
              variant="blue"
              iconLeft={<Star className="size-3" />}
            >
              {country}
            </Badge>
          ))}
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A fully interactive example that can be customized using the Controls panel.",
      },
    },
  },
}
