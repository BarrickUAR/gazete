// Herkese açık veri cephesi. Supabase yapılandırıldıysa veritabanı, değilse seed verisi.
// Sayfalar ISR ile önbelleğe alınır (her sayfada `revalidate`), yayın/güncellemede revalidatePath ile tazelenir.
import { cache } from "react";
import type { Locale } from "@/i18n/config";
import { hasSupabase } from "../supabase/clients";
import type { LocalizedPost, PostType } from "../types";
import { dbRepo } from "./db-repo";
import { localize, localizeAll } from "./localize";
import type { ListQuery, Repo } from "./repo";
import { seedRepo } from "./seed-repo";

export const repo = (): Repo => (hasSupabase() ? dbRepo : seedRepo);

export const listPosts = cache(async (lang: Locale, q: ListQuery = {}) => localizeAll(await repo().list(lang, q), lang));

export const getPost = cache(async (lang: Locale, slug: string, type?: PostType | PostType[]): Promise<LocalizedPost | null> => {
  const p = await repo().bySlug(lang, decodeURIComponent(slug));
  if (!p) return null;
  if (type && !(Array.isArray(type) ? type : [type]).includes(p.type)) return null;
  return localize(p, lang);
});

export const getCategories = cache(async () => repo().categories());
export const getTags = cache(async () => repo().tags());
export const getSettings = cache(async () => repo().settings());
export const getArchive = cache(async (lang: Locale) => repo().archive(lang));

export async function getCategoryBySlug(lang: Locale, slug: string) {
  const s = decodeURIComponent(slug);
  return (await getCategories()).find((c) => c.slug[lang] === s) ?? null;
}

export async function getTagBySlug(slug: string) {
  return (await getTags()).find((t) => t.slug === decodeURIComponent(slug)) ?? null;
}

export async function getForeignCategory() {
  return (await getCategories()).find((c) => c.theme === "foreign") ?? null;
}

export async function searchPosts(lang: Locale, q: Parameters<Repo["search"]>[1]) {
  const r = await repo().search(lang, q);
  return { items: localizeAll(r.items, lang), total: r.total };
}

export async function getRelated(lang: Locale, post: LocalizedPost, n = 4) {
  const tag = post.tags[0];
  const byTag = tag ? await listPosts(lang, { tagId: tag.id, excludeIds: [post.id], limit: n }) : [];
  if (byTag.length >= n) return byTag;
  const more = await listPosts(lang, { categoryId: post.category.id, excludeIds: [post.id, ...byTag.map((x) => x.id)], limit: n - byTag.length });
  return [...byTag, ...more];
}

export async function getHome(lang: Locale) {
  const [latest, columns, foreign, reports, news] = await Promise.all([
    listPosts(lang, { limit: 12 }),
    listPosts(lang, { type: "kose", limit: 6 }),
    listPosts(lang, { theme: "foreign", limit: 6 }),
    listPosts(lang, { type: "rapor", limit: 3 }),
    listPosts(lang, { type: "haber", limit: 6 }),
  ]);
  return { latest, columns, foreign, reports, news };
}
