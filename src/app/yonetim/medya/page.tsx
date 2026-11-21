import type { Metadata } from "next";
import { MediaManager } from "@/components/admin/media-manager";
import { PageHead } from "@/components/admin/ui";
import { requireStaff } from "@/lib/admin/auth";
import { mediaList } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Medya" };
export const dynamic = "force-dynamic";

export default async function Media() {
  await requireStaff("author");
  const items = await mediaList(300);
  return (
    <>
      <PageHead title="Medya" sub="Görseller ve rapor PDF'leri. Alt metin, görme engelli okurlar ve arama motorları için gereklidir." />
      <MediaManager initial={items} />
    </>
  );
}
