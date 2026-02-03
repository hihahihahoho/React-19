# Selection Controls

TungShadcn provides a rich set of selection components, including standard checkboxes/radios and advanced recursive tree structures.

---

## Checkbox & Groups

### 1. Basic Checkbox

```tsx
import { Checkbox } from "@/components/ui/selection-controls/checkbox"

;<Checkbox
  checked={checked}
  onCheckedChange={setChecked}
  isIndeterminate={isIndeterminate}
/>
```

### 2. Checkbox Group

Allows selecting multiple values from a list.

```tsx
import { CheckboxGroupForm } from "@/components/ui/selection-controls/checkbox-group-form"

;<CheckboxGroupForm
  control={control}
  name="interests"
  options={[
    { id: "1", label: "Technology" },
    { id: "2", label: "Design" },
  ]}
  formComposition={{ label: "Interests" }}
/>
```

---

## Radio Group

```tsx
import { RadioGroupForm } from "@/components/ui/selection-controls/radio-group-form"

;<RadioGroupForm
  control={control}
  name="plan"
  options={[
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
  ]}
  formComposition={{ label: "Subscription Plan" }}
/>
```

---

## Switch

```tsx
import { SwitchForm } from "@/components/ui/selection-controls/switch-form"

;<SwitchForm
  control={control}
  name="notifications"
  formComposition={{ label: "Enable Notifications" }}
/>
```

---

## Checkbox Tree

Powerful recursive selection component for hierarchical data (e.g., categories, file systems).

### Features

- Recursive state (parent checking/unchecking affects children).
- Indeterminate states (parent shows dash if some children are selected).
- Auto-expansion support.
- Custom rendering for nodes.

### Usage

```tsx
import { CheckboxTreeForm } from "@/components/ui/selection-controls/checkbox-tree-form"

const treeData = [
  {
    id: "electronics",
    label: "Electronics",
    children: [
      { id: "phones", label: "Phones" },
      { id: "laptops", label: "Laptops" },
    ],
  },
]

<CheckboxTreeForm
  control={control}
  name="categories"
  trees={treeData}
  formComposition={{ label: "Select Categories" }}
/>
```

---

## Rating & Slider

### 1. Rating

```tsx
import { RatingForm } from "@/components/ui/rating/rating-form"

;<RatingForm
  control={control}
  name="score"
  max={5}
  allowHalf
  formComposition={{ label: "Rate your experience" }}
/>
```

### 2. Slider

```tsx
import { SliderForm } from "@/components/ui/slider-form"

;<SliderForm
  control={control}
  name="volume"
  min={0}
  max={100}
  step={1}
  formComposition={{ label: "Volume" }}
/>
```

---

## Do/Don't

- **Do** use `CheckboxTree` for nested dependencies rather than flat lists.
- **Do** use `isIndeterminate` when a checkbox state depends on sub-selections.
- **Don't** use `RadioGroup` if you have more than 5-6 options; use a `Select` instead.
- **Don't** forget to provide unique `id`s for every node in a `CheckboxTree`.
