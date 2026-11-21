import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { Label } from "@/components/ui";
import { getArchive, listPosts } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { fmtDate, fmtNum, langFrom, postHref, staticAlternates } from "@/lib/site";
import { ArchiveFrame, ArchiveNav, mm, monthRange } from "@/themes/archive";

export const revalidate = 3600;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const years = new Set((await getArchive(params.lang as Locale)).map((b) => b.year));
  return [...years].map((y) => ({ year: String(y) }));
}

async function load(params: PageProps<"/[lang]/arsiv/[year]">["params"]) {
  const lang = await langFrom(params);
  const raw = (await params).year;
  const y = Number(raw);
  if (!/^\d{4}$/.test(raw) || y < 1990 || y > 2100) notFound();
  return { lang, y };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/arsiv/[year]">): Promise<Metadata> {
  const { lang, y } = await load(params);
  return pageMeta(lang, { title: `${getDict(lang).archive.title} ${y}`, alternates: staticAlternates("archive", y) });
}

export default async function Year({ params }: PageProps<"/[lang]/arsiv/[year]">) {
  const { lang, y } = await load(params);
  const d = getDict(lang);
  const buckets = await getArchive(lang);
  const months = buckets.filter((b) => b.year === y).sort((a, b) => b.month - a.month);
  if (!months.length) notFound();
  const lists = await Promise.all(months.map((b) => listPosts(lang, { ...monthRange(y, b.month), limit: 200 })));

  return (
    <ArchiveFrame
      lang={lang}
      alternates={staticAlternates("archive", y)}
      crumbs={[{ label: d.common.home, to: href(lang) }, { label: d.archive.title, to: href(lang, "archive") }, { label: String(y) }]}
      title={`${d.archive.title} · ${y}`}
      intro={`${fmtNum(lang, months.reduce((s, b) => s + b.count, 0))} ${d.archive.posts}`}
      aside={<ArchiveNav lang={lang} buckets={buckets} year={y} />}
    >
      <div className="space-y-14">
        {months.map((b, i) => (
          <section key={b.month} aria-labelledby={`m-${b.month}`}>
            <div className="flex items-baseline justify-between border-b border-line-2 pb-3">
              <h2 id={`m-${b.month}`} className="font-display text-[34px] italic leading-none text-head">
                <a href={href(lang, "archive", y, mm(b.month))} className="hover:text-accent">{d.archive.months[b.month - 1]}</a>
              </h2>
              <Label>
                {fmtNum(lang, b.count)} {d.archive.posts}
              </Label>
            </div>
            <ul>
              {lists[i].map((p) => (
                <li key={p.id} className="border-b border-line">
                  <a href={postHref(lang, p)} className="group grid grid-cols-[6rem_1fr] gap-4 py-3.5 sm:grid-cols-[7.5rem_7rem_1fr]">
                    <time dateTime={p.publishedAt} className="font-mono text-[11.5px] uppercase text-muted tnum">{fmtDate(lang, p.publishedAt, "short")}</time>
                    <span className="hidden font-label text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted sm:block">{d.type[p.type]}</span>
                    <span className="text-[15.5px] leading-snug text-fg-2 group-hover:text-fg group-hover:underline">{p.t.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </ArchiveFrame>
  );
}
