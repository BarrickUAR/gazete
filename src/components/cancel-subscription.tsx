"use client";
import { useActionState, useState } from "react";
import { cancelSubscription } from "@/app/actions/account";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";

const CONFIRM = {
  tr: "Aboneliği iptal etmek istediğinize emin misiniz? Erişiminiz dönem sonuna kadar sürer.",
  en: "Are you sure you want to cancel? Access continues until the end of the period.",
  ar: "هل أنت متأكد من إلغاء الاشتراك؟ يستمر وصولك حتى نهاية الفترة.",
};
const ERR = { tr: "İptal edilemedi. Lütfen tekrar deneyin.", en: "Could not cancel. Please try again.", ar: "تعذّر الإلغاء. حاول مرة أخرى." };

export function CancelSubscription({ lang }: { lang: Locale }) {
  const d = getDict(lang).account;
  const [st, act, pending] = useActionState(cancelSubscription, null);
  const [ask, setAsk] = useState(false);
  if (st?.ok) return <p role="status" className="font-ui text-[14px] text-fg-2">{d.canceledNote}</p>;
  return (
    <div className="space-y-3">
      {!ask ? (
        <button type="button" onClick={() => setAsk(true)} className="border border-line-2 px-4 py-2.5 font-label text-[12px] font-semibold uppercase tracking-[0.1em] text-fg-2 hover:border-accent hover:text-accent">
          {d.cancel}
        </button>
      ) : (
        <form action={act} className="space-y-3 border border-accent p-4">
          <p className="font-ui text-[14px] text-fg-2">{CONFIRM[lang]}</p>
          <div className="flex gap-2">
            <button disabled={pending} className="bg-accent px-4 py-2.5 font-label text-[12px] font-semibold uppercase tracking-[0.1em] text-accent-fg disabled:opacity-50">{d.cancel}</button>
            <button type="button" onClick={() => setAsk(false)} className="border border-line-2 px-4 py-2.5 font-label text-[12px] font-semibold uppercase tracking-[0.1em] text-fg-2">
              {getDict(lang).common.close}
            </button>
          </div>
        </form>
      )}
      {st && !st.ok && <p role="alert" className="font-ui text-[13px] text-accent">{ERR[lang]}</p>}
    </div>
  );
}
