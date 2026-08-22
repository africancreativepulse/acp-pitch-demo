import { BAND_HEX, type Band } from "@/data/demo";

// A single reusable arc gauge for any 0-10 metric with a resolved band
// color (CDI, Decay, or anything future). Semicircular, sweeping
// left-to-right, matching how score gauges read in most analytics UIs.
export function GaugeArc({
  value,
  band,
  label,
  size = 168,
}: {
  value: number;
  band: Band;
  label: string;
  size?: number;
}) {
  const color = BAND_HEX[band];
  const r = 70;
  const cx = 84;
  const cy = 84;
  const startAngle = 180;
  const sweep = 180 * (Math.max(0, Math.min(10, value)) / 10);
  const endAngle = startAngle - sweep;

  const toXY = (angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  };
  const start = toXY(startAngle);
  const end = toXY(endAngle);
  const largeArc = sweep > 180 ? 1 : 0;

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <svg viewBox="0 0 168 100" width={size} height={size * 0.6}>
        <path
          d={`M ${toXY(180).x} ${toXY(180).y} A ${r} ${r} 0 1 1 ${toXY(0).x} ${toXY(0).y}`}
          fill="none"
          stroke="#262A33"
          strokeWidth={10}
          strokeLinecap="round"
        />
        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
        />
        <text x="84" y="78" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize={30} fontWeight={700} fill="#F4F5F7" className="tabular">
          {value.toFixed(1)}
        </text>
      </svg>
      <div className="label-caps mt-1">{label}</div>
    </div>
  );
}
