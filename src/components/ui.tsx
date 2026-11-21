import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { fmtDate, postHref } from "@/lib/site";
import type { LocalizedPost, Media } from "@/lib/types";

export function Label({ children, accent = false, className = "" }: { children: ReactNode; accent?: boolean; className?: string }) {
  return <p className={`font-label text-[12px] font-semibold uppercase tracking-[0.14em] ${accent ? "text-accent" : "text-muted"} ${className}`}>{children}</p>;
}

export function SectionTitle({ kicker, title, aside, as = "h2" }: { kicker?: string; title: string; aside?: ReactNode; as?: "h1" | "h2" }) {
  const H = as;
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-t border-line-2 pt-5">
      <div>
        {kicker && <Label accent>{kicker}</Label>}
        <H className="mt-3 font-display text-[40px] font-medium italic leading-[0.98] tracking-[-0.015em] text-head sm:text-[54px]">{title}</H>
      </div>
      {aside}
    </div>
  );
}

export function MoreLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <a href={to} className="font-label text-[12px] font-semibold uppercase tracking-[0.12em] text-muted transition-colors duration-150 hover:text-fg">
      {children} <span aria-hidden className="inline-block rtl:-scale-x-100">→</span>
    </a>
  );
}

export function Cover({ media, className = "", sizes = "", eager = false, gray = false }: { media: Media | null; className?: string; sizes?: string; eager?: boolean; gray?: boolean }) {
  if (!media) return <div className={`bg-bg-3 ${className}`} aria-hidden />;
  return (
    <img
      src={media.url}
      alt={media.alt}
      width={media.width ?? undefined}
      height={media.height ?? undefined}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      sizes={sizes || undefined}
      className={`object-cover ${gray ? "grayscale contrast-[1.1]" : ""} ${className}`}
    />
  );
}

export function TypeBadge({ lang, post }: { lang: Locale; post: LocalizedPost }) {
  const d = getDict(lang);
  return (
    <span className="inline-flex items-center gap-2">
      <span>{d.type[post.type]}</span>
      {post.isPremium && (
        <span className="border border-accent px-1.5 py-px text-[10px] leading-[1.4] text-accent" title={d.common.premium}>
          {d.common.premium}
        </span>
      )}
    </span>
  );
}

export function Meta({ lang, post, withRead = true }: { lang: Locale; post: LocalizedPost; withRead?: boolean }) {
  const d = getDict(lang);
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
      <time dateTime={post.publishedAt}>{fmtDate(lang, post.publishedAt, "short")}</time>
      {withRead && (
        <>
          {" · "}
          {post.readMin} {d.common.min}
        </>
      )}
    </p>
  );
}

/** Yoğun liste satırı (arşiv, kategori, etiket, liste sayfaları). */
export function PostRow({ lang, post, index }: { lang: Locale; post: LocalizedPost; index?: number }) {
  const to = postHref(lang, post);
  return (
    <li>
      <article className="group grid grid-cols-[1fr_96px] gap-x-5 gap-y-1 border-b border-line py-5 sm:grid-cols-[3rem_1fr_160px] sm:gap-x-6">
        <span className="hidden font-mono text-[11px] text-muted tnum sm:block">{index !== undefined ? String(index + 1).padStart(2, "0") : ""}</span>
        <div className="min-w-0">
          <div className="font-label text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted">
            <TypeBadge lang={lang} post={post} /> <span className="mx-1.5 text-line-2">/</span> {post.category.name[lang]}
          </div>
          <h3 className="balance mt-2 font-display text-[22px] font-medium leading-[1.15] text-head sm:text-[26px]">
            <a href={to} className="decoration-accent decoration-1 underline-offset-4 group-hover:underline">{post.t.title}</a>
          </h3>
          {post.t.dek && <p className="pretty mt-2 line-clamp-2 max-w-[70ch] text-[15px] leading-[1.55] text-fg-3">{post.t.dek}</p>}
          <div className="mt-2.5">
            <Meta lang={lang} post={post} />
          </div>
        </div>
        <a href={to} tabIndex={-1} aria-hidden className="row-span-1 self-start overflow-hidden sm:row-span-1">
          <Cover media={post.cover} className="aspect-[4/3] w-full" />
        </a>
      </article>
    </li>
  );
}

