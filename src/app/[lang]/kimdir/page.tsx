import type { Metadata } from "next";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { ContactForm } from "@/components/forms";
import { Shell } from "@/components/shell";
import { Breadcrumbs, Container, JsonLd, Label, PostRow } from "@/components/ui";
import { getSettings, listPosts } from "@/lib/data";
import { author } from "@/lib/seed";
import { AUTHOR_SAMEAS, orgLd, pageMeta, personLd } from "@/lib/seo";
import { abs, langFrom, staticAlternates } from "@/lib/site";
import type { Tag } from "@/lib/types";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[lang]/kimdir">): Promise<Metadata> {
  const lang = await langFrom(params);
  const s = await getSettings();
  return {
    ...pageMeta(lang, { title: `${getDict(lang).about.title}: Çetiner Çetin`, description: s.about[lang].bio[0], alternates: staticAlternates("about"), image: "/img/portrait.jpg" }),
  };
}

export default async function About({ params }: PageProps<"/[lang]/kimdir">) {
  const lang = await langFrom(params);
  const d = getDict(lang);
  const [s, latest, recent] = await Promise.all([getSettings(), listPosts(lang, { limit: 6 }), listPosts(lang, { limit: 60 })]);
  const about = s.about[lang];

  // Uzmanlık alanları: yazıların etiket dağılımından (uydurma bilgi yok).
  const counts = new Map<string, { t: Tag; n: number }>();
  for (const p of recent) for (const t of p.tags) counts.set(t.id, { t, n: (counts.get(t.id)?.n ?? 0) + 1 });
  const expertise = [...counts.values()].sort((a, b) => b.n - a.n).slice(0, 8);

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "ProfilePage", url: abs(href(lang, "about")), inLanguage: lang, mainEntity: { "@id": `${abs("")}/#person` } },
      { ...personLd(lang), description: about.bio.join(" "), knowsAbout: expertise.map((e) => e.t.name[lang]) },
      orgLd(lang),
    ],
  };

  return (
    <Shell lang={lang} alternates={staticAlternates("about")} active="about">
      <JsonLd data={ld} />
      <Container className="pt-10">
        <Breadcrumbs items={[{ label: d.common.home, to: href(lang) }, { label: d.about.title }]} />
      </Container>

      <section>
        <Container className="grid items-end gap-12 pb-16 pt-10 lg:grid-cols-12">
          <div className="overflow-hidden bg-[#1a1a18] lg:col-span-5">
            <img src="/img/portrait.jpg" alt="Çetiner Çetin" width={1200} height={1500} fetchPriority="high" className="aspect-[4/5] w-full object-cover object-top" />
          </div>
          <div className="lg:col-span-7">
            <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-accent">■ {d.about.title}</p>
            <h1 className="mt-5 font-display text-[56px] font-medium italic leading-[0.92] tracking-[-0.02em] text-head sm:text-[96px]">Çetiner Çetin</h1>
            <p className="mt-5 font-label text-[14px] font-semibold uppercase tracking-[0.08em] text-fg-3">{author.role[lang]} · Habertürk</p>
            <div className="mt-8 space-y-5">
              {about.bio.map((b, i) => (
                <p key={i} className={`pretty ${i === 0 ? "font-display text-[24px] leading-[1.45] text-head" : "text-[17px] leading-[1.7] text-fg-2"}`}>{b}</p>
              ))}
            </div>
            <ul className="mt-8 flex flex-wrap gap-2 font-ui text-[13px]">
              {AUTHOR_SAMEAS.slice(0, 1).map((u) => (
                <li key={u}>
                  <a href={u} target="_blank" rel="noopener noreferrer me" className="block border border-line-2 px-3 py-1.5 text-fg-2 hover:border-fg hover:text-fg">Habertürk</a>
                </li>
              ))}
              {s.social.x && (
                <li>
                  <a href={s.social.x} target="_blank" rel="noopener noreferrer me" className="block border border-line-2 px-3 py-1.5 text-fg-2 hover:border-fg hover:text-fg">X</a>
                </li>
              )}
              {s.social.instagram && (
                <li>
                  <a href={s.social.instagram} target="_blank" rel="noopener noreferrer me" className="block border border-line-2 px-3 py-1.5 text-fg-2 hover:border-fg hover:text-fg">Instagram</a>
                </li>
              )}
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-bg-2">
        <Container className="grid gap-12 py-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Label accent>{d.about.expertise}</Label>
            <ul className="mt-5 flex flex-wrap gap-2">
              {expertise.map(({ t, n }) => (
                <li key={t.id}>
                  <a href={href(lang, "tag", t.slug)} className="flex items-baseline gap-2 bg-bg-3 px-3.5 py-2 font-ui text-[14px] text-fg-2 hover:bg-invert hover:text-invert-fg">
                    {t.name[lang]} <span className="font-mono text-[11px] opacity-60 tnum">{n}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {about.career.length > 0 && (
            <div className="lg:col-span-6 lg:col-start-7">
              <Label accent>{d.about.career}</Label>
              <ol className="mt-5 border-s border-line-2">
                {about.career.map((c, i) => (
                  <li key={i} className="relative ps-6 pb-6">
                    <span aria-hidden className="absolute -start-[5px] top-1.5 h-[9px] w-[9px] bg-accent" />
                    <p className="font-mono text-[11.5px] uppercase text-muted">{c.period}</p>
                    <p className="mt-1 text-[16px] leading-[1.5] text-fg-2">{c.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </Container>
      </section>

      <Container className="py-16">
        <Label accent>{d.about.latest}</Label>
        <ol className="mt-4 border-t border-line-2">
          {latest.map((p, i) => (
            <PostRow key={p.id} lang={lang} post={p} index={i} />
          ))}
        </ol>
      </Container>

      <section id="iletisim" className="border-t border-line bg-bg-3">
        <Container className="grid gap-10 py-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Label accent>{d.about.contact}</Label>
            <h2 className="mt-3 font-display text-[40px] italic leading-none text-head sm:text-[52px]">{d.about.contact}</h2>
            <p className="mt-4 max-w-[36ch] text-[16px] leading-[1.6] text-fg-3">{d.about.contactText}</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm lang={lang} />
          </div>
        </Container>
      </section>
    </Shell>
  );
}
