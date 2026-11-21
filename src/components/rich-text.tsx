// Tiptap/ProseMirror JSON → React. dangerouslySetInnerHTML yok; bilinmeyen düğümler yok sayılır,
// bağlantılar yalnızca http(s), mailto ve site içi yollar ile sınırlıdır.
import type { ReactNode } from "react";
import type { RichDoc, RichNode } from "@/lib/types";

function safeHref(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  try {
    const u = new URL(s);
    return ["http:", "https:", "mailto:"].includes(u.protocol) ? u.toString() : null;
  } catch {
    return null;
  }
}

function marks(node: RichNode, key: string): ReactNode {
  let out: ReactNode = node.text ?? "";
  for (const m of node.marks ?? []) {
    if (m.type === "bold") out = <strong>{out}</strong>;
    else if (m.type === "italic") out = <em>{out}</em>;
    else if (m.type === "underline") out = <u>{out}</u>;
    else if (m.type === "strike") out = <s>{out}</s>;
    else if (m.type === "code") out = <code>{out}</code>;
    else if (m.type === "link") {
      const h = safeHref(m.attrs?.href);
      if (h) {
        const ext = h.startsWith("http");
        out = (
          <a href={h} {...(ext ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}>
            {out}
          </a>
        );
      }
    }
  }
  return <span key={key}>{out}</span>;
}

function kids(n: RichNode, k: string) {
  return (n.content ?? []).map((c, i) => render(c, `${k}.${i}`));
}

function render(n: RichNode, k: string): ReactNode {
  switch (n.type) {
    case "text":
      return marks(n, k);
    case "paragraph":
      return <p key={k}>{kids(n, k)}</p>;
    case "heading": {
      const level = Number(n.attrs?.level ?? 2);
      return level >= 3 ? <h3 key={k}>{kids(n, k)}</h3> : <h2 key={k} id={slugId(n)}>{kids(n, k)}</h2>;
    }
    case "bulletList":
      return <ul key={k}>{kids(n, k)}</ul>;
    case "orderedList":
      return <ol key={k}>{kids(n, k)}</ol>;
    case "listItem":
      return <li key={k}>{kids(n, k)}</li>;
    case "blockquote":
      return <blockquote key={k}>{kids(n, k)}</blockquote>;
    case "horizontalRule":
      return <hr key={k} />;
    case "hardBreak":
      return <br key={k} />;
    case "image": {
      const src = safeHref(n.attrs?.src);
      if (!src) return null;
      const alt = String(n.attrs?.alt ?? "");
      const cap = n.attrs?.title ? String(n.attrs.title) : null;
      return (
        <figure key={k}>
          <img src={src} alt={alt} loading="lazy" className="w-full" />
          {cap && <figcaption>{cap}</figcaption>}
        </figure>
      );
    }
    default:
      return n.content ? <div key={k}>{kids(n, k)}</div> : null;
  }
}

const textOf = (n: RichNode): string => (n.text ?? "") + (n.content ?? []).map(textOf).join("");

export function slugId(n: RichNode) {
  return (
    "b-" +
    textOf(n)
      .toLocaleLowerCase("tr-TR")
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60)
  );
}

/** İçindekiler için h2 başlıkları. */
export function headings(doc: RichDoc | null | undefined) {
  return (doc?.content ?? []).filter((n) => n.type === "heading" && Number(n.attrs?.level ?? 2) < 3).map((n) => ({ id: slugId(n), text: textOf(n) }));
}

export function RichText({ doc, className = "" }: { doc: RichDoc | null | undefined; className?: string }) {
  if (!doc?.content?.length) return null;
  return <div className={`prose-news ${className}`}>{doc.content.map((n, i) => render(n, String(i)))}</div>;
}
