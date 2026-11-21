"use server";
// Yazı kaydetme ve yayın akışı. Yazmalar oturumlu istemciyle yapılır: RLS + guard_publish tetikleyicisi rolü
// veritabanında da uygular (yazar yayına alamaz). Sürüm ve denetim kayıtları sunucu anahtarıyla yazılır.
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { locales, type Locale } from "@/i18n/config";
import { assertStaff, audit, can } from "@/lib/admin/auth";
import { plainText, readMinutes } from "@/lib/data/localize";
import { slugify } from "@/lib/slug";
import { CONTENT_TAG, serviceClient, sessionClient } from "@/lib/supabase/clients";
import type { PostStatus, RichDoc } from "@/lib/types";

const Doc = z
  .object({ type: z.literal("doc"), content: z.array(z.any()).max(2000) })
  .refine((d) => JSON.stringify(d).length < 600_000, "Gövde çok büyük");

const Tx = z.object({
  slug: z.string().trim().max(160).default(""),
  title: z.string().trim().min(1, "Başlık gerekli").max(240),
  dek: z.string().trim().max(600).default(""),
  kicker: z.string().trim().max(80).nullish(),
  place: z.string().trim().max(80).nullish(),
  body: Doc,
  premium: Doc.nullish(),
  seoTitle: z.string().trim().max(120).nullish(),
  seoDesc: z.string().trim().max(300).nullish(),
});

