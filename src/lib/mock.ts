// Çetiner Çetin'in Habertürk köşe yazıları (kaynak: haberturk.com/htyazar/cetiner-cetin).
// Tarihler yazının konusundan ay bazında çıkarıldı (sayfa yalnızca "3 yıl önce" gösteriyor).
// Okuma süreleri tahminidir. Aşama 2'de bu veri Supabase'den gelecek.

export type Kind = "Köşe Yazısı" | "Analiz" | "Haber" | "Saha Notu" | "Röportaj";

export type Article = {
  slug: string;
  kind: Kind;
  section: string;
  title: string;
  dek: string;
  date: string;
  readMin: number;
  place?: string;
  img: string;
  url: string;
};

const HT = "https://www.haberturk.com/yazarlar/cetiner-cetin/";

export const author = {
  name: "Çetiner Çetin",
  first: "Çetiner",
  last: "Çetin",
  role: "Dış Politika ve Güvenlik Politikaları Yayın Koordinatörü",
  outlet: "Habertürk",
  shortBio:
    "Dış politika, güvenlik ve Türkiye gündemi üzerine yazıyor. Seçimlerden deprem bölgesine, Suriye'den NATO'ya Türkiye'nin bulunduğu coğrafyayı izliyor.",
  longBio:
    "Habertürk'te dış politika ve güvenlik politikaları yayınlarını koordine ediyor; köşe yazılarında bölgesel krizleri, diplomasi trafiğini ve Türkiye siyasetini yorumluyor.",
  today: "6 Kasım 2026, Cuma",
};

export function img(seed: string, _w?: number, _h?: number, _gray?: boolean) {
  void _w;
  void _h;
  void _gray;
  return `/img/${seed}.jpg`;
}

export const lead: Article = {
  slug: "finlandiya-natoya-ne-kazandiracak",
  kind: "Köşe Yazısı",
  section: "Dış Politika",
  title: "Finlandiya NATO'ya ne kazandıracak?",
  dek: "Türkiye'nin onayıyla Finlandiya'nın NATO üyeliği kabul edildi. İttifak ile Rusya arasındaki sınır uzadı; yeni bir güvenlik konseptine ihtiyaç doğdu.",
  date: "Nisan 2023",
  readMin: 6,
  place: "Brüksel",
  img: "flags-row",
  url: HT + "3580354-finlandiya-natoya-ne-kazandiracak",
};

export const articles: Article[] = [
  {
    slug: "acil-ihtiyac-listesi",
    kind: "Köşe Yazısı",
    section: "Siyaset",
    title: "Acil ihtiyaç listesi: Somut politikalar",
    dek: "Seçim sonuçları her boyutuyla tartışıldı, bölgelerin etnik ve mezhepsel analizleri yapıldı. Açıkçası sonucu iki taraf da bilemedi.",
    date: "Mayıs 2023",
    readMin: 5,
    place: "Ankara",
    img: "tbmm",
    url: HT + "3593642-acil-ihtiyac-listesi-somut-politikalar",
  },
  {
    slug: "fay-hattinda-mucize-mumkun",
    kind: "Saha Notu",
    section: "Deprem",
    title: "Fay hattında mucize mümkün",
    dek: "Günlerdir süren çimento tozu kokusu, kadınların feryadı ve enkazdan çıkacak bir mucizeye tutunan umut.",
    date: "Şubat 2023",
    readMin: 6,
    place: "Hatay",
    img: "quake",
    url: HT + "3570146-fay-hattinda-mucize-mumkun",
  },
  {
    slug: "sudanin-hal-i-pur-melali",
    kind: "Köşe Yazısı",
    section: "Dış Politika",
    title: "Sudan'ın Hal-i Pür Melali",
    dek: "Ordu ile paramiliter güçler arasındaki çatışmalar bölgede domino etkisi riski taşıyor; sivillerin tahliyesi için çabalar sürüyor.",
    date: "Nisan 2023",
    readMin: 6,
    place: "Hartum",
    img: "sudan",
    url: HT + "3587406-sudanin-hal-i-pur-melali",
  },
  {
    slug: "simdi-anketorler-dusunsun",
    kind: "Köşe Yazısı",
    section: "Siyaset",
    title: "Şimdi anketörler düşünsün…",
    dek: "Anket şirketleri, analistler ve yorumcular sınıfta kaldı. Son iki aydır siyaset bir spor müsabakası gibi izlendi.",
    date: "Mayıs 2023",
    readMin: 5,
    img: "election",
    url: HT + "3592089-simdi-anketorler-dusunsun",
  },
  {
    slug: "abdnin-suriye-uslerindeki-kostebek",
    kind: "Köşe Yazısı",
    section: "Güvenlik",
    title: "ABD'nin Suriye üslerindeki köstebek kim?",
    dek: "Bir ayda yedi saldırı. Suriye'deki Amerikan üslerini hedef alan eylemlerin arkasındaki soru işaretleri.",
    date: "Mart 2023",
    readMin: 6,
    place: "Suriye",
    img: "desert-road",
    url: HT + "3576900-abdnin-suriye-uslerindeki-kostebek-kim",
  },
  {
    slug: "avrupayi-kurt-petrolu-isitabilir-mi",
    kind: "Analiz",
    section: "Enerji",
    title: "Avrupa'yı Kürt petrolü ısıtabilir mi",
    dek: "Paris'teki tahkim kararı Irak merkezi yönetimini haklı buldu. Kararın enerji ve diplomasi hesaplarına etkisi.",
    date: "Mart 2023",
    readMin: 6,
    img: "sea-platform",
    url: HT + "3578059-avrupayi-kurt-petrolu-isitabilir-mi",
  },
  {
    slug: "netlik",
    kind: "Köşe Yazısı",
    section: "Orta Doğu",
    title: "Netlik…",
    dek: "Ramazan boyunca bölgesel gerilimi düşürmeyi hedefleyen diplomasi: Suudi Arabistan ile İran aynı iftar sofrasında.",
    date: "Nisan 2023",
    readMin: 5,
    img: "middle-east",
    url: HT + "3582445-netlik",
  },
  {
    slug: "iran-azerbaycan-gerilimi",
    kind: "Analiz",
    section: "Kafkasya",
    title: "İran-Azerbaycan gerilimi yükseliyor",
    dek: "Ukrayna savaşı sürerken Kosova ve Karabağ'da gerginlik; Tahran ile Bakü arasında tansiyon tırmanıyor.",
    date: "Ocak 2023",
    readMin: 6,
    img: "caucasus",
    url: HT + "3551865-iran-azerbaycan-gerilimi-yukseliyor",
  },
];

