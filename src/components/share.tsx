"use client";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";

export function Share({ lang, url, title }: { lang: Locale; url: string; title: string }) {
  const d = getDict(lang).common;
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { n: "X", h: `https://x.com/intent/post?url=${u}&text=${t}` },
    { n: "WhatsApp", h: `https://wa.me/?text=${t}%20${u}` },
    { n: "Telegram", h: `https://t.me/share/url?url=${u}&text=${t}` },
    { n: "Facebook", h: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { n: "LinkedIn", h: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
  ];
  return (
    <div className="no-print">
      <p className="font-label text-[11.5px] font-semibold uppercase tracking-[0.14em] text-muted">{d.share}</p>
      <ul className="mt-3 flex flex-wrap gap-2 font-ui text-[13px]">
        {links.map((l) => (
          <li key={l.n}>
            <a href={l.h} target="_blank" rel="noopener noreferrer" className="block border border-line-2 px-3 py-1.5 text-fg-2 transition-colors duration-150 hover:border-fg hover:text-fg">
              {l.n}
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(url).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            })}
            className="border border-line-2 px-3 py-1.5 text-fg-2 transition-colors duration-150 hover:border-fg hover:text-fg"
          >
            {copied ? d.copied : d.copyLink}
          </button>
        </li>
      </ul>
    </div>
  );
}
