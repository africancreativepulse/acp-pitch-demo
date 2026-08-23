import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { IconButton } from "@/components/IconButton";
import { AGENCY_VERIFICATION_QUEUE, type VerificationStatus } from "@/data/demo";

const ACCENT = "var(--ritual)";

const STATUS_META: Record<VerificationStatus, { label: string; color: string }> = {
  verified: { label: "verified", color: "var(--sound)" },
  pending: { label: "pending", color: "var(--language)" },
  rejected: { label: "rejected", color: "var(--pulse)" },
};

/**
 * Ported structural pattern from the real app's own admin/
 * AgencyVerification.tsx -- a document-verification queue, same
 * IconButton approve/reject pair used across every real admin queue in
 * this demo (Field Worker verification, quality flags). Agencies can't
 * post campaigns until this gate clears; Ndoni Creative (this demo's own
 * agency persona) is already verified, matching that they're already
 * operating a live campaign elsewhere in the demo.
 */
export function AgencyVerification() {
  const [statuses, setStatuses] = useState<Record<string, VerificationStatus>>(
    Object.fromEntries(AGENCY_VERIFICATION_QUEUE.map((a) => [a.id, a.status]))
  );

  const decide = (id: string, status: VerificationStatus) => setStatuses((prev) => ({ ...prev, [id]: status }));

  return (
    <DashboardShell role="admin">
      <div className="px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex items-center gap-2.5">
          <div className="h-0.5 w-[30px]" style={{ backgroundColor: ACCENT }} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
            Admin — Agency Verification
          </span>
        </div>
        <h1 className="mb-2 font-display text-[22px] font-bold text-paper">Agency Verification</h1>
        <p className="mb-8 max-w-lg text-[13px] leading-relaxed text-muted">
          Every agency goes through document verification before their campaigns can go live —
          Ndoni Creative already cleared this gate; the two below are illustrative pending entries.
        </p>

        <div className="overflow-x-auto rounded border border-line">
          <div className="grid min-w-[640px] grid-cols-4 gap-2 border-b border-line bg-panel p-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
            <span>Agency</span><span>Document</span><span>Status</span><span>Action</span>
          </div>
          {AGENCY_VERIFICATION_QUEUE.map((a) => {
            const status = statuses[a.id];
            const meta = STATUS_META[status];
            return (
              <div key={a.id} className="grid min-w-[640px] items-center gap-2 border-b border-line p-3 text-sm last:border-0 grid-cols-4">
                <div>
                  <span className="font-medium text-paper">{a.name}</span>
                  <div className="mt-0.5 text-[11px] text-muted">{a.city}</div>
                </div>
                <span className="text-xs text-muted">{a.documentLabel}</span>
                <span
                  className="w-fit rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.06em]"
                  style={{ color: meta.color, backgroundColor: `color-mix(in srgb, ${meta.color} 14%, transparent)` }}
                >
                  {meta.label}
                </span>
                {status === "pending" ? (
                  <div className="flex items-center gap-2">
                    <IconButton tone="approve" onClick={() => decide(a.id, "verified")}>
                      <CheckCircle2 className="h-4 w-4" />
                    </IconButton>
                    <IconButton tone="reject" onClick={() => decide(a.id, "rejected")}>
                      <XCircle className="h-4 w-4" />
                    </IconButton>
                  </div>
                ) : (
                  <span className="text-xs text-muted">—</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
