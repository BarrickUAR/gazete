// Yönetim paneli kök düzeni (ayrı kök: dil önekli site düzeninden bağımsız, Türkçe, dizine eklenmez).
import Link from "next/link";
import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Arabic, Noto_Naskh_Arabic } from "next/font/google";
import { Monogram } from "@/brand/logo";
import { LogoutButton } from "@/components/auth-forms";
import { can, requireStaff, ROLE_LABEL } from "@/lib/admin/auth";
import type { Role } from "@/lib/types";
import { AdminNav } from "./nav";
import "../globals.css";

const plex = IBM_Plex_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], variable: "--f-plex" });
const mono = IBM_Plex_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--f-mono", preload: false });
const plexar = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600"], variable: "--f-plexar", preload: false });
const naskh = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "600"], variable: "--f-naskh", preload: false });

export const metadata: Metadata = { title: { default: "Yönetim", template: "%s · Yönetim" }, robots: { index: false, follow: false } };

export type NavItem = { href: string; label: string; min: Role };
const ITEMS: NavItem[] = [
  { href: "/yonetim", label: "Pano", min: "author" },
  { href: "/yonetim/yazilar", label: "Yazılar", min: "author" },
  { href: "/yonetim/yazilar/yeni", label: "Yeni yazı", min: "author" },
  { href: "/yonetim/medya", label: "Medya", min: "author" },
  { href: "/yonetim/aboneler", label: "Aboneler", min: "editor" },
  { href: "/yonetim/mesajlar", label: "Mesajlar", min: "editor" },
  { href: "/yonetim/kullanicilar", label: "Kullanıcılar", min: "admin" },
  { href: "/yonetim/ayarlar", label: "Ayarlar", min: "admin" },
  { href: "/yonetim/marka", label: "Marka kılavuzu", min: "author" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role } = await requireStaff("author");
  const items = ITEMS.filter((i) => can(role, i.min));
  return (
    <html lang="tr" className={`${plex.variable} ${mono.variable} ${plexar.variable} ${naskh.variable}`}>
      <body>
        <div className="t-admin min-h-screen bg-bg font-ui text-fg lg:grid lg:grid-cols-[232px_1fr]">
          <aside className="border-b border-line bg-bg-2 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-e">
            <div className="flex items-center justify-between gap-3 px-4 py-4 lg:block">
              <Link href="/yonetim" className="flex items-center gap-2.5">
                <Monogram size={28} />
                <span className="text-[15px] font-semibold">Çetiner Çetin</span>
              </Link>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- site ayrı kök düzen: tam sayfa yükleme gerekli */}
              <a href="/" className="text-[12.5px] text-muted hover:text-fg lg:mt-1 lg:block lg:ps-[38px]">Siteyi aç ↗</a>
            </div>
            <AdminNav items={items} />
            <div className="hidden border-t border-line px-4 py-4 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
              <p className="truncate text-[13px] font-medium">{user.email}</p>
              <p className="mt-0.5 text-[12px] text-muted">{ROLE_LABEL[role]}</p>
              <div className="mt-3">
                <LogoutButton lang="tr" />
              </div>
            </div>
          </aside>
          <main className="min-w-0 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
