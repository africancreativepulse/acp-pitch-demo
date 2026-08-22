import { useId, useMemo, useState } from "react";

/**
 * Ported from the real app's SignalRing.tsx -- the six-dimension CEI
 * radar, the brief's "signature motif." Visual geometry, gridlines, sweep
 * animation and ripple pings are copied verbatim (down to the exact
 * rgba(246,241,233,x) opacities the real component hardcodes for its
 * guide circles/spokes/labels).
 *
 * One real, additive change from the original: the real component is
 * marketing-only and has no click handling at all -- but its own header
 * comment already anticipates dashboard reuse ("Dashboard/app screens
 * should pass animated={false} if this ever gets reused there"). This
 * app's Cultural Read screen needs genuine tap-to-navigate on each node
 * (existing interaction logic this re-skin has to preserve, not just
 * decorate), so `selected`/`onSelect` are added as optional props with
 * zero effect on the default marketing rendering -- omit them and this
 * renders pixel-identical to the real component's own default output.
 */
export interface SignalDimension {
  /** Stable id for onSelect; defaults to `name` when omitted (marketing
      call sites, which never pass onSelect, don't need this). */
  key?: string;
  name: string;
  pct: number; // 0-100
  color: string;
}

export const DEFAULT_SIGNAL_DIMENSIONS: SignalDimension[] = [
  { name: "PULSE", pct: 85, color: "var(--pulse)" },
  { name: "TASTE", pct: 72, color: "var(--taste)" },
  { name: "SOUND", pct: 90, color: "var(--sound)" },
  { name: "VISUAL", pct: 78, color: "var(--visual)" },
  { name: "LANGUAGE", pct: 65, color: "var(--language)" },
  { name: "RITUAL", pct: 82, color: "var(--ritual)" },
];

const CX = 200;
const CY = 200;
const MAX_R = 155;

function pointAt(index: number, total: number, r: number) {
  const angle = ((index * (360 / total) - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

export function SignalRing({
  dimensions = DEFAULT_SIGNAL_DIMENSIONS,
  primaryColor = "var(--pulse)",
  showLabels = true,
  animated = true,
  selected,
  onSelect,
  className = "",
}: {
  dimensions?: SignalDimension[];
  primaryColor?: string;
  showLabels?: boolean;
  animated?: boolean;
  /** Dashboard-only addition -- see header comment. Omit both for the
      real component's original marketing-only behavior. */
  selected?: string;
  onSelect?: (key: string) => void;
  className?: string;
}) {
  const gradientId = useId();
  const total = dimensions.length;
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered ?? selected ?? null;

  const polygonPoints = useMemo(
    () =>
      dimensions
        .map((d, i) => {
          const p = pointAt(i, total, MAX_R * (d.pct / 100));
          return `${p.x},${p.y}`;
        })
        .join(" "),
    [dimensions, total],
  );

  return (
    <svg viewBox="0 0 400 400" className={className} role={onSelect ? "group" : undefined} aria-hidden={onSelect ? undefined : "true"}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* concentric guide circles */}
      {[0.33, 0.66, 1].map((f) => (
        <circle key={f} cx={CX} cy={CY} r={MAX_R * f} fill="none" stroke="rgba(246,241,233,0.08)" strokeWidth={1} />
      ))}

      {/* spokes + labels */}
      {dimensions.map((d, i) => {
        const key = d.key ?? d.name;
        const edge = pointAt(i, total, MAX_R);
        const labelPt = pointAt(i, total, MAX_R + 26);
        const isActive = active === key;
        return (
          <g key={key}>
            <line
              x1={CX}
              y1={CY}
              x2={edge.x}
              y2={edge.y}
              stroke={isActive ? d.color : "rgba(246,241,233,0.1)"}
              strokeOpacity={isActive ? 0.55 : 1}
              strokeWidth={isActive ? 1.5 : 1}
            />
            {showLabels ? (
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isActive ? d.color : "rgba(246,241,233,0.45)"}
                fontSize={10}
                fontFamily="var(--font-mono)"
                fontWeight={isActive ? 700 : 500}
                letterSpacing={1}
              >
                {d.name}
              </text>
            ) : null}
          </g>
        );
      })}

      {/* filled area */}
      <polygon
        points={polygonPoints}
        style={{ fill: primaryColor, fillOpacity: 0.1, stroke: primaryColor }}
        strokeWidth={1.6}
        className={animated ? "origin-center animate-ds-breathe" : undefined}
      />

      {/* per-dimension dots */}
      {dimensions.map((d, i) => {
        const key = d.key ?? d.name;
        const p = pointAt(i, total, MAX_R * (d.pct / 100));
        const isPrimary = d.color === primaryColor;
        const isActive = active === key;
        return (
          <g key={key} className={animated && !isPrimary ? "animate-ds-node-pulse" : undefined}>
            <circle cx={p.x} cy={p.y} r={5} style={{ fill: d.color }} />
            <circle
              cx={p.x}
              cy={p.y}
              r={isActive ? 13 : 10}
              style={{ fill: d.color, fillOpacity: isActive ? 0.28 : 0.18 }}
              tabIndex={onSelect ? 0 : undefined}
              role={onSelect ? "button" : undefined}
              aria-label={onSelect ? `${d.name}, ${d.pct}%` : undefined}
              className={onSelect ? "cursor-pointer outline-none" : undefined}
              onMouseEnter={onSelect ? () => setHovered(key) : undefined}
              onMouseLeave={onSelect ? () => setHovered(null) : undefined}
              onFocus={onSelect ? () => setHovered(key) : undefined}
              onBlur={onSelect ? () => setHovered(null) : undefined}
              onClick={onSelect ? () => onSelect(key) : undefined}
              onKeyDown={
                onSelect
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") onSelect(key);
                    }
                  : undefined
              }
            />
          </g>
        );
      })}

      <circle cx={CX} cy={CY} r={3} style={{ fill: primaryColor }} />

      {animated ? (
        <>
          {/* radar sweep */}
          <g className="origin-center animate-ds-sweep-rotate" style={{ transformOrigin: `${CX}px ${CY}px` }}>
            <line x1={CX} y1={CY} x2={CX} y2={CY - MAX_R} style={{ stroke: primaryColor, strokeOpacity: 0.5 }} strokeWidth={1.5} />
            <line
              x1={CX}
              y1={CY}
              x2={CX}
              y2={CY - MAX_R}
              stroke={`url(#${gradientId})`}
              strokeWidth={16}
              strokeOpacity={0.35}
            />
          </g>

          {/* staggered ripple pings */}
          {[0, 1, 1.6].map((delay) => (
            <circle
              key={delay}
              cx={CX}
              cy={CY}
              r={6}
              fill="none"
              style={{ stroke: primaryColor, transformOrigin: `${CX}px ${CY}px`, animationDelay: `${delay}s` }}
              className="animate-ds-ripple-out"
            />
          ))}
        </>
      ) : null}
    </svg>
  );
}