const url = z.union([z.literal(""), z.null(), z.string().trim().url().max(500).refine((u) => /^https?:\/\//.test(u), "Geçersiz bağlantı")]);

const Payload = z.object({
  id: z.string().max(64).regex(/^[\w-]+$/).optional(),
  type: z.enum(["haber", "kose", "rapor"]),
  categoryId: z.string().min(1).max(64),
  tagIds: z.array(z.string().max(64)).max(20).default([]),
  coverId: z.string().max(64).nullable().default(null),
  isPremium: z.boolean(),
  sourceUrl: url.default(""),
  reportPdf: url.default(""),
  publishAt: z.string().datetime({ offset: true }).nullable().default(null),
  note: z.string().trim().max(1000).default(""),
  translations: z.object({ tr: Tx.optional(), en: Tx.optional(), ar: Tx.optional() }),
});

const Intent = z.enum(["save", "review", "publish", "schedule", "return", "archive", "unpublish", "delete"]);

export type SaveResult = { ok: true; id: string; status: PostStatus; message: string } | { ok: false; error: string };

const PUBLIC: PostStatus[] = ["published", "scheduled"];

function revalidateSite() {
  // Tüm dil düzenleri altındaki ISR sayfaları (liste, detay, arşiv, anasayfa) tazelenir.
  updateTag(CONTENT_TAG);
  revalidatePath("/[lang]", "layout");
}

export async function savePost(raw: string, intentRaw: string): Promise<SaveResult> {
  let ctx;
  try {
    ctx = await assertStaff("author");
  } catch {
    return { ok: false, error: "Oturum süreniz dolmuş ya da yetkiniz yok. Yeniden giriş yapın." };
  }
  const { user, role } = ctx;
  const editor = can(role, "editor");

  const intent = Intent.safeParse(intentRaw);
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { ok: false, error: "Geçersiz veri" };
  }
  const parsed = Payload.safeParse(json);
  if (!parsed.success || !intent.success) {
    const i = parsed.success ? null : parsed.error.issues[0];
    return { ok: false, error: i ? `${i.path.join(".")}: ${i.message}` : "Geçersiz işlem" };
  }
  const p = parsed.data;
  const it = intent.data;
  if (!p.translations.tr) return { ok: false, error: "Türkçe başlık ve metin zorunludur." };
  if (["publish", "schedule", "return", "archive", "unpublish", "delete"].includes(it) && !editor) return { ok: false, error: "Bu işlem için editör yetkisi gerekir." };

  const sb = await sessionClient();
  const now = new Date();

  // Mevcut kayıt (RLS: yazar yalnız kendi yazısını görür)
  type Cur = { status: PostStatus; published_at: string | null; created_by: string | null };
  let current: Cur | null = null;
  if (p.id) {
    const { data } = await sb.from("posts").select("status,published_at,created_by").eq("id", p.id).maybeSingle();
    if (!data) return { ok: false, error: "Yazı bulunamadı ya da erişiminiz yok." };
    current = data as Cur;
    if (!editor && !["draft", "review"].includes(current.status)) return { ok: false, error: "Yayındaki yazıyı yalnızca editör değiştirebilir." };
  }

  if (it === "delete") {
    if (!p.id) return { ok: false, error: "Silinecek yazı yok." };
    const { error } = await sb.from("posts").delete().eq("id", p.id);
    if (error) return { ok: false, error: error.message };
    await audit(user.id, "post.delete", "posts", p.id);
    if (current && PUBLIC.includes(current.status)) revalidateSite();
    return { ok: true, id: p.id, status: "archived", message: "Yazı silindi." };
  }

  // Hedef durum
  let status: PostStatus = current?.status ?? "draft";
  let publishAt: string | null = null;
  let publishedAt: string | null = current?.published_at ?? null;
  let reviewNote: string | null | undefined = undefined;
  switch (it) {
    case "save":
      if (!current) status = "draft";
      break;
    case "review":
      status = "review";
      reviewNote = null;
      break;
    case "publish":
      status = "published";
      // İlk yayında zamanı veritabanı koyar (guard_publish → now()); uygulama sunucusunun saati kaymış olabilir.
      publishedAt = current?.status === "published" && current.published_at ? current.published_at : null;
      reviewNote = null;
      break;
    case "schedule":
      if (!p.publishAt || new Date(p.publishAt).getTime() <= now.getTime() + 60_000) return { ok: false, error: "Zamanlama için ileri bir tarih ve saat seçin." };
      status = "scheduled";
      publishAt = p.publishAt;
      publishedAt = p.publishAt;
      reviewNote = null;
      break;
    case "return":
      if (!p.note) return { ok: false, error: "Geri gönderirken yazara bir not yazın." };
      status = "draft";
      reviewNote = p.note;
      publishedAt = null;
      break;
    case "archive":
      status = "archived";
      break;
    case "unpublish":
      status = "draft";
      publishedAt = null;
      break;
  }

  // Okuma süresi: TR tam metin
  const trTx = p.translations.tr;
  const readMin = readMinutes(trTx.title, trTx.dek, plainText(trTx.body), plainText(trTx.premium ?? null));

  const row: Record<string, unknown> = {
    type: p.type,
    status,
    category_id: p.categoryId,
    cover_id: p.coverId || null,
    is_premium: p.isPremium,
    publish_at: status === "scheduled" ? publishAt : null,
    published_at: publishedAt,
    read_min: readMin,
    source_url: p.sourceUrl || null,
    report_pdf: p.reportPdf || null,
  };
  if (reviewNote !== undefined) row.review_note = reviewNote;

  let id = p.id;
  if (!id) {
    const { data: author } = await sb.from("authors").select("id").eq("user_id", user.id).maybeSingle();
    const { data: fallback } = author ? { data: author } : await sb.from("authors").select("id").order("created_at").limit(1).maybeSingle();
    if (!fallback) return { ok: false, error: "Yazar kaydı bulunamadı." };
    id = crypto.randomUUID();
    const { error } = await sb.from("posts").insert({ id, ...row, author_id: fallback.id, created_by: user.id });
    if (error) return { ok: false, error: dbError(error) };
  } else {
    const { error } = await sb.from("posts").update(row).eq("id", id);
    if (error) return { ok: false, error: dbError(error) };
  }

  // Çeviriler
  const present = locales.filter((l) => p.translations[l]);
  const txRows = present.map((l) => {
    const t = p.translations[l]!;
    return {
      post_id: id,
      locale: l,
      slug: slugify(t.slug || t.title) || `${id!.slice(0, 8)}-${l}`,
      title: t.title,
      dek: t.dek,
      kicker: t.kicker || null,
      place: t.place || null,
      body: t.body,
      body_text: `${plainText(t.body)} ${plainText(t.premium ?? null)}`.trim(),
      seo_title: t.seoTitle || null,
      seo_desc: t.seoDesc || null,
    };
  });
  const { error: txErr } = await sb.from("post_translations").upsert(txRows, { onConflict: "post_id,locale" });
  if (txErr) return { ok: false, error: dbError(txErr) };
  const missing = locales.filter((l) => !p.translations[l]);
  if (missing.length) await sb.from("post_translations").delete().eq("post_id", id).in("locale", missing);

  // Kilitli gövde
  if (p.isPremium) {
    const prem = present.filter((l) => p.translations[l]!.premium).map((l) => ({ post_id: id, locale: l, body: p.translations[l]!.premium as RichDoc }));
    if (prem.length) {
      const { error } = await sb.from("post_premium").upsert(prem, { onConflict: "post_id,locale" });
      if (error) return { ok: false, error: dbError(error) };
    }
    const noPrem = locales.filter((l) => !p.translations[l]?.premium);
    if (noPrem.length) await sb.from("post_premium").delete().eq("post_id", id).in("locale", noPrem);
  } else {
    await sb.from("post_premium").delete().eq("post_id", id);
  }

  // Etiketler
  await sb.from("post_tags").delete().eq("post_id", id);
  if (p.tagIds.length) {
    const { error } = await sb.from("post_tags").insert([...new Set(p.tagIds)].map((t) => ({ post_id: id, tag_id: t })));
    if (error) return { ok: false, error: dbError(error) };
  }

  // Sürüm + denetim
  const svc = serviceClient();
  await svc.from("revisions").insert({ post_id: id, snapshot: { ...p, id, status }, created_by: user.id });
  await audit(user.id, `post.${it}`, "posts", id, { status });

  // İlk yayında sosyal paylaşım kuyruğu (cron gönderir; panelden düzenlenebilir/iptal edilebilir)
  if (status === "published" || status === "scheduled") {
    await svc.from("social_posts").upsert(
      [
        { post_id: id, network: "x", status: "queued" },
        { post_id: id, network: "instagram", status: "queued" },
      ],
      { onConflict: "post_id,network", ignoreDuplicates: true },
    );
  }

  if (PUBLIC.includes(status) || (current && PUBLIC.includes(current.status))) revalidateSite();

  const messages: Record<z.infer<typeof Intent>, string> = {
    save: "Kaydedildi.",
    review: "Onaya gönderildi.",
    publish: "Yayınlandı.",
    schedule: "Zamanlandı.",
    return: "Yazara geri gönderildi.",
    archive: "Arşivlendi.",
    unpublish: "Yayından kaldırıldı, taslağa döndü.",
    delete: "Silindi.",
  };
  return { ok: true, id: id!, status, message: messages[it] };
}

function dbError(e: { code?: string; message: string }) {
  if (e.code === "23505") return "Bu kısa ad (URL) aynı dilde başka bir yazıda kullanılıyor. Farklı bir kısa ad girin.";
  if (e.code === "42501") return "Yetkiniz bu işlem için yeterli değil.";
  if (e.message.includes("Yayınlama yetkisi")) return "Yayınlama yetkiniz yok.";
  return e.message;
}

export type { Locale };
