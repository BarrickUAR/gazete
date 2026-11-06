// Tasarım önizlemeleri için örnek içerik. Başlıklar temsilidir; gerçek içerik
// Aşama 2'de Supabase'den gelecek.

export type Kind = "Haber" | "Analiz" | "Köşe Yazısı" | "Saha Notu" | "Röportaj";

export type Article = {
  slug: string;
  kind: Kind;
  section: string;
  title: string;
  dek: string;
  date: string;
  readMin: number;
  place?: string;
  img: string; // picsum tohumu
};

export const author = {
  name: "Çetiner Çetin",
  first: "Çetiner",
  last: "Çetin",
  role: "Dış Politika ve Güvenlik Politikaları Yayın Koordinatörü",
  outlet: "Habertürk TV",
  shortBio:
    "Dış politika, güvenlik ve çatışma bölgelerinden haber yapıyor. Ukrayna'dan Orta Doğu'ya, sahadan canlı yayınlarla ve masa başı analizlerle Türkiye'nin bulunduğu coğrafyayı izliyor.",
  longBio:
    "Uzun yıllardır diplomasi, savunma ve bölgesel çatışmalar üzerine çalışıyor. Habertürk TV'de dış politika ve güvenlik politikaları yayınlarını koordine ediyor; zirveleri, müzakere masalarını ve cephe hatlarını izleyiciye ilk elden aktarıyor.",
  today: "6 Kasım 2026, Cuma",
};

