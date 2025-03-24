import { transliterateVietnamese } from "./transliterate-vietnamese"

/**
 * Simple fuzzy search implementation
 * Returns a score where 0 is no match and higher numbers indicate better matches
 * @param searchText The text to search for
 * @param content The content to search in
 * @returns Number representing match score (higher is better)
 */
export function fuzzySearch(searchText: string, content: string): number {
  // Empty searches match everything with high score
  if (!searchText) return 1

  const searchLower = searchText.toLowerCase()
  const contentLower = content.toLowerCase()

  // Exact match gets highest score
  if (contentLower.includes(searchLower)) {
    return 2 + searchLower.length / contentLower.length
  }

  let score = 0
  let searchIndex = 0
  let consecutiveMatches = 0

  // Look for characters in sequence, allowing for skipped characters
  for (
    let i = 0;
    i < contentLower.length && searchIndex < searchLower.length;
    i++
  ) {
    if (contentLower[i] === searchLower[searchIndex]) {
      // Found a matching character
      searchIndex++

      // Consecutive matches are weighted more heavily
      consecutiveMatches++
      score += consecutiveMatches * 0.1

      // Beginning of word matches are more important
      if (
        i === 0 ||
        contentLower[i - 1] === " " ||
        contentLower[i - 1] === "-"
      ) {
        score += 0.5
      }
    } else {
      // Reset consecutive matches
      consecutiveMatches = 0
    }
  }

  // If we found all characters in sequence, return the score
  if (searchIndex === searchLower.length) {
    // Adjust score based on how much of the content we had to scan
    // Shorter matches are better matches
    const percentageOfContentUsed = searchLower.length / contentLower.length
    score += percentageOfContentUsed
    return score
  }

  // If we didn't find all characters, no match
  return 0
}

/**
 * Convert transliterated Vietnamese result to string
 * Safely handles both string and string[] return types
 */
function transliteratedToString(value: string | string[]): string {
  if (Array.isArray(value)) {
    return value.join("")
  }
  return value
}

/**
 * Generic fuzzy filter function that works with arrays of strings
 * @param searchableStrings Array of strings to search through
 * @param filter Search text
 * @returns Object with matched indices and their scores
 */
export function fuzzyFilterStrings(
  searchableStrings: string[],
  filter: string
): { index: number; score: number }[] {
  if (!filter) {
    // Return all items with score 1 when no filter
    return searchableStrings.map((_, index) => ({ index, score: 1 }))
  }

  const filterText = filter.toLowerCase()
  const transliteratedFilterResult = transliterateVietnamese(filterText)

  // Get filterValues as array for consistent comparison
  const filterValues: string[] = []

  // Add original filter
  filterValues.push(filterText)

  // Add transliterated filter value(s)
  if (Array.isArray(transliteratedFilterResult)) {
    // Add each transliterated value
    filterValues.push(...transliteratedFilterResult)
  } else if (typeof transliteratedFilterResult === "string") {
    // Add the single string value
    filterValues.push(transliteratedFilterResult)
  }

  // Score each string
  const results = searchableStrings.map((searchStr, index) => {
    const normalizedText = searchStr.toLowerCase()

    // Try exact matching first
    for (const filterVal of filterValues) {
      if (normalizedText.includes(filterVal)) {
        // High score for direct matches
        return { index, score: 10 }
      }
    }

    // If no direct match, try fuzzy search
    let bestScore = 0

    // Check against text
    const fuzzyScore = fuzzySearch(filterText, normalizedText)
    if (fuzzyScore > bestScore) bestScore = fuzzyScore

    // Check transliterated versions if no good match yet
    if (bestScore < 0.5) {
      // Generate transliterated version of the text
      const transliteratedText = transliteratedToString(
        transliterateVietnamese(normalizedText)
      )

      // Check transliterated versions against each filter value
      for (const filterVal of filterValues) {
        const fuzzyScoreTransliterated = fuzzySearch(
          filterVal,
          transliteratedText
        )
        if (fuzzyScoreTransliterated > bestScore)
          bestScore = fuzzyScoreTransliterated
      }
    }

    return { index, score: bestScore }
  })

  // Filter out items with zero score and sort by score (descending)
  return results
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
}
