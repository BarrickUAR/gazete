import type { Metadata } from "next";
import { localeMeta, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { abs, metaAlternates, postAlternates, SITE_URL, type Alternates } from "./site";
import { author } from "./seed";
import type { LocalizedPost } from "./types";

export const AUTHOR_SAMEAS = ["https://www.haberturk.com/yazarlar/cetiner-cetin", "https://www.haberturk.com/htyazar/cetiner-cetin"];

export function pageMeta(lang: Locale, o: { title: string; description?: string; alternates: Alternates; image?: string | null; noindex?: boolean }): Metadata {
  const d = getDict(lang);
  const alt = metaAlternates(lang, o.alternates);
  const desc = o.description ?? d.tagline;
  return {
    title: o.title,
    description: desc,
    alternates: alt,
    robots: o.noindex ? { index: false, follow: true } : undefined,
    openGraph: { title: o.title, description: desc, url: alt.canonical, locale: localeMeta[lang].ogLocale, siteName: d.siteName, type: "website", images: o.image ? [abs(o.image)] : undefined },
    twitter: { card: "summary_large_image", title: o.title, description: desc, images: o.image ? [abs(o.image)] : undefined },
  };
}

export function postMeta(lang: Locale, p: LocalizedPost): Metadata {
  const title = p.t.seoTitle || p.t.title;
  const desc = p.t.seoDesc || p.t.dek;
  const alt = metaAlternates(lang, postAlternates(p));
  const image = p.cover ? abs(p.cover.url) : `${SITE_URL}/icon.svg`;
  return {
    title,
    description: desc,
    alternates: alt,
    authors: [{ name: p.author.name, url: abs(href(lang, "about")) }],
    keywords: p.tags.map((t) => t.name[lang]),
    openGraph: {
      type: "article",
      title,
      description: desc,
      url: alt.canonical,
      locale: localeMeta[lang].ogLocale,
      publishedTime: p.publishedAt,
      modifiedTime: p.updatedAt,
      authors: [p.author.name],
      section: p.category.name[lang],
      tags: p.tags.map((t) => t.name[lang]),
      images: [{ url: image, width: p.cover?.width ?? undefined, height: p.cover?.height ?? undefined, alt: p.cover?.alt ?? title }],
    },
    twitter: { card: "summary_large_image", title, description: desc, images: [image] },
    other: { "article:section": p.category.name[lang] },
  };
}

export function personLd(lang: Locale) {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Çetiner Çetin",
    url: abs(href(lang, "about")),
    image: abs("/img/portrait.jpg"),
    jobTitle: author.role[lang],
    worksFor: { "@type": "NewsMediaOrganization", name: "Habertürk", url: "https://www.haberturk.com" },
    sameAs: AUTHOR_SAMEAS,
  };
}

export function orgLd(lang: Locale) {
  const d = getDict(lang);
  return {
    "@type": "NewsMediaOrganization",
    "@id": `${SITE_URL}/#org`,
    name: d.siteName,
    url: abs(href(lang)),
    logo: { "@type": "ImageObject", url: abs("/icon.svg"), width: 64, height: 64 },
    masthead: abs(href(lang, "imprint")),
    founder: { "@id": `${SITE_URL}/#person` },
  };
}

export function articleLd(lang: Locale, p: LocalizedPost, url: string, crumbs: { label: string; to: string }[]) {
  const type = p.type === "kose" ? "OpinionNewsArticle" : p.type === "rapor" ? "Report" : "NewsArticle";
  const article: Record<string, unknown> = {
    "@type": type,
    "@id": `${url}#article`,
    headline: p.t.title,
    description: p.t.dek,
    inLanguage: localeMeta[lang].hreflang,
    datePublished: p.publishedAt,
    dateModified: p.updatedAt,
    mainEntityOfPage: url,
    url,
    image: p.cover ? [abs(p.cover.url)] : undefined,
    articleSection: p.category.name[lang],
    keywords: p.tags.map((t) => t.name[lang]).join(", ") || undefined,
    author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: p.author.name, url: abs(href(lang, "about")) },
    publisher: { "@id": `${SITE_URL}/#org` },
    isBasedOn: p.sourceUrl ?? undefined,
  };
  if (p.isPremium) {
    article.isAccessibleForFree = false;
    article.hasPart = { "@type": "WebPageElement", isAccessibleForFree: false, cssSelector: ".premium-icerik" };
  }
  return {
    "@context": "https://schema.org",
    "@graph": [
      article,
      orgLd(lang),
      personLd(lang),
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: abs(c.to) })),
      },
    ],
  };
}
