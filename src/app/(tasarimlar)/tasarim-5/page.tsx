import type { Metadata } from "next";
import { Schibsted_Grotesk, Spectral } from "next/font/google";
import { Portrait } from "@/components/portrait";
import { author, lead as top0, articles, columns, appearances, dossiers, img } from "@/lib/mock";

const grot = Schibsted_Grotesk({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], variable: "--f-sg" });
const spec = Spectral({ subsets: ["latin", "latin-ext"], weight: ["300", "400"], style: ["normal", "italic"], variable: "--f-sp" });

export const metadata: Metadata = { title: "Tasarım 5 · Portfolyo — Çetiner Çetin" };

const SP = "font-[family-name:var(--f-sp)]";
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

export default function Portfolyo() {
  const lead = articles[3];
  const feed = [articles[0], articles[1], columns[0], articles[2], top0, articles[4], articles[5], columns[1]];

  return (
    <div className={`${grot.variable} ${spec.variable} font-[family-name:var(--f-sg)] min-h-screen bg-white`} style={{ color: INK }}>
      <div className="mx-auto max-w-[1400px] lg:grid lg:grid-cols-[400px_1fr]">
        {/* sabit kimlik paneli */}
        <aside className="border-b lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r" style={{ borderColor: LINE, background: "#f7f7f5" }}>
          <div className="flex h-full flex-col px-6 py-8 lg:px-10 lg:py-10">
            <div className="flex items-center gap-4">
              <Portrait small font={SP} bg="#e4e4df" fg={INK} className="h-14 w-14 rounded-full" />
              <div>
                <p className="text-[13px] font-medium" style={{ color: ACC }}>Gazeteci</p>
                <p className="text-[13px]" style={{ color: MUTED }}>{author.outlet}</p>
              </div>
            </div>

            <h1 className="mt-8 text-[44px] font-semibold leading-[0.98] tracking-[-0.035em] lg:text-[52px]">
              Çetiner
              <br />
              Çetin
            </h1>
            <p className="mt-4 text-[15px] font-medium leading-snug">
              {author.role}, <span style={{ color: ACC }}>{author.outlet}</span>
            </p>
            <p className={`${SP} pretty mt-5 text-[17px] font-light leading-[1.55]`} style={{ color: "#3b3f44" }}>
              {author.shortBio}
            </p>

            <nav className="mt-8 hidden border-t lg:block" style={{ borderColor: LINE }}>
              {[
                ["Yazılar", "20"],
                ["Ekranda", ""],
                ["Dosyalar", "4"],
                ["Hakkında", ""],
                ["İletişim", ""],
              ].map(([k, v], i) => (
                <a key={k} href="#" className="group flex items-center justify-between border-b py-3 text-[15px]" style={{ borderColor: LINE }}>
                  <span className={i === 0 ? "font-semibold" : "transition-colors duration-150 group-hover:text-[#1f5b45]"}>{k}</span>
                  <span className="tnum text-[13px]" style={{ color: MUTED }}>{v}</span>
                </a>
              ))}
            </nav>

            <div className="mt-8 flex gap-2 lg:mt-auto">
              <a href="#" className="flex-1 rounded-md px-4 py-3 text-center text-[14px] font-semibold text-white transition-opacity duration-150 hover:opacity-90" style={{ background: INK }}>
                İletişime geç
              </a>
              <a href="#" className="rounded-md border px-4 py-3 text-[14px] font-semibold transition-colors duration-150 hover:border-[#15171a]" style={{ borderColor: "#d4d4cf" }}>
                Bülten
              </a>
            </div>
            <p className="mt-5 text-[12.5px]" style={{ color: MUTED }}>X · YouTube · Instagram · RSS</p>
          </div>
        </aside>

        {/* akış */}
        <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-14 lg:py-10">
          {/* öne çıkan */}
          <p className="text-[13px] font-medium" style={{ color: MUTED }}>Öne çıkan · {lead.date}</p>
          <a href={lead.url} className="group mt-4 block">
            <div className="overflow-hidden rounded-lg">
              <img src={img(lead.img, 1600, 900)} alt="" className="aspect-[16/8] w-full object-cover transition-transform duration-200 group-hover:scale-[1.01]" />
            </div>
            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_280px]">
              <div>
                <p className="text-[13px] font-semibold" style={{ color: ACC }}>{lead.section} · {lead.kind}</p>
                <h2 className="balance mt-2 text-[34px] font-semibold leading-[1.08] tracking-[-0.025em] sm:text-[42px]">{lead.title}</h2>
              </div>
              <p className={`${SP} pretty text-[17px] font-light leading-[1.55] xl:pt-7`} style={{ color: "#3b3f44" }}>{lead.dek}</p>
            </div>
          </a>

          {/* filtre */}
          <div className="mt-14 flex flex-wrap items-center gap-2 border-b pb-4" style={{ borderColor: LINE }}>
            {filters.map(([k, n], i) => (
              <a
                key={k}
                href="#"
                className={`rounded-full border px-3.5 py-1.5 text-[13.5px] font-medium transition-colors duration-150 ${i === 0 ? "border-[#15171a] bg-[#15171a] text-white" : "border-[#e0e0dc] hover:border-[#15171a]"}`}
              >
                {k} <span className={`tnum ml-1 ${i === 0 ? "text-white/60" : "text-[#9a9ea3]"}`}>{n}</span>
              </a>
            ))}
          </div>

          {/* liste */}
          <ul>
            {feed.map((a) => (
              <li key={a.slug}>
                <a href={a.url} className="group grid grid-cols-[1fr_96px] gap-5 border-b py-6 sm:grid-cols-[110px_1fr_150px] sm:gap-8" style={{ borderColor: LINE }}>
                  <div className="hidden sm:block">
                    <p className="tnum text-[13.5px] font-medium">{a.date.replace(" 2026", "")}</p>
                    <p className="mt-1 text-[12.5px]" style={{ color: MUTED }}>{a.readMin} dk</p>
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold" style={{ color: ACC }}>
                      {a.kind}
                      {a.place && <span style={{ color: MUTED }} className="font-normal"> · {a.place}</span>}
                    </p>
                    <h3 className="balance mt-1.5 text-[21px] font-semibold leading-[1.22] tracking-[-0.015em] transition-colors duration-150 group-hover:text-[#1f5b45] sm:text-[23px]">{a.title}</h3>
                    <p className={`${SP} mt-2 text-[16px] font-light leading-[1.5]`} style={{ color: "#4a4e53" }}>{a.dek}</p>
                    <p className="mt-2 text-[12.5px] sm:hidden" style={{ color: MUTED }}>{a.date} · {a.readMin} dk</p>
                  </div>
                  <img src={img(a.img, 400, 300)} alt="" className="aspect-[4/3] w-full rounded-md object-cover" />
                </a>
              </li>
            ))}
          </ul>
          <a href="#" className="mt-6 inline-flex rounded-md border px-4 py-2.5 text-[14px] font-semibold transition-colors duration-150 hover:border-[#15171a]" style={{ borderColor: "#d4d4cf" }}>
            Daha fazla yükle
          </a>

          {/* ekranda */}
          <section className="mt-20">
            <div className="flex items-baseline justify-between border-b pb-3" style={{ borderColor: LINE }}>
              <h2 className="text-[26px] font-semibold tracking-[-0.02em]">Ekranda</h2>
              <a href="#" className="text-[13.5px] font-medium hover:underline" style={{ color: ACC }}>Tüm yayınlar</a>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {appearances.map((x, i) => (
                <a key={x.topic} href="#" className="group flex gap-4">
                  <div className="relative w-[44%] shrink-0 overflow-hidden rounded-md">
                    <img src={img(["election", "quake", "flags-row", "sudan"][i], 480, 270)} alt="" className="aspect-video w-full object-cover" />
                    <span className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold text-white">{x.dur}</span>
                  </div>
                  <div>
                    <p className="text-[12.5px] font-medium" style={{ color: MUTED }}>{x.program}</p>
                    <p className="mt-1 text-[16.5px] font-semibold leading-snug group-hover:text-[#1f5b45]">{x.topic}</p>
                    <p className="mt-1 text-[12.5px]" style={{ color: MUTED }}>{x.date}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* alıntı + dosyalar */}
          <section className="mt-20 grid gap-10 rounded-xl p-8 sm:p-10 xl:grid-cols-[1.2fr_1fr]" style={{ background: "#f3f5f2" }}>
            <a href={columns[1].url} className="group block">
              <p className="text-[13px] font-semibold" style={{ color: ACC }}>Köşe yazısı · {columns[1].date}</p>
              <p className={`${SP} mt-3 text-[30px] font-light italic leading-[1.25] group-hover:text-[#1f5b45] sm:text-[36px]`}>{columns[1].title}</p>
              <p className="mt-4 text-[15.5px] leading-[1.55]" style={{ color: "#4a4e53" }}>{columns[1].dek}</p>
            </a>
            <div>
              <p className="text-[13px] font-semibold" style={{ color: ACC }}>Haber dosyaları</p>
              <ul className="mt-3">
                {dossiers.map((d) => (
                  <li key={d.title}>
                    <a href="#" className="group flex items-baseline justify-between border-b py-3 text-[17px] font-medium" style={{ borderColor: "#dfe3dd" }}>
                      <span className="group-hover:text-[#1f5b45]">{d.title}</span>
                      <span className="tnum text-[13px] font-normal" style={{ color: MUTED }}>{d.count} yazı</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <footer className="mt-16 flex flex-col justify-between gap-2 border-t pt-5 text-[12.5px] sm:flex-row" style={{ borderColor: LINE, color: MUTED }}>
            <span>© 2026 Çetiner Çetin</span>
            <span>X · YouTube · RSS</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
