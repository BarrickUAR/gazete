// Kurumsal kimlik kılavuzu: logo, renkler, tipografi, kullanım kuralları. Yazdır → PDF ile dışa aktarılır.
import type { Metadata } from "next";
import { Bodoni_Moda, Libre_Caslon_Display } from "next/font/google";
import { Monogram, Wordmark } from "@/brand/logo";
import { PrintButton } from "@/components/print-button";
import { PageHead } from "@/components/admin/ui";
import { requireStaff } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Marka kılavuzu" };

const bod = Bodoni_Moda({ subsets: ["latin", "latin-ext"], weight: ["600"], style: ["normal", "italic"] });
const cas = Libre_Caslon_Display({ subsets: ["latin", "latin-ext"], weight: "400" });

const COLORS = [
  { name: "Mavi", token: "--brand-blue", hex: "#1f5fbf", role: "Ana renk. Logo zemini, bağlantı, birincil düğme.", fg: "#fff" },
  { name: "Beyaz", token: "--brand-white", hex: "#ffffff", role: "Ana renk. Logo işareti, açık zemin.", fg: "#1b1d22" },
  { name: "Lacivert", token: "--brand-navy", hex: "#0f2440", role: "Ek renk. Dış Haberler başlıkları, koyu bantlar.", fg: "#fff" },
  { name: "Kırmızı", token: "--brand-red", hex: "#c4262e", role: "Ek renk. Son dakika, Dış Haberler vurgusu. Az kullanılır.", fg: "#fff" },
  { name: "Krem", token: "--brand-cream", hex: "#f7f4ee", role: "Ek renk. Dış Haberler ve rapor zemini.", fg: "#1b1d22" },
  { name: "Mürekkep", token: "--brand-ink", hex: "#1b1d22", role: "Metin rengi (açık zeminde).", fg: "#fff" },
];

const TYPE = [
  { name: "Bodoni Moda", use: "Genel site başlıkları (manşet, yazı başlığı)", cls: bod.className, sample: "Ankara'da kritik toplantı" },
  { name: "IBM Plex Sans / Condensed", use: "Gövde metni, arayüz, etiketler", cls: "font-ui", sample: "Kaynaklar görüşmenin iki saat sürdüğünü belirtti." },
  { name: "Libre Caslon Display / Text", use: "Dış Haberler başlık ve gövdesi", cls: cas.className, sample: "Kafkasya'da yeni denge" },
  { name: "Fira Sans", use: "Dış Haberler arayüzü ve etiketleri", cls: "font-ui", sample: "DOSYA · ANALİZ" },
  { name: "Noto Naskh Arabic / IBM Plex Sans Arabic", use: "Arapça başlık ve metin (sağdan sola, italik ve büyük harf yok)", cls: "", sample: "تركيا والمنطقة", dir: "rtl" as const },
];

const DONT = [
  "Logoyu esnetmeyin, eğmeyin, döndürmeyin.",
  "Mavi kare dışında renk kullanmayın (yalnız beyaz, lacivert ya da tek renk siyah sürümler).",
  "Monogramın etrafında kare genişliğinin en az %25'i kadar boşluk bırakın.",
  "Logoyu desenli/fotoğraflı zemin üzerine kontrastsız koymayın.",
  "Monogramı 16 pikselden küçük kullanmayın (favicon hariç).",
  "Kırmızıyı geniş alanlarda zemin rengi olarak kullanmayın; vurgu rengidir.",
];

