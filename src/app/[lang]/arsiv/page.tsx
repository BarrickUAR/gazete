// Arşiv: tam metin arama + tür/kategori filtresi + sayfalama; kenarda yıl/ay gezinme.
import type { Metadata } from "next";
import { z } from "zod";
import { getDict } from "@/i18n/dict";
import { href, withQuery } from "@/i18n/routes";
import { Empty, Pagination, PostRow } from "@/components/ui";
import { getArchive, getCategories, searchPosts } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { fmtNum, langFrom, staticAlternates } from "@/lib/site";
import { ArchiveFrame, ArchiveNav } from "@/themes/archive";

const PAGE = 20;
const Q = z.object({
  q: z.string().trim().max(120).catch(""),
  type: z.enum(["haber", "kose", "rapor"]).optional().catch(undefined),
  cat: z.string().max(80).optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(500).catch(1),
});
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export async function generateMetadata({ params, searchParams }: PageProps<"/[lang]/arsiv">): Promise<Metadata> {
  const lang = await langFrom(params);
  const sp = await searchParams;
  const d = getDict(lang);
  // Arama/filtre sonuçları dizine eklenmez; arşiv ana sayfası eklenir.
  return pageMeta(lang, { title: d.archive.title, description: d.archive.intro, alternates: staticAlternates("archive"), noindex: Object.keys(sp).length > 0 });
}

export default async function Archive({ params, searchParams }: PageProps<"/[lang]/arsiv">) {
  const lang = await langFrom(params);
  const d = getDict(lang);
  const sp = await searchParams;
  const q = Q.parse({ q: one(sp.q) ?? "", type: one(sp.type) || undefined, cat: one(sp.cat) || undefined, page: one(sp.page) ?? 1 });
  const [cats, buckets] = await Promise.all([getCategories(), getArchive(lang)]);
  const cat = q.cat ? cats.find((c) => c.slug[lang] === q.cat) : undefined;
  const { items, total } = await searchPosts(lang, { q: q.q, type: q.type, categoryId: cat?.id, page: q.page, pageSize: PAGE });
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const base = { q: q.q || undefined, type: q.type, cat: cat?.slug[lang] };
  const filtered = Boolean(q.q || q.type || cat);
  const sel = "w-full border border-line-2 bg-bg px-3 py-3 font-ui text-[14px] text-fg focus:border-fg focus:outline-none";

  return (
    <ArchiveFrame
      lang={lang}
      alternates={staticAlternates("archive")}
      crumbs={[{ label: d.common.home, to: href(lang) }, { label: d.archive.title }]}
      title={d.archive.title}
      intro={d.archive.intro}
      aside={<ArchiveNav lang={lang} buckets={buckets} />}
    >
      <form role="search" action={href(lang, "archive")} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_9rem_10rem_auto]">
        <label className="sr-only" htmlFor="aq">{d.archive.search}</label>
        <input id="aq" name="q" type="search" defaultValue={q.q} placeholder={d.archive.searchPlaceholder} className={`${sel} sm:col-span-2 xl:col-span-1`} />
        <label className="sr-only" htmlFor="at">{d.archive.type}</label>
        <select id="at" name="type" defaultValue={q.type ?? ""} className={sel}>
          <option value="">{d.archive.type}: {d.common.all}</option>
          {(["haber", "kose", "rapor"] as const).map((t) => (
            <option key={t} value={t}>{d.type[t]}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="ac">{d.archive.category}</label>
        <select id="ac" name="cat" defaultValue={cat?.slug[lang] ?? ""} className={sel}>
          <option value="">{d.archive.category}: {d.common.all}</option>
          {cats.map((c) => (
            <option key={c.id} value={c.slug[lang]}>{c.name[lang]}</option>
          ))}
        </select>
        <button className="bg-invert px-5 py-3 font-label text-[13px] font-semibold uppercase tracking-[0.1em] text-invert-fg hover:opacity-90 sm:col-span-2 xl:col-span-1">{d.archive.searchBtn}</button>
      </form>

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-3 border-b border-line-2 pb-3">
        <p aria-live="polite" className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted tnum">
          {fmtNum(lang, total)} {d.archive.results}
          {pages > 1 && ` · ${d.common.page} ${fmtNum(lang, q.page)}/${fmtNum(lang, pages)}`}
        </p>
        {filtered && (
          <a href={href(lang, "archive")} className="font-label text-[12px] font-semibold uppercase tracking-[0.12em] text-accent hover:underline">{d.archive.clear}</a>
        )}
      </div>

      {items.length ? (
        <ol>
          {items.map((p, i) => (
            <PostRow key={p.id} lang={lang} post={p} index={(q.page - 1) * PAGE + i} />
          ))}
        </ol>
      ) : (
        <div className="mt-8">
          <Empty>{d.common.noResults}</Empty>
        </div>
      )}
      <Pagination lang={lang} page={q.page} pages={pages} link={(p) => withQuery(href(lang, "archive"), { ...base, page: p > 1 ? p : undefined })} />
    </ArchiveFrame>
  );
}
