import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { DashboardShell, ROLE_ACCENT, ROLE_IDENTITY } from "@/components/DashboardShell";
import { StatCard, StatGrid } from "@/components/StatCard";
import { Button } from "@/components/Button";
import { ExpertBadge } from "@/components/ExpertBadge";
import { CONTRIBUTOR_TASK } from "@/data/demo";
import { useDemoState } from "@/state/DemoState";

const ACCENT = ROLE_ACCENT.contributor;

/**
 * Ported structural pattern from the real app's own pages/Dashboard.tsx
 * (contributor branch) -- welcome banner, 3-up StatGrid, and the same
 * Expert Badges pill row real Dashboard.tsx shows beneath it. Points
 * balance (340) matches ContributorCapture.tsx's own starting balance --
 * the real number already used elsewhere in this demo, not invented here
 * -- but it's this screen's own local snapshot, not live-synced with
 * whatever a presenter does on My Tasks in the same session (this demo
 * has no shared points ledger in DemoState, see its own header comment on
 * what state is/isn't lifted -- disclosed below, not silently assumed).
 */
export function ContributorOverview() {
  const navigate = useNavigate();
  const { contributorBadges } = useDemoState();
  const identity = ROLE_IDENTITY.contributor;

  return (
    <DashboardShell role="contributor">
      <div className="max-w-4xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-2 label-caps" style={{ color: ACCENT }}>Dashboard</div>
        <h1 className="mb-2 font-display text-2xl font-bold text-paper">Welcome, {identity.name}</h1>
        <p className="mb-8 max-w-lg text-[13px] leading-relaxed text-muted">
          Browse campaigns, complete tasks, and earn rewards.
        </p>

        <StatGrid className="mb-8 sm:!grid-cols-3">
          <StatCard label="Tasks Completed" value={0} delta="Across all campaigns" />
          <StatCard label="Points Balance" value={340} delta="Available to redeem" />
          <StatCard label="Per Task" value={`${CONTRIBUTOR_TASK.points} pts`} delta="Sondela Cover's current task" />
        </StatGrid>

        {contributorBadges.length > 0 && (
          <div className="mb-8">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Expert Badges</div>
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {contributorBadges.map((b) => (
                <ExpertBadge key={b.subCategoryId} category={b.subCategoryId} color={ACCENT} size="sm" status={b.status} />
              ))}
            </div>
          </div>
        )}

        <Button color={ACCENT} onClick={() => navigate("/contribute/browse")} className="!rounded-none">
          Browse Campaigns <ArrowRight className="ms-1.5 h-3.5 w-3.5" />
        </Button>
      </div>
    </DashboardShell>
  );
}
