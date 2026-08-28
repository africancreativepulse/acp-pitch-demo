import { Link } from "react-router-dom";
import { DemoHeader } from "@/components/DemoHeader";

// Real correction: this used to be a bare navigation menu -- four links
// with a one-line description each, no honest account of how anyone
// actually ends up in one of these roles. Redesigned into a real,
// explanatory landing page: same four destinations, now each card also
// states plainly how someone gets that role on the real platform (invite,
// promotion, admin provisioning -- never self-signup), matching the real
// field-worker invite/promotion system this demo's own real-app build
// already shipped (research_areas roster, promotion-request queue,
// separation-of-duties trigger). Order follows the real career ladder
// (Field Worker -> Supervisor -> Head of Research -> Admin), not the
// arbitrary order the old nav list happened to use.
//
// Entry point into the platform's other half -- the demo previously only
// showed the two consumer-facing surfaces (Agency Command, Contributor
// Capture), which is only the "Digital" half of Sondela Cover's own
// "Digital + Field Hybrid" methodology. This hub is reachable both from
// Splash directly (a tertiary link, deliberately not competing with the
// two primary role-choice CTAs) and in context from Cultural Read /
// Evidence, so it reads as a genuine extension of the existing
// traceability story, not a bolted-on side path.
const CARDS = [
  {
    to: "/operations/field",
    accent: "var(--pulse)",
    label: "Field Worker",
    description: "Offline, paper-based data collection in areas without smartphone access.",
    access: "Invited by a Head of Research, not self-signup.",
  },
  {
    to: "/operations/review",
    accent: "var(--soulgap)",
    label: "Supervisor Review",
    description: "Reviews and back-checks submitted field data for quality.",
    access: "Promoted from Field Worker, or invited directly.",
  },
  {
    to: "/operations/research",
    accent: "var(--taste)",
    label: "Head of Research",
    description: "Owns a local team and roster across projects.",
    access: "Promoted from Supervisor, admin-approved.",
  },
  {
    to: "/operations/admin",
    accent: "var(--ritual)",
    label: "Admin Oversight",
    description: "Platform-wide quality control, verification, and campaign oversight.",
    access: "Provisioned directly by ACP.",
  },
];

export function OperationsHub() {
  return (
    <div className="min-h-screen bg-ink">
      <DemoHeader />

      <main className="mx-auto max-w-3xl px-6 py-14">
        <div className="mb-2 label-caps">The Operations Layer</div>
        <h1 className="mb-4 font-display text-2xl font-bold text-paper">
          How the data actually gets collected, checked, and run
        </h1>
        <p className="mb-10 max-w-xl text-[14px] leading-relaxed text-muted">
          Beyond the digital contributor network, ACP runs a real, vetted field operation for
          offline data collection — the same &ldquo;Digital + Field Hybrid&rdquo; methodology
          Sondela Cover&rsquo;s own scores, and every &ldquo;Verified&rdquo; badge in The
          Evidence, already point back to.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="card-surface group flex flex-col justify-between p-6 transition-all hover:border-white/20"
              style={{ borderColor: `${card.accent}30` }}
            >
              <div>
                <h2 className="font-display text-lg font-bold" style={{ color: card.accent }}>
                  {card.label}
                </h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{card.description}</p>
                <p className="mt-3 text-[12.5px] leading-relaxed text-muted/80">
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted/50">Access — </span>
                  {card.access}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-end">
                <span className="text-2xl transition-transform group-hover:translate-x-1" style={{ color: card.accent }}>
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
