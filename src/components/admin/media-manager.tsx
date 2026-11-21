"use client";
// Medya kütüphanesi: yükleme, arama, alt metin/altyazı/kredi düzenleme, adres kopyalama.
import { useState } from "react";
import { updateMedia } from "@/app/actions/media";
import { UploadForm } from "./media-picker";
import { btn, input, label } from "./ui";

type M = { id: string; url: string; alt: string; caption: string | null; credit: string | null; width: number | null; height: number | null; created_at: string };

export function MediaManager({ initial }: { initial: M[] }) {
  const [items, setItems] = useState(initial);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<M | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const shown = items.filter((m) => !q || `${m.alt} ${m.caption ?? ""} ${m.credit ?? ""}`.toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr")));
  const missingAlt = items.filter((m) => !m.alt.trim() && !m.url.endsWith(".pdf")).length;

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!sel) return;
    const fd = new FormData(e.currentTarget);
    fd.set("id", sel.id);
    setBusy(true);
    const r = await updateMedia(fd);
    setBusy(false);
    if (!r.ok) return setMsg(r.error ?? "Kaydedilemedi");
    const next = { ...sel, alt: String(fd.get("alt")), caption: String(fd.get("caption")) || null, credit: String(fd.get("credit")) || null };
    setItems((x) => x.map((m) => (m.id === sel.id ? next : m)));
    setSel(next);
    setMsg("Kaydedildi.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Alt metin, altyazı ya da kredide ara…" className={`${input} max-w-sm`} />
          <span className="text-[13px] text-muted tnum">{shown.length} dosya</span>
          {missingAlt > 0 && <span className="rounded bg-[#fff4d6] px-2 py-0.5 text-[12.5px] text-[#7a5200]">{missingAlt} görselde alt metin eksik</span>}
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((m) => {
            const pdf = m.url.toLowerCase().endsWith(".pdf");
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSel(m);
                    setMsg(null);
                  }}
                  aria-pressed={sel?.id === m.id}
                  className={`block w-full overflow-hidden rounded-md border bg-bg-2 text-start ${sel?.id === m.id ? "border-accent" : "border-line hover:border-fg-3"}`}
                >
                  {pdf ? (
                    <span className="grid aspect-[4/3] place-items-center bg-bg-3 text-[13px] font-semibold text-fg-3">PDF</span>
                  ) : (
                    <img src={m.url} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  )}
                  <span className={`block truncate px-2 py-1.5 text-[12px] ${m.alt ? "text-fg-3" : "text-[#a42828]"}`}>{m.alt || "Alt metin yok"}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {shown.length === 0 && <p className="py-12 text-center text-[14px] text-muted">Henüz dosya yok. Sağdaki formdan ilk görseli yükleyin.</p>}
      </div>

      <aside className="space-y-4">
        {sel && (
          <div className="rounded-lg border border-line bg-bg-2 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[14px] font-semibold">Seçili dosya</p>
              <button type="button" onClick={() => setSel(null)} className="text-[13px] text-muted hover:text-fg">
                Kapat
              </button>
            </div>
            {!sel.url.endsWith(".pdf") && <img src={sel.url} alt="" className="mb-3 w-full rounded-md" />}
            <p className="mb-3 text-[12px] text-muted tnum">
              {sel.width && sel.height ? `${sel.width}×${sel.height} · ` : ""}
              {new Date(sel.created_at).toLocaleDateString("tr-TR")}
            </p>
            <form key={sel.id} onSubmit={save} className="space-y-3">
              <label className="block">
                <span className={label}>Alt metin</span>
                <input name="alt" defaultValue={sel.alt} maxLength={300} className={input} />
              </label>
              <label className="block">
                <span className={label}>Altyazı</span>
                <input name="caption" defaultValue={sel.caption ?? ""} maxLength={400} className={input} />
              </label>
              <label className="block">
                <span className={label}>Kredi / kaynak</span>
                <input name="credit" defaultValue={sel.credit ?? ""} maxLength={200} className={input} />
              </label>
              <div className="flex flex-wrap gap-2">
                <button className={btn.primary} disabled={busy}>
                  {busy ? "Kaydediliyor…" : "Kaydet"}
                </button>
                <button
                  type="button"
                  className={btn.secondary}
                  onClick={async () => {
                    await navigator.clipboard.writeText(sel.url);
                    setMsg("Adres kopyalandı.");
                  }}
                >
                  Adresi kopyala
                </button>
              </div>
              {msg && <p className="text-[13px] text-fg-3">{msg}</p>}
            </form>
          </div>
        )}
        <div className="rounded-lg border border-line bg-bg-2 p-4">
          <p className="mb-3 text-[14px] font-semibold">Yeni yükle</p>
          <UploadForm
            accept="image/jpeg,image/png,image/webp,image/avif,application/pdf"
            onDone={(m) => {
              const row: M = { id: m.id, url: m.url, alt: m.alt, caption: m.caption ?? null, credit: m.credit ?? null, width: null, height: null, created_at: new Date().toISOString() };
              setItems((x) => [row, ...x]);
              setSel(row);
              setMsg("Yüklendi.");
            }}
          />
        </div>
      </aside>
    </div>
  );
}
