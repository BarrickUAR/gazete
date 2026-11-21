// E-posta doğrulama / sihirli bağlantı dönüşü: kodu oturuma çevirir, güvenli `next` yoluna yönlendirir.
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabase, sessionClient } from "@/lib/supabase/clients";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const raw = req.nextUrl.searchParams.get("next") ?? "/hesabim";
  const next = raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\") ? raw : "/hesabim";
  if (code && hasSupabase()) {
    const sb = await sessionClient();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(new URL("/giris?hata=1", req.url));
  }
  return NextResponse.redirect(new URL(next, req.url));
}
