// PayTR adaptörü — İSKELET. PayTR'de 0 TL ile kart saklama yok; deneme için "Kart Saklama + Tekrarlayan Ödeme"
// yetkisi ve küçük bir doğrulama çekimi (ardından iade) gerekir. Mağaza ile anlaşma netleşince tamamlanacak:
//  1) get-token (store_card=1, utoken) → iFrame ile kart alınır
//  2) bildirim URL'si: hash = base64(HMAC-SHA256(merchant_oid + merchant_salt + status + total_amount, merchant_key))
//  3) cron: deneme bitiminde saklı kartla (utoken + ctoken) "recurring" ödeme
// Yapılandırılmadıkça `configured()` false döner ve arayüz bunu "ödeme altyapısı henüz etkin değil" olarak gösterir.
import type { PaymentProvider } from "./types";

export const paytr: PaymentProvider = {
  id: "paytr",
  configured: () => false,
  async startTrial() {
    throw new Error("PayTR adaptörü henüz etkin değil");
  },
  async completeCheckout() {
    return null;
  },
  async parseWebhook() {
    return null;
  },
  async cancel() {
    // Saklı kart token'ı silinir, tekrarlayan çekim durur (cron bu aboneliği atlar).
  },
};
