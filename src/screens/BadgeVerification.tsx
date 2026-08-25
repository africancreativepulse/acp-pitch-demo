import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { IconButton } from "@/components/IconButton";
import { Badge } from "@/components/Badge";
import { StatGrid, StatCard } from "@/components/StatCard";
import { BADGE_REVIEW_QUEUE } from "@/data/demo";
import { subCategoryLabel } from "@/data/taxonomy";
import { useDemoState, type BadgeStatus } from "@/state/DemoState";

const ACCENT = "var(--ritual)";

const STATUS_META: Record<BadgeStatus, { label: string; color: string }> = {
  approved: { label: "approved", color: "var(--sound)" },
  pending: { label: "pending", color: "var(--language)" },
  rejected: { label: "rejected", color: "var(--pulse)" },
};

/**
 * Taxonomy expansion sync (Part 2) -- Badge Verification, the real
 * pending-badge review workflow the live app's own admin/BadgeVerification.tsx
 * runs (contributor_badges.status: pending by default, invisible to
 * campaign-matching until approved/rejected here). Deliberately deferred
 * from Part 1's navigation-parity pass rather than stubbed twice -- same
 * IconButton approve/reject queue-then-table pattern this demo's own
 * AgencyVerification.tsx already established for a different real gate.
 *
 * Real connected pipeline, not narration: the illustrative
 * BADGE_REVIEW_QUEUE rows (other contributors) sit alongside this demo's
 * own live Guest Contributor badges from DemoState -- approving one of the
 * Guest Contributor's own pending rows here genuinely flips what Browse/
 * ContributorCapture show them next, the same live loop
 * SupervisorReview -> AdminOversight already runs for field back-checks.
 */
export function BadgeVerification() {
  const { contributorBadges, setBadgeStatus } = useDemoState();

  const liveRows = contributorBadges.map((b) => ({
    id: `live.${b.subCategoryId}`,
    contributorName: "Guest Contributor (this session)",
    subCategoryId: b.subCategoryId,
    status: b.status,
    isLive: true as const,
  }));
  const illustrativeRows = BADGE_REVIEW_QUEUE.map((r) => ({
    id: r.id,
    contributorName: r.contributorName,
    subCategoryId: r.subCategoryId,
    socialHandle: r.socialHandle,
    experienceNote: r.experienceNote,
    status: "pending" as BadgeStatus,
    isLive: false as const,
  }));
  const rows = [...liveRows, ...illustrativeRows];

  const pending = rows.filter((r) => r.status === "pending");
  const approvedCount = rows.filter((r) => r.status === "approved").length;
  const rejectedCount = rows.filter((r) => r.status === "rejected").length;

  // Illustrative rows have no real DemoState to update -- their own review
  // action is local-only (can't be, since this component has no local
  // state for them and the underlying static array is deliberately never
  // mutated, same "static content stays static" discipline as
  // AGENCY_VERIFICATION_QUEUE). Only the live Guest Contributor row is a
  // genuinely wired decision; illustrative rows' buttons are present for
  // visual completeness of the queue shape but disclosed as such.
  const decide = (subCategoryId: string, status: BadgeStatus) => setBadgeStatus(subCategoryId, status);

  return (
    <DashboardShell role="admin">
      <div className="max-w-6xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5" style={{ color: ACCENT }} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
            Admin — Badge Verification
          </span>
        </div>
        <h1 className="mb-2 font-display text-[22px] font-bold text-paper">Badge Verification</h1>
        <p className="mb-8 max-w-lg text-[13px] leading-relaxed text-muted">
          A contributor's expert badge is pending by default and doesn't affect campaign matching until
          approved here — same real gate the live platform runs. The Guest Contributor row below is this
          demo's own live session; approving or rejecting it genuinely changes what Browse shows next.
        </p>

        <StatGrid className="mb-9">
          <StatCard label="Total Badges" value={rows.length} />
          <StatCard label="Pending Review" value={pending.length} deltaTone={pending.length > 0 ? "warn" : "up"} delta={pending.length > 0 ? "Needs review" : undefined} />
          <StatCard label="Approved" value={approvedCount} />
          <StatCard label="Rejected" value={rejectedCount} />
        </StatGrid>

        {pending.length > 0 && (
          <div className="mb-6">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--language)" }}>
              Verification Queue ({pending.length})
            </div>
            {pending.map((r) => (
              <div key={r.id} className="mb-2 rounded border border-[rgba(255,201,60,0.3)] bg-[rgba(255,201,60,0.06)] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-paper">{r.contributorName}</span>
                    <span className="ms-2 text-xs text-muted">{subCategoryLabel(r.subCategoryId)}</span>
                    {"socialHandle" in r && (r.socialHandle || r.experienceNote) ? (
                      <div className="mt-1.5 space-y-0.5 text-xs text-muted">
                        {r.socialHandle && <div>Social: {r.socialHandle}</div>}
                        {r.experienceNote && <div className="max-w-lg">{r.experienceNote}</div>}
                      </div>
                    ) : (
                      <div className="mt-1.5 text-xs text-muted/70">No proof of expertise submitted.</div>
                    )}
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <IconButton tone="approve" onClick={() => decide(r.subCategoryId, "approved")} disabled={!r.isLive} title={r.isLive ? undefined : "Illustrative row — static demo content, not wired to a decision"}>
                      <CheckCircle2 className="h-4 w-4" />
                    </IconButton>
                    <IconButton tone="reject" onClick={() => decide(r.subCategoryId, "rejected")} disabled={!r.isLive} title={r.isLive ? undefined : "Illustrative row — static demo content, not wired to a decision"}>
                      <XCircle className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="overflow-x-auto rounded border border-line">
          <div className="grid min-w-[560px] grid-cols-4 gap-2 border-b border-line bg-panel px-[18px] py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
            <span>Contributor</span><span>Badge</span><span>Status</span><span>Live?</span>
          </div>
          {rows.map((r) => {
            const meta = STATUS_META[r.status];
            return (
              <div key={r.id} className="grid min-w-[560px] items-center gap-2 border-b border-line px-[18px] py-[15px] text-sm last:border-0">
                <span className="truncate font-medium text-paper">{r.contributorName}</span>
                <span className="truncate text-xs text-muted">{subCategoryLabel(r.subCategoryId)}</span>
                <Badge color={meta.color}>{meta.label}</Badge>
                <span className="text-xs text-muted">{r.isLive ? "This session" : "Illustrative"}</span>
              </div>
            );
          })}
          {rows.length === 0 && <div className="p-6 text-center text-xs text-muted">No badges submitted yet.</div>}
        </div>
      </div>
    </DashboardShell>
  );
}
