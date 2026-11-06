import type { Metadata } from "next";
import { Source_Sans_3, Roboto_Serif } from "next/font/google";
import { Portrait } from "@/components/portrait";
import { author, lead as a3, articles, columns, appearances, sections, img } from "@/lib/mock";

// BBC News: Reith Sans karşılığı Source Sans 3 (hümanist grotesk) · Reith Serif hissi için düşük kontrastlı Roboto Serif (başlıklar)
const sans = Source_Sans_3({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700", "800"], variable: "--f-ns" });
const serif = Roboto_Serif({ subsets: ["latin", "latin-ext"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--f-nsf" });

export const metadata: Metadata = { title: "Tasarım 4 · Yayın Kuruluşu — Çetiner Çetin" };

const SERIF = "font-[family-name:var(--f-nsf)]";
const RED = "#b80000";

function Logo({ invert = false }: { invert?: boolean }) {
  const box = invert ? "bg-white text-black" : "bg-black text-white";
  return (
    <span className="flex items-center gap-[3px]">
      {["Ç", "Ç"].map((l, i) => (
        <span key={i} className={`grid h-7 w-7 place-items-center text-[16px] font-extrabold leading-none ${box}`}>{l}</span>
      ))}
      <span className={`ml-2 text-[17px] font-extrabold tracking-[-0.01em] ${invert ? "text-white" : "text-black"}`}>HABER</span>
    </span>
  );
}

function Meta({ time, section }: { time: string; section: string }) {
  return (
    <p className="mt-2.5 flex items-center gap-2 text-[12.5px] text-[#545658]">
      <span>{time}</span>
      <span className="h-3 w-px bg-[#c8c8c8]" />
      <span>{section}</span>
    </p>
  );
}

function Card({ a, size = "md" }: { a: (typeof articles)[number]; size?: "sm" | "md" }) {
  return (
    <article className="group">
      <img src={img(a.img, 800, 450)} alt="" className="aspect-video w-full object-cover" />
      <h3 className={`${SERIF} balance mt-3 font-semibold leading-[1.2] tracking-[-0.005em] decoration-2 underline-offset-2 group-hover:underline ${size === "sm" ? "text-[18px]" : "text-[21px]"}`}>
        <a href={a.url}>{a.title}</a>
      </h3>
      {size === "md" && <p className="mt-2 text-[15px] leading-[1.45] text-[#3f3f42]">{a.dek}</p>}
      <Meta time={a.date} section={a.section} />
    </article>
  );
}

function SectionHead({ title, dark = false }: { title: string; dark?: boolean }) {
  return (
    <div className={`flex items-center justify-between border-t-2 pt-2.5 ${dark ? "border-white" : "border-black"}`}>
      <h2 className="text-[22px] font-bold tracking-[-0.01em]">{title}</h2>
      <a href="#" className={`text-[13px] font-semibold hover:underline ${dark ? "text-white" : "text-black"}`}>Tümü →</a>
    </div>
  );
}

export default function Yayin() {
  const [a1, a2, lead, a4, a5, a6, a7, a8] = articles;

  return (
    <div className={`${sans.variable} ${serif.variable} font-[family-name:var(--f-ns)] bg-white text-[#141414]`}>
      {/* üst bar */}
      <header className="border-b border-[#e0e0e0]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-6 text-[14px] font-semibold lg:flex">
              {["Ana sayfa", "Haberler", "Analiz", "Görüş", "Video", "Hakkında"].map((n, i) => (
                <a key={n} href="#" className={`border-b-[3px] py-2 ${i === 1 ? "border-black" : "border-transparent hover:border-black"}`}>{n}</a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-[13px] font-semibold">
            <span className="hidden text-[#545658] sm:block">{author.today}</span>
            <a href="#" className="bg-black px-3.5 py-2 text-white">Bülten</a>
          </div>
        </div>
      </header>
      <div className="border-b border-[#e0e0e0]">
        <nav className="mx-auto flex max-w-[1280px] gap-6 overflow-x-auto px-5 py-2.5 text-[13.5px] text-[#3f3f42]">
          {sections.map((s) => (
            <a key={s} href="#" className="shrink-0 hover:text-black hover:underline">{s}</a>
          ))}
        </nav>
      </div>

      <main className="mx-auto max-w-[1280px] px-5 pb-16 pt-6">
        {/* üst grid: BBC tarzı 3 kolon */}
        <section className="grid gap-6 lg:grid-cols-12">
          <div className="order-2 flex flex-col gap-6 lg:order-1 lg:col-span-3 lg:border-r lg:border-[#e0e0e0] lg:pr-6">
            <article className="group">
              <p className="mb-2 inline-flex items-center gap-1.5 text-[12px] font-extrabold uppercase" style={{ color: RED }}>Sahadan · {a2.place}</p>
              <h3 className={`${SERIF} balance text-[21px] font-semibold leading-[1.2] decoration-2 underline-offset-2 group-hover:underline`}><a href={a2.url}>{a2.title}</a></h3>
              <p className="mt-2 text-[15px] leading-[1.45] text-[#3f3f42]">{a2.dek}</p>
              <Meta time={a2.date} section={a2.section} />
            </article>
            <div className="border-t border-[#e0e0e0] pt-6">
              <Card a={a5} size="sm" />
            </div>
          </div>

          <article className="group order-1 lg:order-2 lg:col-span-6">
            <img src={img(a3.img, 1400, 788)} alt="" className="aspect-video w-full object-cover" />
            <h1 className={`${SERIF} balance mt-4 text-[30px] font-bold leading-[1.1] tracking-[-0.01em] decoration-2 underline-offset-4 group-hover:underline sm:text-[40px]`}>
              <a href={a3.url}>{a3.title}</a>
            </h1>
            <p className="pretty mt-3 text-[17px] leading-[1.5] text-[#3f3f42]">{a3.dek}</p>
            <Meta time={a3.date} section={a3.section} />
          </article>

          <div className="order-3 flex flex-col gap-6 lg:col-span-3 lg:border-l lg:border-[#e0e0e0] lg:pl-6">
            <Card a={a1} size="sm" />
            <div className="border-t border-[#e0e0e0] pt-6">
              <Card a={lead} size="sm" />
            </div>
          </div>
        </section>

        {/* yatay şerit */}
        <section className="mt-8 grid gap-6 border-t border-[#e0e0e0] pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {[a4, a6, a7, a8].map((a) => (
            <Card key={a.slug} a={a} size="sm" />
          ))}
        </section>

        {/* görüş + en çok okunan */}
        <section className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionHead title="Görüş" />
            <div className="mt-5 grid gap-6 md:grid-cols-3">
              {columns.map((c) => (
                <article key={c.slug} className="group border-l-4 border-black pl-4">
                  <div className="flex items-center gap-2.5">
                    <Portrait small bg="#ebebeb" className="h-11 w-11 rounded-full" />
                    <p className="text-[13px] font-bold">{author.name}</p>
                  </div>
                  <h3 className={`${SERIF} balance mt-3 text-[20px] font-bold leading-[1.25] group-hover:underline`}><a href={c.url}>{c.title}</a></h3>
                  <p className="mt-2 text-[14.5px] leading-[1.45] text-[#3f3f42]">{c.dek}</p>
                  <p className="mt-2.5 text-[12.5px] text-[#545658]">{c.date}</p>
                </article>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4">
            <SectionHead title="Editörün seçtikleri" />
            <ol className="mt-2">
              {[a2, a3, a1, a5, lead].map((a, i) => (
                <li key={a.slug} className="flex gap-4 border-b border-[#e0e0e0] py-3.5 last:border-0">
                  <span className="tnum w-8 shrink-0 text-[36px] font-light leading-[0.9]" style={{ color: RED }}>{i + 1}</span>
                  <a href={a.url} className={`${SERIF} text-[16.5px] font-semibold leading-[1.25] hover:underline`}>{a.title}</a>
                </li>
              ))}
            </ol>
          </aside>
        </section>
      </main>

      {/* video bandı */}
      <section className="bg-[#141414] text-white">
        <div className="mx-auto max-w-[1280px] px-5 py-10">
          <SectionHead title="Ekranda" dark />
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {appearances.map((x, i) => (
              <a key={x.topic} href="#" className="group">
                <div className="relative">
                  <img src={img(["election", "quake", "flags-row", "sudan"][i], 640, 360)} alt="" className="aspect-video w-full object-cover" />
                  <span className="absolute bottom-0 left-0 flex items-center gap-1.5 bg-black px-2.5 py-1.5 text-[12px] font-bold">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden><path d="M8 5.5v13l10.5-6.5z" /></svg>
                    {x.dur}
                  </span>
                </div>
                <h3 className={`${SERIF} mt-3 text-[18px] font-semibold leading-[1.2] group-hover:underline`}>{x.topic}</h3>
                <p className="mt-1.5 text-[12.5px] text-[#b8b8b8]">{x.program} · {x.date}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* hakkında */}
      <section className="mx-auto max-w-[1280px] px-5 py-12">
        <SectionHead title="Muhabir" />
        <div className="mt-6 grid items-center gap-8 md:grid-cols-12">
          <Portrait bg="#ebebeb" className="aspect-square w-full md:col-span-3" />
          <div className="md:col-span-6">
            <p className={`${SERIF} text-[34px] font-bold leading-tight`}>{author.name}</p>
            <p className="mt-1 text-[14px] font-semibold text-[#545658]">{author.role} · {author.outlet}</p>
            <p className="pretty mt-4 text-[16.5px] leading-[1.6] text-[#3f3f42]">{author.longBio}</p>
          </div>
          <div className="flex flex-col gap-2 text-[14px] font-bold md:col-span-3">
            <a href="#" className="bg-black px-4 py-3 text-center text-white">Haber ihbarı gönder</a>
            <a href="#" className="border-2 border-black px-4 py-2.5 text-center">Röportaj talebi</a>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white">
        <div className="mx-auto max-w-[1280px] px-5 py-8">
          <Logo invert />
          <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#3a3a3a] pt-5 text-[13px] text-[#d0d0d0]">
            {["Kullanım şartları", "Gizlilik", "Çerezler", "İletişim", "RSS"].map((n) => <a key={n} href="#" className="hover:underline">{n}</a>)}
          </nav>
          <p className="mt-5 text-[12px] text-[#9a9a9a]">© 2026 Çetiner Çetin</p>
        </div>
      </footer>
    </div>
  );
}
