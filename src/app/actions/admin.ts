"use server";
// Yönetim aksiyonları: kullanıcı/rol, davet, ayarlar, mesajlar, ücretsiz erişim. Hepsi sunucuda yetki + zod doğrulamalı.
// Rol yalnızca burada (service_role) app_metadata'ya yazılır; istemci rol değiştiremez.
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { assertStaff, audit } from "@/lib/admin/auth";
import { SITE_URL } from "@/lib/site";
import { CONTENT_TAG, serviceClient } from "@/lib/supabase/clients";

const Role = z.enum(["admin", "editor", "author", "subscriber"]);
const back = (path: string, m: string, ok = true) => redirect(`${path}?${ok ? "ok" : "hata"}=${encodeURIComponent(m)}`);

async function guard(min: "editor" | "admin", path: string) {
  try {
    return await assertStaff(min);
  } catch {
    back(path, "Bu işlem için yetkiniz yok.", false);
    throw new Error("unreachable");
  }
}

async function applyRole(userId: string, role: z.infer<typeof Role>) {
  const db = serviceClient();
  const { data, error } = await db.auth.admin.getUserById(userId);
  if (error || !data.user) throw new Error("Kullanıcı bulunamadı");
  const { error: e2 } = await db.auth.admin.updateUserById(userId, { app_metadata: { ...data.user.app_metadata, role } });
  if (e2) throw e2;
  await db.from("profiles").update({ role }).eq("id", userId);
}

export async function setUserRole(fd: FormData) {
  const P = "/yonetim/kullanicilar";
  const { user } = await guard("admin", P);
  const p = z.object({ userId: z.string().uuid(), role: Role }).safeParse(Object.fromEntries(fd));
  if (!p.success) return back(P, "Geçersiz veri.", false);
  if (p.data.userId === user.id && p.data.role !== "admin") return back(P, "Kendi yönetici yetkinizi kaldıramazsınız.", false);
  try {
    await applyRole(p.data.userId, p.data.role);
  } catch (e) {
    return back(P, (e as Error).message, false);
  }
  await audit(user.id, "user.role", "profiles", p.data.userId, { role: p.data.role });
  back(P, "Rol güncellendi. Kullanıcı bir sonraki girişinde yeni yetkiyle çalışır.");
}

export async function inviteUser(fd: FormData) {
  const P = "/yonetim/kullanicilar";
  const { user } = await guard("admin", P);
  const p = z.object({ email: z.string().trim().toLowerCase().email().max(200), role: Role.exclude(["subscriber"]), name: z.string().trim().max(80).default("") }).safeParse(Object.fromEntries(fd));
  if (!p.success) return back(P, "Geçerli bir e-posta ve rol girin.", false);
  const db = serviceClient();
  const { data, error } = await db.auth.admin.inviteUserByEmail(p.data.email, {
    redirectTo: `${SITE_URL}/api/auth/callback?next=/yonetim`,
    data: { display_name: p.data.name || null, locale: "tr" },
  });
  if (error || !data.user) return back(P, error?.message.includes("already") ? "Bu e-postayla zaten bir hesap var; listeden rolünü değiştirin." : `Davet gönderilemedi: ${error?.message}`, false);
  await db.from("profiles").upsert({ id: data.user.id, email: p.data.email, display_name: p.data.name || null, role: p.data.role }, { onConflict: "id" });
  await applyRole(data.user.id, p.data.role);
  await audit(user.id, "user.invite", "profiles", data.user.id, { email: p.data.email, role: p.data.role });
  back(P, `${p.data.email} adresine davet gönderildi.`);
}

/** Ücretsiz erişim (basın, akademisyen, kurum): sağlayıcısız, süreli abonelik kaydı. */
export async function grantAccess(fd: FormData) {
  const P = "/yonetim/aboneler";
  const { user } = await guard("admin", P);
  const p = z.object({ email: z.string().trim().toLowerCase().email(), months: z.coerce.number().int().min(1).max(36) }).safeParse(Object.fromEntries(fd));
  if (!p.success) return back(P, "E-posta ve süre (1–36 ay) girin.", false);
  const db = serviceClient();
  const { data: prof } = await db.from("profiles").select("id").eq("email", p.data.email).maybeSingle();
  if (!prof) return back(P, "Bu e-postayla kayıtlı okur yok. Önce sitede hesap açması gerekir.", false);
  const end = new Date();
  end.setMonth(end.getMonth() + p.data.months);
  const { error } = await db.from("subscriptions").insert({ user_id: prof.id, provider: "manual", plan: "monthly", status: "active", current_period_end: end.toISOString(), cancel_at_period_end: true });
  if (error) return back(P, error.message, false);
  await audit(user.id, "subscription.grant", "subscriptions", prof.id, { months: p.data.months });
  back(P, `${p.data.email} için ${p.data.months} ay ücretsiz erişim tanımlandı.`);
}

