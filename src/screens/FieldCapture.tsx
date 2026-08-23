import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/Button";
import { StatGrid, StatCard } from "@/components/StatCard";
import { FIELD_ROUTE, FIELD_WORKER } from "@/data/demo";

const ACCENT = "var(--pulse)";

type SyncState = "idle" | "syncing" | "done";

/**
 * Ported structural pattern from the real app's fieldwork/AgentDashboard.tsx
 * -- accent rule + eyebrow + "Welcome back" H1, a StatGrid summary, and an
 * assignment-row list (rounded border + hover, Badge-style status), now
 * wrapped in DashboardShell like every other real dashboard page. The
 * actual offline/paper capture interaction below the assignment row has
 * no real page to mirror -- a genuine field worker with no signal
 * couldn't load this Supabase-backed real page at all, which is exactly
 * the gap this screen exists to illustrate -- so that part stays this
 * demo's own content, just housed in the same real structural language.
 */
export function FieldCapture() {
  const [captured, setCaptured] = useState<Set<string>>(new Set());
  const [sync, setSync] = useState<SyncState>("idle");

  const toggleCaptured = (id: string) =>
    setCaptured((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const total = FIELD_ROUTE.length;
  const count = captured.size;

  const startSync = () => {
    setSync("syncing");
    window.setTimeout(() => setSync("done"), 1600);
  };

  return (
    <DashboardShell role="field_agent">
      <div className="px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-0.5 w-[30px]" style={{ backgroundColor: ACCENT }} />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                Field Agent Dashboard
              </span>
            </div>
            <h1 className="mt-2.5 font-display text-[22px] font-bold text-paper">
              Welcome back, {FIELD_WORKER.name.split(" ")[0]}
            </h1>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide" style={{ borderColor: `${ACCENT}40`, backgroundColor: `${ACCENT}12`, color: ACCENT }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
            No signal
          </div>
        </div>

        <StatGrid className="mb-9 md:!grid-cols-3">
          <StatCard label="Households on Route" value={total} />
          <StatCard label="Captured Today" value={count} />
          <StatCard label="Capture Method" value="Paper" />
        </StatGrid>

        <h2 className="mb-4 font-display text-base font-bold text-paper">My Assignment</h2>
        <div className="mb-6 flex items-center justify-between rounded border border-line px-[18px] py-4">
          <div>
            <h3 className="text-sm font-semibold text-paper">{FIELD_WORKER.campaignClient}</h3>
            <div className="mt-0.5 text-xs text-muted">{FIELD_WORKER.zone} · paper capture, no signal</div>
          </div>
          <span
            className="rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.06em]"
            style={{ color: "var(--sound)", backgroundColor: "color-mix(in srgb, var(--sound) 14%, transparent)" }}
          >
            active
          </span>
        </div>

        {sync !== "done" ? (
          <>
            <div className="rounded border border-line p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="label-caps">Today's Route</div>
                <div className="tabular label-caps !text-paper">{count} of {total} captured</div>
              </div>

              <div className="space-y-2">
                {FIELD_ROUTE.map((stop) => {
                  const done = captured.has(stop.id);
                  return (
                    <button
                      key={stop.id}
                      type="button"
                      onClick={() => toggleCaptured(stop.id)}
                      className="flex w-full items-center gap-3 rounded border border-line bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-white/20"
                    >
                      <PaperIcon done={done} accent={ACCENT} />
                      <span className="flex-1 text-sm font-medium text-paper">{stop.label}</span>
                      <span className="label-caps !text-[10px]" style={done ? { color: ACCENT } : undefined}>
                        {done ? "Captured on paper" : "Tap when form is complete"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <Button color={ACCENT} disabled={count === 0 || sync === "syncing"} onClick={startSync}>
                {sync === "syncing" ? "Syncing…" : `Return to signal area & sync (${count})`}
              </Button>
              {count === 0 && (
                <p className="mt-2 text-xs text-muted">Mark at least one household as captured to sync.</p>
              )}
            </div>
          </>
        ) : (
          <div className="rounded border border-line p-7 text-center" style={{ borderColor: `${ACCENT}40` }}>
            <div className="mb-2 font-display text-xl font-bold" style={{ color: ACCENT }}>
              Synced — {count} paper response{count === 1 ? "" : "s"} digitized
            </div>
            <p className="mx-auto max-w-sm text-[13.5px] leading-relaxed text-muted">
              These now enter the same review pipeline as any digital submission — a supervisor
              back-checks them before they count toward {FIELD_WORKER.campaignClient}'s verified
              response total.
            </p>
            <Link to="/operations/review" className="mt-5 inline-block text-[13px] font-semibold hover:underline" style={{ color: ACCENT }}>
              See the review queue →
            </Link>
          </div>
        )}

        <p className="mt-8 text-[11.5px] leading-relaxed text-muted">
          Illustrative capture flow — no real GPS, households, or field roster behind this
          screen. It exists to show the collection method itself, not to simulate a real route.
        </p>
      </div>
    </DashboardShell>
  );
}

function PaperIcon({ done, accent }: { done: boolean; accent: string }) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors"
      style={done ? { borderColor: accent, backgroundColor: `${accent}18` } : { borderColor: "var(--line)" }}
    >
      {done ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2">
          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.6">
          <rect x="5" y="3" width="14" height="18" rx="1.5" />
          <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}
