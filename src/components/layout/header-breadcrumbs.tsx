import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link, useMatches } from "@tanstack/react-router"
import { Fragment } from "react/jsx-runtime"
import { SVGInline } from "../ui/SVGInline/SVGInline"

interface StaticData {
  title?: string
}

function HeaderBreadcrumbs() {
  const matches = useMatches()
  console.log(matches)
  // Filter matches that have a crumb in staticData and deduplicate based on normalized paths
  const matchesWithCrumbs = matches
    .filter((match) => (match.staticData as StaticData)?.title != null)
    .reduce(
      (unique, match) => {
        // Normalize the pathname by removing trailing slash

        const normalizedPath = match.pathname.replace(/\/$/, "")

        // Only add if we haven't seen this normalized path before
        if (
          !unique.some((m) => m.pathname.replace(/\/$/, "") === normalizedPath)
        ) {
          unique.push(match)
        }
        return unique
      },
      [] as typeof matches
    )
  console.log(
    matches.filter((match) => (match.staticData as StaticData)?.title != null)
  )

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <div className="flex items-center gap-2.5">
          <Link to="/" className="flex items-center justify-center">
            Trang chủ
          </Link>
          <SVGInline
            src="/icon/ChevronRight.svg"
            className="text-icon-default-tertiary size-4"
          />
        </div>
        {matchesWithCrumbs.map((match, index) => {
          const crumb = (match.staticData as StaticData).title
          const isLast = index === matchesWithCrumbs.length - 1
          return (
            <Fragment key={match.pathname}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb}</BreadcrumbPage>
                ) : match.pathname !== "/" ? (
                  <BreadcrumbLink asChild>
                    <Link to={match.pathname}>{crumb}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="text-text-default-tertiary">
                    {crumb}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export { HeaderBreadcrumbs }
