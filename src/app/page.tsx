import Link from "next/link";
import { Playfair_Display, Libre_Franklin } from "next/font/google";

const display = Playfair_Display({ subsets: ["latin", "latin-ext"], weight: ["700", "900"], variable: "--f-display" });
const sans = Libre_Franklin({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], variable: "--f-sans" });

const designs = [
  { href: "/tasarim-1", no: "01", name: "Gazete", desc: "New York Times çizgisinde klasik gazete düzeni. Serif masthead, ince çizgiler, çok kolonlu manşet.", fonts: "Playfair Display · Source Serif · Libre Franklin", swatch: ["#ffffff", "#121212", "#326891"] },
  { href: "/tasarim-2", no: "02", name: "Muhabir Dosyası", desc: "Koyu, sinematik, sahadan muhabirliği öne çıkaran editoryal düzen. Büyük fotoğraf, rota defteri.", fonts: "Fraunces · IBM Plex Sans · Plex Mono", swatch: ["#0e0e0d", "#ece8e1", "#d23a2f"] },
  { href: "/tasarim-3", no: "03", name: "Köşe Yazarı", desc: "Krem kâğıt üzerinde dergi tadında, okumaya odaklı sakin düzen. Yazı dizini, büyük alıntılar.", fonts: "Newsreader · DM Sans", swatch: ["#f5f0e6", "#1d1a16", "#8a2e1e"] },
  { href: "/tasarim-4", no: "04", name: "Yayın Kuruluşu", desc: "BBC tarzı, net ve hızlı haber portalı. Kutulu logo, kart grid, canlı etiketi, en çok okunanlar.", fonts: "Noto Sans · Noto Serif", swatch: ["#ffffff", "#141414", "#b80000"] },
];

export default function Secim() {
  return (
    <div className={`${display.variable} ${sans.variable} min-h-screen bg-[#f4f3f0] font-[family-name:var(--f-sans)] text-[#141414]`}>
      <div className="mx-auto max-w-[1180px] px-5 py-14 lg:px-8 lg:py-20">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#6b6a66]">Tasarım önerileri · Anasayfa</p>
        <h1 className="mt-3 font-[family-name:var(--f-display)] text-[44px] font-black leading-[1.02] sm:text-[64px]">Çetiner Çetin</h1>
        <p className="mt-4 max-w-[56ch] text-[16px] leading-[1.6] text-[#4a4945]">
          Kişisel haber, analiz ve köşe yazısı sitesi için dört farklı yön. Birini seçin; seçilen tasarım üzerinden yazı sayfaları, yönetim paneli ve veritabanı kurulacak.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {designs.map((d) => (
            <Link key={d.href} href={d.href} className="group flex flex-col justify-between border border-[#dcdad4] bg-white p-7 transition-colors duration-150 hover:border-[#141414]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="tnum text-[13px] font-semibold text-[#8a8984]">{d.no}</span>
                  <span className="flex">
                    {d.swatch.map((c) => (
                      <span key={c} className="h-5 w-5 border border-black/10" style={{ background: c }} />
                    ))}
                  </span>
                </div>
                <h2 className="mt-6 font-[family-name:var(--f-display)] text-[32px] font-bold leading-none">{d.name}</h2>
                <p className="mt-3 text-[15px] leading-[1.55] text-[#4a4945]">{d.desc}</p>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-[#ecebe7] pt-4 text-[12.5px]">
                <span className="text-[#8a8984]">{d.fonts}</span>
                <span className="font-semibold group-hover:underline">Görüntüle →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
