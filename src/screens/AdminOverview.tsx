import { Link } from "react-router-dom";
import { Shield, ShieldCheck, ArrowRight, Users, Languages } from "lucide-react";
import { DashboardShell, ROLE_ACCENT } from "@/components/DashboardShell";
import { StatCard, StatGrid } from "@/components/StatCard";
import {
  SONDELA, KASI_BREW, THOLULWAZI_DATA, MZANSI_WELLNESS,
  REVIEW_QUEUE, AGENCY_VERIFICATION_QUEUE,
  ADMIN_ROLE_ORDER, ADMIN_ROLE_LABEL, ADMIN_ROLE_COUNTS,
  ONBOARDING_LANGUAGES, TRANSLATION_COVERAGE,
} from "@/data/demo";
import { useDemoState } from "@/state/DemoState";

const ACCENT = ROLE_ACCENT.admin;

/**
 * Ported structural pattern from the real app's own pages/admin/
 * AdminOverview.tsx -- a cross-cutting platform summary, genuinely
 * distinct from AdminOversight.tsx (that screen is the real Fieldwork
 * Admin/AdminFieldwork.tsx equivalent -- full tables, in-place actions).
 * This one's job is the same as the real page's: surface what needs
 * attention across the whole platform, with "Review →" links driving into
 * the detailed screens rather than duplicating their tables.
 *
 * Charts (nav/cosmetic audit, deferred bucket item 2): confirmed missing
 * entirely -- Users by Role, Campaign Mix, and Translation Coverage all
 * ported below. Users by Role and Translation Coverage need an invented-
 * but-plausible dataset this demo never modeled (see data/demo.ts's own
 * header comment on ADMIN_ROLE_COUNTS/TRANSLATION_COVERAGE for the full
 * reasoning); Campaign Mix is NOT invented -- it's derived live from the
 * real campaign records already in this file, same as the real page's own
 * "real numbers already fetched" approach.
 *
 * Deliberately NOT ported in this pass: the "Invite a Teammate" dialog
 * (a real feature, but tied to a live Supabase edge function this demo
 * has no backend to call -- a distinct feature decision, not a chart, and
 * out of this pass's own scope) and the Admin Action Log (needs a real
 * actor/timestamp audit trail this demo doesn't model anywhere yet --
 * fabricating one here risks disagreeing with whatever item 5's own
 * AdminFieldwork disputes/alerts rebuild ends up modeling). The "Needs
 * Your Attention" row also stays at its current 2 cards rather than the
 * real page's 5 -- the other 3 (Contributor Verification, Anomaly Alerts,
 * Payment Disputes) need data models that don't exist yet either, and
 * belong with item 5's own AdminFieldwork rebuild instead of being
 * invented twice.
 */
