// iyzico Abonelik API adaptörü (IYZWSv2 imzası, Web Crypto — Cloudflare Workers uyumlu).
// Deneme süresi iyzico panelindeki fiyatlandırma planında `trialPeriodDays: 90` olarak tanımlanır.
// Kart bilgisi iyzico ödeme formunda alınır ve iyzico'da saklanır; bize yalnızca referans kodları döner.
// ÖNEMLİ: Canlıya almadan önce sandbox'ta uçtan uca doğrulanmalı (imza, webhook alanları).
import type { SubscriptionRow } from "../access";
import type { PaymentProvider, ProviderUpdate } from "./types";

const env = () => ({
  apiKey: process.env.IYZICO_API_KEY ?? "",
  secret: process.env.IYZICO_SECRET_KEY ?? "",
  base: (process.env.IYZICO_BASE_URL ?? "https://sandbox-api.iyzipay.com").replace(/\/$/, ""),
  plans: { monthly: process.env.IYZICO_PLAN_MONTHLY ?? "", yearly: process.env.IYZICO_PLAN_YEARLY ?? "" },
});

const enc = new TextEncoder();

async function hmacHex(key: string, msg: string) {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(msg)));
  return Array.from(sig, (b) => b.toString(16).padStart(2, "0")).join("");
}

function b64(s: string) {
  return btoa(String.fromCharCode(...enc.encode(s)));
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function call<T = Record<string, unknown>>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
  const e = env();
  const rnd = `${Date.now()}${Math.random().toString(36).slice(2, 10)}`;
  const payload = body ? JSON.stringify(body) : "";
  const uriPath = path.split("?")[0];
  const signature = await hmacHex(e.secret, rnd + uriPath + payload);
  const auth = "IYZWSv2 " + b64(`apiKey:${e.apiKey}&randomKey:${rnd}&signature:${signature}`);
  const res = await fetch(e.base + path, {
    method,
    headers: { Authorization: auth, "x-iyzi-rnd": rnd, "Content-Type": "application/json", Accept: "application/json" },
    body: payload || undefined,
  });
  const json = (await res.json().catch(() => ({}))) as T & { status?: string; errorMessage?: string };
  if (!res.ok || json.status === "failure") throw new Error(`iyzico: ${json.errorMessage ?? res.status}`);
  return json;
}

const mapStatus = (s: string | undefined): SubscriptionRow["status"] | undefined => {
  switch ((s ?? "").toUpperCase()) {
    case "ACTIVE":
      return "active";
    case "PENDING":
      return "pending";
    case "UNPAID":
      return "past_due";
    case "CANCELED":
      return "canceled";
    case "EXPIRED":
      return "expired";
    default:
      return undefined;
  }
};

type SubData = { referenceCode?: string; subscriptionReferenceCode?: string; subscriptionStatus?: string; trialEndDate?: number; endDate?: number; trialDays?: number; startDate?: number };
const iso = (ms?: number) => (ms ? new Date(ms).toISOString() : null);

function toUpdate(eventKey: string, d: SubData, raw: unknown): ProviderUpdate | null {
  const ref = d.subscriptionReferenceCode ?? d.referenceCode;
  if (!ref) return null;
  const trialEnd = iso(d.trialEndDate);
  const inTrial = d.trialEndDate && d.trialEndDate > Date.now();
  const base = mapStatus(d.subscriptionStatus);
  return {
    eventKey,
    providerRef: ref,
    status: base === "active" && inTrial ? "trialing" : base,
    trialEnd,
    currentPeriodEnd: iso(d.endDate) ?? trialEnd,
    raw,
  };
}

async function retrieve(ref: string) {
  const r = await call<{ data?: SubData }>("GET", `/v2/subscription/subscriptions/${encodeURIComponent(ref)}`);
  return r.data ?? {};
}

export const iyzico: PaymentProvider = {
  id: "iyzico",
  configured() {
    const e = env();
    return Boolean(e.apiKey && e.secret && e.plans.monthly && e.plans.yearly);
  },

  async startTrial(o) {
    const e = env();
    const addr = { contactName: `${o.billing.name} ${o.billing.surname}`, city: o.billing.city, country: "Turkey", address: o.billing.address };
    const r = await call<{ token?: string; checkoutFormContent?: string }>("POST", "/v2/subscription/checkoutform/initialize", {
      locale: o.lang === "tr" ? "tr" : "en",
      conversationId: o.conversationId,
      callbackUrl: o.callbackUrl,
      pricingPlanReferenceCode: e.plans[o.plan],
      subscriptionInitialStatus: "ACTIVE",
      customer: {
        name: o.billing.name,
        surname: o.billing.surname,
        email: o.email,
        gsmNumber: o.billing.phone,
        identityNumber: o.billing.identityNumber || "11111111111",
        billingAddress: addr,
        shippingAddress: addr,
      },
    });
    if (!r.checkoutFormContent) throw new Error("iyzico: form içeriği dönmedi");
    return { kind: "embed", script: r.checkoutFormContent, providerToken: r.token };
  },

  async completeCheckout(form) {
    const token = String(form.get("token") ?? "");
    if (!/^[\w-]{10,200}$/.test(token)) return null;
    // Sonuç her zaman iyzico'dan imzalı API çağrısıyla okunur; tarayıcıdan gelen veriye güvenilmez.
    const r = await call<{ data?: SubData }>("GET", `/v2/subscription/checkoutform/${encodeURIComponent(token)}`);
    const ref = r.data?.referenceCode ?? r.data?.subscriptionReferenceCode;
    if (!ref) return null;
    const d = await retrieve(ref);
    return toUpdate(`iyzico:checkout:${token}`, { ...r.data, ...d, referenceCode: ref }, r);
  },

  async parseWebhook(req) {
    const text = await req.text();
    let body: Record<string, string>;
    try {
      body = JSON.parse(text);
    } catch {
      return null;
    }
    const sig = req.headers.get("x-iyz-signature-v3") ?? "";
    const expected = await hmacHex(
      env().secret,
      `${env().secret}${body.iyziEventType ?? ""}${body.subscriptionReferenceCode ?? ""}${body.orderReferenceCode ?? ""}${body.customerReferenceCode ?? ""}`,
    );
    if (!sig || !timingSafeEqual(sig.toLowerCase(), expected)) return null;
    // Durum her zaman API'den doğrulanır (bildirim yalnızca tetikleyicidir).
    const d = await retrieve(body.subscriptionReferenceCode);
    return toUpdate(`iyzico:${body.iyziEventType}:${body.orderReferenceCode ?? body.iyziReferenceCode ?? body.subscriptionReferenceCode}`, d, body);
  },

  async cancel(sub) {
    if (!sub.provider_ref) return;
    await call("POST", `/v2/subscription/subscriptions/${encodeURIComponent(sub.provider_ref)}/cancel`, {});
  },
};
