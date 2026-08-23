import { Link } from "react-router-dom";
import { Shield, AlertTriangle, ShieldCheck, Globe } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/Button";
import { StatGrid, StatCard } from "@/components/StatCard";
import { AlertSourceBadge } from "@/components/AlertSourceBadge";
import { REVIEW_QUEUE, riskSignalLabel, COUNTRIES, COMING_SOON_COUNTRIES } from "@/data/demo";
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
    <DashboardShell role="admin" backTo="/operations">
      <div className="max-w-6xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Shield className="h-5 w-5" style={{ color: ACCENT }} />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
              Admin — Fieldwork Controls
            </span>
          </div>
          <Link to="/agency/campaign/sondela-cover" className="text-[13px] text-muted hover:text-paper">
            ← Back to Sondela Cover
          </Link>
        </div>

        <p className="mb-8 max-w-lg text-[13.5px] leading-relaxed text-muted">
          Illustrative platform snapshot — not live production metrics. Pending Verifications and
          Quality Flags Open do move live with whatever's actually happened in Supervisor Review
          this session.
        </p>

        <StatGrid className="mb-9">
          <StatCard label="Active Campaigns" value="4" />
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
        <div className="mb-10 space-y-2.5">
          {flaggedItems.length === 0 ? (
            <div className="rounded border border-line p-6 text-center text-xs text-muted">
              No open alerts. Flag something in Supervisor Review to see it land here.
            </div>
          ) : (
            flaggedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded border border-line p-4">
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-language" />
                    <span className="text-sm font-medium text-paper">{item.campaignClient} · {item.city}</span>
                    {item.riskSignal && <AlertSourceBadge source={item.riskSignal.source} />}
                  </div>
                  <span className="text-xs text-muted">&ldquo;{item.excerpt}&rdquo;</span>
                  {item.riskSignal && (
                    <p className="mt-1 text-[11.5px] text-language">
                      {riskSignalLabel(item.riskSignal.type)} — {item.riskSignal.detail}
                    </p>
                  )}
                </div>
                <Button variant="ghost" color={ACCENT} className="!px-3 !py-1.5 !text-[11px]" onClick={() => resolveFlag(item.id)}>
                  Resolve
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="mb-10 rounded border border-line p-5">
          <div className="mb-1 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" style={{ color: ACCENT }} />
            <h3 className="font-display text-sm font-bold text-paper">Agency Vetting</h3>
          </div>
          <p className="mb-3 text-[13px] text-muted">
            Agencies can't post campaigns until their registration documents clear this same
            approve/reject queue.
          </p>
          <Link to="/operations/admin/agencies" className="text-[13px] font-semibold hover:underline" style={{ color: ACCENT }}>
            Open Agency Verification →
          </Link>
        </div>

        {/* Part D, item 14, admin side -- the same gate Onboarding's
            Country step shows a contributor/agency, from the operator's
            own view. Read-only here (this demo has no real countries
            table to toggle) but genuinely shows the current live/coming-
            soon split, not just a claim in copy. */}
        <div className="rounded border border-line p-5">
          <div className="mb-1 flex items-center gap-2">
            <Globe className="h-4 w-4" style={{ color: ACCENT }} />
            <h3 className="font-display text-sm font-bold text-paper">Markets</h3>
          </div>
          <p className="mb-3 text-[13px] text-muted">
            Live market-by-market, deliberately — not a reach claim ahead of what's actually operated.
          </p>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map((c) => (
              <span key={c} className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em]" style={{ color: "var(--sound)", backgroundColor: "color-mix(in srgb, var(--sound) 14%, transparent)" }}>
                {c} · Live
              </span>
            ))}
            {COMING_SOON_COUNTRIES.map((c) => (
              <span key={c} className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                {c} · Coming Soon
              </span>
            ))}
          </div>
        </div>

        <Link to="/operations/review" className="mt-6 inline-block text-[13px] font-semibold hover:underline" style={{ color: ACCENT }}>
          Go to Supervisor Review →
        </Link>
      </div>
    </DashboardShell>
  );
}
