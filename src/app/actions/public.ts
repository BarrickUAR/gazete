"use server";
// Herkese açık formlar: iletişim/ihbar ve bülten. zod doğrulama + bal küpü alanı + IP başına basit sınır.
import { headers } from "next/headers";
import { z } from "zod";
import { locales } from "@/i18n/config";
import { hasServiceRole, serviceClient } from "@/lib/supabase/clients";

export type FormState = { ok: boolean; error?: "invalid" | "unavailable" | "rate" | "server"; fields?: string[] } | null;

const hits = new Map<string, number[]>();
async function limited(bucket: string, max: number, windowMs: number) {
  const h = await headers();
  const ip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > max;
}

const Contact = z.object({
  kind: z.enum(["ihbar", "basin", "genel"]),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional().or(z.literal("")),
});

export async function sendContact(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = Contact.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { ok: false, error: "invalid", fields: parsed.error.issues.map((i) => String(i.path[0])) };
  if (parsed.data.website) return { ok: true }; // bot
  if (await limited("contact", 5, 10 * 60_000)) return { ok: false, error: "rate" };
  if (!hasServiceRole()) return { ok: false, error: "unavailable" };
  const { website: _w, ...row } = parsed.data;
  void _w;
  const { error } = await serviceClient().from("contact_messages").insert(row);
  return error ? { ok: false, error: "server" } : { ok: true };
}

const News = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  locale: z.enum(locales),
  website: z.string().max(0).optional().or(z.literal("")),
});

export async function subscribeNewsletter(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = News.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { ok: false, error: "invalid", fields: ["email"] };
  if (parsed.data.website) return { ok: true };
  if (await limited("news", 5, 10 * 60_000)) return { ok: false, error: "rate" };
  if (!hasServiceRole()) return { ok: false, error: "unavailable" };
  const { error } = await serviceClient().from("newsletter").upsert({ email: parsed.data.email, locale: parsed.data.locale }, { onConflict: "email", ignoreDuplicates: true });
  return error ? { ok: false, error: "server" } : { ok: true };
}