/** Görselli kart (anasayfa ızgaraları). */
export function PostCard({ lang, post, ratio = "aspect-[16/10]", big = false, gray = false }: { lang: Locale; post: LocalizedPost; ratio?: string; big?: boolean; gray?: boolean }) {
  const to = postHref(lang, post);
  return (
    <article className="group">
      <a href={to} tabIndex={-1} aria-hidden className="block overflow-hidden">
        <Cover media={post.cover} className={`${ratio} w-full transition-[filter] duration-200 ${gray ? "grayscale-[35%] group-hover:grayscale-0" : ""}`} />
      </a>
      <div className="mt-4">
        <Label>
          <TypeBadge lang={lang} post={post} /> · {post.category.name[lang]}
        </Label>
        <h3 className={`balance mt-2.5 font-display font-medium leading-[1.08] text-head ${big ? "text-[34px] tracking-[-0.015em] sm:text-[44px]" : "text-[23px]"}`}>
          <a href={to} className="decoration-accent decoration-1 underline-offset-4 group-hover:underline">{post.t.title}</a>
        </h3>
        {big && post.t.dek && <p className="pretty mt-4 max-w-[60ch] text-[16px] leading-[1.65] text-fg-3">{post.t.dek}</p>}
        <div className="mt-3">
          <Meta lang={lang} post={post} />
        </div>
      </div>
    </article>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="border-y border-line py-16 text-center font-ui text-[15px] text-muted">{children}</p>;
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="font-label text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((i, n) => (
          <li key={n} className="flex items-center gap-2">
            {n > 0 && <span aria-hidden className="text-line-2">/</span>}
            {i.to ? (
              <a href={i.to} className="transition-colors duration-150 hover:text-fg">{i.label}</a>
            ) : (
              <span aria-current="page" className="text-fg-2">{i.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Pagination({ lang, page, pages, link }: { lang: Locale; page: number; pages: number; link: (p: number) => string }) {
  if (pages <= 1) return null;
  const d = getDict(lang).common;
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 2);
  return (
    <nav aria-label={d.page} className="mt-10 flex flex-wrap items-center justify-between gap-4 font-label text-[13px] font-semibold uppercase tracking-[0.1em]">
      {page > 1 ? <a rel="prev" href={link(page - 1)} className="border border-line-2 px-4 py-2 hover:bg-invert hover:text-invert-fg">{d.prev}</a> : <span />}
      <ol className="flex items-center gap-1">
        {nums.map((n, i) => (
          <li key={n} className="flex items-center gap-1">
            {i > 0 && nums[i - 1] !== n - 1 && <span className="px-1 text-muted">…</span>}
            <a href={link(n)} aria-current={n === page ? "page" : undefined} className={`grid h-9 min-w-9 place-items-center px-2 tnum ${n === page ? "bg-invert text-invert-fg" : "text-muted hover:text-fg"}`}>
              {n}
            </a>
          </li>
        ))}
      </ol>
      {page < pages ? <a rel="next" href={link(page + 1)} className="border border-line-2 px-4 py-2 hover:bg-invert hover:text-invert-fg">{d.next}</a> : <span />}
    </nav>
  );
}

export function JsonLd({ data }: { data: object }) {
  // JSON.stringify + "<" kaçışı: script içinde etiket kapatılamaz.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function Container({ children, className = "", narrow = false }: { children: ReactNode; className?: string; narrow?: boolean }) {
  return <div className={`mx-auto px-5 lg:px-8 ${narrow ? "max-w-[880px]" : "max-w-[1320px]"} ${className}`}>{children}</div>;
}
