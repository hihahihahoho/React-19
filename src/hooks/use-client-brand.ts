import { getSubdomain } from "@/lib/utils";
import { AVAILABLE_BRANDS, Brand } from "@/types/branding";
import { useEffect, useState } from "react";

export function useClientBrand(): Brand {
  const [brand, setBrand] = useState<Brand>("default");

  useEffect(() => {
    const host = window.location.host;
    const subdomain = getSubdomain(host);
    const detectedBrand = AVAILABLE_BRANDS.includes(subdomain as Brand)
      ? (subdomain as Brand)
      : "default";
    setBrand(detectedBrand);
  }, []);

  return brand;
}
