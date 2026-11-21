import { notFound } from "next/navigation";
import { isLocale, localeMeta, locales, type Locale } from "@/i18n/config";
import { href, type RouteKey } from "@/i18n/routes";
import type { LocalizedPost, PostType } from "./types";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const REVALIDATE = 300;

/** Sayfa parametresinden dili çözer; geçersizse 404. */
export async function langFrom(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}

export const typeRoute: Record<PostType, RouteKey> = { haber: "news", kose: "column", rapor: "report" };
export const typeListRoute: Record<PostType, RouteKey> = { haber: "news", kose: "columns", rapor: "reports" };

export function postHref(lang: Locale, p: Pick<LocalizedPost, "type"> & { t: { slug: string } }) {
  return href(lang, typeRoute[p.type], p.t.slug);
}

export const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

const tz = "Europe/Istanbul";
export function fmtDate(lang: Locale, iso: string, style: "long" | "short" | "full" = "long") {
  const d = new Date(iso);
  if (style === "short") return new Intl.DateTimeFormat(localeMeta[lang].intl, { day: "numeric", month: "short", year: "numeric", timeZone: tz }).format(d);
  if (style === "full")
    return new Intl.DateTimeFormat(localeMeta[lang].intl, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: tz }).format(d);
  return new Intl.DateTimeFormat(localeMeta[lang].intl, { day: "numeric", month: "long", year: "numeric", timeZone: tz }).format(d);
}
export const fmtNum = (lang: Locale, n: number) => new Intl.NumberFormat(localeMeta[lang].intl).format(n);
export const fmtMoney = (lang: Locale, n: number, currency: string) =>
  new Intl.NumberFormat(localeMeta[lang].intl, { style: "currency", currency, maximumFractionDigits: 0 }).format(n);

/** Dil değiştirici + hreflang için: her dilin eş URL'si (yoksa null). */
export type Alternates = Partial<Record<Locale, string | null>>;
export function staticAlternates(key?: RouteKey, ...rest: (string | number)[]): Alternates {
  return Object.fromEntries(locales.map((l) => [l, href(l, key, ...rest)]));
}
export function postAlternates(p: LocalizedPost): Alternates {
  return Object.fromEntries(locales.map((l) => [l, p.alternates[l] ? href(l, typeRoute[p.type], p.alternates[l]!) : null]));
}

/** Next metadata alternates (canonical + hreflang + x-default). */
export function metaAlternates(lang: Locale, alt: Alternates) {
  const languages: Record<string, string> = {};
  for (const l of locales) if (alt[l]) languages[localeMeta[l].hreflang] = abs(alt[l]!);
  if (alt.tr) languages["x-default"] = abs(alt.tr);
  return { canonical: abs(alt[lang] ?? href(lang)), languages };
}
