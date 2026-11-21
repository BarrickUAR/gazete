import { serviceClient } from "../supabase/clients";
import { iyzico } from "./iyzico";
import { paytr } from "./paytr";
import type { PaymentProvider, ProviderUpdate } from "./types";

const providers: Record<string, PaymentProvider> = { iyzico, paytr };

export function getProvider(id: string | undefined | null): PaymentProvider | null {
  return id && providers[id] ? providers[id] : null;
}

/** Ortamda seçili ve yapılandırılmış sağlayıcı (PAYMENT_PROVIDER=iyzico|paytr). */
export function activeProvider(): PaymentProvider | null {
  const p = getProvider(process.env.PAYMENT_PROVIDER ?? "iyzico");
  return p?.configured() ? p : null;
}

/** Güncellemeyi idempotent uygular: aynı eventKey ikinci kez gelirse yok sayılır. */
export async function applyUpdate(provider: PaymentProvider["id"], u: ProviderUpdate, opts: { subscriptionId?: string } = {}) {
  const db = serviceClient();
  const { error: dup } = await db.from("payment_events").insert({ provider, event_key: u.eventKey, payload: u.raw as object });
  if (dup) {
    if (dup.code === "23505") return { duplicate: true };
    throw dup;
  }
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (u.status) patch.status = u.status;
  if (u.trialEnd !== undefined) patch.trial_end = u.trialEnd;
  if (u.currentPeriodEnd !== undefined) patch.current_period_end = u.currentPeriodEnd;
  patch.provider_ref = u.providerRef;
  const q = db.from("subscriptions").update(patch);
  const { error } = opts.subscriptionId ? await q.eq("id", opts.subscriptionId) : await q.eq("provider", provider).eq("provider_ref", u.providerRef);
  if (error) throw error;
  return { duplicate: false };
}

export type { Billing, Plan } from "./types";
