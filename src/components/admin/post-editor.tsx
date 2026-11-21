"use client";
// Yazı düzenleyici: TR/EN/AR sekmeleri, Tiptap gövde (herkese açık giriş + kilitli devam), yan panelde
// tür/kategori/etiket/kapak/kilit/zamanlama ve role göre iş akışı düğmeleri. Ctrl+S kaydeder; taslak otomatik kaydedilir.
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { savePost } from "@/app/actions/posts";
import { localeMeta, locales, type Locale } from "@/i18n/config";
import { slugify } from "@/lib/slug";
import type { PostStatus, PostType, RichDoc } from "@/lib/types";
import { MediaPicker, type MediaItem } from "./media-picker";
import { RichEditor } from "./rich-editor";
import { btn, fmtAdminDate, input, label, StatusBadge, TYPE_LABEL } from "./ui";

type Tx = { slug: string; title: string; dek: string; kicker: string; place: string; body: RichDoc; premium: RichDoc | null; seoTitle: string; seoDesc: string };
export type EditorInit = {
  id?: string;
  type: PostType;
  status: PostStatus;
  categoryId: string;
  tagIds: string[];
  cover: MediaItem | null;
  isPremium: boolean;
  sourceUrl: string;
  reportPdf: string;
  publishAt: string | null;
  publishedAt: string | null;
  reviewNote: string | null;
  updatedAt?: string;
  tx: Partial<Record<Locale, Tx>>;
};
type Ref = { categories: { id: string; name: string; theme: string }[]; tags: { id: string; slug: string; name: Record<Locale, string> }[] };
type Rev = { id: number; created_at: string; snapshot: Record<string, unknown> };

const EMPTY: RichDoc = { type: "doc", content: [] };
const blankTx = (): Tx => ({ slug: "", title: "", dek: "", kicker: "", place: "", body: EMPTY, premium: null, seoTitle: "", seoDesc: "" });
const LOC_NAME: Record<Locale, string> = { tr: "Türkçe", en: "İngilizce", ar: "Arapça" };

/** datetime-local (İstanbul saati) ↔ ISO */
const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const p = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Istanbul", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
  return p.replace(" ", "T");
};
const fromLocalInput = (v: string) => (v ? new Date(`${v}:00+03:00`).toISOString() : null);

