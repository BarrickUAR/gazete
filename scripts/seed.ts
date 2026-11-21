// Başlangıç verisini (src/lib/seed) Supabase'e yükler. İdempotent: upsert.
// Çalıştırma: npm run seed   (.env.local'daki NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY ile)
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) throw new Error("NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli");

async function main() {
  const { author, categories, tags, posts, premiumRest, settings } = await import("../src/lib/seed");
  const { plainText } = await import("../src/lib/data/localize");
  const db = createClient(URL!, KEY!, { auth: { persistSession: false } });

  const up = async (table: string, rows: object[], onConflict: string) => {
    if (!rows.length) return;
    const { error } = await db.from(table).upsert(rows, { onConflict });
    if (error) throw new Error(`${table}: ${error.message}`);
    console.log(`✓ ${table} (${rows.length})`);
  };

  await up("authors", [{ id: author.id, name: author.name, role: author.role, avatar: author.avatar }], "id");
  await up("categories", categories.map((c) => ({ id: c.id, theme: c.theme, sort: c.sort })), "id");
  await up(
    "category_translations",
    categories.flatMap((c) => (["tr", "en", "ar"] as const).map((l) => ({ category_id: c.id, locale: l, slug: c.slug[l], name: c.name[l] }))),
    "category_id,locale",
  );
  await up("tags", tags.map((t) => ({ id: t.id, slug: t.slug, name: t.name })), "id");

  const media = new Map<string, object>();
  for (const p of posts) if (p.cover) media.set(p.cover.id, { id: p.cover.id, url: p.cover.url, alt: p.cover.alt, caption: p.cover.caption, credit: p.cover.credit, width: p.cover.width, height: p.cover.height });
  await up("media", [...media.values()], "id");

  await up(
    "posts",
    posts.map((p) => ({
      id: p.id,
      type: p.type,
      status: p.status,
      category_id: p.category.id,
      author_id: p.author.id,
      cover_id: p.cover?.id ?? null,
      is_premium: p.isPremium,
      published_at: p.publishedAt,
      read_min: p.readMin,
      source_url: p.sourceUrl ?? null,
      report_pdf: p.reportPdf ?? null,
      created_at: p.publishedAt,
    })),
    "id",
  );
  await up(
    "post_translations",
    posts.flatMap((p) =>
      Object.values(p.translations).map((t) => ({
        post_id: p.id,
        locale: t!.locale,
        slug: t!.slug,
        title: t!.title,
        dek: t!.dek,
        kicker: t!.kicker ?? null,
        place: t!.place ?? null,
        body: t!.body,
        body_text: plainText(t!.body),
        seo_title: t!.seoTitle ?? null,
        seo_desc: t!.seoDesc ?? null,
      })),
    ),
    "post_id,locale",
  );
  await up(
    "post_premium",
    posts.filter((p) => p.isPremium).flatMap((p) => Object.keys(p.translations).map((l) => ({ post_id: p.id, locale: l, body: premiumRest(p, l as "tr") }))),
    "post_id,locale",
  );
  await up("post_tags", posts.flatMap((p) => p.tags.map((t) => ({ post_id: p.id, tag_id: t.id }))), "post_id,tag_id");
  await up("site_settings", Object.entries(settings).map(([key, value]) => ({ key, value })), "key");
  console.log("Tamam.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
