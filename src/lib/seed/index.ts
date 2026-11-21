// Başlangıç verisi. Kaynak: Çetiner Çetin'in Habertürk köşe yazıları (haberturk.com/yazarlar/cetiner-cetin).
// Başlık ve özetler gerçek yazılardandır; EN/AR metinler bunların çevirisidir. Tam metinler Habertürk'tedir,
// bu yüzden gövde = özet + kaynağa bağlantı. Gün bilgisi Habertürk yazı numarası sırasından ve konudan yaklaşık çıkarıldı.
// Supabase yapılandırılmadığında site bu veriyle çalışır; `npm run seed:sql` aynı veriden SQL üretir.
import credits from "../../../public/img/credits.json";
import type { Author, Category, Media, Post, RichDoc, SiteSettings, Tag, Translation } from "../types";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";

const creditMap = credits as Record<string, { artist: string; license: string; source: string; title: string }>;

const SIZES: Record<string, [number, number]> = {
  "camera-field": [1306, 538], caucasus: [1920, 1440], "desert-road": [1920, 1080], election: [1920, 1440], europe: [1920, 1280],
  "flags-row": [1920, 1281], "middle-east": [1920, 333], "old-paper": [1920, 1280], quake: [1920, 1080], "sea-platform": [1920, 1440],
  sudan: [1920, 1280], tbmm: [1920, 1200], "summit-hall": [1920, 1280], "studio-tv": [1920, 1280],
};

const CAPTIONS: Record<string, string> = {
  "flags-row": "Finlandiya bayrağı NATO karargâhında göndere çekiliyor, Brüksel, 4 Nisan 2023.",
  tbmm: "Ankara'daki Cumhuriyet Müzesi; ikinci Meclis binasının genel kurul salonu.",
  quake: "6 Şubat depremlerinin ardından Antakya, havadan görünüm.",
  sudan: "Uluslararası Uzay İstasyonu'ndan gece görüntüsü: Nil'in kollarıyla çevrili Hartum.",
  election: "2023 Cumhurbaşkanlığı seçiminin ikinci turu: yurt dışından gelen oy sandıkları.",
  "desert-road": "Hatay'daki Cilvegözü Sınır Kapısı.",
  "sea-platform": "İrlanda Denizi'nde bir petrol platformu.",
  "middle-east": "Kudüs Eski Şehir panoraması.",
  caucasus: "Azerbaycan, Büyük Kafkas Dağları'ndaki Xınalıq köyü.",
  "camera-field": "Grant Park, Chicago, 4 Kasım 2008: Obama'nın zaferinin ilan edildiği gece.",
  europe: "Stockholm, Söderströmsbron ve eski şehir.",
  "summit-hall": "NATO Vilnius Zirvesi'nde liderler, Temmuz 2023.",
  "old-paper": "BM Genel Kurul salonu, New York.",
};

export function seedMedia(key: string): Media {
  const c = creditMap[key];
  const [w, h] = SIZES[key] ?? [1920, 1280];
  return {
    id: `m-${key}`,
    url: `/img/${key}.jpg`,
    alt: CAPTIONS[key] ?? "",
    caption: CAPTIONS[key] ?? null,
    credit: c ? `${c.artist.replace(/\s+/g, " ").trim()} · ${c.license} · Wikimedia Commons` : "Wikimedia Commons",
    width: w,
    height: h,
  };
}

export const author: Author = {
  id: "a-cetiner",
  name: "Çetiner Çetin",
  role: {
    tr: "Dış Politika ve Güvenlik Politikaları Yayın Koordinatörü",
    en: "Foreign Policy and Security Policy Broadcast Coordinator",
    ar: "منسق البث لشؤون السياسة الخارجية والسياسات الأمنية",
  },
  avatar: "/img/avatar.jpg",
};

const cat = (id: string, theme: Category["theme"], sort: number, slug: Record<Locale, string>, name: Record<Locale, string>): Category => ({ id, theme, sort, slug, name });

