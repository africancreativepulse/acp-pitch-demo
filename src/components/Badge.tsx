import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({
  children,
  color = "#9AA0AB",
  filled = false,
  className,
}: {
  children: ReactNode;
  color?: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.08em]",
        className
      )}
      style={
        filled
          ? { backgroundColor: color, borderColor: color, color: "#0B0C10" }
          : { borderColor: `${color}55`, color, backgroundColor: `${color}14` }
      }
    >
      {children}
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <Badge color="#2FBF71">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path d="M2 5.2 4.1 7.3 8 2.7" stroke="#2FBF71" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Verified — GPS + supervisor back-check
    </Badge>
  );
}
