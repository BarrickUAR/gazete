import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { Empty, PostRow } from "@/components/ui";
import { getArchive, listPosts } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { langFrom, staticAlternates } from "@/lib/site";
import { ArchiveFrame, ArchiveNav, mm, monthRange } from "@/themes/archive";

export const revalidate = 3600;

export async function generateStaticParams({ params }: { params: { lang: string; year: string } }) {
  return (await getArchive(params.lang as Locale)).filter((b) => String(b.year) === params.year).map((b) => ({ month: mm(b.month) }));
}

async function load(params: PageProps<"/[lang]/arsiv/[year]/[month]">["params"]) {
  const lang = await langFrom(params);
  const p = await params;
  const y = Number(p.year);
  const m = Number(p.month);
  if (!/^\d{4}$/.test(p.year) || !/^\d{2}$/.test(p.month) || y < 1990 || y > 2100 || m < 1 || m > 12) notFound();
  return { lang, y, m };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/arsiv/[year]/[month]">): Promise<Metadata> {
  const { lang, y, m } = await load(params);
  const d = getDict(lang);
  return pageMeta(lang, { title: `${d.archive.months[m - 1]} ${y} · ${d.archive.title}`, alternates: staticAlternates("archive", y, mm(m)) });
}

export default async function Month({ params }: PageProps<"/[lang]/arsiv/[year]/[month]">) {
  const { lang, y, m } = await load(params);
  const d = getDict(lang);
  const [buckets, posts] = await Promise.all([getArchive(lang), listPosts(lang, { ...monthRange(y, m), limit: 300 })]);
  return (
    <ArchiveFrame
      lang={lang}
      alternates={staticAlternates("archive", y, mm(m))}
      crumbs={[
        { label: d.common.home, to: href(lang) },
        { label: d.archive.title, to: href(lang, "archive") },
        { label: String(y), to: href(lang, "archive", y) },
        { label: d.archive.months[m - 1] },
      ]}
      title={`${d.archive.months[m - 1]} ${y}`}
      aside={<ArchiveNav lang={lang} buckets={buckets} year={y} month={m} />}
    >
      {posts.length ? (
        <ol className="border-t border-line-2">
          {posts.map((p, i) => (
            <PostRow key={p.id} lang={lang} post={p} index={i} />
          ))}
        </ol>
      ) : (
        <Empty>{d.common.empty}</Empty>
      )}
    </ArchiveFrame>
  );
}
