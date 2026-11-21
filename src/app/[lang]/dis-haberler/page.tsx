// Dış Haberler — T8 (Analiz dergisi) dili: lacivert kapak, "Bu sayıda" içindekiler, öne çıkan bant, dosyalar, konular.
import type { Metadata } from "next";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { Shell } from "@/components/shell";
import { Cover, Empty, JsonLd } from "@/components/ui";
import { listPosts } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { abs, fmtDate, langFrom, postHref, staticAlternates } from "@/lib/site";
import type { Tag } from "@/lib/types";
import { Caps } from "@/themes/foreign/article";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/[lang]/dis-haberler">): Promise<Metadata> {
  const lang = await langFrom(params);
  const d = getDict(lang);
  return pageMeta(lang, { title: d.foreign.title, description: d.foreign.issueOf, alternates: staticAlternates("foreign") });
}

export default async function Foreign({ params }: PageProps<"/[lang]/dis-haberler">) {
  const lang = await langFrom(params);
  const d = getDict(lang);
  const posts = await listPosts(lang, { theme: "foreign", limit: 40 });
  const [lead, feature, ...rest] = posts;
  const toc = rest.filter((p) => p.type !== "rapor").slice(0, 8);
  const dossiers = posts.filter((p) => p.type === "rapor");
  const more = rest.filter((p) => p.type !== "rapor").slice(8);

  const topicMap = new Map<string, { tag: Tag; n: number; last: string }>();
  for (const p of posts)
    for (const t of p.tags) {
      const x = topicMap.get(t.id) ?? { tag: t, n: 0, last: p.publishedAt };
      x.n++;
      topicMap.set(t.id, x);
    }
  const topics = [...topicMap.values()].sort((a, b) => b.n - a.n).slice(0, 8);

  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: d.foreign.title,
    url: abs(href(lang, "foreign")),
    inLanguage: lang,
    mainEntity: { "@type": "ItemList", itemListElement: posts.slice(0, 20).map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(postHref(lang, p)) })) },
  };

  return (
    <Shell lang={lang} theme="foreign" alternates={staticAlternates("foreign")} active="foreign">
      <JsonLd data={ld} />
      {!lead ? (
        <div className="mx-auto max-w-[1240px] px-5 py-24 lg:px-8">
          <h1 className="font-display text-[56px] leading-none text-head">{d.foreign.title}</h1>
          <div className="mt-10">
            <Empty>{d.common.empty}</Empty>
          </div>
        </div>
      ) : (
        <>
          {/* Kapak */}
          <section className="bg-navy text-white">
            <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-white/15 pt-6">
                <h1 className="font-display text-[40px] leading-none sm:text-[52px]">{d.foreign.title}</h1>
                <p className="font-ui text-[13px] text-white/55">{d.foreign.issueOf}</p>
              </div>
            </div>
            <div className="mx-auto grid max-w-[1240px] gap-10 px-5 pb-16 pt-10 lg:grid-cols-12 lg:px-8 lg:pb-20 lg:pt-12">
              <div className="flex flex-col lg:col-span-7">
                <span className="mb-4 block h-[7px] w-[26px] bg-crimson" />
                <Caps className="text-white/70">
                  {d.foreign.cover} · {d.type[lead.type]}
                  {lead.isPremium && <span className="ms-3 bg-crimson px-1.5 py-px text-[10.5px] text-white">{d.common.premium}</span>}
                </Caps>
                <h2 className="balance mt-6 font-display text-[48px] leading-[1.02] sm:text-[72px] lg:text-[84px]">
                  <a href={postHref(lang, lead)} className="hover:text-white/85">{lead.t.title}</a>
                </h2>
                <p className="pretty mt-7 max-w-[46ch] font-body text-[19px] italic leading-[1.55] text-white/80">{lead.t.dek}</p>
                <div className="mt-auto flex items-center gap-3 pt-10">
                  <img src="/img/avatar.jpg" alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
                  <div className="font-ui">
                    <p className="text-[14px] font-semibold">{lead.author.name}</p>
                    <p className="text-[12.5px] text-white/55">
                      <time dateTime={lead.publishedAt}>{fmtDate(lang, lead.publishedAt)}</time> · {lead.readMin} {d.common.minRead}
                    </p>
                  </div>
                </div>
              </div>
              <figure className="lg:col-span-5">
                <a href={postHref(lang, lead)} tabIndex={-1} aria-hidden className="block border border-white/20 p-2.5">
                  <Cover media={lead.cover} eager className="aspect-[4/5] w-full" />
                </a>
                {(lead.cover?.caption || lead.cover?.credit) && (
                  <figcaption className="mt-2.5 flex justify-between gap-4 font-ui text-[11.5px] text-white/50">
                    <span>{lead.cover?.caption}</span>
                    <span className="shrink-0">{lead.cover?.credit}</span>
                  </figcaption>
                )}
              </figure>
            </div>
          </section>

          {/* Bu sayıda */}
          {toc.length > 0 && (
            <section className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-20">
              <div className="flex items-end justify-between border-b-2 border-navy pb-4">
                <h2 className="font-display text-[44px] leading-none text-head sm:text-[56px]">{d.foreign.inThisIssue}</h2>
                <a href={`${href(lang, "archive")}?cat=${encodeURIComponent(lead.category.slug[lang])}`} className="font-ui text-[13px] font-semibold text-crimson hover:underline">
                  {d.common.allPosts} <span aria-hidden className="inline-block rtl:-scale-x-100">→</span>
                </a>
              </div>
              <ol className="grid md:grid-cols-2 md:gap-x-14">
                {toc.map((a, i) => (
                  <li key={a.id} className="border-b border-line">
                    <a href={postHref(lang, a)} className="group grid grid-cols-[2.75rem_1fr] gap-x-3 py-6">
                      <span className="font-display text-[30px] leading-none text-crimson tnum">{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        <Caps className="text-muted">
                          {d.type[a.type]} · {fmtDate(lang, a.publishedAt, "short")}
                          {a.isPremium && <span className="ms-2 text-crimson">· {d.common.premium}</span>}
                        </Caps>
                        <span className="balance mt-2 block font-display text-[26px] leading-[1.12] text-head decoration-1 underline-offset-4 group-hover:underline">{a.t.title}</span>
                        <span className="mt-2 block font-body text-[15.5px] italic leading-[1.5] text-fg-3">{a.t.dek}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Öne çıkan bant */}
          {feature && (
            <section className="mx-auto max-w-[1240px] px-5 lg:px-8">
              <a href={postHref(lang, feature)} className="group grid overflow-hidden bg-white shadow-[0_1px_2px_rgba(15,36,64,0.08)] lg:grid-cols-2">
                <Cover media={feature.cover} className="aspect-[16/10] h-full w-full" />
                <div className="flex flex-col justify-center p-8 sm:p-12">
                  <Caps className="text-crimson">
                    {d.type[feature.type]} · {feature.t.place || feature.t.kicker || fmtDate(lang, feature.publishedAt, "short")}
                  </Caps>
                  <p className="balance mt-4 font-display text-[38px] leading-[1.06] text-head group-hover:underline sm:text-[48px]">{feature.t.title}</p>
                  <p className="pretty mt-5 font-body text-[17px] italic leading-[1.55] text-fg-3">{feature.t.dek}</p>
                </div>
              </a>
            </section>
          )}

          {/* Dosyalar (raporlar) */}
          {dossiers.length > 0 && (
            <section className="mx-auto max-w-[1240px] px-5 pt-16 lg:px-8 lg:pt-20">
              <Caps className="text-muted">{d.home.dossiers}</Caps>
              <div className="mt-5 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
                {dossiers.map((r) => (
                  <a key={r.id} href={postHref(lang, r)} className="group bg-bg p-6 transition-colors duration-150 hover:bg-white">
                    <span className="block h-[6px] w-[22px] bg-crimson" />
                    <p className="mt-5 font-display text-[28px] leading-[1.08] text-head">{r.t.title}</p>
                    <p className="mt-3 font-ui text-[13px] text-muted">
                      {d.type.rapor} · {fmtDate(lang, r.publishedAt, "short")}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Konular */}
          {topics.length > 0 && (
            <section className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-20">
              <Caps className="text-muted">{d.common.tags}</Caps>
              <div className="mt-5 grid grid-cols-2 gap-px bg-line lg:grid-cols-4">
                {topics.map(({ tag, n }) => (
                  <a key={tag.id} href={href(lang, "tag", tag.slug)} className="group bg-bg p-6 transition-colors duration-150 hover:bg-white">
                    <p className="font-display text-[26px] leading-none text-head">{tag.name[lang]}</p>
                    <p className="mt-3 font-ui text-[13px] text-muted tnum">
                      {n} {d.archive.posts}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {more.length > 0 && (
            <section className="mx-auto max-w-[1240px] px-5 pb-20 lg:px-8">
              <ul className="grid gap-x-10 border-t-2 border-navy md:grid-cols-3">
                {more.map((p) => (
                  <li key={p.id} className="border-b border-line py-5">
                    <a href={postHref(lang, p)} className="group block">
                      <Caps className="text-muted">{fmtDate(lang, p.publishedAt, "short")}</Caps>
                      <span className="mt-2 block font-display text-[21px] leading-[1.15] text-head group-hover:underline">{p.t.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Yazar */}
          <section className="bg-navy text-white">
            <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 py-16 md:grid-cols-12 lg:px-8">
              <div className="w-full max-w-[300px] overflow-hidden bg-[#1d3657] md:col-span-4">
                <img src="/img/portrait.jpg" alt="Çetiner Çetin" loading="lazy" className="aspect-[4/5] w-full object-cover object-top" />
              </div>
              <div className="md:col-span-8">
                <Caps className="text-[#ff8a8f]">{d.nav.about}</Caps>
                <p className="mt-4 font-display text-[46px] leading-none sm:text-[58px]">Çetiner Çetin</p>
                <p className="mt-3 font-ui text-[14px] text-white/60">{lead.author.role[lang]} · Habertürk</p>
                <a href={href(lang, "about")} className="mt-8 inline-flex items-center gap-2 border-b border-white/40 pb-1 font-ui text-[14px] font-semibold hover:border-white">
                  {d.nav.about} <span aria-hidden className="inline-block rtl:-scale-x-100">→</span>
                </a>
              </div>
            </div>
          </section>
        </>
      )}
    </Shell>
  );
}
