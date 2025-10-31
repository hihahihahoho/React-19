# Registry Components List

A complete inventory of all 92 items in the TungShadcn registry.

---

## 📚 Libraries (8 items)

| Name                       | Description                                                    |
| -------------------------- | -------------------------------------------------------------- |
| `utils-plus`               | Additional utility functions extending the base utils library. |
| `zod`                      | Zod schema utilities for form validation and data parsing.     |
| `transliterate-vietnamese` | Utility for transliterating Vietnamese text.                   |
| `locale-date`              | Date localization utilities.                                   |
| `get-node-text`            | Utility to extract text content from React nodes.              |
| `fuzzy-search`             | Fuzzy search utility for filtering and searching data.         |
| `file-size`                | Utility for formatting file sizes.                             |
| `const`                    | Shared constants and configuration values.                     |

---

## 🎣 Hooks (19 items)

| Name                     | Description                                     |
| ------------------------ | ----------------------------------------------- |
| `use-scroll`             | Hook for managing scroll behavior.              |
| `use-file-upload`        | Hook for file upload functionality.             |
| `use-is-mounted`         | Hook to check if component is mounted.          |
| `use-resize-observer`    | Hook for observing element resize events.       |
| `use-scroll-position`    | Hook for tracking scroll position.              |
| `use-scroll-into-view`   | Hook for scrolling elements into view.          |
| `use-merge-ref`          | Hook for merging multiple refs.                 |
| `use-item-overflow`      | Hook for detecting item overflow.               |
| `use-date-locale-config` | Hook for date localization configuration.       |
| `use-history-state`      | Hook for managing history state.                |
| `use-wheel-scroll`       | Hook for handling wheel scroll events.          |
| `use-toast`              | Hook for displaying toast notifications.        |
| `use-sync-scroll`        | Hook for synchronizing scroll between elements. |
| `use-mobile`             | Hook for detecting mobile devices.              |
| `use-media-query`        | Hook for responsive media queries.              |
| `use-is-display-none`    | Hook to check if element has display:none.      |
| `use-alert-dialog`       | Hook for managing alert dialogs.                |
| `use-autosize-textarea`  | Hook for auto-resizing textareas.               |

---

## 🎨 Components (65 items)

### Core UI Components

| Name         | Description                                          |
| ------------ | ---------------------------------------------------- |
| `button`     | A versatile button component with multiple variants. |
| `card`       | A card component for content containers.             |
| `separator`  | A separator component for dividing content.          |
| `skeleton`   | Skeleton loading component for placeholder content.  |
| `typography` | Typography components with consistent styling.       |
| `data-row`   | A component for displaying key-value data pairs.     |

### Navigation & Layout

| Name         | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| `breadcrumb` | A breadcrumb navigation component.                            |
| `tabs`       | A tabs component for organizing content into tabs.            |
| `tabs-core`  | Core tabs component with scroll and wheel navigation support. |
| `tabs-line`  | A tabs component with underline indicator.                    |
| `accordion`  | Accordion component for collapsible content sections.         |

### Overlays & Dialogs

| Name                     | Description                                                |
| ------------------------ | ---------------------------------------------------------- |
| `dialog`                 | A dialog (modal) component.                                |
| `drawer`                 | A drawer component for slide-out panels.                   |
| `sheet`                  | A sheet (drawer) component for side panels.                |
| `alert-dialog`           | Alert dialog component for confirmations.                  |
| `alert-dialog-container` | Container for managing alert dialogs.                      |
| `popover`                | A popover component for displaying floating content.       |
| `tooltip`                | A tooltip component for displaying contextual information. |
| `hover-card`             | A hover card component for displaying content on hover.    |

### Menus

| Name            | Description                                            |
| --------------- | ------------------------------------------------------ |
| `dropdown-menu` | A dropdown menu component.                             |
| `context-menu`  | A context menu component for right-click interactions. |
| `command`       | A command menu component (like command palette).       |

### Form Components

