import { useId, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

/**
 * Real-app parity (deferred feature-parity bucket, item 1): straight port
 * of the real design-system/components/LegendDonut.tsx -- a donut with a
 * real, untruncated legend beside it (colored swatch + full label + share),
 * not a bare recharts <Pie label={...}> (which has no text-wrapping and
 * gets cut off mid-word on a small chart, per the real component's own
 * documented history). Byte-for-byte the same gradient-per-slice + hover
 * cross-highlight behavior -- only dependency is recharts itself, now
 * added to this demo for exactly this port (see AgencyInsights.tsx's own
 * header comment for why: the real app's own chart suite is recharts-
 * based, and "port the real chart components" means the real components,
 * not a third hand-rolled equivalent).
 */
export interface LegendDonutEntry {
  name: string;
  value: number;
  color: string;
}

export function LegendDonut({
  data,
  size = 110,
  showPercent = true,
  className = "",
}: {
  data: LegendDonutEntry[];
  size?: number;
  showPercent?: boolean;
  className?: string;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const share = (v: number) => (total > 0 ? Math.round((v / total) * 100) : 0);
  const uid = useId();

  return (
    <div className={`flex items-center gap-5 ${className}`}>
      <div style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))" }}>
        <ResponsiveContainer width={size} height={size} debounce={200}>
          <PieChart>
            <defs>
              {data.map((d, i) => (
                <linearGradient key={d.name} id={`donut-grad-${uid}-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={d.color} />
                  <stop offset="100%" stopColor={`color-mix(in srgb, ${d.color} 55%, black)`} />
                </linearGradient>
              ))}
            </defs>
            <Pie data={data} cx="50%" cy="50%" innerRadius={size * 0.29} outerRadius={size * 0.45} dataKey="value" stroke="none">
              {data.map((d, i) => (
                <Cell
                  key={d.name}
                  fill={`url(#donut-grad-${uid}-${i})`}
                  opacity={hoverIndex === null || hoverIndex === i ? 1 : 0.35}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        {data.map((d, i) => (
          <div
            key={d.name}
            className="flex items-center gap-2 rounded px-1.5 py-0.5 text-xs transition-colors"
            style={{ backgroundColor: hoverIndex === i ? "color-mix(in srgb, var(--paper) 6%, transparent)" : "transparent" }}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <span className="h-2.5 w-2.5 flex-shrink-0 rounded-sm" style={{ backgroundColor: d.color, opacity: hoverIndex === null || hoverIndex === i ? 1 : 0.35 }} />
            <span className="truncate capitalize text-paper">{d.name}</span>
            <span className="ms-auto shrink-0 whitespace-nowrap font-mono text-muted">
              {d.value}
              {showPercent && total > 0 ? ` · ${share(d.value)}%` : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LegendDonut;
