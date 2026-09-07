import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { IconButton } from "@/components/IconButton";
import { Badge } from "@/components/Badge";
import { StatGrid, StatCard } from "@/components/StatCard";
import { AGENCY_VERIFICATION_QUEUE } from "@/data/demo";
import { useDemoState, type AgencyVerificationStatus } from "@/state/DemoState";

const ACCENT = "var(--ritual)";

const STATUS_META: Record<AgencyVerificationStatus, { label: string; color: string }> = {
  verified: { label: "verified", color: "var(--sound)" },
  pending: { label: "pending", color: "var(--language)" },
  rejected: { label: "rejected", color: "var(--pulse)" },
};

/**
 * Full real-app parity build (Track C, tonight's agency-verification-depth
 * session) -- replaces the old static-only queue. Same restructure
 * ContributorVerification.tsx already proved: a live row genuinely backed
 * by DemoState (agencyProfile + agencyVerificationStatus, set at
 * Onboarding's real submit -- see Onboarding.tsx's own header comment on
 * the confirmation-timing fix), layered alongside AGENCY_VERIFICATION_QUEUE's
 * existing static illustrative rows (Ndoni Creative/Bright Horizon Media/
 * Lagos Pulse Collective), which keep their own fixed status and disabled
 * decision buttons -- same disclosed-as-static discipline
 * ContributorVerification.tsx already established, not a new convention.
 *
 * Approving/rejecting the live row genuinely flips whether AgencyGate.tsx
 * lets that session back into its own dashboard next -- the same live
 * reactive-unlock loop the contributor pipeline already runs.
 */
