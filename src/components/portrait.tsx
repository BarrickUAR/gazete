// Gerçek portre gelene kadar yer tutucu: monogram + etiket.
export function Portrait({
  className = "",
  bg = "#d9d6cf",
  fg = "#1d1a16",
  font = "",
  small = false,
}: {
  className?: string;
  bg?: string;
  fg?: string;
  font?: string;
  small?: boolean;
}) {
  return (
    <div className={`relative grid place-items-center overflow-hidden ${className}`} style={{ background: bg, color: fg }} aria-label="Portre fotoğrafı">
      <span className={`${font} italic leading-none opacity-80 ${small ? "text-[15px]" : "text-[72px]"}`}>ÇÇ</span>
      {!small && (
        <span className="absolute bottom-3 left-0 right-0 text-center font-sans text-[10px] uppercase tracking-[0.2em] opacity-50">Portre fotoğrafı</span>
      )}
    </div>
  );
}
