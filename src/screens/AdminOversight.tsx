import { Link } from "react-router-dom";
import { AcpLogo } from "@/components/AcpLogo";
import { REVIEW_QUEUE } from "@/data/demo";
import { useDemoState } from "@/state/DemoState";

const ACCENT = "var(--ritual)"; // matches the real app's admin role accent

// A glimpse of the platform-wide operational layer, not a full admin
// panel -- verification counts and a quality-flags queue, enough to read
// as "this is a real, operated platform" without pretending to be
// exhaustive. Two of the four stats below and the whole flags list are
// LIVE, derived from the same DemoState SupervisorReview writes to --
// visit that screen first, flag something, and the numbers here actually
// move. The other two stats are clearly labeled illustrative, since
// there's no real campaign-roster or field-worker-roster model behind
// this demo to derive them from honestly.
export function AdminOversight() {
  const { reviewStatus, setReviewStatus } = useDemoState();

  const pendingCount = REVIEW_QUEUE.filter((i) => (reviewStatus[i.id] ?? "pending") === "pending").length;
  const flaggedItems = REVIEW_QUEUE.filter((i) => reviewStatus[i.id] === "flagged");

  const resolveFlag = (id: string) => setReviewStatus(id, "approved");

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-line px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <AcpLogo markClassName="h-6 w-6" textClassName="text-xs" />
          <Link to="/operations" className="text-[13px] text-muted hover:text-paper">← Operations</Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-2 label-caps" style={{ color: ACCENT }}>Admin Oversight</div>
        <h1 className="mb-2 font-display text-2xl font-bold text-paper">Platform Operations</h1>
        <p className="mb-8 max-w-lg text-[13.5px] leading-relaxed text-muted">
          Illustrative platform snapshot — not live production metrics. Two of the numbers below
          (Pending Verifications, Quality Flags Open) do move live with whatever's actually
          happened in Supervisor Review this session.
        </p>

        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Active Campaigns" value="3" />
          <StatCard label="Pending Verifications" value={pendingCount} live />
          <StatCard label="Quality Flags Open" value={flaggedItems.length} live accent={flaggedItems.length > 0 ? ACCENT : undefined} />
          <StatCard label="Field Workers Today" value="6" />
        </div>

        <div className="card-surface p-6">
          <div className="mb-4 label-caps">Quality Flags Queue</div>

          {flaggedItems.length === 0 ? (
            <p className="text-[13.5px] text-muted">
              No open quality flags right now. Flag something in Supervisor Review to see it
              land here.
            </p>
          ) : (
            <div className="space-y-3">
              {flaggedItems.map((item) => (
                <div key={item.id} className="rounded-lg border border-line bg-white/[0.02] p-4">
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <span className="label-caps">{item.campaignClient} · {item.city}</span>
                    <button
                      type="button"
                      onClick={() => resolveFlag(item.id)}
                      className="shrink-0 rounded-full px-3 py-1 text-[11.5px] font-semibold"
                      style={{ backgroundColor: "#2FBF7122", color: "#2FBF71" }}
                    >
                      ✓ Resolve
                    </button>
                  </div>
                  <p className="text-[13.5px] leading-relaxed text-paper">&ldquo;{item.excerpt}&rdquo;</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link to="/operations/review" className="mt-6 inline-block text-[13px] font-semibold hover:underline" style={{ color: ACCENT }}>
          Go to Supervisor Review →
        </Link>
      </main>
    </div>
  );
}

function StatCard({ label, value, live, accent }: { label: string; value: string | number; live?: boolean; accent?: string }) {
  return (
    <div className="card-surface p-4">
      <div className="mb-1.5 flex items-center gap-1.5">
        <div className="label-caps">{label}</div>
        {live && <span className="h-1.5 w-1.5 shrink-0 animate-pulse-dot rounded-full bg-sound" aria-hidden="true" />}
      </div>
      <div className="tabular font-display text-2xl font-bold" style={accent ? { color: accent } : { color: "var(--paper)" }}>
        {value}
      </div>
    </div>
  );
}
