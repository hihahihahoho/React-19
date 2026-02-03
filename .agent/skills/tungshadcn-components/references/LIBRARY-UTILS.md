# Libraries & Utilities

TungShadcn includes several internal libraries for data manipulation, formatting, and Vietnamese language support.

---

## Vietnamese Support

### 1. Transliterate Vietnamese

Removes accents and converts to ASCII.

```tsx
import { transliterate } from "@/lib/transliterate-vietnamese"

const ascii = transliterate("Tiếng Việt") // "Tieng Viet"
```

### 2. Number to Words (Vietnamese & English)

Converts numbers to their written form.

```tsx
import { numberToWords } from "@/lib/number-to-words"

// Vietnamese (follows lẻ, mốt, lăm rules)
numberToWords(105, { locale: "vi-VN" }) // "một trăm lẻ năm"
numberToWords(21, { locale: "vi-VN" }) // "hai mươi mốt"

// English
numberToWords(105) // "one hundred and five"
```

---

## Utility Libraries

### 1. `utils-plus`

Extensions to the standard `cn` utility.

```ts
import { lowercaseFirstChar, capitalize } from "@/lib/utils-plus"

capitalize("hello") // "Hello"
```

### 2. File Utilities

Formatting file sizes for display.

```ts
import { formatFileSize } from "@/lib/file-size"

formatFileSize(1024 * 5) // "5.00 KB"
```

---

## Zod Utilities

### 1. Zod Meta

TungShadcn allows adding metadata to Zod schemas (used for things like disabling specific dates or adding hints).

```ts
import { z } from "zod"

const schema = z.object({
  date: z.date().meta({ disablePast: true }),
})
```

---

## Do/Don't

- **Do** use `numberToWords` for financial applications or official documents.
- **Do** use `transliterate` for search indexing or generating URL slugs from Vietnamese titles.
- **Don't** manually format file sizes; use `formatFileSize` for consistency.
- **Don't** assume standard JavaScript `Date` functions work for Vietnamese lunar calculations (if needed, use a specific lib).
