import { Link } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { DemoHeader } from "@/components/DemoHeader";
import { GlitchText } from "@/components/GlitchText";

// Mirrors DashboardShell's own ROLE_ACCENT map exactly -- the six real
// surfaces this tour actually built, in the same order OperationsHub
// already introduces four of them (Head of Research → Field → Supervisor
// → Admin), with the two consumer-facing surfaces first since they're
// where every journey through this demo actually starts.
const JOURNEY = [
  { label: "Agency Command", to: "/agency", accent: "var(--visual)", desc: "Campaign scoring, portfolio-wide" },
  { label: "Contributor Capture", to: "/contribute", accent: "var(--sound)", desc: "The badge-matched task itself" },
  { label: "Field Worker Capture", to: "/operations/field", accent: "var(--pulse)", desc: "Offline, paper-based collection" },
  { label: "Supervisor Review", to: "/operations/review", accent: "var(--soulgap)", desc: "The back-check behind every score" },
  { label: "Admin Oversight", to: "/operations/admin", accent: "var(--ritual)", desc: "Platform-wide vetting & flags" },
  { label: "Head of Research", to: "/operations/research", accent: "var(--taste)", desc: "The persistent team behind it" },
];

/**
 * Item 5 -- a deliberate ending, not just wherever the last tap happened
 * to land. Reachable from the "Wrap Up" link DemoHeader now carries on
 * every screen. Content is a real recap, not filler: the same headline
 * Splash opened with (closing the loop), then the six real surfaces this
 * tour actually covers -- doubling as both closure and a way back into
 * any one of them, for an investor who wants to keep exploring rather
 * than stop here.
 *
 * No `backTo` on DemoHeader here -- like Splash, there's no single
 * logical parent for a screen reachable from everywhere; unlike Splash,
 * that's a deliberate bookend, not an oversight (see DemoHeader's own
 * header comment).
 */
export function WrapUp() {
  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <DemoHeader showWrapUp={false} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <div className="mb-2 label-caps !text-pulse">End of Demo</div>
        <h1 className="mb-5 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-bold leading-[1.1] tracking-tight text-paper">
          Africa&rsquo;s cultures, read like <GlitchText className="text-pulse">signals.</GlitchText>
        </h1>
        <p className="mb-12 max-w-xl text-[15px] leading-relaxed text-muted">
          One real campaign, scored six ways, with every number traceable to a verified quote,
          photo, or voice note — and the recruitment, review, and oversight infrastructure that
          makes that trust possible, not just a dashboard on top of raw survey data.
        </p>

        <div className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          What this tour covered
        </div>
        <div className="mb-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-line sm:grid-cols-2">
          {JOURNEY.map((j) => (
            <Link
              key={j.to}
              to={j.to}
              className="group flex items-center justify-between bg-ink p-5 transition-colors hover:bg-panel"
            >
              <div>
                <div className="font-display text-sm font-bold" style={{ color: j.accent }}>{j.label}</div>
                <p className="mt-0.5 text-[12px] text-muted">{j.desc}</p>
              </div>
              <span className="shrink-0 text-lg text-muted transition-transform group-hover:translate-x-1" style={{ color: j.accent }}>
                →
              </span>
            </Link>
          ))}
        </div>

        <div className="flex flex-col items-start gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-muted">Pitch prototype · No login required</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-pulse px-6 py-3 font-display text-[12.5px] font-semibold uppercase tracking-[0.06em] text-ink transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restart the Tour
          </Link>
        </div>
      </main>
    </div>
  );
}
