import { useEffect, useRef, useState } from "react";
import { CountUp } from "@/components/CountUp";
import type { CeiPositioningRealityAxis } from "@/data/demo";

/**
 * Real-app parity fix: straight port of the real design-system/components/
 * PositioningRealityChart.tsx's own PositioningRealityBars -- what the
 * real #cei section actually is (a per-dimension Positioning-vs-Reality
 * comparison, not the static percentage cards this demo had wrongly been
 * showing there, see CEI_POSITIONING_REALITY's own header comment in
 * data/demo.ts for the full story of that miss).
 *
 * Same mechanics as the real component: each card reveals on scroll
 * (fade + slide, staggered), its two bars fill from 0 to their real value
 * rather than snapping in, and tapping a card expands a verbatim evidence
 * quote underneath. Positioning is a solid filled bar, Reality is a
 * dashed/hollow track -- distinguishing the two by shape (not color
 * alone), same real reasoning: legible for colorblind readers, in print.
 *
 * Token names adapted to this demo's own (line/ink/panel/paper/muted
 * instead of cei-line/cei-ink/cei-ink-2/cei-paper/cei-muted) -- same
 * colors, this demo's tailwind.config.ts already mirrors tokens.css
 * exactly. panel stands in for the real cei-ink-2 (a step lighter than
 * cei-ink, same role this demo's panel token already plays elsewhere).
 */
const REVEAL_EASE = "cubic-bezier(.16,.84,.44,1)";

function useRevealOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, visible };
}

function AxisCard({
  axis,
  isSelected,
  onToggle,
  delayMs,
}: {
  axis: CeiPositioningRealityAxis;
  isSelected: boolean;
  onToggle: () => void;
  delayMs: number;
}) {
  const { ref, visible } = useRevealOnce<HTMLDivElement>();
  const delta = axis.positioning - axis.reality;

  return (
    <div
      ref={ref}
      className="rounded-md border border-line bg-panel p-4"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 700ms ${REVEAL_EASE}, transform 700ms ${REVEAL_EASE}`,
        transitionDelay: delayMs ? `${delayMs}ms` : undefined,
      }}
    >
      <button type="button" onClick={onToggle} className="flex w-full items-start justify-between gap-3 text-start">
        <div>
          <div className="font-display text-base font-semibold text-paper">{axis.label}</div>
          <div className="text-xs text-muted">{axis.description}</div>
        </div>
        <span className="whitespace-nowrap font-mono text-sm font-semibold" style={{ color: axis.color }}>
          <CountUp target={delta} prefix={delta > 0 ? "+" : ""} suffix=" Delta" />
        </span>
      </button>

      <div className="mt-3 space-y-2.5">
        <div>
          <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-wide text-muted">
            <span>Positioning</span>
            <CountUp target={axis.positioning} />
          </div>
          <div className="h-[6px] overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full"
              style={{
                width: visible ? `${axis.positioning}%` : "0%",
                backgroundColor: axis.color,
                transition: `width 1100ms ${REVEAL_EASE}`,
                transitionDelay: delayMs ? `${delayMs}ms` : undefined,
              }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-wide text-muted">
            <span>Reality</span>
            <CountUp target={axis.reality} />
          </div>
          <div className="h-[6px] overflow-hidden rounded-full border border-dashed" style={{ borderColor: axis.color }}>
            <div
              className="h-full rounded-full"
              style={{
                width: visible ? `${axis.reality}%` : "0%",
                transition: `width 1100ms ${REVEAL_EASE}`,
                transitionDelay: delayMs ? `${delayMs}ms` : undefined,
              }}
            />
          </div>
        </div>
      </div>

      {axis.layerNote || axis.layerPlaceholder ? (
        <div className="mt-3 border-t border-line pt-3">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Data Sources</div>
          <p className="text-xs leading-relaxed text-muted">{axis.layerNote ?? axis.layerPlaceholder}</p>
          {axis.layerExample ? (
            <span className="mt-1 block font-mono text-[11px] font-semibold" style={{ color: axis.color }}>
              {axis.layerExample}
            </span>
          ) : null}
        </div>
      ) : null}

      {isSelected ? (
        <div className="mt-3 border-t border-line pt-3">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Evidence</div>
          <p className="text-sm italic leading-relaxed text-paper">&ldquo;{axis.evidence.verbatim}&rdquo;</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-sm bg-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
              {axis.evidence.languageLabel}
            </span>
            {axis.evidence.gloss ? <span className="text-xs text-muted">English: {axis.evidence.gloss}</span> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function PositioningRealityBars({
  axes,
  selectedKey,
  onSelect,
  className = "",
}: {
  axes: readonly CeiPositioningRealityAxis[];
  selectedKey: string | null;
  onSelect: (key: string | null) => void;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {axes.map((a, i) => (
        <AxisCard
          key={a.key}
          axis={a}
          isSelected={a.key === selectedKey}
          onToggle={() => onSelect(a.key === selectedKey ? null : a.key)}
          delayMs={i * 60}
        />
      ))}
    </div>
  );
}
