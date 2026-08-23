import { Sparkles, ListChecks } from "lucide-react";

/**
 * Small pill distinguishing which of the platform's two detection paths
 * caught a given quality flag -- an AI thoughtfulness/similarity scan, or
 * a deterministic rule (GPS boundary, duplicate-text match). Adapted from
 * the real app's components/fieldwork/AlertSourceBadge.tsx: same real
 * distinction (source: "ai" | "rule"), restyled to this demo's flat token
 * names.
 */
export function AlertSourceBadge({ source }: { source: "ai" | "rule" }) {
  const isAi = source === "ai";
  const color = isAi ? "var(--soulgap)" : "var(--visual)";
  const Icon = isAi ? Sparkles : ListChecks;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-[0.06em]"
      style={{ color, backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)` }}
    >
      <Icon className="h-2.5 w-2.5" />
      {isAi ? "AI Detected" : "Rule-Based"}
    </span>
  );
}
