/**
 * Number to Words - Multi-locale support
 *
 * Converts numeric values to words with locale support.
 * Default locale: vi-VN (Vietnamese)
 *
 * @example
 * import { numberToWords } from '@/lib/number-to-words'
 *
 * numberToWords(42)                      // 'bốn mươi hai' (Vietnamese)
 * numberToWords(42, { locale: 'en-US' }) // 'forty-two' (English)
 */

import { toWords as toWordsEnUS } from "./en-US"
import { toWords as toWordsViVN } from "./vi-VN"

export type SupportedLocale = "vi-VN" | "en-US"

export interface NumberToWordsOptions {
  /**
   * The locale to use for conversion.
   * @default 'vi-VN'
   */
  locale?: SupportedLocale
}

// Locale to converter mapping
const converters: Record<SupportedLocale, (value: number | string | bigint) => string> = {
  "vi-VN": toWordsViVN,
  "en-US": toWordsEnUS,
}

/**
 * Converts a numeric value to words.
 *
 * @param value - The numeric value to convert (number, string, or bigint)
 * @param options - Conversion options
 * @returns The number in words
 * @throws {TypeError} If value is not a valid numeric type
 * @throws {Error} If value is not a valid number format or locale is not supported
 *
 * @example
 * // Vietnamese (default)
 * numberToWords(42)                       // 'bốn mươi hai'
 * numberToWords(1000000)                  // 'một triệu'
 * numberToWords(101)                      // 'một trăm lẻ một'
 * numberToWords(-123)                     // 'âm một trăm hai mươi ba'
 * numberToWords(3.14)                     // 'ba phẩy mười bốn'
 *
 * // English
 * numberToWords(42, { locale: 'en-US' })  // 'forty-two'
 * numberToWords(101, { locale: 'en-US' }) // 'one hundred one'
 * numberToWords(1000000, { locale: 'en-US' }) // 'one million'
 */
export function numberToWords(
  value: number | string | bigint,
  options: NumberToWordsOptions = {}
): string {
  const { locale = "vi-VN" } = options

  const converter = converters[locale]
  if (!converter) {
    throw new Error(`Unsupported locale: ${locale}. Supported locales: ${Object.keys(converters).join(", ")}`)
  }

  return converter(value)
}

// Re-export individual converters for direct imports
export { toWords as toWordsEnUS } from "./en-US"
export { toWords as toWordsViVN } from "./vi-VN"

