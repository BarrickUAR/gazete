// Haber / köşe yazısı / rapor detay sayfalarının ortak gövdesi. Şablon, kategorinin temasına göre seçilir:
// theme = "foreign" → T8 (Dış Haberler), aksi halde T2.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { Shell } from "@/components/shell";
import { JsonLd } from "@/components/ui";
import { getPost, getRelated, listPosts, repo } from "@/lib/data";
import { articleLd, postMeta } from "@/lib/seo";
import { abs, postAlternates, postHref, typeListRoute } from "@/lib/site";
import type { PostType } from "@/lib/types";
import { DefaultArticle } from "./default/article";
import { ForeignArticle } from "./foreign/article";

export async function postParams(lang: string, type: PostType) {
  const all = await repo().allPublished();
  return all
    .filter((p) => p.type === type && p.slugs[lang as Locale])
    .slice(0, 500)
    .map((p) => ({ slug: p.slugs[lang as Locale]! }));
}

export async function postMetadata(lang: Locale, slug: string, type: PostType): Promise<Metadata> {
  const post = await getPost(lang, slug, type);
  return post ? postMeta(lang, post) : { title: getDict(lang).notFound.title, robots: { index: false } };
}

export async function PostPage({ lang, slug, type }: { lang: Locale; slug: string; type: PostType }) {
  const post = await getPost(lang, slug, type);
  if (!post) notFound();
  const d = getDict(lang);
  const foreign = post.category.theme === "foreign";
  const [related, latest] = await Promise.all([getRelated(lang, post, 4), listPosts(lang, { excludeIds: [post.id], limit: 5 })]);
  const url = abs(postHref(lang, post));
  const crumbs = [
    { label: d.common.home, to: href(lang) },
    foreign ? { label: d.foreign.title, to: href(lang, "foreign") } : { label: d.typePlural[post.type], to: href(lang, typeListRoute[post.type]) },
    { label: post.t.title, to: postHref(lang, post) },
  ];
  return (
    <Shell lang={lang} theme={foreign ? "foreign" : "default"} alternates={postAlternates(post)} active={foreign ? "foreign" : typeListRoute[post.type]}>
      <JsonLd data={articleLd(lang, post, url, crumbs)} />
      {foreign ? <ForeignArticle lang={lang} post={post} related={related} /> : <DefaultArticle lang={lang} post={post} related={related} latest={latest} />}
    </Shell>
  );
}
