// app/hooks/useBreadcrumbs.ts

"use client";

import { useEffect } from "react";
import useBreadcrumbsContext from "./use-bread-crumb-context";

const useBreadcrumbs = (trailingPath: string) => {
  const { setTrailingPath } = useBreadcrumbsContext();

  useEffect(() => {
    if (trailingPath) {
      setTrailingPath(trailingPath);
    }
    // Cleanup on unmount
    return () => {
      setTrailingPath("");
    };
  }, [trailingPath, setTrailingPath]);
};

export default useBreadcrumbs;
