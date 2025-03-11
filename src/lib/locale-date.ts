export type SegmentDateId = "month" | "day" | "year" | "hour" | "minute"
export interface LocaleDateConfig {
  locale: string
  format: string
  segments: Array<{
    id: SegmentDateId
    placeholder: string
    label: string
  }>
  separator?: string
}

// Generate locale configuration for any locale
function generateLocaleDateConfig(locale: string): LocaleDateConfig {
  try {
    // Get date format parts from Intl API
    const parts = new Intl.DateTimeFormat(locale).formatToParts(
      new Date("2021-01-01")
    )

    // Find the separator character (first non-space literal)
    const separators = parts
      .filter((part) => part.type === "literal")
      .map((part) => part.value.trim())
      .filter((value) => value !== "")

    const separator = separators[0] || "/"

    // Build segments in the correct order
    const segmentOrder: SegmentDateId[] = []
    const formatParts: string[] = []

    parts.forEach((part) => {
      if (part.type === "day") {
        segmentOrder.push("day")
        formatParts.push("dd") // Changed from DD to dd for date-fns compatibility
      } else if (part.type === "month") {
        segmentOrder.push("month")
        formatParts.push("MM") // MM is correct for date-fns
      } else if (part.type === "year") {
        segmentOrder.push("year")
        formatParts.push("yyyy") // Changed from YYYY to yyyy for date-fns compatibility
      } else if (part.type === "literal" && part.value.trim() !== "") {
        formatParts.push(part.value)
      }
    })

    // Create segments array
    const segments = segmentOrder.map((id) => {
      switch (id) {
        case "day":
          return { id, placeholder: "dd", label: "Day" }
        case "month":
          return { id, placeholder: "mm", label: "Month" }
        case "year":
          return { id, placeholder: "yyyy", label: "Year" }
        default:
          return { id, placeholder: "dd", label: "Day" }
      }
    })

    return {
      locale: locale,
      format: formatParts.join(""),
      segments,
      separator,
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e) {
    // If anything goes wrong, fall back to en-US style
    return {
      locale: locale,
      format: "MM/dd/yyyy", // Updated fallback format to use correct date-fns tokens
      segments: [
        { id: "month", placeholder: "mm", label: "Month" },
        { id: "day", placeholder: "dd", label: "Day" },
        { id: "year", placeholder: "yyyy", label: "Year" },
      ],
      separator: "/",
    }
  }
}

export { generateLocaleDateConfig }
