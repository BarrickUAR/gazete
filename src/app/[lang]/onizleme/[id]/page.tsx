// Editör önizlemesi: taslak/onay bekleyen/zamanlanmış yazıyı sitedeki şablonuyla, kilitli bölüm açık gösterir.
// Yalnız ekip; dizine eklenmez, önbelleğe alınmaz. Okuma oturumlu istemciyle (RLS: yazar yalnız kendi yazısını görür).
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { requireStaff } from "@/lib/admin/auth";
import { BASE, CAT, mapPost, TX_FULL } from "@/lib/data/db-repo";
import { localize } from "@/lib/data/localize";
import { langFrom } from "@/lib/site";
import { sessionClient } from "@/lib/supabase/clients";
import type { RichDoc } from "@/lib/types";
import { DefaultArticle } from "@/themes/default/article";
import { ForeignArticle } from "@/themes/foreign/article";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Önizleme", robots: { index: false, follow: false } };

const STATUS: Record<string, string> = { draft: "Taslak", review: "Onay bekliyor", scheduled: "Zamanlandı", published: "Yayında", archived: "Arşivde" };

export default async function Preview({ params }: PageProps<"/[lang]/onizleme/[id]">) {
  const lang = await langFrom(params);
  const { id } = await params;
  await requireStaff("author");
  if (!/^[\w-]{1,64}$/.test(id)) notFound();
  const sb = await sessionClient();
  const { data } = await sb.from("posts").select(`${BASE},category:categories(${CAT}),post_translations(${TX_FULL}),post_premium(locale,body)`).eq("id", id).maybeSingle();
  if (!data) notFound();
  const post = localize(mapPost(data), lang);
  if (!post) notFound();
  const premium = ((data as { post_premium?: { locale: string; body: RichDoc }[] }).post_premium ?? []).find((p) => p.locale === lang)?.body ?? null;
  const foreign = post.category.theme === "foreign";
  return (
    <Shell lang={lang} theme={foreign ? "foreign" : "default"} alternates={{}}>
      <div className="sticky top-0 z-40 border-b border-[#f0c36d] bg-[#fff8e6] px-4 py-2 text-center font-ui text-[13.5px] text-[#6b4a00]" dir="ltr">
        Önizleme · {STATUS[post.status] ?? post.status} · okurlar bu sayfayı göremez ·{" "}
        <a href={`/yonetim/yazilar/${post.id}`} className="font-semibold underline">
          Düzenlemeye dön
        </a>
      </div>
      {foreign ? (
        <ForeignArticle lang={lang} post={post} related={[]} premium={premium} />
      ) : (
        <DefaultArticle lang={lang} post={post} related={[]} latest={[]} premium={premium} />
      )}
    </Shell>
  );
}