export const categories: Category[] = [
  cat("c-dis", "foreign", 1, { tr: "dis-haberler", en: "world", ar: "world" }, { tr: "Dış Haberler", en: "World", ar: "الأخبار الدولية" }),
  cat("c-siyaset", "default", 2, { tr: "siyaset", en: "politics", ar: "politics" }, { tr: "Siyaset", en: "Politics", ar: "السياسة" }),
  cat("c-guvenlik", "default", 3, { tr: "guvenlik", en: "security", ar: "security" }, { tr: "Güvenlik", en: "Security", ar: "الأمن" }),
  cat("c-deprem", "default", 4, { tr: "deprem", en: "earthquake", ar: "earthquake" }, { tr: "Deprem", en: "Earthquake", ar: "الزلزال" }),
];
const C = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<string, Category>;

const tag = (slug: string, tr: string, en: string, ar: string): Tag => ({ id: `t-${slug}`, slug, name: { tr, en, ar } });
export const tags: Tag[] = [
  tag("nato", "NATO", "NATO", "الناتو"),
  tag("secim-2023", "Seçim 2023", "2023 Elections", "انتخابات 2023"),
  tag("deprem", "6 Şubat depremleri", "February 6 earthquakes", "زلازل 6 فبراير"),
  tag("suriye", "Suriye", "Syria", "سوريا"),
  tag("enerji", "Enerji", "Energy", "الطاقة"),
  tag("orta-dogu", "Orta Doğu", "Middle East", "الشرق الأوسط"),
  tag("kafkasya", "Kafkasya", "Caucasus", "القوقاز"),
  tag("avrupa", "Avrupa", "Europe", "أوروبا"),
  tag("abd", "ABD", "United States", "الولايات المتحدة"),
  tag("afrika", "Afrika", "Africa", "أفريقيا"),
];
const T = Object.fromEntries(tags.map((t) => [t.slug, t])) as Record<string, Tag>;

const p = (text: string) => ({ type: "paragraph", content: [{ type: "text", text }] });
const h2 = (text: string) => ({ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text }] });
const doc = (...content: RichDoc["content"]): RichDoc => ({ type: "doc", content });

type Tx = { slug: string; title: string; dek: string; kicker?: string; place?: string };

const HT = "https://www.haberturk.com/yazarlar/cetiner-cetin/";

function article(o: {
  id: string; type: Post["type"]; cat: string; date: string; img: string; read: number; url: string; tags: string[]; premium?: boolean;
  tr: Tx; en: Tx; ar: Tx;
}): Post {
  const tx = (locale: Locale, x: Tx): Translation => ({
    locale,
    slug: x.slug,
    title: x.title,
    dek: x.dek,
    kicker: x.kicker ?? null,
    place: x.place ?? null,
    body: doc(p(x.dek)),
    seoTitle: null,
    seoDesc: x.dek,
  });
  return {
    id: o.id,
    type: o.type,
    status: "published",
    category: C[o.cat],
    author,
    tags: o.tags.map((t) => T[t]),
    cover: seedMedia(o.img),
    isPremium: o.premium ?? o.type !== "haber",
    publishedAt: `${o.date}T09:00:00+03:00`,
    updatedAt: `${o.date}T09:00:00+03:00`,
    readMin: o.read,
    sourceUrl: HT + o.url,
    reportPdf: null,
    translations: { tr: tx("tr", o.tr), en: tx("en", o.en), ar: tx("ar", o.ar) },
  };
}

