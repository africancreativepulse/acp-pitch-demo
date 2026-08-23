import { useState } from "react";
import { Link } from "react-router-dom";
import { AcpLogo } from "@/components/AcpLogo";
import { Button } from "@/components/Button";
import { FIELD_ROUTE, FIELD_WORKER } from "@/data/demo";

const ACCENT = "var(--pulse)"; // matches the real app's field_agent role accent

type SyncState = "idle" | "syncing" | "done";

// The paper-based, offline half of "Digital + Field Hybrid" -- a field
// worker in an area with no smartphone/data coverage, going door to door,
// marking physical response forms as complete, then syncing the whole
// batch once back in signal range. Deliberately NOT a PhoneFrame like
// ContributorCapture: that visual specifically signals "this happens on a
// phone," which is the one thing this screen exists to show isn't always
// true. Tap-only throughout -- marking a stop captured and triggering
// sync are both single taps, no typing anywhere.
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
    // Illustrative delay only -- no network call, nothing to await.
    window.setTimeout(() => setSync("done"), 1600);
  };

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-line px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <AcpLogo markClassName="h-6 w-6" textClassName="text-xs" />
          <Link to="/operations" className="text-[13px] text-muted hover:text-paper">← Operations</Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-2 label-caps" style={{ color: ACCENT }}>Field Worker Capture</div>
        <h1 className="mb-1 font-display text-2xl font-bold text-paper">{FIELD_WORKER.name}</h1>
        <p className="mb-6 text-[13.5px] text-muted">
          {FIELD_WORKER.zone} · Collecting for {FIELD_WORKER.campaignClient}
        </p>

        <div className="mb-8 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide" style={{ borderColor: `${ACCENT}40`, backgroundColor: `${ACCENT}12`, color: ACCENT }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
          No signal · paper capture only
        </div>

        {sync !== "done" ? (
          <>
            <div className="card-surface p-6">
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
                      className="flex w-full items-center gap-3 rounded-lg border border-line bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-white/20"
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
          <div className="card-surface p-7 text-center" style={{ borderColor: `${ACCENT}40` }}>
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
      </main>
    </div>
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
