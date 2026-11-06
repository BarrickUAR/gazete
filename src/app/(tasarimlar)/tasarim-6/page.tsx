import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { LiveClock } from "@/components/live-clock";
import { author, lead, articles, appearances, dossiers, img } from "@/lib/mock";

// Sky News / CNN ekran grafikleri: tek aile Archivo — alt bant, ticker ve başlıklarda dar genişlik (wdth 70), gövdede normal
const archivo = Archivo({ subsets: ["latin", "latin-ext"], axes: ["wdth"], variable: "--f-arc" });

export const metadata: Metadata = { title: "Tasarım 6 · Yayın Stüdyosu — Çetiner Çetin" };

const C = "font-[family-name:var(--f-arc)] uppercase [font-stretch:70%]";
const RED = "#e5141b";
const AMBER = "#ffc21a";
const NAVY = "#070f1e";
const PANEL = "#0c182d";

function Play({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l10.5-6.5z" />
    </svg>
  );
}

const schedule = [
  { t: "07:00", p: "Güne Bakış", s: "Sabah gündemi" },
  { t: "13:00", p: "Öğle Bülteni", s: "Bölge masası" },
  { t: "19:00", p: "Ana Haber", s: "Dış politika bölümü" },
  { t: "21:30", p: "Dünya Gündemi", s: "Seçim sonrası dış politika", now: true },
  { t: "23:45", p: "Gece Masası", s: "Bölge masası" },
];

