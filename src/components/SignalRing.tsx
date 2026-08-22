import { useId, useState } from "react";

export interface SignalRingDatum {
  key: string;
  label: string;
  score: number; // 0-10
  color: string;
}

const SIZE = 400;
const CX = SIZE / 2;
const CY = SIZE / 2;
const MAX_R = 148;
const GRID_LEVELS = [2, 4, 6, 8, 10];

function pointAt(index: number, total: number, r: number) {
  const angle = ((index * (360 / total) - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

/**
 * Pure presentational hexagonal (or N-gon, geometry doesn't assume 6)
 * radar. Deliberately built with zero knowledge of what CEI/campaigns
 * are -- it only knows { key, label, score, color }[], so the same
 * component works unmodified for any future dimension set.
 *
 * Each node keeps its OWN token color rather than the ring rendering as
 * one single "campaign color" -- the filled area is a neutral translucent
 * shape (it's there to show the read's overall silhouette), the color
 * identity lives entirely in the per-dimension nodes, spokes-on-hover,
 * and labels.
 */
export function SignalRing({
  data,
  selected,
  onSelect,
  size = 400,
}: {
  data: SignalRingDatum[];
  selected?: string;
  onSelect?: (key: string) => void;
  size?: number;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const gradId = useId();
  const total = data.length;
  const active = hovered ?? selected ?? null;

  const scorePoints = data.map((d, i) => pointAt(i, total, MAX_R * (Math.max(0, Math.min(10, d.score)) / 10)));
  const polygonPath = scorePoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={size}
      height={size}
      role="group"
      aria-label="Cultural Engagement Index, six dimensions"
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#F4F5F7" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#F4F5F7" stopOpacity="0.03" />
        </radialGradient>
      </defs>

      {/* grid rings */}
      {GRID_LEVELS.map((level) => {
        const r = MAX_R * (level / 10);
        const pts = data.map((_, i) => pointAt(i, total, r));
        return (
          <polygon
            key={level}
            points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#262A33"
            strokeWidth={level === 10 ? 1.2 : 1}
          />
        );
      })}

      {/* spokes */}
      {data.map((d, i) => {
        const outer = pointAt(i, total, MAX_R);
        const isActive = active === d.key;
        return (
          <line
            key={d.key}
            x1={CX}
            y1={CY}
            x2={outer.x}
            y2={outer.y}
            stroke={isActive ? d.color : "#262A33"}
            strokeOpacity={isActive ? 0.55 : 1}
            strokeWidth={isActive ? 1.5 : 1}
          />
        );
      })}

      {/* filled read shape */}
      <polygon points={polygonPath} fill={`url(#${gradId})`} stroke="#F4F5F7" strokeOpacity={0.3} strokeWidth={1.2} />

      {/* labels + score + nodes */}
      {data.map((d, i) => {
        const labelPt = pointAt(i, total, MAX_R + 34);
        const scorePt = scorePoints[i];
        const isActive = active === d.key;
        return (
          <g key={d.key}>
            <text
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={12}
              fontFamily="JetBrains Mono, monospace"
              fontWeight={isActive ? 700 : 500}
              letterSpacing={1}
              fill={isActive ? d.color : "#9AA0AB"}
              style={{ textTransform: "uppercase" }}
            >
              {d.label}
            </text>
            {/* halo */}
            <circle cx={scorePt.x} cy={scorePt.y} r={isActive ? 13 : 9} fill={d.color} fillOpacity={isActive ? 0.22 : 0.12} />
            <circle
              cx={scorePt.x}
              cy={scorePt.y}
              r={isActive ? 7 : 5.5}
              fill={d.color}
              stroke="#0B0C10"
              strokeWidth={2}
              tabIndex={0}
              role="button"
              aria-label={`${d.label}, score ${d.score.toFixed(1)} of 10`}
              className="cursor-pointer outline-none"
              onMouseEnter={() => setHovered(d.key)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(d.key)}
              onBlur={() => setHovered(null)}
              onClick={() => onSelect?.(d.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect?.(d.key);
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}
