import { headers } from "next/headers";
import { isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { Shell } from "@/components/shell";
import { Container } from "@/components/ui";
import { staticAlternates } from "@/lib/site";

export default async function NotFound() {
  // not-found params almaz; dili istek yolundan çıkar.
  const h = await headers();
  const path = h.get("x-invoke-path") ?? h.get("next-url") ?? h.get("referer") ?? "";
  const first = path.replace(/^https?:\/\/[^/]+/, "").split("/")[1] ?? "";
  const lang: Locale = isLocale(first) ? first : "tr";
  const d = getDict(lang);
  return (
    <Shell lang={lang} alternates={staticAlternates()}>
      <Container className="py-28">
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent">404</p>
        <h1 className="mt-4 font-display text-[52px] font-medium italic leading-[0.98] text-head sm:text-[80px]">{d.notFound.title}</h1>
        <p className="mt-6 max-w-[48ch] text-[18px] leading-[1.6] text-fg-2">{d.notFound.text}</p>
        <div className="mt-10 flex flex-wrap gap-3 font-label text-[13px] font-semibold uppercase tracking-[0.1em]">
          <a href={href(lang)} className="bg-invert px-5 py-3 text-invert-fg hover:opacity-90">{d.notFound.back}</a>
          <a href={href(lang, "archive")} className="border border-line-2 px-5 py-3 hover:border-fg">{d.nav.archive}</a>
        </div>
      </Container>
    </Shell>
  );
}