| Name                      | Description                                         |
| ------------------------- | --------------------------------------------------- |
| `form`                    | Form components with validation and error handling. |
| `label`                   | A label component for form inputs.                  |
| `input`                   | Input field component with form integration.        |
| `input-number`            | Number input with formatting and masking.           |
| `input-tag`               | Tag input component for selecting multiple values.  |
| `input-auto-complete`     | Auto-complete input component.                      |
| `command-primitive-input` | Input component for command primitives.             |
| `textarea`                | Textarea component with auto-resize support.        |
| `zod-schema-context`      | Context provider for Zod schema validation.         |

### Selection Controls

| Name              | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `checkbox`        | Checkbox component with form integration.                |
| `checkbox-tree`   | Tree view checkbox component for hierarchical selection. |
| `radio-group`     | Radio button group component.                            |
| `switch`          | Switch toggle component.                                 |
| `toggle`          | A toggle button component.                               |
| `toggle-group`    | A group of toggle buttons.                               |
| `selection-group` | Base component for selection controls.                   |

### Select Components

| Name                        | Description                                                         |
| --------------------------- | ------------------------------------------------------------------- |
| `select-interface`          | TypeScript interface definitions for select components.             |
| `select-command`            | Command-based select component with search and keyboard navigation. |
| `select-command-virtualize` | Virtualized select for handling large lists efficiently.            |
| `select-popover`            | Popover wrapper component for select dropdowns.                     |
| `select`                    | Advanced select dropdown component with search and virtualization.  |
| `multiselect`               | Multi-select dropdown component with search and badges.             |

### Date & Time

| Name                    | Description                                     |
| ----------------------- | ----------------------------------------------- |
| `calendar`              | A calendar component for date selection.        |
| `calendar-range`        | A calendar component for selecting date ranges. |
| `date-time-input`       | Date and time input component.                  |
| `date-time-input-group` | Group of date/time inputs.                      |

### File Upload

| Name               | Description                               |
| ------------------ | ----------------------------------------- |
| `file-upload`      | File upload component with drag and drop. |
| `file-upload-list` | File upload component with list view.     |

### Feedback & Notifications

| Name     | Description                                           |
| -------- | ----------------------------------------------------- |
| `alert`  | An alert component for displaying important messages. |
| `toast`  | Toast notification component.                         |
| `sonner` | Toast notifications using Sonner.                     |

### Data Display

| Name                   | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| `table`                | Table component for displaying tabular data.                 |
| `data-table`           | Advanced data table with sorting, filtering, and pagination. |
| `badge`                | Badge component for labels and tags.                         |
| `overflow-badge-group` | Badge group with overflow handling.                          |
| `avatar`               | An avatar component for user profile pictures.               |
| `empty-state`          | Empty state component for displaying when there's no data.   |

### Media & Visual

| Name              | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `photoswipe`      | Image lightbox and gallery component using PhotoSwipe. |
| `circle-progress` | A circular progress indicator component.               |
| `glass-icon`      | Glassmorphism icon component.                          |
| `custom-icons`    | Custom icon components.                                |

### Utilities

| Name          | Description                                         |
| ------------- | --------------------------------------------------- |
| `collapsible` | A collapsible component for showing/hiding content. |
| `scroll-area` | A custom scrollable area component.                 |
| `pagination`  | Pagination component for navigating through pages.  |

---

## 📦 Installation Examples

```bash
# Install a component
npx shadcn@latest add https://react-19.octung112.workers.dev/r/button.json

# Install a hook
npx shadcn@latest add https://react-19.octung112.workers.dev/r/use-media-query.json

# Install a lib
npx shadcn@latest add https://react-19.octung112.workers.dev/r/utils-plus.json
```

---

## 🔗 Registry Information

- **Total Items:** 92
- **Components:** 65
- **Hooks:** 19
- **Libraries:** 8
- **Homepage:** https://react-19.octung112.workers.dev
- **Schema:** https://ui.shadcn.com/schema/registry.json

---

_Last Updated: October 31, 2025_
