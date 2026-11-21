// Ödeme sayfasından dönüş (sağlayıcı tarayıcıyı POST ile buraya gönderir). Sonuç sağlayıcı API'sinden doğrulanır.
import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/i18n/config";
import { href, withQuery } from "@/i18n/routes";
import { applyUpdate, getProvider } from "@/lib/payments";
import { serviceClient } from "@/lib/supabase/clients";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: RouteContext<"/api/odeme/[provider]/donus">) {
  const { provider: pid } = await ctx.params;
  const provider = getProvider(pid);
  const rawLang = req.nextUrl.searchParams.get("lang") ?? "tr";
  const lang = isLocale(rawLang) ? rawLang : "tr";
  const subId = req.nextUrl.searchParams.get("s") ?? "";
  const back = (ok: boolean) => NextResponse.redirect(new URL(withQuery(href(lang, "account"), { odeme: ok ? "ok" : "hata" }), req.url), 303);

  if (!provider?.configured() || !/^[\w-]{8,64}$/.test(subId)) return back(false);
  try {
    // Dönüş yalnızca hâlâ bekleyen kendi kaydına uygulanabilir (tekrar oynatma / başka kayda bağlama engeli).
    const { data: pending } = await serviceClient().from("subscriptions").select("id").eq("id", subId).eq("provider", provider.id).eq("status", "pending").maybeSingle();
    if (!pending) return back(false);
    const u = await provider.completeCheckout(await req.formData());
    if (!u) {
      await serviceClient().from("subscriptions").update({ status: "expired" }).eq("id", subId).eq("status", "pending");
      return back(false);
    }
    await applyUpdate(provider.id, u, { subscriptionId: subId });
    return back(u.status === "trialing" || u.status === "active");
  } catch (e) {
    console.error("odeme/donus", e);
    return back(false);
  }
}
