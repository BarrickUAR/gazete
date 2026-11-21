import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { RouteKey } from "@/i18n/routes";
import { Shell } from "@/components/shell";
import { Container } from "@/components/ui";
import type { Alternates } from "@/lib/site";

/** Giriş / kayıt gibi dar form sayfaları (T2). */
export function AuthFrame({ lang, alternates, active, kicker, title, intro, children }: { lang: Locale; alternates: Alternates; active?: RouteKey; kicker: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <Shell lang={lang} alternates={alternates} active={active}>
      <Container className="grid gap-12 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-5">
          <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-accent">■ {kicker}</p>
          <h1 className="mt-5 font-display text-[48px] font-medium italic leading-[0.95] tracking-[-0.02em] text-head sm:text-[68px]">{title}</h1>
          {intro && <p className="pretty mt-6 max-w-[40ch] text-[17px] leading-[1.6] text-fg-3">{intro}</p>}
        </div>
        <div className="lg:col-span-5 lg:col-start-8">{children}</div>
      </Container>
    </Shell>
  );
}
