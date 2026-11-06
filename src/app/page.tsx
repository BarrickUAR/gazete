import Link from "next/link";
import { Instrument_Serif, Inter_Tight } from "next/font/google";
import { designs } from "@/lib/designs";
import { LivePreview } from "@/components/live-preview";

const serif = Instrument_Serif({ subsets: ["latin", "latin-ext"], weight: "400", style: ["normal", "italic"], variable: "--f-is" });
const sans = Inter_Tight({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], variable: "--f-it" });

const S = "font-[family-name:var(--f-is)]";
const INK = "#16140f";

const steps = [
  ["Tasarım seçimi", "Altı yönden biri seçilir, renk ve yazı tipi ince ayarı yapılır."],
  ["Yazı & haber sayfaları", "Makale, kategori, arşiv, hakkında ve iletişim sayfaları."],
  ["Yönetim paneli", "Haber, köşe yazısı ve video ekleme; taslak ve yayın planlama."],
  ["Yayın", "Alan adı, SEO, Google Haberler uyumu ve bülten altyapısı."],
];

export default function Secim() {
  return (
    <div className={`${serif.variable} ${sans.variable} min-h-screen bg-[#f3f1ec] font-[family-name:var(--f-it)]`} style={{ color: INK }}>
      {/* üst */}
      <header className="border-b border-[#16140f]/10">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-4 text-[13px] lg:px-10">
          <span className="font-medium">Tasarım önerileri</span>
          <span className="text-[#16140f]/55">Kasım 2026 · Taslak 1</span>
        </div>
      </header>

      {/* kapak */}
      <section className="mx-auto grid max-w-[1320px] gap-10 px-5 pb-16 pt-14 lg:grid-cols-12 lg:px-10 lg:pb-24 lg:pt-24">
        <div className="lg:col-span-8">
          <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-[#16140f]/55">Kişisel yayın platformu</p>
          <h1 className={`${S} mt-5 text-[64px] leading-[0.92] tracking-[-0.02em] sm:text-[104px] lg:text-[132px]`}>
            Çetiner Çetin
          </h1>
          <p className={`${S} mt-6 max-w-[24ch] text-[30px] italic leading-[1.15] text-[#16140f]/80 sm:text-[38px]`}>
            Haber, analiz ve köşe yazıları için altı farklı yön.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 self-end border-t border-[#16140f]/15 pt-6 text-[14px] lg:col-span-4 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          {[
            ["Kim için", "Habertürk TV, Dış Politika ve Güvenlik Yayın Koordinatörü"],
            ["Kapsam", "Portfolyo, haber, köşe yazısı, video arşivi, bülten"],
            ["Altyapı", "Next.js, Supabase veritabanı, yönetim paneli"],
            ["Nasıl gezilir", "Bir tasarım açın; alttaki çubuk veya ← → tuşlarıyla geçin"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[12px] uppercase tracking-[0.12em] text-[#16140f]/50">{k}</dt>
              <dd className="mt-1.5 leading-snug">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* tasarımlar */}
      <section className="mx-auto max-w-[1320px] px-5 lg:px-10">
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {designs.map((d) => (
            <Link key={d.href} href={d.href} className="group block">
              <div className="overflow-hidden rounded-[10px] border border-[#16140f]/12 bg-white p-1.5 shadow-[0_1px_2px_rgba(22,20,15,0.06)] transition-[border-color,box-shadow] duration-200 group-hover:border-[#16140f]/40 group-hover:shadow-[0_18px_40px_-18px_rgba(22,20,15,0.35)]">
                <div className="flex items-center gap-1.5 px-2 pb-2 pt-1">
                  <span className="h-2 w-2 rounded-full bg-[#16140f]/12" />
                  <span className="h-2 w-2 rounded-full bg-[#16140f]/12" />
                  <span className="h-2 w-2 rounded-full bg-[#16140f]/12" />
                  <span className="ml-2 truncate text-[11px] text-[#16140f]/40">Tasarım {d.no} — {d.name}</span>
                </div>
                <div className="overflow-hidden rounded-[6px]">
                  <LivePreview src={d.href} title={d.name} />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5">
                <span className="tabular-nums text-[13px] font-medium text-[#16140f]/45">{d.no}</span>
                <div>
                  <h2 className={`${S} text-[38px] leading-none sm:text-[44px]`}>{d.name}</h2>
                  <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.1em] text-[#16140f]/55">{d.tag}</p>
                </div>
                <span className="flex gap-0.5 self-center">
                  {d.swatch.map((c) => (
                    <span key={c} className="h-4 w-4 rounded-full border border-[#16140f]/15" style={{ background: c }} />
                  ))}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-5 border-t border-[#16140f]/10 pt-4">
                <span className="invisible tabular-nums text-[13px]">{d.no}</span>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <p className="max-w-[46ch] text-[15px] leading-[1.55] text-[#16140f]/75">{d.desc}</p>
                  <span className="inline-flex shrink-0 items-center gap-2 text-[14px] font-medium">
                    <span className="border-b border-transparent group-hover:border-[#16140f]">İncele</span>
                    <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* süreç */}
      <section className="mx-auto mt-28 max-w-[1320px] px-5 lg:px-10">
        <div className="border-t border-[#16140f] pt-6">
          <h2 className={`${S} text-[44px] leading-none sm:text-[56px]`}>Seçimden sonra</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([t, d], i) => (
              <li key={t} className="border-t border-[#16140f]/15 pt-4">
                <span className={`${S} text-[40px] italic leading-none text-[#16140f]/35`}>{i + 1}</span>
                <p className="mt-3 text-[16px] font-semibold">{t}</p>
                <p className="mt-1.5 text-[14.5px] leading-[1.55] text-[#16140f]/65">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="mx-auto mt-24 max-w-[1320px] px-5 pb-10 lg:px-10">
        <div className="flex flex-col justify-between gap-2 border-t border-[#16140f]/10 pt-5 text-[12.5px] text-[#16140f]/50 sm:flex-row">
          <span>Görseller, metinler ve rakamlar temsilîdir.</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
