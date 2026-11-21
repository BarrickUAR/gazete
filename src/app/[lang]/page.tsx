import type { Metadata } from "next";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { NewsletterForm } from "@/components/forms";
import { Shell } from "@/components/shell";
import { Container, Cover, Empty, JsonLd, Label, Meta, MoreLink, PostCard, SectionTitle, TypeBadge } from "@/components/ui";
import { getHome } from "@/lib/data";
import { orgLd, pageMeta, personLd } from "@/lib/seo";
import { abs, fmtDate, langFrom, postHref, staticAlternates } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const lang = await langFrom(params);
  const d = getDict(lang);
  return { ...pageMeta(lang, { title: `${d.siteName} · ${d.tagline}`, alternates: staticAlternates() }), title: { absolute: `${d.siteName} · ${d.tagline}` } };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = await langFrom(params);
  const d = getDict(lang);
  const { latest, columns, foreign, reports, news } = await getHome(lang);
  const lead = latest[0];

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${abs("/")}#site`, url: abs(href(lang)), name: d.siteName, inLanguage: lang, publisher: { "@id": `${abs("")}/#org` }, potentialAction: { "@type": "SearchAction", target: `${abs(href(lang, "archive"))}?q={q}`, "query-input": "required name=q" } },
      orgLd(lang),
      personLd(lang),
    ],
  };

  if (!lead)
    return (
      <Shell lang={lang} alternates={staticAlternates()}>
        <Container className="py-24">
          <Empty>{d.common.empty}</Empty>
        </Container>
      </Shell>
    );

  const second = latest[1];
  const notebook = latest.slice(1, 6);
  const featuredCols = columns.filter((c) => c.id !== lead.id).slice(0, 3);
  const [f1, ...fRest] = featuredCols;

  return (
    <Shell lang={lang} alternates={staticAlternates()}>
      <JsonLd data={ld} />
      <h1 className="sr-only">{d.siteName} · {d.tagline}</h1>

      {/* Manşet: tam genişlik fotoğraf + altında başlık bloğu */}
      <section aria-labelledby="manset">
        <figure>
          <a href={postHref(lang, lead)} tabIndex={-1} aria-hidden>
            <Cover media={lead.cover} eager className="h-[52vh] min-h-[340px] w-full brightness-90 contrast-[1.15] grayscale" />
          </a>
          {(lead.cover?.caption || lead.cover?.credit) && (
            <figcaption className="mx-auto flex max-w-[1320px] justify-between gap-4 px-5 pt-2 font-mono text-[10.5px] tracking-[0.04em] text-muted lg:px-8">
              <span>{lead.cover?.caption}</span>
              <span className="hidden shrink-0 sm:inline">{lead.cover?.credit}</span>
            </figcaption>
          )}
        </figure>
        <Container className="grid gap-8 pb-16 pt-10 lg:grid-cols-12 lg:pt-12">
          <div className="lg:col-span-8">
            <p className="font-mono text-[11.5px] uppercase tracking-[0.14em]">
              <span className="text-accent">■ {d.home.lead}</span>
              <span className="mx-3 text-line-2">/</span>
              <span className="text-muted">
                <TypeBadge lang={lang} post={lead} /> · {fmtDate(lang, lead.publishedAt)}
              </span>
            </p>
            <h2 id="manset" className="balance mt-5 font-display text-[44px] font-medium italic leading-[0.98] tracking-[-0.02em] text-head sm:text-[68px] lg:text-[88px]">
              <a href={postHref(lang, lead)} className="hover:text-white">{lead.t.title}</a>
            </h2>
          </div>
          <div className="flex flex-col justify-end gap-6 lg:col-span-4 lg:border-s lg:border-line-2 lg:ps-8">
            <p className="pretty text-[17px] leading-[1.6] text-fg-2">{lead.t.dek}</p>
            <div className="flex items-center gap-5">
              <a href={postHref(lang, lead)} className="inline-flex items-center gap-2.5 bg-invert px-5 py-3 font-label text-[13px] font-semibold uppercase tracking-[0.1em] text-invert-fg transition-colors duration-150 hover:bg-white">
                {d.common.readMore} <span aria-hidden className="inline-block rtl:-scale-x-100">→</span>
              </a>
              <span className="font-mono text-[11px] uppercase text-muted">{lead.readMin} {d.common.min}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Son yazı şeridi */}
      {second && (
        <div className="border-y border-line bg-bg-3">
          <Container className="flex items-center gap-5 overflow-hidden py-3">
            <span className="shrink-0 bg-accent px-2 py-0.5 font-label text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-fg">{d.common.breaking}</span>
            <a href={postHref(lang, second)} className="truncate text-[14px] text-fg-2 hover:text-fg">
              <span className="font-medium text-fg">{second.t.title}</span> — {second.t.dek}
            </a>
          </Container>
        </div>
      )}

      {/* Muhabir defteri */}
      <Container className="py-20">
        <SectionTitle kicker={d.home.notebook} title={d.home.map} aside={<MoreLink to={href(lang, "archive")}>{d.common.allPosts}</MoreLink>} />
        <ol className="mt-10 border-t border-line">
          {notebook.map((p, i) => (
            <li key={p.id}>
              <a href={postHref(lang, p)} className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-1 border-b border-line py-5 sm:grid-cols-[3rem_14rem_1fr_8rem] sm:gap-x-6">
                <span className="font-mono text-[11px] text-muted tnum">{String(i + 1).padStart(2, "0")}</span>
                <span className={`font-display text-[26px] italic leading-none sm:text-[30px] ${i === 0 ? "text-accent" : "text-head"}`}>{p.t.place || p.category.name[lang]}</span>
                <span className="col-start-2 text-[16px] leading-snug text-fg-2 transition-colors duration-150 group-hover:text-fg sm:col-start-auto">{p.t.title}</span>
                <span className="col-start-2 font-mono text-[11px] uppercase text-muted sm:col-start-auto sm:text-end">
                  <time dateTime={p.publishedAt}>{fmtDate(lang, p.publishedAt, "short")}</time>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </Container>

      {/* Köşe yazıları */}
      {f1 && (
        <section className="border-t border-line bg-bg-2">
          <Container className="py-20">
            <SectionTitle kicker={d.type.kose} title={d.home.columns} aside={<MoreLink to={href(lang, "columns")}>{d.common.allPosts}</MoreLink>} />
            <div className="mt-10 grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <PostCard lang={lang} post={f1} big />
              </div>
              <div className="flex flex-col gap-9 lg:col-span-5">
                {fRest.map((a) => (
                  <article key={a.id} className="group grid grid-cols-5 gap-5 border-b border-line pb-9">
                    <a href={postHref(lang, a)} tabIndex={-1} aria-hidden className="col-span-2 overflow-hidden">
                      <Cover media={a.cover} className="aspect-[4/5] w-full grayscale-[30%]" />
                    </a>
                    <div className="col-span-3">
                      <Label>
                        <TypeBadge lang={lang} post={a} />
                      </Label>
                      <h3 className="balance mt-2.5 font-display text-[23px] font-medium leading-[1.12] text-head">
                        <a href={postHref(lang, a)} className="decoration-accent decoration-1 underline-offset-4 group-hover:underline">{a.t.title}</a>
                      </h3>
                      <div className="mt-3">
                        <Meta lang={lang} post={a} />
                      </div>
                    </div>
                  </article>
                ))}
                {columns[4] && (
                  <a href={postHref(lang, columns[4])} className="group block border-s-2 border-accent ps-6">
                    <Label>{d.type.kose} · {fmtDate(lang, columns[4].publishedAt, "short")}</Label>
                    <p className="mt-3 font-display text-[28px] italic leading-[1.12] text-head group-hover:underline">{columns[4].t.title}</p>
                    <p className="mt-3 line-clamp-3 text-[15px] leading-[1.55] text-fg-3">{columns[4].t.dek}</p>
                  </a>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Dış Haberler — T8 dilinde bant */}
      {foreign.length > 0 && (
        <section className="t-foreign bg-navy text-white" aria-labelledby="dis">
          <div className="mx-auto max-w-[1320px] px-5 py-16 lg:px-8 lg:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/20 pb-5">
              <div>
                <span className="mb-4 block h-[7px] w-[26px] bg-crimson" />
                <p className="font-label text-[12.5px] font-semibold uppercase tracking-[0.1em] text-white/60">{d.foreign.issueOf}</p>
                <h2 id="dis" className="mt-3 font-display text-[44px] leading-none sm:text-[60px]">{d.home.foreign}</h2>
              </div>
              <a href={href(lang, "foreign")} className="bg-crimson px-4 py-2.5 font-ui text-[13px] font-semibold text-white hover:bg-[#a81f26]">
                {d.foreign.more} <span aria-hidden className="inline-block rtl:-scale-x-100">→</span>
              </a>
            </div>
            <ol className="grid gap-x-12 md:grid-cols-3">
              {foreign.slice(0, 3).map((p, i) => (
                <li key={p.id} className="border-b border-white/15">
                  <a href={postHref(lang, p)} className="group block py-7">
                    <span className="font-display text-[34px] leading-none text-[#ff8a8f] tnum">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-4 font-label text-[12px] font-semibold uppercase tracking-[0.1em] text-white/55">
                      {d.type[p.type]} · {fmtDate(lang, p.publishedAt, "short")}
                    </p>
                    <p className="balance mt-2 font-display text-[26px] leading-[1.12] decoration-1 underline-offset-4 group-hover:underline">{p.t.title}</p>
                    <p className="mt-3 line-clamp-3 font-body text-[15.5px] italic leading-[1.5] text-white/70">{p.t.dek}</p>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Haberler */}
      {news.length > 0 && (
        <Container className="py-20">
          <SectionTitle kicker={d.type.haber} title={d.home.news} aside={<MoreLink to={href(lang, "news")}>{d.common.allPosts}</MoreLink>} />
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {news.slice(0, 3).map((p) => (
              <PostCard key={p.id} lang={lang} post={p} />
            ))}
          </div>
        </Container>
      )}

      {/* Raporlar / dosyalar */}
      {reports.length > 0 && (
        <section className="border-t border-line">
          <Container className="py-20">
            <SectionTitle kicker={d.home.dossiers} title={d.home.reports} aside={<MoreLink to={href(lang, "reports")}>{d.common.allPosts}</MoreLink>} />
            <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((r) => (
                <a key={r.id} href={postHref(lang, r)} className="group block">
                  <div className="overflow-hidden">
                    <Cover media={r.cover} className="aspect-[4/5] w-full grayscale contrast-[1.1] transition-[filter] duration-200 group-hover:grayscale-0" />
                  </div>
                  <div className="mt-4 border-t border-line-2 pt-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-display text-[26px] font-medium leading-[1.05] text-head">{r.t.title}</p>
                      <p className="shrink-0 font-mono text-[11px] text-muted tnum">{r.readMin} {d.common.min}</p>
                    </div>
                    <p className="mt-2 line-clamp-2 text-[14.5px] leading-[1.5] text-fg-3">{r.t.dek}</p>
                  </div>
                </a>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Bülten */}
      <section className="border-t border-line bg-bg-3">
        <Container className="grid items-center gap-8 py-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Label accent>{d.home.newsletter}</Label>
            <p className="mt-3 max-w-[40ch] font-display text-[30px] italic leading-[1.15] text-head sm:text-[36px]">{d.home.newsletterText}</p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <NewsletterForm lang={lang} />
          </div>
        </Container>
      </section>

      {/* Kimdir */}
      <section className="bg-invert text-invert-fg">
        <Container className="grid items-center gap-12 py-20 lg:grid-cols-12">
          <div className="overflow-hidden bg-[#1a1a18] lg:col-span-4">
            <img src="/img/portrait.jpg" alt="Çetiner Çetin" loading="lazy" className="aspect-[4/5] w-full object-cover object-top" />
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="font-label text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">{d.nav.about}</p>
            <h2 className="mt-4 font-display text-[50px] font-medium italic leading-[0.95] tracking-[-0.02em] sm:text-[72px]">Çetiner Çetin</h2>
            <p className="mt-4 font-label text-[13px] font-semibold uppercase tracking-[0.08em] opacity-70">{lead.author.role[lang]} · Habertürk</p>
            <div className="mt-9 flex flex-wrap gap-3 font-label text-[13px] font-semibold uppercase tracking-[0.08em]">
              <a href={href(lang, "about")} className="bg-[#0c0c0b] px-5 py-3 text-[#ece7df] transition-colors hover:bg-[#2a2a28]">{d.nav.about}</a>
              <a href={`${href(lang, "about")}#iletisim`} className="border border-current/30 px-5 py-3 transition-colors hover:border-current">{d.about.contact}</a>
            </div>
          </div>
        </Container>
      </section>
    </Shell>
  );
}