export function img(seed: string, w = 1200, h = 800, gray = false) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}${gray ? "?grayscale" : ""}`;
}

export const lead: Article = {
  slug: "karadeniz-guvenlik-mimarisi",
  kind: "Analiz",
  section: "Dış Politika",
  title: "Karadeniz'de yeni güvenlik mimarisi: Ankara masanın neresinde?",
  dek: "Ateşkes görüşmeleri uzarken boğazlar, tahıl koridoru ve mayın temizliği Türkiye'yi bölgenin vazgeçilmez aktörü yapıyor. Diplomatik kulislerde konuşulan üç senaryo.",
  date: "6 Kasım 2026",
  readMin: 9,
  place: "İstanbul",
  img: "harbor-ships",
};

export const articles: Article[] = [
  {
    slug: "nato-zirvesi-izlenimler",
    kind: "Haber",
    section: "Güvenlik",
    title: "NATO zirvesinin perde arkası: Savunma harcamalarında yeni eşik",
    dek: "Müttefikler yüzde 3,5 hedefinde uzlaştı; Türkiye'nin savunma sanayii teklifi masada.",
    date: "5 Kasım 2026",
    readMin: 6,
    place: "Brüksel",
    img: "summit-hall",
  },
  {
    slug: "kiev-saha-notlari",
    kind: "Saha Notu",
    section: "Sahadan",
    title: "Kiev'den notlar: Sirenler arasında bir kış hazırlığı",
    dek: "Enerji altyapısına yönelik saldırıların ardından şehir, jeneratör sesiyle uyanıyor.",
    date: "3 Kasım 2026",
    readMin: 7,
    place: "Kiev",
    img: "winter-city",
  },
  {
    slug: "dogu-akdeniz-enerji",
    kind: "Analiz",
    section: "Enerji",
    title: "Doğu Akdeniz'de enerji denklemi yeniden kuruluyor",
    dek: "Yeni boru hattı projeleri ve deniz yetki alanları tartışması Ankara'nın elini güçlendiriyor mu?",
    date: "1 Kasım 2026",
    readMin: 8,
    img: "sea-platform",
  },
  {
    slug: "diplomasi-dili",
    kind: "Köşe Yazısı",
    section: "Görüş",
    title: "Diplomasinin dili sertleşirken sahadaki gerçek",
    dek: "Kürsüde söylenenle müzakere masasında konuşulan arasındaki mesafe hiç bu kadar açılmamıştı.",
    date: "30 Ekim 2026",
    readMin: 5,
    img: "old-paper",
  },
  {
    slug: "suriye-sinir-hatti",
    kind: "Haber",
    section: "Bölge",
    title: "Sınır hattında yeni dönem: Güvenli bölge planı ikinci aşamada",
    dek: "Askeri kaynaklar, lojistik hazırlıkların tamamlandığını ve sivil dönüşlerin hızlanacağını belirtiyor.",
    date: "28 Ekim 2026",
    readMin: 4,
    place: "Gaziantep",
    img: "desert-road",
  },
  {
    slug: "kafkasya-baris",
    kind: "Analiz",
    section: "Kafkasya",
    title: "Kafkasya'da barışın ekonomisi: Koridorlar, demiryolları, ticaret",
    dek: "Zengezur hattı açıldığında bölgesel ticaret haritası nasıl değişecek?",
    date: "25 Ekim 2026",
    readMin: 10,
    img: "railway-mountain",
  },
  {
    slug: "buyukelci-roportaj",
    kind: "Röportaj",
    section: "Röportaj",
    title: "Emekli bir büyükelçiyle: \"Diplomasi sabır işidir, ekran işi değil\"",
    dek: "Kırk yıllık meslek hayatından sonra krizleri, kulisleri ve yeni kuşağı konuştuk.",
    date: "22 Ekim 2026",
    readMin: 12,
    img: "library-chair",
  },
  {
    slug: "savunma-sanayii-ihracat",
    kind: "Haber",
    section: "Savunma",
    title: "Savunma sanayiinde ihracat rekoru: İHA'dan sonra sıra denizde",
    dek: "Yerli korvet ve insansız deniz araçları için üç ülkeyle görüşmeler ileri aşamada.",
    date: "20 Ekim 2026",
    readMin: 5,
    img: "navy-ship",
  },
];

export const columns: Article[] = [
  {
    slug: "sessiz-diplomasi",
    kind: "Köşe Yazısı",
    section: "Görüş",
    title: "Sessiz diplomasinin bedeli",
    dek: "Her kriz kameraların önünde çözülmez. Bazen en büyük başarı, hiç haber olmayan görüşmedir.",
    date: "4 Kasım 2026",
    readMin: 5,
    img: "desk-lamp",
  },
  {
    slug: "cephe-ve-ekran",
    kind: "Köşe Yazısı",
    section: "Görüş",
    title: "Cephe ile ekran arasındaki mesafe",
    dek: "Savaşı canlı yayında anlatmanın sorumluluğu, bir muhabirin taşıyabileceği en ağır yük.",
    date: "27 Ekim 2026",
    readMin: 6,
    img: "camera-field",
  },
  {
    slug: "yeni-soguk-savas",
    kind: "Köşe Yazısı",
    section: "Görüş",
    title: "Yeni Soğuk Savaş mı, eski alışkanlıklar mı?",
    dek: "Bloklar yeniden şekilleniyor, ama bu kez oyuncular çok daha fazla ve kurallar belirsiz.",
    date: "19 Ekim 2026",
    readMin: 7,
    img: "chess-board",
  },
];

export const appearances = [
  { date: "5 Kas", program: "Habertürk Ana Haber", topic: "NATO zirvesi sonrası değerlendirme", dur: "18 dk" },
  { date: "2 Kas", program: "Özel Yayın", topic: "Kiev'den canlı bağlantı", dur: "42 dk" },
  { date: "29 Eki", program: "Dünya Gündemi", topic: "Doğu Akdeniz ve enerji diplomasisi", dur: "35 dk" },
  { date: "24 Eki", program: "Habertürk Gece", topic: "Kafkasya'da barış süreci", dur: "26 dk" },
];

export const dossiers = [
  { title: "Ukrayna Savaşı", count: 148, years: "2022 – ", img: "ukraine-field" },
  { title: "Orta Doğu", count: 96, years: "2019 – ", img: "middle-east" },
  { title: "NATO ve Türkiye", count: 71, years: "2020 – ", img: "flags-row" },
  { title: "Kafkasya", count: 43, years: "2020 – ", img: "caucasus" },
];

export const sections = ["Dış Politika", "Güvenlik", "Sahadan", "Analiz", "Köşe Yazıları", "Röportajlar", "Video"];
