import type { Metadata } from "next";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { listPosts } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { langFrom, staticAlternates } from "@/lib/site";
import { LIST_LIMIT, ListPage } from "@/themes/list-page";

export const revalidate = 300;

const INTRO = { tr: "Sahadan haberler, gelişmeler ve dış politika gündemi. Haberler herkese açıktır.", en: "Reporting from the field, developments and the foreign-policy agenda. News is free to read.", ar: "تقارير ميدانية وتطورات وأجندة السياسة الخارجية. الأخبار متاحة للجميع." } as const;

export async function generateMetadata({ params }: PageProps<"/[lang]/haber">): Promise<Metadata> {
  const lang = await langFrom(params);
  const d = getDict(lang);
  return pageMeta(lang, { title: d.typePlural.haber, description: INTRO[lang], alternates: staticAlternates("news") });
}

export default async function Page({ params }: PageProps<"/[lang]/haber">) {
  const lang = await langFrom(params);
  const d = getDict(lang);
  const posts = await listPosts(lang, { type: "haber", limit: LIST_LIMIT });
  return (
    <ListPage
      lang={lang}
      title={d.typePlural.haber}
      kicker={d.type.haber}
      intro={INTRO[lang]}
      active="news"
      alternates={staticAlternates("news")}
      posts={posts}
      archiveQuery={{ type: "haber" }}
      selfPath={href(lang, "news")}
    />
  );
}