export default function Studyo() {
  const ticker = [lead, ...articles].map((a) => a.title);
  const episodes = [
    { ...appearances[0], img: "election", ep: "B.142" },
    { ...appearances[1], img: "quake", ep: "B.141" },
    { ...appearances[2], img: "flags-row", ep: "B.140" },
    { ...appearances[3], img: "sudan", ep: "B.139" },
  ];

  return (
    <div className={`${archivo.variable} font-[family-name:var(--f-arc)] antialiased min-h-screen text-white`} style={{ background: NAVY }}>
      {/* kanal çubuğu */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between px-5 py-3.5 lg:px-8">
          <a href="#" className="flex items-center gap-3">
            <span className={`${C} grid h-9 w-11 place-items-center text-[20px] font-extrabold`} style={{ background: RED }}>ÇÇ</span>
            <span className={`${C} text-[22px] font-bold leading-none tracking-[0.02em]`}>Çetiner Çetin</span>
          </a>
          <nav className={`${C} hidden items-center gap-7 text-[16px] font-semibold tracking-[0.04em] text-white/70 lg:flex`}>
            {["Yayınlar", "Haber Merkezi", "Analiz", "Görüş", "Arşiv", "Hakkında"].map((n) => (
              <a key={n} href="#" className="transition-colors duration-150 hover:text-white">{n}</a>
            ))}
          </nav>
          <div className={`${C} flex items-center gap-3 text-[15px] font-semibold tracking-[0.06em]`}>
            <span className="hidden text-white/50 sm:inline">İstanbul</span>
            <span className="bg-white/10 px-2.5 py-1"><LiveClock /></span>
          </div>
        </div>
      </header>

      {/* ekran + akış */}
      <section className="mx-auto grid max-w-[1360px] gap-6 px-5 pt-8 lg:grid-cols-12 lg:px-8">
        <div className="min-w-0 lg:col-span-8">
          <div className="relative overflow-hidden">
            <img src={img("studio-tv", 1600, 900)} alt="" className="aspect-video w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
            {/* köşe grafikleri */}
            <div className={`${C} absolute left-4 top-4 flex items-center text-[15px] font-bold tracking-[0.08em]`}>
              <span className="px-2.5 py-1" style={{ background: RED }}>Canlı</span>
              <span className="bg-black/70 px-2.5 py-1">Stüdyo</span>
            </div>
            <div className={`${C} absolute right-4 top-4 bg-black/70 px-2.5 py-1 text-[15px] font-semibold tracking-[0.08em]`}>
              <LiveClock seconds={false} />
            </div>
            <a href="#" className="absolute left-1/2 top-1/2 hidden h-20 w-20 sm:grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white/80 bg-black/30 transition-colors duration-150 hover:bg-white hover:text-black" aria-label="İzle">
              <Play className="h-8 w-8" />
            </a>
            {/* alt bant */}
            <div className="absolute bottom-5 left-0 right-6 sm:bottom-8 sm:right-auto sm:max-w-[80%]">
              <div className="flex items-stretch">
                <span className={`${C} flex items-center px-3 text-[13px] font-extrabold tracking-[0.1em] sm:px-4 sm:text-[16px]`} style={{ background: RED }}>Özel</span>
                <span className={`${C} bg-white px-3 py-1.5 text-[24px] font-extrabold leading-none tracking-[-0.005em] text-[#070f1e] sm:px-4 sm:py-2.5 sm:text-[38px]`}>Seçim sonrası dış politika</span>
              </div>
              <div className="flex items-stretch">
                <span className={`${C} px-3 py-1 text-[13px] font-bold tracking-[0.04em] sm:px-4 sm:py-1.5 sm:text-[17px]`} style={{ background: "#13254a" }}>
                  {author.name}
                </span>
                <span className={`${C} hidden items-center bg-[#0b1630] px-3 text-[13px] font-medium tracking-[0.04em] text-white/75 sm:flex sm:text-[15px]`}>
                  Dış Politika Koordinatörü · {author.outlet}
                </span>
              </div>
            </div>
          </div>
          {/* son dakika */}
          <div className="flex items-stretch overflow-hidden bg-white text-[#070f1e]">
            <span className={`${C} z-10 flex shrink-0 items-center px-4 text-[17px] font-extrabold tracking-[0.04em] text-[#070f1e]`} style={{ background: AMBER }}>Son dakika</span>
            <div className="min-w-0 flex-1 overflow-hidden py-2">
              <div className="marquee">
                {[...ticker, ...ticker].map((t, i) => (
                  <span key={i} className={`${C} flex shrink-0 items-center gap-5 pl-5 text-[18px] font-semibold tracking-[0.02em]`}>
                    {t}
                    <span className="h-1.5 w-1.5 rotate-45" style={{ background: RED }} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="flex flex-col lg:col-span-4" style={{ background: PANEL }}>
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className={`${C} text-[24px] font-bold tracking-[0.02em]`}>Yayın akışı</h2>
            <span className={`${C} text-[14px] font-semibold tracking-[0.06em] text-white/50`}>Bugün</span>
          </div>
          <ol className="flex-1">
            {schedule.map((s) => (
              <li key={s.t} className={`flex items-center gap-4 border-b border-white/[0.06] px-5 py-4 ${s.now ? "bg-white text-[#070f1e]" : ""}`}>
                <span className={`${C} tnum w-14 text-[22px] font-bold`}>{s.t}</span>
                <div className="flex-1">
                  <p className={`${C} text-[19px] font-bold leading-tight`}>{s.p}</p>
                  <p className={`text-[13px] ${s.now ? "text-[#070f1e]/70" : "text-white/50"}`}>{s.s}</p>
                </div>
                {s.now && <span className={`${C} px-2 py-0.5 text-[12px] font-bold tracking-[0.1em] text-white`} style={{ background: RED }}>Şimdi</span>}
              </li>
            ))}
          </ol>
          <a href="#" className={`${C} flex items-center justify-between bg-white px-5 py-4 text-[17px] font-bold tracking-[0.04em] text-[#070f1e] transition-colors hover:bg-[#e6e9ef]`}>
            Tüm yayın arşivi <span aria-hidden>→</span>
          </a>
        </aside>
      </section>

      {/* son bölümler */}
      <section className="mx-auto max-w-[1360px] px-5 pt-16 lg:px-8">
        <div className="flex items-end justify-between border-b-2 pb-3" style={{ borderColor: RED }}>
          <h2 className={`${C} text-[40px] font-extrabold leading-none tracking-[0.01em]`}>Son yayınlar</h2>
          <a href="#" className={`${C} text-[15px] font-semibold tracking-[0.06em] text-white/60 hover:text-white`}>Arşiv →</a>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {episodes.map((e, i) => (
            <a key={e.topic} href="#" className="group block" style={{ background: PANEL }}>
              <div className="relative overflow-hidden">
                <img src={img(e.img, 640, 360)} alt="" className="aspect-video w-full object-cover opacity-85 transition-opacity duration-200 group-hover:opacity-100" />
                <span className={`${C} absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 text-[13px] font-semibold`}>{e.dur}</span>
                <span className="absolute bottom-0 left-0 h-[3px]" style={{ background: RED, width: `${[100, 64, 100, 22][i]}%` }} />
              </div>
              <div className="p-4">
                <p className={`${C} text-[13px] font-semibold tracking-[0.06em] text-white/55`}>{e.program} · {e.ep}</p>
                <p className={`${C} mt-1.5 text-[22px] font-bold leading-[1.05] group-hover:underline`}>{e.topic}</p>
                <p className="mt-2 text-[13px] text-white/50">{e.date} 2026</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* haber merkezi */}
      <section className="mx-auto max-w-[1360px] px-5 pt-16 lg:px-8">
        <div className="flex items-end justify-between border-b-2 pb-3" style={{ borderColor: RED }}>
          <h2 className={`${C} text-[40px] font-extrabold leading-none`}>Haber merkezi</h2>
          <a href="#" className={`${C} text-[15px] font-semibold tracking-[0.06em] text-white/60 hover:text-white`}>Tümü →</a>
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <article className="group lg:col-span-6">
            <img src={img(lead.img, 1200, 700)} alt="" className="aspect-[16/9] w-full object-cover" />
            <p className={`${C} mt-4 text-[14px] font-bold tracking-[0.08em]`} style={{ color: RED }}>{lead.section} · {lead.kind}</p>
            <h3 className={`${C} balance mt-1.5 text-[38px] font-bold leading-[1] group-hover:underline`}><a href={lead.url}>{lead.title}</a></h3>
            <p className="pretty mt-3 text-[16px] leading-[1.6] text-white/70">{lead.dek}</p>
          </article>
          <ul className="lg:col-span-6">
            {articles.slice(0, 5).map((a) => (
              <li key={a.slug}>
                <a href={a.url} className="group grid grid-cols-[96px_1fr] gap-4 border-b border-white/10 py-4 first:pt-0 sm:grid-cols-[140px_1fr]">
                  <img src={img(a.img, 300, 200)} alt="" className="aspect-[3/2] w-full object-cover" />
                  <span>
                    <span className={`${C} block text-[13px] font-semibold tracking-[0.06em] text-white/55`}>{a.kind} · {a.date}</span>
                    <span className={`${C} mt-1 block text-[21px] font-bold leading-[1.08] group-hover:underline`}>{a.title}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* rakamlar */}
      <section className="mt-16 border-y border-white/10" style={{ background: PANEL }}>
        <div className="mx-auto grid max-w-[1360px] grid-cols-2 lg:grid-cols-4">
          {dossiers.map((d) => [String(d.count), `${d.title} yazısı`]).map(([v, k], i) => (
            <div key={k} className={`px-5 py-8 lg:px-8 ${i > 0 ? "border-l border-white/10" : ""} ${i > 1 ? "border-t border-white/10 lg:border-t-0" : ""}`}>
              <p className={`${C} tnum text-[60px] font-extrabold leading-none`}>{v}</p>
              <p className={`${C} mt-2 text-[15px] font-semibold tracking-[0.08em] text-white/50`}>{k}</p>
            </div>
          ))}
        </div>
      </section>

      {/* muhabir */}
      <section className="mx-auto grid max-w-[1360px] items-center gap-10 px-5 py-16 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-7">
          <p className={`${C} text-[15px] font-bold tracking-[0.08em]`} style={{ color: RED }}>Muhabir</p>
          <h2 className={`${C} mt-2 text-[64px] font-extrabold leading-[0.88] sm:text-[104px]`}>{author.name}</h2>
          <p className={`${C} mt-3 text-[18px] font-semibold tracking-[0.04em] text-white/60`}>{author.role} · {author.outlet}</p>
          <p className="pretty mt-6 max-w-[60ch] text-[17px] leading-[1.65] text-white/80">{author.longBio}</p>
        </div>
        <div className="flex flex-col gap-3 lg:col-span-4 lg:col-start-9">
          <a href="#" className={`${C} flex items-center justify-between px-5 py-4 text-[20px] font-bold tracking-[0.04em]`} style={{ background: RED }}>Haber ihbarı <span aria-hidden>→</span></a>
          <a href="#" className={`${C} flex items-center justify-between border border-white/20 px-5 py-4 text-[20px] font-bold tracking-[0.04em] hover:border-white`}>Röportaj / konuk talebi <span aria-hidden>→</span></a>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className={`${C} mx-auto flex max-w-[1360px] flex-col justify-between gap-2 px-5 py-6 text-[14px] font-semibold tracking-[0.08em] text-white/40 sm:flex-row lg:px-8`}>
          <span>© 2026 Çetiner Çetin</span>
          <span>X · YouTube · Instagram · RSS</span>
        </div>
      </footer>
    </div>
  );
}
