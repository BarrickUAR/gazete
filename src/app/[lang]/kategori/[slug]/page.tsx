import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { getCategories, getCategoryBySlug, listPosts } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { langFrom } from "@/lib/site";
import type { Category } from "@/lib/types";
import { LIST_LIMIT, ListPage } from "@/themes/list-page";

export const revalidate = 300;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return (await getCategories()).filter((c) => c.theme === "default").map((c) => ({ slug: c.slug[params.lang as Locale] }));
}

const alts = (c: Category) => Object.fromEntries(locales.map((l) => [l, href(l, "category", c.slug[l])]));

export async function generateMetadata({ params }: PageProps<"/[lang]/kategori/[slug]">): Promise<Metadata> {
  const lang = await langFrom(params);
  const c = await getCategoryBySlug(lang, (await params).slug);
  if (!c) return { title: getDict(lang).notFound.title };
  return pageMeta(lang, { title: c.name[lang], alternates: alts(c) });
}

export default async function Page({ params }: PageProps<"/[lang]/kategori/[slug]">) {
  const lang = await langFrom(params);
  const c = await getCategoryBySlug(lang, (await params).slug);
  if (!c) notFound();
  if (c.theme === "foreign") permanentRedirect(href(lang, "foreign"));
  const d = getDict(lang);
  const posts = await listPosts(lang, { categoryId: c.id, limit: LIST_LIMIT });
  return (
    <ListPage
      lang={lang}
      title={c.name[lang]}
      kicker={d.archive.category}
      alternates={alts(c)}
      posts={posts}
      archiveQuery={{ cat: c.slug[lang] }}
      selfPath={href(lang, "category", c.slug[lang])}
    />
  );
}
