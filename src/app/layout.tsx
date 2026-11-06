import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Çetiner Çetin — Gazeteci",
  description:
    "Habertürk TV dış politika ve güvenlik politikaları yayın koordinatörü Çetiner Çetin'in haber, analiz ve köşe yazıları.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
