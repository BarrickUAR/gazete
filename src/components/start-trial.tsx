"use client";
// Plan seçimi + fatura bilgileri → /api/abonelik/baslat → iyzico ödeme formu (kart bilgisi iyzico'da alınır).
import { useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href, withQuery } from "@/i18n/routes";

const field = "w-full border border-line-2 bg-bg px-4 py-3 font-ui text-[15px] text-fg placeholder:text-muted focus:border-fg focus:outline-none";
const lbl = "mb-1.5 block font-label text-[12px] font-semibold uppercase tracking-[0.12em] text-muted";

const T = {
  tr: { billing: "Fatura bilgileri", name: "Ad", surname: "Soyad", phone: "Cep telefonu", city: "Şehir", address: "Adres", tc: "T.C. kimlik no (isteğe bağlı)", secure: "Kart bilgileriniz bir sonraki adımda iyzico güvenli ödeme formunda alınır.", already: "Zaten aktif bir aboneliğiniz var.", provider: "Ödeme kuruluşuna bağlanılamadı. Lütfen tekrar deneyin.", invalid: "Lütfen işaretli alanları kontrol edin." },
  en: { billing: "Billing details", name: "First name", surname: "Last name", phone: "Mobile phone", city: "City", address: "Address", tc: "Turkish ID no (optional)", secure: "Your card is entered in the next step on iyzico's secure payment form.", already: "You already have an active subscription.", provider: "Could not reach the payment provider. Please try again.", invalid: "Please check the highlighted fields." },
  ar: { billing: "بيانات الفوترة", name: "الاسم", surname: "اسم العائلة", phone: "الهاتف المحمول", city: "المدينة", address: "العنوان", tc: "رقم الهوية التركية (اختياري)", secure: "تُدخل بطاقتك في الخطوة التالية عبر نموذج الدفع الآمن من iyzico.", already: "لديك اشتراك فعّال بالفعل.", provider: "تعذّر الاتصال بمزوّد الدفع. حاول مرة أخرى.", invalid: "يرجى التحقق من الحقول المحددة." },
} as const;

export function StartTrial({ lang, prices, enabled }: { lang: Locale; prices: { monthly: string; yearly: string }; enabled: boolean }) {
  const d = getDict(lang);
  const t = T[lang];
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<{ text: string; login?: boolean; fields?: string[] } | null>(null);
  const [embedded, setEmbedded] = useState(false);
  const host = useRef<HTMLDivElement>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/abonelik/baslat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan,
        lang,
        billing: Object.fromEntries(["name", "surname", "phone", "city", "address", "identityNumber"].map((k) => [k, String(f.get(k) ?? "")])),
      }),
    }).catch(() => null);
    setBusy(false);
    if (!res) return setErr({ text: t.provider });
    const j = await res.json().catch(() => ({}));
    if (res.status === 401) return setErr({ text: d.subscribe.needLogin, login: true });
    if (res.status === 409) return setErr({ text: t.already });
    if (res.status === 503) return setErr({ text: d.subscribe.unavailable });
    if (res.status === 400) return setErr({ text: t.invalid, fields: j.fields });
    if (!res.ok) return setErr({ text: t.provider });
    if (j.kind === "redirect") return window.location.assign(j.url);
    if (j.kind === "embed" && host.current) {
      // iyzico'nun döndürdüğü betik #iyzipay-checkout-form içine formu çizer.
      host.current.innerHTML = '<div id="iyzipay-checkout-form" class="responsive"></div>';
      const tmp = document.createElement("div");
      tmp.innerHTML = j.script;
      tmp.querySelectorAll("script").forEach((old) => {
        const s = document.createElement("script");
        if (old.src) s.src = old.src;
        s.text = old.text;
        host.current!.appendChild(s);
      });
      setEmbedded(true);
    }
  }

  const bad = (k: string) => err?.fields?.some((f) => f.endsWith(k)) || undefined;

  return (
    <div>
      <div ref={host} />
      {!embedded && (
        <form onSubmit={submit} className="space-y-8">
          <fieldset>
            <legend className="sr-only">{d.subscribe.title}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["monthly", "yearly"] as const).map((p) => (
                <label key={p} className={`relative cursor-pointer border p-5 transition-colors duration-150 ${plan === p ? "border-fg bg-bg-2" : "border-line-2 hover:border-fg-3"}`}>
                  <input type="radio" name="plan" value={p} checked={plan === p} onChange={() => setPlan(p)} className="sr-only" />
                  <span className="flex items-center justify-between font-label text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
                    {d.subscribe[p]}
                    {p === "yearly" && <span className="bg-accent px-1.5 py-0.5 text-[10.5px] text-accent-fg">{d.subscribe.save}</span>}
                  </span>
                  <span className="mt-3 block font-display text-[38px] leading-none text-head tnum">{prices[p]}</span>
                  <span className="mt-1 block font-ui text-[13px] text-muted">{p === "monthly" ? d.subscribe.perMonth : d.subscribe.perYear}</span>
                  <span className="mt-4 block font-ui text-[13.5px] font-semibold text-accent">{d.subscribe.trial}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset disabled={!enabled} className="space-y-4">
            <legend className="font-label text-[12px] font-semibold uppercase tracking-[0.14em] text-fg">{t.billing}</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className={lbl}>{t.name}</span>
                <input name="name" required minLength={2} maxLength={60} autoComplete="given-name" className={field} aria-invalid={bad("name")} />
              </label>
              <label>
                <span className={lbl}>{t.surname}</span>
                <input name="surname" required minLength={2} maxLength={60} autoComplete="family-name" className={field} aria-invalid={bad("surname")} />
              </label>
              <label>
                <span className={lbl}>{t.phone}</span>
                <input name="phone" type="tel" required autoComplete="tel" placeholder="+90 5xx xxx xx xx" className={field} aria-invalid={bad("phone")} />
              </label>
              <label>
                <span className={lbl}>{t.city}</span>
                <input name="city" required minLength={2} maxLength={60} autoComplete="address-level1" className={field} aria-invalid={bad("city")} />
              </label>
              <label className="sm:col-span-2">
                <span className={lbl}>{t.address}</span>
                <input name="address" required minLength={5} maxLength={250} autoComplete="street-address" className={field} aria-invalid={bad("address")} />
              </label>
              <label className="sm:col-span-2">
                <span className={lbl}>{t.tc}</span>
                <input name="identityNumber" inputMode="numeric" pattern="\d{11}" maxLength={11} className={field} aria-invalid={bad("identityNumber")} />
              </label>
            </div>
          </fieldset>

          <div className="space-y-3">
            <button disabled={busy || !enabled} className="w-full bg-invert px-5 py-4 font-label text-[14px] font-semibold uppercase tracking-[0.1em] text-invert-fg transition-opacity duration-150 hover:opacity-90 disabled:opacity-50">
              {d.subscribe.start}
            </button>
            <p className="font-ui text-[13px] leading-[1.55] text-muted">{enabled ? t.secure : d.subscribe.unavailable}</p>
            <p className="font-ui text-[13px] leading-[1.55] text-muted">{d.subscribe.afterTrial}</p>
            {err && (
              <p role="alert" className="font-ui text-[14px] text-accent">
                {err.text}{" "}
                {err.login && (
                  <>
                    <a href={withQuery(href(lang, "login"), { next: href(lang, "subscribe") })} className="font-semibold underline">{d.auth.login}</a>
                    {" · "}
                    <a href={withQuery(href(lang, "register"), { next: href(lang, "subscribe") })} className="font-semibold underline">{d.auth.register}</a>
                  </>
                )}
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
