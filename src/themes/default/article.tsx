// T2 · Muhabir dosyası — haber, köşe yazısı ve rapor detay şablonu (genel site).
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { Breadcrumbs, Container, Cover, Label, PostCard } from "@/components/ui";
import { postHref, typeListRoute } from "@/lib/site";
import type { LocalizedPost } from "@/lib/types";
import { ArticleBody, Byline, ReportTools, Toc } from "../article-parts";

export function DefaultArticle({ lang, post, related, latest }: { lang: Locale; post: LocalizedPost; related: LocalizedPost[]; latest: LocalizedPost[] }) {
  const d = getDict(lang);
  const place = post.t.place || post.t.kicker || post.category.name[lang];
  return (
    <article>
      <figure>
        <Cover media={post.cover} eager gray={post.type !== "haber"} className="h-[46vh] min-h-[300px] w-full brightness-90" />
        {(post.cover?.caption || post.cover?.credit) && (
          <figcaption className="mx-auto flex max-w-[1320px] justify-between gap-4 px-5 pt-2 font-mono text-[10.5px] uppercase tracking-[0.06em] text-muted lg:px-8">
            <span className="normal-case">{post.cover?.caption}</span>
            <span className="hidden shrink-0 normal-case sm:inline">{post.cover?.credit}</span>
          </figcaption>
        )}
      </figure>

      <Container className="grid gap-x-12 gap-y-10 pb-20 pt-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Breadcrumbs
            items={[
              { label: d.common.home, to: href(lang) },
              { label: d.typePlural[post.type], to: href(lang, typeListRoute[post.type]) },
              { label: post.category.name[lang], to: href(lang, "category", post.category.slug[lang]) },
            ]}
          />
          <p className="mt-7 font-mono text-[11.5px] uppercase tracking-[0.12em]">
            <span className="text-accent">■ {d.type[post.type]}</span>
            <span className="mx-3 text-line-2">/</span>
            <span className="text-muted">{place}</span>
            {post.isPremium && <span className="ms-3 border border-accent px-1.5 py-px text-[10px] text-accent">{d.common.premium}</span>}
          </p>
          <h1 className="balance mt-5 font-display text-[40px] font-medium italic leading-[1.0] tracking-[-0.02em] text-head sm:text-[60px] lg:text-[72px]">{post.t.title}</h1>
          {post.t.dek && <p className="pretty mt-6 max-w-[62ch] text-[19px] leading-[1.6] text-fg-2">{post.t.dek}</p>}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-y border-line py-5">
            <Byline lang={lang} post={post} />
            <ReportTools lang={lang} post={post} />
          </div>
          <div className="mt-10 max-w-[68ch]">
            <ArticleBody lang={lang} post={post} dropcap={post.type === "kose"} />
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="space-y-10 lg:sticky lg:top-24">
            <Toc lang={lang} post={post} />
            <a href={href(lang, "about")} className="group grid grid-cols-[64px_1fr] items-center gap-4 border-t border-line-2 pt-5">
              <img src="/img/avatar.jpg" alt="" width={64} height={64} className="h-16 w-16 object-cover grayscale" />
              <span>
                <span className="block font-display text-[22px] italic leading-none text-head">{post.author.name}</span>
                <span className="mt-1.5 block font-ui text-[12.5px] leading-[1.45] text-muted">{post.author.role[lang]}</span>
              </span>
            </a>
            {latest.length > 0 && (
              <div className="border-t border-line-2 pt-5">
                <Label>{d.common.latest}</Label>
                <ol className="mt-2">
                  {latest.map((p, i) => (
                    <li key={p.id} className="border-b border-line">
                      <a href={postHref(lang, p)} className="group grid grid-cols-[1.75rem_1fr] gap-2 py-3.5">
                        <span className="font-mono text-[11px] text-muted tnum">{String(i + 1).padStart(2, "0")}</span>
                        <span className="font-ui text-[14.5px] leading-[1.4] text-fg-2 group-hover:text-fg">{p.t.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </aside>
      </Container>

      {related.length > 0 && (
        <section className="border-t border-line bg-bg-2">
          <Container className="py-16">
            <Label accent>{d.common.related}</Label>
            <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <PostCard key={p.id} lang={lang} post={p} gray />
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
