import type { ReactNode } from "react";

// The one genuinely responsive-specific treatment in this whole prototype
// (per the brief) -- an illustrative phone bezel graphic that the
// Contributor Capture screen renders inside, at a fixed size, sitting on
// an otherwise normal desktop page. This is not a real breakpoint
// simulation and isn't meant to be one.
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 360, height: 736 }}>
      <div className="absolute inset-0 rounded-[46px] bg-[#050608] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]" />
      <div className="absolute inset-[10px] overflow-hidden rounded-[38px] bg-ink ring-1 ring-white/10">
        {/* dynamic-island style notch */}
        <div className="absolute left-1/2 top-3 z-30 h-6 w-28 -translate-x-1/2 rounded-full bg-[#050608]" />
        <div className="no-scrollbar h-full overflow-y-auto pt-11">{children}</div>
      </div>
      {/* side buttons, purely decorative */}
      <div className="absolute -right-[2px] top-32 h-16 w-[3px] rounded-r-full bg-[#050608]" />
      <div className="absolute -left-[2px] top-24 h-9 w-[3px] rounded-l-full bg-[#050608]" />
      <div className="absolute -left-[2px] top-40 h-9 w-[3px] rounded-l-full bg-[#050608]" />
    </div>
  );
}
