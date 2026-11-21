"use client";
// Medya seçici: kütüphaneden seç ya da yeni yükle (alt metin + kredi ile).
import { useEffect, useRef, useState } from "react";
import { uploadMedia } from "@/app/actions/media";
import { btn, input, label } from "./ui";

export type MediaItem = { id: string; url: string; alt: string; caption?: string | null; credit?: string | null };

function dims(file: File): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/")) return Promise.resolve(null);
  return new Promise((res) => {
    const img = new window.Image();
    img.onload = () => {
      res({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => res(null);
    img.src = URL.createObjectURL(file);
  });
}

export function UploadForm({ onDone, accept = "image/jpeg,image/png,image/webp,image/avif" }: { onDone: (m: MediaItem) => void; accept?: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const f = fd.get("file") as File | null;
    if (f) {
      const d = await dims(f);
      if (d) {
        fd.set("width", String(d.width));
        fd.set("height", String(d.height));
      }
    }
    setBusy(true);
    setErr(null);
    const r = await uploadMedia(fd);
    setBusy(false);
    if (!r.ok) return setErr(r.error);
    (e.target as HTMLFormElement).reset();
    onDone({ ...r.media, caption: String(fd.get("caption") ?? ""), credit: String(fd.get("credit") ?? "") });
  }
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <label className="sm:col-span-2">
        <span className={label}>Dosya (en fazla 8 MB)</span>
        <input name="file" type="file" accept={accept} required className="block w-full text-[13.5px] file:me-3 file:rounded-md file:border file:border-line-2 file:bg-bg-2 file:px-3 file:py-1.5" />
      </label>
      <label className="sm:col-span-2">
        <span className={label}>Alt metin (görme engelli okurlar ve SEO için; görseli tarif edin)</span>
        <input name="alt" required maxLength={300} className={input} />
      </label>
      <label>
        <span className={label}>Altyazı</span>
        <input name="caption" maxLength={400} className={input} />
      </label>
      <label>
        <span className={label}>Kredi / kaynak</span>
        <input name="credit" maxLength={200} placeholder="Fotoğraf: …" className={input} />
      </label>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button className={btn.primary} disabled={busy}>{busy ? "Yükleniyor…" : "Yükle"}</button>
        {err && <p role="alert" className="text-[13px] text-[#a42828]">{err}</p>}
      </div>
    </form>
  );
}

export function MediaPicker({ open, onClose, onPick, library }: { open: boolean; onClose: () => void; onPick: (m: MediaItem) => void; library: MediaItem[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [items, setItems] = useState(library);
  const [q, setQ] = useState("");
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  const shown = items.filter((m) => !q || `${m.alt} ${m.caption ?? ""}`.toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr")));
  return (
    <dialog ref={ref} onClose={onClose} className="t-admin m-auto w-[min(920px,94vw)] rounded-lg border border-line bg-bg-2 p-0 text-fg backdrop:bg-black/40">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h2 className="text-[15px] font-semibold">Görsel seç</h2>
        <button type="button" onClick={onClose} className={btn.secondary}>Kapat</button>
      </div>
      <div className="grid max-h-[75vh] gap-5 overflow-y-auto p-4 lg:grid-cols-[1fr_300px]">
        <div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Alt metin ya da altyazıda ara…" className={`${input} mb-3`} />
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {shown.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => {
                    onPick(m);
                    onClose();
                  }}
                  className="group block w-full overflow-hidden rounded-md border border-line text-start hover:border-accent"
                >
                  <img src={m.url} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  <span className="block truncate px-2 py-1.5 text-[12px] text-fg-3">{m.alt || "(alt metin yok)"}</span>
                </button>
              </li>
            ))}
          </ul>
          {shown.length === 0 && <p className="py-8 text-center text-[14px] text-muted">Görsel yok.</p>}
        </div>
        <div className="rounded-md border border-line p-3">
          <p className="mb-3 text-[13px] font-semibold">Yeni yükle</p>
          <UploadForm
            onDone={(m) => {
              setItems((x) => [m, ...x]);
              onPick(m);
              onClose();
            }}
          />
        </div>
      </div>
    </dialog>
  );
}
