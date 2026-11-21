export const locales = ["tr", "en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

export const localeMeta: Record<Locale, { label: string; short: string; dir: "ltr" | "rtl"; hreflang: string; ogLocale: string; intl: string }> = {
  tr: { label: "Türkçe", short: "TR", dir: "ltr", hreflang: "tr-TR", ogLocale: "tr_TR", intl: "tr-TR" },
  en: { label: "English", short: "EN", dir: "ltr", hreflang: "en", ogLocale: "en_US", intl: "en-GB" },
  ar: { label: "العربية", short: "AR", dir: "rtl", hreflang: "ar", ogLocale: "ar_AR", intl: "ar" },
};

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}
