import type { Metadata } from "next";
import { UnifrakturMaguntia, Gelasio, Libre_Franklin } from "next/font/google";
import { Portrait } from "@/components/portrait";
import { author, lead, articles, columns, appearances, dossiers, sections, img } from "@/lib/mock";

// NYT ailesi: masthead blackletter · Cheltenham/Imperial yerine Georgia-metrik Gelasio · NYT Franklin yerine Libre Franklin
const mast = UnifrakturMaguntia({ subsets: ["latin"], weight: "400", variable: "--f-mast" });
const serif = Gelasio({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--f-serif" });
const sans = Libre_Franklin({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700", "800"], variable: "--f-sans" });

export const metadata: Metadata = { title: "Tasarım 1 · Gazete — Çetiner Çetin" };

const M = "font-[family-name:var(--f-mast)]";
const D = "font-[family-name:var(--f-serif)]";
const S = "font-[family-name:var(--f-serif)]";
const F = "font-[family-name:var(--f-sans)]";

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className={`${F} text-[11px] font-bold uppercase tracking-[0.08em] text-[#326891]`}>{children}</p>;
}

function Meta({ a }: { a: { date: string; readMin: number } }) {
  return (
    <p className={`${F} mt-2 text-[11px] uppercase tracking-[0.06em] text-[#727272]`}>
      {a.date} · {a.readMin} dk okuma
    </p>
  );
}

export default function Gazete() {
  const [a1, a2, a3, a4, a5, a6] = articles;
  return (
    <div className={`${mast.variable} ${serif.variable} ${sans.variable} ${S} bg-white text-[#121212]`}>
      {/* üst şerit */}
      <div className={`${F} border-b border-[#e2e2e2] text-[11px]`}>
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-2">
          <span className="font-semibold">{author.today}</span>
          <span className="hidden text-[#555] sm:block">İstanbul · Bugünün dosyası: Karadeniz güvenliği</span>
          <a href="#bulten" className="rounded-[3px] bg-[#326891] px-3 py-1.5 font-bold uppercase tracking-wide text-white">
            Bültene katıl
          </a>
        </div>
      </div>

      {/* masthead */}
      <header className="mx-auto max-w-[1240px] px-5">
        <div className="pb-3 pt-7 text-center">
          <h1 className={`${M} text-[46px] font-normal leading-none sm:text-[80px] lg:text-[96px]`}>
            Çetiner Çetin
          </h1>
          <p className={`${S} mt-3 text-[15px] italic text-[#444]`}>
            Dış politika, güvenlik ve sahadan haber — {author.outlet}
          </p>
        </div>
        <nav className={`${F} border-y border-[#121212] text-[12.5px] font-medium`}>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-2.5">
            {sections.map((s) => (
              <li key={s}>
                <a href="#" className="hover:underline">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="h-[3px] border-b border-[#121212]" />
      </header>

      <main className="mx-auto max-w-[1240px] px-5 pb-16 pt-6">
        <div className="grid gap-0 lg:grid-cols-12">
          {/* sol: manşet + haberler */}
          <section className="lg:col-span-9 lg:border-r lg:border-[#dfdfdf] lg:pr-6">
            <article className="grid gap-5 border-b border-[#dfdfdf] pb-6 md:grid-cols-5">
              <div className="md:col-span-2 md:pt-1">
                <Kicker>{lead.section} · {lead.kind}</Kicker>
                <h2 className={`${S} balance mt-2 text-[30px] font-bold leading-[1.12] tracking-[-0.01em] lg:text-[34px]`}>
                  <a href="#" className="hover:text-[#4b4b4b]">{lead.title}</a>
                </h2>
                <p className="pretty mt-3 text-[17px] leading-[1.5] text-[#363636]">{lead.dek}</p>
                <ul className="mt-4 space-y-3 border-t border-[#e2e2e2] pt-3 text-[15px] leading-snug">
                  <li><a href="#" className="font-semibold hover:underline">Boğazlar ve Montrö: Sözleşme neden yeniden gündemde?</a></li>
                  <li><a href="#" className="font-semibold hover:underline">Mayın temizliği görevinde Türk donanmasının rolü</a></li>
                </ul>
                <Meta a={lead} />
              </div>
              <figure className="md:col-span-3">
                <img src={img(lead.img, 1200, 800)} alt="" className="aspect-[3/2] w-full object-cover" />
                <figcaption className={`${F} mt-1.5 text-right text-[11px] text-[#727272]`}>
                  Fotoğraf: Temsilî · {lead.place}
                </figcaption>
              </figure>
            </article>

            <div className="grid border-b border-[#dfdfdf] md:grid-cols-3">
              {[a1, a2, a3].map((a, i) => (
                <article key={a.slug} className={`py-5 ${i > 0 ? "md:border-l md:border-[#dfdfdf] md:pl-5" : ""} ${i < 2 ? "md:pr-5" : ""}`}>
                  <img src={img(a.img, 600, 400)} alt="" className="mb-3 aspect-[3/2] w-full object-cover" />
                  <Kicker>{a.section}</Kicker>
                  <h3 className="balance mt-1.5 text-[20px] font-bold leading-[1.2]">
                    <a href="#" className="hover:text-[#4b4b4b]">{a.title}</a>
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.45] text-[#363636]">{a.dek}</p>
                  <Meta a={a} />
                </article>
              ))}
            </div>

            <div className="grid md:grid-cols-2">
              {[a4, a5].map((a, i) => (
                <article key={a.slug} className={`flex gap-4 py-5 ${i === 0 ? "md:border-r md:border-[#dfdfdf] md:pr-5" : "md:pl-5"}`}>
                  <div className="flex-1">
                    <Kicker>{a.kind}</Kicker>
                    <h3 className="balance mt-1.5 text-[19px] font-bold leading-[1.22]">
                      <a href="#" className="hover:text-[#4b4b4b]">{a.title}</a>
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-[1.45] text-[#363636]">{a.dek}</p>
                  </div>
                  <img src={img(a.img, 300, 300)} alt="" className="h-[104px] w-[104px] shrink-0 object-cover" />
                </article>
              ))}
            </div>
          </section>

          {/* sağ: görüş + yayında */}
          <aside className="border-t border-[#121212] pt-5 lg:col-span-3 lg:border-t-0 lg:pl-6 lg:pt-0">
            <h4 className={`${F} border-b border-[#121212] pb-1.5 text-[12px] font-extrabold uppercase tracking-[0.1em]`}>Görüş</h4>
            {columns.map((c) => (
              <article key={c.slug} className="border-b border-[#e2e2e2] py-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className={`${F} text-[11px] font-bold uppercase tracking-[0.06em] text-[#555]`}>{author.name}</p>
                    <h3 className="balance mt-1 text-[18px] font-bold leading-[1.2]">
                      <a href="#" className="hover:text-[#4b4b4b]">{c.title}</a>
                    </h3>
                  </div>
                  <Portrait small font={D} bg="#e8e6e1" fg="#121212" className="h-14 w-14 shrink-0 rounded-full" />
                </div>
                <p className="mt-1.5 text-[14px] italic leading-[1.45] text-[#555]">{c.dek}</p>
              </article>
            ))}

            <h4 className={`${F} mt-8 border-b border-[#121212] pb-1.5 text-[12px] font-extrabold uppercase tracking-[0.1em]`}>Ekranda</h4>
            <ul>
              {appearances.map((x) => (
                <li key={x.topic} className="flex gap-3 border-b border-[#e2e2e2] py-3">
                  <span className={`${F} tnum w-12 shrink-0 text-[11px] font-bold uppercase text-[#727272]`}>{x.date}</span>
                  <div>
                    <p className="text-[15px] font-semibold leading-snug">{x.topic}</p>
                    <p className={`${F} mt-0.5 text-[11px] text-[#727272]`}>{x.program} · {x.dur}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div id="bulten" className="mt-8 border border-[#121212] p-4">
              <p className={`${D} text-[22px] font-bold leading-tight`}>Pazartesi Notları</p>
              <p className="mt-1.5 text-[14px] leading-snug text-[#444]">
                Haftanın dış politika gündemi, her pazartesi sabahı e-postanızda.
              </p>
              <form className={`${F} mt-3 flex`}>
                <input type="email" placeholder="E-posta adresiniz" className="min-w-0 flex-1 border border-[#bbb] px-2.5 py-2 text-[13px] outline-none focus:border-[#121212]" />
                <button type="button" className="bg-[#121212] px-3 text-[12px] font-bold uppercase tracking-wide text-white">Kaydol</button>
              </form>
            </div>
          </aside>
        </div>

        {/* dosyalar */}
        <section className="mt-10 border-t-[3px] border-double border-[#121212] pt-4">
          <div className="flex items-baseline justify-between">
            <h4 className={`${D} text-[26px] font-bold`}>Haber Dosyaları</h4>
            <a href="#" className={`${F} text-[12px] font-semibold text-[#326891] hover:underline`}>Tüm arşiv →</a>
          </div>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dossiers.map((d) => (
              <a key={d.title} href="#" className="group">
                <img src={img(d.img, 600, 400, true)} alt="" className="aspect-[3/2] w-full object-cover" />
                <p className="mt-2.5 text-[19px] font-bold group-hover:underline">{d.title}</p>
                <p className={`${F} mt-0.5 text-[11px] uppercase tracking-[0.06em] text-[#727272]`}>
                  {d.count} haber · {d.years}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* hakkında */}
        <section className="mt-12 grid items-center gap-8 border-y border-[#dfdfdf] py-10 md:grid-cols-12">
          <Portrait font={D} bg="#e8e6e1" fg="#121212" className="aspect-[5/6] w-full md:col-span-3" />
          <div className="md:col-span-6">
            <Kicker>Muhabir hakkında</Kicker>
            <p className={`${D} mt-2 text-[34px] font-bold leading-tight`}>{author.name}</p>
            <p className={`${F} mt-1 text-[13px] font-medium text-[#555]`}>{author.role}, {author.outlet}</p>
            <p className="pretty mt-4 text-[17px] leading-[1.6] text-[#333]">{author.longBio}</p>
          </div>
          <div className={`${F} text-[13px] md:col-span-3 md:border-l md:border-[#dfdfdf] md:pl-6`}>
            {[["Haber & analiz", "1.240+"], ["Canlı yayın", "380+"], ["Sahadan ülke", "17"]].map(([k, v]) => (
              <div key={k} className="border-b border-[#e2e2e2] py-3 last:border-0">
                <p className={`${D} tnum text-[30px] font-bold leading-none text-[#121212]`}>{v}</p>
                <p className="mt-1 uppercase tracking-[0.06em] text-[#727272]">{k}</p>
              </div>
            ))}
          </div>
        </section>
        <p className={`${F} mt-2 text-[10px] text-[#999]`}>{a6 && "Rakamlar ve görseller temsilîdir."}</p>
      </main>

      <footer className={`${F} border-t border-[#121212] bg-white`}>
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-3 px-5 py-6 text-[12px] text-[#555] sm:flex-row">
          <span className={`${M} text-[26px] text-[#121212]`}>Çetiner Çetin</span>
          <span>© 2026 · Tüm hakları saklıdır · İletişim · RSS</span>
        </div>
      </footer>
    </div>
  );
}