export function AdminOverview() {
  const { draftCampaigns, reviewStatus } = useDemoState();

  const campaigns = [SONDELA, KASI_BREW, THOLULWAZI_DATA, MZANSI_WELLNESS];
  const totalCampaigns = campaigns.length + draftCampaigns.length;
  const totalResponses = campaigns.reduce((sum, c) => sum + c.verifiedResponses, 0);
  const pendingReviews = REVIEW_QUEUE.filter((i) => (reviewStatus[i.id] ?? "pending") === "pending").length;
  const pendingAgencies = AGENCY_VERIFICATION_QUEUE.filter((a) => a.status === "pending").length;

  // Campaign Mix -- real, not invented: "field" is this demo's own closest
  // equivalent to the real app's methodology_type === 'field' flag (a
  // methodology of "Field Only" is field-run; "Digital Only" and "Digital
  // + Field Hybrid" both still have an agency directing them digitally,
  // same as the real classification's own agency/fieldwork split).
  const fieldCount = campaigns.filter((c) => c.methodology === "Field Only").length;
  const agencyCount = campaigns.length - fieldCount;
  const maxRoleCount = Math.max(1, ...ADMIN_ROLE_ORDER.map((r) => ADMIN_ROLE_COUNTS[r]));
  const totalUsers = ADMIN_ROLE_ORDER.reduce((sum, r) => sum + ADMIN_ROLE_COUNTS[r], 0);

  const avgCoverage = Math.round(
    ONBOARDING_LANGUAGES.reduce((sum, lang) => sum + (TRANSLATION_COVERAGE[lang] ?? 90), 0) / ONBOARDING_LANGUAGES.length,
  );
  const lowestCoverageLang = ONBOARDING_LANGUAGES.reduce((min, lang) =>
    (TRANSLATION_COVERAGE[lang] ?? 90) < (TRANSLATION_COVERAGE[min] ?? 90) ? lang : min,
  );

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
        <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
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

        <div className="mb-10 grid gap-3.5 lg:grid-cols-2">
          <div className="rounded-lg border border-line p-5 sm:p-6">
            <div className="mb-1 flex items-center gap-2 font-display text-sm font-bold text-paper"><Users className="h-4 w-4 text-muted" /> Users by Role</div>
            <p className="mb-5 text-xs text-muted">Registered accounts, all roles · {totalUsers} total</p>
            <div className="space-y-3">
              {ADMIN_ROLE_ORDER.map((role) => {
                const count = ADMIN_ROLE_COUNTS[role];
                return (
                  <div key={role} className="flex items-center gap-3">
                    <span className="h-2 w-2 flex-shrink-0 rounded-sm" style={{ backgroundColor: ROLE_ACCENT[role] }} />
                    <span className="w-24 flex-shrink-0 text-[13px] text-paper">{ADMIN_ROLE_LABEL[role]}</span>
                    <span className="h-[5px] flex-1 overflow-hidden rounded-full bg-line">
                      <span className="block h-full rounded-full" style={{ width: `${(count / maxRoleCount) * 100}%`, backgroundColor: ROLE_ACCENT[role] }} />
                    </span>
                    <span className="w-8 flex-shrink-0 text-end font-mono text-[12.5px] text-muted">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-line p-5 sm:p-6">
            <div className="mb-1 font-display text-sm font-bold text-paper">Campaign Mix</div>
            <p className="mb-5 text-xs text-muted">Agency/digital vs. fieldwork, all statuses</p>
            <div className="mb-3 flex h-[22px] overflow-hidden rounded-md bg-line">
              {campaigns.length > 0 && (
                <>
                  <span style={{ width: `${(agencyCount / campaigns.length) * 100}%`, backgroundColor: "var(--visual)" }} />
                  <span style={{ width: `${(fieldCount / campaigns.length) * 100}%`, backgroundColor: "var(--soulgap)" }} />
                </>
              )}
            </div>
            <div className="mb-5 flex gap-5 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: "var(--visual)" }} />Agency/digital · {agencyCount}</span>
              <span className="inline-flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: "var(--soulgap)" }} />Fieldwork · {fieldCount}</span>
            </div>
            <div className="flex gap-5 border-t border-line pt-4 text-[12.5px] text-muted">
              <span>Collecting <b className="font-mono text-paper">{campaigns.filter((c) => c.status === "collecting").length + draftCampaigns.length}</b></span>
              <span>Completed <b className="font-mono text-paper">{campaigns.filter((c) => c.status === "completed").length}</b></span>
            </div>
          </div>
        </div>

        <div className="mb-10 flex flex-col items-start gap-5 rounded-lg border border-line p-5 sm:flex-row sm:items-center sm:p-6">
          <div
            className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full"
            style={{ background: `conic-gradient(var(--sound) 0% ${avgCoverage}%, var(--line) ${avgCoverage}% 100%)` }}
          >
            <div className="absolute inset-[6px] flex items-center justify-center rounded-full bg-panel font-mono text-sm font-semibold text-paper">{avgCoverage}%</div>
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2 font-display text-sm font-bold text-paper"><Languages className="h-4 w-4 text-muted" /> Translation Coverage</div>
            <p className="text-xs text-muted">Avg. across {ONBOARDING_LANGUAGES.length} languages · illustrative, no translated copy behind it in this demo</p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="font-mono text-[11px] text-language">{lowestCoverageLang} lowest · {TRANSLATION_COVERAGE[lowestCoverageLang]}%</span>
            <Link to="/operations/admin/translation-qa" className="flex items-center gap-1 text-[11px]" style={{ color: ACCENT }}>
              Manage in Translation QA <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div>
          <h2 className="mb-3.5 font-display text-base font-bold text-paper">Recent Campaigns</h2>
          <div className="overflow-hidden rounded-lg border border-line">
            {campaigns.map((c, i) => (
              <div key={c.id} className={`flex items-center justify-between gap-4 p-4 ${i > 0 ? "border-t border-line" : ""}`}>
                <span className="min-w-0 flex-1 truncate text-sm text-paper">{c.client}</span>
                <span
                  className="flex-shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em]"
                  style={c.methodology === "Field Only"
                    ? { color: "var(--soulgap)", backgroundColor: "color-mix(in srgb, var(--soulgap) 14%, transparent)" }
                    : { color: "var(--visual)", backgroundColor: "color-mix(in srgb, var(--visual) 14%, transparent)" }}
                >
                  {c.methodology === "Field Only" ? "Fieldwork" : "Agency"}
                </span>
                <span
                  className="flex-shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.06em]"
                  style={
                    c.status === "collecting"
                      ? { color: "var(--sound)", backgroundColor: "color-mix(in srgb, var(--sound) 14%, transparent)" }
                      : { color: "var(--muted)", backgroundColor: "color-mix(in srgb, var(--muted) 14%, transparent)" }
                  }
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
