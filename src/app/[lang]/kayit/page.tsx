import type { Metadata } from "next";
import { getDict } from "@/i18n/dict";
import { RegisterForm } from "@/components/auth-forms";
import { pageMeta } from "@/lib/seo";
import { langFrom, staticAlternates } from "@/lib/site";
import { AuthFrame } from "@/themes/auth-frame";

export async function generateMetadata({ params }: PageProps<"/[lang]/kayit">): Promise<Metadata> {
  const lang = await langFrom(params);
  return pageMeta(lang, { title: getDict(lang).auth.register, alternates: staticAlternates("register"), noindex: true });
}

export default async function Register({ params, searchParams }: PageProps<"/[lang]/kayit">) {
  const lang = await langFrom(params);
  const d = getDict(lang);
  const next = (await searchParams).next;
  return (
    <AuthFrame lang={lang} alternates={staticAlternates("register")} kicker={d.subscribe.trial} title={d.auth.register} intro={d.subscribe.lead}>
      <RegisterForm lang={lang} next={typeof next === "string" ? next : undefined} />
    </AuthFrame>
  );
}
