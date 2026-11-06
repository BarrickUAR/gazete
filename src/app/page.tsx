import Link from "next/link";
import { Instrument_Serif, Inter_Tight } from "next/font/google";
import { designs } from "@/lib/designs";
import { LivePreview } from "@/components/live-preview";

const serif = Instrument_Serif({ subsets: ["latin", "latin-ext"], weight: "400", style: ["normal", "italic"], variable: "--f-is" });
const sans = Inter_Tight({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--f-it" });

export default function Secim() {
  return (
    <div className={`${serif.variable} ${sans.variable} min-h-screen bg-[#0f0f0e] font-[family-name:var(--f-it)] text-[#f1efe9]`}>
      <div className="mx-auto flex min-h-screen max-w-[1560px] flex-col px-5 py-6 lg:px-10 lg:py-8">
        <header className="flex items-end justify-between gap-6">
          <h1 className="font-[family-name:var(--f-is)] text-[40px] leading-none tracking-[-0.01em] sm:text-[52px]">
            Çetiner Çetin
          </h1>
          <p className="pb-1 text-[13px] text-[#f1efe9]/45">
            <span className="tabular-nums text-[#f1efe9]/80">{designs.length}</span> tasarım
          </p>
        </header>

        <div className="mt-6 grid flex-1 gap-x-6 gap-y-7 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:content-center">
          {designs.map((d) => (
            <Link key={d.href} href={d.href} className="group block">
              <div className="overflow-hidden rounded-lg ring-1 ring-white/10 transition-[box-shadow] duration-200 group-hover:ring-2 group-hover:ring-white/70">
                <LivePreview src={d.href} title={d.name} />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-4">
                <p className="flex items-baseline gap-3">
                  <span className="tabular-nums text-[12px] text-[#f1efe9]/40">{d.no}</span>
                  <span className="font-[family-name:var(--f-is)] text-[24px] leading-none">{d.name}</span>
                </p>
                <span className="flex items-center gap-3 text-[12.5px] text-[#f1efe9]/45">
                  <span className="hidden xl:inline">{d.tag}</span>
                  <span className="flex -space-x-1">
                    {d.swatch.map((c) => (
                      <span key={c} className="h-3.5 w-3.5 rounded-full ring-1 ring-[#0f0f0e]" style={{ background: c }} />
                    ))}
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