export function PostEditor({ init, refs, library, isEditor, revisions, justCreated = false }: { init: EditorInit; refs: Ref; library: MediaItem[]; isEditor: boolean; revisions: Rev[]; justCreated?: boolean }) {
  const router = useRouter();
  const [s, setS] = useState(init);
  const [tab, setTab] = useState<Locale>("tr");
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(justCreated ? { ok: true, text: "Kaydedildi." } : null);
  const [picker, setPicker] = useState<null | ((m: MediaItem) => void)>(null);
  const [schedule, setSchedule] = useState(toLocalInput(init.publishAt));
  const [note, setNote] = useState("");
  const [showSeo, setShowSeo] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const stateRef = useRef(s);
  useEffect(() => {
    stateRef.current = s;
  }, [s]);

  const set = <K extends keyof EditorInit>(k: K, v: EditorInit[K]) => {
    setS((x) => ({ ...x, [k]: v }));
    setDirty(true);
  };
  const tx = s.tx[tab] ?? blankTx();
  const setTx = (patch: Partial<Tx>) => {
    setS((x) => ({ ...x, tx: { ...x.tx, [tab]: { ...(x.tx[tab] ?? blankTx()), ...patch } } }));
    setDirty(true);
  };

  const run = useCallback(
    async (intent: string, opts: { silent?: boolean } = {}) => {
      const cur = stateRef.current;
      const translations: Record<string, unknown> = {};
      for (const l of locales) {
        const t = cur.tx[l];
        if (t && t.title.trim()) translations[l] = { ...t, premium: cur.isPremium ? t.premium : null };
      }
      const payload = {
        id: cur.id,
        type: cur.type,
        categoryId: cur.categoryId,
        tagIds: cur.tagIds,
        coverId: cur.cover?.id ?? null,
        isPremium: cur.isPremium,
        sourceUrl: cur.sourceUrl,
        reportPdf: cur.reportPdf,
        publishAt: intent === "schedule" ? fromLocalInput(schedule) : null,
        note,
        translations,
      };
      if (!opts.silent) setBusy(intent);
      const r = await savePost(JSON.stringify(payload), intent);
      setBusy(null);
      if (!r.ok) {
        if (!opts.silent) setMsg({ ok: false, text: r.error });
        return;
      }
      setDirty(false);
      setMsg({ ok: true, text: opts.silent ? `Otomatik kaydedildi · ${new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}` : r.message });
      if (intent === "delete") return router.push("/yonetim/yazilar");
      if (!cur.id) return router.replace(`/yonetim/yazilar/${r.id}?k=1`);
      setS((x) => ({ ...x, status: r.status, reviewNote: intent === "return" ? note : intent === "save" ? x.reviewNote : null }));
      if (intent === "return") setNote("");
    },
    [schedule, note, router],
  );

  // Ctrl/Cmd+S
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        run("save");
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [run]);

  // Otomatik kayıt: yalnız mevcut taslak/onay bekleyen yazılarda, 45 sn'de bir
  useEffect(() => {
    if (!s.id || !dirty || !["draft", "review"].includes(s.status)) return;
    const t = setTimeout(() => run("save", { silent: true }), 45_000);
    return () => clearTimeout(t);
  }, [s, dirty, run]);

  // Kaydedilmemiş değişiklik uyarısı
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  // Yeni kayıttan sonra "Kaydedildi" mesajı
  useEffect(() => {
    if (justCreated) window.history.replaceState(null, "", window.location.pathname);
  }, [justCreated]);

  function restore(r: Rev) {
    if (!window.confirm(`${fmtAdminDate(r.created_at)} sürümü yüklensin mi? Kaydedene kadar hiçbir şey değişmez.`)) return;
    const sn = r.snapshot as Record<string, unknown> & { translations?: Record<string, Partial<Tx>> };
    const t: Partial<Record<Locale, Tx>> = {};
    for (const l of locales) if (sn.translations?.[l]) t[l] = { ...blankTx(), ...(sn.translations[l] as Partial<Tx>) } as Tx;
    setS((x) => ({
      ...x,
      type: (sn.type as PostType) ?? x.type,
      categoryId: (sn.categoryId as string) ?? x.categoryId,
      tagIds: (sn.tagIds as string[]) ?? x.tagIds,
      isPremium: Boolean(sn.isPremium),
      sourceUrl: (sn.sourceUrl as string) ?? "",
      reportPdf: (sn.reportPdf as string) ?? "",
      tx: t,
    }));
    setEditorKey((k) => k + 1);
    setDirty(true);
  }

  const pickImage = (insert: (src: string, alt: string, title?: string) => void) =>
    setPicker(() => (m: MediaItem) => insert(m.url, m.alt, [m.caption, m.credit].filter(Boolean).join(" · ") || undefined));
  const dir = localeMeta[tab].dir;
  const previewHref = s.id ? (tab === "tr" ? `/onizleme/${s.id}` : `/${tab}/preview/${s.id}`) : null;
  const live = s.status === "published" || s.status === "scheduled";

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      {/* Ana alan */}
      <div className="min-w-0 space-y-4">
        {s.reviewNote && s.status === "draft" && (
          <p className="rounded-md border border-[#f0c36d] bg-[#fff8e6] px-4 py-3 text-[14px] text-[#6b4a00]">
            <b>Editör notu:</b> {s.reviewNote}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label="Dil" className="flex gap-1 rounded-md border border-line bg-bg-2 p-1">
            {locales.map((l) => {
              const has = Boolean(s.tx[l]?.title);
              return (
                <button
                  key={l}
                  type="button"
                  role="tab"
                  aria-selected={tab === l}
                  onClick={() => setTab(l)}
                  className={`rounded px-3 py-1.5 text-[13.5px] ${tab === l ? "bg-fg text-bg" : "text-fg-3 hover:text-fg"}`}
                >
                  {LOC_NAME[l]} {has ? "✓" : ""}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 text-[13px] text-muted">
            {dirty && <span>Kaydedilmemiş değişiklik</span>}
            {previewHref && (
              <a href={previewHref} target="_blank" rel="noopener" className={btn.secondary}>
                Önizle ↗
              </a>
            )}
          </div>
        </div>
        {tab !== "tr" && !s.tx[tab]?.title && (
          <p className="rounded-md border border-line bg-bg-2 px-4 py-3 text-[13.5px] text-fg-3">
            Bu dilde çeviri yok. Başlık girerseniz yazı {LOC_NAME[tab]} sitede de yayımlanır; boş bırakırsanız o dilde listelenmez.
          </p>
        )}

        <div dir={dir} lang={tab} className="space-y-4 rounded-lg border border-line bg-bg-2 p-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_180px_180px]">
            <label>
              <span className={label}>Üst başlık (isteğe bağlı)</span>
              <input value={tx.kicker} onChange={(e) => setTx({ kicker: e.target.value })} maxLength={80} className={input} />
            </label>
            <label>
              <span className={label}>Yer (ör. Antakya)</span>
              <input value={tx.place} onChange={(e) => setTx({ place: e.target.value })} maxLength={80} className={input} />
            </label>
            <label>
              <span className={label}>Kısa ad (URL)</span>
              <input
                value={tx.slug}
                onChange={(e) => setTx({ slug: e.target.value })}
                onBlur={(e) => setTx({ slug: slugify(e.target.value) })}
                placeholder={slugify(tx.title) || "otomatik"}
                maxLength={160}
                dir="ltr"
                className={`${input} font-mono text-[12.5px]`}
              />
            </label>
          </div>
          <label className="block">
            <span className={label}>Başlık</span>
            <input value={tx.title} onChange={(e) => setTx({ title: e.target.value })} maxLength={240} className={`${input} py-2.5 text-[20px] font-semibold`} placeholder="Başlık" />
          </label>
          <label className="block">
            <span className={label}>Özet (spot) — listelerde, paylaşımda ve arama sonuçlarında görünür</span>
            <textarea value={tx.dek} onChange={(e) => setTx({ dek: e.target.value })} maxLength={600} rows={2} className={input} />
            <span className="mt-1 block text-end text-[12px] text-muted tnum">{tx.dek.length}/600</span>
          </label>
          <div>
            <span className={label}>{s.isPremium ? "Herkese açık giriş (abone olmayanlar bu kısmı görür)" : "Metin"}</span>
            <RichEditor key={`b-${tab}-${editorKey}`} value={tx.body} onChange={(d) => setTx({ body: d })} dir={dir} onPickImage={pickImage} />
          </div>
          {s.isPremium && (
            <div>
              <span className={label}>Kilitli devam (yalnız abonelere gösterilir)</span>
              <RichEditor
                key={`p-${tab}-${editorKey}`}
                value={tx.premium}
                onChange={(d) => setTx({ premium: d })}
                dir={dir}
                onPickImage={pickImage}
                placeholder="Yazının abonelere özel devamı…"
              />
            </div>
          )}
          <div>
            <button type="button" onClick={() => setShowSeo((v) => !v)} className="text-[13px] font-medium text-accent">
              {showSeo ? "SEO alanlarını gizle" : "SEO alanları (isteğe bağlı)"}
            </button>
            {showSeo && (
              <div className="mt-3 grid gap-3">
                <label>
                  <span className={label}>Arama başlığı (boşsa başlık kullanılır) · {tx.seoTitle.length}/60 önerilir</span>
                  <input value={tx.seoTitle} onChange={(e) => setTx({ seoTitle: e.target.value })} maxLength={120} className={input} />
                </label>
                <label>
                  <span className={label}>Arama açıklaması (boşsa özet kullanılır) · {tx.seoDesc.length}/155 önerilir</span>
                  <textarea value={tx.seoDesc} onChange={(e) => setTx({ seoDesc: e.target.value })} maxLength={300} rows={2} className={input} />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Yan panel */}
      <aside className="space-y-4">
        <div className="space-y-3 rounded-lg border border-line bg-bg-2 p-4">
          <div className="flex items-center justify-between">
            <StatusBadge status={s.status} />
            <span className="text-[12px] text-muted">{s.status === "scheduled" ? fmtAdminDate(s.publishAt) : s.publishedAt ? fmtAdminDate(s.publishedAt) : ""}</span>
          </div>
          <button type="button" onClick={() => run("save")} disabled={!!busy} className={`${btn.secondary} w-full`}>
            {busy === "save" ? "Kaydediliyor…" : "Kaydet"} <span className="ms-2 text-[11px] text-muted">Ctrl+S</span>
          </button>
          {!isEditor && s.status === "draft" && (
            <button type="button" onClick={() => run("review")} disabled={!!busy} className={`${btn.primary} w-full`}>
              Onaya gönder
            </button>
          )}
          {isEditor && (
            <>
              <button type="button" onClick={() => run("publish")} disabled={!!busy} className={`${btn.primary} w-full`}>
                {s.status === "published" ? "Güncellemeyi yayınla" : "Şimdi yayınla"}
              </button>
              <div className="flex gap-2">
                <input type="datetime-local" value={schedule} onChange={(e) => setSchedule(e.target.value)} className={`${input} min-w-0 flex-1`} aria-label="Yayın zamanı (İstanbul)" />
                <button type="button" onClick={() => run("schedule")} disabled={!!busy || !schedule} className={btn.secondary}>
                  Zamanla
                </button>
              </div>
              {s.status === "review" && (
                <div className="space-y-2 border-t border-line pt-3">
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Yazara not (geri gönderirken zorunlu)" className={input} maxLength={1000} />
                  <button type="button" onClick={() => run("return")} disabled={!!busy || !note.trim()} className={`${btn.secondary} w-full`}>
                    Düzeltme için geri gönder
                  </button>
                </div>
              )}
              {s.id && (
                <div className="flex flex-wrap gap-2 border-t border-line pt-3">
                  {live && (
                    <button type="button" onClick={() => run("unpublish")} disabled={!!busy} className={btn.secondary}>
                      Yayından kaldır
                    </button>
                  )}
                  {s.status !== "archived" && (
                    <button type="button" onClick={() => run("archive")} disabled={!!busy} className={btn.secondary}>
                      Arşivle
                    </button>
                  )}
                  <button type="button" onClick={() => window.confirm("Yazı kalıcı olarak silinsin mi? Bu işlem geri alınamaz.") && run("delete")} disabled={!!busy} className={btn.danger}>
                    Sil
                  </button>
                </div>
              )}
            </>
          )}
          {msg && (
            <p role={msg.ok ? "status" : "alert"} className={`text-[13px] ${msg.ok ? "text-[#17663a]" : "text-[#a42828]"}`}>
              {msg.text}
            </p>
          )}
        </div>

        <div className="space-y-3 rounded-lg border border-line bg-bg-2 p-4">
          <label className="block">
            <span className={label}>Tür</span>
            <select value={s.type} onChange={(e) => set("type", e.target.value as PostType)} className={input}>
              {Object.entries(TYPE_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={label}>Kategori</span>
            <select value={s.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={input}>
              {refs.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.theme === "foreign" ? " (Dış Haberler tasarımı)" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-start gap-2.5 text-[14px]">
            <input type="checkbox" checked={s.isPremium} onChange={(e) => set("isPremium", e.target.checked)} className="mt-1" />
            <span>
              Abonelere özel (kilitli)
              <span className="block text-[12.5px] text-muted">Köşe yazısı ve raporlarda varsayılan kilitlidir.</span>
            </span>
          </label>
        </div>

        <div className="space-y-2 rounded-lg border border-line bg-bg-2 p-4">
          <span className={label}>Kapak görseli</span>
          {s.cover ? (
            <div>
              <img src={s.cover.url} alt={s.cover.alt} className="aspect-[16/10] w-full rounded-md object-cover" />
              <p className="mt-1.5 truncate text-[12.5px] text-muted">{s.cover.alt}</p>
            </div>
          ) : (
            <p className="text-[13px] text-muted">Kapak yok.</p>
          )}
          <div className="flex gap-2">
            <button type="button" onClick={() => setPicker(() => (m: MediaItem) => set("cover", m))} className={btn.secondary}>
              {s.cover ? "Değiştir" : "Seç / yükle"}
            </button>
            {s.cover && (
              <button type="button" onClick={() => set("cover", null)} className={btn.secondary}>
                Kaldır
              </button>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-bg-2 p-4">
          <span className={label}>Etiketler</span>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {refs.tags.map((t) => {
              const on = s.tagIds.includes(t.id);
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => set("tagIds", on ? s.tagIds.filter((x) => x !== t.id) : [...s.tagIds, t.id])}
                    className={`rounded-full border px-2.5 py-1 text-[12.5px] ${on ? "border-fg bg-fg text-bg" : "border-line-2 text-fg-3 hover:border-fg-3"}`}
                  >
                    {t.name.tr}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-3 rounded-lg border border-line bg-bg-2 p-4">
          <label className="block">
            <span className={label}>İlk yayımlandığı yer (ör. Habertürk bağlantısı)</span>
            <input value={s.sourceUrl} onChange={(e) => set("sourceUrl", e.target.value)} type="url" placeholder="https://" className={input} />
          </label>
          {s.type === "rapor" && (
            <div>
              <span className={label}>Rapor PDF’i</span>
              {s.reportPdf ? (
                <p className="truncate text-[12.5px]">
                  <a href={s.reportPdf} target="_blank" rel="noopener" className="text-accent">{s.reportPdf.split("/").pop()}</a>
                </p>
              ) : (
                <p className="text-[12.5px] text-muted">PDF yok.</p>
              )}
              <input
                type="file"
                accept="application/pdf"
                className="mt-2 block w-full text-[12.5px]"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const fd = new FormData();
                  fd.set("file", f);
                  fd.set("alt", f.name);
                  const { uploadMedia } = await import("@/app/actions/media");
                  const r = await uploadMedia(fd);
                  if (r.ok) set("reportPdf", r.media.url);
                  else setMsg({ ok: false, text: r.error });
                }}
              />
            </div>
          )}
        </div>

        {revisions.length > 0 && (
          <div className="rounded-lg border border-line bg-bg-2 p-4">
            <span className={label}>Sürüm geçmişi</span>
            <ul className="mt-1 divide-y divide-line text-[13px]">
              {revisions.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-1.5">
                  <span className="text-fg-3 tnum">
                    {fmtAdminDate(r.created_at)} · {String((r.snapshot as { status?: string }).status ?? "")}
                  </span>
                  <button type="button" onClick={() => restore(r)} className="text-accent">
                    Yükle
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      <MediaPicker open={!!picker} onClose={() => setPicker(null)} onPick={(m) => picker?.(m)} library={library} />
    </div>
  );
}
