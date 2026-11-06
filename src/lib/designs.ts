export type Design = {
  href: string;
  no: string;
  name: string;
  tag: string;
  desc: string;
  fonts: string;
  swatch: string[];
};

export const designs: Design[] = [
  {
    href: "/tasarim-1",
    no: "01",
    name: "Gazete",
    tag: "Klasik · NYT çizgisi",
    desc: "Serif masthead, ince çizgiler, çok kolonlu manşet. Güven veren, kurumsal ve zamansız.",
    fonts: "Blackletter masthead / Gelasio (Georgia) / Franklin",
    swatch: ["#ffffff", "#121212", "#326891"],
  },
  {
    href: "/tasarim-2",
    no: "02",
    name: "Muhabir Dosyası",
    tag: "Sinematik · Koyu",
    desc: "Siyah-beyaz büyük fotoğraf, sahadan muhabir defteri, belgesel havası.",
    fonts: "Fraunces / IBM Plex Sans / Plex Mono",
    swatch: ["#0e0e0d", "#ece8e1", "#d23a2f"],
  },
  {
    href: "/tasarim-3",
    no: "03",
    name: "Köşe Yazarı",
    tag: "Dergi · Okuma odaklı",
    desc: "Krem kâğıt, drop-cap, yazı dizini ve büyük alıntılar. Sakin, ağırbaşlı.",
    fonts: "Newsreader / DM Sans",
    swatch: ["#f5f0e6", "#1d1a16", "#8a2e1e"],
  },
  {
    href: "/tasarim-4",
    no: "04",
    name: "Yayın Kuruluşu",
    tag: "Portal · BBC tarzı",
    desc: "Kutulu logo, kart grid, canlı etiketi, en çok okunanlar. Net ve hızlı.",
    fonts: "Noto Sans / Noto Serif",
    swatch: ["#ffffff", "#141414", "#b80000"],
  },
  {
    href: "/tasarim-5",
    no: "05",
    name: "Portfolyo",
    tag: "Sade · Kişisel arşiv",
    desc: "Solda sabit muhabir kimliği, sağda filtrelenebilir yayın akışı. Ferah, modern, kurumsal.",
    fonts: "Schibsted Grotesk / Spectral",
    swatch: ["#ffffff", "#15171a", "#1f5b45"],
  },
  {
    href: "/tasarim-6",
    no: "06",
    name: "Yayın Stüdyosu",
    tag: "TV · Canlı yayın grafiği",
    desc: "Alt bant, canlı saat, son dakika şeridi ve yayın akışı. Ekran gazeteciliğinin dili.",
    fonts: "Barlow Condensed / Barlow",
    swatch: ["#070f1e", "#ffffff", "#e5141b", "#ffc21a"],
  },
];
