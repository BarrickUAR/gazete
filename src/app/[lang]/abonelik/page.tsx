import type { Metadata } from "next";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { Shell } from "@/components/shell";
import { StartTrial } from "@/components/start-trial";
import { Breadcrumbs, Container, JsonLd, Label } from "@/components/ui";
import { getSettings } from "@/lib/data";
import { activeProvider } from "@/lib/payments";
import { pageMeta } from "@/lib/seo";
import { fmtMoney, langFrom, staticAlternates } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[lang]/abonelik">): Promise<Metadata> {
  const lang = await langFrom(params);
  const d = getDict(lang);
  return pageMeta(lang, { title: d.subscribe.title, description: `${d.subscribe.trial}. ${d.subscribe.lead}`, alternates: staticAlternates("subscribe") });
}

export default async function Subscribe({ params }: PageProps<"/[lang]/abonelik">) {
  const lang = await langFrom(params);
  const d = getDict(lang);
  const { price } = await getSettings();
  const prices = { monthly: fmtMoney(lang, price.monthly, price.currency), yearly: fmtMoney(lang, price.yearly, price.currency) };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: d.subscribe.faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <Shell lang={lang} alternates={staticAlternates("subscribe")} active="subscribe">
      <JsonLd data={faqLd} />
      <Container className="pb-24 pt-10">
        <Breadcrumbs items={[{ label: d.common.home, to: href(lang) }, { label: d.subscribe.title }]} />
        <div className="mt-10 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-accent">■ {d.subscribe.trial}</p>
            <h1 className="mt-5 font-display text-[50px] font-medium italic leading-[0.95] tracking-[-0.02em] text-head sm:text-[76px]">{d.subscribe.title}</h1>
            <p className="pretty mt-6 max-w-[42ch] text-[18px] leading-[1.6] text-fg-2">{d.subscribe.lead}</p>
            <ul className="mt-10 border-t border-line-2">
              {d.subscribe.includes.map((i) => (
                <li key={i} className="flex items-center gap-4 border-b border-line py-4 font-ui text-[16px] text-fg">
                  <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M4 10.5l4 4 8-9" />
                  </svg>
                  {i}
                </li>
              ))}
            </ul>
            <p className="mt-6 font-ui text-[14px] text-muted">{d.common.free}: {d.typePlural.haber}</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <StartTrial lang={lang} prices={prices} enabled={Boolean(activeProvider())} />
          </div>
        </div>

        <section className="mt-24 border-t border-line-2 pt-10" aria-labelledby="sss">
          <Label accent>{d.subscribe.faq}</Label>
          <h2 id="sss" className="sr-only">{d.subscribe.faq}</h2>
          <div className="mt-6 grid gap-x-12 md:grid-cols-2">
            {d.subscribe.faqs.map(([q, a]) => (
              <details key={q} className="group border-b border-line py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[22px] leading-[1.25] text-head">
                  {q}
                  <span aria-hidden className="font-mono text-[18px] text-muted transition-transform duration-150 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-[60ch] text-[16px] leading-[1.6] text-fg-3">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </Container>
    </Shell>
  );
}
