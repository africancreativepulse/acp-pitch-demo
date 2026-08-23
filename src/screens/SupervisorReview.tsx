import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { StatGrid, StatCard } from "@/components/StatCard";
import { IconButton } from "@/components/IconButton";
import { AlertSourceBadge } from "@/components/AlertSourceBadge";
import { REVIEW_QUEUE, FIELD_WORKER, riskSignalLabel } from "@/data/demo";
import { useDemoState } from "@/state/DemoState";

const ACCENT = "var(--soulgap)";
const TABS = ["team", "review", "alerts"] as const;
type SupervisorTab = (typeof TABS)[number];
// Real tab labels verbatim from fieldwork/SupervisorDashboard.tsx --
// "Weekly Report" (the real fourth tab) is dropped: it's a free-text
// reporting form in the real app, and this demo's whole point is zero
// typing anywhere.
const TAB_LABEL: Record<SupervisorTab, string> = {
  team: "Team Overview",
  review: "Back-Check Queue",
  alerts: "Quality Flags",
};

const METHOD_LABEL: Record<"digital" | "field", string> = {
  digital: "Digital · Contributor app",
  field: "Field · Paper, since synced",
};
const METHOD_COLOR: Record<"digital" | "field", string> = {
  digital: "var(--visual)",
  field: "var(--pulse)",
};

// Illustrative roster for the Team Overview tab -- Thabo M. is the same
// field worker from Field Worker Capture (real narrative continuity, not
// a coincidence), the second is invented for Kasi Brew's own fieldwork.
const ROSTER = [
  { name: FIELD_WORKER.name, campaign: FIELD_WORKER.campaignClient, responses: "12/20", status: "active" as const },
  { name: "Zanele K.", campaign: "Kasi Brew", responses: "8/15", status: "active" as const },
];

/**
 * Ported structural pattern from the real app's fieldwork/
 * SupervisorDashboard.tsx -- accent-rule eyebrow, a 3-up StatGrid, and
 * (the real structural fix) the real page's own tab set: Team Overview /
 * Back-Check Queue / Quality Flags, not one flat un-tabbed list. Back-
 * Check Queue rows now use the real IconButton round approve/reject
 * pattern instead of text pills; Quality Flags is read-only here, exactly
 * matching the real page (only Admin's own Alerts tab gets a Resolve
 * action -- real separation of duties, already how this demo's flagging
 * pipeline was wired before this pass, now visually correct to match).
 */
