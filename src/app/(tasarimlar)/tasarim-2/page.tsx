import type { Metadata } from "next";
import { Bodoni_Moda, IBM_Plex_Sans, IBM_Plex_Sans_Condensed, IBM_Plex_Mono } from "next/font/google";
import { Portrait } from "@/components/portrait";
import { author, lead, articles, columns, appearances, dossiers, img } from "@/lib/mock";

// Reuters Investigates / NYT Magazine karanlık feature dili:
// yüksek kontrastlı Bodoni manşet · Plex Sans gövde · Plex Condensed etiket · Plex Mono saha kayıtları
const bodoni = Bodoni_Moda({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"], axes: ["opsz"], variable: "--f-bod" });
const plex = IBM_Plex_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], variable: "--f-plex" });
const cond = IBM_Plex_Sans_Condensed({ subsets: ["latin", "latin-ext"], weight: ["500", "600"], variable: "--f-cond" });
const mono = IBM_Plex_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--f-mono" });

export const metadata: Metadata = { title: "Tasarım 2 · Muhabir Dosyası — Çetiner Çetin" };

const SERIF = "font-[family-name:var(--f-bod)]";
const SANS = "font-[family-name:var(--f-plex)]";
const COND = "font-[family-name:var(--f-cond)]";
const MONO = "font-[family-name:var(--f-mono)]";
const RED = "#d23a2f";
const PAPER = "#ece7df";
const MUTED = "#a39d93";

function Play() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l10.5-6.5z" />
    </svg>
  );
}

function Label({ children, red = false }: { children: React.ReactNode; red?: boolean }) {
  return (
    <p className={`${COND} text-[12px] font-semibold uppercase tracking-[0.14em]`} style={{ color: red ? RED : MUTED }}>
      {children}
    </p>
  );
}

function SectionTitle({ kicker, title, aside }: { kicker: string; title: string; aside?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-6 border-t border-white/20 pt-5">
      <div>
        <Label red>{kicker}</Label>
        <h2 className={`${SERIF} mt-3 text-[42px] font-medium italic leading-[0.95] tracking-[-0.015em] sm:text-[56px]`}>{title}</h2>
      </div>
      {aside}
    </div>
  );
}

