// Abonelik / erişim kuralı (yalnız sunucu).
// Erişim: personel (admin/editor/author) her zaman; abone → status trialing|active ve süresi dolmamış;
// past_due → dönem bitişinden sonra 7 gün ödemesiz süre.
import { hasServiceRole, hasSupabase, serviceClient, sessionClient } from "./supabase/clients";
import type { Role } from "./types";

export const GRACE_DAYS = 7;

export type SubscriptionRow = {
  id: string;
  user_id: string;
  provider: "iyzico" | "paytr" | "manual";
  plan: "monthly" | "yearly";
  status: "pending" | "trialing" | "active" | "past_due" | "canceled" | "expired";
  trial_end: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  provider_ref: string | null;
  created_at: string;
};

export function subscriptionGrants(s: Pick<SubscriptionRow, "status" | "current_period_end" | "trial_end"> | null, now = Date.now()) {
  if (!s) return false;
  const end = s.current_period_end ?? s.trial_end;
  const endMs = end ? new Date(end).getTime() : 0;
  if (s.status === "trialing" || s.status === "active") return !end || endMs > now;
  if (s.status === "past_due") return endMs + GRACE_DAYS * 86400_000 > now;
  // İptal edilmiş ama dönemi bitmemiş abonelik dönem sonuna kadar erişir.
  if (s.status === "canceled") return endMs > now;
  return false;
}

export async function currentUser() {
  if (!hasSupabase()) return null;
  const sb = await sessionClient();
  const { data } = await sb.auth.getUser();
  return data.user ?? null;
}

export function roleOf(user: { app_metadata?: Record<string, unknown> } | null): Role {
  const r = user?.app_metadata?.role;
  return r === "admin" || r === "editor" || r === "author" ? r : "subscriber";
}

export async function latestSubscription(userId: string): Promise<SubscriptionRow | null> {
  if (!hasServiceRole()) return null;
  const { data } = await serviceClient()
    .from("subscriptions")
    .select("id,user_id,provider,plan,status,trial_end,current_period_end,cancel_at_period_end,provider_ref,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as SubscriptionRow) ?? null;
}

export async function hasAccess(): Promise<{ ok: boolean; reason: "anon" | "no-sub" | "ok" | "unavailable" }> {
  if (!hasSupabase() || !hasServiceRole()) return { ok: false, reason: "unavailable" };
  const user = await currentUser();
  if (!user) return { ok: false, reason: "anon" };
  if (roleOf(user) !== "subscriber") return { ok: true, reason: "ok" };
  const sub = await latestSubscription(user.id);
  return subscriptionGrants(sub) ? { ok: true, reason: "ok" } : { ok: false, reason: "no-sub" };
}
