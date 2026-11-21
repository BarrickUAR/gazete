"use client";
import { useActionState } from "react";
import { sendContact, subscribeNewsletter, type FormState } from "@/app/actions/public";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";

const field = "w-full border border-line-2 bg-bg px-4 py-3 font-ui text-[15px] text-fg placeholder:text-muted focus:border-fg focus:outline-none";
const btn = "bg-invert px-5 py-3 font-label text-[13px] font-semibold uppercase tracking-[0.1em] text-invert-fg transition-opacity duration-150 hover:opacity-90 disabled:opacity-50";

function Honeypot() {
  return (
    <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
      <label>
        Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

function errorText(lang: Locale, st: FormState, generic: string) {
  const d = getDict(lang);
  if (!st || st.ok) return null;
  if (st.error === "unavailable") return lang === "tr" ? "Bu özellik henüz etkin değil." : lang === "en" ? "This feature is not enabled yet." : "هذه الميزة غير مفعّلة بعد.";
  if (st.error === "rate") return lang === "tr" ? "Çok fazla deneme. Biraz sonra tekrar deneyin." : lang === "en" ? "Too many attempts. Please try again later." : "محاولات كثيرة. حاول لاحقًا.";
  void d;
  return generic;
}

export function NewsletterForm({ lang }: { lang: Locale }) {
  const d = getDict(lang).newsletter;
  const [st, act, pending] = useActionState(subscribeNewsletter, null);
  if (st?.ok) return <p role="status" className="border border-line-2 px-4 py-3 font-ui text-[15px] text-fg">{d.ok}</p>;
  return (
    <form action={act} className="relative">
      <Honeypot />
      <input type="hidden" name="locale" value={lang} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="nl-email">{d.placeholder}</label>
        <input id="nl-email" name="email" type="email" required autoComplete="email" placeholder={d.placeholder} className={field} aria-invalid={st?.fields?.includes("email") || undefined} />
        <button className={`${btn} shrink-0`} disabled={pending}>{d.button}</button>
      </div>
      {errorText(lang, st, d.error) && <p role="alert" className="mt-2 font-ui text-[13px] text-accent">{errorText(lang, st, d.error)}</p>}
    </form>
  );
}

export function ContactForm({ lang }: { lang: Locale }) {
  const d = getDict(lang).contact;
  const [st, act, pending] = useActionState(sendContact, null);
  if (st?.ok) return <p role="status" className="border border-line-2 px-5 py-4 font-ui text-[15px] text-fg">{d.sent}</p>;
  const bad = (f: string) => st?.fields?.includes(f) || undefined;
  return (
    <form action={act} className="relative grid gap-4 sm:grid-cols-2">
      <Honeypot />
      <label className="sm:col-span-2">
        <span className="mb-1.5 block font-label text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{d.kind}</span>
        <select name="kind" defaultValue="ihbar" className={field}>
          {Object.entries(d.kinds).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="mb-1.5 block font-label text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{d.name}</span>
        <input name="name" required minLength={2} maxLength={120} autoComplete="name" className={field} aria-invalid={bad("name")} />
      </label>
      <label>
        <span className="mb-1.5 block font-label text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{d.email}</span>
        <input name="email" type="email" required autoComplete="email" className={field} aria-invalid={bad("email")} />
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1.5 block font-label text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{d.message}</span>
        <textarea name="message" required minLength={10} maxLength={5000} rows={6} className={field} aria-invalid={bad("message")} />
      </label>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button className={btn} disabled={pending}>{d.send}</button>
        {errorText(lang, st, d.error) && <p role="alert" className="font-ui text-[13px] text-accent">{errorText(lang, st, d.error)}</p>}
      </div>
    </form>
  );
}
