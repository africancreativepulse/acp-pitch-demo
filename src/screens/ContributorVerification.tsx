import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { IconButton } from "@/components/IconButton";
import { Badge } from "@/components/Badge";
import { StatGrid, StatCard } from "@/components/StatCard";
import { CONTRIBUTOR_VERIFICATION_QUEUE, type BadgeEvidenceEntry } from "@/data/demo";
import { subCategoryLabel } from "@/data/taxonomy";
import { useDemoState, type ContributorVerificationStatus } from "@/state/DemoState";

const ACCENT = "var(--ritual)";

const STATUS_META: Record<ContributorVerificationStatus, { label: string; color: string }> = {
  approved: { label: "approved", color: "var(--sound)" },
  pending: { label: "pending", color: "var(--language)" },
  rejected: { label: "rejected", color: "var(--pulse)" },
};

/**
 * Unified contributor verification (concept sync with tonight's real-app
 * change) -- replaces BadgeVerification.tsx. The real app's own
 * contributor signup is now ONE reviewed submission (identity + every
 * badge picked), not badges reviewed on their own: this queue shows
 * identity + all badges bundled in a single card per contributor, with
 * ONE approve/reject action for the whole thing -- same real gate
 * src/state/DemoState.tsx's decideContributorVerification runs
 * (contributor_identity.status + every contributor_badges row, together).
 *
 * Real connected pipeline, not narration, same as the old BadgeVerification
 * screen this replaces: the Guest Contributor's own live row genuinely
 * reflects what they picked at Onboarding, and approving/rejecting it
 * genuinely flips whether ContributorGate.tsx lets them back into their
 * own dashboard next -- the same live loop SupervisorReview -> AdminOversight
 * already runs for field back-checks.
 */
export function ContributorVerification() {
  const { contributorIdentity, contributorBadges, contributorVerificationStatus, decideContributorVerification } =
    useDemoState();

  const liveRow = {
    id: "live.guest-contributor",
    contributorName: "Guest Contributor (this session)",
    country: contributorIdentity?.country ?? null,
    city: contributorIdentity?.city ?? null,
    language: contributorIdentity?.language ?? null,
    badges: contributorBadges.map((b): BadgeEvidenceEntry => ({ subCategoryId: b.subCategoryId })),
    status: contributorVerificationStatus,
    isLive: true as const,
  };
  const illustrativeRows = CONTRIBUTOR_VERIFICATION_QUEUE.map((c) => ({
    id: c.id,
    contributorName: c.contributorName,
    country: c.country as string | null,
    city: c.city as string | null,
    language: c.language as string | null,
    badges: c.badges,
    status: "pending" as ContributorVerificationStatus,
    isLive: false as const,
  }));
  const rows = [liveRow, ...illustrativeRows];

  // Status only ever becomes "pending" via a real submission
  // (submitContributorApplication always sets identity, and
  // resubmitContributorVerification only ever runs on a row that was
  // already pending/rejected before) -- no extra emptiness guard needed.
  const pending = rows.filter((r) => r.status === "pending");
  const approvedCount = rows.filter((r) => r.status === "approved").length;
  const rejectedCount = rows.filter((r) => r.status === "rejected").length;

  // Illustrative rows have no real DemoState to update -- their own
  // decision is disabled, same disclosed-as-static discipline as
  // AGENCY_VERIFICATION_QUEUE and the old BadgeVerification screen. Only
  // the live Guest Contributor card is genuinely wired: one action here
  // sets contributorVerificationStatus AND cascades every one of their
  // badge rows to match, matching the real unified review action exactly
  // (not a per-badge decision anymore).
  const decide = (status: "approved" | "rejected") => decideContributorVerification(status);

  return (
    <DashboardShell role="admin">
      <div className="max-w-6xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5" style={{ color: ACCENT }} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
            Admin — Contributor Verification
          </span>
        </div>
        <h1 className="mb-2 font-display text-[22px] font-bold text-paper">Contributor Verification</h1>
        <p className="mb-8 max-w-lg text-[13px] leading-relaxed text-muted">
          A contributor's signup is one reviewed submission — identity and every expert badge they picked,
          approved or rejected together, not badge by badge. The Guest Contributor card below is this
          demo's own live session; deciding it genuinely changes whether they can reach their own dashboard next.
        </p>

        <StatGrid className="mb-9">
          <StatCard label="Total Contributors" value={rows.length} />
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
              <div key={r.id} className="mb-3 rounded border border-[rgba(255,201,60,0.3)] bg-[rgba(255,201,60,0.06)] p-4">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-paper">{r.contributorName}</span>
                    <div className="mt-0.5 text-xs text-muted">
                      {r.country ? `${r.country} · ${r.city} · ${r.language}` : "Location not yet provided"}
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <IconButton
                      tone="approve"
                      onClick={() => decide("approved")}
                      disabled={!r.isLive}
                      title={r.isLive ? undefined : "Illustrative row — static demo content, not wired to a decision"}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      tone="reject"
                      onClick={() => decide("rejected")}
                      disabled={!r.isLive}
                      title={r.isLive ? undefined : "Illustrative row — static demo content, not wired to a decision"}
                    >
                      <XCircle className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>

                {r.badges.length > 0 ? (
                  <div className="space-y-1.5 border-t border-[rgba(255,201,60,0.2)] pt-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                      Proof of Expertise ({r.badges.length})
                    </div>
                    {r.badges.map((b) => (
                      <div key={b.subCategoryId} className="text-xs text-muted">
                        <span className="font-medium text-paper">{subCategoryLabel(b.subCategoryId)}</span>
                        {b.socialHandle && <> — Social: {b.socialHandle}</>}
                        {b.experienceNote && <div className="mt-0.5 max-w-lg">{b.experienceNote}</div>}
                        {!b.socialHandle && !b.experienceNote && <span className="text-muted/70"> — No proof of expertise submitted.</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-t border-[rgba(255,201,60,0.2)] pt-3 text-xs text-muted/70">
                    No badges picked — identity submission only.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="overflow-x-auto rounded border border-line">
          <div className="grid min-w-[560px] grid-cols-4 gap-2 border-b border-line bg-panel px-[18px] py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
            <span>Contributor</span><span>Badges</span><span>Status</span><span>Live?</span>
          </div>
          {rows.map((r) => {
            const meta = STATUS_META[r.status];
            return (
              <div key={r.id} className="grid min-w-[560px] items-center gap-2 border-b border-line px-[18px] py-[15px] text-sm last:border-0">
                <span className="truncate font-medium text-paper">{r.contributorName}</span>
                <span className="truncate text-xs text-muted">{r.badges.length}</span>
                <Badge color={meta.color}>{meta.label}</Badge>
                <span className="text-xs text-muted">{r.isLive ? "This session" : "Illustrative"}</span>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
