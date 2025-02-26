"use client";

import { BreadcrumbsContext } from "@/components/layout/dynamic-breadcrumb/dynamic-breadcrumb-context";
import { useContext } from "react";

const useBreadcrumbsContext = () => {
  const context = useContext(BreadcrumbsContext);
  if (!context) {
    throw new Error(
      "useBreadcrumbsContext must be used within a BreadcrumbsProvider"
    );
  }
  return context;
};

export default useBreadcrumbsContext;
