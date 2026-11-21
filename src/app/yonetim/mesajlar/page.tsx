import Link from "next/link";
import type { Metadata } from "next";
import { deleteMessage } from "@/app/actions/admin";
import { btn, Card, Flash, fmtAdminDate, PageHead } from "@/components/admin/ui";
import { requireStaff } from "@/lib/admin/auth";
import { serviceClient } from "@/lib/supabase/clients";

export const metadata: Metadata = { title: "Mesajlar" };
export const dynamic = "force-dynamic";

const KINDS = { ihbar: "Haber ihbarı", basin: "Basın / röportaj", genel: "Genel" } as const;
type Kind = keyof typeof KINDS;

export default async function Messages({ searchParams }: PageProps<"/yonetim/mesajlar">) {
  await requireStaff("editor");
  const sp = await searchParams;
  const f = typeof sp.tur === "string" && sp.tur in KINDS ? (sp.tur as Kind) : null;
  const db = serviceClient();
  let q = db.from("contact_messages").select("id,kind,name,email,message,created_at").order("created_at", { ascending: false }).limit(200);
  if (f) q = q.eq("kind", f);
  const [{ data: msgs }, { count: nl }, { data: nlRecent }] = await Promise.all([
    q,
    db.from("newsletter").select("email", { count: "exact", head: true }),
    db.from("newsletter").select("email,locale,created_at").order("created_at", { ascending: false }).limit(12),
  ]);
  return (
    <>
      <PageHead title="Mesajlar" sub="Kimdir sayfasındaki iletişim formundan gelenler ve bülten aboneleri." />
      <Flash sp={sp} />
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <nav className="mb-3 flex flex-wrap gap-1 text-[13.5px]" aria-label="Tür filtresi">
            <Link href="/yonetim/mesajlar" className={`rounded px-3 py-1.5 ${!f ? "bg-fg text-bg" : "text-fg-3 hover:text-fg"}`}>Tümü</Link>
            {(Object.keys(KINDS) as Kind[]).map((k) => (
              <Link key={k} href={`/yonetim/mesajlar?tur=${k}`} className={`rounded px-3 py-1.5 ${f === k ? "bg-fg text-bg" : "text-fg-3 hover:text-fg"}`}>
                {KINDS[k]}
              </Link>
            ))}
          </nav>
          <ul className="space-y-3">
            {(msgs ?? []).map((m) => (
              <li key={m.id} className="rounded-lg border border-line bg-bg-2 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {m.name} <span className="ms-2 rounded bg-bg-3 px-1.5 py-0.5 text-[12px] font-normal text-fg-3">{KINDS[m.kind as Kind] ?? m.kind}</span>
                    </p>
                    <p className="text-[13px] text-muted">
                      <a href={`mailto:${m.email}`} className="text-accent">{m.email}</a> · <span className="tnum">{fmtAdminDate(m.created_at)}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`mailto:${m.email}?subject=${encodeURIComponent("Mesajınız hakkında")}`} className={`${btn.secondary} py-1.5`}>Yanıtla</a>
                    <form action={deleteMessage}>
                      <input type="hidden" name="id" value={m.id} />
                      <button className={`${btn.danger} py-1.5`}>Sil</button>
                    </form>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-[14.5px] leading-[1.6] text-fg-2">{m.message}</p>
              </li>
            ))}
          </ul>
          {(msgs ?? []).length === 0 && <p className="rounded-lg border border-line bg-bg-2 py-12 text-center text-[14px] text-muted">Mesaj yok.</p>}
        </div>
        <aside>
          <Card title="Bülten" aside={<span className="text-[13px] text-muted tnum">{nl ?? 0} abone</span>}>
            <ul className="divide-y divide-line text-[13px]">
              {(nlRecent ?? []).map((n) => (
                <li key={n.email} className="flex justify-between gap-2 py-1.5">
                  <span className="truncate">{n.email}</span>
                  <span className="shrink-0 uppercase text-muted">{n.locale}</span>
                </li>
              ))}
            </ul>
            {(nl ?? 0) > 0 && (
              <a href="/api/yonetim/bulten.csv" className={`${btn.secondary} mt-3 w-full`}>
                Tümünü indir (CSV)
              </a>
            )}
          </Card>
        </aside>
      </div>
    </>
  );
}
