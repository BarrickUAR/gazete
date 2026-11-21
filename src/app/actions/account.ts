"use server";
// Abonelik iptali / sürdürme. Kullanıcı yalnızca kendi aboneliğini değiştirebilir (oturumdan, sunucu tarafında).
import { revalidatePath } from "next/cache";
import { currentUser, latestSubscription } from "@/lib/access";
import { getProvider } from "@/lib/payments";
import { serviceClient } from "@/lib/supabase/clients";

export type AccountState = { ok: boolean; error?: string } | null;

export async function cancelSubscription(_prev: AccountState): Promise<AccountState> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "auth" };
  const sub = await latestSubscription(user.id);
  if (!sub || !["trialing", "active", "past_due"].includes(sub.status)) return { ok: false, error: "none" };
  try {
    await getProvider(sub.provider)?.cancel(sub);
  } catch (e) {
    console.error("cancel", e);
    return { ok: false, error: "provider" };
  }
  // Erişim dönem (veya deneme) sonuna kadar sürer; sonra kilitlenir.
  const { error } = await serviceClient()
    .from("subscriptions")
    .update({ status: "canceled", cancel_at_period_end: true, updated_at: new Date().toISOString() })
    .eq("id", sub.id)
    .eq("user_id", user.id);
  if (error) return { ok: false, error: "server" };
  await serviceClient().from("audit_log").insert({ actor: user.id, action: "subscription.cancel", entity: "subscriptions", entity_id: sub.id });
  revalidatePath("/[lang]/hesabim", "page");
  return { ok: true };
}
