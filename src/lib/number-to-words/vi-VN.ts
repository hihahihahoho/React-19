/**
 * Vietnamese Number to Words - Clean Implementation
 *
 * Inspired by cleaner pattern with cluster-based approach.
 * Uses array lookups and modulo logic for scale words.
 *
 * Vietnamese-specific rules:
 * - "lẻ" when tens is 0 but ones is not 0 (101 → "một trăm lẻ một")
 * - "mốt" for 1 in tens position (21 → "hai mươi mốt")
 * - "lăm" for 5 in tens position (25 → "hai mươi lăm")
 */

// ============================================================================
// Vocabulary
// ============================================================================

const ONES = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"]

// "lẻ" at index 0 handles the case when tens is 0 but ones is not
const TENS = ["lẻ", "mười", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"]

const SPECIAL_ONES: Record<number, string> = {
  1: "mốt",  // 21, 31, 41... → hai mươi mốt
  5: "lăm",  // 25, 35, 45... → hai mươi lăm
}

const SCALES: Record<string, string> = {
  hundred: "trăm",
  thousand: "nghìn",
  million: "triệu",
  billion: "tỷ",
}

const NEGATIVE = "âm"
const DECIMAL_SEP = "phẩy"

// ============================================================================
// Parse Numeric Value
// ============================================================================

interface ParsedNumericValue {
  isNegative: boolean
  integerPart: string
  decimalPart: string | null
}

function parseNumericValue(value: number | string | bigint): ParsedNumericValue {
  let str: string

  if (typeof value === "bigint") {
    str = value.toString()
  } else if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("Value must be a finite number")
    }
    str = value.toString()
  } else if (typeof value === "string") {
    str = value.trim()
    if (!str) {
      throw new Error("Value cannot be empty")
    }
  } else {
    throw new TypeError("Value must be a number, string, or bigint")
  }

  // Handle negative
  const isNegative = str.startsWith("-")
  if (isNegative) {
    str = str.slice(1)
  }

  // Handle decimal
  const dotIndex = str.indexOf(".")
  let integerPart: string
  let decimalPart: string | null = null

  if (dotIndex !== -1) {
    integerPart = str.slice(0, dotIndex) || "0"
    decimalPart = str.slice(dotIndex + 1)
  } else {
    integerPart = str
  }

  // Validate
  if (!/^\d+$/.test(integerPart)) {
    throw new Error("Invalid number format")
  }

  // Remove leading zeros but keep at least one digit
  integerPart = integerPart.replace(/^0+/, "") || "0"

  return { isNegative, integerPart, decimalPart }
}

// ============================================================================
// Slice into Clusters of 3 digits
// ============================================================================

/**
 * Splits a number string into clusters of 3 digits from right to left.
 * Example: "1234567" → ["1", "234", "567"]
 */
function sliceToClusters(numStr: string): string[] {
  const clusters: string[] = []
  let remaining = numStr

  while (remaining.length > 0) {
    clusters.unshift(remaining.slice(-3))
    remaining = remaining.slice(0, -3)
  }

  return clusters
}

// ============================================================================
// Convert Cluster of 3 digits to Vietnamese text
// ============================================================================

/**
 * Converts a 3-digit cluster to Vietnamese words.
 * @param cluster - String of 1-3 digits (e.g., "001", "123", "5")
 * @param needsZeroHundred - If true, prepend "không trăm" for clusters < 100
 */
function convertCluster(cluster: string, needsZeroHundred: boolean = false): string {
  if (!cluster || cluster === "000") return ""

  // Pad to 3 digits for consistent processing
  const padded = cluster.padStart(3, "0")
  const hundreds = parseInt(padded[0], 10)
  const tens = parseInt(padded[1], 10)
  const ones = parseInt(padded[2], 10)

  const parts: string[] = []

  // Hundreds place
  if (hundreds > 0) {
    parts.push(`${ONES[hundreds]} ${SCALES.hundred}`)
  } else if (needsZeroHundred && (tens > 0 || ones > 0)) {
    // Need "không trăm" when this cluster follows a larger scale
    parts.push(`${ONES[0]} ${SCALES.hundred}`)
  }

  // Tens place
  if (tens > 0 || (tens === 0 && ones > 0 && (hundreds > 0 || needsZeroHundred))) {
    parts.push(TENS[tens])
  }

  // Ones place
  if (ones > 0) {
    // Use special forms for mốt (1) and lăm (5) when tens > 1
    if (tens > 1 && SPECIAL_ONES[ones]) {
      parts.push(SPECIAL_ONES[ones])
    } else if (tens === 1 && ones === 5) {
      // "mười lăm" not "mười năm"
      parts.push(SPECIAL_ONES[5])
    } else {
      parts.push(ONES[ones])
    }
  }

  return parts.join(" ")
}

