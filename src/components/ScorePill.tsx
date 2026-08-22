import { BAND_HEX, type Band } from "@/data/demo";
import { cn } from "@/lib/cn";

// Band is always passed in already-resolved (see cdiBand/decayBand in
// data/demo.ts) rather than computed here -- CDI and Decay use inverted
// threshold directions (higher is better vs. lower is better), and baking
// that assumption into the pill itself would make it silently wrong for
// whichever metric it wasn't written for.
export function ScorePill({
  label,
  value,
  band,
  className,
}: {
  label: string;
  value: string;
  band: Band;
  className?: string;
}) {
  const color = BAND_HEX[band];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
        className
      )}
      style={{ borderColor: `${color}40`, backgroundColor: `${color}18` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="label-caps !text-muted">{label}</span>
      <span className="tabular font-mono text-[13px] font-semibold" style={{ color }}>
        {value}
      </span>
    </span>
  );
}
