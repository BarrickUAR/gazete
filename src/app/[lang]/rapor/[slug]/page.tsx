import { langFrom } from "@/lib/site";
import { PostPage, postMetadata, postParams } from "@/themes/post-page";

export const revalidate = 300;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return postParams(params.lang, "rapor");
}

export async function generateMetadata({ params }: PageProps<"/[lang]/rapor/[slug]">) {
  const { slug } = await params;
  return postMetadata(await langFrom(params), slug, "rapor");
}

export default async function Page({ params }: PageProps<"/[lang]/rapor/[slug]">) {
  const { slug } = await params;
  return <PostPage lang={await langFrom(params)} slug={slug} type="rapor" />;
}
