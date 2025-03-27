# Tabs Component Documentation

## Note

This component is built on top of the Shadcn/ui Tabs component

## Props

### Tabs Component Props

| Prop            | Type                         | Default        | Description                            |
| --------------- | ---------------------------- | -------------- | -------------------------------------- |
| `defaultValue`  | `string`                     | `undefined`    | The initial active tab (uncontrolled)  |
| `value`         | `string`                     | `undefined`    | The controlled value of the active tab |
| `onValueChange` | `(value: string) => void`    | `undefined`    | Callback when tab changes              |
| `variant`       | `'default' \| 'line'`        | `'default'`    | Visual style of tabs                   |
| `size`          | `'sm' \| 'default' \| 'lg'`  | `'default'`    | Size of the tabs                       |
| `orientation`   | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of tab layout                |

## Variant Options

The `variant` prop allows two styling approaches:

- `default`: Standard tab appearance (likely with background and borders)
- `line`: Minimalist style with an indicator line for the active tab

## Size Options

The `size` prop gives flexibility for different space requirements:

- `sm`: Compact size for space-constrained interfaces
- `default`: Standard size for general usage
- `lg`: Larger tabs for improved touch targets or visual emphasis
