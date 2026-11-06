import type { Metadata } from "next";
import { Newsreader, DM_Sans } from "next/font/google";
import { Portrait } from "@/components/portrait";
import { author, articles, columns, appearances, img } from "@/lib/mock";

const nr = Newsreader({ subsets: ["latin", "latin-ext"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"], variable: "--f-nr" });
const dm = DM_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], variable: "--f-dm" });

export const metadata: Metadata = { title: "Tasarım 3 · Köşe Yazarı — Çetiner Çetin" };

const SERIF = "font-[family-name:var(--f-nr)]";
const SANS = "font-[family-name:var(--f-dm)]";
const INK = "#1d1a16";
const ACC = "#8a2e1e";

function Small({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`${SANS} text-[11.5px] font-medium uppercase tracking-[0.14em] text-[#7d7366] ${className}`}>{children}</p>;
}

export default function KoseYazari() {
  const latest = columns[0];
  const index = [...columns.slice(1), articles[3], articles[6], articles[5], articles[2]];
  const news = [articles[0], articles[4], articles[7]];

  return (
    <div className={`${nr.variable} ${dm.variable} ${SERIF} min-h-screen bg-[#f5f0e6]`} style={{ color: INK }}>
      {/* header */}
      <header className="mx-auto max-w-[1180px] px-5 pt-8 lg:px-8">
        <div className={`${SANS} flex items-center justify-between text-[12.5px] text-[#5c544a]`}>
          <span>{author.today}</span>
          <div className="flex gap-5">
            <a href="#mektup" className="hover:text-[#1d1a16]">Mektup</a>
            <a href="#" className="hover:text-[#1d1a16]">İletişim</a>
          </div>
        </div>
        <div className="mt-10 text-center">
          <a href="#" className="text-[56px] font-light italic leading-none tracking-[-0.02em] sm:text-[84px]">Çetiner Çetin</a>
          <p className={`${SANS} mt-4 text-[12px] uppercase tracking-[0.3em] text-[#7d7366]`}>Yazılar · Notlar · Ekran</p>
        </div>
        <nav className={`${SANS} mt-9 flex flex-wrap justify-center gap-x-8 gap-y-2 border-y border-[#1d1a16]/15 py-3.5 text-[13.5px]`}>
          {["Köşe Yazıları", "Analiz", "Saha Notları", "Röportajlar", "Ekranda", "Hakkında"].map((n) => (
            <a key={n} href="#" className="decoration-[#8a2e1e] underline-offset-[6px] hover:underline">{n}</a>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1180px] px-5 lg:px-8">
        {/* son yazı */}
        <section className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-14">
          <figure className="lg:col-span-5">
            <div className="bg-white p-3 shadow-[0_1px_2px_rgba(29,26,22,0.08)]">
              <Portrait font={SERIF} bg="#e7dfd0" fg={INK} className="aspect-[4/5] w-full" />
            </div>
            <figcaption className={`${SANS} mt-3 text-[12px] text-[#7d7366]`}>{author.role}, {author.outlet}</figcaption>
          </figure>
          <article className="lg:col-span-7 lg:pt-4">
            <Small className="!text-[#8a2e1e]">Son yazı · {latest.date}</Small>
            <h1 className="balance mt-4 text-[46px] font-normal leading-[1.04] tracking-[-0.02em] sm:text-[64px]">{latest.title}</h1>
            <p className="mt-5 text-[23px] font-light italic leading-[1.4] text-[#4a4239]">{latest.dek}</p>
            <div className="mt-8 max-w-[62ch] space-y-5 text-[19px] leading-[1.7]">
              <p className="dropcap pretty">
                Ankara&apos;da bir kış akşamı, dışişlerinin arka koridorlarında hiçbir kameranın kaydetmediği bir görüşme yapıldı. Ertesi sabah gazetelerde tek satır yoktu; ama üç ay sonra masaya konan uzlaşının ilk cümlesi o akşam yazılmıştı.
              </p>
              <p className="pretty text-[#3a332b]">
                Diplomaside görünürlük çoğu zaman bir maliyettir. Ekranda verilen her mesaj, masada kaybedilen bir manevra alanı demek. Sessiz diplomasi ise sabır, güven ve en çok da zaman ister&hellip;
              </p>
            </div>
            <a href="#" className={`${SANS} mt-8 inline-flex items-center gap-2 border-b border-[#1d1a16] pb-1 text-[14px] font-semibold`}>
              Yazının devamı <span aria-hidden>→</span>
            </a>
          </article>
        </section>

        {/* yazılar dizini */}
        <section className="border-t border-[#1d1a16] py-14">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[34px] italic">Yazılar</h2>
            <a href="#" className={`${SANS} text-[13px] font-medium text-[#5c544a] hover:text-[#1d1a16]`}>Tüm arşiv (412)</a>
          </div>
          <ol className="mt-8">
            {index.map((a, i) => (
              <li key={a.slug}>
                <a href="#" className="group grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-[#1d1a16]/12 py-6 sm:grid-cols-[3rem_1fr_9rem]">
                  <span className={`${SANS} tnum pt-2 text-[12px] text-[#9a8f80]`}>{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="balance block text-[25px] leading-[1.2] transition-colors duration-150 group-hover:text-[#8a2e1e] sm:text-[28px]">{a.title}</span>
                    <span className="mt-1.5 block text-[16.5px] italic leading-snug text-[#5c544a]">{a.dek}</span>
                  </span>
                  <span className={`${SANS} col-start-2 mt-3 text-[12px] text-[#7d7366] sm:col-start-3 sm:mt-2 sm:text-right`}>
                    {a.kind}<br className="hidden sm:block" /><span className="sm:hidden"> · </span>{a.date}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        {/* alıntı */}
        <section className="border-y border-[#1d1a16]/15 py-20 text-center">
          <p className="text-[72px] leading-none" style={{ color: ACC }}>&ldquo;</p>
          <blockquote className="balance mx-auto -mt-4 max-w-[26ch] text-[34px] font-light italic leading-[1.25] sm:text-[44px]">
            Savaşı canlı yayında anlatmak, bir muhabirin taşıyabileceği en ağır yüktür.
          </blockquote>
          <Small className="mt-7">{columns[1].title} · {columns[1].date}</Small>
        </section>

        {/* haber + ekran */}
        <section className="grid gap-14 py-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Small>Haber & Analiz</Small>
            <div className="mt-6 grid gap-8 sm:grid-cols-3">
              {news.map((a) => (
                <article key={a.slug}>
                  <img src={img(a.img, 600, 450)} alt="" className="aspect-[4/3] w-full object-cover sepia-[.15]" />
                  <p className={`${SANS} mt-4 text-[11.5px] font-medium uppercase tracking-[0.12em]`} style={{ color: ACC }}>{a.section}</p>
                  <h3 className="balance mt-2 text-[21px] leading-[1.2]"><a href="#" className="hover:text-[#8a2e1e]">{a.title}</a></h3>
                  <p className={`${SANS} mt-2.5 text-[12px] text-[#7d7366]`}>{a.date} · {a.readMin} dk</p>
                </article>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4 lg:border-l lg:border-[#1d1a16]/15 lg:pl-10">
            <Small>Ekranda</Small>
            <ul className="mt-6">
              {appearances.map((x) => (
                <li key={x.topic} className="border-b border-[#1d1a16]/12 py-4 first:pt-0">
                  <p className="text-[19px] leading-snug">{x.topic}</p>
                  <p className={`${SANS} mt-1.5 text-[12px] text-[#7d7366]`}>{x.program} · {x.date} · {x.dur}</p>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        {/* mektup */}
        <section id="mektup" className="mb-16 grid items-center gap-8 bg-[#1d1a16] px-6 py-12 text-[#f5f0e6] sm:px-12 lg:grid-cols-2">
          <div>
            <p className="text-[38px] font-light italic leading-tight">Pazar Mektubu</p>
            <p className={`${SANS} mt-3 max-w-[44ch] text-[15px] leading-[1.6] text-[#cfc6b8]`}>
              Haftanın yazısı ve ekrana sığmayan notlar, her pazar sabahı. Reklamsız, kısa, okunur.
            </p>
          </div>
          <form className={`${SANS} flex flex-col gap-3 sm:flex-row`}>
            <input type="email" placeholder="E-posta adresiniz" className="min-w-0 flex-1 border-b border-[#f5f0e6]/40 bg-transparent px-1 py-3 text-[15px] outline-none placeholder:text-[#9a8f80] focus:border-[#f5f0e6]" />
            <button type="button" className="bg-[#f5f0e6] px-6 py-3 text-[14px] font-semibold text-[#1d1a16]">Abone ol</button>
          </form>
        </section>
      </main>

      <footer className={`${SANS} border-t border-[#1d1a16]/15`}>
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-3 px-5 py-8 text-[12.5px] text-[#7d7366] sm:flex-row lg:px-8">
          <span className={`${SERIF} text-[22px] italic text-[#1d1a16]`}>Çetiner Çetin</span>
          <span>© 2026 · X · YouTube · RSS</span>
        </div>
      </footer>
    </div>
  );
}
