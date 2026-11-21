import { locales, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { PickLocale } from "@/components/pick-locale";
import { Shell } from "@/components/shell";
import { Container } from "@/components/ui";
import { staticAlternates } from "@/lib/site";

function View({ lang }: { lang: Locale }) {
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

// not-found params almaz; headers() de çağırmayız (tüm [lang] sayfalarını dinamik yapar). Dil istemci yolundan seçilir.
export default function NotFound() {
  const views = Object.fromEntries(locales.map((l) => [l, <View key={l} lang={l} />])) as Record<Locale, React.ReactNode>;
  return <PickLocale views={views} />;
}
