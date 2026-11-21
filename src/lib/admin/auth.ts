// Yönetim paneli yetki kapısı (yalnız sunucu). Rol JWT app_metadata'dan okunur; yalnızca sunucu yazar.
import { redirect } from "next/navigation";
import { currentUser, roleOf } from "../access";
import { hasSupabase, serviceClient } from "../supabase/clients";
import type { Role } from "../types";

const rank: Record<Role, number> = { subscriber: 0, author: 1, editor: 2, admin: 3 };

export const can = (role: Role, min: Role) => rank[role] >= rank[min];

/** Sayfa için: yetkisizse girişe/hesaba yönlendirir. */
export async function requireStaff(min: Role = "author") {
  if (!hasSupabase()) redirect("/giris");
  const user = await currentUser();
  if (!user) redirect(`/giris?next=${encodeURIComponent("/yonetim")}`);
  const role = roleOf(user);
  if (!can(role, min)) redirect(can(role, "author") ? "/yonetim" : "/hesabim");
  return { user, role };
}

/** Sunucu aksiyonu için: yetkisizse hata fırlatır (yönlendirme yerine). */
export async function assertStaff(min: Role = "author") {
  const user = hasSupabase() ? await currentUser() : null;
  const role = roleOf(user);
  if (!user || !can(role, min)) throw new Error("Yetkiniz yok");
  return { user, role };
}

export async function audit(actor: string, action: string, entity: string, entityId?: string | null, meta: Record<string, unknown> = {}) {
  await serviceClient().from("audit_log").insert({ actor, action, entity, entity_id: entityId ?? null, meta });
}

export const ROLE_LABEL: Record<Role, string> = { admin: "Yönetici", editor: "Editör", author: "Yazar", subscriber: "Okur" };
