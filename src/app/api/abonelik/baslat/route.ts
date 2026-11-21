// Ücretsiz denemeyi başlatır: oturum + zod doğrulama → bekleyen abonelik kaydı → sağlayıcı ödeme formu.
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { locales } from "@/i18n/config";
import { currentUser, latestSubscription, subscriptionGrants } from "@/lib/access";
import { activeProvider } from "@/lib/payments";
import { serviceClient } from "@/lib/supabase/clients";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const Body = z.object({
  plan: z.enum(["monthly", "yearly"]),
  lang: z.enum(locales),
  billing: z.object({
    name: z.string().trim().min(2).max(60),
    surname: z.string().trim().min(2).max(60),
    phone: z
      .string()
      .trim()
      .transform((s) => s.replace(/[\s()-]/g, ""))
      .pipe(z.string().regex(/^\+?\d{10,14}$/)),
    city: z.string().trim().min(2).max(60),
    address: z.string().trim().min(5).max(250),
    identityNumber: z.string().trim().regex(/^\d{11}$/).optional().or(z.literal("")),
  }),
});

export async function POST(req: NextRequest) {
  // Aynı site kökenden gelmeyen istekler reddedilir (CSRF).
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.nextUrl.host) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const provider = activeProvider();
  if (!provider) return NextResponse.json({ error: "unavailable" }, { status: 503 });

  const user = await currentUser();
  if (!user?.email) return NextResponse.json({ error: "auth" }, { status: 401 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid", fields: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 400 });

  const existing = await latestSubscription(user.id);
  if (subscriptionGrants(existing)) return NextResponse.json({ error: "already" }, { status: 409 });

  const db = serviceClient();
  // Deneme kişi başına bir kez: daha önce deneme/abonelik geçmişi olan kullanıcı yine kart ile başlar,
  // ama sağlayıcı planı deneme süresini uygular. (İstismar kontrolü: aynı kartla tekrarlı deneme iyzico tarafında da engellenebilir.)
  const { data: row, error } = await db
    .from("subscriptions")
    .insert({ user_id: user.id, provider: provider.id, plan: parsed.data.plan, status: "pending" })
    .select("id")
    .single();
  if (error || !row) return NextResponse.json({ error: "server" }, { status: 500 });

  try {
    const result = await provider.startTrial({
      userId: user.id,
      email: user.email,
      plan: parsed.data.plan,
      billing: { ...parsed.data.billing, identityNumber: parsed.data.billing.identityNumber || undefined },
      lang: parsed.data.lang,
      callbackUrl: `${SITE_URL}/api/odeme/${provider.id}/donus?s=${encodeURIComponent(row.id)}&lang=${parsed.data.lang}`,
      conversationId: row.id,
    });
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    await db.from("subscriptions").update({ status: "expired" }).eq("id", row.id);
    console.error("abonelik/baslat", e);
    return NextResponse.json({ error: "provider" }, { status: 502 });
  }
}
