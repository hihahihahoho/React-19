import { getSubdomain } from "@/lib/utils";
import { AVAILABLE_BRANDS, Brand } from "@/types/branding";
import { headers } from "next/headers";

// Utility function

// Server hook
export function useServerBrand(): Brand {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const subdomain = getSubdomain(host);

  return AVAILABLE_BRANDS.includes(subdomain as Brand)
    ? (subdomain as Brand)
    : "default";
}