export const columns: Article[] = [
  {
    slug: "turkiye-bir-obama-hikayesine-hazir-mi",
    kind: "Köşe Yazısı",
    section: "Görüş",
    title: "Türkiye bir Obama hikayesine hazır mı?",
    dek: "Obama'nın 2008 zafer konuşmasından yola çıkarak: Türkiye'de benzer bir yükseliş hikayesi mümkün mü?",
    date: "Mart 2023",
    readMin: 5,
    img: "camera-field",
    url: HT + "3570945-turkiye-bir-obama-hikayesine-hazir-mi",
  },
  {
    slug: "hatayli-zeynepin-bayramlik-ayakkabilari",
    kind: "Köşe Yazısı",
    section: "Görüş",
    title: "Hataylı Zeynep'in bayramlık pembe ayakkabıları…",
    dek: "Çadır ve konteyner kentlerde bayram: Yakınlarını kaybedenler mezarlıklarda, derin bir hüzün içinde.",
    date: "Nisan 2023",
    readMin: 5,
    img: "quake",
    url: HT + "3585104-hatayli-zeynepin-bayramlik-pembe-ayakkabilari",
  },
  {
    slug: "bu-surec-bir-proje-mi",
    kind: "Köşe Yazısı",
    section: "Görüş",
    title: "Bu süreç bir proje mi?",
    dek: "İsveç'te ve Lahey'de Kur'an-ı Kerim yakma eylemleri: Avrupa'da İslam karşıtlığı kontrolden mi çıkıyor?",
    date: "Ocak 2023",
    readMin: 5,
    img: "europe",
    url: HT + "3559352-bu-surec-bir-proje-mi",
  },
];

// Ekran görünümleri — yer tutucu (gerçek yayın arşivi Aşama 2'de eklenecek).
export const appearances = [
  { date: "29 May", program: "Özel Yayın", topic: "Seçim gecesi: Sonuçlar ve ilk değerlendirme", dur: "52 dk" },
  { date: "8 Şub", program: "Canlı Bağlantı", topic: "Deprem bölgesinden son durum", dur: "24 dk" },
  { date: "4 Nis", program: "Dünya Gündemi", topic: "Finlandiya NATO'da: Yeni güvenlik dengesi", dur: "31 dk" },
  { date: "28 Nis", program: "Gece Masası", topic: "Sudan'da çatışmalar ve tahliyeler", dur: "27 dk" },
];

// Sayılar Habertürk'teki son 20 yazının konu dağılımından.
export const dossiers = [
  { title: "Seçim 2023", count: 7, years: "2023", img: "election" },
  { title: "Deprem", count: 3, years: "2023", img: "quake" },
  { title: "Suriye ve Bölge", count: 4, years: "2022 – 23", img: "desert-road" },
  { title: "Dış Politika", count: 6, years: "2023", img: "old-paper" },
];

export const sections = ["Dış Politika", "Güvenlik", "Siyaset", "Orta Doğu", "Deprem", "Köşe Yazıları", "Video"];

export const all = [lead, ...articles, ...columns];
