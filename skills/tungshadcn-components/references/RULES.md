# Core rules

## Component selection

1. Prefer TungShadcn components when they exist and provide advanced behavior (virtualization, file upload, data table, enhanced select).
2. Use native shadcn/ui components for items explicitly listed as missing from shadcn/ui in the registry doc.
3. Avoid mixing overlapping components from multiple registries unless the user requests it.
4. Keep component usage consistent within a page (same input system, same table system).
5. Use hooks and libraries from the registry when they are referenced by a component’s registry dependency list.

## Installation

- Install components using the registry URL:
  `npx shadcn@latest add https://react-19.octung112.workers.dev/r/[component].json`
- If a component has registry dependencies, install the top-level component only; it pulls deps automatically.
- For hooks and libs, install with their registry URL similarly.

## Usage by system

### Overlays

- Use Responsive Popover for desktop + mobile behavior; it auto switches to Drawer on mobile.
- Use Sonner Toast for notifications; pair with use-toast if needed.
- Use Alert Dialog for destructive or confirm-only flows.

### Display

- Use Copy or Copy Button for clipboard flows; prefer Copy Button if a pre-styled UI is acceptable.
- Use Sticky when you need “stuck” state detection; always pass direction and sticky styles.
- Use SVG Inline when the SVG must inherit currentColor or dynamic styling.

### Controls

- Use Tabs when content scroll is needed, Tabs Line for visual emphasis.
- Use Pagination for tables and lists; keep page state in URL where possible.

### Forms

- Prefer registry Input, Textarea, Select, Multi Select, Input Tag, Input OTP when working with forms.
- Use Date Picker for single date; Date Range Picker for ranges.
- Use Input Number for numeric input with formatting.
- Use File Upload for drag/drop, File Upload List when previews are needed.
- Use Signature Pad only when user needs drawn input.
- Always integrate with React Hook Form + Zod when using Form or validation components.

### Data display

- Use Data Table for complex tables; Table for simple display.
- Use Sortable Table only when reorder is required.
- Use Data Table Server for server-side pagination/filtering.

### Interaction

- Use Sortable for drag-and-drop reordering in lists and grids.

### Layout and media

- Use Scroll Area for custom scroll and scroll position tracking.
- Use Swiper and its effect plugins for carousels; pick Panorama, Expo, or Posters only when you need that specific visual effect.
- Use Image Crop for avatar or user image cropping.

## Calendar and date/time

- Use Calendar for single date selection UI.
- Use Calendar Range for date ranges in a calendar.
- Use Date Time Input for manual date+time entry.
- Use Date Time Input Group for multiple date/time inputs in a row.

## Hooks and utilities

- Prefer registry hooks (use-media-query, use-scroll, use-toast, etc.) when a component depends on them.
- Use utils-plus, fuzzy-search, and file-size when matching their task (search, formatting, sizes).

## AI-ready guidance

- When asked “add component X,” install from the registry URL.
- When asked “what’s available,” list the relevant category and suggest native shadcn/ui for missing items.
- When asked to design new UI, choose consistent component families and minimize mixing registries.
