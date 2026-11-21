import { langFrom } from "@/lib/site";
import { PostPage, postMetadata, postParams } from "@/themes/post-page";

export const revalidate = 300;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return postParams(params.lang, "kose");
}

export async function generateMetadata({ params }: PageProps<"/[lang]/kose-yazisi/[slug]">) {
  const { slug } = await params;
  return postMetadata(await langFrom(params), slug, "kose");
}

export default async function Page({ params }: PageProps<"/[lang]/kose-yazisi/[slug]">) {
  const { slug } = await params;
  return <PostPage lang={await langFrom(params)} slug={slug} type="kose" />;
}
