# Calendar & Date Components

TungShadcn uses `react-day-picker` for its calendar foundation, enhanced with Vietnamese localization and integrated month/year selectors.

---

## Calendar

The base UI component for date selection.

### Usage

```tsx
import { Calendar } from "@/components/ui/calendar/calendar"

;<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  localeString="vi" // Auto-translates months/days to Vietnamese
/>
```

### Key Features

- **Vietnamese Support**: Pass `localeString="vi"` or `vi-VN`.
- **Month/Year Dropdowns**: Automatically enabled for easier navigation.
- **Custom Selects**: Uses TungShadcn `Select` for consistent styling in navigation.

---

## Date Pickers

Use `*Form` variants for seamless integration with forms.

### 1. Single Date Picker

```tsx
import { DatePickerForm } from "@/components/ui/datepicker/datepicker-form"

;<DatePickerForm
  control={control}
  name="birthday"
  formComposition={{ label: "Ngày sinh" }}
  showTimeInput={false} // Set true to enable time selection
/>
```

### 2. Date Range Picker

```tsx
import { DateRangePickerForm } from "@/components/ui/date-range-picker/date-range-picker-form"

;<DateRangePickerForm
  control={control}
  name="stayPeriod"
  formComposition={{ label: "Thời gian lưu trú" }}
/>
```

---

## Date Time Input

For manual text-based date entry with masking (using `Maskito`).

```tsx
import { DateTimeInputForm } from "@/components/ui/date-time-input/date-time-input-form"

;<DateTimeInputForm
  control={control}
  name="appointment"
  format="dd/MM/yyyy HH:mm"
  formComposition={{ label: "Hẹn lịch" }}
/>
```

---

## Patterns

### 1. Disabling Dates

Disable weekends or past dates via `disabled` prop:

```tsx
<DatePickerForm
  control={control}
  name="date"
  calendarProps={{
    disabled: (date) => date < new Date() || date.getDay() === 0,
  }}
/>
```

### 2. Vietnamese Localization

TungShadcn components automatically detect localization needs. If your app is primarily Vietnamese, ensure `localeString="vi"` is passed or configured.

---

## Do/Don't

- **Do** use `DatePickerForm` for most date fields.
- **Do** enable `showTimeInput` if the time of day matters for the business logic.
- **Don't** use `DateTimeInput` (text entry) if the user is likely to prefer a visual picker. It's better for high-speed data entry.
- **Don't** forget to handle `undefined` or `null` values in your Zod schemas for dates.
