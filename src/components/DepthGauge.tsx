/**
 * CDI's visual counterpart to SignalRing -- ported from the real app's
 * DepthGauge.tsx. A semi-circle dial (not a six-axis radar) since CDI is
 * one score on one scale. Only change from the original: `text-cei-muted`/
 * `text-cei-paper` -> this project's flat `text-muted`/`text-paper` token
 * names (same resolved colors).
 *
 * CDI-only by design -- the band thresholds/colors/labels below are
 * hardcoded to CDI's specific 0-10 "authenticity" semantics (review
 * needed / moderately authentic / highly authentic), the same way the
 * real component is. This demo's separate Decay Risk metric has no real-
 * app counterpart to port (Decay doesn't exist in the real app yet), and
 * its risk semantics are inverted from CDI's (low is good, not bad) --
 * feeding it through this component would silently mislabel it, so Decay
 * keeps its own GaugeArc, now restyled to the same real token/font system.
 */
const VB_WIDTH = 580;
const VB_HEIGHT = 320;
const CX = 290;
const CY = 225;
const R = 150;

export type CdiBand = "highly_authentic" | "moderately_authentic" | "review_needed";

interface CdiBandGeometry {
  key: CdiBand;
  color: string;
  from: number;
  to: number;
  displayTo: number;
}

export const CDI_BANDS: readonly CdiBandGeometry[] = [
  { key: "review_needed", color: "var(--pulse)", from: 0, to: 5, displayTo: 4.9 },
  { key: "moderately_authentic", color: "var(--language)", from: 5, to: 7, displayTo: 6.9 },
  { key: "highly_authentic", color: "var(--sound)", from: 7, to: 10, displayTo: 10 },
] as const;

export function cdiBandFor(score: number): CdiBand {
  const clamped = Math.max(0, Math.min(10, score));
  for (let i = CDI_BANDS.length - 1; i >= 0; i--) {
    if (clamped >= CDI_BANDS[i].from) return CDI_BANDS[i].key;
  }
  return CDI_BANDS[0].key;
}

export const CDI_BAND_META: Record<CdiBand, { color: string }> = Object.fromEntries(
  CDI_BANDS.map((b) => [b.key, { color: b.color }])
) as Record<CdiBand, { color: string }>;

export const DEFAULT_CDI_BAND_LABELS: Record<CdiBand, { title: string; description: string }> = {
  review_needed: { title: "Review Needed", description: "Inconsistencies or extraction patterns flagged" },
  moderately_authentic: { title: "Moderately Authentic", description: "Plausible but generic, not yet distinctive" },
  highly_authentic: { title: "Highly Authentic", description: "Specific cultural detail checks out, no flags" },
};

const LABEL_ALIGN: Record<CdiBand, "left" | "right" | "center"> = {
  review_needed: "right",
  moderately_authentic: "center",
  highly_authentic: "left",
};

const LABEL_RADIAL_OFFSET = 46;
const LABEL_WIDTH_PERCENT = (140 / VB_WIDTH) * 100;

function scoreToAngle(score: number) {
  return 180 * (1 - score / 10);
}

function pointAt(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY - r * Math.sin(rad) };
}

function pointAtPercent(angleDeg: number, r: number) {
  const p = pointAt(angleDeg, r);
  return { left: (p.x / VB_WIDTH) * 100, top: (p.y / VB_HEIGHT) * 100 };
}

function arcPath(startAngle: number, endAngle: number, r: number) {
  const start = pointAt(startAngle, r);
  const end = pointAt(endAngle, r);
  const largeArcFlag = Math.abs(startAngle - endAngle) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export function DepthGauge({
  score = 7.8,
  animated = true,
  className = "",
  bandLabels = DEFAULT_CDI_BAND_LABELS,
}: {
  score?: number; // 0-10
  animated?: boolean;
  className?: string;
  bandLabels?: Record<CdiBand, { title: string; description: string }>;
}) {
  const clamped = Math.max(0, Math.min(10, score));
  const markerAngle = scoreToAngle(clamped);
  const marker = pointAt(markerAngle, R);
  const activeBand = cdiBandFor(clamped);
  const bandColor = CDI_BAND_META[activeBand].color;

  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio: `${VB_WIDTH} / ${VB_HEIGHT}` }}>
      <svg viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        {CDI_BANDS.map((b) => (
          <path
            key={b.key}
            d={arcPath(scoreToAngle(b.from), scoreToAngle(b.to), R)}
            fill="none"
            stroke={b.color}
            strokeWidth={22}
            strokeLinecap="butt"
          />
        ))}

        {[5, 7].map((s) => {
          const angle = scoreToAngle(s);
          const inner = pointAt(angle, R - 16);
          const outer = pointAt(angle, R + 16);
          return <line key={s} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="rgba(11,12,16,0.9)" strokeWidth={3} />;
        })}

        <circle cx={pointAt(180, R).x} cy={pointAt(180, R).y} r={11} fill="var(--pulse)" />
        <circle cx={pointAt(0, R).x} cy={pointAt(0, R).y} r={11} fill="var(--sound)" />

        <g className={animated ? "animate-ds-node-pulse" : undefined}>
          <circle cx={marker.x} cy={marker.y} r={13} style={{ fill: bandColor, fillOpacity: 0.22 }} />
          <circle cx={marker.x} cy={marker.y} r={7} style={{ fill: bandColor, stroke: "var(--ink)", strokeWidth: 2.5 }} />
        </g>

        {animated
          ? [0, 1, 1.6].map((delay) => (
              <circle
                key={delay}
                cx={marker.x}
                cy={marker.y}
                r={6}
                fill="none"
                style={{ stroke: bandColor, transformOrigin: `${marker.x}px ${marker.y}px`, animationDelay: `${delay}s` }}
                className="animate-ds-ripple-out"
              />
            ))
          : null}
      </svg>

      {CDI_BANDS.map((b) => {
        const mid = (b.from + b.to) / 2;
        const { left, top } = pointAtPercent(scoreToAngle(mid), R + LABEL_RADIAL_OFFSET);
        const isActive = b.key === activeBand;
        const align = LABEL_ALIGN[b.key];
        const translateX = align === "left" ? "0%" : align === "right" ? "-100%" : "-50%";
        return (
          <div
            key={b.key}
            className="pointer-events-none absolute font-mono text-[10px] uppercase leading-snug transition-opacity duration-500"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${LABEL_WIDTH_PERCENT}%`,
              transform: `translate(${translateX}, -100%)`,
              textAlign: align,
              opacity: isActive ? 1 : 0.4,
            }}
          >
            <div className="font-semibold tracking-wide" style={{ color: b.color }}>
              {bandLabels[b.key].title} · <span className="whitespace-nowrap">{b.from}–{b.displayTo}</span>
            </div>
            <div className="mt-0.5 normal-case tracking-normal text-muted">{bandLabels[b.key].description}</div>
          </div>
        );
      })}

      <div className="pointer-events-none absolute left-1/2 top-[64%] -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="font-display text-[40px] font-bold text-paper">
          {clamped.toFixed(1)}
          <span className="text-lg text-muted">/10</span>
        </div>
        <div className="font-mono text-[13px] uppercase tracking-[0.18em]" style={{ color: bandColor }}>
          {bandLabels[activeBand].title}
        </div>
      </div>
    </div>
  );
}
