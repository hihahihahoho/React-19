"use client";

import { cn } from "@/lib/utils";
import { ReactSVG, Props as ReactSVGProps } from "react-svg";

import { Skeleton } from "../skeleton";
import styles from "./svg-inline.module.css";

// Exclude 'ref' from the props
type SVGInlineProps = Omit<ReactSVGProps, "ref">;

function SVGInline({ className, ...props }: SVGInlineProps) {
  return (
    <ReactSVG
      {...props}
      className={cn("relative", styles.svg, className)}
      loading={() => <Skeleton className={cn("rounded-xl absolute inset-0")} />}
    />
  );
}

export { SVGInline };
