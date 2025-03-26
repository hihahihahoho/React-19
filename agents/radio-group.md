# Radio Group Component Documentation

## Overview

The Radio Group component allows users to select a single option from a list of choices. Built on Radix UI primitives, it integrates with FormComposition for styling and React Hook Form for validation.

> **IMPORTANT**: Before using the Radio Group component, you must also read `selection-group.md` documentation as RadioGroupItem is typically used within a SelectionGroup container.

## Import

```typescript
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/selection-controls/radio-group"
import { RadioGroupForm } from "@/components/ui/selection-controls/radio-group-form"
```

## Props Explanation

### RadioGroup Props

| Prop            | Type                    | Description                                     |
| --------------- | ----------------------- | ----------------------------------------------- |
| `value`         | string                  | The controlled value of the selected radio item |
| `defaultValue`  | string                  | The default value when uncontrolled             |
| `onValueChange` | (value: string) => void | Called when the value changes                   |

Plus all standard HTML attributes.

### RadioGroupItem Props

| Prop    | Type   | Description                        |
| ------- | ------ | ---------------------------------- |
| `value` | string | The unique value of the radio item |

Plus all standard HTML attributes.

### RadioGroupForm Props

| Prop              | Type                 | Description                                        |
| ----------------- | -------------------- | -------------------------------------------------- |
| `items`           | ItemRadioType[]      | Array of radio items with label and value          |
| `formComposition` | FormCompositionProps | Styling and layout options for the group container |
| `selectionGroup`  | SelectionGroupProps  | Props applied to each SelectionGroup wrapper       |

## Example Usage

```tsx
<RadioGroup defaultValue="option1">
  <SelectionGroup control={<RadioGroupItem value="option1" />}>
    Standard option
  </SelectionGroup>
  <SelectionGroup control={<RadioGroupItem value="option2" />}>
    Another option
  </SelectionGroup>
</RadioGroup>
```

## Form Integration

> **IMPORTANT**: RadioGroupForm accepts both `formComposition` and `selectionGroup` props, so you **must read both `form-composition.md` and `selection-group.md`** before using it.

```tsx
<RadioGroupForm
  control={form.control}
  name="subscription"
  items={[
    { value: "monthly", label: "Monthly Plan" },
    { value: "annual", label: "Annual Plan (Save 20%)" },
  ]}
  formComposition={{
    label: "Subscription Type",
    description: "Select your preferred billing cycle",
  }}
  selectionGroup={{
    variant: "card",
  }}
/>
```

## Key Features

1. **Single Selection**: Enforces selection of only one option from the group
2. **Form Integration**: Seamless React Hook Form integration
3. **Visual Variants**: Supports both standard and card selection styles
4. **Accessibility**: Built on Radix UI primitives for robust accessibility

## Best Practices

1. **Read selection-group.md thoroughly** before implementation
2. Always wrap RadioGroupItem in a SelectionGroup for proper labeling
3. Use RadioGroupForm for form integration with unified group label
4. Use the card variant for more prominent selection options
5. Keep option labels clear and concise
