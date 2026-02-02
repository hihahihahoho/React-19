# Input and form composition

Based on the TungShadcn input system (`Input`, `InputForm`) and shared form composition (`FormComposition`) in `src/components/ui/form/form.tsx` and `src/components/ui/input/input-form.tsx`.

## Core concepts

- `FormComposition` wraps inputs and adds labels, descriptions, icons, prefix/suffix slots, clear button, and error messaging.
- Use `FormComposition` via the `formComposition` prop on input-like components.
- `FormComposition` respects `labelPosition` and optional `layout` for horizontal label layouts.

## Required field detection

- `InputForm` reads required state from Zod via `useZodSchema()` and sets `requiredSymbol` automatically.
- When building new form-bound inputs, follow the `InputForm` pattern:
  1. Read schema metadata for `isRequired`.
  2. Pass `requiredSymbol` into `formComposition`.

## Clear behavior

- `FormComposition` shows the clear icon when:
  - `hasValue` is true
  - `inputClear` is true
  - not readonly, not disabled
  - and either `isFocused` or `clearWhenNotFocus`
- For file inputs: `InputForm` clears to `null` and forwards `files` via `onChange({ target: { value: files } })`.

## Labels and layout

- Default label position is vertical; horizontal requires `labelPosition: "horizontal"`.
- Use `layout.leftColClass/rightColClass` to customize grid splits in horizontal mode.
- `FormLabel` will render a required asterisk when `requiredSymbol` is true.

## Styling variants

- `formComposition.variant` controls container styles: `default`, `white`, `ghost`, `empty`, `inline`.
- `size` controls padding and min-height via `inputSizeVariants`.

## When to use which input

- `Input`: general text input and simple file inputs.
- `InputForm`: same as Input, but controlled by `react-hook-form` and Zod schema.
- `InputNumber`: numeric formatting/masking when needed.
- `InputTag`: multi-value input; use `mode="select"` for option-based tagging.
- `InputAutoComplete`: typeahead with search behavior.
- `InputOTP`: one-time code entry.

## Usage requirements

- Always pass `formComposition.label` when used in forms to preserve accessibility.
- Prefer `InputForm` inside `Form` (react-hook-form). Use `Input` only for uncontrolled or custom-managed fields.
