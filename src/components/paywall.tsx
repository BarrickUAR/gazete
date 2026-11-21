"use client";
// Kilitli içerik: önbelleğe alınmış HTML yalnızca girişi (teaser) içerir.
// Devamı abonelik sunucuda doğrulandıktan sonra no-store bir uçtan gelir; HTML'e hiç girmez.
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href, withQuery } from "@/i18n/routes";
import type { RichDoc } from "@/lib/types";
import { RichText } from "./rich-text";

type State = { s: "loading" } | { s: "open"; body: RichDoc } | { s: "locked" };

export function Paywall({ postId, lang, path }: { postId: string; lang: Locale; path: string }) {
  const d = getDict(lang);
  const [st, setSt] = useState<State>({ s: "loading" });

  useEffect(() => {
    let alive = true;
    fetch(`/api/icerik/${encodeURIComponent(postId)}?lang=${lang}`, { cache: "no-store", credentials: "same-origin" })
      .then(async (r) => {
        if (!alive) return;
        if (r.ok) {
          const j = (await r.json()) as { body: RichDoc };
          setSt({ s: "open", body: j.body });
        } else setSt({ s: "locked" });
      })
      .catch(() => alive && setSt({ s: "locked" }));
    return () => {
      alive = false;
    };
  }, [postId, lang]);

  if (st.s === "open") return <RichText doc={st.body} className="premium-icerik mt-[1.15em]" />;

  return (
    <div className="premium-icerik relative mt-8">
      <div aria-hidden className="pointer-events-none absolute -top-24 inset-x-0 h-24 bg-linear-to-b from-transparent to-bg" />
      <section aria-live="polite" className="border border-line-2 bg-bg-2 p-7 sm:p-9">
        {st.s === "loading" ? (
          <p className="font-ui text-[14px] text-muted">{d.paywall.loading}</p>
        ) : (
          <>
            <p className="font-label text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">{d.common.premium}</p>
            <h2 className="balance mt-3 font-display text-[28px] font-medium leading-[1.15] text-head sm:text-[34px]">{d.paywall.title}</h2>
            <p className="mt-3 font-ui text-[15.5px] leading-[1.6] text-fg-3">{d.paywall.text}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={withQuery(href(lang, "subscribe"), { next: path })} className="bg-invert px-5 py-3 font-label text-[13px] font-semibold uppercase tracking-[0.1em] text-invert-fg transition-opacity duration-150 hover:opacity-90">
                {d.paywall.cta}
              </a>
              <a href={withQuery(href(lang, "login"), { next: path })} className="font-ui text-[14px] text-fg-2 underline decoration-line-2 underline-offset-4 hover:decoration-fg">
                {d.paywall.login}
              </a>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
