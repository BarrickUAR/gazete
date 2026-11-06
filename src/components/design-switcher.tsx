"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { designs } from "@/lib/designs";

export function DesignSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  // Seçim sayfasındaki önizleme iframe'lerinde çubuk gizlenir.
  const embedded = useSyncExternalStore(
    () => () => {},
    () => window.self !== window.top || window.location.search.includes("onizleme"),
    () => false,
  );
  const i = designs.findIndex((d) => d.href === pathname);
  const prev = designs[(i - 1 + designs.length) % designs.length];
  const next = designs[(i + 1) % designs.length];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowRight") router.push(next.href, { scroll: true });
      else if (e.key === "ArrowLeft") router.push(prev.href, { scroll: true });
      else if (e.key === "Escape") router.push("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, next.href, prev.href]);

  if (i < 0 || embedded) return null;
  const cur = designs[i];

  const btn = "grid h-9 place-items-center rounded-full transition-colors duration-150";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-3">
      <nav
        aria-label="Tasarımlar arası geçiş"
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-[#111]/95 p-1 text-white shadow-[0_8px_30px_rgba(0,0,0,0.28)]"
        style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" }}
      >
        <Link href="/" className={`${btn} px-3.5 text-[12.5px] font-medium text-white/70 hover:bg-white/10 hover:text-white`} title="Tüm tasarımlar (Esc)">
          Tümü
        </Link>
        <span className="mx-0.5 h-5 w-px bg-white/15" />
        <Link href={prev.href} className={`${btn} w-9 hover:bg-white/10`} aria-label={`Önceki: ${prev.name}`} title="Önceki (←)">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12.5 4.5 7 10l5.5 5.5" /></svg>
        </Link>
        <div className="hidden items-center sm:flex">
          {designs.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              title={d.name}
              className={`${btn} w-9 text-[12px] font-semibold tabular-nums ${d.href === pathname ? "bg-white text-[#111]" : "text-white/55 hover:bg-white/10 hover:text-white"}`}
            >
              {d.no}
            </Link>
          ))}
        </div>
        <span className="px-2 text-[12.5px] font-medium sm:hidden">
          {cur.no} · {cur.name}
        </span>
        <Link href={next.href} className={`${btn} w-9 hover:bg-white/10`} aria-label={`Sonraki: ${next.name}`} title="Sonraki (→)">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7.5 4.5 13 10l-5.5 5.5" /></svg>
        </Link>
        <span className="mx-0.5 hidden h-5 w-px bg-white/15 md:block" />
        <span className="hidden pl-1.5 pr-3.5 text-[12.5px] font-medium text-white/80 md:block">{cur.name}</span>
      </nav>
    </div>
  );
}