export async function deleteMessage(fd: FormData) {
  const P = "/yonetim/mesajlar";
  const { user } = await guard("editor", P);
  const id = z.coerce.number().int().positive().safeParse(fd.get("id"));
  if (!id.success) return back(P, "Geçersiz kayıt.", false);
  await serviceClient().from("contact_messages").delete().eq("id", id.data);
  await audit(user.id, "message.delete", "contact_messages", String(id.data));
  back(P, "Mesaj silindi.");
}

/* ───────── Ayarlar ───────── */
const lines = (s: string) =>
  s
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
const pairs = (s: string, sep: string) =>
  lines(s)
    .map((l) => {
      const i = l.indexOf(sep);
      return i < 0 ? null : { a: l.slice(0, i).trim(), b: l.slice(i + sep.length).trim() };
    })
    .filter((x): x is { a: string; b: string } => !!x && !!x.a && !!x.b);
const httpUrl = z.union([z.literal(""), z.string().trim().url().max(300).refine((u) => /^https:\/\//.test(u), "https ile başlamalı")]);
const LOCS = ["tr", "en", "ar"] as const;

export async function saveSettings(fd: FormData) {
  const P = "/yonetim/ayarlar";
  const { user } = await guard("admin", P);
  const section = String(fd.get("section") ?? "");
  const db = serviceClient();
  let key: string;
  let value: unknown;

  if (section === "price") {
    const p = z
      .object({ monthly: z.coerce.number().min(0).max(100000), yearly: z.coerce.number().min(0).max(1000000), currency: z.enum(["TRY", "USD", "EUR"]), trialDays: z.coerce.number().int().min(0).max(365) })
      .safeParse(Object.fromEntries(fd));
    if (!p.success) return back(P, "Fiyat alanlarını kontrol edin.", false);
    key = "price";
    value = p.data;
  } else if (section === "social") {
    const p = z.object({ x: httpUrl, instagram: httpUrl, youtube: httpUrl }).safeParse(Object.fromEntries(fd));
    if (!p.success) return back(P, "Sosyal bağlantılar https:// ile başlamalı.", false);
    key = "social";
    value = Object.fromEntries(Object.entries(p.data).filter(([, v]) => v));
  } else if (section === "imprint") {
    const v: Record<string, { label: string; value: string }[]> = {};
    for (const l of LOCS) v[l] = pairs(String(fd.get(l) ?? "").slice(0, 8000), ":").slice(0, 40).map((x) => ({ label: x.a.slice(0, 80), value: x.b.slice(0, 400) }));
    if (!v.tr.length) return back(P, "Türkçe künye boş olamaz.", false);
    key = "imprint";
    value = v;
  } else if (section === "about") {
    const v: Record<string, { bio: string[]; career: { period: string; text: string }[] }> = {};
    for (const l of LOCS) {
      const bio = String(fd.get(`${l}_bio`) ?? "")
        .slice(0, 12000)
        .split(/\r?\n\s*\r?\n/)
        .map((x) => x.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .slice(0, 20);
      const career = pairs(String(fd.get(`${l}_career`) ?? "").slice(0, 6000), "|")
        .slice(0, 40)
        .map((x) => ({ period: x.a.slice(0, 40), text: x.b.slice(0, 300) }));
      v[l] = { bio, career };
    }
    if (!v.tr.bio.length) return back(P, "Türkçe biyografi boş olamaz.", false);
    key = "about";
    value = v;
  } else return back(P, "Bilinmeyen bölüm.", false);

  const { error } = await db.from("site_settings").upsert({ key, value }, { onConflict: "key" });
  if (error) return back(P, error.message, false);
  await audit(user.id, "settings.save", "site_settings", key);
  updateTag(CONTENT_TAG);
  revalidatePath("/[lang]", "layout");
  back(P, "Ayarlar kaydedildi; site birkaç saniye içinde güncellenir.");
}
