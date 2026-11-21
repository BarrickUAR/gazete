import type { Metadata } from "next";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { listPosts } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { langFrom, staticAlternates } from "@/lib/site";
import { LIST_LIMIT, ListPage } from "@/themes/list-page";

export const revalidate = 300;

const INTRO = { tr: "Bölgesel krizler, diplomasi trafiği ve Türkiye siyaseti üzerine yorumlar.", en: "Commentary on regional crises, diplomatic traffic and Turkish politics.", ar: "تعليقات على الأزمات الإقليمية والحراك الدبلوماسي والسياسة التركية." } as const;

export async function generateMetadata({ params }: PageProps<"/[lang]/kose-yazilari">): Promise<Metadata> {
  const lang = await langFrom(params);
  const d = getDict(lang);
  return pageMeta(lang, { title: d.typePlural.kose, description: INTRO[lang], alternates: staticAlternates("columns") });
}

export default async function Page({ params }: PageProps<"/[lang]/kose-yazilari">) {
  const lang = await langFrom(params);
  const d = getDict(lang);
  const posts = await listPosts(lang, { type: "kose", limit: LIST_LIMIT });
  return (
    <ListPage
      lang={lang}
      title={d.typePlural.kose}
      kicker={d.type.kose}
      intro={INTRO[lang]}
      active="columns"
      alternates={staticAlternates("columns")}
      posts={posts}
      archiveQuery={{ type: "kose" }}
      selfPath={href(lang, "columns")}
    />
  );
}
