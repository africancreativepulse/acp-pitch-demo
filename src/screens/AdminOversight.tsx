import { Link } from "react-router-dom";
import { Shield, AlertTriangle } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/Button";
import { StatGrid, StatCard } from "@/components/StatCard";
import { REVIEW_QUEUE } from "@/data/demo";
import { useDemoState } from "@/state/DemoState";

const ACCENT = "var(--ritual)";

/**
 * Ported structural pattern from the real app's fieldwork/
 * AdminFieldwork.tsx -- a Shield icon + eyebrow header (that page's own
 * variation on the accent-rule convention every other real dashboard page
 * uses), the real 4-up StatGrid, and its "alerts" tab's exact row shape:
 * plain `rounded border border-line p-4` rows (NOT amber-tinted -- that
 * treatment is reserved in the real page for Verification Queue/Aging
 * Payments specifically) with a ghost "Resolve" Button, not a solid
 * colored pill.
 */
export function AdminOversight() {
  const { reviewStatus, setReviewStatus } = useDemoState();

  const pendingCount = REVIEW_QUEUE.filter((i) => (reviewStatus[i.id] ?? "pending") === "pending").length;
  const flaggedItems = REVIEW_QUEUE.filter((i) => reviewStatus[i.id] === "flagged");

  const resolveFlag = (id: string) => setReviewStatus(id, "approved");

  return (
    <DashboardShell role="admin">
      <div className="px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex items-center gap-2.5">
          <Shield className="h-5 w-5" style={{ color: ACCENT }} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
            Admin — Fieldwork Controls
          </span>
        </div>

        <p className="mb-8 max-w-lg text-[13.5px] leading-relaxed text-muted">
          Illustrative platform snapshot — not live production metrics. Pending Verifications and
          Quality Flags Open do move live with whatever's actually happened in Supervisor Review
          this session.
        </p>

        <StatGrid className="mb-9">
          <StatCard label="Active Campaigns" value="3" />
          <StatCard label="Pending Verifications" value={pendingCount} />
          <StatCard
            label="Quality Flags Open"
            value={flaggedItems.length}
            deltaTone={flaggedItems.length > 0 ? "warn" : "up"}
            delta={flaggedItems.length > 0 ? "Needs review" : undefined}
          />
          <StatCard label="Field Workers Today" value="6" />
        </StatGrid>

        <h2 className="mb-4 font-display text-base font-bold text-paper">Quality Flags</h2>
        <div className="space-y-2.5">
          {flaggedItems.length === 0 ? (
            <div className="rounded border border-line p-6 text-center text-xs text-muted">
              No open alerts. Flag something in Supervisor Review to see it land here.
            </div>
          ) : (
            flaggedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded border border-line p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-language" />
                    <span className="text-sm font-medium text-paper">{item.campaignClient} · {item.city}</span>
                  </div>
                  <span className="text-xs text-muted">&ldquo;{item.excerpt}&rdquo;</span>
                </div>
                <Button variant="ghost" color={ACCENT} className="!px-3 !py-1.5 !text-[11px]" onClick={() => resolveFlag(item.id)}>
                  Resolve
                </Button>
              </div>
            ))
          )}
        </div>

        <Link to="/operations/review" className="mt-6 inline-block text-[13px] font-semibold hover:underline" style={{ color: ACCENT }}>
          Go to Supervisor Review →
        </Link>
      </div>
    </DashboardShell>
  );
}
