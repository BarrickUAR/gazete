import type { Locale } from "@/i18n/config";
import { anonClient, serviceClient } from "../supabase/clients";
import { settings as seedSettings } from "../seed";
import type { Category, Post, PostType, RichDoc, SiteSettings, Tag, Translation } from "../types";
import type { ListQuery, Repo } from "./repo";

/* eslint-disable @typescript-eslint/no-explicit-any */

const CAT = "id,theme,sort,category_translations(locale,slug,name)";
const BASE = `id,type,status,is_premium,published_at,publish_at,updated_at,read_min,source_url,report_pdf,
  author:authors(id,name,role,avatar),
  cover:media(id,url,alt,caption,credit,width,height),
  post_tags(tag:tags(id,slug,name))`;
const TX_LIST = "locale,slug,title,dek,kicker,place,seo_title,seo_desc";
const TX_FULL = "locale,slug,title,dek,kicker,place,body,seo_title,seo_desc";

const searchConfig: Record<Locale, string> = { tr: "turkish", en: "english", ar: "simple" };

export function mapCategory(r: any): Category {
  const slug: any = {};
  const name: any = {};
  for (const t of r.category_translations ?? []) {
    slug[t.locale] = t.slug;
    name[t.locale] = t.name;
  }
  return { id: r.id, theme: r.theme, sort: r.sort, slug, name };
}

export function mapPost(r: any): Post {
  const translations: Post["translations"] = {};
  for (const t of r.post_translations ?? []) {
    const tx: Translation = {
      locale: t.locale,
      slug: t.slug,
      title: t.title,
      dek: t.dek ?? "",
      kicker: t.kicker,
      place: t.place,
      body: (t.body as RichDoc) ?? { type: "doc", content: [] },
      seoTitle: t.seo_title,
      seoDesc: t.seo_desc,
    };
    translations[t.locale as Locale] = tx;
  }
  return {
    id: r.id,
    type: r.type,
    status: r.status,
    category: mapCategory(r.category),
    author: { id: r.author?.id ?? "", name: r.author?.name ?? "", role: r.author?.role ?? {}, avatar: r.author?.avatar ?? "/img/avatar.jpg" },
    tags: (r.post_tags ?? []).map((x: any) => x.tag).filter(Boolean) as Tag[],
    cover: r.cover ?? null,
    isPremium: r.is_premium,
    publishedAt: r.published_at ?? r.publish_at ?? r.updated_at,
    updatedAt: r.updated_at,
    readMin: r.read_min,
    sourceUrl: r.source_url,
    reportPdf: r.report_pdf,
    translations,
  };
}

function visibleFilter<T extends { in: any; lte: any }>(q: T): T {
  return q.in("status", ["published", "scheduled"]).lte("published_at", new Date().toISOString());
}

export const dbRepo: Repo = {
  async list(lang, q: ListQuery) {
    const db = anonClient();
    const catSel = q.theme ? `category:categories!inner(${CAT})` : `category:categories(${CAT})`;
    const tagSel = q.tagId ? ",tagf:post_tags!inner(tag_id)" : "";
    let query: any = db
      .from("posts")
      .select(`${BASE},${catSel},post_translations!inner(${TX_LIST})${tagSel}`)
      .eq("post_translations.locale", lang);
    query = visibleFilter(query);
    if (q.type) query = Array.isArray(q.type) ? query.in("type", q.type) : query.eq("type", q.type);
    if (q.categoryId) query = query.eq("category_id", q.categoryId);
    if (q.theme) query = query.eq("category.theme", q.theme);
    if (q.tagId) query = query.eq("tagf.tag_id", q.tagId);
    if (q.before) query = query.lt("published_at", q.before);
    if (q.from) query = query.gte("published_at", q.from);
    if (q.to) query = query.lt("published_at", q.to);
    if (q.excludeIds?.length) query = query.not("id", "in", `(${q.excludeIds.map((x) => `"${x}"`).join(",")})`);
    const { data, error } = await query.order("published_at", { ascending: false }).limit(q.limit ?? 20);
    if (error) throw error;
    return (data ?? []).map(mapPost);
  },

  async bySlug(lang, slug) {
    const db = anonClient();
    const { data: hit, error } = await db.from("post_translations").select("post_id").eq("locale", lang).eq("slug", slug).maybeSingle();
    if (error) throw error;
    if (!hit) return null;
    return this.byId(hit.post_id);
  },

  async byId(id) {
    const db = anonClient();
    let query: any = db.from("posts").select(`${BASE},category:categories(${CAT}),post_translations(${TX_FULL})`).eq("id", id);
    query = visibleFilter(query);
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return data ? mapPost(data) : null;
  },

  async categories() {
    const { data, error } = await anonClient().from("categories").select(CAT).order("sort");
    if (error) throw error;
    return (data ?? []).map(mapCategory);
  },

  async tags() {
    const { data, error } = await anonClient().from("tags").select("id,slug,name").order("slug");
    if (error) throw error;
    return (data ?? []) as Tag[];
  },

  async archive(lang) {
    const { data, error } = await anonClient().rpc("archive_buckets", { p_locale: lang });
    if (error) throw error;
    return ((data ?? []) as any[]).map((r) => ({ year: r.year, month: r.month, count: Number(r.count) }));
  },

  async search(lang, q) {
    const db = anonClient();
    const size = q.pageSize ?? 20;
    const page = Math.max(1, q.page ?? 1);
    let query: any = db
      .from("posts")
      .select(`${BASE},category:categories(${CAT}),post_translations!inner(${TX_LIST})`, { count: "exact" })
      .eq("post_translations.locale", lang);
    query = visibleFilter(query);
    if (q.q.trim()) query = query.textSearch("post_translations.search", q.q.trim(), { type: "websearch", config: searchConfig[lang] });
    if (q.type) query = query.eq("type", q.type);
    if (q.categoryId) query = query.eq("category_id", q.categoryId);
    const { data, error, count } = await query.order("published_at", { ascending: false }).range((page - 1) * size, page * size - 1);
    if (error) throw error;
    return { items: (data ?? []).map(mapPost), total: count ?? 0 };
  },

  async settings() {
    const { data, error } = await anonClient().from("site_settings").select("key,value");
    if (error) throw error;
    const out: SiteSettings = { ...seedSettings };
    for (const r of data ?? []) (out as any)[r.key] = r.value;
    return out;
  },

  async premiumBody(postId, lang) {
    const { data, error } = await serviceClient().from("post_premium").select("body").eq("post_id", postId).eq("locale", lang).maybeSingle();
    if (error) throw error;
    return (data?.body as RichDoc) ?? null;
  },

  async allPublished() {
    let query: any = anonClient().from("posts").select("id,type,updated_at,published_at,category:categories(theme),post_translations(locale,slug)");
    query = visibleFilter(query);
    const { data, error } = await query.order("published_at", { ascending: false }).limit(50000);
    if (error) throw error;
    return ((data ?? []) as any[]).map((r) => ({
      id: r.id,
      type: r.type as PostType,
      updatedAt: r.updated_at,
      publishedAt: r.published_at,
      theme: r.category?.theme ?? "default",
      slugs: Object.fromEntries((r.post_translations ?? []).map((t: any) => [t.locale, t.slug])),
    }));
  },
};
