// Yönetim paneli küçük bileşenleri (sunucu ve istemci ortak).
import type { ReactNode } from "react";
import type { PostStatus, PostType } from "@/lib/types";

export const STATUS_LABEL: Record<PostStatus, string> = { draft: "Taslak", review: "Onay bekliyor", scheduled: "Zamanlandı", published: "Yayında", archived: "Arşivlendi" };
export const TYPE_LABEL: Record<PostType, string> = { haber: "Haber", kose: "Köşe yazısı", rapor: "Rapor" };

const tone: Record<PostStatus, string> = {
  draft: "bg-bg-3 text-fg-3",
  review: "bg-[#fff4d6] text-[#7a5200]",
  scheduled: "bg-[#e6efff] text-[#1f4fa0]",
  published: "bg-[#e3f5ea] text-[#17663a]",
  archived: "bg-bg-3 text-muted",
};

export function StatusBadge({ status }: { status: PostStatus }) {
  return <span className={`inline-block rounded px-1.5 py-0.5 text-[12px] font-medium ${tone[status]}`}>{STATUS_LABEL[status]}</span>;
}

export function PageHead({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[24px] font-semibold tracking-[-0.01em]">{title}</h1>
        {sub && <p className="mt-1 text-[14px] text-muted">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, children, className = "", aside }: { title?: string; children: ReactNode; className?: string; aside?: ReactNode }) {
  return (
    <section className={`rounded-lg border border-line bg-bg-2 ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-[14px] font-semibold">{title}</h2>
          {aside}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export const btn = {
  primary: "inline-flex items-center justify-center rounded-md bg-accent px-3.5 py-2 text-[14px] font-medium text-accent-fg hover:opacity-90 disabled:opacity-50",
  secondary: "inline-flex items-center justify-center rounded-md border border-line-2 bg-bg-2 px-3.5 py-2 text-[14px] font-medium text-fg-2 hover:border-fg-3 disabled:opacity-50",
  danger: "inline-flex items-center justify-center rounded-md border border-[#e7b4b4] bg-bg-2 px-3.5 py-2 text-[14px] font-medium text-[#a42828] hover:bg-[#fdf2f2] disabled:opacity-50",
};

export const input = "w-full rounded-md border border-line-2 bg-bg-2 px-3 py-2 text-[14px] text-fg placeholder:text-muted focus:border-accent focus:outline-none";
export const label = "mb-1 block text-[12.5px] font-medium text-fg-3";

export function fmtAdminDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" }).format(new Date(iso));
}

export function EmptyRow({ cols, children }: { cols: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={cols} className="px-4 py-10 text-center text-[14px] text-muted">
        {children}
      </td>
    </tr>
  );
}

/** Sunucu aksiyonu yönlendirmesinden gelen ?ok= / ?hata= mesajı. */
export function Flash({ sp }: { sp: Record<string, string | string[] | undefined> }) {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.slice(0, 300);
  const ok = one(sp.ok);
  const err = one(sp.hata);
  if (!ok && !err) return null;
  return (
    <p role={err ? "alert" : "status"} className={`mb-5 rounded-md border px-4 py-3 text-[14px] ${err ? "border-[#e7b4b4] bg-[#fdf2f2] text-[#a42828]" : "border-[#b5dcc3] bg-[#eef8f1] text-[#17663a]"}`}>
      {err ?? ok}
    </p>
  );
}

export const th = "px-4 py-2.5 text-start text-[12px] font-medium uppercase tracking-[0.06em] text-muted";
export const td = "px-4 py-2.5 align-top";