export function SupervisorReview() {
  const { reviewStatus, setReviewStatus } = useDemoState();
  const [tab, setTab] = useState<SupervisorTab>("review");

  const approved = REVIEW_QUEUE.filter((i) => reviewStatus[i.id] === "approved").length;
  const flagged = REVIEW_QUEUE.filter((i) => reviewStatus[i.id] === "flagged");
  const pending = REVIEW_QUEUE.length - approved - flagged.length;

  return (
    <DashboardShell role="supervisor" backTo="/operations">
      <div className="px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-0.5 w-[30px]" style={{ backgroundColor: ACCENT }} />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
              Supervisor Dashboard
            </span>
          </div>
          <Link to="/agency/campaign/sondela-cover" className="text-[13px] text-muted hover:text-paper">
            ← Back to Sondela Cover
          </Link>
        </div>

        <StatGrid className="mb-9 md:!grid-cols-3">
          <StatCard label="Team Members" value={ROSTER.length} />
          <StatCard label="Approved" value={approved} />
          <StatCard label="Pending Review" value={pending} deltaTone={pending > 0 ? "warn" : "up"} delta={pending > 0 ? "Needs review" : undefined} />
        </StatGrid>

        <div className="mb-8 flex gap-4 border-b border-line">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="pb-3 font-mono text-xs font-medium uppercase tracking-[0.15em] transition-colors"
              style={{ borderBottom: "2px solid", borderColor: tab === t ? ACCENT : "transparent", color: tab === t ? "var(--paper)" : "var(--muted)" }}
            >
              {TAB_LABEL[t]}
              {t === "alerts" && flagged.length > 0 && (
                <span className="ms-1.5 rounded-full px-1.5 py-0.5 font-mono text-[10px]" style={{ backgroundColor: "color-mix(in srgb, var(--pulse) 16%, transparent)", color: "var(--pulse)" }}>
                  {flagged.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "team" && (
          <div className="overflow-x-auto rounded border border-line">
            <div className="grid min-w-[520px] grid-cols-4 gap-2 border-b border-line bg-panel p-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
              <span>Agent</span><span>Campaign</span><span>Responses</span><span>Status</span>
            </div>
            {ROSTER.map((a) => (
              <div key={a.name} className="grid min-w-[520px] grid-cols-4 items-center gap-2 border-b border-line p-3 text-sm last:border-0">
                <span className="flex items-center gap-2 font-medium text-paper">
                  <span className="h-2 w-2 flex-shrink-0 rounded-full bg-sound" />
                  {a.name}
                </span>
                <span className="truncate text-xs text-muted">{a.campaign}</span>
                <span className="text-paper">{a.responses}</span>
                <span
                  className="w-fit rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.06em]"
                  style={{ color: "var(--sound)", backgroundColor: "color-mix(in srgb, var(--sound) 14%, transparent)" }}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "review" && (
          <div className="space-y-2.5">
            {REVIEW_QUEUE.map((item) => {
              const status = reviewStatus[item.id] ?? "pending";
              if (status !== "pending") {
                return (
                  <div key={item.id} className="flex items-center justify-between rounded border border-line p-4">
                    <div>
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-paper">{item.campaignClient} · {item.city}</span>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                          style={{ backgroundColor: `${METHOD_COLOR[item.method]}18`, color: METHOD_COLOR[item.method] }}
                        >
                          {METHOD_LABEL[item.method]}
                        </span>
                        {status === "flagged" && item.riskSignal && <AlertSourceBadge source={item.riskSignal.source} />}
                      </div>
                      <p className="text-xs text-muted">&ldquo;{item.excerpt}&rdquo;</p>
                      {status === "flagged" && item.riskSignal && (
                        <p className="mt-1.5 text-[11.5px]" style={{ color: "var(--pulse)" }}>
                          {riskSignalLabel(item.riskSignal.type)} — {item.riskSignal.detail}
                        </p>
                      )}
                    </div>
                    <span
                      className="shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold"
                      style={status === "approved" ? { color: "#2FBF71", backgroundColor: "#2FBF7118" } : { color: "var(--pulse)", backgroundColor: "color-mix(in srgb, var(--pulse) 14%, transparent)" }}
                    >
                      {status === "approved" ? "✓ Approved" : "⚑ Flagged"}
                    </span>
                  </div>
                );
              }
              return (
                <div key={item.id} className="flex items-center justify-between gap-4 rounded border border-line p-4">
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-paper">{item.campaignClient} · {item.city}</span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                        style={{ backgroundColor: `${METHOD_COLOR[item.method]}18`, color: METHOD_COLOR[item.method] }}
                      >
                        {METHOD_LABEL[item.method]}
                      </span>
                      {item.riskSignal && <AlertSourceBadge source={item.riskSignal.source} />}
                    </div>
                    <p className="text-xs text-muted">&ldquo;{item.excerpt}&rdquo; — Contributor {item.contributorId}</p>
                    {/* Part C, item 9 -- concrete detection reasoning, not
                        a generic "supervisor reviews things" screen. The
                        platform's own hybrid AI + rule-based scan already
                        surfaced this before a human even looked. */}
                    {item.riskSignal ? (
                      <p className="mt-1.5 text-[11.5px]" style={{ color: "var(--pulse)" }}>
                        ⚠ {riskSignalLabel(item.riskSignal.type)} — {item.riskSignal.detail}
                      </p>
                    ) : (
                      <p className="mt-1.5 text-[11.5px] text-muted">No automated flags on this one.</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <IconButton tone="approve" onClick={() => setReviewStatus(item.id, "approved")}>
                      <CheckCircle2 className="h-4 w-4" />
                    </IconButton>
                    <IconButton tone="reject" onClick={() => setReviewStatus(item.id, "flagged")}>
                      <XCircle className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "alerts" && (
          <div className="space-y-2.5">
            {flagged.length === 0 ? (
              <div className="rounded border border-line p-8 text-center text-xs text-muted">No open quality flags for your team.</div>
            ) : (
              flagged.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded border border-line p-4">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
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
                </div>
              ))
            )}
            {flagged.length > 0 && (
              <Link to="/operations/admin" className="mt-4 inline-block text-[13px] font-semibold hover:underline" style={{ color: ACCENT }}>
                Resolved by Admin Oversight →
              </Link>
            )}
          </div>
        )}

        <p className="mt-8 text-[11.5px] leading-relaxed text-muted">
          Illustrative review queue, drawn from Kasi Brew and Tholulwazi Data's portfolio
          entries — not Sondela Cover's own audited evidence.
        </p>
      </div>
    </DashboardShell>
  );
}
