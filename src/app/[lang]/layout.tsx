import type { Metadata, Viewport } from "next";
import {
  Bodoni_Moda,
  Fira_Sans,
  Fira_Sans_Condensed,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Arabic,
  IBM_Plex_Sans_Condensed,
  Libre_Caslon_Display,
  Libre_Caslon_Text,
  Noto_Naskh_Arabic,
} from "next/font/google";
import { isLocale, localeMeta, locales, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

// T2 (genel site) fontları önceden yüklenir; T8 (Dış Haberler) ve Arapça yalnızca kullanıldığında indirilir.
const bod = Bodoni_Moda({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"], axes: ["opsz"], variable: "--f-bod", display: "swap" });
const plex = IBM_Plex_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], variable: "--f-plex", display: "swap" });
const cond = IBM_Plex_Sans_Condensed({ subsets: ["latin", "latin-ext"], weight: ["500", "600"], variable: "--f-cond", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--f-mono", display: "swap", preload: false });
const lcd = Libre_Caslon_Display({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--f-lcd", display: "swap", preload: false });
const lct = Libre_Caslon_Text({ subsets: ["latin", "latin-ext"], weight: ["400", "700"], style: ["normal", "italic"], variable: "--f-lct", display: "swap", preload: false });
const ws = Fira_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], variable: "--f-ws", display: "swap", preload: false });
const fsc = Fira_Sans_Condensed({ subsets: ["latin", "latin-ext"], weight: ["500", "600"], variable: "--f-fsc", display: "swap", preload: false });
const plexar = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600"], variable: "--f-plexar", display: "swap", preload: false });
const naskh = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600"], variable: "--f-naskh", display: "swap", preload: false });

const fontVars = [bod, plex, cond, mono, lcd, lct, ws, fsc, plexar, naskh].map((f) => f.variable).join(" ");

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang: Locale = isLocale(raw) ? raw : "tr";
  const d = getDict(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${d.siteName} · ${d.tagline}`, template: `%s · ${d.siteName}` },
    description: d.tagline,
    applicationName: d.siteName,
    authors: [{ name: "Çetiner Çetin" }],
    openGraph: { siteName: d.siteName, locale: localeMeta[lang].ogLocale, type: "website" },
    twitter: { card: "summary_large_image" },
    icons: { icon: "/icon.svg" },
    alternates: { types: { "application/rss+xml": `${SITE_URL}${lang === "tr" ? "" : `/${lang}`}/rss.xml` } },
  };
}

export const viewport: Viewport = { themeColor: "#0c0c0b", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang: raw } = await params;
  // Geçersiz dil öneki: düzen Türkçe çizilir, alt sayfa notFound() ile 404 döner.
  const lang: Locale = isLocale(raw) ? raw : "tr";
  return (
    <html lang={lang} dir={localeMeta[lang].dir} className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
