import Link from "next/link";
import type { Metadata } from "next";
import { btn, Card, EmptyRow, fmtAdminDate, PageHead, StatusBadge, TYPE_LABEL } from "@/components/admin/ui";
import { can, requireStaff } from "@/lib/admin/auth";
import { adminPosts, statusCounts, trTitle, type AdminPostRow } from "@/lib/admin/data";
import { serviceClient } from "@/lib/supabase/clients";

export const metadata: Metadata = { title: "Pano" };
export const dynamic = "force-dynamic";

function Table({ rows, when }: { rows: AdminPostRow[]; when: (r: AdminPostRow) => string | null }) {
  return (
    <table className="w-full text-[14px]">
      <tbody>
        {rows.length === 0 && <EmptyRow cols={3}>Kayıt yok.</EmptyRow>}
        {rows.map((r) => (
          <tr key={r.id} className="border-b border-line last:border-0">
            <td className="py-2.5 pe-3">
              <Link href={`/yonetim/yazilar/${r.id}`} className="font-medium hover:text-accent">{trTitle(r)}</Link>
              <span className="ms-2 text-[12px] text-muted">{TYPE_LABEL[r.type]}</span>
              {r.review_note && r.status === "draft" && <p className="mt-0.5 text-[12.5px] text-[#a42828]">Not: {r.review_note}</p>}
            </td>
            <td className="w-32 py-2.5 pe-3">
              <StatusBadge status={r.status} />
            </td>
            <td className="w-40 py-2.5 text-end text-[12.5px] text-muted tnum">{fmtAdminDate(when(r))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function Dashboard() {
  const { user, role } = await requireStaff("author");
  const editor = can(role, "editor");
  const [counts, review, scheduled, mine, recent] = await Promise.all([
    statusCounts(),
    adminPosts({ status: "review", size: 10 }),
    adminPosts({ status: "scheduled", size: 10 }),
    adminPosts({ size: 8 }),
    adminPosts({ status: "published", size: 6 }),
  ]);
  const social = editor
    ? ((await serviceClient().from("social_posts").select("id,post_id,network,error,attempts,created_at").eq("status", "failed").order("created_at", { ascending: false }).limit(5)).data ?? [])
    : [];
  const myDrafts = mine.rows.filter((r) => r.created_by === user.id && (r.status === "draft" || r.status === "review"));

  const tiles: [string, number, string][] = [
    ["Taslak", counts.draft, "/yonetim/yazilar?durum=draft"],
    ["Onay bekliyor", counts.review, "/yonetim/yazilar?durum=review"],
    ["Zamanlandı", counts.scheduled, "/yonetim/yazilar?durum=scheduled"],
    ["Yayında", counts.published, "/yonetim/yazilar?durum=published"],
  ];

  return (
    <>
      <PageHead title="Pano" sub={editor ? "Onay bekleyenler, zamanlananlar ve son yayınlar." : "Taslaklarınız ve onay durumları."} actions={<Link href="/yonetim/yazilar/yeni" className={btn.primary}>Yeni yazı</Link>} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map(([l, n, h]) => (
          <a key={l} href={h} className="rounded-lg border border-line bg-bg-2 p-4 hover:border-line-2">
            <p className="text-[13px] text-muted">{l}</p>
            <p className="mt-1 text-[28px] font-semibold tnum">{n}</p>
          </a>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {editor && (
          <Card title="Onay bekleyenler" aside={<Link href="/yonetim/yazilar?durum=review" className="text-[13px] text-accent">Tümü</Link>}>
            <Table rows={review.rows} when={(r) => r.updated_at} />
          </Card>
        )}
        <Card title="Zamanlanmış yayınlar">
          <Table rows={scheduled.rows} when={(r) => r.publish_at} />
        </Card>
        {!editor && (
          <Card title="Taslaklarım">
            <Table rows={myDrafts} when={(r) => r.updated_at} />
          </Card>
        )}
        <Card title="Son yayınlar">
          <Table rows={recent.rows} when={(r) => r.published_at} />
        </Card>
        {editor && (
          <Card title="Sosyal paylaşım hataları">
            {social.length === 0 ? (
              <p className="py-6 text-center text-[14px] text-muted">Hata yok.</p>
            ) : (
              <ul className="divide-y divide-line text-[14px]">
                {social.map((s) => (
                  <li key={s.id} className="py-2.5">
                    <Link href={`/yonetim/yazilar/${s.post_id}`} className="font-medium hover:text-accent">{s.network === "x" ? "X" : "Instagram"}</Link>
                    <span className="ms-2 text-[12.5px] text-muted">{s.attempts} deneme · {fmtAdminDate(s.created_at)}</span>
                    <p className="mt-0.5 truncate text-[12.5px] text-[#a42828]">{s.error}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
