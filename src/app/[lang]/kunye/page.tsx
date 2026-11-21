import type { Metadata } from "next";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { Shell } from "@/components/shell";
import { Breadcrumbs, Container, JsonLd } from "@/components/ui";
import { getSettings } from "@/lib/data";
import { orgLd, pageMeta } from "@/lib/seo";
import { langFrom, staticAlternates } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[lang]/kunye">): Promise<Metadata> {
  const lang = await langFrom(params);
  return pageMeta(lang, { title: getDict(lang).imprint.title, alternates: staticAlternates("imprint") });
}

export default async function Imprint({ params }: PageProps<"/[lang]/kunye">) {
  const lang = await langFrom(params);
  const d = getDict(lang);
  const rows = (await getSettings()).imprint[lang];
  return (
    <Shell lang={lang} alternates={staticAlternates("imprint")} active="imprint">
      <JsonLd data={{ "@context": "https://schema.org", ...orgLd(lang) }} />
      <Container narrow className="pb-24 pt-10">
        <Breadcrumbs items={[{ label: d.common.home, to: href(lang) }, { label: d.imprint.title }]} />
        <h1 className="mt-8 font-display text-[52px] font-medium italic leading-[0.95] text-head sm:text-[80px]">{d.imprint.title}</h1>
        <dl className="mt-12 border-t-2 border-fg">
          {rows.map((r) => (
            <div key={r.label} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[16rem_1fr] sm:gap-6">
              <dt className="font-label text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{r.label}</dt>
              <dd className="text-[17px] text-fg">
                {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.value) ? <a href={`mailto:${r.value}`} className="underline decoration-line-2 underline-offset-4 hover:decoration-fg">{r.value}</a> : r.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Shell>
  );
}
