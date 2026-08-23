import type { ReactNode } from "react";

/**
 * Ported from the real app's design-system/components/StatCard.tsx -- the
 * 4-up stat grid used at the top of every real dashboard page (Dashboard,
 * Campaigns, AgentDashboard, SupervisorDashboard, AdminFieldwork,
 * CampaignDetail). The 1px `gap` on a `--line`-colored background is what
 * draws the hairline dividers between cells. Collapses to 2 columns under
 * 820px, matching the real component.
 */
export function StatGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-4 ${className}`}>
      {children}
    </div>
  );
}

export type StatDeltaTone = "up" | "warn";

export function StatCard({
  label,
  value,
  delta,
  deltaTone = "up",
}: {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  deltaTone?: StatDeltaTone;
}) {
  return (
    <div className="bg-panel px-[22px] py-5 transition-colors hover:bg-ink">
      <div className="text-[10.5px] uppercase tracking-[0.12em] text-muted">{label}</div>
      <div className="my-2.5 font-mono text-[26px] font-semibold text-paper">{value}</div>
      {delta ? <div className={`text-[11px] ${deltaTone === "up" ? "text-sound" : "text-language"}`}>{delta}</div> : null}
    </div>
  );
}
