"use client";

import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  const t = setInterval(cb, 1000);
  return () => clearInterval(t);
}

const fmt = (seconds: boolean) =>
  new Date().toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    second: seconds ? "2-digit" : undefined,
    timeZone: "Europe/Istanbul",
  });

export function LiveClock({ seconds = true }: { seconds?: boolean }) {
  const now = useSyncExternalStore(
    subscribe,
    () => fmt(seconds),
    () => (seconds ? "--:--:--" : "--:--"),
  );
  return <span className="tnum">{now}</span>;
}
