import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/admin/ui";
import { PostEditor, type EditorInit } from "@/components/admin/post-editor";
import { locales } from "@/i18n/config";
import { can, requireStaff } from "@/lib/admin/auth";
import { adminPost, mediaList, refData, revisions } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Yazıyı düzenle" };
export const dynamic = "force-dynamic";

export default async function EditPost({ params, searchParams }: PageProps<"/yonetim/yazilar/[id]">) {
  const { role } = await requireStaff("author");
  const { id } = await params;
  if (!/^[\w-]{1,64}$/.test(id)) notFound();
  const post = await adminPost(id);
  if (!post) notFound();
  const [refs, library, revs] = await Promise.all([refData(), mediaList(), revisions(id)]);

  const tx: EditorInit["tx"] = {};
  for (const l of locales) {
    const t = post.tx[l];
    if (t)
      tx[l] = {
        slug: t.slug,
        title: t.title,
        dek: t.dek ?? "",
        kicker: t.kicker ?? "",
        place: t.place ?? "",
        body: t.body ?? { type: "doc", content: [] },
        premium: t.premium,
        seoTitle: t.seo_title ?? "",
        seoDesc: t.seo_desc ?? "",
      };
  }
  const cover = post.cover ? (library.find((m) => m.id === post.cover!.id) ?? post.cover) : null;

  return (
    <>
      <PageHead title={post.tx.tr?.title ?? "Yazıyı düzenle"} sub={`Son güncelleme ${new Date(post.updated_at).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}`} />
      <PostEditor
        justCreated={(await searchParams).k === "1"}
        isEditor={can(role, "editor")}
        refs={refs}
        library={library}
        revisions={revs.map((r) => ({ id: r.id, created_at: r.created_at, snapshot: r.snapshot }))}
        init={{
          id: post.id,
          type: post.type,
          status: post.status,
          categoryId: post.category_id,
          tagIds: post.tagIds,
          cover,
          isPremium: post.is_premium,
          sourceUrl: post.source_url ?? "",
          reportPdf: post.report_pdf ?? "",
          publishAt: post.publish_at,
          publishedAt: post.published_at,
          reviewNote: post.review_note,
          updatedAt: post.updated_at,
          tx,
        }}
      />
    </>
  );
}
