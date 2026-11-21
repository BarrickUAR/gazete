// Arşiv ortak parçaları: yıl/ay gezinme kenar çubuğu ve sayfa iskeleti (T2).
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { Shell } from "@/components/shell";
import { Breadcrumbs, Container } from "@/components/ui";
import { fmtNum, type Alternates } from "@/lib/site";
import type { ArchiveBucket } from "@/lib/types";

export function byYear(buckets: ArchiveBucket[]) {
  const m = new Map<number, ArchiveBucket[]>();
  for (const b of buckets) m.set(b.year, [...(m.get(b.year) ?? []), b]);
  return [...m.entries()].sort((a, b) => b[0] - a[0]);
}

/** İstanbul saatine göre ay aralığı (Türkiye 2016'dan beri sabit UTC+3). */
export function monthRange(y: number, m: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const from = `${y}-${pad(m)}-01T00:00:00+03:00`;
  const ny = m === 12 ? y + 1 : y;
  const nm = m === 12 ? 1 : m + 1;
  return { from: new Date(from).toISOString(), to: new Date(`${ny}-${pad(nm)}-01T00:00:00+03:00`).toISOString() };
}

export const mm = (m: number) => String(m).padStart(2, "0");

export function ArchiveNav({ lang, buckets, year, month }: { lang: Locale; buckets: ArchiveBucket[]; year?: number; month?: number }) {
  const d = getDict(lang);
  return (
    <nav aria-label={d.archive.title} className="space-y-6">
      {byYear(buckets).map(([y, ms]) => (
        <div key={y} className="border-t border-line-2 pt-4">
          <a
            href={href(lang, "archive", y)}
            aria-current={year === y && !month ? "page" : undefined}
            className={`flex items-baseline justify-between font-display text-[30px] italic leading-none ${year === y ? "text-accent" : "text-head hover:text-accent"}`}
          >
            {y}
            <span className="font-mono text-[11px] not-italic text-muted tnum">{fmtNum(lang, ms.reduce((s, b) => s + b.count, 0))}</span>
          </a>
          <ul className="mt-3 grid grid-cols-3 gap-1 font-ui text-[13px]">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
              const b = ms.find((x) => x.month === m);
              const cur = year === y && month === m;
              const name = d.archive.months[m - 1];
              return (
                <li key={m}>
                  {b ? (
                    <a
                      href={href(lang, "archive", y, mm(m))}
                      aria-current={cur ? "page" : undefined}
                      title={`${name} ${y} · ${b.count} ${d.archive.posts}`}
                      className={`block truncate px-2 py-1.5 ${cur ? "bg-invert text-invert-fg" : "bg-bg-3 text-fg-2 hover:bg-invert hover:text-invert-fg"}`}
                    >
                      {name}
                    </a>
                  ) : (
                    <span className="block truncate px-2 py-1.5 text-muted opacity-50">{name}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function ArchiveFrame({
  lang,
  alternates,
  crumbs,
  title,
  intro,
  aside,
  children,
}: {
  lang: Locale;
  alternates: Alternates;
  crumbs: { label: string; to?: string }[];
  title: string;
  intro?: string;
  aside: ReactNode;
  children: ReactNode;
}) {
  return (
    <Shell lang={lang} alternates={alternates} active="archive">
      <Container className="pb-24 pt-10">
        <Breadcrumbs items={crumbs} />
        <header className="mt-8 grid gap-6 border-b border-line-2 pb-10 lg:grid-cols-12">
          <h1 className="font-display text-[48px] font-medium italic leading-[0.95] tracking-[-0.02em] text-head sm:text-[76px] lg:col-span-8">{title}</h1>
          {intro && <p className="pretty self-end text-[16.5px] leading-[1.6] text-fg-3 lg:col-span-4">{intro}</p>}
        </header>
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">{children}</div>
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">{aside}</div>
          </aside>
        </div>
      </Container>
    </Shell>
  );
}
