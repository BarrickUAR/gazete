import type { Metadata } from "next";
import { Geist, Geist_Mono, Spectral } from "next/font/google";
import { Portrait } from "@/components/portrait";
import { author, lead as top0, articles, columns, appearances, dossiers, img } from "@/lib/mock";

// Monocle / kişisel basın kiti: Geist (arayüz, gövde) · Geist Mono (tarih, meta) · Spectral (başlıklar)
const geist = Geist({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], variable: "--f-geist" });
const gmono = Geist_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--f-gmono" });
const spec = Spectral({ subsets: ["latin", "latin-ext"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"], variable: "--f-sp" });

export const metadata: Metadata = { title: "Tasarım 5 · Portfolyo — Çetiner Çetin" };

const SP = "font-[family-name:var(--f-sp)]";
const MONO = "font-[family-name:var(--f-gmono)]";
const INK = "#15171a";
const MUTED = "#6b7076";
const LINE = "#e6e6e3";
const ACC = "#1f5b45";

// Habertürk'teki son 20 yazının konu dağılımı
const filters = [
  ["Tümü", 20],
  ["Seçim 2023", 7],
  ["Dış politika", 6],
  ["Suriye", 4],
  ["Deprem", 3],
] as const;

const beats = ["Dış politika", "Güvenlik", "Orta Doğu", "NATO", "Seçimler", "Kafkasya"];

function Meta({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`${MONO} text-[11.5px] uppercase tracking-[0.04em] ${className}`} style={{ color: MUTED }}>{children}</p>;
}

export default function Portfolyo() {
  const lead = articles[3];
  const feed = [articles[0], articles[1], columns[0], articles[2], top0, articles[4], articles[5], columns[1]];

  return (
    <div className={`${geist.variable} ${gmono.variable} ${spec.variable} font-[family-name:var(--f-geist)] min-h-screen bg-white antialiased`} style={{ color: INK }}>
      <div className="mx-auto max-w-[1400px] lg:grid lg:grid-cols-[400px_1fr]">
        {/* sabit kimlik paneli */}
        <aside className="border-b lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r" style={{ borderColor: LINE, background: "#f7f7f5" }}>
          <div className="flex min-h-full flex-col px-6 py-8 lg:px-10 lg:py-10">
            <div className="flex items-center gap-4">
              <Portrait small bg="#e4e4df" className="h-16 w-16 rounded-full ring-1 ring-black/5" />
              <div>
                <Meta>Gazeteci</Meta>
                <p className="mt-1 text-[14px] font-medium">{author.outlet}</p>
              </div>
            </div>

            <h1 className={`${SP} mt-8 text-[48px] font-semibold leading-[0.95] tracking-[-0.025em] lg:text-[58px]`}>
              Çetiner
              <br />
              Çetin
            </h1>
            <p className="mt-4 text-[14.5px] font-medium leading-snug">{author.role}</p>
            <p className={`${SP} pretty mt-4 text-[17px] leading-[1.55]`} style={{ color: "#3b3f44" }}>
              {author.shortBio}
            </p>

            <div className="mt-6">
              <Meta>Alanlar</Meta>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {beats.map((b) => (
                  <li key={b} className="rounded border bg-white px-2 py-1 text-[12.5px]" style={{ borderColor: "#dcdcd7" }}>{b}</li>
                ))}
              </ul>
            </div>

            <nav className="mt-8 hidden border-t lg:block" style={{ borderColor: LINE }}>
              {[
                ["Yazılar", "20"],
                ["Ekranda", ""],
                ["Dosyalar", "4"],
                ["Hakkında", ""],
                ["İletişim", ""],
              ].map(([k, v], i) => (
                <a key={k} href="#" className="group flex items-center justify-between border-b py-2.5 text-[14.5px]" style={{ borderColor: LINE }}>
                  <span className={i === 0 ? "font-semibold" : "transition-colors duration-150 group-hover:text-[#1f5b45]"}>{k}</span>
                  <span className={`${MONO} tnum text-[12px]`} style={{ color: MUTED }}>{v}</span>
                </a>
              ))}
            </nav>

            <div className="mt-8 flex gap-2 lg:mt-auto lg:pt-8">
              <a href="#" className="flex-1 rounded-md px-4 py-3 text-center text-[14px] font-medium text-white transition-colors duration-150 hover:bg-[#1f5b45]" style={{ background: INK }}>
                İletişime geç
              </a>
              <a href="#" className="rounded-md border bg-white px-4 py-3 text-[14px] font-medium transition-colors duration-150 hover:border-[#15171a]" style={{ borderColor: "#d4d4cf" }}>
                Basın kiti
              </a>
            </div>
            <Meta className="mt-5">X · YouTube · Instagram · RSS</Meta>
          </div>
        </aside>

        {/* akış */}
        <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-14 lg:py-10">
          {/* öne çıkan */}
          <div className="flex items-baseline justify-between">
            <Meta>Öne çıkan</Meta>
            <Meta>{lead.date}</Meta>
          </div>
          <a href={lead.url} className="group mt-4 block">
            <img src={img(lead.img)} alt="" className="aspect-[16/8] w-full rounded-lg object-cover" />
            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_300px]">
              <div>
                <p className="text-[13px] font-medium" style={{ color: ACC }}>{lead.section}</p>
                <h2 className={`${SP} balance mt-2 text-[36px] font-semibold leading-[1.05] tracking-[-0.02em] transition-colors duration-150 group-hover:text-[#1f5b45] sm:text-[48px]`}>{lead.title}</h2>
              </div>
              <p className={`${SP} pretty text-[17.5px] leading-[1.55] xl:pt-8`} style={{ color: "#3b3f44" }}>{lead.dek}</p>
            </div>
          </a>

          {/* filtre */}
          <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 border-b" style={{ borderColor: LINE }}>
            {filters.map(([k, n], i) => (
              <a
                key={k}
                href="#"
                className={`-mb-px border-b-2 pb-3 text-[14px] transition-colors duration-150 ${i === 0 ? "border-[#1f5b45] font-semibold text-[#1f5b45]" : "border-transparent hover:text-[#1f5b45]"}`}
              >
                {k} <span className={`${MONO} tnum ml-0.5 text-[11.5px]`} style={{ color: i === 0 ? ACC : "#9a9ea3" }}>{n}</span>
              </a>
            ))}
          </div>

          {/* liste */}
          <ul>
            {feed.map((a) => (
              <li key={a.slug}>
                <a href={a.url} className="group grid grid-cols-[1fr_96px] gap-5 border-b py-6 sm:grid-cols-[110px_1fr_160px] sm:gap-8" style={{ borderColor: LINE }}>
                  <div className="hidden sm:block">
                    <p className={`${MONO} tnum text-[12px] uppercase`}>{a.date}</p>
                    <p className={`${MONO} mt-1 text-[11.5px]`} style={{ color: MUTED }}>{a.readMin} dk</p>
                  </div>
                  <div>
                    <p className="text-[12.5px] font-medium" style={{ color: ACC }}>
                      {a.kind}
                      {a.place && <span style={{ color: MUTED }} className="font-normal"> · {a.place}</span>}
                    </p>
                    <h3 className={`${SP} balance mt-1.5 text-[23px] font-semibold leading-[1.15] tracking-[-0.01em] transition-colors duration-150 group-hover:text-[#1f5b45] sm:text-[26px]`}>{a.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-[1.55]" style={{ color: "#4a4e53" }}>{a.dek}</p>
                    <Meta className="mt-2 sm:hidden">{a.date} · {a.readMin} dk</Meta>
                  </div>
                  <img src={img(a.img)} alt="" className="aspect-[4/3] w-full rounded-md object-cover" />
                </a>
              </li>
            ))}
          </ul>
          <a href="#" className="mt-6 inline-flex rounded-md border px-4 py-2.5 text-[14px] font-medium transition-colors duration-150 hover:border-[#15171a]" style={{ borderColor: "#d4d4cf" }}>
            Daha fazla yükle
          </a>

          {/* ekranda */}
          <section className="mt-20">
            <div className="flex items-baseline justify-between border-b pb-3" style={{ borderColor: LINE }}>
              <h2 className={`${SP} text-[30px] font-semibold tracking-[-0.015em]`}>Ekranda</h2>
              <a href="#" className="text-[13.5px] font-medium hover:underline" style={{ color: ACC }}>Tüm yayınlar</a>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {appearances.map((x, i) => (
                <a key={x.topic} href="#" className="group flex gap-4">
                  <div className="relative w-[44%] shrink-0 overflow-hidden rounded-md">
                    <img src={img(["election", "quake", "flags-row", "sudan"][i])} alt="" className="aspect-video w-full object-cover" />
                    <span className={`${MONO} absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[10.5px] text-white`}>{x.dur}</span>
                  </div>
                  <div>
                    <Meta>{x.program}</Meta>
                    <p className={`${SP} mt-1 text-[18.5px] font-semibold leading-[1.2] transition-colors group-hover:text-[#1f5b45]`}>{x.topic}</p>
                    <Meta className="mt-1">{x.date}</Meta>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* alıntı + dosyalar */}
          <section className="mt-20 grid gap-10 rounded-xl p-8 sm:p-10 xl:grid-cols-[1.2fr_1fr]" style={{ background: "#f1f4f1" }}>
            <a href={columns[1].url} className="group block">
              <Meta>Köşe yazısı · {columns[1].date}</Meta>
              <p className={`${SP} mt-3 text-[32px] italic leading-[1.2] transition-colors group-hover:text-[#1f5b45] sm:text-[38px]`}>{columns[1].title}</p>
              <p className="mt-4 text-[15px] leading-[1.6]" style={{ color: "#4a4e53" }}>{columns[1].dek}</p>
            </a>
            <div>
              <Meta>Haber dosyaları</Meta>
              <ul className="mt-3">
                {dossiers.map((d) => (
                  <li key={d.title}>
                    <a href="#" className="group flex items-baseline justify-between border-b py-3" style={{ borderColor: "#dbe1da" }}>
                      <span className={`${SP} text-[19px] font-medium group-hover:text-[#1f5b45]`}>{d.title}</span>
                      <span className={`${MONO} tnum text-[11.5px]`} style={{ color: MUTED }}>{d.count} yazı</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <footer className={`${MONO} mt-16 flex flex-col justify-between gap-2 border-t pt-5 text-[11.5px] uppercase sm:flex-row`} style={{ borderColor: LINE, color: MUTED }}>
            <span>© 2026 Çetiner Çetin</span>
            <span>X · YouTube · RSS</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
