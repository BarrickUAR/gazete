import type { Metadata } from "next";
import { Cormorant_Garamond, EB_Garamond, Jost } from "next/font/google";
import { Portrait } from "@/components/portrait";
import { author, lead, articles, columns, appearances, img } from "@/lib/mock";

// The New Yorker dili: Irvin/Caslon havası için Cormorant Garamond (display) ·
// gövdede EB Garamond · Neutraface/Futura karşılığı Jost (etiket, meta)
const disp = Cormorant_Garamond({ subsets: ["latin", "latin-ext"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--f-disp" });
const body = EB_Garamond({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--f-body" });
const jost = Jost({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], variable: "--f-jost" });

export const metadata: Metadata = { title: "Tasarım 3 · Köşe Yazarı — Çetiner Çetin" };

const D = "font-[family-name:var(--f-disp)]";
const SERIF = "font-[family-name:var(--f-body)]";
const SANS = "font-[family-name:var(--f-jost)]";
const INK = "#1b1a17";
const ACC = "#a5281b";
const PAPER = "#f6f1e7";
const MUTED = "#7b7164";

function Rubric({ children, color = ACC, className = "" }: { children: React.ReactNode; color?: string; className?: string }) {
  return (
    <p className={`${SANS} text-[11.5px] font-medium uppercase tracking-[0.2em] ${className}`} style={{ color }}>
      {children}
    </p>
  );
}

function Rule() {
  return (
    <div className="flex items-center justify-center gap-3 py-2" aria-hidden>
      <span className="h-px w-16 bg-[#1b1a17]/25" />
      <span className={`${D} text-[18px] italic leading-none text-[#1b1a17]/45`}>§</span>
      <span className="h-px w-16 bg-[#1b1a17]/25" />
    </div>
  );
}

export default function KoseYazari() {
  const latest = articles[0];
  const index = [...columns, articles[3], articles[6], articles[7]];
  const news = [lead, articles[2], articles[4]];
  const featured = articles[1];

  return (
    <div className={`${disp.variable} ${body.variable} ${jost.variable} ${SERIF} min-h-screen antialiased`} style={{ background: PAPER, color: INK }}>
      {/* header */}
      <header className="mx-auto max-w-[1180px] px-5 pt-6 lg:px-8">
        <div className={`${SANS} flex items-center justify-between text-[12px] tracking-[0.02em]`} style={{ color: MUTED }}>
          <span>{author.today}</span>
          <div className="flex gap-6">
            <a href="#mektup" className="transition-colors hover:text-[#1b1a17]">Mektup</a>
            <a href="#" className="transition-colors hover:text-[#1b1a17]">İletişim</a>
          </div>
        </div>
        <div className="mt-9 text-center">
          <a href="#" className={`${D} inline-block text-[58px] font-semibold leading-[0.9] tracking-[-0.015em] sm:text-[96px]`}>Çetiner Çetin</a>
          <p className={`${D} mt-3 text-[19px] italic sm:text-[21px]`} style={{ color: "#4a4239" }}>
            Dış politika, güvenlik ve Türkiye üzerine yazılar
          </p>
        </div>
        <nav className={`${SANS} mt-8 flex flex-wrap justify-center gap-x-9 gap-y-2 border-y py-3 text-[12px] font-medium uppercase tracking-[0.16em]`} style={{ borderColor: INK }}>
          {["Köşe Yazıları", "Analiz", "Saha Notları", "Röportajlar", "Ekranda", "Hakkında"].map((n) => (
            <a key={n} href="#" className="underline-offset-[6px] transition-colors hover:underline" style={{ textDecorationColor: ACC }}>{n}</a>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1180px] px-5 lg:px-8">
        {/* son yazı */}
        <section className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-16">
          <figure className="lg:col-span-5">
            <Portrait bg="#e6ded0" className="aspect-[4/5] w-full" />
            <figcaption className={`${SANS} mt-3 flex justify-between gap-4 text-[11px] uppercase tracking-[0.12em]`} style={{ color: MUTED }}>
              <span>{author.name}</span>
              <span>{author.outlet}</span>
            </figcaption>
          </figure>
          <article className="lg:col-span-7 lg:pt-2">
            <Rubric>Köşe yazısı</Rubric>
            <h1 className={`${D} balance mt-4 text-[50px] font-semibold leading-[0.98] tracking-[-0.015em] sm:text-[74px]`}>
              <a href={latest.url} className="transition-colors duration-150 hover:text-[#a5281b]">{latest.title}</a>
            </h1>
            <p className={`${SANS} mt-6 text-[11.5px] uppercase tracking-[0.16em]`} style={{ color: MUTED }}>
              {author.name} · {latest.date} · {latest.readMin} dk
            </p>
            <div className="mt-7 border-t border-[#1b1a17]/20 pt-7">
              <p className="dropcap pretty max-w-[56ch] text-[22px] leading-[1.55]" style={{ color: "#34302a" }}>
                {latest.dek}
              </p>
            </div>
            <a href={latest.url} className={`${SANS} mt-7 inline-flex items-center gap-2 border-b pb-1 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-[#a5281b]`} style={{ borderColor: INK }}>
              Yazıyı oku <span aria-hidden>→</span>
            </a>
          </article>
        </section>

        <Rule />

        {/* yazılar dizini */}
        <section className="py-14">
          <div className="flex items-baseline justify-between">
            <h2 className={`${D} text-[40px] font-semibold italic leading-none`}>Yazılar</h2>
            <a href="#" className={`${SANS} text-[11.5px] font-medium uppercase tracking-[0.16em] transition-colors hover:text-[#1b1a17]`} style={{ color: MUTED }}>Tüm yazılar</a>
          </div>
          <ol className="mt-8 border-b border-[#1b1a17]/15">
            {index.map((a, i) => (
              <li key={a.slug}>
                <a href={a.url} className="group grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-[#1b1a17]/15 py-6 sm:grid-cols-[3.5rem_1fr_10rem]">
                  <span className={`${D} tnum pt-1 text-[22px] italic leading-none`} style={{ color: ACC }}>{i + 1}</span>
                  <span>
                    <span className={`${D} balance block text-[27px] font-semibold leading-[1.1] transition-colors duration-150 group-hover:text-[#a5281b] sm:text-[31px]`}>{a.title}</span>
                    <span className="mt-2 block text-[17px] italic leading-snug" style={{ color: "#564d43" }}>{a.dek}</span>
                  </span>
                  <span className={`${SANS} tnum col-start-2 mt-3 text-[11px] uppercase tracking-[0.12em] sm:col-start-3 sm:mt-1.5 sm:text-right`} style={{ color: MUTED }}>
                    {a.kind}<br className="hidden sm:block" /><span className="sm:hidden"> · </span>{a.date}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        {/* öne çıkan saha yazısı */}
        <section className="border-y py-20 text-center" style={{ borderColor: INK }}>
          <Rubric>Sahadan · {featured.place}</Rubric>
          <a href={featured.url} className={`${D} balance mx-auto mt-6 block max-w-[18ch] text-[48px] font-semibold italic leading-[1.02] transition-colors duration-150 hover:text-[#a5281b] sm:text-[72px]`}>
            {featured.title}
          </a>
          <p className="pretty mx-auto mt-6 max-w-[52ch] text-[20px] leading-[1.55]" style={{ color: "#4a4239" }}>{featured.dek}</p>
          <p className={`${SANS} mt-6 text-[11px] uppercase tracking-[0.16em]`} style={{ color: MUTED }}>{featured.date} · {featured.readMin} dk</p>
        </section>

        {/* haber + ekran */}
        <section className="grid gap-14 py-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Rubric color={MUTED}>Haber & Analiz</Rubric>
            <div className="mt-6 grid gap-8 sm:grid-cols-3">
              {news.map((a) => (
                <article key={a.slug}>
                  <img src={img(a.img)} alt="" className="aspect-[4/3] w-full object-cover sepia-[.12]" />
                  <Rubric className="mt-4">{a.section}</Rubric>
                  <h3 className={`${D} balance mt-2 text-[24px] font-semibold leading-[1.1]`}>
                    <a href={a.url} className="transition-colors hover:text-[#a5281b]">{a.title}</a>
                  </h3>
                  <p className={`${SANS} mt-2.5 text-[11px] uppercase tracking-[0.12em]`} style={{ color: MUTED }}>{a.date} · {a.readMin} dk</p>
                </article>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4 lg:border-l lg:border-[#1b1a17]/15 lg:pl-10">
            <Rubric color={MUTED}>Ekranda</Rubric>
            <ul className="mt-6">
              {appearances.map((x) => (
                <li key={x.topic} className="border-b border-[#1b1a17]/15 py-4 first:pt-0">
                  <p className={`${D} text-[22px] font-semibold leading-[1.15]`}>{x.topic}</p>
                  <p className={`${SANS} mt-1.5 text-[11px] uppercase tracking-[0.1em]`} style={{ color: MUTED }}>{x.program} · {x.date} · {x.dur}</p>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        {/* mektup */}
        <section id="mektup" className="mb-16 grid items-center gap-8 px-6 py-12 sm:px-12 lg:grid-cols-2" style={{ background: INK, color: PAPER }}>
          <div>
            <Rubric color="#e0a28f">Bülten</Rubric>
            <p className={`${D} mt-2 text-[44px] font-semibold italic leading-none`}>Pazar Mektubu</p>
            <p className="mt-3 max-w-[44ch] text-[17px] leading-[1.55] text-[#d6cdbf]">
              Haftanın yazısı ve ekrana sığmayan notlar, her pazar sabahı.
            </p>
          </div>
          <form className={`${SANS} flex flex-col gap-3 sm:flex-row`}>
            <input type="email" placeholder="E-posta adresiniz" className="min-w-0 flex-1 border-b border-[#f6f1e7]/40 bg-transparent px-1 py-3 text-[15px] outline-none placeholder:text-[#9a8f80] focus:border-[#f6f1e7]" />
            <button type="button" className="px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-white" style={{ background: PAPER, color: INK }}>Abone ol</button>
          </form>
        </section>
      </main>

      <footer className={`${SANS} border-t`} style={{ borderColor: INK }}>
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-3 px-5 py-8 text-[11.5px] uppercase tracking-[0.12em] sm:flex-row lg:px-8" style={{ color: MUTED }}>
          <span className={`${D} text-[26px] font-semibold normal-case tracking-normal`} style={{ color: INK }}>Çetiner Çetin</span>
          <span>© 2026 · X · YouTube · RSS</span>
        </div>
      </footer>
    </div>
  );
}
