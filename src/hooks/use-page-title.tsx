import { useMatches } from "@tanstack/react-router"

interface PageTitleState {
  title: string
  isLoading: boolean
}

export function usePageTitle(): PageTitleState {
  const matches = useMatches()
  const matchesWithCrumbs = matches
    .filter((match) => (match.staticData as PageTitleState)?.title != null)
    .reduce(
      (unique, match) => {
        const normalizedPath = match.pathname.replace(/\/$/, "")

        if (
          !unique.some((m) => m.pathname.replace(/\/$/, "") === normalizedPath)
        ) {
          unique.push(match)
        }
        return unique
      },
      [] as typeof matches
    )
  const lastMatch = matchesWithCrumbs[matchesWithCrumbs.length - 1]

  // Check if the route is currently loading
  const isLoading = matches.some((match) => match.status === "pending")

  // Type assert the loader data
  const loaderData = lastMatch?.loaderData as any | undefined
  const staticData = lastMatch?.staticData as any | undefined

  return {
    title: isLoading
      ? loaderData?.context?.title
      : loaderData?.context?.title || staticData?.title,
    isLoading,
  }
}
