import type { ReactNode } from "react";
import { Monogram, Wordmark } from "@/brand/logo";
import { localeMeta, locales, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href, type RouteKey } from "@/i18n/routes";
import type { Alternates } from "@/lib/site";
import type { Theme } from "@/lib/types";
import { AccountLink } from "./account-link";

type NavItem = { key: RouteKey; label: string };

function navItems(lang: Locale): NavItem[] {
  const d = getDict(lang).nav;
  return [
    { key: "news", label: d.news },
    { key: "columns", label: d.columns },
    { key: "reports", label: d.reports },
    { key: "foreign", label: d.foreign },
    { key: "archive", label: d.archive },
    { key: "about", label: d.about },
  ];
}

function LangSwitch({ lang, alternates, className = "" }: { lang: Locale; alternates: Alternates; className?: string }) {
  const d = getDict(lang);
  return (
    <ul aria-label={d.common.language} className={`flex items-center gap-0.5 font-label text-[12px] font-semibold uppercase tracking-[0.1em] ${className}`}>
      {locales.map((l) => {
        const to = alternates[l] ?? href(l);
        const cur = l === lang;
        return (
          <li key={l}>
            <a
              href={to}
              hrefLang={localeMeta[l].hreflang}
              lang={l}
              aria-current={cur ? "true" : undefined}
              title={alternates[l] ? localeMeta[l].label : `${localeMeta[l].label} · ${getDict(l).nav.home}`}
              className={`block px-2 py-1 transition-colors duration-150 ${cur ? "text-fg" : "text-muted hover:text-fg"}`}
            >
              {localeMeta[l].short}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function MobileMenu({ lang, alternates, active }: { lang: Locale; alternates: Alternates; active?: RouteKey }) {
  const d = getDict(lang);
  return (
    <details className="menu relative xl:hidden">
      <summary className="grid h-9 w-9 cursor-pointer place-items-center border border-line-2" aria-label={d.common.menu}>
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M3 6h14M3 10h14M3 14h14" />
        </svg>
      </summary>
      <div className="absolute end-0 top-11 z-30 w-[min(86vw,320px)] border border-line-2 bg-bg p-5 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
        <nav>
          <ul className="font-label text-[15px] font-semibold uppercase tracking-[0.08em]">
            <li>
              <a href={href(lang)} className="block border-b border-line py-3">{d.nav.home}</a>
            </li>
            {navItems(lang).map((n) => (
              <li key={n.key}>
                <a href={href(lang, n.key)} aria-current={active === n.key ? "page" : undefined} className={`block border-b border-line py-3 ${active === n.key ? "text-accent" : ""}`}>
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <a href={href(lang, "imprint")} className="block border-b border-line py-3">{d.nav.imprint}</a>
            </li>
          </ul>
        </nav>
        <div className="mt-4 flex items-center justify-between">
          <LangSwitch lang={lang} alternates={alternates} className="-ms-2" />
          <AccountLink lang={lang} variant="text" />
        </div>
      </div>
    </details>
  );
}

/* T2 — koyu, Bodoni italik yazı markası */
function DefaultHeader({ lang, alternates, active }: { lang: Locale; alternates: Alternates; active?: RouteKey }) {
  const d = getDict(lang);
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg text-fg">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-5 py-3 lg:px-8">
        <a href={href(lang)} className="flex items-baseline gap-3" aria-label={`${d.siteName} · ${d.nav.home}`}>
          <Wordmark />
        </a>
        <nav aria-label={d.common.menu} className="hidden xl:block">
          <ul className="flex items-center gap-6 whitespace-nowrap font-label text-[13px] font-medium uppercase tracking-[0.1em] text-fg-2">
            {navItems(lang).map((n) => (
              <li key={n.key}>
                <a
                  href={href(lang, n.key)}
                  aria-current={active === n.key ? "page" : undefined}
                  className={`transition-colors duration-150 hover:text-fg ${active === n.key ? "text-fg underline decoration-accent decoration-2 underline-offset-[7px]" : ""}`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <LangSwitch lang={lang} alternates={alternates} className="hidden sm:flex" />
          <AccountLink lang={lang} />
          <MobileMenu lang={lang} alternates={alternates} active={active} />
        </div>
      </div>
    </header>
  );
}

/* T8 — lacivert üst çubuk, kırmızı logo kutusu */
function ForeignHeader({ lang, alternates, active }: { lang: Locale; alternates: Alternates; active?: RouteKey }) {
  const d = getDict(lang);
  return (
    <header className="sticky top-0 z-20 bg-navy text-white [--fg:#fff] [--muted:rgb(255_255_255/0.6)] [--line-2:rgb(255_255_255/0.25)] [--line:rgb(255_255_255/0.15)]">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
        <a href={href(lang)} className="flex items-center gap-3" aria-label={`${d.siteName} · ${d.nav.home}`}>
          <span className="bg-crimson px-3 pb-1.5 pt-2 font-display text-[22px] leading-none text-white">{d.siteName}</span>
          <span className="hidden font-label text-[12px] font-semibold uppercase tracking-[0.12em] text-white/60 sm:inline">{d.foreign.title}</span>
        </a>
        <nav aria-label={d.common.menu} className="hidden xl:block">
          <ul className="flex items-center gap-6 whitespace-nowrap font-ui text-[13.5px] text-white/70">
            {navItems(lang).map((n) => (
              <li key={n.key}>
                <a href={href(lang, n.key)} aria-current={active === n.key ? "page" : undefined} className={`transition-colors duration-150 hover:text-white ${active === n.key ? "text-white" : ""}`}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <LangSwitch lang={lang} alternates={alternates} className="hidden sm:flex" />
          <AccountLink lang={lang} foreign />
          <div className="bg-navy text-white [--bg:var(--brand-navy)]">
            <MobileMenu lang={lang} alternates={alternates} active={active} />
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer({ lang, theme }: { lang: Locale; theme: Theme }) {
  const d = getDict(lang);
  const year = new Date().getFullYear();
  const cols: { title: string; items: { label: string; to: string }[] }[] = [
    {
      title: d.siteName,
      items: [
        { label: d.nav.news, to: href(lang, "news") },
        { label: d.nav.columns, to: href(lang, "columns") },
        { label: d.nav.reports, to: href(lang, "reports") },
        { label: d.nav.foreign, to: href(lang, "foreign") },
      ],
    },
    {
      title: d.nav.archive,
      items: [
        { label: d.nav.archive, to: href(lang, "archive") },
        { label: d.nav.about, to: href(lang, "about") },
        { label: d.nav.imprint, to: href(lang, "imprint") },
        { label: d.footer.rss, to: `${lang === "tr" ? "" : `/${lang}`}/rss.xml` },
      ],
    },
    {
      title: d.nav.subscribe,
      items: [
        { label: d.nav.subscribe, to: href(lang, "subscribe") },
        { label: d.nav.login, to: href(lang, "login") },
        { label: d.nav.account, to: href(lang, "account") },
      ],
    },
  ];
  const foreign = theme === "foreign";
  return (
    <footer className={foreign ? "bg-navy text-white/70" : "border-t border-line bg-bg text-muted"}>
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <span className={`inline-flex items-center gap-3 ${foreign ? "text-white" : "text-fg"}`}>
            <Monogram size={36} />
            <span className="font-display text-[26px] italic leading-none">{d.siteName}</span>
          </span>
          <p className="mt-4 max-w-[40ch] font-ui text-[14px] leading-[1.6]">{d.tagline}</p>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="lg:col-span-2">
            <p className={`font-label text-[12px] font-semibold uppercase tracking-[0.14em] ${foreign ? "text-white" : "text-fg"}`}>{c.title}</p>
            <ul className="mt-4 space-y-2.5 font-ui text-[14px]">
              {c.items.map((i) => (
                <li key={i.to}>
                  <a href={i.to} className={`transition-colors duration-150 ${foreign ? "hover:text-white" : "hover:text-fg"}`}>{i.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={`border-t ${foreign ? "border-white/15" : "border-line"}`}>
        <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-2 px-5 py-6 font-mono text-[11px] uppercase tracking-[0.12em] sm:flex-row lg:px-8">
          <span>© {year} {d.siteName}. {d.footer.rights}</span>
          <span>powered by DevPixel</span>
        </div>
      </div>
    </footer>
  );
}

export function Shell({
  lang,
  theme = "default",
  alternates,
  active,
  children,
}: {
  lang: Locale;
  theme?: Theme;
  alternates: Alternates;
  active?: RouteKey;
  children: ReactNode;
}) {
  const d = getDict(lang);
  return (
    <div className={`${theme === "foreign" ? "t-foreign" : "t-default"} flex min-h-screen flex-col bg-bg font-body text-fg`}>
      <a href="#icerik" className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-50 focus:bg-invert focus:px-4 focus:py-2 focus:text-invert-fg">
        {d.common.skip}
      </a>
      {theme === "foreign" ? <ForeignHeader lang={lang} alternates={alternates} active={active} /> : <DefaultHeader lang={lang} alternates={alternates} active={active} />}
      <main id="icerik" className="flex-1">
        {children}
      </main>
      <Footer lang={lang} theme={theme} />
    </div>
  );
}
