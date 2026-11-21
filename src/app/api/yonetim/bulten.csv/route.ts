// Bülten abonelerini CSV olarak indirir (yalnız editör ve üstü).
import { NextResponse } from "next/server";
import { assertStaff } from "@/lib/admin/auth";
import { serviceClient } from "@/lib/supabase/clients";

export const dynamic = "force-dynamic";

const cell = (v: string) => {
  const s = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v; // CSV formül enjeksiyonuna karşı
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET() {
  try {
    await assertStaff("editor");
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { data, error } = await serviceClient().from("newsletter").select("email,locale,created_at").order("created_at").limit(50000);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const rows = ["email,locale,created_at", ...(data ?? []).map((r) => [r.email, r.locale, r.created_at].map(cell).join(","))];
  return new NextResponse("﻿" + rows.join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="bulten-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
