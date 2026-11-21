// Hesabım: oturum gerektirir (dinamik, önbelleğe alınmaz).
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDict } from "@/i18n/dict";
import { href, withQuery } from "@/i18n/routes";
import { LogoutButton } from "@/components/auth-forms";
import { CancelSubscription } from "@/components/cancel-subscription";
import { Shell } from "@/components/shell";
import { Breadcrumbs, Container, Label } from "@/components/ui";
import { currentUser, latestSubscription, roleOf, subscriptionGrants } from "@/lib/access";
import { pageMeta } from "@/lib/seo";
import { fmtDate, langFrom, staticAlternates } from "@/lib/site";
import { hasSupabase } from "@/lib/supabase/clients";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[lang]/hesabim">): Promise<Metadata> {
  const lang = await langFrom(params);
  return pageMeta(lang, { title: getDict(lang).account.title, alternates: staticAlternates("account"), noindex: true });
}

const RESULT = {
  ok: { tr: "Ödeme adımı tamamlandı. Deneme süreniz başladı.", en: "Checkout complete. Your trial has started.", ar: "اكتملت خطوة الدفع. بدأت فترتك التجريبية." },
  hata: { tr: "Ödeme tamamlanamadı. Kartınızdan ücret alınmadı; tekrar deneyebilirsiniz.", en: "Checkout did not complete. You were not charged; you can try again.", ar: "لم يكتمل الدفع. لم تُخصم أي رسوم؛ يمكنك المحاولة مجددًا." },
};
const PLAN = { monthly: { tr: "Aylık", en: "Monthly", ar: "شهري" }, yearly: { tr: "Yıllık", en: "Yearly", ar: "سنوي" } };

export default async function Account({ params, searchParams }: PageProps<"/[lang]/hesabim">) {
  const lang = await langFrom(params);
  const d = getDict(lang);
  if (!hasSupabase()) redirect(href(lang, "login"));
  const user = await currentUser();
  if (!user) redirect(withQuery(href(lang, "login"), { next: href(lang, "account") }));

  const sp = await searchParams;
  const result = sp.odeme === "ok" ? "ok" : sp.odeme === "hata" ? "hata" : null;
  const role = roleOf(user);
  const sub = await latestSubscription(user.id);
  const active = subscriptionGrants(sub);
  const name = (user.user_metadata?.display_name as string | undefined) ?? user.email;

  const rows: [string, string][] = [];
  if (sub) {
    rows.push([d.account.status, d.account[sub.status]]);
    rows.push([d.subscribe.title, PLAN[sub.plan][lang]]);
    if (sub.status === "trialing" && sub.trial_end) rows.push([d.account.trialEnds, fmtDate(lang, sub.trial_end)]);
    if (sub.current_period_end && (sub.status === "active" || sub.status === "past_due")) rows.push([d.account.renews, fmtDate(lang, sub.current_period_end)]);
    if (sub.status === "canceled" && (sub.current_period_end ?? sub.trial_end)) rows.push([d.account.endsOn, fmtDate(lang, (sub.current_period_end ?? sub.trial_end)!)]);
  }

  return (
    <Shell lang={lang} alternates={staticAlternates("account")} active="account">
      <Container className="pb-24 pt-10">
        <Breadcrumbs items={[{ label: d.common.home, to: href(lang) }, { label: d.account.title }]} />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-b border-line-2 pb-8">
          <div>
            <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-accent">■ {d.account.title}</p>
            <h1 className="mt-4 font-display text-[44px] font-medium italic leading-[0.95] text-head sm:text-[64px]">{name}</h1>
            <p className="mt-3 font-ui text-[14px] text-muted">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {role !== "subscriber" && (
              <a href="/yonetim" className="bg-invert px-4 py-2.5 font-label text-[12px] font-semibold uppercase tracking-[0.1em] text-invert-fg hover:opacity-90">
                {lang === "tr" ? "Yönetim paneli" : lang === "en" ? "Editor panel" : "لوحة التحرير"}
              </a>
            )}
            <LogoutButton lang={lang} />
          </div>
        </div>

        {result && (
          <p role="status" className={`mt-8 border px-5 py-4 font-ui text-[15px] ${result === "ok" ? "border-line-2 text-fg" : "border-accent text-accent"}`}>
            {RESULT[result][lang]}
          </p>
        )}

        <section className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Label accent>{d.account.status}</Label>
            {sub && sub.status !== "pending" && sub.status !== "expired" ? (
              <dl className="mt-4 border-t-2 border-fg">
                {rows.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[12rem_1fr] gap-4 border-b border-line py-4">
                    <dt className="font-label text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{k}</dt>
                    <dd className="text-[16px] text-fg">{v}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div className="mt-4 border border-line-2 p-6">
                <p className="text-[16px] text-fg-2">{d.account.none}</p>
                <a href={href(lang, "subscribe")} className="mt-5 inline-block bg-invert px-5 py-3 font-label text-[13px] font-semibold uppercase tracking-[0.1em] text-invert-fg hover:opacity-90">
                  {d.paywall.cta}
                </a>
              </div>
            )}
            {sub && active && !sub.cancel_at_period_end && sub.status !== "canceled" && (
              <div className="mt-6">
                <CancelSubscription lang={lang} />
              </div>
            )}
            {sub?.status === "canceled" && <p className="mt-6 font-ui text-[14px] text-fg-3">{d.account.canceledNote}</p>}
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <Label>{d.subscribe.faq}</Label>
            <ul className="mt-4 space-y-4">
              {d.subscribe.faqs.slice(0, 2).map(([q, a]) => (
                <li key={q} className="border-t border-line pt-4">
                  <p className="font-display text-[19px] leading-[1.25] text-head">{q}</p>
                  <p className="mt-2 text-[14.5px] leading-[1.55] text-fg-3">{a}</p>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </Container>
    </Shell>
  );
}
