"use server";
// Görsel yükleme. Şimdilik Supabase Storage (herkese açık "media" kovası); Cloudflare hesabı açılınca R2'ye geçilecek
// (yalnızca bu dosyadaki depolama bölümü değişir, media tablosu ve arayüz aynı kalır).
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { assertStaff, audit } from "@/lib/admin/auth";
import { CONTENT_TAG, serviceClient } from "@/lib/supabase/clients";

const MAX = 8 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "application/pdf": "pdf" };
const BUCKET = "media";

const Meta = z.object({
  alt: z.string().trim().max(300).default(""),
  caption: z.string().trim().max(400).default(""),
  credit: z.string().trim().max(200).default(""),
  width: z.coerce.number().int().min(0).max(20000).optional(),
  height: z.coerce.number().int().min(0).max(20000).optional(),
});

/** Dosya içeriğinin gerçekten beyan edilen türde olduğunu ilk baytlardan doğrular. */
function sniff(b: Uint8Array, type: string) {
  const h = (...xs: number[]) => xs.every((x, i) => b[i] === x);
  if (type === "image/jpeg") return h(0xff, 0xd8, 0xff);
  if (type === "image/png") return h(0x89, 0x50, 0x4e, 0x47);
  if (type === "image/webp") return h(0x52, 0x49, 0x46, 0x46) && b[8] === 0x57 && b[9] === 0x45;
  if (type === "image/avif") return b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70;
  if (type === "application/pdf") return h(0x25, 0x50, 0x44, 0x46);
  return false;
}

export type UploadResult = { ok: true; media: { id: string; url: string; alt: string } } | { ok: false; error: string };

export async function uploadMedia(fd: FormData): Promise<UploadResult> {
  let user;
  try {
    ({ user } = await assertStaff("author"));
  } catch {
    return { ok: false, error: "Yetkiniz yok." };
  }
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Dosya seçin." };
  if (file.size > MAX) return { ok: false, error: "Dosya 8 MB'tan büyük olamaz." };
  const ext = TYPES[file.type];
  if (!ext) return { ok: false, error: "Yalnızca JPG, PNG, WebP, AVIF ya da PDF yüklenebilir." };
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!sniff(bytes, file.type)) return { ok: false, error: "Dosya içeriği türüyle uyuşmuyor." };
  const meta = Meta.parse(Object.fromEntries(fd));

  const db = serviceClient();
  const { error: bErr } = await db.storage.getBucket(BUCKET);
  if (bErr) await db.storage.createBucket(BUCKET, { public: true, fileSizeLimit: MAX, allowedMimeTypes: Object.keys(TYPES) });

  const d = new Date();
  const id = crypto.randomUUID();
  const path = `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${id}.${ext}`;
  const { error } = await db.storage.from(BUCKET).upload(path, bytes, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) return { ok: false, error: `Yükleme başarısız: ${error.message}` };
  const url = db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  const { error: mErr } = await db
    .from("media")
    .insert({ id, url, alt: meta.alt, caption: meta.caption || null, credit: meta.credit || null, width: meta.width ?? null, height: meta.height ?? null, created_by: user.id });
  if (mErr) return { ok: false, error: mErr.message };
  await audit(user.id, "media.upload", "media", id, { path, size: file.size });
  revalidatePath("/yonetim/medya");
  return { ok: true, media: { id, url, alt: meta.alt } };
}

const Edit = z.object({ id: z.string().max(64), alt: z.string().trim().max(300), caption: z.string().trim().max(400), credit: z.string().trim().max(200) });

export async function updateMedia(fd: FormData): Promise<{ ok: boolean; error?: string }> {
  let user;
  try {
    ({ user } = await assertStaff("author"));
  } catch {
    return { ok: false, error: "Yetkiniz yok." };
  }
  const p = Edit.safeParse(Object.fromEntries(fd));
  if (!p.success) return { ok: false, error: "Geçersiz veri" };
  const { error } = await serviceClient().from("media").update({ alt: p.data.alt, caption: p.data.caption || null, credit: p.data.credit || null }).eq("id", p.data.id);
  if (error) return { ok: false, error: error.message };
  await audit(user.id, "media.update", "media", p.data.id);
  revalidatePath("/yonetim/medya");
  updateTag(CONTENT_TAG);
  revalidatePath("/[lang]", "layout");
  return { ok: true };
}
