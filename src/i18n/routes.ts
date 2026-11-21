// Tek kaynak rota tablosu: hem link üretimi hem next.config rewrite/redirect kuralları buradan.
// Klasör adları (iç yol) Türkçedir: src/app/[lang]/<tr segment>. EN/AR için URL'ler İngilizce segment kullanır.
import { defaultLocale, type Locale } from "./config";

export const segments = {
  news: { tr: "haber", en: "news" },
  columns: { tr: "kose-yazilari", en: "columns" },
  column: { tr: "kose-yazisi", en: "column" },
  reports: { tr: "raporlar", en: "reports" },
  report: { tr: "rapor", en: "report" },
  foreign: { tr: "dis-haberler", en: "world" },
  archive: { tr: "arsiv", en: "archive" },
  about: { tr: "kimdir", en: "about" },
  imprint: { tr: "kunye", en: "masthead" },
  subscribe: { tr: "abonelik", en: "subscribe" },
  login: { tr: "giris", en: "login" },
  register: { tr: "kayit", en: "register" },
  account: { tr: "hesabim", en: "account" },
  category: { tr: "kategori", en: "category" },
  tag: { tr: "etiket", en: "tag" },
  preview: { tr: "onizleme", en: "preview" },
} as const;

export type RouteKey = keyof typeof segments;

function seg(key: RouteKey, lang: Locale) {
  return lang === "tr" ? segments[key].tr : segments[key].en;
}

/** Herkese açık URL üretir. TR kökte, diğer diller /en, /ar önekli. */
export function href(lang: Locale, key?: RouteKey, ...rest: (string | number)[]) {
  const prefix = lang === defaultLocale ? "" : `/${lang}`;
  if (!key) return prefix || "/";
  const tail = rest.length ? "/" + rest.map((r) => encodeURIComponent(String(r))).join("/") : "";
  return `${prefix}/${seg(key, lang)}${tail}`;
}

export function withQuery(url: string, q: Record<string, string | number | undefined | null>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) if (v !== undefined && v !== null && v !== "") p.set(k, String(v));
  const s = p.toString();
  return s ? `${url}?${s}` : url;
}
