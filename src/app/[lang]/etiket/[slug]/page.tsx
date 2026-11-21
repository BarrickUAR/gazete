import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { getTagBySlug, getTags, listPosts } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { langFrom } from "@/lib/site";
import { ListPage } from "@/themes/list-page";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getTags()).map((t) => ({ slug: t.slug }));
}

const alts = (slug: string) => Object.fromEntries(locales.map((l) => [l, href(l, "tag", slug)]));

export async function generateMetadata({ params }: PageProps<"/[lang]/etiket/[slug]">): Promise<Metadata> {
  const lang = await langFrom(params);
  const t = await getTagBySlug((await params).slug);
  if (!t) return { title: getDict(lang).notFound.title };
  return pageMeta(lang, { title: t.name[lang], alternates: alts(t.slug) });
}

export default async function Page({ params }: PageProps<"/[lang]/etiket/[slug]">) {
  const lang = await langFrom(params);
  const t = await getTagBySlug((await params).slug);
  if (!t) notFound();
  const posts = await listPosts(lang, { tagId: t.id, limit: 60 });
  return <ListPage lang={lang} title={t.name[lang]} kicker={getDict(lang).common.tags} alternates={alts(t.slug)} posts={posts} selfPath={href(lang, "tag", t.slug)} />;
}
