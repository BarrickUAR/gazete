import type { Locale } from "@/i18n/config";
import { categories, posts, premiumRest, settings, tags } from "../seed";
import type { ArchiveBucket, Post } from "../types";
import type { ListQuery, Repo } from "./repo";
import { plainText } from "./localize";

const IST = "Europe/Istanbul";
const ymd = (iso: string) => {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: IST, year: "numeric", month: "2-digit" }).formatToParts(new Date(iso));
  return { y: Number(parts.find((p) => p.type === "year")!.value), m: Number(parts.find((p) => p.type === "month")!.value) };
};

const norm = (s: string, lang: Locale) => s.toLocaleLowerCase(lang === "tr" ? "tr-TR" : lang).normalize("NFKD").replace(/[̀-ͯ]/g, "");

function visible(p: Post) {
  return p.status === "published" && new Date(p.publishedAt).getTime() <= Date.now();
}

const ms = (iso: string) => new Date(iso).getTime();

function sorted() {
  return posts.filter(visible).sort((a, b) => ms(b.publishedAt) - ms(a.publishedAt));
}

export const seedRepo: Repo = {
  async list(lang, q: ListQuery) {
    const types = q.type ? (Array.isArray(q.type) ? q.type : [q.type]) : null;
    return sorted()
      .filter((p) => p.translations[lang])
      .filter((p) => !types || types.includes(p.type))
      .filter((p) => !q.categoryId || p.category.id === q.categoryId)
      .filter((p) => !q.theme || p.category.theme === q.theme)
      .filter((p) => !q.tagId || p.tags.some((t) => t.id === q.tagId))
      .filter((p) => !q.before || ms(p.publishedAt) < ms(q.before))
      .filter((p) => !q.from || ms(p.publishedAt) >= ms(q.from))
      .filter((p) => !q.to || ms(p.publishedAt) < ms(q.to))
      .filter((p) => !q.excludeIds?.includes(p.id))
      .slice(0, q.limit ?? 20);
  },
  async bySlug(lang, slug) {
    return sorted().find((p) => p.translations[lang]?.slug === slug) ?? null;
  },
  async byId(id) {
    return posts.find((p) => p.id === id) ?? null;
  },
  async categories() {
    return [...categories].sort((a, b) => a.sort - b.sort);
  },
  async tags() {
    return tags;
  },
  async archive(lang) {
    const map = new Map<string, ArchiveBucket>();
    for (const p of sorted()) {
      if (!p.translations[lang]) continue;
      const { y, m } = ymd(p.publishedAt);
      const k = `${y}-${m}`;
      const b = map.get(k) ?? { year: y, month: m, count: 0 };
      b.count++;
      map.set(k, b);
    }
    return [...map.values()].sort((a, b) => b.year - a.year || b.month - a.month);
  },
  async search(lang, q) {
    const needle = norm(q.q.trim(), lang);
    const words = needle.split(/\s+/).filter(Boolean);
    const all = sorted()
      .filter((p) => p.translations[lang])
      .filter((p) => !q.type || p.type === q.type)
      .filter((p) => !q.categoryId || p.category.id === q.categoryId)
      .filter((p) => {
        if (!words.length) return true;
        const t = p.translations[lang]!;
        const hay = norm(`${t.title} ${t.dek} ${plainText(t.body)} ${p.tags.map((x) => x.name[lang]).join(" ")}`, lang);
        return words.every((w) => hay.includes(w));
      });
    const size = q.pageSize ?? 20;
    const page = Math.max(1, q.page ?? 1);
    return { items: all.slice((page - 1) * size, page * size), total: all.length };
  },
  async settings() {
    return settings;
  },
  async premiumBody(postId, lang) {
    const p = posts.find((x) => x.id === postId);
    return p ? premiumRest(p, lang) : null;
  },
  async allPublished() {
    return sorted().map((p) => ({
      id: p.id,
      type: p.type,
      updatedAt: p.updatedAt,
      publishedAt: p.publishedAt,
      theme: p.category.theme,
      slugs: Object.fromEntries(Object.entries(p.translations).map(([l, t]) => [l, t!.slug])),
    }));
  },
};
