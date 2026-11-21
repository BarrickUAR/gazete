import Link from "next/link";
import type { Metadata } from "next";
import { z } from "zod";
import { btn, EmptyRow, fmtAdminDate, input, PageHead, STATUS_LABEL, StatusBadge, TYPE_LABEL } from "@/components/admin/ui";
import { requireStaff } from "@/lib/admin/auth";
import { adminPosts, searchPostIds, trTitle } from "@/lib/admin/data";
import { locales } from "@/i18n/config";
import type { PostStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Yazılar" };
export const dynamic = "force-dynamic";

const Q = z.object({
  durum: z.enum(["draft", "review", "scheduled", "published", "archived"]).optional().catch(undefined),
  tur: z.enum(["haber", "kose", "rapor"]).optional().catch(undefined),
  q: z.string().trim().max(100).catch(""),
  s: z.coerce.number().int().min(1).max(1000).catch(1),
});
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function Posts({ searchParams }: PageProps<"/yonetim/yazilar">) {
  await requireStaff("author");
  const sp = await searchParams;
  const q = Q.parse({ durum: one(sp.durum) || undefined, tur: one(sp.tur) || undefined, q: one(sp.q) ?? "", s: one(sp.s) ?? 1 });
  const ids = q.q ? await searchPostIds(q.q) : undefined;
  const { rows, total } = await adminPosts({ status: q.durum, type: q.tur, ids, page: q.s, size: 30 });
  const pages = Math.max(1, Math.ceil(total / 30));
  const link = (o: Partial<{ durum: string; tur: string; q: string; s: number }>) => {
    const p = new URLSearchParams();
    const m = { durum: q.durum, tur: q.tur, q: q.q, s: undefined as number | undefined, ...o };
    for (const [k, v] of Object.entries(m)) if (v) p.set(k, String(v));
    const s = p.toString();
    return `/yonetim/yazilar${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHead title="Yazılar" sub={`${total} kayıt`} actions={<Link href="/yonetim/yazilar/yeni" className={btn.primary}>Yeni yazı</Link>} />
      <div className="mb-4 flex flex-wrap gap-1">
        {([undefined, "draft", "review", "scheduled", "published", "archived"] as (PostStatus | undefined)[]).map((s) => (
          <a key={s ?? "all"} href={link({ durum: s ?? "" })} className={`rounded-md px-3 py-1.5 text-[13.5px] ${q.durum === s ? "bg-fg text-bg" : "bg-bg-2 text-fg-3 hover:text-fg"} border border-line`}>
            {s ? STATUS_LABEL[s] : "Tümü"}
          </a>
        ))}
      </div>
      <form className="mb-4 flex flex-wrap gap-2" action="/yonetim/yazilar">
        {q.durum && <input type="hidden" name="durum" value={q.durum} />}
        <input name="q" defaultValue={q.q} placeholder="Başlıkta ara…" className={`${input} max-w-xs`} />
        <select name="tur" defaultValue={q.tur ?? ""} className={`${input} w-40`}>
          <option value="">Tüm türler</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button className={btn.secondary}>Filtrele</button>
      </form>
      <div className="overflow-x-auto rounded-lg border border-line bg-bg-2">
        <table className="w-full min-w-[760px] text-[14px]">
          <thead>
            <tr className="border-b border-line text-start text-[12.5px] text-muted">
              <th className="px-4 py-2.5 text-start font-medium">Başlık</th>
              <th className="px-4 py-2.5 text-start font-medium">Tür</th>
              <th className="px-4 py-2.5 text-start font-medium">Diller</th>
              <th className="px-4 py-2.5 text-start font-medium">Durum</th>
              <th className="px-4 py-2.5 text-end font-medium">Yayın / güncelleme</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <EmptyRow cols={5}>Kayıt bulunamadı.</EmptyRow>}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0 hover:bg-bg">
                <td className="px-4 py-2.5">
                  <Link href={`/yonetim/yazilar/${r.id}`} className="font-medium hover:text-accent">{trTitle(r)}</Link>
                  {r.is_premium && <span className="ms-2 rounded bg-bg-3 px-1.5 py-0.5 text-[11.5px] text-fg-3">Kilitli</span>}
                  {r.category?.theme === "foreign" && <span className="ms-1 rounded bg-[#0f2440] px-1.5 py-0.5 text-[11.5px] text-white">Dış</span>}
                </td>
                <td className="px-4 py-2.5 text-fg-3">{TYPE_LABEL[r.type]}</td>
                <td className="px-4 py-2.5">
                  <span className="flex gap-1 font-mono text-[11.5px] uppercase">
                    {locales.map((l) => (
                      <span key={l} className={r.post_translations.some((t) => t.locale === l) ? "text-fg" : "text-line-2"}>{l}</span>
                    ))}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-2.5 text-end text-[12.5px] text-muted tnum">
                  {fmtAdminDate(r.status === "scheduled" ? r.publish_at : r.published_at ?? r.updated_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-[14px]">
          {q.s > 1 ? <a href={link({ s: q.s - 1 })} className={btn.secondary}>Önceki</a> : <span />}
          <span className="text-muted tnum">{q.s} / {pages}</span>
          {q.s < pages ? <a href={link({ s: q.s + 1 })} className={btn.secondary}>Sonraki</a> : <span />}
        </div>
      )}
    </>
  );
}
