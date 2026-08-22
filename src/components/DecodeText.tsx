import { useEffect, useState } from "react";

/**
 * Ported from the real app's DecodeText.tsx (Splash pages' hero visual) --
 * character-scramble-to-resolve, time-based so a short phrase and a long
 * verbatim quote both resolve over the same ~700ms. The real app's own
 * design rationale (from its header comment) is worth keeping: earlier
 * hero passes turned CEI scores into decorative charts and kept reading as
 * generic "glowing tech chart" wallpaper; this drops that idea and decodes
 * real verbatim text instead. That's why this demo's Splash screen now
 * uses this component with Sondela's real evidence quotes, replacing the
 * old fabricated-data ghost SignalRing hero treatment.
 *
 * One real adaptation from the original: the real component reads the
 * active language from the real app's I18nProvider (`useI18n`,
 * `FONT_FOR_LANG`) to swap in an Arabic scramble-character set and font
 * fallback for RTL locales. This demo has no i18n system at all (English-
 * only, by design -- see README), so that whole branch is removed rather
 * than pulling in an unrelated subsystem; the scramble mechanic itself is
 * unchanged.
 */
export interface DecodePhrase {
  eyebrow: string;
  text: string;
  meta?: string;
}

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const DECODE_MS = 700;
const TICK_MS = 40;

export function DecodeText({
  phrases,
  accent,
  holdMs = 3400,
  className = "",
}: {
  phrases: DecodePhrase[];
  accent: string;
  holdMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState(phrases[0]?.text ?? "");

  useEffect(() => {
    const target = phrases[index]?.text ?? "";
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    if (reduceMotion) {
      setDisplay(target);
      const holdTimer = window.setTimeout(() => setIndex((i) => (i + 1) % phrases.length), holdMs);
      return () => clearTimeout(holdTimer);
    }

    const start = performance.now();
    let tickTimer: number;
    let holdTimer: number;

    const tick = () => {
      const elapsed = performance.now() - start;
      const frac = Math.min(1, elapsed / DECODE_MS);
      const revealed = Math.floor(frac * target.length);
      let out = "";
      for (let i = 0; i < target.length; i++) {
        out += i < revealed || target[i] === " " ? target[i] : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      setDisplay(out);
      if (frac < 1) {
        tickTimer = window.setTimeout(tick, TICK_MS);
      } else {
        setDisplay(target);
        holdTimer = window.setTimeout(() => setIndex((i) => (i + 1) % phrases.length), holdMs);
      }
    };
    tick();

    return () => {
      clearTimeout(tickTimer);
      clearTimeout(holdTimer);
    };
  }, [index, phrases, holdMs]);

  const current = phrases[index];

  return (
    <div
      className={`rounded-lg border p-7 sm:p-9 ${className}`}
      style={{ borderColor: `color-mix(in srgb, ${accent} 35%, transparent)`, backgroundColor: "color-mix(in srgb, var(--panel) 60%, transparent)" }}
    >
      <div className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: accent }}>
        <span className="h-1.5 w-1.5 animate-ds-breathe rounded-full" style={{ backgroundColor: accent }} />
        {current?.eyebrow}
      </div>
      <div className="min-h-[6.5em] font-mono text-[15px] leading-relaxed text-paper sm:text-[16px]">
        {display}
        <span className="animate-ds-breathe" style={{ color: accent }}>_</span>
      </div>
      {current?.meta && (
        <div className="mt-5 border-t pt-4 font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted" style={{ borderColor: "var(--line)" }}>
          {current.meta}
        </div>
      )}
    </div>
  );
}
