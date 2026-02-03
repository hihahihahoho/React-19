# Select System

## Architecture

TungShadcn Select uses `ResponsivePopover` (Popover on desktop, Drawer on mobile):

```
Select
  └── ResponsivePopover
        ├── ResponsivePopoverTrigger (FormComposition button)
        └── ResponsivePopoverContent
              └── SelectCommand (Command-based picker)
```

---

## Basic Usage

```tsx
import { Select } from "@/components/ui/select/select"
import { SelectForm } from "@/components/ui/select/select-form"

// Standalone
<Select
  options={[
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
  ]}
  formComposition={{ label: "Fruit" }}
  onValueChange={(value) => console.log(value)}
/>

// In form
<SelectForm
  control={control}
  name="fruit"
  options={options}
  formComposition={{ label: "Fruit" }}
/>
```

---

## Options Format

**Flat options:**

```ts
const options: SelectItems[] = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2", icon: <Icon /> },
  { value: "3", label: "Option 3", disabled: true },
]
```

**Grouped options:**

```ts
const options: SelectGroup[] = [
  {
    heading: "Fruits",
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
    ],
  },
  {
    heading: "Vegetables",
    options: [{ value: "carrot", label: "Carrot" }],
  },
]
```

---

## Virtualization (Large Lists)

For 1000+ items, use virtualization:

```tsx
import { SelectCommandVirtualize } from "@/components/ui/select/select-command-virtualize"

;<SelectForm
  control={control}
  name="country"
  options={allCountries} // 200+ items
  virtualComponents={SelectCommandVirtualize}
  selectCommandProps={{
    minItemsToShowSearch: 5,
  }}
  formComposition={{ label: "Country" }}
/>
```

---

## Server-Side Search

Disable client filtering, handle search externally:

```tsx
const [search, setSearch] = useState("")

<SelectForm
  control={control}
  name="country"
  options={searchResults}
  selectCommandProps={{
    shouldFilter: false, // Important!
    loading: isLoading,
    commandInputProps: {
      value: search,
      onValueChange: setSearch,
    },
  }}
  formComposition={{ label: "Country" }}
/>
```

---

## Multi-Select

```tsx
import { MultiSelectForm } from "@/components/ui/select/multiselect-form"

;<MultiSelectForm
  control={control}
  name="skills"
  options={[
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
  ]}
  formComposition={{ label: "Skills" }}
/>
```

---

## Custom Display Value

Override what's shown in trigger:

```tsx
<SelectForm
  control={control}
  name="country"
  options={options}
  customDisplayValue={{
    value: "loading",
    label: "Loading...",
    icon: <Loader className="animate-spin" />,
  }}
  formComposition={{ label: "Country" }}
/>
```

---

## selectCommandProps

```tsx
selectCommandProps={{
  loading: false,                    // Show loading spinner
  shouldFilter: true,                // Client-side filtering
  minItemsToShowSearch: 5,           // Hide search if < 5 items
  commandInputProps: {               // Search input props
    value: search,
    onValueChange: setSearch,
    placeholder: "Search...",
  },
}}
```

---

## Vietnamese Auto-Placeholder

If no `placeholder` provided:

```tsx
<Select formComposition={{ label: "Quốc gia" }} />
// Renders: placeholder="Chọn quốc gia"
```
