"use client";
// not-found params almadığı için dil, istemci yolundan seçilir. Sunucu üç dilin görünümünü hazırlar;
// böylece 404 sınırı headers() çağırmaz ve [lang] altındaki sayfalar statik/ISR kalabilir.
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isLocale, type Locale } from "@/i18n/config";

export function PickLocale({ views }: { views: Record<Locale, ReactNode> }) {
  const first = (usePathname() ?? "/").split("/")[1] ?? "";
  return <>{views[isLocale(first) ? first : "tr"]}</>;
}
