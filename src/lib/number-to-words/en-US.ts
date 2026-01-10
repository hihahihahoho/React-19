/**
 * English Number to Words - Clean Implementation
 *
 * Uses cluster-based approach with array lookups.
 *
 * English-specific rules:
 * - Teens: eleven, twelve, thirteen... nineteen
 * - Hyphen between tens and ones: twenty-one, thirty-five
 * - Scales: thousand, million, billion, trillion...
 */

// ============================================================================
// Vocabulary
// ============================================================================

const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

const TEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]

const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

const SCALES: Record<string, string> = {
  hundred: "hundred",
  thousand: "thousand",
  million: "million",
  billion: "billion",
  trillion: "trillion",
  quadrillion: "quadrillion",
  quintillion: "quintillion",
}

const NEGATIVE = "negative"
const DECIMAL_SEP = "point"

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
// Convert Cluster of 3 digits to English text
// ============================================================================

/**
 * Converts a 3-digit cluster to English words.
 * @param cluster - String of 1-3 digits (e.g., "001", "123", "5")
 */
function convertCluster(cluster: string): string {
  if (!cluster || cluster === "000") return ""

  const num = parseInt(cluster, 10)
  if (num === 0) return ""

  const parts: string[] = []

  // Hundreds place
  const hundreds = Math.floor(num / 100)
  if (hundreds > 0) {
    parts.push(`${ONES[hundreds]} ${SCALES.hundred}`)
  }

  // Tens and ones
  const remainder = num % 100
  if (remainder > 0) {
    if (remainder < 10) {
      parts.push(ONES[remainder])
    } else if (remainder < 20) {
      parts.push(TEENS[remainder - 10])
    } else {
      const tens = Math.floor(remainder / 10)
      const ones = remainder % 10
      if (ones === 0) {
        parts.push(TENS[tens])
      } else {
        parts.push(`${TENS[tens]}-${ONES[ones]}`)
      }
    }
  }

  return parts.join(" ")
}

// ============================================================================
// Get Scale Word for Cluster Index
// ============================================================================

/**
 * Returns the scale word for a cluster based on its position.
 * Position 0: no scale (unit cluster)
 * Position 1: thousand (10^3)
 * Position 2: million (10^6)
 * Position 3: billion (10^9)
 * Position 4: trillion (10^12)
 * Position 5: quadrillion (10^15)
 * Position 6: quintillion (10^18)
 * ...
 */
function getScaleWord(position: number): string {
  const scaleWords = [
    "",
    SCALES.thousand,
    SCALES.million,
    SCALES.billion,
    SCALES.trillion,
    SCALES.quadrillion,
    SCALES.quintillion,
  ]

  if (position < scaleWords.length) {
    return scaleWords[position]
  }

  // For very large numbers, extend with pattern
  // This is rarely used in practice
  return `10^${position * 3}`
}

// ============================================================================
// Main Conversion
// ============================================================================

/**
 * Converts an integer string to English words.
 */
function integerToWords(numStr: string): string {
  if (numStr === "0") return ONES[0]

  const clusters = sliceToClusters(numStr)
  const totalClusters = clusters.length

  const parts: string[] = []

  for (let i = 0; i < totalClusters; i++) {
    const cluster = clusters[i]
    const position = totalClusters - 1 - i // Position from right (0 = unit cluster)

    const text = convertCluster(cluster)
    if (text) {
      const scale = getScaleWord(position)
      parts.push(scale ? `${text} ${scale}` : text)
    }
  }

  return parts.join(" ")
}

/**
 * Converts decimal digits to English words.
 * Each digit is read individually.
 * Example: 3.14 → "three point one four"
 */
function decimalToWords(decimalPart: string): string {
  const parts: string[] = []

  for (const digit of decimalPart) {
    parts.push(ONES[parseInt(digit, 10)])
  }

  return parts.join(" ")
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Converts a numeric value to English words.
 *
 * @param value - The numeric value to convert (number, string, or bigint)
 * @returns The number in English words
 *
 * @example
 * toWords(42)           // 'forty-two'
 * toWords(101)          // 'one hundred one'
 * toWords(1000000)      // 'one million'
 * toWords(-123)         // 'negative one hundred twenty-three'
 * toWords(3.14)         // 'three point one four'
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
