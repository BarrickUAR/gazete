import type { Metadata } from "next";
import { z } from "zod";
import { PageHead } from "@/components/admin/ui";
import { PostEditor } from "@/components/admin/post-editor";
import { can, requireStaff } from "@/lib/admin/auth";
import { mediaList, refData } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Yeni yazı" };
export const dynamic = "force-dynamic";

export default async function NewPost({ searchParams }: PageProps<"/yonetim/yazilar/yeni">) {
  const { role } = await requireStaff("author");
  const sp = await searchParams;
  const type = z.enum(["haber", "kose", "rapor"]).catch("haber").parse(Array.isArray(sp.tur) ? sp.tur[0] : sp.tur);
  const [refs, library] = await Promise.all([refData(), mediaList()]);
  const fallbackCat = refs.categories.find((c) => c.theme !== "foreign")?.id ?? refs.categories[0]?.id ?? "";
  return (
    <>
      <PageHead title="Yeni yazı" sub="Türkçe başlık ve metin zorunlu; İngilizce ve Arapça isteğe bağlı." />
      <PostEditor
        isEditor={can(role, "editor")}
        refs={refs}
        library={library}
        revisions={[]}
        init={{
          type,
          status: "draft",
          categoryId: fallbackCat,
          tagIds: [],
          cover: null,
          isPremium: type !== "haber",
          sourceUrl: "",
          reportPdf: "",
          publishAt: null,
          publishedAt: null,
          reviewNote: null,
          tx: {},
        }}
      />
    </>
  );
}