export const posts: Post[] = [
  article({
    id: "p-finlandiya", type: "kose", cat: "c-dis", date: "2023-04-05", img: "flags-row", read: 6, url: "3580354-finlandiya-natoya-ne-kazandiracak", tags: ["nato", "avrupa"],
    tr: { slug: "finlandiya-natoya-ne-kazandiracak", title: "Finlandiya NATO'ya ne kazandıracak?", dek: "Türkiye'nin onayıyla Finlandiya'nın NATO üyeliği kabul edildi. İttifak ile Rusya arasındaki sınır uzadı; yeni bir güvenlik konseptine ihtiyaç doğdu.", place: "Brüksel" },
    en: { slug: "what-will-finland-bring-to-nato", title: "What will Finland bring to NATO?", dek: "With Türkiye's approval, Finland's NATO membership has been accepted. The border between the Alliance and Russia has grown longer, and a new security concept is needed.", place: "Brussels" },
    ar: { slug: "what-will-finland-bring-to-nato", title: "ماذا ستضيف فنلندا إلى الناتو؟", dek: "بموافقة تركيا قُبلت عضوية فنلندا في الناتو. طالت الحدود بين الحلف وروسيا، وبات الحلف بحاجة إلى مفهوم أمني جديد.", place: "بروكسل" },
  }),
  article({
    id: "p-acil-ihtiyac", type: "kose", cat: "c-siyaset", date: "2023-05-31", img: "tbmm", read: 5, url: "3593642-acil-ihtiyac-listesi-somut-politikalar", tags: ["secim-2023"],
    tr: { slug: "acil-ihtiyac-listesi-somut-politikalar", title: "Acil ihtiyaç listesi: Somut politikalar", dek: "Seçim sonuçları her boyutuyla tartışıldı, bölgelerin etnik ve mezhepsel analizleri yapıldı. Açıkçası sonucu iki taraf da bilemedi.", place: "Ankara" },
    en: { slug: "urgent-needs-list-concrete-policies", title: "The urgent to-do list: concrete policies", dek: "The election results were debated from every angle, with ethnic and sectarian breakdowns by region. Frankly, neither side saw the outcome coming.", place: "Ankara" },
    ar: { slug: "urgent-needs-list-concrete-policies", title: "قائمة الاحتياجات العاجلة: سياسات ملموسة", dek: "نوقشت نتائج الانتخابات من كل جوانبها، وأُجريت تحليلات عرقية ومذهبية للمناطق. والحقيقة أن أيًّا من الطرفين لم يتوقع النتيجة.", place: "أنقرة" },
  }),
  article({
    id: "p-fay-hatti", type: "haber", cat: "c-deprem", date: "2023-02-12", img: "quake", read: 6, url: "3570146-fay-hattinda-mucize-mumkun", tags: ["deprem"],
    tr: { slug: "fay-hattinda-mucize-mumkun", title: "Fay hattında mucize mümkün", dek: "Günlerdir süren çimento tozu kokusu, kadınların feryadı ve enkazdan çıkacak bir mucizeye tutunan umut.", kicker: "Sahadan", place: "Hatay" },
    en: { slug: "a-miracle-on-the-fault-line", title: "A miracle is possible on the fault line", dek: "Days of cement dust in the air, the cries of women, and the hope clinging to a miracle from beneath the rubble.", kicker: "Dispatch", place: "Hatay" },
    ar: { slug: "a-miracle-on-the-fault-line", title: "المعجزة ممكنة على خط الصدع", dek: "رائحة غبار الإسمنت منذ أيام، وصرخات النساء، وأمل يتشبث بمعجزة تخرج من تحت الأنقاض.", kicker: "من الميدان", place: "هطاي" },
  }),
  article({
    id: "p-sudan", type: "kose", cat: "c-dis", date: "2023-04-25", img: "sudan", read: 6, url: "3587406-sudanin-hal-i-pur-melali", tags: ["afrika"],
    tr: { slug: "sudanin-hal-i-pur-melali", title: "Sudan'ın Hal-i Pür Melali", dek: "Ordu ile paramiliter güçler arasındaki çatışmalar bölgede domino etkisi riski taşıyor; sivillerin tahliyesi için çabalar sürüyor.", place: "Hartum" },
    en: { slug: "sudans-sorry-state", title: "Sudan's sorry state", dek: "Fighting between the army and paramilitary forces risks a domino effect across the region, while efforts to evacuate civilians continue.", place: "Khartoum" },
    ar: { slug: "sudans-sorry-state", title: "حال السودان المؤسف", dek: "الاشتباكات بين الجيش والقوات شبه العسكرية تحمل خطر تأثير الدومينو في المنطقة، فيما تتواصل جهود إجلاء المدنيين.", place: "الخرطوم" },
  }),
  article({
    id: "p-anketorler", type: "kose", cat: "c-siyaset", date: "2023-05-16", img: "election", read: 5, url: "3592089-simdi-anketorler-dusunsun", tags: ["secim-2023"],
    tr: { slug: "simdi-anketorler-dusunsun", title: "Şimdi anketörler düşünsün…", dek: "Anket şirketleri, analistler ve yorumcular sınıfta kaldı. Son iki aydır siyaset bir spor müsabakası gibi izlendi." },
    en: { slug: "now-the-pollsters-should-think", title: "Now the pollsters should think…", dek: "Polling firms, analysts and commentators failed the test. For the past two months, politics was watched like a sports match." },
    ar: { slug: "now-the-pollsters-should-think", title: "فليفكر الآن منظمو استطلاعات الرأي…", dek: "رسبت شركات الاستطلاع والمحللون والمعلقون في الامتحان. فعلى مدى الشهرين الماضيين تابع الناس السياسة كأنها مباراة رياضية." },
  }),
  article({
    id: "p-abd-suriye", type: "kose", cat: "c-dis", date: "2023-03-28", img: "desert-road", read: 6, url: "3576900-abdnin-suriye-uslerindeki-kostebek-kim", tags: ["suriye", "abd"],
    tr: { slug: "abdnin-suriye-uslerindeki-kostebek-kim", title: "ABD'nin Suriye üslerindeki köstebek kim?", dek: "Bir ayda yedi saldırı. Suriye'deki Amerikan üslerini hedef alan eylemlerin arkasındaki soru işaretleri.", place: "Suriye" },
    en: { slug: "who-is-the-mole-at-us-bases-in-syria", title: "Who is the mole at the US bases in Syria?", dek: "Seven attacks in one month. The questions behind the strikes targeting American bases in Syria.", place: "Syria" },
    ar: { slug: "who-is-the-mole-at-us-bases-in-syria", title: "من هو الجاسوس في القواعد الأمريكية في سوريا؟", dek: "سبع هجمات في شهر واحد. علامات الاستفهام وراء العمليات التي تستهدف القواعد الأمريكية في سوريا.", place: "سوريا" },
  }),
  article({
    id: "p-kurt-petrolu", type: "haber", cat: "c-dis", date: "2023-03-30", img: "sea-platform", read: 6, url: "3578059-avrupayi-kurt-petrolu-isitabilir-mi", tags: ["enerji", "avrupa"],
    tr: { slug: "avrupayi-kurt-petrolu-isitabilir-mi", title: "Avrupa'yı Kürt petrolü ısıtabilir mi", dek: "Paris'teki tahkim kararı Irak merkezi yönetimini haklı buldu. Kararın enerji ve diplomasi hesaplarına etkisi.", kicker: "Analiz" },
    en: { slug: "can-kurdish-oil-warm-europe", title: "Can Kurdish oil warm Europe?", dek: "The arbitration ruling in Paris sided with Iraq's central government. What it means for energy and diplomatic calculations.", kicker: "Analysis" },
    ar: { slug: "can-kurdish-oil-warm-europe", title: "هل يستطيع النفط الكردي تدفئة أوروبا؟", dek: "حكم التحكيم في باريس جاء لصالح الحكومة المركزية العراقية. أثر القرار على حسابات الطاقة والدبلوماسية.", kicker: "تحليل" },
  }),
  article({
    id: "p-netlik", type: "kose", cat: "c-dis", date: "2023-04-11", img: "middle-east", read: 5, url: "3582445-netlik", tags: ["orta-dogu"],
    tr: { slug: "netlik", title: "Netlik…", dek: "Ramazan boyunca bölgesel gerilimi düşürmeyi hedefleyen diplomasi: Suudi Arabistan ile İran aynı iftar sofrasında." },
    en: { slug: "clarity", title: "Clarity…", dek: "Ramadan diplomacy aimed at easing regional tension: Saudi Arabia and Iran at the same iftar table." },
    ar: { slug: "clarity", title: "وضوح…", dek: "دبلوماسية رمضانية تهدف إلى خفض التوتر الإقليمي: السعودية وإيران على مائدة إفطار واحدة." },
  }),
  article({
    id: "p-iran-azerbaycan", type: "haber", cat: "c-dis", date: "2023-01-30", img: "caucasus", read: 6, url: "3551865-iran-azerbaycan-gerilimi-yukseliyor", tags: ["kafkasya"],
    tr: { slug: "iran-azerbaycan-gerilimi-yukseliyor", title: "İran-Azerbaycan gerilimi yükseliyor", dek: "Ukrayna savaşı sürerken Kosova ve Karabağ'da gerginlik; Tahran ile Bakü arasında tansiyon tırmanıyor.", kicker: "Analiz" },
    en: { slug: "iran-azerbaijan-tensions-rising", title: "Iran-Azerbaijan tensions are rising", dek: "As the war in Ukraine continues, tension in Kosovo and Karabakh; the temperature is climbing between Tehran and Baku.", kicker: "Analysis" },
    ar: { slug: "iran-azerbaijan-tensions-rising", title: "التوتر بين إيران وأذربيجان يتصاعد", dek: "بينما تستمر الحرب في أوكرانيا، توتر في كوسوفو وقره باغ؛ والاحتقان يتصاعد بين طهران وباكو.", kicker: "تحليل" },
  }),
  article({
    id: "p-obama", type: "kose", cat: "c-siyaset", date: "2023-02-15", img: "camera-field", read: 5, url: "3570945-turkiye-bir-obama-hikayesine-hazir-mi", tags: ["secim-2023", "abd"],
    tr: { slug: "turkiye-bir-obama-hikayesine-hazir-mi", title: "Türkiye bir Obama hikayesine hazır mı?", dek: "Obama'nın 2008 zafer konuşmasından yola çıkarak: Türkiye'de benzer bir yükseliş hikayesi mümkün mü?" },
    en: { slug: "is-turkiye-ready-for-an-obama-story", title: "Is Türkiye ready for an Obama story?", dek: "Starting from Obama's 2008 victory speech: is a similar story of rise possible in Türkiye?" },
    ar: { slug: "is-turkiye-ready-for-an-obama-story", title: "هل تركيا مستعدة لقصة مثل قصة أوباما؟", dek: "انطلاقًا من خطاب النصر الذي ألقاه أوباما عام 2008: هل قصة صعود مماثلة ممكنة في تركيا؟" },
  }),
  article({
    id: "p-hatayli-zeynep", type: "kose", cat: "c-deprem", date: "2023-04-21", img: "quake", read: 5, url: "3585104-hatayli-zeynepin-bayramlik-pembe-ayakkabilari", tags: ["deprem"],
    tr: { slug: "hatayli-zeynepin-bayramlik-pembe-ayakkabilari", title: "Hataylı Zeynep'in bayramlık pembe ayakkabıları…", dek: "Çadır ve konteyner kentlerde bayram: Yakınlarını kaybedenler mezarlıklarda, derin bir hüzün içinde.", place: "Hatay" },
    en: { slug: "zeyneps-pink-holiday-shoes", title: "The pink holiday shoes of Zeynep from Hatay…", dek: "Eid in tent and container cities: those who lost loved ones spend it at the cemeteries, in deep grief.", place: "Hatay" },
    ar: { slug: "zeyneps-pink-holiday-shoes", title: "حذاء العيد الوردي لزينب من هطاي…", dek: "العيد في مدن الخيام والحاويات: من فقدوا أحبّتهم يقضونه في المقابر، في حزن عميق.", place: "هطاي" },
  }),
  article({
    id: "p-bu-surec", type: "kose", cat: "c-dis", date: "2023-01-27", img: "europe", read: 5, url: "3559352-bu-surec-bir-proje-mi", tags: ["avrupa", "nato"],
    tr: { slug: "bu-surec-bir-proje-mi", title: "Bu süreç bir proje mi?", dek: "İsveç'te ve Lahey'de Kur'an-ı Kerim yakma eylemleri: Avrupa'da İslam karşıtlığı kontrolden mi çıkıyor?" },
    en: { slug: "is-this-process-a-project", title: "Is this process a project?", dek: "Quran burnings in Sweden and The Hague: is anti-Islam sentiment in Europe spiralling out of control?" },
    ar: { slug: "is-this-process-a-project", title: "هل هذه العملية مشروع مدبَّر؟", dek: "حرق المصحف الشريف في السويد ولاهاي: هل يخرج العداء للإسلام في أوروبا عن السيطرة؟" },
  }),
];

