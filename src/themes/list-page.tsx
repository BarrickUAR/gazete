// Liste sayfaları (haberler, köşe yazıları, raporlar, kategori, etiket) — T2 dili.
// Statik + ISR: ilk 30 kayıt; daha eskisi için arşiv (filtreli arama) bağlantısı.
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href, withQuery, type RouteKey } from "@/i18n/routes";
import { Shell } from "@/components/shell";
import { Breadcrumbs, Container, Empty, JsonLd, PostCard, PostRow } from "@/components/ui";
import { abs, postHref, type Alternates } from "@/lib/site";
import type { LocalizedPost } from "@/lib/types";

export const LIST_LIMIT = 30;

export function ListPage({
  lang,
  title,
  intro,
  kicker,
  active,
  alternates,
  posts,
  archiveQuery,
  selfPath,
  extra,
}: {
  lang: Locale;
  title: string;
  intro?: string;
  kicker?: string;
  active?: RouteKey;
  alternates: Alternates;
  posts: LocalizedPost[];
  archiveQuery?: Record<string, string>;
  selfPath: string;
  extra?: ReactNode;
}) {
  const d = getDict(lang);
  const [first, second, ...rest] = posts;
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    url: abs(selfPath),
    inLanguage: lang,
    mainEntity: { "@type": "ItemList", itemListElement: posts.slice(0, 20).map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(postHref(lang, p)) })) },
  };
  return (
    <Shell lang={lang} alternates={alternates} active={active}>
      <JsonLd data={ld} />
      <Container className="pb-24 pt-10">
        <Breadcrumbs items={[{ label: d.common.home, to: href(lang) }, { label: title }]} />
        <header className="mt-8 grid gap-6 border-b border-line-2 pb-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {kicker && <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-accent">■ {kicker}</p>}
            <h1 className="mt-4 font-display text-[48px] font-medium italic leading-[0.95] tracking-[-0.02em] text-head sm:text-[76px]">{title}</h1>
          </div>
          {intro && <p className="pretty self-end text-[16.5px] leading-[1.6] text-fg-3 lg:col-span-4">{intro}</p>}
        </header>
        {extra}
        {!first ? (
          <div className="mt-12">
            <Empty>{d.common.empty}</Empty>
          </div>
        ) : (
          <>
            <div className="mt-12 grid gap-x-8 gap-y-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <PostCard lang={lang} post={first} big />
              </div>
              {second && (
                <div className="lg:col-span-5">
                  <PostCard lang={lang} post={second} ratio="aspect-[4/3]" gray />
                </div>
              )}
            </div>
            {rest.length > 0 && (
              <ol className="mt-14 border-t border-line-2">
                {rest.map((p, i) => (
                  <PostRow key={p.id} lang={lang} post={p} index={i + 2} />
                ))}
              </ol>
            )}
            {posts.length >= LIST_LIMIT && (
              <div className="mt-10 text-center">
                <a href={withQuery(href(lang, "archive"), archiveQuery ?? {})} className="inline-block border border-line-2 px-6 py-3 font-label text-[13px] font-semibold uppercase tracking-[0.1em] hover:bg-invert hover:text-invert-fg">
                  {d.archive.title} <span aria-hidden className="inline-block rtl:-scale-x-100">→</span>
                </a>
              </div>
            )}
          </>
        )}
      </Container>
    </Shell>
  );
}
