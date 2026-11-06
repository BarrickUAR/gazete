// Çetiner Çetin portresi. small = yüze yakın yuvarlak kesim (avatar).
export function Portrait({
  className = "",
  bg = "#c9cccf",
  small = false,
  gray = false,
}: {
  className?: string;
  bg?: string;
  fg?: string;
  font?: string;
  small?: boolean;
  gray?: boolean;
}) {
  if (small) {
    return (
      <div
        role="img"
        aria-label="Çetiner Çetin"
        className={`overflow-hidden ${gray ? "grayscale" : ""} ${className}`}
        style={{
          backgroundColor: bg,
          backgroundImage: "url(/img/portrait.jpg)",
          backgroundSize: "260%",
          backgroundPosition: "52% 13%",
          backgroundRepeat: "no-repeat",
        }}
      />
    );
  }
  return (
    <div className={`overflow-hidden ${className}`} style={{ background: bg }}>
      <img src="/img/portrait.jpg" alt="Çetiner Çetin" className={`h-full w-full object-cover object-top ${gray ? "grayscale" : ""}`} />
    </div>
  );
}
