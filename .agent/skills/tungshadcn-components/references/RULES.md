# Component Selection Rules

## Form Inputs: Base vs \*Form

| Context          | Use                                                |
| ---------------- | -------------------------------------------------- |
| Inside `<Form>`  | `*Form` variants (e.g., `InputForm`, `SelectForm`) |
| Outside `<Form>` | Base components (e.g., `Input`, `Select`)          |

**Why?** `*Form` variants wire to React Hook Form's `control` and auto-handle validation.

---

## Input Types

| Need                   | Component                    |
| ---------------------- | ---------------------------- |
| Text/email/password    | `InputForm` with `type` prop |
| Number with formatting | `InputNumberForm`            |
| Multi-line             | `TextareaForm`               |
| Tags/chips             | `InputTagForm`               |
| Autocomplete           | `InputAutoCompleteForm`      |

---

## Select Types

| Need               | Component                                                       |
| ------------------ | --------------------------------------------------------------- |
| Single select      | `SelectForm`                                                    |
| Multiple select    | `MultiSelectForm`                                               |
| Large list (1000+) | `SelectForm` with `virtualComponents={SelectCommandVirtualize}` |

---

## Date Types

| Need           | Component                        |
| -------------- | -------------------------------- |
| Single date    | `DatePickerForm`                 |
| Date range     | `DateRangePickerForm`            |
| Date with time | `DatePickerForm` with time input |

---

## Selection Controls

| Need                 | Component           |
| -------------------- | ------------------- |
| Single checkbox      | `CheckboxForm`      |
| Multiple checkboxes  | `CheckboxGroupForm` |
| Tree with checkboxes | `CheckboxTreeForm`  |
| Radio buttons        | `RadioGroupForm`    |
| Toggle/Switch        | `SwitchForm`        |

---

## File & Media

| Need                   | Component             |
| ---------------------- | --------------------- |
| Single/multi file grid | `FileUploadForm`      |
| File list view         | `FileUploadListForm`  |
| Image crop + avatar    | `ImageCropAvatarForm` |
| Signature              | `SignaturePadForm`    |

---

## Rating & Feedback

| Need        | Component      |
| ----------- | -------------- |
| Star rating | `RatingForm`   |
| Slider      | `SliderForm`   |
| OTP code    | `InputOTPForm` |

---

## TungShadcn vs Native shadcn/ui

**Use TungShadcn registry for:**

- All form inputs (unified `formComposition` pattern)
- Select with search/virtualization
- DataTable with built-in context
- AlertDialog with programmatic API
- ResponsivePopover (auto mobile drawer)
- FileUpload with preview
- Swiper/carousel

**Use native shadcn/ui for:**

- Accordion, Card, Skeleton
- Breadcrumb, Toggle, ToggleGroup
- Tooltip, HoverCard, Popover (basic)
- Sheet, ContextMenu
- Separator, AspectRatio
- Collapsible, Resizable

See `public/llms.txt` section "Missing Components" for full list.
