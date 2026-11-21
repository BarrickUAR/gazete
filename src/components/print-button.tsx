"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="border border-line-2 px-4 py-2.5 uppercase text-fg-2 hover:border-fg hover:text-fg">
      {label}
    </button>
  );
}