export default async function Brand() {
  await requireStaff("author");
  return (
    <div className="max-w-[1080px]">
      <PageHead title="Marka kılavuzu" sub="Çetiner Çetin kurumsal kimliği · sürüm 1.0" actions={<PrintButton label="PDF olarak kaydet" />} />

      <section className="mb-10">
        <h2 className="mb-4 text-[16px] font-semibold">1 · Logo</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <figure className="grid place-items-center rounded-lg border border-line bg-white p-10">
            <Wordmark className="text-[22px] font-semibold text-[#1b1d22]" />
            <figcaption className="mt-4 text-[12.5px] text-[#6b6f78]">Ana logo · açık zemin</figcaption>
          </figure>
          <figure className="grid place-items-center rounded-lg bg-[#0f2440] p-10">
            <Wordmark className="text-[22px] font-semibold text-white" markBg="#ffffff" markFg="#0f2440" />
            <figcaption className="mt-4 text-[12.5px] text-white/70">Koyu zemin</figcaption>
          </figure>
          <figure className="grid place-items-center rounded-lg border border-line bg-bg-2 p-10">
            <div className="flex items-end gap-4">
              <Monogram size={64} />
              <Monogram size={32} />
              <Monogram size={16} />
            </div>
            <figcaption className="mt-4 text-[12.5px] text-muted">Monogram · 64 / 32 / 16 px</figcaption>
          </figure>
        </div>
        <p className="mt-3 text-[13.5px] text-fg-3">
          Monogram iç içe iki “C” ve Türkçe “Ç” çengelinden oluşur. Dosya: <code className="font-mono text-[12.5px]">public/icon.svg</code>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-[16px] font-semibold">2 · Renkler</h2>
        <p className="mb-4 text-[13.5px] text-fg-3">Ana renkler mavi ve beyaz; ek renkler lacivert, kırmızı ve krem. Mürekkep metin rengidir.</p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COLORS.map((c) => (
            <li key={c.hex} className="overflow-hidden rounded-lg border border-line bg-bg-2">
              <div className="flex h-24 items-end p-3 text-[13px] font-semibold" style={{ background: c.hex, color: c.fg }}>
                {c.name}
              </div>
              <div className="p-3 text-[13px]">
                <p className="font-mono text-[12.5px]">
                  {c.hex.toUpperCase()} · <span className="text-muted">var({c.token})</span>
                </p>
                <p className="mt-1 text-fg-3">{c.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-[16px] font-semibold">3 · Tipografi</h2>
        <ul className="divide-y divide-line rounded-lg border border-line bg-bg-2">
          {TYPE.map((t) => (
            <li key={t.name} className="grid gap-2 p-4 md:grid-cols-[260px_1fr] md:items-center">
              <div>
                <p className="text-[14px] font-semibold">{t.name}</p>
                <p className="text-[12.5px] text-muted">{t.use}</p>
              </div>
              <p dir={t.dir} className={`text-[28px] leading-tight ${t.cls}`} style={t.dir ? { fontFamily: "var(--f-naskh), serif" } : undefined}>
                {t.sample}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-[16px] font-semibold">4 · İki tasarım dili</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-[#0c0c0b] p-6 text-[#ece7df]">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#d23a2f]">Genel site</p>
            <p className={`mt-2 text-[26px] leading-tight ${bod.className}`}>Muhabir dosyası</p>
            <p className="mt-2 text-[13.5px] text-[#bdb7ad]">Koyu zemin, Bodoni başlık, Plex gövde. Haber, köşe yazısı, rapor, arşiv.</p>
          </div>
          <div className="rounded-lg border border-[#ddd6c9] bg-[#f7f4ee] p-6 text-[#1b1d22]">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#c4262e]">Dış Haberler</p>
            <p className={`mt-2 text-[26px] leading-tight text-[#0f2440] ${cas.className}`}>Analiz dergisi</p>
            <p className="mt-2 text-[13.5px] text-[#4a4d55]">Krem zemin, lacivert Caslon başlık, kırmızı vurgu. Kategori “Dış Haberler” ise otomatik uygulanır.</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-[16px] font-semibold">5 · Yapılmaması gerekenler</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {DONT.map((d) => (
            <li key={d} className="rounded-md border border-line bg-bg-2 px-4 py-3 text-[13.5px]">
              <span className="me-2 font-semibold text-[#a42828]">✕</span>
              {d}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
