import Link from "next/link";
import type { Metadata } from "next";
import { inviteUser, setUserRole } from "@/app/actions/admin";
import { btn, Card, EmptyRow, Flash, fmtAdminDate, input, label, PageHead, td, th } from "@/components/admin/ui";
import { requireStaff, ROLE_LABEL } from "@/lib/admin/auth";
import { serviceClient } from "@/lib/supabase/clients";
import type { Role } from "@/lib/types";

export const metadata: Metadata = { title: "Kullanıcılar" };
export const dynamic = "force-dynamic";

const ROLES: Role[] = ["admin", "editor", "author", "subscriber"];
const HELP: Record<Role, string> = {
  admin: "Her şey: kullanıcılar, ayarlar, ödeme.",
  editor: "Yayınlar, zamanlar, onaylar; aboneleri ve mesajları görür.",
  author: "Yazar; yazıyı onaya gönderir, yayınlayamaz.",
  subscriber: "Okur; panele giremez.",
};

export default async function Users({ searchParams }: PageProps<"/yonetim/kullanicilar">) {
  const { user } = await requireStaff("admin");
  const sp = await searchParams;
  const f = typeof sp.rol === "string" && (ROLES as string[]).includes(sp.rol) ? (sp.rol as Role) : null;
  let q = serviceClient().from("profiles").select("id,email,display_name,role,created_at").order("created_at", { ascending: false }).limit(300);
  if (f) q = q.eq("role", f);
  else q = q.neq("role", "subscriber");
  const { data } = await q;
  const rows = data ?? [];
  return (
    <>
      <PageHead title="Kullanıcılar" sub="Ekip üyeleri ve yetkileri. Okurlar Aboneler ekranında." />
      <Flash sp={sp} />
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <nav className="mb-3 flex flex-wrap gap-1 text-[13.5px]" aria-label="Rol filtresi">
            <Link href="/yonetim/kullanicilar" className={`rounded px-3 py-1.5 ${!f ? "bg-fg text-bg" : "text-fg-3 hover:text-fg"}`}>Ekip</Link>
            {ROLES.map((r) => (
              <Link key={r} href={`/yonetim/kullanicilar?rol=${r}`} className={`rounded px-3 py-1.5 ${f === r ? "bg-fg text-bg" : "text-fg-3 hover:text-fg"}`}>
                {ROLE_LABEL[r]}
              </Link>
            ))}
          </nav>
          <div className="overflow-x-auto rounded-lg border border-line bg-bg-2">
            <table className="w-full min-w-[640px] text-[14px]">
              <thead className="border-b border-line">
                <tr>
                  <th className={th}>Kişi</th>
                  <th className={th}>Kayıt</th>
                  <th className={th}>Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className={td}>
                      <p className="font-medium">{r.display_name || r.email.split("@")[0]}</p>
                      <p className="text-[12.5px] text-muted">{r.email}</p>
                    </td>
                    <td className={`${td} text-[13px] text-fg-3 tnum`}>{fmtAdminDate(r.created_at)}</td>
                    <td className={td}>
                      <form action={setUserRole} className="flex items-center gap-2">
                        <input type="hidden" name="userId" value={r.id} />
                        <select name="role" defaultValue={r.role} className={`${input} w-auto py-1.5`} aria-label={`${r.email} rolü`} disabled={r.id === user.id}>
                          {ROLES.map((x) => (
                            <option key={x} value={x}>{ROLE_LABEL[x]}</option>
                          ))}
                        </select>
                        {r.id === user.id ? <span className="text-[12.5px] text-muted">Siz</span> : <button className={`${btn.secondary} py-1.5`}>Kaydet</button>}
                      </form>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && <EmptyRow cols={3}>Bu rolde kullanıcı yok.</EmptyRow>}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="space-y-4">
          <Card title="Ekibe davet et">
            <form action={inviteUser} className="space-y-3">
              <label className="block">
                <span className={label}>E-posta</span>
                <input name="email" type="email" required className={input} />
              </label>
              <label className="block">
                <span className={label}>Ad (isteğe bağlı)</span>
                <input name="name" maxLength={80} className={input} />
              </label>
              <label className="block">
                <span className={label}>Rol</span>
                <select name="role" defaultValue="author" className={input}>
                  {(["author", "editor", "admin"] as Role[]).map((x) => (
                    <option key={x} value={x}>{ROLE_LABEL[x]}</option>
                  ))}
                </select>
              </label>
              <button className={`${btn.primary} w-full`}>Davet gönder</button>
              <p className="text-[12.5px] text-muted">Davetli e-postadaki bağlantıyla girer; sonra Giriş sayfasından e-posta bağlantısıyla ya da şifre belirleyerek girebilir.</p>
            </form>
          </Card>
          <Card title="Roller">
            <dl className="space-y-2.5 text-[13.5px]">
              {ROLES.map((r) => (
                <div key={r}>
                  <dt className="font-medium">{ROLE_LABEL[r]}</dt>
                  <dd className="text-fg-3">{HELP[r]}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </aside>
      </div>
    </>
  );
}
