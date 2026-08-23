import { Link } from "react-router-dom";
import { AcpLogo } from "@/components/AcpLogo";
import { REVIEW_QUEUE, type ReviewStatus } from "@/data/demo";
import { useDemoState } from "@/state/DemoState";

const ACCENT = "var(--soulgap)"; // matches the real app's supervisor role accent

const STATUS_LABEL: Record<ReviewStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  flagged: "Flagged for follow-up",
};

const STATUS_COLOR: Record<ReviewStatus, string> = {
  pending: "var(--muted)",
  approved: "#2FBF71",
  flagged: "var(--pulse)",
};

const METHOD_LABEL: Record<"digital" | "field", string> = {
  digital: "Digital · Contributor app",
  field: "Field · Paper, since synced",
};

const METHOD_COLOR: Record<"digital" | "field", string> = {
  digital: "var(--visual)",
  field: "var(--pulse)",
};

// The back-check every "Verified — GPS + supervisor back-check" badge in
// The Evidence actually refers to. Reads a sample review queue (Kasi Brew
// / Tholulwazi Data submissions, both digital and field-sourced) and lets
// a supervisor approve or flag each one -- real shared state (DemoState),
// not narration: whatever gets flagged here shows up in Admin Oversight's
// own queue.
export function SupervisorReview() {
  const { reviewStatus, setReviewStatus } = useDemoState();

  const approved = REVIEW_QUEUE.filter((i) => reviewStatus[i.id] === "approved").length;
  const flagged = REVIEW_QUEUE.filter((i) => reviewStatus[i.id] === "flagged").length;
  const pending = REVIEW_QUEUE.length - approved - flagged;

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-line px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <AcpLogo markClassName="h-6 w-6" textClassName="text-xs" />
          <Link to="/operations" className="text-[13px] text-muted hover:text-paper">← Operations</Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-2 label-caps" style={{ color: ACCENT }}>Supervisor Review</div>
        <h1 className="mb-2 font-display text-2xl font-bold text-paper">Quality Back-Check</h1>
        <p className="mb-6 max-w-lg text-[13.5px] leading-relaxed text-muted">
          A sample of submitted responses across the portfolio, both digital and field-sourced.
          Nothing counts as &ldquo;Verified&rdquo; until a supervisor has actually looked at it.
        </p>

        <div className="mb-7 flex gap-4 text-[12.5px]">
          <span className="tabular text-paper">{approved} approved</span>
          <span className="tabular text-pulse">{flagged} flagged</span>
          <span className="tabular text-muted">{pending} pending</span>
        </div>

        <div className="space-y-4">
          {REVIEW_QUEUE.map((item) => {
            const status = reviewStatus[item.id] ?? "pending";
            return (
              <div key={item.id} className="card-surface p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="label-caps">{item.campaignClient}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                    style={{ backgroundColor: `${METHOD_COLOR[item.method]}18`, color: METHOD_COLOR[item.method] }}
                  >
                    {METHOD_LABEL[item.method]}
                  </span>
                </div>

                <p className="font-display text-[16px] font-medium leading-snug text-paper">
                  &ldquo;{item.excerpt}&rdquo;
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-muted">
                  <span>{item.city}</span>
                  <span>Contributor {item.contributorId}</span>
                </div>

                <div className="mt-4 flex items-center gap-3 border-t border-line pt-3.5">
                  {status === "pending" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setReviewStatus(item.id, "approved")}
                        className="rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold"
                        style={{ backgroundColor: "#2FBF7122", color: "#2FBF71" }}
                      >
                        ✓ Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => setReviewStatus(item.id, "flagged")}
                        className="rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold"
                        style={{ backgroundColor: "color-mix(in srgb, var(--pulse) 15%, transparent)", color: "var(--pulse)" }}
                      >
                        ⚑ Flag
                      </button>
                    </>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold"
                      style={{ backgroundColor: `${STATUS_COLOR[status]}18`, color: STATUS_COLOR[status] }}
                    >
                      {status === "approved" ? "✓" : "⚑"} {STATUS_LABEL[status]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {flagged > 0 && (
          <Link to="/operations/admin" className="mt-8 inline-block text-[13px] font-semibold hover:underline" style={{ color: ACCENT }}>
            {flagged} item{flagged === 1 ? "" : "s"} escalated to Admin Oversight →
          </Link>
        )}

        <p className="mt-8 text-[11.5px] leading-relaxed text-muted">
          Illustrative review queue, drawn from Kasi Brew and Tholulwazi Data's portfolio
          entries — not Sondela Cover's own audited evidence.
        </p>
      </main>
    </div>
  );
}
