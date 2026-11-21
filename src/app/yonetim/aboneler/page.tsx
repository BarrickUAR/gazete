import Link from "next/link";
import type { Metadata } from "next";
import { grantAccess } from "@/app/actions/admin";
import { btn, Card, EmptyRow, Flash, fmtAdminDate, input, label, PageHead, td, th } from "@/components/admin/ui";
import { can, requireStaff } from "@/lib/admin/auth";
import { serviceClient } from "@/lib/supabase/clients";

export const metadata: Metadata = { title: "Aboneler" };
export const dynamic = "force-dynamic";

const ST = ["trialing", "active", "past_due", "canceled", "expired", "pending"] as const;
type St = (typeof ST)[number];
const ST_LABEL: Record<St, string> = { trialing: "Denemede", active: "Aktif", past_due: "Ödeme gecikti", canceled: "İptal edildi", expired: "Süresi doldu", pending: "Başlatılmadı" };
const ST_TONE: Record<St, string> = {
  trialing: "bg-[#e6efff] text-[#1f4fa0]",
  active: "bg-[#e3f5ea] text-[#17663a]",
  past_due: "bg-[#fff4d6] text-[#7a5200]",
  canceled: "bg-bg-3 text-fg-3",
  expired: "bg-bg-3 text-muted",
  pending: "bg-bg-3 text-muted",
};
const PROV: Record<string, string> = { iyzico: "iyzico", paytr: "PayTR", manual: "Ücretsiz erişim" };

const inDays = (n: number) => new Date(Date.now() + n * 864e5).toISOString();

export default async function Subscribers({ searchParams }: PageProps<"/yonetim/aboneler">) {
  const { role } = await requireStaff("editor");
  const sp = await searchParams;
  const f = typeof sp.durum === "string" && (ST as readonly string[]).includes(sp.durum) ? (sp.durum as St) : null;
  const db = serviceClient();

  const counts = Object.fromEntries(
    await Promise.all(ST.map(async (s) => [s, (await db.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", s)).count ?? 0] as const)),
  ) as Record<St, number>;
  const soon = inDays(14);
  const { count: endingTrials } = await db.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "trialing").lte("trial_end", soon);

  let q = db.from("subscriptions").select("id,user_id,provider,plan,status,trial_end,current_period_end,cancel_at_period_end,created_at").order("created_at", { ascending: false }).limit(200);
  q = f ? q.eq("status", f) : q.neq("status", "pending");
  const { data: subs } = await q;
  const ids = [...new Set((subs ?? []).map((s) => s.user_id))];
  const { data: profs } = ids.length ? await db.from("profiles").select("id,email,display_name").in("id", ids) : { data: [] };
  const who = new Map((profs ?? []).map((p) => [p.id, p]));

  return (
    <>
      <PageHead title="Aboneler" sub="Deneme, aktif ve geçmiş abonelikler. Kart bilgisi bizde tutulmaz; ödeme sağlayıcıdadır." />
      <Flash sp={sp} />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["trialing", "active", "past_due", "canceled"] as St[]).map((s) => (
          <Link key={s} href={`/yonetim/aboneler?durum=${s}`} className="rounded-lg border border-line bg-bg-2 px-4 py-3 hover:border-fg-3">
            <p className="text-[12.5px] text-muted">{ST_LABEL[s]}</p>
            <p className="mt-1 text-[24px] font-semibold tnum">{counts[s]}</p>
          </Link>
        ))}
      </div>
      {(endingTrials ?? 0) > 0 && (
        <p className="mb-5 rounded-md border border-line bg-bg-2 px-4 py-3 text-[14px] text-fg-3">
          Önümüzdeki 14 günde <b className="text-fg">{endingTrials}</b> okurun ücretsiz denemesi bitiyor; bitişte kayıtlı karttan otomatik ücret alınır.
        </p>
      )}
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <nav className="mb-3 flex flex-wrap gap-1 text-[13.5px]" aria-label="Durum filtresi">
            <Link href="/yonetim/aboneler" className={`rounded px-3 py-1.5 ${!f ? "bg-fg text-bg" : "text-fg-3 hover:text-fg"}`}>Tümü</Link>
            {ST.map((s) => (
              <Link key={s} href={`/yonetim/aboneler?durum=${s}`} className={`rounded px-3 py-1.5 ${f === s ? "bg-fg text-bg" : "text-fg-3 hover:text-fg"}`}>
                {ST_LABEL[s]} <span className="text-muted tnum">{counts[s]}</span>
              </Link>
            ))}
          </nav>
          <div className="overflow-x-auto rounded-lg border border-line bg-bg-2">
            <table className="w-full min-w-[720px] text-[14px]">
              <thead className="border-b border-line">
                <tr>
                  <th className={th}>Okur</th>
                  <th className={th}>Durum</th>
                  <th className={th}>Plan</th>
                  <th className={th}>Deneme bitişi</th>
                  <th className={th}>Dönem sonu</th>
                  <th className={th}>Başlangıç</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {(subs ?? []).map((s) => {
                  const p = who.get(s.user_id);
                  return (
                    <tr key={s.id}>
                      <td className={td}>
                        <p className="font-medium">{p?.display_name || p?.email?.split("@")[0] || "—"}</p>
                        <p className="text-[12.5px] text-muted">{p?.email}</p>
                      </td>
                      <td className={td}>
                        <span className={`inline-block rounded px-1.5 py-0.5 text-[12px] font-medium ${ST_TONE[s.status as St]}`}>{ST_LABEL[s.status as St] ?? s.status}</span>
                        {s.cancel_at_period_end && s.status !== "canceled" && s.provider !== "manual" && <p className="mt-1 text-[12px] text-muted">Dönem sonunda bitecek</p>}
                      </td>
                      <td className={`${td} text-[13px]`}>
                        {s.plan === "yearly" ? "Yıllık" : "Aylık"}
                        <p className="text-[12px] text-muted">{PROV[s.provider] ?? s.provider}</p>
                      </td>
                      <td className={`${td} text-[13px] tnum`}>{fmtAdminDate(s.trial_end)}</td>
                      <td className={`${td} text-[13px] tnum`}>{fmtAdminDate(s.current_period_end)}</td>
                      <td className={`${td} text-[13px] text-fg-3 tnum`}>{fmtAdminDate(s.created_at)}</td>
                    </tr>
                  );
                })}
                {(subs ?? []).length === 0 && <EmptyRow cols={6}>Bu durumda abonelik yok.</EmptyRow>}
              </tbody>
            </table>
          </div>
        </div>
        {can(role, "admin") && (
          <aside>
            <Card title="Ücretsiz erişim tanımla">
              <form action={grantAccess} className="space-y-3">
                <p className="text-[13px] text-fg-3">Basın, akademisyen ya da kurum için ödeme almadan süreli erişim. Okurun önce sitede hesap açmış olması gerekir.</p>
                <label className="block">
                  <span className={label}>Okurun e-postası</span>
                  <input name="email" type="email" required className={input} />
                </label>
                <label className="block">
                  <span className={label}>Süre (ay)</span>
                  <input name="months" type="number" min={1} max={36} defaultValue={3} required className={input} />
                </label>
                <button className={`${btn.primary} w-full`}>Erişim tanımla</button>
              </form>
            </Card>
          </aside>
        )}
      </div>
    </>
  );
}
