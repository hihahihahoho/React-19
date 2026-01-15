"use client"

import { useId } from "react"

import { cn } from "@/lib/utils"
import { ReactSVG, Props as ReactSVGProps } from "react-svg"

import { Skeleton } from "../skeleton"
import styles from "./svg-inline.module.css"

// Exclude 'ref' from the props
type SVGInlineProps = Omit<ReactSVGProps, "ref">

/**
 * Extract SVG filename without extension from src path
 */
function getSvgName(src: string): string {
  const urlWithoutQuery = src.split("?")[0]
  const filename = urlWithoutQuery.split("/").pop() || ""
  return filename.split(".")[0]
}

/**
 * Modify all IDs in SVG to be unique and update references
 */
function modifySvgIds(svg: SVGElement, uniqueId: string): void {
  const elementsWithId = svg.querySelectorAll("[id]")
  const idMap = new Map<string, string>()

  // First pass: collect all IDs and generate unique versions
  elementsWithId.forEach((element) => {
    const originalId = element.id
    const newId = `${originalId}-${uniqueId}`
    idMap.set(originalId, newId)
    element.setAttribute("id", newId)
  })

  if (idMap.size > 0) {
    const allElements = svg.getElementsByTagName("*")
    for (const element of Array.from(allElements)) {
      for (const attr of Array.from(element.attributes)) {
        let newValue = attr.value
        idMap.forEach((newId, originalId) => {
          newValue = newValue
            .replace(
              new RegExp(`url\\(#${originalId}\\)`, "g"),
              `url(#${newId})`
            )
            .replace(new RegExp(`#${originalId}(?![\\w-])`, "g"), `#${newId}`)
        })
        if (newValue !== attr.value) {
          attr.value = newValue
        }
      }
    }
  }
}

function SVGInline({
  className,
  src,
  beforeInjection,
  ...props
}: SVGInlineProps) {
  const reactId = useId()
  // Create a stable unique suffix from React's useId
  const uniqueId = reactId.replace(/:/g, "")

  const svgName = src ? getSvgName(src) : ""
  const svgClassName = svgName ? `icon-svg-${svgName}` : ""

  const handleBeforeInjection = (svg: SVGSVGElement) => {
    // Add class based on SVG name
    if (svgClassName) {
      svg.classList.add(svgClassName)
    }

    // Modify IDs to be unique
    modifySvgIds(svg, uniqueId)

    // Call original beforeInjection if provided
    beforeInjection?.(svg)
  }

  return (
    <ReactSVG
      {...props}
      src={src}
      beforeInjection={handleBeforeInjection}
      className={cn("relative", styles.svg, svgClassName, className)}
      loading={() => <Skeleton className={cn("absolute inset-0 rounded-xl")} />}
    />
  )
}

export { SVGInline }
