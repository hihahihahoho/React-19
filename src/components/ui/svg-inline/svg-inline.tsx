"use client"

import { cn } from "@/lib/utils"
import { ReactSVG, Props as ReactSVGProps } from "react-svg"
import { Skeleton } from "../skeleton"
import styles from "./svg-inline.module.css"

type SVGInlineProps = Omit<ReactSVGProps, "ref">

function getSvgName(src: string): string {
  const urlWithoutQuery = src.split("?")[0]
  const filename = urlWithoutQuery.split("/").pop() || ""
  return filename.split(".")[0]
}

function SVGInline({ className, src, ...props }: SVGInlineProps) {
  const svgName = src ? getSvgName(src) : ""
  const svgClassName = svgName ? `icon-svg-${svgName}` : ""

  return (
    <ReactSVG
      {...props}
      src={src}
      className={cn("relative", styles.svg, svgClassName, className)}
      loading={() => <Skeleton className={cn("absolute inset-0 rounded-xl")} />}
    />
  )
}

export { SVGInline }
