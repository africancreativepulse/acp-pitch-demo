import { DashboardShell, ROLE_ACCENT } from "@/components/DashboardShell";
import { CONTRIBUTOR_TASK } from "@/data/demo";

const ACCENT = ROLE_ACCENT.contributor;

// Illustrative weekly activity -- this demo tracks no real per-session
// submission history (ContributorCapture.tsx's own `submitted` state is
// local to that screen, not lifted to DemoState -- see its own header
// comment on what state is/isn't shared). Clearly labeled rather than
// presented as real history, same convention as TranslationQA's coverage
// numbers.
const WEEKLY_ACTIVITY = [
  { day: "Mon", count: 1 },
  { day: "Tue", count: 0 },
  { day: "Wed", count: 2 },
  { day: "Thu", count: 1 },
  { day: "Fri", count: 3 },
  { day: "Sat", count: 1 },
  { day: "Sun", count: 0 },
];

/**
 * Ported structural pattern from the real app's own pages/contributor/
 * ContributorAnalytics.tsx -- a personal weekly-activity read, genuinely
 * distinct from Overview's own point-in-time StatGrid.
 */
export function ContributorAnalytics() {
  const max = Math.max(...WEEKLY_ACTIVITY.map((d) => d.count), 1);

  return (
    <DashboardShell role="contributor">
      <div className="max-w-2xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex items-center gap-2.5">
          <div className="h-0.5 w-[30px]" style={{ backgroundColor: ACCENT }} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>Analytics</span>
        </div>
        <h1 className="mb-2 font-display text-[22px] font-bold text-paper">Weekly Activity</h1>
        <p className="mb-8 max-w-lg text-[13px] leading-relaxed text-muted">
          Illustrative — this demo doesn't track real submission history across sessions.
        </p>

        <div className="mb-10 flex items-end gap-3 rounded border border-line p-6" style={{ height: 160 }}>
          {WEEKLY_ACTIVITY.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t"
                style={{ height: `${(d.count / max) * 100}px`, backgroundColor: d.count > 0 ? ACCENT : "var(--line)", minHeight: 4 }}
              />
              <span className="font-mono text-[10px] uppercase text-muted">{d.day}</span>
            </div>
          ))}
        </div>

        <div className="rounded border border-line p-4">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Current Task Value</div>
          <div className="font-display text-2xl font-bold text-paper">{CONTRIBUTOR_TASK.points} pts</div>
          <div className="mt-1 text-[12px] text-muted">{CONTRIBUTOR_TASK.campaignClient} · {CONTRIBUTOR_TASK.type.replace("_", " ")}</div>
        </div>
      </div>
    </DashboardShell>
  );
}
