import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import type { LocalizedPost, Post, RichDoc, RichNode } from "../types";

export function localize(post: Post, lang: Locale): LocalizedPost | null {
  const t = post.translations[lang];
  if (!t) return null;
  const available = locales.filter((l) => post.translations[l]);
  const alternates: LocalizedPost["alternates"] = {};
  for (const l of available) alternates[l] = post.translations[l]!.slug;
  const { translations: _drop, ...rest } = post;
  void _drop;
  return { ...rest, t, available, alternates };
}

export function localizeAll(posts: Post[], lang: Locale) {
  return posts.map((p) => localize(p, lang)).filter((p): p is LocalizedPost => p !== null);
}

/** Zengin metinden düz metin (arama, okuma süresi, meta açıklama için). */
export function plainText(doc: RichDoc | RichNode | undefined | null): string {
  if (!doc) return "";
  const walk = (n: RichNode): string => (n.text ?? "") + (n.content ? n.content.map(walk).join(n.type === "doc" ? "\n" : " ") : "");
  return walk(doc as RichNode).replace(/\s+/g, " ").trim();
}

export function readMinutes(...texts: string[]) {
  const words = texts.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
