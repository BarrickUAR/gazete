const TR: Record<string, string> = { ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", I: "i", İ: "i", ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u", â: "a", î: "i", û: "u" };

/** URL kısa adı: Türkçe harfler sadeleşir, Arapça harfler korunur, geri kalan "-" olur. */
export function slugify(s: string, max = 90) {
  return s
    .replace(/[çÇğĞıIİöÖşŞüÜâîû]/g, (c) => TR[c] ?? c)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ً-ٰٟ]/g, "") // Arapça harekeler
    .replace(/['’"]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max)
    .replace(/-+$/g, "");
}
