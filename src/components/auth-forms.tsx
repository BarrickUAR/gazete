"use client";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href, withQuery } from "@/i18n/routes";
import { browserClient } from "@/lib/supabase/browser";

const field = "w-full border border-line-2 bg-bg px-4 py-3 font-ui text-[15px] text-fg placeholder:text-muted focus:border-fg focus:outline-none";
const btn = "w-full bg-invert px-5 py-3.5 font-label text-[13px] font-semibold uppercase tracking-[0.1em] text-invert-fg transition-opacity duration-150 hover:opacity-90 disabled:opacity-50";
const lbl = "mb-1.5 block font-label text-[12px] font-semibold uppercase tracking-[0.12em] text-muted";

/** Yalnızca site içi göreli yollar (açık yönlendirme yok). */
export function safeNext(v: string | null | undefined, fallback: string) {
  return v && v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : fallback;
}

function callbackUrl(next: string) {
  return `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`;
}

export function LoginForm({ lang, next }: { lang: Locale; next?: string }) {
  const d = getDict(lang).auth;
  const sb = browserClient();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const to = safeNext(next, href(lang, "account"));

  if (!sb) return <p className="border border-line-2 p-5 font-ui text-[15px] text-fg-3">{d.unavailable}</p>;

  async function onPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setMsg(null);
    const { error } = await sb!.auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: d.error });
    window.location.assign(to);
  }

  async function onMagic(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.form!;
    const email = String(new FormData(form).get("email") ?? "");
    if (!form.querySelector<HTMLInputElement>("input[name=email]")!.reportValidity()) return;
    setBusy(true);
    const { error } = await sb!.auth.signInWithOtp({ email, options: { emailRedirectTo: callbackUrl(to), shouldCreateUser: false } });
    setBusy(false);
    setMsg(error ? { ok: false, text: d.error } : { ok: true, text: d.magicSent });
  }

  return (
    <form onSubmit={onPassword} className="space-y-4">
      <label className="block">
        <span className={lbl}>{d.email}</span>
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="block">
        <span className={lbl}>{d.password}</span>
        <input name="password" type="password" required minLength={8} autoComplete="current-password" className={field} />
      </label>
      <button className={btn} disabled={busy}>{d.login}</button>
      <button type="button" onClick={onMagic} disabled={busy} className="w-full border border-line-2 px-5 py-3 font-ui text-[14px] text-fg-2 hover:border-fg hover:text-fg">
        {d.magic}
      </button>
      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={`font-ui text-[14px] ${msg.ok ? "text-fg-2" : "text-accent"}`}>
          {msg.text}
        </p>
      )}
      <p className="pt-2 font-ui text-[14px] text-fg-3">
        {d.noAccount}{" "}
        <a href={withQuery(href(lang, "register"), { next: next })} className="font-semibold text-fg underline underline-offset-4">{d.register}</a>
      </p>
    </form>
  );
}

export function RegisterForm({ lang, next }: { lang: Locale; next?: string }) {
  const d = getDict(lang).auth;
  const sb = browserClient();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const to = safeNext(next, href(lang, "subscribe"));

  if (!sb) return <p className="border border-line-2 p-5 font-ui text-[15px] text-fg-3">{d.unavailable}</p>;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setMsg(null);
    const { data, error } = await sb!.auth.signUp({
      email: String(f.get("email")),
      password: String(f.get("password")),
      // display_name/locale kullanıcı verisidir; rol ASLA buradan gelmez (app_metadata yalnız sunucuda).
      options: { data: { display_name: String(f.get("name")).slice(0, 120), locale: lang }, emailRedirectTo: callbackUrl(to) },
    });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message.includes("Password") ? error.message : d.error });
    if (data.session) return window.location.assign(to);
    setMsg({ ok: true, text: d.registered });
  }

  if (msg?.ok) return <p role="status" className="border border-line-2 p-5 font-ui text-[15px] text-fg">{msg.text}</p>;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className={lbl}>{d.name}</span>
        <input name="name" required minLength={2} maxLength={120} autoComplete="name" className={field} />
      </label>
      <label className="block">
        <span className={lbl}>{d.email}</span>
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="block">
        <span className={lbl}>{d.password}</span>
        <input name="password" type="password" required minLength={8} autoComplete="new-password" className={field} />
      </label>
      <button className={btn} disabled={busy}>{d.register}</button>
      {msg && <p role="alert" className="font-ui text-[14px] text-accent">{msg.text}</p>}
      <p className="font-ui text-[12.5px] leading-[1.5] text-muted">{d.terms}</p>
      <p className="pt-1 font-ui text-[14px] text-fg-3">
        {d.haveAccount}{" "}
        <a href={withQuery(href(lang, "login"), { next: next })} className="font-semibold text-fg underline underline-offset-4">{d.login}</a>
      </p>
    </form>
  );
}

export function LogoutButton({ lang }: { lang: Locale }) {
  return (
    <button
      type="button"
      onClick={async () => {
        await browserClient()?.auth.signOut();
        window.location.assign(href(lang));
      }}
      className="border border-line-2 px-4 py-2.5 font-label text-[12px] font-semibold uppercase tracking-[0.1em] text-fg-2 hover:border-fg hover:text-fg"
    >
      {getDict(lang).nav.logout}
    </button>
  );
}
