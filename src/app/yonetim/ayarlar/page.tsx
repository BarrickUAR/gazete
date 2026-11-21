import type { Metadata } from "next";
import { saveSettings } from "@/app/actions/admin";
import { btn, Card, Flash, input, label, PageHead } from "@/components/admin/ui";
import { requireStaff } from "@/lib/admin/auth";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Ayarlar" };
export const dynamic = "force-dynamic";

const LOCS = [
  { l: "tr", name: "Türkçe", dir: "ltr" },
  { l: "en", name: "İngilizce", dir: "ltr" },
  { l: "ar", name: "Arapça", dir: "rtl" },
] as const;

function Section({ id, title, sub, children }: { id: string; title: string; sub: string; children: React.ReactNode }) {
  return (
    <Card title={title}>
      <form action={saveSettings} className="space-y-4" id={id}>
        <input type="hidden" name="section" value={id} />
        <p className="text-[13px] text-fg-3">{sub}</p>
        {children}
        <button className={btn.primary}>Kaydet</button>
      </form>
    </Card>
  );
}

export default async function Settings({ searchParams }: PageProps<"/yonetim/ayarlar">) {
  await requireStaff("admin");
  const sp = await searchParams;
  const s = await getSettings();
  return (
    <>
      <PageHead title="Ayarlar" sub="Sitede görünen künye, Kimdir, sosyal hesaplar ve abonelik fiyatı." />
      <Flash sp={sp} />
      <nav className="mb-6 flex flex-wrap gap-2 text-[13.5px]" aria-label="Bölümler">
        {[
          ["price", "Abonelik fiyatı"],
          ["social", "Sosyal hesaplar"],
          ["imprint", "Künye"],
          ["about", "Kimdir"],
        ].map(([id, t]) => (
          <a key={id} href={`#${id}`} className="rounded-md border border-line-2 px-3 py-1.5 text-fg-3 hover:text-fg">
            {t}
          </a>
        ))}
      </nav>
      <div className="grid max-w-[980px] gap-6">
        <Section id="price" title="Abonelik fiyatı" sub="Abonelik sayfasında gösterilir. Ödeme sağlayıcısındaki plan fiyatıyla aynı olmalı; değiştirirseniz iyzico/PayTR panelinde de güncelleyin.">
          <div className="grid gap-3 sm:grid-cols-4">
            <label>
              <span className={label}>Aylık</span>
              <input name="monthly" type="number" step="0.01" min={0} defaultValue={s.price.monthly} className={input} />
            </label>
            <label>
              <span className={label}>Yıllık</span>
              <input name="yearly" type="number" step="0.01" min={0} defaultValue={s.price.yearly} className={input} />
            </label>
            <label>
              <span className={label}>Para birimi</span>
              <select name="currency" defaultValue={s.price.currency} className={input}>
                <option value="TRY">TL</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </label>
            <label>
              <span className={label}>Ücretsiz deneme (gün)</span>
              <input name="trialDays" type="number" min={0} max={365} defaultValue={s.price.trialDays} className={input} />
            </label>
          </div>
        </Section>

        <Section id="social" title="Sosyal hesaplar" sub="Altbilgide ve yapısal veride (sameAs) kullanılır. Boş bırakılan gizlenir.">
          <div className="grid gap-3 sm:grid-cols-3">
            {(["x", "instagram", "youtube"] as const).map((k) => (
              <label key={k}>
                <span className={label}>{k === "x" ? "X" : k === "instagram" ? "Instagram" : "YouTube"}</span>
                <input name={k} type="url" defaultValue={s.social[k] ?? ""} placeholder="https://" className={input} />
              </label>
            ))}
          </div>
        </Section>

        <Section id="imprint" title="Künye" sub="Her satır “Etiket: Değer” biçiminde. Örnek: Sahibi: Çetiner Çetin">
          <div className="grid gap-4 lg:grid-cols-3">
            {LOCS.map(({ l, name, dir }) => (
              <label key={l}>
                <span className={label}>{name}</span>
                <textarea name={l} dir={dir} rows={10} defaultValue={(s.imprint[l] ?? []).map((r) => `${r.label}: ${r.value}`).join("\n")} className={`${input} font-mono text-[12.5px]`} />
              </label>
            ))}
          </div>
        </Section>

        <Section id="about" title="Kimdir" sub="Biyografide paragrafları boş satırla ayırın. Kariyer satırları “Dönem | Açıklama” biçiminde; yalnız doğrulanmış bilgi girin, boşsa bölüm sitede gizlenir.">
          <div className="space-y-5">
            {LOCS.map(({ l, name, dir }) => (
              <fieldset key={l} className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
                <legend className="mb-2 text-[13px] font-semibold">{name}</legend>
                <label>
                  <span className={label}>Biyografi</span>
                  <textarea name={`${l}_bio`} dir={dir} rows={9} defaultValue={(s.about?.[l]?.bio ?? []).join("\n\n")} className={input} />
                </label>
                <label>
                  <span className={label}>Kariyer</span>
                  <textarea
                    name={`${l}_career`}
                    dir={dir}
                    rows={9}
                    defaultValue={(s.about?.[l]?.career ?? []).map((c) => `${c.period} | ${c.text}`).join("\n")}
                    placeholder="2010–2015 | …"
                    className={`${input} font-mono text-[12.5px]`}
                  />
                </label>
              </fieldset>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}
