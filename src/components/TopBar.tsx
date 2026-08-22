import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AGENCY } from "@/data/demo";

export function TopBar({ right }: { right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/agency" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-visual/15 font-display text-xs font-bold text-visual">
            N
          </span>
          <div className="leading-tight">
            <div className="font-display text-[13.5px] font-bold text-paper">{AGENCY.name}</div>
            <div className="label-caps !text-[9.5px] !tracking-[0.1em]">{AGENCY.city}</div>
          </div>
        </Link>
        {right}
      </div>
    </header>
  );
}