// Raporlar: Çetiner Çetin'in yazılarından derlenmiş dosyalar (yeni içerik uydurulmaz; her bölüm kaynak yazıya bağlanır).
function report(o: { id: string; cat: string; date: string; img: string; tags: string[]; sources: string[]; tr: Tx & { intro: string }; en: Tx & { intro: string }; ar: Tx & { intro: string } }): Post {
  const src = o.sources.map((id) => posts.find((x) => x.id === id)!);
  const mk = (locale: Locale, x: Tx & { intro: string }): Translation => {
    const more: Record<Locale, string> = { tr: "Yazıyı oku", en: "Read the column", ar: "اقرأ المقال" };
    return {
      locale, slug: x.slug, title: x.title, dek: x.dek, kicker: x.kicker ?? null, place: null,
      body: doc(
        p(x.intro),
        ...src.flatMap((s) => {
          const it = s.translations[locale]!;
          const url = href(locale, s.type === "haber" ? "news" : "column", it.slug);
          return [h2(it.title), p(it.dek), { type: "paragraph", content: [{ type: "text", text: more[locale] + " →", marks: [{ type: "link", attrs: { href: url } }] }] }];
        }),
      ),
      seoTitle: null, seoDesc: x.dek,
    };
  };
  return {
    id: o.id, type: "rapor", status: "published", category: C[o.cat], author, tags: o.tags.map((t) => T[t]), cover: seedMedia(o.img),
    isPremium: true, publishedAt: `${o.date}T09:00:00+03:00`, updatedAt: `${o.date}T09:00:00+03:00`, readMin: 4 + src.length * 2,
    sourceUrl: null, reportPdf: null,
    translations: { tr: mk("tr", o.tr), en: mk("en", o.en), ar: mk("ar", o.ar) },
  };
}

