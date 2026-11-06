// Çetiner Çetin portresi. small = yüze ortalanmış kare kırpım (avatar.jpg, 320×320).
export function Portrait({
  className = "",
  bg = "#c9cccf",
  small = false,
  gray = false,
}: {
  className?: string;
  bg?: string;
  small?: boolean;
  gray?: boolean;
}) {
  return (
    <div className={`overflow-hidden ${className}`} style={{ background: bg }}>
      <img
        src={small ? "/img/avatar.jpg" : "/img/portrait.jpg"}
        alt="Çetiner Çetin"
        className={`h-full w-full object-cover ${small ? "object-center" : "object-top"} ${gray ? "grayscale" : ""}`}
      />
    </div>
  );
}
