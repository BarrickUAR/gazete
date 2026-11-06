import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Portrait } from "@/components/portrait";
import { author, articles, columns, appearances, dossiers, img } from "@/lib/mock";

const fr = Fraunces({ subsets: ["latin", "latin-ext"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"], variable: "--f-fr" });
const plex = IBM_Plex_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], variable: "--f-plex" });
const mono = IBM_Plex_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--f-mono" });

export const metadata: Metadata = { title: "Tasarım 2 · Muhabir Dosyası — Çetiner Çetin" };

const SERIF = "font-[family-name:var(--f-fr)]";
const SANS = "font-[family-name:var(--f-plex)]";
const MONO = "font-[family-name:var(--f-mono)]";
const RED = "#d23a2f";

function Play() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l10.5-6.5z" />
    </svg>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className={`${MONO} text-[11px] uppercase tracking-[0.18em] text-[#8f8a82]`}>{children}</p>;
}

export default function Muhabir() {
  const field = articles[1];
  const dispatches = [
    { place: "Kiev", date: "03.11.2026", title: "Sirenler arasında bir kış hazırlığı" },
    { place: "Brüksel", date: "05.11.2026", title: "Zirve salonunun dışında kalanlar" },
    { place: "Gaziantep", date: "28.10.2026", title: "Sınır hattında ikinci aşama" },
    { place: "Bakü", date: "21.10.2026", title: "Koridorun ilk treni" },
    { place: "Odessa", date: "14.10.2026", title: "Limanda tahıl ve mayın" },
  ];
  const [f1, f2, f3] = [articles[0], articles[2], articles[5]];

  return (
    <div className={`${fr.variable} ${plex.variable} ${mono.variable} ${SANS} min-h-screen bg-[#0e0e0d] text-[#ece8e1]`}>
      {/* header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0e0e0d]">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-4 lg:px-8">
          <a href="#" className="flex items-center gap-3">
            <span className={`${SERIF} grid h-9 w-9 place-items-center border border-[#ece8e1]/70 text-[15px] italic`}>ÇÇ</span>
            <span className={`${MONO} text-[12px] uppercase tracking-[0.22em]`}>Çetiner Çetin</span>
          </a>
          <nav className="hidden items-center gap-7 text-[13.5px] text-[#bdb7ad] md:flex">
            {["Sahadan", "Analiz", "Görüş", "Ekranda", "Dosyalar", "Hakkında"].map((n) => (
              <a key={n} href="#" className="transition-colors duration-150 hover:text-white">{n}</a>
            ))}
          </nav>
          <a href="#iletisim" className="border border-white/25 px-3.5 py-1.5 text-[12.5px] font-medium transition-colors duration-150 hover:border-white">
            İletişim
          </a>
        </div>
      </header>

      {/* hero */}
      <section className="relative">
        <img src={img(field.img, 2000, 1100)} alt="" className="h-[78vh] min-h-[520px] w-full object-cover opacity-60 grayscale contrast-125" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0d] via-[#0e0e0d]/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1320px] px-5 pb-14 lg:px-8">
            <p className={`${MONO} text-[12px] uppercase tracking-[0.2em]`}>
              <span style={{ color: RED }}>Sahadan</span>
              <span className="mx-3 text-white/40">/</span>
              {field.place} — 03.11.2026
            </p>
            <h1 className={`${SERIF} balance mt-5 max-w-[16ch] text-[44px] font-light leading-[1.02] tracking-[-0.02em] sm:text-[64px] lg:text-[86px]`}>
              {field.title.split(": ")[1] ?? field.title}
            </h1>
            <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="pretty max-w-[52ch] text-[17px] leading-[1.6] text-[#cfc9bf]">{field.dek} Enerji santrallerinin önünde, sığınaklarda ve okullarda bir hafta.</p>
              <a href="#" className="inline-flex shrink-0 items-center gap-2.5 bg-[#ece8e1] px-5 py-3 text-[14px] font-semibold text-[#0e0e0d] transition-colors duration-150 hover:bg-white">
                Saha notunu oku <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* son dakika şeridi */}
      <div className="border-y border-white/10">
        <div className="mx-auto flex max-w-[1320px] items-center gap-5 overflow-hidden px-5 py-3 lg:px-8">
          <span className={`${MONO} shrink-0 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white`} style={{ background: RED }}>
            Son dosya
          </span>
          <p className="truncate text-[14px] text-[#cfc9bf]">
            NATO zirvesinin perde arkası: Savunma harcamalarında yeni eşik — Müttefikler yüzde 3,5 hedefinde uzlaştı.
          </p>
        </div>
      </div>

      {/* sahadan rota */}
      <section className="mx-auto max-w-[1320px] px-5 py-20 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Label>Muhabir defteri</Label>
            <h2 className={`${SERIF} mt-3 text-[40px] font-light leading-none tracking-[-0.01em] sm:text-[52px]`}>Sahadan</h2>
          </div>
          <a href="#" className="text-[13.5px] text-[#bdb7ad] underline-offset-4 hover:text-white hover:underline">Tüm saha notları</a>
        </div>
        <ol className="mt-10 grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-5">
          {dispatches.map((d, i) => (
            <li key={d.place} className={`group border-b border-white/10 py-6 lg:border-b-0 lg:py-8 ${i > 0 ? "lg:border-l lg:pl-6" : ""} lg:pr-6`}>
              <p className={`${MONO} tnum text-[11px] text-[#8f8a82]`}>{String(i + 1).padStart(2, "0")} — {d.date}</p>
              <p className={`${SERIF} mt-4 text-[30px] italic leading-none`} style={{ color: i === 0 ? RED : undefined }}>{d.place}</p>
              <p className="mt-3 text-[15px] leading-snug text-[#cfc9bf] group-hover:text-white">{d.title}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* öne çıkan analizler */}
      <section className="border-t border-white/10 bg-[#151514]">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-20 lg:grid-cols-12 lg:px-8">
          <article className="lg:col-span-7">
            <img src={img(f1.img, 1400, 900)} alt="" className="aspect-[16/10] w-full object-cover" />
            <Label>{f1.section} · {f1.date}</Label>
            <h3 className={`${SERIF} balance mt-3 text-[34px] font-normal leading-[1.1] tracking-[-0.01em] sm:text-[40px]`}>
              <a href="#" className="hover:text-white">{f1.title}</a>
            </h3>
            <p className="pretty mt-4 max-w-[60ch] text-[16px] leading-[1.65] text-[#bdb7ad]">{f1.dek}</p>
          </article>
          <div className="flex flex-col gap-10 lg:col-span-5">
            {[f2, f3].map((a) => (
              <article key={a.slug} className="grid grid-cols-5 gap-5 border-b border-white/10 pb-10 last:border-0">
                <img src={img(a.img, 600, 600)} alt="" className="col-span-2 aspect-square w-full object-cover" />
                <div className="col-span-3">
                  <Label>{a.kind}</Label>
                  <h3 className={`${SERIF} balance mt-2.5 text-[23px] leading-[1.18]`}>
                    <a href="#" className="hover:text-white">{a.title}</a>
                  </h3>
                  <p className={`${MONO} mt-3 text-[11px] text-[#8f8a82]`}>{a.readMin} DK OKUMA</p>
                </div>
              </article>
            ))}
            <blockquote className="border-l-2 pl-6" style={{ borderColor: RED }}>
              <p className={`${SERIF} text-[26px] font-light italic leading-[1.3]`}>
                &ldquo;Her kriz kameraların önünde çözülmez. Bazen en büyük başarı, hiç haber olmayan görüşmedir.&rdquo;
              </p>
              <footer className={`${MONO} mt-4 text-[11px] uppercase tracking-[0.18em] text-[#8f8a82]`}>{columns[0].title}</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* dosyalar */}
      <section className="mx-auto max-w-[1320px] px-5 py-20 lg:px-8">
        <Label>Arşiv</Label>
        <h2 className={`${SERIF} mt-3 text-[40px] font-light leading-none sm:text-[52px]`}>Dosyalar</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dossiers.map((d) => (
            <a key={d.title} href="#" className="group relative block overflow-hidden">
              <img src={img(d.img, 600, 820, true)} alt="" className="aspect-[3/4] w-full object-cover opacity-60 transition-opacity duration-200 group-hover:opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className={`${MONO} tnum text-[11px] text-[#cfc9bf]`}>{d.count} HABER · {d.years}</p>
                <p className={`${SERIF} mt-2 text-[28px] leading-none`}>{d.title}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ekranda */}
      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-20 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <Label>{author.outlet}</Label>
            <h2 className={`${SERIF} mt-3 text-[40px] font-light leading-none sm:text-[52px]`}>Ekranda</h2>
            <p className="mt-5 max-w-[38ch] text-[15px] leading-[1.6] text-[#bdb7ad]">Canlı bağlantılar, özel yayınlar ve stüdyo değerlendirmeleri — tam arşiv.</p>
          </div>
          <ul className="lg:col-span-8">
            {appearances.map((x) => (
              <li key={x.topic}>
                <a href="#" className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-white/10 py-5">
                  <span className="grid h-10 w-10 place-items-center border border-white/25 transition-colors duration-150 group-hover:border-transparent group-hover:bg-[#ece8e1] group-hover:text-[#0e0e0d]">
                    <Play />
                  </span>
                  <span>
                    <span className="block text-[17px] font-medium">{x.topic}</span>
                    <span className={`${MONO} mt-1 block text-[11px] uppercase tracking-[0.12em] text-[#8f8a82]`}>{x.program}</span>
                  </span>
                  <span className={`${MONO} tnum text-right text-[12px] text-[#8f8a82]`}>{x.date}<br />{x.dur}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* hakkında */}
      <section id="iletisim" className="border-t border-white/10 bg-[#ece8e1] text-[#0e0e0d]">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 py-20 lg:grid-cols-12 lg:px-8">
          <Portrait font={SERIF} bg="#1a1a18" fg="#ece8e1" className="aspect-[4/5] w-full lg:col-span-4" />
          <div className="lg:col-span-7 lg:col-start-6">
            <p className={`${MONO} text-[11px] uppercase tracking-[0.18em] text-[#6b665e]`}>Hakkında</p>
            <h2 className={`${SERIF} mt-4 text-[48px] font-light leading-[1] tracking-[-0.02em] sm:text-[64px]`}>{author.name}</h2>
            <p className="mt-3 text-[14px] font-medium text-[#4a463f]">{author.role} · {author.outlet}</p>
            <p className={`${SERIF} pretty mt-7 text-[21px] leading-[1.55]`}>{author.longBio}</p>
            <div className="mt-9 flex flex-wrap gap-3 text-[14px] font-semibold">
              <a href="#" className="bg-[#0e0e0d] px-5 py-3 text-[#ece8e1]">Haber ihbarı gönder</a>
              <a href="#" className="border border-[#0e0e0d]/30 px-5 py-3 hover:border-[#0e0e0d]">Basın & röportaj talebi</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className={`${MONO} mx-auto flex max-w-[1320px] flex-col justify-between gap-3 px-5 py-8 text-[11px] uppercase tracking-[0.16em] text-[#8f8a82] sm:flex-row lg:px-8`}>
          <span>© 2026 Çetiner Çetin</span>
          <span>X · Instagram · YouTube · RSS</span>
        </div>
      </footer>
    </div>
  );
}
