// Sağlayıcı bildirimleri (webhook): imza doğrulanır, durum API'den teyit edilir, payment_events ile idempotent işlenir.
import { NextResponse, type NextRequest } from "next/server";
import { applyUpdate, getProvider } from "@/lib/payments";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: RouteContext<"/api/odeme/[provider]/bildirim">) {
  const { provider: pid } = await ctx.params;
  const provider = getProvider(pid);
  if (!provider?.configured()) return NextResponse.json({ error: "unavailable" }, { status: 404 });
  try {
    const u = await provider.parseWebhook(req);
    if (!u) return NextResponse.json({ error: "signature" }, { status: 401 });
    const r = await applyUpdate(provider.id, u);
    return NextResponse.json({ ok: true, duplicate: r.duplicate });
  } catch (e) {
    console.error("odeme/bildirim", e);
    // 5xx → sağlayıcı yeniden dener.
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
