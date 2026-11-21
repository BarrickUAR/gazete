// Yönetim paneli okumaları. Oturumlu istemci kullanılır: RLS rolü uygular (yazar yalnız kendi yazılarını görür).
import type { Locale } from "@/i18n/config";
import { sessionClient, serviceClient } from "../supabase/clients";
import type { PostStatus, PostType, RichDoc } from "../types";

/* eslint-disable @typescript-eslint/no-explicit-any */

export type AdminPostRow = {
  id: string;
  type: PostType;
  status: PostStatus;
  is_premium: boolean;
  publish_at: string | null;
  published_at: string | null;
  updated_at: string;
  review_note: string | null;
  created_by: string | null;
  category: { id: string; theme: string } | null;
  post_translations: { locale: Locale; title: string; slug: string }[];
};

const ROW = "id,type,status,is_premium,publish_at,published_at,updated_at,review_note,created_by,category:categories(id,theme),post_translations(locale,title,slug)";

export async function statusCounts() {
  const sb = await sessionClient();
  const out: Record<PostStatus, number> = { draft: 0, review: 0, scheduled: 0, published: 0, archived: 0 };
  await Promise.all(
    (Object.keys(out) as PostStatus[]).map(async (s) => {
      const { count } = await sb.from("posts").select("id", { count: "exact", head: true }).eq("status", s);
      out[s] = count ?? 0;
    }),
  );
  return out;
}

export async function adminPosts(o: { status?: PostStatus; type?: PostType; q?: string; page?: number; size?: number; ids?: string[] } = {}) {
  const sb = await sessionClient();
  const size = o.size ?? 30;
  const page = Math.max(1, o.page ?? 1);
  let q: any = sb.from("posts").select(ROW, { count: "exact" });
  if (o.status) q = q.eq("status", o.status);
  if (o.type) q = q.eq("type", o.type);
  if (o.ids) q = q.in("id", o.ids.length ? o.ids : ["-"]);
  const { data, count, error } = await q.order("updated_at", { ascending: false }).range((page - 1) * size, page * size - 1);
  if (error) throw error;
  return { rows: (data ?? []) as AdminPostRow[], total: count ?? 0 };
}

/** Başlıkta arama (tüm diller) → yazı id'leri. */
export async function searchPostIds(q: string) {
  const sb = await sessionClient();
  const { data } = await sb.from("post_translations").select("post_id").ilike("title", `%${q.replace(/[%_]/g, "")}%`).limit(200);
  return [...new Set((data ?? []).map((r) => r.post_id as string))];
}

export type AdminTx = {
  locale: Locale;
  slug: string;
  title: string;
  dek: string;
  kicker: string | null;
  place: string | null;
  body: RichDoc;
  premium: RichDoc | null;
  seo_title: string | null;
  seo_desc: string | null;
};

export type AdminPost = {
  id: string;
  type: PostType;
  status: PostStatus;
  category_id: string;
  author_id: string;
  cover_id: string | null;
  cover: { id: string; url: string; alt: string } | null;
  is_premium: boolean;
  publish_at: string | null;
  published_at: string | null;
  source_url: string | null;
  report_pdf: string | null;
  review_note: string | null;
  created_by: string | null;
  updated_at: string;
  tagIds: string[];
  tx: Partial<Record<Locale, AdminTx>>;
};

export async function adminPost(id: string): Promise<AdminPost | null> {
  const sb = await sessionClient();
  const { data, error } = await sb
    .from("posts")
    .select(
      "id,type,status,category_id,author_id,cover_id,is_premium,publish_at,published_at,source_url,report_pdf,review_note,created_by,updated_at,cover:media(id,url,alt),post_tags(tag_id),post_translations(locale,slug,title,dek,kicker,place,body,seo_title,seo_desc),post_premium(locale,body)",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const r = data as any;
  const prem = new Map<string, RichDoc>((r.post_premium ?? []).map((p: any) => [p.locale, p.body]));
  const tx: AdminPost["tx"] = {};
  for (const t of r.post_translations ?? []) tx[t.locale as Locale] = { ...t, premium: prem.get(t.locale) ?? null };
  return { ...r, cover: r.cover ?? null, tagIds: (r.post_tags ?? []).map((x: any) => x.tag_id), tx };
}

export async function revisions(postId: string) {
  const { data } = await serviceClient().from("revisions").select("id,created_at,created_by,snapshot").eq("post_id", postId).order("created_at", { ascending: false }).limit(20);
  return (data ?? []) as { id: number; created_at: string; created_by: string | null; snapshot: any }[];
}

export async function refData() {
  const sb = await sessionClient();
  const [cats, tags, authors] = await Promise.all([
    sb.from("categories").select("id,theme,sort,category_translations(locale,name)").order("sort"),
    sb.from("tags").select("id,slug,name").order("slug"),
    sb.from("authors").select("id,name"),
  ]);
  return {
    categories: ((cats.data ?? []) as any[]).map((c) => ({ id: c.id as string, theme: c.theme as string, name: (c.category_translations.find((t: any) => t.locale === "tr")?.name ?? c.id) as string })),
    tags: (tags.data ?? []) as { id: string; slug: string; name: Record<Locale, string> }[],
    authors: (authors.data ?? []) as { id: string; name: string }[],
  };
}

export async function mediaList(limit = 60) {
  const sb = await sessionClient();
  const { data } = await sb.from("media").select("id,url,alt,caption,credit,width,height,created_at").order("created_at", { ascending: false }).limit(limit);
  return (data ?? []) as { id: string; url: string; alt: string; caption: string | null; credit: string | null; width: number | null; height: number | null; created_at: string }[];
}

export const trTitle = (r: { post_translations: { locale: Locale; title: string }[] }) =>
  r.post_translations.find((t) => t.locale === "tr")?.title ?? r.post_translations[0]?.title ?? "(başlıksız)";