export function AgencyVerification() {
  const { agencyProfile, agencyVerificationStatus, decideAgencyVerification } = useDemoState();

  // Real gap closed: this used to show only Company Name/City/Document --
  // now shows the full profile bundle the real app's own now-expanded
  // agency_profiles actually holds. Live row's display name is the actual
  // tapped Company Name once a real submission exists, falling back to a
  // generic session label beforehand (mirrors ContributorVerification's own
  // pre-submission "Guest Contributor (this session)" fallback). Named
  // distinctly from "Ndoni Creative" (an existing static row, already
  // verified) on purpose -- this represents a brand-new prospective agency
  // going through Onboarding fresh, not that same persona.
  const liveRow = {
    id: "live.agency-session",
    name: agencyProfile ? agencyProfile.companyName : "New Agency Signup (this session)",
    city: agencyProfile?.city ?? null,
    workEmail: agencyProfile?.workEmail ?? null,
    registrationNumber: agencyProfile?.registrationNumber ?? null,
    vatNumber: agencyProfile?.vatNumber ?? null,
    businessAddress: agencyProfile?.businessAddress ?? null,
    website: agencyProfile?.website ?? null,
    linkedinUrl: agencyProfile?.linkedinUrl ?? null,
    phoneNumber: agencyProfile?.phoneNumber ?? null,
    primaryContactFirstName: agencyProfile?.primaryContactFirstName ?? null,
    primaryContactSurname: agencyProfile?.primaryContactSurname ?? null,
    primaryContactRole: agencyProfile?.primaryContactRole ?? null,
    documentLabel: agencyProfile?.docUploaded ? "Registration document (illustrative upload)" : null,
    status: agencyVerificationStatus,
    isLive: true as const,
  };
  const illustrativeRows = AGENCY_VERIFICATION_QUEUE.map((a) => ({
    id: a.id,
    name: a.name,
    city: a.city as string | null,
    workEmail: a.workEmail as string | null,
    registrationNumber: a.registrationNumber as string | null,
    vatNumber: a.vatNumber as string | null,
    businessAddress: a.businessAddress as string | null,
    website: a.website as string | null,
    linkedinUrl: a.linkedinUrl as string | null,
    phoneNumber: a.phoneNumber as string | null,
    primaryContactFirstName: a.primaryContactFirstName as string | null,
    primaryContactSurname: a.primaryContactSurname as string | null,
    primaryContactRole: a.primaryContactRole as string | null,
    documentLabel: a.documentLabel as string | null,
    status: a.status,
    isLive: false as const,
  }));
  const rows = [liveRow, ...illustrativeRows];

  // Status only ever becomes "pending" via a real submission
  // (submitAgencyApplication always sets it) -- no extra emptiness guard
  // needed, same reasoning ContributorVerification.tsx's own comment gives.
  const pending = rows.filter((r) => r.status === "pending");
  const verifiedCount = rows.filter((r) => r.status === "verified").length;
  const rejectedCount = rows.filter((r) => r.status === "rejected").length;

  // Illustrative rows have no real DemoState to update -- their own
  // decision is disabled, same disclosed-as-static discipline as
  // ContributorVerification.tsx. Only the live row is genuinely wired.
  const decide = (status: "verified" | "rejected") => decideAgencyVerification(status);

  const tableHead = "grid min-w-[560px] grid-cols-4 gap-2 border-b border-line bg-panel px-[18px] py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted";
  const tableRow = "grid min-w-[560px] items-center gap-2 border-b border-line px-[18px] py-[15px] text-sm last:border-0";

  return (
    <DashboardShell role="admin">
      <div className="max-w-6xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5" style={{ color: ACCENT }} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
            Admin — Agency Verification
          </span>
        </div>
        <h1 className="mb-2 font-display text-[22px] font-bold text-paper">Agency Verification</h1>
        <p className="mb-5 max-w-lg text-[13px] leading-relaxed text-muted">
          Every agency goes through document verification before their campaigns can go live —
          the live session below is this demo's own real signup; deciding it genuinely changes
          whether that session can reach its own dashboard next. Bright Horizon Media and Lagos
          Pulse Collective are static illustrative pending entries; Ndoni Creative already cleared
          this gate.
        </p>

        <StatGrid className="mb-9">
          <StatCard label="Total Agencies" value={rows.length} />
          <StatCard label="Pending Review" value={pending.length} deltaTone={pending.length > 0 ? "warn" : "up"} delta={pending.length > 0 ? "Needs review" : undefined} />
          <StatCard label="Verified" value={verifiedCount} />
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
                    <span className="font-medium text-paper">{r.name}</span>
                    <div className="mt-0.5 text-xs text-muted">{r.city || "No city provided"}</div>
                    <div className="text-xs text-muted">{r.workEmail || "No work email provided"}</div>
                    <div className="text-xs text-muted">{r.documentLabel || "No document uploaded"}</div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <IconButton
                      tone="approve"
                      onClick={() => decide("verified")}
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

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-[rgba(255,201,60,0.2)] pt-3 sm:grid-cols-3">
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">Registration No.</div>
                    <div className="text-xs text-paper">{r.registrationNumber || "—"}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">VAT No.</div>
                    <div className="text-xs text-paper">{r.vatNumber || "—"}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">Phone</div>
                    <div className="text-xs text-paper">{r.phoneNumber || "—"}</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">Business Address</div>
                    <div className="text-xs text-paper">{r.businessAddress || "—"}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">Website</div>
                    <div className="text-xs text-paper">{r.website || "—"}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">LinkedIn</div>
                    <div className="text-xs text-paper">{r.linkedinUrl || "—"}</div>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">Primary Contact</div>
                    <div className="text-xs text-paper">
                      {r.primaryContactFirstName || r.primaryContactSurname
                        ? `${r.primaryContactFirstName ?? ""} ${r.primaryContactSurname ?? ""}`.trim()
                        : "—"}
                      {r.primaryContactRole ? ` — ${r.primaryContactRole}` : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="overflow-x-auto rounded border border-line">
          <div className={tableHead}>
            <span>Agency</span><span>Document</span><span>Status</span><span>Live?</span>
          </div>
          {rows.map((r) => {
            const meta = STATUS_META[r.status];
            return (
              <div key={r.id} className={tableRow}>
                <span className="truncate font-medium text-paper">{r.name}</span>
                <span className="truncate text-xs text-muted">{r.documentLabel || "—"}</span>
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
