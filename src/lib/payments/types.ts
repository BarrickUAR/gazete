import type { SubscriptionRow } from "../access";

export type Plan = "monthly" | "yearly";

export type Billing = {
  name: string;
  surname: string;
  phone: string;
  city: string;
  address: string;
  identityNumber?: string;
};

export type StartResult =
  /** Ödeme kuruluşunun sayfasına yönlendir. */
  | { kind: "redirect"; url: string; providerToken?: string }
  /** Ödeme kuruluşunun verdiği form betiğini sayfaya göm (iyzico checkout form). */
  | { kind: "embed"; script: string; providerToken?: string };

/** Bildirim (webhook) veya dönüşten çıkan abonelik güncellemesi. */
export type ProviderUpdate = {
  eventKey: string; // idempotency anahtarı
  providerRef: string; // abonelik referansı
  status?: SubscriptionRow["status"];
  trialEnd?: string | null;
  currentPeriodEnd?: string | null;
  raw: unknown;
};

export interface PaymentProvider {
  id: "iyzico" | "paytr";
  configured(): boolean;
  /** Kart bilgisi ödeme kuruluşunun sayfasında alınır; deneme süresi sağlayıcı planında tanımlıdır. */
  startTrial(o: { userId: string; email: string; plan: Plan; billing: Billing; lang: "tr" | "en" | "ar"; callbackUrl: string; conversationId: string }): Promise<StartResult>;
  /** Ödeme sayfasından dönüş (callback). */
  completeCheckout(form: FormData): Promise<ProviderUpdate | null>;
  /** İmzası doğrulanmış bildirim; geçersizse null. */
  parseWebhook(req: Request): Promise<ProviderUpdate | null>;
  cancel(sub: SubscriptionRow): Promise<void>;
}
