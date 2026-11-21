import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { Paywall } from "@/components/paywall";
import { PrintButton } from "@/components/print-button";
import { headings, RichText } from "@/components/rich-text";
import { Share } from "@/components/share";
import { abs, fmtDate, postHref } from "@/lib/site";
import type { LocalizedPost, RichDoc } from "@/lib/types";

export function Byline({ lang, post, onDark = false }: { lang: Locale; post: LocalizedPost; onDark?: boolean }) {
  const d = getDict(lang);
  const sameDay = post.updatedAt.slice(0, 10) === post.publishedAt.slice(0, 10);
  return (
    <div className="flex items-center gap-3.5">
      <a href={href(lang, "about")} className="shrink-0">
        <img src={post.author.avatar} alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
      </a>
      <div className="min-w-0 font-ui">
        <p className="text-[14.5px] font-semibold">
          <a href={href(lang, "about")} rel="author" className="hover:underline">{post.author.name}</a>
        </p>
        <p className={`text-[12.5px] ${onDark ? "text-white/60" : "text-muted"}`}>
          <time dateTime={post.publishedAt}>{fmtDate(lang, post.publishedAt, "full")}</time>
          {!sameDay && (
            <>
              {" · "}
              {d.common.updated} <time dateTime={post.updatedAt}>{fmtDate(lang, post.updatedAt, "short")}</time>
            </>
          )}
          {" · "}
          {post.readMin} {d.common.minRead}
        </p>
      </div>
    </div>
  );
}

/** `premium` yalnız editör önizlemesinde verilir: kilitli devam ödeme duvarı yerine doğrudan gösterilir. */
export function ArticleBody({ lang, post, dropcap = false, premium }: { lang: Locale; post: LocalizedPost; dropcap?: boolean; premium?: RichDoc | null }) {
  const d = getDict(lang);
  const path = postHref(lang, post);
  return (
    <>
      <RichText doc={post.t.body} className={dropcap ? "dropcap" : ""} />
      {post.isPremium &&
        (premium !== undefined ? (
          <div className="mt-8 border-t-2 border-dashed border-accent pt-6">
            <p className="mb-4 font-ui text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">Önizleme · aboneye özel bölüm</p>
            {premium ? <RichText doc={premium} /> : <p className="font-ui text-[14px] text-muted">Kilitli devam metni boş.</p>}
          </div>
        ) : (
          <Paywall postId={post.id} lang={lang} path={path} />
        ))}
      {post.sourceUrl && (
        <aside className="mt-10 border-s-2 border-accent ps-5 font-ui text-[14px] leading-[1.6] text-fg-3">
          {d.common.firstPublished}:{" "}
          <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-head underline decoration-line-2 underline-offset-4 hover:decoration-fg">
            {d.common.readOriginal}
          </a>
        </aside>
      )}
      <div className="mt-10 grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
        {post.tags.length > 0 && (
          <div>
            <p className="font-label text-[11.5px] font-semibold uppercase tracking-[0.14em] text-muted">{d.common.tags}</p>
            <ul className="mt-3 flex flex-wrap gap-2 font-ui text-[13px]">
              {post.tags.map((t) => (
                <li key={t.id}>
                  <a href={href(lang, "tag", t.slug)} className="block bg-bg-3 px-3 py-1.5 text-fg-2 transition-colors duration-150 hover:bg-invert hover:text-invert-fg">
                    {t.name[lang]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Share lang={lang} url={abs(path)} title={post.t.title} />
      </div>
    </>
  );
}

export function Toc({ lang, post }: { lang: Locale; post: LocalizedPost }) {
  const hs = headings(post.t.body);
  if (hs.length < 2) return null;
  return (
    <nav aria-label={getDict(lang).common.contents} className="border-t border-line-2 pt-4">
      <p className="font-label text-[11.5px] font-semibold uppercase tracking-[0.14em] text-muted">{getDict(lang).common.contents}</p>
      <ol className="mt-3 space-y-2.5 font-ui text-[14px] leading-[1.45]">
        {hs.map((h, i) => (
          <li key={h.id} className="grid grid-cols-[1.75rem_1fr]">
            <span className="font-mono text-[11px] text-muted tnum">{String(i + 1).padStart(2, "0")}</span>
            <a href={`#${h.id}`} className="text-fg-2 hover:text-fg hover:underline">{h.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ReportTools({ lang, post }: { lang: Locale; post: LocalizedPost }) {
  if (post.type !== "rapor") return null;
  const d = getDict(lang).common;
  return (
    <div className="no-print flex flex-wrap gap-2 font-label text-[12px] font-semibold uppercase tracking-[0.1em]">
      {post.reportPdf && (
        <a href={`/api/rapor/${encodeURIComponent(post.id)}/pdf`} className="bg-invert px-4 py-2.5 text-invert-fg hover:opacity-90">{d.downloadPdf}</a>
      )}
      <PrintButton label={d.print} />
    </div>
  );
}

