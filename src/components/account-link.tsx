"use client";
// Sayfalar önbellekten (ISR) gelir; oturum bilgisi tarayıcıda okunur ki HTML herkese aynı kalsın.
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { browserClient } from "@/lib/supabase/browser";

export function AccountLink({ lang, foreign = false, variant = "button" }: { lang: Locale; foreign?: boolean; variant?: "button" | "text" }) {
  const d = getDict(lang);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const sb = browserClient();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => data.subscription.unsubscribe();
  }, []);

  const to = signedIn ? href(lang, "account") : href(lang, "subscribe");
  const label = signedIn ? d.nav.account : d.nav.subscribe;

  if (variant === "text") return <a href={to} className="font-label text-[13px] font-semibold uppercase tracking-[0.1em] text-accent">{label}</a>;
  if (foreign)
    return (
      <a href={to} className="hidden bg-crimson px-3.5 py-2 font-ui text-[12.5px] font-semibold text-white transition-colors duration-150 hover:bg-[#a81f26] sm:inline-block">
        {label}
      </a>
    );
  return (
    <a
      href={to}
      className="hidden border border-line-2 px-3.5 py-1.5 font-label text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors duration-150 hover:border-invert hover:bg-invert hover:text-invert-fg sm:inline-block"
    >
      {label}
    </a>
  );
}