posts.push(
  report({
    id: "r-secim-2023", cat: "c-siyaset", date: "2023-06-05", img: "election", tags: ["secim-2023"], sources: ["p-obama", "p-anketorler", "p-acil-ihtiyac"],
    tr: { slug: "secim-2023-dosyasi", title: "Seçim 2023 dosyası", dek: "Kampanyadan sandığa, sandıktan yeni döneme: 2023 seçimleri üzerine yazıların derlemesi.", kicker: "Dosya", intro: "Bu dosya, 2023 Cumhurbaşkanlığı ve milletvekili seçimleri sürecinde yayımlanan yazıları tek yerde topluyor. Her bölüm ilgili yazının özetidir; yazıların tam metinlerine bölüm bağlantılarından ulaşılabilir." },
    en: { slug: "elections-2023-dossier", title: "Elections 2023 dossier", dek: "From the campaign to the ballot box and the new term: a collection of columns on the 2023 elections.", kicker: "Dossier", intro: "This dossier brings together the columns published during Türkiye's 2023 presidential and parliamentary elections. Each section summarises the related column; the full texts are linked from each section." },
    ar: { slug: "elections-2023-dossier", title: "ملف انتخابات 2023", dek: "من الحملة إلى صندوق الاقتراع ثم المرحلة الجديدة: مجموعة مقالات عن انتخابات 2023.", kicker: "ملف", intro: "يجمع هذا الملف المقالات التي نُشرت خلال الانتخابات الرئاسية والبرلمانية التركية لعام 2023. كل قسم ملخّص للمقال المعني، ويمكن الوصول إلى النصوص الكاملة عبر روابط الأقسام." },
  }),
  report({
    id: "r-deprem", cat: "c-deprem", date: "2023-05-02", img: "quake", tags: ["deprem"], sources: ["p-fay-hatti", "p-hatayli-zeynep"],
    tr: { slug: "6-subat-depremleri-dosyasi", title: "6 Şubat depremleri dosyası", dek: "Hatay'dan saha notları: ilk günlerden bayrama kadar deprem bölgesi.", kicker: "Dosya", intro: "Bu dosya, 6 Şubat 2023 depremlerinin ardından deprem bölgesinden yazılan saha notlarını bir araya getiriyor." },
    en: { slug: "february-6-earthquakes-dossier", title: "February 6 earthquakes dossier", dek: "Field notes from Hatay: the earthquake zone from the first days to Eid.", kicker: "Dossier", intro: "This dossier collects the field notes written from the earthquake zone after the 6 February 2023 earthquakes." },
    ar: { slug: "february-6-earthquakes-dossier", title: "ملف زلازل 6 فبراير", dek: "ملاحظات ميدانية من هطاي: منطقة الزلزال من الأيام الأولى حتى العيد.", kicker: "ملف", intro: "يجمع هذا الملف الملاحظات الميدانية التي كُتبت من منطقة الزلزال بعد زلازل 6 فبراير 2023." },
  }),
  report({
    id: "r-nato", cat: "c-dis", date: "2023-04-14", img: "summit-hall", tags: ["nato", "avrupa"], sources: ["p-bu-surec", "p-finlandiya"],
    tr: { slug: "nato-genislemesi-ve-turkiye", title: "NATO genişlemesi ve Türkiye", dek: "İsveç ve Finlandiya'nın üyelik süreçleri, Ankara'nın tutumu ve ittifakın yeni sınırı.", kicker: "Dosya", intro: "Bu dosya, İsveç ve Finlandiya'nın NATO üyelik süreçleri boyunca yayımlanan yazıları kronolojik sırayla bir araya getiriyor." },
    en: { slug: "nato-enlargement-and-turkiye", title: "NATO enlargement and Türkiye", dek: "Sweden's and Finland's membership processes, Ankara's position and the Alliance's new border.", kicker: "Dossier", intro: "This dossier brings together, in chronological order, the columns published during Sweden's and Finland's NATO accession processes." },
    ar: { slug: "nato-enlargement-and-turkiye", title: "توسّع الناتو وتركيا", dek: "مسارا عضوية السويد وفنلندا، وموقف أنقرة، والحدود الجديدة للحلف.", kicker: "ملف", intro: "يجمع هذا الملف، بترتيب زمني، المقالات المنشورة خلال مساري انضمام السويد وفنلندا إلى الناتو." },
  }),
);

