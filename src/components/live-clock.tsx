"use client";

import { useEffect, useState } from "react";

export function LiveClock({ seconds = true }: { seconds?: boolean }) {
  const [now, setNow] = useState<string>("--:--");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        second: seconds ? "2-digit" : undefined,
        timeZone: "Europe/Istanbul",
      });
    setNow(fmt());
    const t = setInterval(() => setNow(fmt()), 1000);
    return () => clearInterval(t);
  }, [seconds]);
  return <span className="tnum">{now}</span>;
}