export default function Muhabir() {
  const field = articles[1];
  const dispatches = [field, articles[0], articles[2], lead, articles[4]].map((a) => ({
    place: a.place ?? a.section,
    date: a.date,
    title: a.title,
    url: a.url,
  }));
  const [f1, f2, f3] = [lead, articles[2], articles[5]];
  const col = columns[0];

  return (
    <div className={`${bodoni.variable} ${plex.variable} ${cond.variable} ${mono.variable} ${SANS} min-h-screen bg-[#0c0c0b] antialiased`} style={{ color: PAPER }}>
      {/* header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0c0c0b]">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-3.5 lg:px-8">
          <a href="#" className="flex items-baseline gap-3">
            <span className={`${SERIF} text-[24px] font-semibold italic leading-none tracking-[-0.01em]`}>Çetiner Çetin</span>
            <span className={`${COND} hidden text-[11px] font-semibold uppercase tracking-[0.16em] sm:inline`} style={{ color: MUTED }}>Muhabir dosyası</span>
          </a>
          <nav className={`${COND} hidden items-center gap-7 text-[13px] font-medium uppercase tracking-[0.1em] md:flex`} style={{ color: "#c9c3b9" }}>
            {["Sahadan", "Analiz", "Görüş", "Ekranda", "Dosyalar", "Hakkında"].map((n) => (
              <a key={n} href="#" className="transition-colors duration-150 hover:text-white">{n}</a>
            ))}
          </nav>
          <a href="#iletisim" className={`${COND} border border-white/30 px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors duration-150 hover:border-white hover:bg-white hover:text-black`}>
            İletişim
          </a>
        </div>
      </header>

      {/* hero: tam genişlik fotoğraf + altında düz siyah başlık bloğu */}
      <section>
        <figure>
          <img src={img(field.img)} alt="" className="h-[52vh] min-h-[340px] w-full object-cover grayscale contrast-[1.15] brightness-90" />
          <figcaption className={`${MONO} mx-auto flex max-w-[1320px] justify-between gap-4 px-5 pt-2 text-[10.5px] uppercase tracking-[0.08em] lg:px-8`} style={{ color: MUTED }}>
            <span>Antakya, 6 Şubat depreminin ardından havadan görünüm</span>
            <span className="hidden sm:inline">Fotoğraf: Wikimedia Commons</span>
          </figcaption>
        </figure>
        <div className="mx-auto grid max-w-[1320px] gap-8 px-5 pb-16 pt-10 lg:grid-cols-12 lg:px-8 lg:pt-12">
          <div className="lg:col-span-8">
            <p className={`${MONO} text-[11.5px] uppercase tracking-[0.14em]`}>
              <span style={{ color: RED }}>■ Sahadan</span>
              <span className="mx-3 text-white/30">/</span>
              <span style={{ color: MUTED }}>{field.place} · {field.date}</span>
            </p>
            <h1 className={`${SERIF} balance mt-5 text-[46px] font-medium italic leading-[0.98] tracking-[-0.02em] sm:text-[72px] lg:text-[92px]`}>
              <a href={field.url} className="transition-colors duration-150 hover:text-white">{field.title}</a>
            </h1>
          </div>
          <div className="flex flex-col justify-end gap-6 lg:col-span-4 lg:border-l lg:border-white/15 lg:pl-8">
            <p className="pretty text-[17px] leading-[1.6] text-[#d3cdc3]">{field.dek}</p>
            <div className="flex items-center gap-5">
              <a href={field.url} className={`${COND} inline-flex items-center gap-2.5 px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#0c0c0b] transition-colors duration-150 hover:bg-white`} style={{ background: PAPER }}>
                Saha notunu oku <span aria-hidden>→</span>
              </a>
              <span className={`${MONO} text-[11px] uppercase`} style={{ color: MUTED }}>{field.readMin} dk</span>
            </div>
          </div>
        </div>
      </section>

      {/* son yazı şeridi */}
      <div className="border-y border-white/10 bg-[#121211]">
        <div className="mx-auto flex max-w-[1320px] items-center gap-5 overflow-hidden px-5 py-3 lg:px-8">
          <span className={`${COND} shrink-0 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white`} style={{ background: RED }}>
            Son yazı
          </span>
          <a href={articles[0].url} className="truncate text-[14px] text-[#d3cdc3] hover:text-white">
            <span className="font-medium text-white">{articles[0].title}</span> — {articles[0].dek}
          </a>
        </div>
      </div>

      {/* muhabir defteri */}
      <section className="mx-auto max-w-[1320px] px-5 py-20 lg:px-8">
        <SectionTitle
          kicker="Muhabir defteri"
          title="Haritada"
          aside={<a href="#" className={`${COND} text-[12px] font-semibold uppercase tracking-[0.12em] hover:text-white`} style={{ color: MUTED }}>Tüm yazılar →</a>}
        />
        <ol className="mt-10 border-t border-white/10">
          {dispatches.map((d, i) => (
            <li key={d.url}>
              <a href={d.url} className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-1 border-b border-white/10 py-5 sm:grid-cols-[3rem_14rem_1fr_7rem] sm:gap-x-6">
                <span className={`${MONO} tnum text-[11px]`} style={{ color: MUTED }}>{String(i + 1).padStart(2, "0")}</span>
                <span className={`${SERIF} text-[28px] italic leading-none sm:text-[32px]`} style={{ color: i === 0 ? RED : undefined }}>{d.place}</span>
                <span className="col-start-2 text-[16px] leading-snug text-[#d3cdc3] transition-colors duration-150 group-hover:text-white sm:col-start-auto">{d.title}</span>
                <span className={`${MONO} col-start-2 text-[11px] uppercase sm:col-start-auto sm:text-right`} style={{ color: MUTED }}>{d.date}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* öne çıkan analizler */}
      <section className="border-t border-white/10 bg-[#141413]">
        <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-20 lg:grid-cols-12 lg:px-8">
          <article className="lg:col-span-7">
            <img src={img(f1.img)} alt="" className="aspect-[16/10] w-full object-cover" />
            <div className="mt-5">
              <Label>{f1.section} · {f1.date}</Label>
              <h3 className={`${SERIF} balance mt-3 text-[36px] font-medium leading-[1.04] tracking-[-0.015em] sm:text-[46px]`}>
                <a href={f1.url} className="transition-colors duration-150 hover:text-white">{f1.title}</a>
              </h3>
              <p className="pretty mt-4 max-w-[60ch] text-[16px] leading-[1.65] text-[#bdb7ad]">{f1.dek}</p>
            </div>
          </article>
          <div className="flex flex-col gap-9 lg:col-span-5">
            {[f2, f3].map((a) => (
              <article key={a.slug} className="grid grid-cols-5 gap-5 border-b border-white/10 pb-9">
                <img src={img(a.img)} alt="" className="col-span-2 aspect-[4/5] w-full object-cover grayscale-[30%]" />
                <div className="col-span-3">
                  <Label>{a.section}</Label>
                  <h3 className={`${SERIF} balance mt-2.5 text-[24px] font-medium leading-[1.12]`}>
                    <a href={a.url} className="transition-colors duration-150 hover:text-white">{a.title}</a>
                  </h3>
                  <p className={`${MONO} mt-3 text-[11px] uppercase`} style={{ color: MUTED }}>{a.date} · {a.readMin} dk</p>
                </div>
              </article>
            ))}
            <a href={col.url} className="group block border-l-2 pl-6" style={{ borderColor: RED }}>
              <Label>Köşe yazısı · {col.date}</Label>
              <p className={`${SERIF} mt-3 text-[30px] italic leading-[1.12] transition-colors duration-150 group-hover:text-white`}>{col.title}</p>
              <p className="mt-3 text-[15px] leading-[1.55] text-[#bdb7ad]">{col.dek}</p>
            </a>
          </div>
        </div>
      </section>

      {/* dosyalar */}
      <section className="mx-auto max-w-[1320px] px-5 py-20 lg:px-8">
        <SectionTitle kicker="Arşiv" title="Dosyalar" />
        <div className="mt-10 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {dossiers.map((d) => (
            <a key={d.title} href="#" className="group block">
              <div className="overflow-hidden">
                <img src={img(d.img)} alt="" className="aspect-[4/5] w-full object-cover grayscale contrast-[1.1] transition-[filter] duration-200 group-hover:grayscale-0" />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-white/15 pt-3">
                <p className={`${SERIF} text-[26px] font-medium leading-none`}>{d.title}</p>
                <p className={`${MONO} tnum shrink-0 text-[11px]`} style={{ color: MUTED }}>{d.count} yazı</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ekranda */}
      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-20 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <Label red>{author.outlet}</Label>
            <h2 className={`${SERIF} mt-3 text-[42px] font-medium italic leading-[0.95] sm:text-[56px]`}>Ekranda</h2>
            <p className="mt-5 max-w-[38ch] text-[15px] leading-[1.6] text-[#bdb7ad]">Canlı bağlantılar, özel yayınlar ve stüdyo değerlendirmeleri.</p>
          </div>
          <ul className="border-t border-white/10 lg:col-span-8">
            {appearances.map((x) => (
              <li key={x.topic}>
                <a href="#" className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-white/10 py-5">
                  <span className="grid h-10 w-10 place-items-center border border-white/25 transition-colors duration-150 group-hover:border-transparent group-hover:bg-[#ece7df] group-hover:text-[#0c0c0b]">
                    <Play />
                  </span>
                  <span>
                    <span className="block text-[17px] font-medium">{x.topic}</span>
                    <span className={`${COND} mt-1 block text-[11.5px] font-semibold uppercase tracking-[0.12em]`} style={{ color: MUTED }}>{x.program}</span>
                  </span>
                  <span className={`${MONO} tnum text-right text-[11.5px]`} style={{ color: MUTED }}>{x.date}<br />{x.dur}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* hakkında */}
      <section id="iletisim" className="text-[#0c0c0b]" style={{ background: PAPER }}>
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 py-20 lg:grid-cols-12 lg:px-8">
          <Portrait bg="#1a1a18" className="aspect-[4/5] w-full lg:col-span-4" />
          <div className="lg:col-span-7 lg:col-start-6">
            <p className={`${COND} text-[12px] font-semibold uppercase tracking-[0.14em]`} style={{ color: RED }}>Hakkında</p>
            <h2 className={`${SERIF} mt-4 text-[52px] font-medium italic leading-[0.95] tracking-[-0.02em] sm:text-[76px]`}>{author.name}</h2>
            <p className={`${COND} mt-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#4a463f]`}>{author.role} · {author.outlet}</p>
            <p className={`${SERIF} pretty mt-7 text-[22px] leading-[1.5]`}>{author.longBio}</p>
            <div className={`${COND} mt-9 flex flex-wrap gap-3 text-[13px] font-semibold uppercase tracking-[0.08em]`}>
              <a href="#" className="bg-[#0c0c0b] px-5 py-3 transition-colors hover:bg-[#2a2a28]" style={{ color: PAPER }}>Haber ihbarı gönder</a>
              <a href="#" className="border border-[#0c0c0b]/30 px-5 py-3 transition-colors hover:border-[#0c0c0b]">Basın & röportaj talebi</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className={`${MONO} mx-auto flex max-w-[1320px] flex-col justify-between gap-3 px-5 py-8 text-[11px] uppercase tracking-[0.14em] sm:flex-row lg:px-8`} style={{ color: MUTED }}>
          <span>© 2026 Çetiner Çetin</span>
          <span>X · Instagram · YouTube · RSS</span>
        </div>
      </footer>
    </div>
  );
}
