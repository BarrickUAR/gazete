// Kilitli gövdenin devamı. Asla önbelleğe alınmaz; abonelik sunucuda doğrulanır.
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { locales } from "@/i18n/config";
import { hasAccess } from "@/lib/access";
import { repo } from "@/lib/data";

export const dynamic = "force-dynamic";

const Q = z.object({ id: z.string().min(1).max(80).regex(/^[\w-]+$/), lang: z.enum(locales) });
const noStore = { "Cache-Control": "private, no-store, max-age=0" };

export async function GET(req: NextRequest, ctx: RouteContext<"/api/icerik/[id]">) {
  const { id } = await ctx.params;
  const parsed = Q.safeParse({ id, lang: req.nextUrl.searchParams.get("lang") });
  if (!parsed.success) return NextResponse.json({ error: "bad-request" }, { status: 400, headers: noStore });

  const post = await repo().byId(parsed.data.id);
  if (!post || !post.isPremium) return NextResponse.json({ error: "not-found" }, { status: 404, headers: noStore });

  const access = await hasAccess();
  if (!access.ok) return NextResponse.json({ error: "locked", reason: access.reason }, { status: 402, headers: noStore });

  const body = await repo().premiumBody(post.id, parsed.data.lang);
  return NextResponse.json({ body: body ?? { type: "doc", content: [] } }, { headers: noStore });
}
