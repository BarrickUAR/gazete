"use client";
// Tiptap zengin metin düzenleyici. Çıktı: ProseMirror JSON (sitede RichText ile güvenli çizilir).
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { RichDoc } from "@/lib/types";

function Btn({ on, active, children, title }: { on: () => void; active?: boolean; children: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={on}
      className={`grid h-8 min-w-8 place-items-center rounded px-1.5 text-[13px] ${active ? "bg-fg text-bg" : "text-fg-3 hover:bg-bg-3 hover:text-fg"}`}
    >
      {children}
    </button>
  );
}

function Toolbar({ ed, onImage }: { ed: Editor; onImage?: () => void }) {
  const link = () => {
    const prev = ed.getAttributes("link").href as string | undefined;
    const url = window.prompt("Bağlantı adresi (boş bırakırsanız kaldırılır)", prev ?? "https://");
    if (url === null) return;
    if (!url.trim()) return ed.chain().focus().unsetLink().run();
    if (!/^(https?:\/\/|\/|mailto:)/.test(url.trim())) return window.alert("Bağlantı http(s)://, mailto: ya da / ile başlamalı.");
    ed.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-line bg-bg px-1.5 py-1">
      <Btn title="Kalın" on={() => ed.chain().focus().toggleBold().run()} active={ed.isActive("bold")}><b>K</b></Btn>
      <Btn title="İtalik" on={() => ed.chain().focus().toggleItalic().run()} active={ed.isActive("italic")}><i>İ</i></Btn>
      <Btn title="Ara başlık" on={() => ed.chain().focus().toggleHeading({ level: 2 }).run()} active={ed.isActive("heading", { level: 2 })}>H2</Btn>
      <Btn title="Alt başlık" on={() => ed.chain().focus().toggleHeading({ level: 3 }).run()} active={ed.isActive("heading", { level: 3 })}>H3</Btn>
      <span className="mx-1 h-5 w-px bg-line" />
      <Btn title="Madde listesi" on={() => ed.chain().focus().toggleBulletList().run()} active={ed.isActive("bulletList")}>•</Btn>
      <Btn title="Numaralı liste" on={() => ed.chain().focus().toggleOrderedList().run()} active={ed.isActive("orderedList")}>1.</Btn>
      <Btn title="Alıntı" on={() => ed.chain().focus().toggleBlockquote().run()} active={ed.isActive("blockquote")}>“”</Btn>
      <Btn title="Ayırıcı çizgi" on={() => ed.chain().focus().setHorizontalRule().run()}>—</Btn>
      <span className="mx-1 h-5 w-px bg-line" />
      <Btn title="Bağlantı" on={link} active={ed.isActive("link")}>Bağ</Btn>
      {onImage && <Btn title="Görsel ekle" on={onImage}>▣</Btn>}
      <span className="mx-1 h-5 w-px bg-line" />
      <Btn title="Geri al" on={() => ed.chain().focus().undo().run()}>↶</Btn>
      <Btn title="Yinele" on={() => ed.chain().focus().redo().run()}>↷</Btn>
    </div>
  );
}

export function RichEditor({
  value,
  onChange,
  placeholder,
  dir = "ltr",
  onPickImage,
}: {
  value: RichDoc | null | undefined;
  onChange: (d: RichDoc) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
  /** Görsel seçici açar; seçilen görseli editöre ekler. */
  onPickImage?: (insert: (src: string, alt: string, title?: string) => void) => void;
}) {
  const ed = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: false }),
      Link.configure({ openOnClick: false, autolink: true, protocols: ["http", "https", "mailto"], HTMLAttributes: { rel: "noopener noreferrer nofollow" } }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: placeholder ?? "Yazmaya başlayın…" }),
    ],
    content: value?.content?.length ? value : undefined,
    editorProps: { attributes: { class: "prose-news px-4 py-3", dir } },
    onUpdate: ({ editor }) => onChange(editor.getJSON() as RichDoc),
  });
  if (!ed) return <div className="min-h-[260px] rounded-md border border-line-2 bg-bg-2" />;
  return (
    <div className="overflow-hidden rounded-md border border-line-2 bg-bg-2 focus-within:border-accent">
      <Toolbar ed={ed} onImage={onPickImage ? () => onPickImage((src, alt, title) => ed.chain().focus().setImage({ src, alt, title }).run()) : undefined} />
      <EditorContent editor={ed} />
    </div>
  );
}
