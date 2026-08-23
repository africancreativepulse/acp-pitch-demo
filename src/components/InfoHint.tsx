import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";

/**
 * Small tap-to-reveal definition popover -- no real-app equivalent to
 * port (the real marketing site explains CEI/CDI via full page sections,
 * not an inline hint), built new to close a real gap this demo had: every
 * screen that shows a CEI/CDI score assumed the viewer already knew what
 * those meant. Click-toggle rather than hover-only `title`, so it works
 * the same on a touch device as a desktop one.
 */
export function InfoHint({ text, color = "var(--muted)" }: { text: string; color?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <span className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          // Stopped so this can sit inside a larger clickable card/row
          // (several call sites are score buttons that navigate a tab)
          // without also triggering that outer click.
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="What does this mean?"
        className="text-muted transition-colors hover:text-paper"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      {open && (
        <span
          className="absolute start-0 top-full z-30 mt-2 w-64 rounded border border-line bg-panel p-3 text-[12px] font-normal normal-case leading-relaxed text-muted shadow-2xl"
          style={{ borderColor: `${color}40` }}
        >
          {text}
        </span>
      )}
    </span>
  );
}
