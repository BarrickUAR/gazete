import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const hasSupabase = () => Boolean(URL && ANON);
export const hasServiceRole = () => Boolean(URL && SERVICE);

/** Herkese açık içerik okumalarının önbellek etiketi. Yayın/düzenlemede updateTag/revalidateTag ile anında boşaltılır. */
export const CONTENT_TAG = "content";
const taggedFetch: typeof fetch = (input, init) => fetch(input, { ...init, next: { revalidate: 300, tags: [CONTENT_TAG] } } as RequestInit);

let anon: SupabaseClient | null = null;
/** Çerezsiz, herkese açık okuma istemcisi. ISR/statik sayfalarda kullanılır (RLS: yalnız yayındaki içerik). */
export function anonClient() {
  if (!hasSupabase()) throw new Error("Supabase yapılandırılmadı");
  anon ??= createClient(URL, ANON, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: taggedFetch } });
  return anon;
}

/** RLS'i atlayan sunucu istemcisi. YALNIZCA sunucuda; kilitli gövde, webhook, cron, yönetim işlemleri. */
export function serviceClient() {
  if (!hasServiceRole()) throw new Error("SUPABASE_SERVICE_ROLE_KEY eksik");
  return createClient(URL, SERVICE, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Oturum çerezli istemci (giriş yapmış kullanıcı adına; RLS kullanıcı rolüyle uygulanır). Dinamik sayfalarda. */
export async function sessionClient() {
  if (!hasSupabase()) throw new Error("Supabase yapılandırılmadı");
  const store = await cookies();
  return createServerClient(URL, ANON, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Sunucu bileşeninden çağrıldıysa çerez yazılamaz; proxy/route handler tazeler.
        }
      },
    },
  });
}
