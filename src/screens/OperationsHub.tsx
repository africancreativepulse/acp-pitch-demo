import { Link } from "react-router-dom";
import { AcpLogo } from "@/components/AcpLogo";

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
    to: "/operations/research",
    accent: "var(--taste)",
    label: "Head of Research",
    description: "The persistent, city-level team roster a project draws on -- built before it, still there after.",
  },
  {
    to: "/operations/field",
    accent: "var(--pulse)",
    label: "Field Worker Capture",
    description: "Paper-based, offline data collection in areas without smartphone coverage.",
  },
  {
    to: "/operations/review",
    accent: "var(--soulgap)",
    label: "Supervisor Review",
    description: "The back-check every \"Verified\" badge in this demo actually refers to.",
  },
  {
    to: "/operations/admin",
    accent: "var(--ritual)",
    label: "Admin Oversight",
    description: "Platform-wide verification queue, agency vetting, and quality flags across every campaign.",
  },
];

export function OperationsHub() {
  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-line px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <AcpLogo markClassName="h-6 w-6" textClassName="text-xs" />
          <Link to="/" className="text-[13px] text-muted hover:text-paper">← Splash</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14">
        <div className="mb-2 label-caps">The Operations Layer</div>
        <h1 className="mb-3 font-display text-2xl font-bold text-paper">
          How the data actually gets collected, checked, and run
        </h1>
        <p className="mb-10 max-w-xl text-[14px] leading-relaxed text-muted">
          Agency Command and Contributor Capture are the two consumer-facing surfaces. This is
          the rest of the platform behind them — the same one Sondela Cover's own
          &ldquo;Digital + Field Hybrid&rdquo; methodology and every &ldquo;Verified&rdquo;
          badge in The Evidence already point to.
        </p>

        <div className="space-y-4">
          {CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="card-surface group flex items-center justify-between p-6 transition-all hover:border-white/20"
              style={{ borderColor: `${card.accent}30` }}
            >
              <div>
                <h2 className="font-display text-lg font-bold" style={{ color: card.accent }}>
                  {card.label}
                </h2>
                <p className="mt-1 text-[13.5px] text-muted">{card.description}</p>
              </div>
              <span className="ml-6 shrink-0 text-2xl text-muted transition-transform group-hover:translate-x-1" style={{ color: card.accent }}>
                →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
