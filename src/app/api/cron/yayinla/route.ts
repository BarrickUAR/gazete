// Zamanlanmış yayın. Cloudflare Cron Trigger (her dakika) bu adresi `Authorization: Bearer $CRON_SECRET` ile çağırır.
// Zamanı gelen yazılar zaten herkese görünür (RLS post_is_public); burada durumları "published"a çevrilir,
// site önbelleği tazelenir ve sosyal paylaşım kuyruğu doldurulur. Ayrıca Supabase ücretsiz planının uyumasını önler.
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { CONTENT_TAG, hasSupabase, serviceClient } from "@/lib/supabase/clients";

export const dynamic = "force-dynamic";

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 24) return false;
  const got = req.headers.get("authorization") ?? "";
  const want = `Bearer ${secret}`;
  if (got.length !== want.length) return false;
  let diff = 0;
  for (let i = 0; i < want.length; i++) diff |= got.charCodeAt(i) ^ want.charCodeAt(i);
  return diff === 0;
}

async function run(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!hasSupabase()) return NextResponse.json({ published: 0, note: "supabase yok" });
  const db = serviceClient();
  const now = new Date().toISOString();
  const { data, error } = await db.from("posts").select("id,publish_at").eq("status", "scheduled").lte("publish_at", now).limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const due = data ?? [];
  for (const p of due) {
    await db.from("posts").update({ status: "published", published_at: p.publish_at, publish_at: null }).eq("id", p.id).eq("status", "scheduled");
    await db.from("audit_log").insert({ actor: null, action: "post.auto_publish", entity: "posts", entity_id: p.id, meta: { at: p.publish_at } });
    await db.from("social_posts").upsert(
      [
        { post_id: p.id, network: "x", status: "queued" },
        { post_id: p.id, network: "instagram", status: "queued" },
      ],
      { onConflict: "post_id,network", ignoreDuplicates: true },
    );
  }
  if (due.length) {
    revalidateTag(CONTENT_TAG, { expire: 0 });
    revalidatePath("/[lang]", "layout");
  }
  return NextResponse.json({ published: due.length, ids: due.map((p) => p.id) });
}

export const GET = run;
export const POST = run;
