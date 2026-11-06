import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Hanken_Grotesk } from "next/font/google";
import { Portrait } from "@/components/portrait";
import { author, lead, articles, columns, dossiers, sections, img } from "@/lib/mock";

// Financial Times: Financier Display yerine keskin serif Frank Ruhl Libre · FT Metric hissi için Hanken Grotesk
const lit = Frank_Ruhl_Libre({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], variable: "--f-lit" });
const hk = Hanken_Grotesk({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], variable: "--f-hk" });

export const metadata: Metadata = { title: "Tasarım 7 · Pembe Gazete — Çetiner Çetin" };

const SERIF = "font-[family-name:var(--f-lit)]";
const SANS = "font-[family-name:var(--f-hk)]";
const PAPER = "#fff1e5";
const TINT = "#f2dfce";
const CLARET = "#990f3d";
const TEAL = "#0d7680";
const INK = "#33302e";

function Tag({ children, color = CLARET }: { children: React.ReactNode; color?: string }) {
  return <p className={`${SANS} text-[13px] font-semibold`} style={{ color }}>{children}</p>;
}

export default function PembeGazete() {
  const [a1, a2, a3, a4, a5, a6, a7, a8] = articles;

  return (
    <div className={`${lit.variable} ${hk.variable} ${SANS} min-h-screen`} style={{ background: PAPER, color: INK }}>
      {/* üst bar */}
      <div className="border-b" style={{ borderColor: "#ccc1b7" }}>
        <div className="mx-auto flex max-w-[1220px] items-center justify-between px-5 py-2 text-[12.5px]">
          <span>{author.today}</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Arşiv</a>
            <a href="#" className="px-3 py-1.5 font-semibold text-white" style={{ background: TEAL }}>Bültene abone ol</a>
          </div>
        </div>
      </div>

      {/* masthead */}
      <header className="mx-auto max-w-[1220px] px-5">
        <div className="py-6 text-center sm:py-8">
          <a href="#" className={`${SERIF} text-[40px] font-medium tracking-[-0.01em] text-[#1a1817] sm:text-[64px]`}>
            Çetiner Çetin
          </a>
        </div>
        <nav className="flex gap-6 overflow-x-auto border-y py-2.5 text-[14px] font-medium" style={{ borderColor: "#1a1817" }}>
          {sections.map((s, i) => (
            <a key={s} href="#" className={`shrink-0 hover:underline ${i === 0 ? "font-semibold" : ""}`}>{s}</a>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1220px] px-5 pb-16 pt-6">
        {/* üst blok */}
        <section className="grid gap-x-6 gap-y-8 lg:grid-cols-12">
          {/* manşet */}
          <article className="lg:col-span-6">
            <a href={a1.url} className="group block">
              <img src={img(a1.img)} alt="" className="aspect-[16/10] w-full object-cover" />
              <div className="mt-4">
                <Tag>{a1.section}</Tag>
                <h1 className={`${SERIF} balance mt-1.5 text-[34px] font-medium leading-[1.06] tracking-[-0.01em] text-[#1a1817] group-hover:text-[#5c5552] sm:text-[44px]`}>{a1.title}</h1>
                <p className="pretty mt-3 text-[17px] leading-[1.5]">{a1.dek}</p>
              </div>
            </a>
            <ul className="mt-5 border-t pt-3" style={{ borderColor: "#ccc1b7" }}>
              {[a7, a8].map((a) => (
                <li key={a.slug} className="py-1.5">
                  <a href={a.url} className="flex gap-2 text-[15.5px] font-semibold hover:underline">
                    <span style={{ color: CLARET }}>■</span>
                    {a.title}
                  </a>
                </li>
              ))}
            </ul>
          </article>

          {/* orta kolon */}
          <div className="border-t pt-5 sm:grid sm:grid-cols-2 sm:gap-6 lg:col-span-3 lg:block lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0" style={{ borderColor: "#ccc1b7" }}>
            {[lead, a3, a4].map((a, i) => (
              <article key={a.slug} className={`${i > 0 ? "border-t pt-4 sm:border-t-0 sm:pt-0 lg:border-t lg:pt-4" : ""} pb-4`} style={{ borderColor: "#ccc1b7" }}>
                {i === 0 && <img src={img(a.img)} alt="" className="mb-3 aspect-[16/9] w-full object-cover" />}
                <Tag>{a.section}</Tag>
                <h3 className={`${SERIF} balance mt-1 text-[20px] font-medium leading-[1.15] text-[#1a1817]`}>
                  <a href={a.url} className="hover:text-[#5c5552]">{a.title}</a>
                </h3>
                <p className="mt-1.5 text-[14.5px] leading-[1.45]">{a.dek}</p>
              </article>
            ))}
          </div>

          {/* görüş */}
          <aside className="lg:col-span-3 lg:border-l lg:pl-6" style={{ borderColor: "#ccc1b7" }}>
            <h4 className="border-t-4 pt-2 text-[15px] font-bold" style={{ borderColor: CLARET }}>Görüş</h4>
            {columns.map((c, i) => (
              <article key={c.slug} className={`py-4 ${i > 0 ? "border-t" : ""}`} style={{ borderColor: "#ccc1b7" }}>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold" style={{ color: CLARET }}>{author.name}</p>
                    <h3 className={`${SERIF} balance mt-1 text-[19px] font-medium leading-[1.18] text-[#1a1817]`}>
                      <a href={c.url} className="hover:text-[#5c5552]">{c.title}</a>
                    </h3>
                  </div>
                  <Portrait small bg={TINT} className="h-[68px] w-[68px] shrink-0 rounded-full" />
                </div>
              </article>
            ))}
          </aside>
        </section>

        {/* koyu bant: saha */}
        <section className="mt-10 grid overflow-hidden lg:grid-cols-12" style={{ background: "#1a1817", color: PAPER }}>
          <img src={img(a2.img)} alt="" className="h-full min-h-[260px] w-full object-cover lg:col-span-7" />
          <a href={a2.url} className="group flex flex-col justify-center p-7 sm:p-10 lg:col-span-5">
            <p className="text-[13px] font-semibold text-[#ffc2a3]">Sahadan · {a2.place} · {a2.date}</p>
            <h2 className={`${SERIF} balance mt-3 text-[34px] font-medium leading-[1.12] group-hover:underline sm:text-[42px]`}>{a2.title}</h2>
            <p className="pretty mt-4 text-[16px] leading-[1.55] text-[#e9dccf]">{a2.dek}</p>
          </a>
        </section>

        {/* alt şerit */}
        <section className="mt-10 grid gap-6 sm:grid-cols-2">
          {[a5, a6].map((a) => (
            <article key={a.slug} className="p-4" style={{ background: TINT }}>
              <Tag>{a.section}</Tag>
              <h3 className={`${SERIF} balance mt-1.5 text-[21px] font-medium leading-[1.15] text-[#1a1817]`}>
                <a href={a.url} className="hover:underline">{a.title}</a>
              </h3>
              <p className="mt-3 text-[12.5px] text-[#66605c]">{a.date}</p>
            </article>
          ))}
        </section>

        {/* dosyalar + yazar */}
        <section className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h4 className="border-t-4 pt-2 text-[15px] font-bold" style={{ borderColor: "#1a1817" }}>Dosyalar</h4>
            <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {dossiers.map((d) => (
                <a key={d.title} href="#" className="group">
                  <img src={img(d.img)} alt="" className="aspect-square w-full object-cover" />
                  <p className={`${SERIF} mt-2.5 text-[20px] font-medium leading-tight text-[#1a1817] group-hover:underline`}>{d.title}</p>
                  <p className="text-[12.5px] text-[#66605c]">{d.count} yazı</p>
                </a>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4">
            <h4 className="border-t-4 pt-2 text-[15px] font-bold" style={{ borderColor: CLARET }}>Yazar</h4>
            <div className="mt-4 flex gap-4">
              <Portrait bg={TINT} className="aspect-[4/5] w-28 shrink-0" />
              <div>
                <p className={`${SERIF} text-[22px] font-semibold leading-tight text-[#1a1817]`}>{author.name}</p>
                <p className="mt-1 text-[13px] font-medium" style={{ color: CLARET }}>{author.outlet}</p>
                <p className="mt-2 text-[14px] leading-[1.5]">{author.longBio}</p>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <footer style={{ background: "#33302e", color: "#e9dccf" }}>
        <div className="mx-auto flex max-w-[1220px] flex-col justify-between gap-3 px-5 py-7 text-[13px] sm:flex-row sm:items-center">
          <span className={`${SERIF} text-[24px] font-medium text-white`}>Çetiner Çetin</span>
          <span>© 2026 · İletişim · Gizlilik · RSS</span>
        </div>
      </footer>
    </div>
  );
}
