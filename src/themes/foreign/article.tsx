// T8 · Analiz dergisi — Dış Haberler kategorisindeki tüm yazıların detay şablonu.
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { Breadcrumbs, Cover } from "@/components/ui";
import { fmtDate, postHref } from "@/lib/site";
import type { LocalizedPost } from "@/lib/types";
import { ArticleBody, Byline, ReportTools, Toc } from "../article-parts";

export function Caps({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-label text-[12.5px] font-semibold uppercase tracking-[0.1em] ${className}`}>{children}</p>;
}

export function ForeignArticle({ lang, post, related }: { lang: Locale; post: LocalizedPost; related: LocalizedPost[] }) {
  const d = getDict(lang);
  return (
    <article>
      <header className="bg-navy text-white">
        <div className="mx-auto grid max-w-[1240px] gap-10 border-t border-white/15 px-5 pb-14 pt-10 lg:grid-cols-12 lg:px-8 lg:pb-16 lg:pt-12">
          <div className="flex flex-col lg:col-span-7">
            <div className="[--muted:rgb(255_255_255/0.6)] [--fg:#fff] [--fg-2:#fff] [--line-2:rgb(255_255_255/0.3)]">
              <Breadcrumbs
                items={[
                  { label: d.common.home, to: href(lang) },
                  { label: d.foreign.title, to: href(lang, "foreign") },
                  { label: d.type[post.type] },
                ]}
              />
            </div>
            <span className="mb-4 mt-10 block h-[7px] w-[26px] bg-crimson" />
            <Caps className="text-white/70">
              {d.type[post.type]} · {post.t.kicker || post.t.place || post.category.name[lang]}
              {post.isPremium && <span className="ms-3 bg-crimson px-1.5 py-px text-[10.5px] text-white">{d.common.premium}</span>}
            </Caps>
            <h1 className="balance mt-5 font-display text-[42px] leading-[1.04] sm:text-[62px] lg:text-[72px]">{post.t.title}</h1>
            {post.t.dek && <p className="pretty mt-6 max-w-[48ch] font-body text-[19px] italic leading-[1.55] text-white/80">{post.t.dek}</p>}
            <div className="mt-auto pt-10">
              <Byline lang={lang} post={post} onDark />
            </div>
          </div>
          <figure className="lg:col-span-5">
            <div className="border border-white/20 p-2.5">
              <Cover media={post.cover} eager className="aspect-[4/5] w-full" />
            </div>
            {(post.cover?.caption || post.cover?.credit) && (
              <figcaption className="mt-2.5 flex justify-between gap-4 font-ui text-[11.5px] text-white/55">
                <span>{post.cover?.caption}</span>
                <span className="shrink-0">{post.cover?.credit}</span>
              </figcaption>
            )}
          </figure>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-14 lg:grid-cols-12 lg:px-8 lg:py-16">
        <aside className="order-2 lg:order-1 lg:col-span-3">
          <div className="space-y-8 lg:sticky lg:top-24">
            <div className="border-t-2 border-navy pt-4 font-ui text-[13px] text-muted">
              <p className="font-semibold text-head">{d.foreign.title}</p>
              <p className="mt-1">{d.foreign.issueOf}</p>
              <p className="mt-3">
                <time dateTime={post.publishedAt}>{fmtDate(lang, post.publishedAt)}</time>
              </p>
            </div>
            <Toc lang={lang} post={post} />
            <ReportTools lang={lang} post={post} />
          </div>
        </aside>
        <div className="order-1 max-w-[68ch] text-[19px] lg:order-2 lg:col-span-7 [&_.prose-news]:text-[19px] [&_.prose-news]:leading-[1.7]">
          <ArticleBody lang={lang} post={post} dropcap />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1240px] px-5 pb-20 lg:px-8">
          <div className="flex items-end justify-between border-b-2 border-navy pb-4">
            <h2 className="font-display text-[38px] leading-none text-head sm:text-[46px]">{d.foreign.inThisIssue}</h2>
            <a href={href(lang, "foreign")} className="font-ui text-[13px] font-semibold text-crimson hover:underline">
              {d.foreign.more} <span aria-hidden className="inline-block rtl:-scale-x-100">→</span>
            </a>
          </div>
          <ol className="grid md:grid-cols-2 md:gap-x-14">
            {related.map((p, i) => (
              <li key={p.id} className="border-b border-line">
                <a href={postHref(lang, p)} className="group grid grid-cols-[2.75rem_1fr] gap-x-3 py-6">
                  <span className="font-display text-[30px] leading-none text-crimson tnum">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <Caps className="text-muted">
                      {d.type[p.type]} · {fmtDate(lang, p.publishedAt, "short")}
                    </Caps>
                    <span className="balance mt-2 block font-display text-[25px] leading-[1.12] text-head decoration-1 underline-offset-4 group-hover:underline">{p.t.title}</span>
                    {p.t.dek && <span className="mt-2 block line-clamp-2 font-body text-[15.5px] italic leading-[1.5] text-fg-3">{p.t.dek}</span>}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>
      )}
    </article>
  );
}
