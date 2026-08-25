import { Link } from "react-router-dom";
import { Shield, ShieldCheck, ArrowRight } from "lucide-react";
import { DashboardShell, ROLE_ACCENT } from "@/components/DashboardShell";
import { StatCard, StatGrid } from "@/components/StatCard";
import { SONDELA, KASI_BREW, THOLULWAZI_DATA, MZANSI_WELLNESS, REVIEW_QUEUE, AGENCY_VERIFICATION_QUEUE } from "@/data/demo";
import { useDemoState } from "@/state/DemoState";

const ACCENT = ROLE_ACCENT.admin;

/**
 * Ported structural pattern from the real app's own pages/admin/
 * AdminOverview.tsx -- a cross-cutting platform summary, genuinely
 * distinct from AdminOversight.tsx (that screen is the real Fieldwork
 * Admin/AdminFieldwork.tsx equivalent -- full tables, in-place actions).
 * This one's job is the same as the real page's: surface what needs
 * attention across the whole platform, with "Review →" links driving into
 * the detailed screens rather than duplicating their tables. Real numbers
 * throughout -- every count below is computed from data that already
 * exists elsewhere in this demo (REVIEW_QUEUE/reviewStatus,
 * AGENCY_VERIFICATION_QUEUE, the same campaign records AgencyCommand.tsx's
 * own admin view lists), not new invented stats.
 */
export function AdminOverview() {
  const { draftCampaigns, reviewStatus } = useDemoState();

  const campaigns = [SONDELA, KASI_BREW, THOLULWAZI_DATA, MZANSI_WELLNESS];
  const totalCampaigns = campaigns.length + draftCampaigns.length;
  const totalResponses = campaigns.reduce((sum, c) => sum + c.verifiedResponses, 0);
  const pendingReviews = REVIEW_QUEUE.filter((i) => (reviewStatus[i.id] ?? "pending") === "pending").length;
  const pendingAgencies = AGENCY_VERIFICATION_QUEUE.filter((a) => a.status === "pending").length;

  return (
    <DashboardShell role="admin">
      <div className="max-w-4xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex items-center gap-2.5">
          <Shield className="h-5 w-5" style={{ color: ACCENT }} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
            Admin — Platform Overview
          </span>
        </div>
        <h1 className="mb-2 font-display text-[22px] font-bold text-paper">Platform Overview</h1>
        <p className="mb-8 max-w-lg text-[13px] leading-relaxed text-muted">
          Cross-role activity, pending work, and platform health at a glance.
        </p>

        <StatGrid className="mb-10">
          <StatCard label="Campaigns" value={totalCampaigns} />
          <StatCard label="Verified Responses" value={totalResponses.toLocaleString()} />
          <StatCard label="Pending Reviews" value={pendingReviews} deltaTone={pendingReviews > 0 ? "warn" : "up"} />
          <StatCard label="Pending Agencies" value={pendingAgencies} deltaTone={pendingAgencies > 0 ? "warn" : "up"} />
        </StatGrid>

        <div className="mb-4 font-display text-base font-bold text-paper">Needs Your Attention</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            to="/operations/admin"
            className="rounded border p-4 transition-colors hover:bg-panel"
            style={{ borderColor: pendingReviews > 0 ? "rgba(232,160,32,0.4)" : "var(--line)" }}
          >
            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Back-Check Queue</div>
            <div className="mb-3 font-display text-2xl font-bold text-paper">{pendingReviews}</div>
            <div className="flex items-center gap-1 text-[12px]" style={{ color: ACCENT }}>
              Review in Fieldwork Admin <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
          <Link
            to="/operations/admin/agencies"
            className="rounded border p-4 transition-colors hover:bg-panel"
            style={{ borderColor: pendingAgencies > 0 ? "rgba(232,160,32,0.4)" : "var(--line)" }}
          >
            <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
              <ShieldCheck className="h-3 w-3" /> Agency Verification
            </div>
            <div className="mb-3 font-display text-2xl font-bold text-paper">{pendingAgencies}</div>
            <div className="flex items-center gap-1 text-[12px]" style={{ color: ACCENT }}>
              Review in Agency Verification <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
