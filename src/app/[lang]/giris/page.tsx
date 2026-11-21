import type { Metadata } from "next";
import { getDict } from "@/i18n/dict";
import { LoginForm } from "@/components/auth-forms";
import { pageMeta } from "@/lib/seo";
import { langFrom, staticAlternates } from "@/lib/site";
import { AuthFrame } from "@/themes/auth-frame";

export async function generateMetadata({ params }: PageProps<"/[lang]/giris">): Promise<Metadata> {
  const lang = await langFrom(params);
  return pageMeta(lang, { title: getDict(lang).auth.login, alternates: staticAlternates("login"), noindex: true });
}

export default async function Login({ params, searchParams }: PageProps<"/[lang]/giris">) {
  const lang = await langFrom(params);
  const d = getDict(lang);
  const next = (await searchParams).next;
  return (
    <AuthFrame lang={lang} alternates={staticAlternates("login")} kicker={d.siteName} title={d.auth.login} intro={d.subscribe.lead}>
      <LoginForm lang={lang} next={typeof next === "string" ? next : undefined} />
    </AuthFrame>
  );
}
