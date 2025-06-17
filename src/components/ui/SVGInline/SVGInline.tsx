import { cn } from "@/lib/utils"
import { ReactSVG, Props as ReactSVGProps } from "react-svg"
import styles from "./SVGInline.module.scss"

// Exclude 'ref' from the props
type SVGInlineProps = Omit<ReactSVGProps, "ref">

function SVGInline({ className, ...props }: SVGInlineProps) {
  return <ReactSVG {...props} className={cn(styles.svg, className)} />
}

export { SVGInline }
