import type { Metadata } from "next";
import { getDict } from "@/i18n/dict";
import { href } from "@/i18n/routes";
import { listPosts } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { langFrom, staticAlternates } from "@/lib/site";
import { LIST_LIMIT, ListPage } from "@/themes/list-page";

export const revalidate = 300;

const INTRO = { tr: "Belirli bir konu etrafında derlenmiş dosyalar: içindekiler, bölümler ve kaynak yazılar.", en: "Dossiers compiled around a single subject: contents, sections and source pieces.", ar: "ملفات مجمّعة حول موضوع واحد: المحتويات والأقسام والمواد المصدرية." } as const;

export async function generateMetadata({ params }: PageProps<"/[lang]/raporlar">): Promise<Metadata> {
  const lang = await langFrom(params);
  const d = getDict(lang);
  return pageMeta(lang, { title: d.typePlural.rapor, description: INTRO[lang], alternates: staticAlternates("reports") });
}

export default async function Page({ params }: PageProps<"/[lang]/raporlar">) {
  const lang = await langFrom(params);
  const d = getDict(lang);
  const posts = await listPosts(lang, { type: "rapor", limit: LIST_LIMIT });
  return (
    <ListPage
      lang={lang}
      title={d.typePlural.rapor}
      kicker={d.type.rapor}
      intro={INTRO[lang]}
      active="reports"
      alternates={staticAlternates("reports")}
      posts={posts}
      archiveQuery={{ type: "rapor" }}
      selfPath={href(lang, "reports")}
    />
  );
}
