import type { Metadata } from "next";
import { Libre_Caslon_Display, Libre_Caslon_Text, Work_Sans } from "next/font/google";
import { Portrait } from "@/components/portrait";
import { author, lead, articles, columns, dossiers, img } from "@/lib/mock";

const disp = Libre_Caslon_Display({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--f-lcd" });
const text = Libre_Caslon_Text({ subsets: ["latin", "latin-ext"], weight: ["400", "700"], style: ["normal", "italic"], variable: "--f-lct" });
const work = Work_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], variable: "--f-ws" });

export const metadata: Metadata = { title: "Tasarım 8 · Analiz Dergisi — Çetiner Çetin" };

const D = "font-[family-name:var(--f-lcd)]";
const T = "font-[family-name:var(--f-lct)]";
const W = "font-[family-name:var(--f-ws)]";
const NAVY = "#0f2440";
const RED = "#c4262e";
const CREAM = "#f7f4ee";

function Caps({ children, className = "", color }: { children: React.ReactNode; className?: string; color?: string }) {
  return (
    <p className={`${W} text-[11.5px] font-semibold uppercase tracking-[0.16em] ${className}`} style={color ? { color } : undefined}>
      {children}
    </p>
  );
}

export default function AnalizDergisi() {
  const toc = [articles[2], articles[0], articles[4], articles[5], articles[6], articles[7], articles[3], columns[2]];

  return (
    <div className={`${disp.variable} ${text.variable} ${work.variable} ${T} min-h-screen`} style={{ background: CREAM, color: "#1b1d22" }}>
      {/* üst */}
      <header style={{ background: NAVY }} className="text-white">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4 lg:px-8">
          <a href="#" className={`${W} text-[13px] font-semibold uppercase tracking-[0.28em]`}>Çetiner Çetin</a>
          <nav className={`${W} hidden gap-7 text-[13px] text-white/70 md:flex`}>
            {["Analiz", "Görüş", "Dosyalar", "Sahadan", "Hakkında"].map((n) => (
              <a key={n} href="#" className="transition-colors duration-150 hover:text-white">{n}</a>
            ))}
          </nav>
          <a href="#" className={`${W} px-3.5 py-2 text-[12.5px] font-semibold`} style={{ background: RED }}>Abone ol</a>
        </div>
      </header>

      {/* kapak */}
      <section style={{ background: NAVY }} className="text-white">
        <div className="mx-auto grid max-w-[1240px] gap-10 border-t border-white/15 px-5 pb-16 pt-12 lg:grid-cols-12 lg:px-8 lg:pb-20 lg:pt-16">
          <div className="flex flex-col lg:col-span-7">
            <Caps color="#ff8a8f">Kapak · {lead.section}</Caps>
            <h1 className={`${D} balance mt-6 text-[52px] leading-[1.02] sm:text-[76px] lg:text-[88px]`}>
              <a href={lead.url} className="hover:text-white/85">{lead.title}</a>
            </h1>
            <p className="pretty mt-7 max-w-[46ch] text-[19px] italic leading-[1.55] text-white/80">{lead.dek}</p>
            <div className="mt-auto flex items-center gap-3 pt-10">
              <Portrait small bg="#1d3657" className="h-11 w-11 rounded-full" />
              <div>
                <p className={`${W} text-[14px] font-semibold`}>{author.name}</p>
                <p className={`${W} text-[12.5px] text-white/55`}>{lead.date} · {lead.readMin} dk okuma</p>
              </div>
            </div>
          </div>
          <figure className="lg:col-span-5">
            <div className="border border-white/20 p-2.5">
              <img src={img(lead.img)} alt="" className="aspect-[4/5] w-full object-cover" />
            </div>
            <figcaption className={`${W} mt-2.5 text-[11.5px] text-white/45`}>Fotoğraf: Wikimedia Commons</figcaption>
          </figure>
        </div>
      </section>

      {/* bu sayıda */}
      <section className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-20">
        <div className="flex items-end justify-between border-b-2 pb-4" style={{ borderColor: NAVY }}>
          <h2 className={`${D} text-[44px] leading-none sm:text-[56px]`} style={{ color: NAVY }}>Bu sayıda</h2>
          <a href="#" className={`${W} text-[13px] font-semibold hover:underline`} style={{ color: RED }}>Tüm yazılar →</a>
        </div>
        <ol className="grid md:grid-cols-2 md:gap-x-14">
          {toc.map((a, i) => (
            <li key={a.slug} className="border-b" style={{ borderColor: "#ddd6c9" }}>
              <a href={a.url} className="group grid grid-cols-[2.75rem_1fr] gap-x-3 py-6">
                <span className={`${D} tnum text-[30px] leading-none`} style={{ color: RED }}>{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <Caps color="#6b6f78">{a.section} · {a.date}</Caps>
                  <span className="balance mt-2 block text-[22px] font-bold leading-[1.22] group-hover:underline" style={{ color: NAVY }}>{a.title}</span>
                  <span className="mt-2 block text-[15.5px] italic leading-[1.5] text-[#4a4d55]">{a.dek}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* sahadan bant */}
      <section className="mx-auto max-w-[1240px] px-5 lg:px-8">
        <a href={articles[1].url} className="group grid overflow-hidden bg-white lg:grid-cols-2" style={{ boxShadow: "0 1px 2px rgba(15,36,64,0.08)" }}>
          <img src={img(articles[1].img)} alt="" className="aspect-[16/10] h-full w-full object-cover" />
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <Caps color={RED}>Sahadan · {articles[1].place}</Caps>
            <p className={`${D} balance mt-4 text-[40px] leading-[1.06] group-hover:underline sm:text-[50px]`} style={{ color: NAVY }}>{articles[1].title}</p>
            <p className="pretty mt-5 text-[17px] italic leading-[1.55] text-[#4a4d55]">{articles[1].dek}</p>
          </div>
        </a>
      </section>

      {/* dosyalar */}
      <section className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-20">
        <Caps color="#6b6f78">Dosyalar</Caps>
        <div className="mt-5 grid grid-cols-2 gap-px lg:grid-cols-4" style={{ background: "#ddd6c9" }}>
          {dossiers.map((d) => (
            <a key={d.title} href="#" className="group p-6 transition-colors duration-150 hover:bg-white" style={{ background: CREAM }}>
              <span className="block h-[3px] w-10" style={{ background: RED }} />
              <p className={`${D} mt-5 text-[30px] leading-none`} style={{ color: NAVY }}>{d.title}</p>
              <p className={`${W} mt-3 text-[13px] text-[#6b6f78]`}>{d.count} yazı · {d.years}</p>
            </a>
          ))}
        </div>
      </section>

      {/* yazar */}
      <section style={{ background: NAVY }} className="text-white">
        <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 py-16 md:grid-cols-12 lg:px-8">
          <Portrait bg="#1d3657" className="aspect-[4/5] w-full max-w-[300px] md:col-span-4" />
          <div className="md:col-span-8">
            <Caps color="#ff8a8f">Yazar</Caps>
            <p className={`${D} mt-4 text-[48px] leading-none sm:text-[60px]`}>{author.name}</p>
            <p className={`${W} mt-3 text-[14px] text-white/60`}>{author.role} · {author.outlet}</p>
            <p className="pretty mt-6 max-w-[60ch] text-[19px] leading-[1.6] text-white/85">{author.longBio}</p>
            <a href="https://www.haberturk.com/htyazar/cetiner-cetin" className={`${W} mt-8 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-[14px] font-semibold hover:border-white`}>
              Habertürk&apos;teki tüm yazıları →
            </a>
          </div>
        </div>
      </section>

      <footer className={`${W} border-t border-white/10 text-[12.5px] text-white/50`} style={{ background: NAVY }}>
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-2 px-5 py-6 sm:flex-row lg:px-8">
          <span className="uppercase tracking-[0.28em] text-white/80">Çetiner Çetin</span>
          <span>© 2026 · X · RSS</span>
        </div>
      </footer>
    </div>
  );
}
