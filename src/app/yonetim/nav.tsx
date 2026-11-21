"use client";
import { usePathname } from "next/navigation";
import type { NavItem } from "./layout";

export function AdminNav({ items }: { items: NavItem[] }) {
  const path = usePathname();
  const active = (h: string) => (h === "/yonetim" ? path === h : path === h || (path.startsWith(h + "/") && !items.some((i) => i.href !== h && path.startsWith(i.href) && i.href.length > h.length)));
  return (
    <nav aria-label="Yönetim" className="overflow-x-auto px-2 pb-2 lg:pb-0">
      <ul className="flex gap-1 lg:flex-col">
        {items.map((i) => (
          <li key={i.href}>
            <a
              href={i.href}
              aria-current={active(i.href) ? "page" : undefined}
              className={`block whitespace-nowrap rounded-md px-3 py-2 text-[14px] transition-colors duration-150 ${active(i.href) ? "bg-bg-3 font-medium text-fg" : "text-fg-3 hover:bg-bg-3 hover:text-fg"}`}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