// ============================================================================
// Get Scale Word for Cluster Index
// ============================================================================

/**
 * Returns the scale word for a cluster based on its position.
 * Uses modulo 3 pattern: (billion → thousand → million → billion → ...)
 * 
 * Position 0: no scale (unit cluster)
 * Position 1: nghìn (10^3)
 * Position 2: triệu (10^6)
 * Position 3: tỷ (10^9)
 * Position 4: nghìn tỷ (10^12)
 * Position 5: triệu tỷ (10^15)
 * Position 6: tỷ tỷ (10^18)
 * ...
 */
function getScaleWord(position: number): string {
  if (position === 0) return ""
  if (position === 1) return SCALES.thousand
  if (position === 2) return SCALES.million

  // For position >= 3, we use "tỷ" pattern
  const tyCount = Math.floor((position - 3) / 3) + 1
  const remainder = (position - 3) % 3

  let scale = SCALES.billion
  // Add additional "tỷ" for each complete cycle of 3
  for (let i = 1; i < tyCount; i++) {
    scale += " " + SCALES.billion
  }

  // Add prefix based on remainder
  if (remainder === 1) {
    scale = SCALES.thousand + " " + scale
  } else if (remainder === 2) {
    scale = SCALES.million + " " + scale
  }

  return scale
}

// ============================================================================
// Main Conversion
// ============================================================================

/**
 * Converts an integer string to Vietnamese words.
 */
function integerToWords(numStr: string): string {
  if (numStr === "0") return ONES[0]

  const clusters = sliceToClusters(numStr)
  const totalClusters = clusters.length

  const parts: string[] = []

  for (let i = 0; i < totalClusters; i++) {
    const cluster = clusters[i]
    const position = totalClusters - 1 - i // Position from right (0 = unit cluster)

    // Need "không trăm" if there's a larger cluster before and this cluster < 100
    const needsZeroHundred = i > 0 && parseInt(cluster, 10) < 100 && parseInt(cluster, 10) > 0

    const text = convertCluster(cluster, needsZeroHundred)
    if (text) {
      const scale = getScaleWord(position)
      parts.push(scale ? `${text} ${scale}` : text)
    }
  }

  return parts.join(" ")
}

/**
 * Converts decimal digits to Vietnamese words.
 * Each digit is read individually, with leading zeros preserved.
 */
function decimalToWords(decimalPart: string): string {
  const parts: string[] = []

  // Handle leading zeros
  let i = 0
  while (i < decimalPart.length && decimalPart[i] === "0") {
    parts.push(ONES[0])
    i++
  }

  // Convert remaining as a number
  const remaining = decimalPart.slice(i)
  if (remaining) {
    parts.push(integerToWords(remaining))
  }

  return parts.join(" ")
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Converts a numeric value to Vietnamese words.
 *
 * @param value - The numeric value to convert (number, string, or bigint)
 * @returns The number in Vietnamese words
 *
 * @example
 * toWords(42)           // 'bốn mươi hai'
 * toWords(101)          // 'một trăm lẻ một'
 * toWords(1000000)      // 'một triệu'
 * toWords(1001000)      // 'một triệu không trăm lẻ một nghìn'
 * toWords(-123)         // 'âm một trăm hai mươi ba'
 * toWords(3.14)         // 'ba phẩy mười bốn'
 */
export function toWords(value: number | string | bigint): string {
  const { isNegative, integerPart, decimalPart } = parseNumericValue(value)

  let result = ""

  if (isNegative) {
    result = NEGATIVE + " "
  }

  result += integerToWords(integerPart)

  if (decimalPart) {
    result += " " + DECIMAL_SEP + " " + decimalToWords(decimalPart)
  }

  return result
}
