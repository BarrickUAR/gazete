import type { Metadata } from "next";
import { UnifrakturMaguntia, Source_Serif_4, Gelasio, Libre_Franklin } from "next/font/google";
import { Portrait } from "@/components/portrait";
import { author, lead, articles, columns, appearances, dossiers, sections, img } from "@/lib/mock";

// NYT ailesi: Old English masthead · Cheltenham yerine optik boyutlu Source Serif 4 ·
// Imperial yerine Georgia-metrik Gelasio · NYT Franklin yerine Libre Franklin
const mast = UnifrakturMaguntia({ subsets: ["latin"], weight: "400", variable: "--f-mast" });
const chelt = Source_Serif_4({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"], axes: ["opsz"], variable: "--f-chelt" });
const imperial = Gelasio({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--f-imp" });
const franklin = Libre_Franklin({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700", "800"], variable: "--f-frank" });

export const metadata: Metadata = { title: "Tasarım 1 · Gazete — Çetiner Çetin" };

const M = "font-[family-name:var(--f-mast)]";
const H = "font-[family-name:var(--f-chelt)]";
const B = "font-[family-name:var(--f-imp)]";
const F = "font-[family-name:var(--f-frank)]";

const INK = "text-[#121212]";
const SUM = "text-[#5a5a5a]";
const RULE = "border-[#dfdfdf]";

function Rubric({ children }: { children: React.ReactNode }) {
  return <p className={`${F} text-[12px] font-bold leading-none tracking-[0.01em] ${INK}`}>{children}</p>;
}

function ReadTime({ a }: { a: { readMin: number; date: string } }) {
  return (
    <p className={`${F} mt-2.5 text-[11px] font-medium uppercase tracking-[0.04em] text-[#727272]`}>
      {a.readMin} dk okuma
    </p>
  );
}

function SectionHead({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h4 id={id} className={`${F} flex items-center justify-between border-t-2 border-[#121212] pt-2 text-[14px] font-bold ${INK}`}>
      {children}
    </h4>
  );
}

export default function Gazete() {
  const [a1, a2, a3, a4, a5, a6, a7] = articles;
  const hl = `${H} balance font-semibold tracking-[-0.005em] ${INK} hover:text-[#5a5a5a] transition-colors duration-150`;

  return (
    <div className={`${mast.variable} ${chelt.variable} ${imperial.variable} ${franklin.variable} ${B} bg-white ${INK} antialiased`}>
      {/* üst şerit */}
      <div className={`${F} text-[12px]`}>
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 pt-3">
          <div className="leading-tight">
            <p className="font-bold">{author.today}</p>
            <p className="text-[#5a5a5a]">Bugünün yazısı</p>
          </div>
          <a href="#bulten" className="rounded-[3px] bg-[#567b95] px-3 py-[7px] text-[11px] font-bold uppercase tracking-[0.04em] text-white transition-colors hover:bg-[#326891]">
            Bültene katıl
          </a>
        </div>
      </div>

      {/* masthead */}
      <header className="mx-auto max-w-[1240px] px-5">
        <div className="pb-4 pt-2 text-center sm:-mt-4">
          <h1 className={`${M} text-[44px] font-normal leading-none tracking-[-0.005em] sm:text-[74px] lg:text-[86px]`}>Çetiner Çetin</h1>
        </div>
        <nav className={`${F} border-t ${RULE}`}>
          <ul className="flex items-center gap-x-6 overflow-x-auto py-2.5 text-[13px] sm:justify-center">
            {sections.map((s) => (
              <li key={s} className="shrink-0">
                <a href="#" className="hover:underline">{s}</a>
              </li>
            ))}
          </ul>
        </nav>
        {/* NYT çift çizgi */}
        <div className="border-t border-[#121212]" />
        <div className="mt-[2px] border-t border-[#121212]" />
        <p className={`${B} py-2 text-center text-[13px] italic text-[#5a5a5a]`}>
          Dış politika ve güvenlik yazıları · {author.outlet}
        </p>
        <div className={`border-t ${RULE}`} />
      </header>

      <main className="mx-auto max-w-[1240px] px-5 pb-16 pt-5">
        <div className="grid lg:grid-cols-12">
          {/* sol: manşet + haberler */}
          <section className={`lg:col-span-9 lg:border-r ${RULE} lg:pr-6`}>
            <article className={`grid gap-5 border-b ${RULE} pb-6 md:grid-cols-12`}>
              <div className="md:col-span-4 md:pt-0.5">
                <Rubric>{lead.section} · Analiz</Rubric>
                <h2 className="mt-2.5">
                  <a href={lead.url} className={`${hl} block text-[30px] leading-[1.1] lg:text-[38px] lg:leading-[1.08]`}>{lead.title}</a>
                </h2>
                <p className={`pretty mt-3 text-[16px] leading-[1.45] ${SUM}`}>{lead.dek}</p>
                <ReadTime a={lead} />
                <ul className={`mt-4 border-t ${RULE}`}>
                  {[a6, a7].map((r) => (
                    <li key={r.slug} className={`border-b ${RULE} py-3 last:border-0`}>
                      <a href={r.url} className={`${hl} block text-[17px] leading-[1.22]`}>{r.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <figure className="md:col-span-8">
                <img src={img(lead.img)} alt="" className="aspect-[3/2] w-full object-cover" />
                <figcaption className={`${F} mt-1.5 flex justify-between gap-4 text-[11px] leading-snug text-[#727272]`}>
                  <span>Finlandiya bayrağı NATO karargâhında göndere çekiliyor, Brüksel, 4 Nisan 2023.</span>
                  <span className="shrink-0">Wikimedia Commons</span>
                </figcaption>
              </figure>
            </article>

            <div className={`grid border-b ${RULE} md:grid-cols-3`}>
              {[a1, a2, a3].map((a, i) => (
                <article key={a.slug} className={`py-5 ${i > 0 ? `border-t ${RULE} md:border-l md:border-t-0 md:pl-5` : ""} ${i < 2 ? "md:pr-5" : ""}`}>
                  <img src={img(a.img)} alt="" className="mb-3 aspect-[3/2] w-full object-cover" />
                  <Rubric>{a.section}</Rubric>
                  <h3 className="mt-2">
                    <a href={a.url} className={`${hl} block text-[21px] leading-[1.15]`}>{a.title}</a>
                  </h3>
                  <p className={`mt-2 text-[15px] leading-[1.45] ${SUM}`}>{a.dek}</p>
                  <ReadTime a={a} />
                </article>
              ))}
            </div>

            <div className="grid md:grid-cols-2">
              {[a4, a5].map((a, i) => (
                <article key={a.slug} className={`flex gap-4 py-5 ${i === 0 ? `md:border-r ${RULE} md:pr-5` : `border-t ${RULE} md:border-t-0 md:pl-5`}`}>
                  <div className="flex-1">
                    <Rubric>{a.section}</Rubric>
                    <h3 className="mt-2">
                      <a href={a.url} className={`${hl} block text-[19px] leading-[1.18]`}>{a.title}</a>
                    </h3>
                    <p className={`mt-1.5 text-[14.5px] leading-[1.45] ${SUM}`}>{a.dek}</p>
                    <ReadTime a={a} />
                  </div>
                  <img src={img(a.img)} alt="" className="h-[110px] w-[110px] shrink-0 object-cover" />
                </article>
              ))}
            </div>
          </section>

          {/* sağ: görüş + ekranda */}
          <aside className="mt-6 lg:col-span-3 lg:mt-0 lg:pl-6">
            <SectionHead>Görüş</SectionHead>
            {columns.map((c) => (
              <article key={c.slug} className={`border-b ${RULE} py-4`}>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className={`${F} text-[12px] font-semibold text-[#5a5a5a]`}>{author.name}</p>
                    <h3 className="mt-1">
                      <a href={c.url} className={`${hl} block text-[19px] leading-[1.18]`}>{c.title}</a>
                    </h3>
                  </div>
                  <Portrait small bg="#e8e6e1" className="h-[60px] w-[60px] shrink-0 rounded-full" />
                </div>
                <p className={`pretty mt-2 text-[14px] leading-[1.45] ${SUM}`}>{c.dek}</p>
              </article>
            ))}

            <div className="mt-8">
              <SectionHead>Ekranda</SectionHead>
              <ul>
                {appearances.map((x) => (
                  <li key={x.topic} className={`flex gap-3 border-b ${RULE} py-3`}>
                    <span className={`${F} tnum w-12 shrink-0 pt-0.5 text-[11px] font-semibold uppercase text-[#727272]`}>{x.date}</span>
                    <div>
                      <p className={`${H} text-[16px] font-semibold leading-[1.2]`}>{x.topic}</p>
                      <p className={`${F} mt-1 text-[11px] text-[#727272]`}>{x.program} · {x.dur}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div id="bulten" className="mt-8 bg-[#f7f7f5] p-5">
              <p className={`${F} text-[11px] font-bold uppercase tracking-[0.06em] text-[#5a5a5a]`}>Bülten</p>
              <p className={`${H} mt-1 text-[24px] font-semibold leading-tight`}>Pazartesi Notları</p>
              <p className={`mt-1.5 text-[14px] leading-snug ${SUM}`}>
                Haftanın dış politika gündemi, her pazartesi sabahı e-postanızda.
              </p>
              <form className={`${F} mt-4 flex`}>
                <input type="email" placeholder="E-posta adresiniz" className="min-w-0 flex-1 border border-[#c7c7c7] bg-white px-2.5 py-2 text-[13px] outline-none focus:border-[#121212]" />
                <button type="button" className="bg-[#121212] px-3.5 text-[12px] font-bold text-white transition-colors hover:bg-[#333]">Kaydol</button>
              </form>
            </div>
          </aside>
        </div>

        {/* dosyalar */}
        <section className="mt-10">
          <SectionHead>
            Haber dosyaları
            <a href="#" className="text-[12px] font-semibold text-[#326891] hover:underline">Tüm arşiv ›</a>
          </SectionHead>
          <div className="mt-4 grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {dossiers.map((d, i) => (
              <a key={d.title} href="#" className={`group ${i > 0 ? `lg:border-l ${RULE} lg:pl-5` : ""}`}>
                <img src={img(d.img)} alt="" className="aspect-[3/2] w-full object-cover grayscale-[15%]" />
                <p className={`${H} mt-2.5 text-[20px] font-semibold leading-tight group-hover:text-[#5a5a5a]`}>{d.title}</p>
                <p className={`${F} mt-1 text-[11px] uppercase tracking-[0.04em] text-[#727272]`}>
                  {d.count} yazı · {d.years}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* hakkında */}
        <section className={`mt-12 grid items-center gap-8 border-y ${RULE} py-10 md:grid-cols-12`}>
          <Portrait bg="#e8e6e1" className="aspect-[5/6] w-full md:col-span-3" />
          <div className="md:col-span-6">
            <Rubric>Muhabir hakkında</Rubric>
            <p className={`${H} mt-2.5 text-[38px] font-semibold leading-[1.05] tracking-[-0.01em]`}>{author.name}</p>
            <p className={`${F} mt-2 text-[13px] font-medium text-[#5a5a5a]`}>{author.role}, {author.outlet}</p>
            <p className="pretty mt-4 text-[17px] leading-[1.6] text-[#333]">{author.longBio}</p>
          </div>
          <div className={`${F} text-[12px] md:col-span-3 md:border-l ${RULE} md:pl-6`}>
            {dossiers.slice(0, 3).map((d) => (
              <div key={d.title} className={`border-b ${RULE} py-3 last:border-0`}>
                <p className={`${H} tnum text-[32px] font-semibold leading-none`}>{d.count}</p>
                <p className="mt-1 text-[#727272]">{d.title} yazısı</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className={`${F} border-t-2 border-[#121212]`}>
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-3 px-5 py-6 text-[12px] text-[#5a5a5a] sm:flex-row">
          <span className={`${M} text-[28px] ${INK}`}>Çetiner Çetin</span>
          <span>© 2026 · İletişim · Künye · RSS</span>
        </div>
      </footer>
    </div>
  );
}
