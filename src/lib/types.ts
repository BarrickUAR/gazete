import type { Locale } from "@/i18n/config";

export type PostType = "haber" | "kose" | "rapor";
export type PostStatus = "draft" | "review" | "scheduled" | "published" | "archived";
export type Theme = "default" | "foreign";
export type Role = "admin" | "editor" | "author" | "subscriber";

/** Tiptap / ProseMirror JSON düğümü (yalnızca render ettiğimiz alt küme). */
export type RichNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: RichNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
};
export type RichDoc = { type: "doc"; content: RichNode[] };

export type Media = {
  id: string;
  url: string;
  alt: string;
  caption?: string | null;
  credit?: string | null;
  width?: number | null;
  height?: number | null;
};

export type Category = {
  id: string;
  slug: Record<Locale, string>;
  name: Record<Locale, string>;
  theme: Theme;
  sort: number;
};

export type Tag = { id: string; slug: string; name: Record<Locale, string> };

export type Author = {
  id: string;
  name: string;
  role: Record<Locale, string>;
  avatar: string;
};

export type Translation = {
  locale: Locale;
  slug: string;
  title: string;
  dek: string;
  kicker?: string | null;
  place?: string | null;
  /** Herkese açık gövde. Kilitli içerikte yalnızca giriş (teaser) bölümü. */
  body: RichDoc;
  seoTitle?: string | null;
  seoDesc?: string | null;
};

export type Post = {
  id: string;
  type: PostType;
  status: PostStatus;
  category: Category;
  author: Author;
  tags: Tag[];
  cover: Media | null;
  isPremium: boolean;
  publishedAt: string; // ISO
  updatedAt: string; // ISO
  readMin: number;
  sourceUrl?: string | null; // ilk yayımlandığı yer (ör. Habertürk)
  reportPdf?: string | null;
  translations: Partial<Record<Locale, Translation>>;
};

/** Bir dilde gösterime hazır yazı. */
export type LocalizedPost = Omit<Post, "translations"> & {
  t: Translation;
  available: Locale[];
  alternates: Partial<Record<Locale, string>>; // dil -> slug
};

export type ArchiveBucket = { year: number; month: number; count: number };

export type SiteSettings = {
  imprint: Record<Locale, { label: string; value: string }[]>;
  social: { x?: string; instagram?: string; youtube?: string };
  price: { monthly: number; yearly: number; currency: string; trialDays: number };
  /** Kimdir sayfası. Kariyer satırları yalnızca doğrulanmış bilgiyle doldurulur; boşsa bölüm gizlenir. */
  about: Record<Locale, { bio: string[]; career: { period: string; text: string }[] }>;
};
