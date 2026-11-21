// Kurumsal kimlik: "ÇÇ" monogramı (mavi zemin, beyaz çift C + çengel) ve yazı markası.
// Kılavuz: /yonetim/marka

export function Monogram({ size = 32, bg = "var(--brand-blue)", fg = "#fff", className = "" }: { size?: number; bg?: string; fg?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} role="img" aria-label="Çetiner Çetin">
      <rect width="64" height="64" rx="6" fill={bg} />
      {/* iki iç içe C: dış ve iç yay, sağa açık */}
      <path d="M44 17.5A18 18 0 1 0 44 46.5" fill="none" stroke={fg} strokeWidth="5.5" strokeLinecap="square" />
      <path d="M44 25.5A9 9 0 1 0 44 38.5" fill="none" stroke={fg} strokeWidth="5.5" strokeLinecap="square" />
      {/* çengel */}
      <path d="M27 50.5v5.5h4.5" fill="none" stroke={fg} strokeWidth="3.5" strokeLinecap="square" />
    </svg>
  );
}

export function Wordmark({ className = "", mark = true, markBg, markFg }: { className?: string; mark?: boolean; markBg?: string; markFg?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {mark && <Monogram size={28} bg={markBg} fg={markFg} />}
      <span className="font-display text-[23px] font-semibold italic leading-none tracking-[-0.01em] whitespace-nowrap">Çetiner Çetin</span>
    </span>
  );
}
