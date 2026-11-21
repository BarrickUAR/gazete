import type { Locale } from "@/i18n/config";
import type { ArchiveBucket, Category, Post, PostType, RichDoc, SiteSettings, Tag } from "../types";

export type ListQuery = {
  type?: PostType | PostType[];
  categoryId?: string;
  theme?: "default" | "foreign";
  tagId?: string;
  /** published_at < before (keyset sayfalama) */
  before?: string;
  from?: string; // >= ISO
  to?: string; // < ISO
  limit?: number;
  excludeIds?: string[];
};

export type SearchQuery = { q: string; type?: PostType; categoryId?: string; page?: number; pageSize?: number };

export interface Repo {
  list(lang: Locale, q: ListQuery): Promise<Post[]>;
  bySlug(lang: Locale, slug: string): Promise<Post | null>;
  byId(id: string): Promise<Post | null>;
  categories(): Promise<Category[]>;
  tags(): Promise<Tag[]>;
  archive(lang: Locale): Promise<ArchiveBucket[]>;
  search(lang: Locale, q: SearchQuery): Promise<{ items: Post[]; total: number }>;
  settings(): Promise<SiteSettings>;
  /** Kilitli gövdenin devamı — yalnızca abonelik doğrulandıktan sonra sunucuda çağrılır. */
  premiumBody(postId: string, lang: Locale): Promise<RichDoc | null>;
  allPublished(): Promise<{ id: string; type: PostType; updatedAt: string; publishedAt: string; slugs: Partial<Record<Locale, string>>; theme: string }[]>;
}
