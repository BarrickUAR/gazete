import { notFound } from "next/navigation";

// Eşleşmeyen tüm yollar → [lang]/not-found (dil düzeni içinde, 404 durum koduyla).
export default function CatchAll() {
  notFound();
}