// Kilitli içerikte gövdenin devamı (abone olmayanlara gönderilmez).
export function premiumRest(post: Post, locale: Locale): RichDoc {
  const t = post.translations[locale];
  if (!t) return doc();
  const note: Record<Locale, string> = {
    tr: "Yazının tam metni ilk olarak Habertürk'te yayımlandı.",
    en: "The full text of this column was first published in Turkish on Habertürk.",
    ar: "نُشر النص الكامل لهذا المقال أولًا باللغة التركية على موقع خبر ترك.",
  };
  return post.sourceUrl ? doc(p(note[locale])) : doc();
}

export const settings: SiteSettings = {
  imprint: {
    tr: [
      { label: "İmtiyaz sahibi", value: "Çetiner Çetin" },
      { label: "Sorumlu yazı işleri müdürü", value: "Çetiner Çetin" },
      { label: "Yayın türü", value: "Yaygın süreli, internet haber sitesi" },
      { label: "Yönetim yeri", value: "—" },
      { label: "İletişim", value: "iletisim@alanadi.com" },
      { label: "Hukuki danışman", value: "—" },
      { label: "Teknik altyapı", value: "DevPixel" },
    ],
    en: [
      { label: "Publisher", value: "Çetiner Çetin" },
      { label: "Editor-in-chief", value: "Çetiner Çetin" },
      { label: "Publication type", value: "Periodical online news site" },
      { label: "Address", value: "—" },
      { label: "Contact", value: "iletisim@alanadi.com" },
      { label: "Legal counsel", value: "—" },
      { label: "Technology", value: "DevPixel" },
    ],
    ar: [
      { label: "صاحب الامتياز", value: "Çetiner Çetin" },
      { label: "رئيس التحرير المسؤول", value: "Çetiner Çetin" },
      { label: "نوع النشر", value: "موقع إخباري إلكتروني دوري" },
      { label: "العنوان", value: "—" },
      { label: "التواصل", value: "iletisim@alanadi.com" },
      { label: "المستشار القانوني", value: "—" },
      { label: "البنية التقنية", value: "DevPixel" },
    ],
  },
  social: { x: "", instagram: "", youtube: "" },
  price: { monthly: 149, yearly: 1490, currency: "TRY", trialDays: 90 },
  about: {
    tr: {
      bio: [
        "Habertürk'te dış politika ve güvenlik politikaları yayınlarını koordine ediyor; köşe yazılarında bölgesel krizleri, diplomasi trafiğini ve Türkiye siyasetini yorumluyor.",
        "Seçimlerden deprem bölgesine, Suriye'den NATO'ya Türkiye'nin bulunduğu coğrafyayı izliyor.",
      ],
      career: [],
    },
    en: {
      bio: [
        "Coordinates foreign-policy and security-policy broadcasting at Habertürk. The columns interpret regional crises, diplomatic traffic and Turkish politics.",
        "From elections to the earthquake zone, from Syria to NATO: a close watch on the region Türkiye sits in.",
      ],
      career: [],
    },
    ar: {
      bio: [
        "ينسّق بث السياسة الخارجية والسياسات الأمنية في قناة خبر ترك، ويتناول في مقالاته الأزمات الإقليمية والحراك الدبلوماسي والسياسة التركية.",
        "من الانتخابات إلى منطقة الزلزال، ومن سوريا إلى الناتو، يتابع الجغرافيا التي تقع فيها تركيا.",
      ],
      career: [],
    },
  },
};
