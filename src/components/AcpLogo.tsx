import { AcpMark } from "./AcpMark";

/**
 * The full lockup -- AcpMark + "AFRICAN CREATIVE PULSE" wordmark, PULSE in
 * the brand accent. Ported from the real app's AcpLogo.tsx; only change is
 * `text-cei-paper`/`text-cei-pulse` -> this project's flat `text-paper`/
 * `text-pulse` token names (same resolved colors, different Tailwind
 * theme-key convention).
 *
 * Content-only (no `<a>`/`<div>` wrapper) -- the wrapper choice stays with
 * each call site.
 */
export function AcpLogo({
  markClassName = "h-7 w-7",
  textClassName = "text-sm",
  className = "",
}: {
  markClassName?: string;
  textClassName?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <AcpMark className={markClassName} />
      <span className={`font-display font-bold uppercase tracking-[0.02em] text-paper ${textClassName}`}>
        AFRICAN CREATIVE <span className="text-pulse">PULSE</span>
      </span>
    </span>
  );
}
