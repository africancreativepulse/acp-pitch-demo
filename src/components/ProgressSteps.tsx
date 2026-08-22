import { cn } from "@/lib/cn";

export function ProgressSteps({
  steps,
  current,
  accent,
}: {
  steps: string[];
  current: number; // 0-indexed
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {steps.map((label, i) => {
        const state = i < current ? "done" : i === current ? "active" : "upcoming";
        return (
          <div key={label} className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full font-mono text-[12px] font-semibold transition-colors",
                  state === "upcoming" && "border border-line text-muted"
                )}
                style={
                  state !== "upcoming"
                    ? { backgroundColor: state === "active" ? accent : `${accent}30`, color: state === "active" ? "#0B0C10" : accent }
                    : undefined
                }
              >
                {state === "done" ? "✓" : i + 1}
              </div>
              <span
                className={cn("text-sm font-medium", state === "upcoming" ? "text-muted" : "text-paper")}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && <div className="h-px w-8 bg-line sm:w-14" />}
          </div>
        );
      })}
    </div>
  );
}
