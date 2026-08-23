import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { AcpLogo } from "@/components/AcpLogo";
import { cn } from "@/lib/cn";
import { COUNTRIES, CITIES_BY_COUNTRY, ONBOARDING_LANGUAGES, type Country } from "@/data/demo";

type Role = "agency" | "contributor";

/**
 * Ported structural pattern from the real app's own
 * components/onboarding/OnboardingWizard.tsx -- this screen previously
 * used the circular numbered-badge ProgressSteps component (borrowed from
 * Campaign Builder's own wizard) and rounded-full pill chips, neither of
 * which the real onboarding flow actually uses. The real wizard has its
 * own distinct visual language: a thin segmented progress BAR (not
 * circles), a small vertical accent bar + tracked label per step (not the
 * dashboard's horizontal-rule eyebrow), a dense seamless GRID of
 * rectangular cells for location pickers (ring-inset when selected, not a
 * pill), and sharp rounded-none bordered pills for language selection.
 * All four adopted here. Free-text city input in the real wizard is the
 * one thing NOT carried over -- kept as a tap-only grid picker instead,
 * per this whole demo's zero-typing rule.
 */
export function Onboarding() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState<Country>("South Africa");
  const [city, setCity] = useState(CITIES_BY_COUNTRY["South Africa"][0]);
  const [language, setLanguage] = useState("English");

  if (role !== "agency" && role !== "contributor") {
    return <Navigate to="/" replace />;
  }
  const typedRole = role as Role;

  const accent = typedRole === "agency" ? "var(--visual)" : "var(--sound)";
  const destination = typedRole === "agency" ? "/agency" : "/contribute";
  const roleLabel = typedRole === "agency" ? "Brand / Agency" : "Contributor";

  const selectCountry = (c: Country) => {
    setCountry(c);
    setCity(CITIES_BY_COUNTRY[c][0]);
  };

  const finish = () => navigate(destination);
  const steps = ["country", "city", "language"];

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <header className="border-b border-line px-6 py-4">
        <div className="mx-auto max-w-lg">
          <AcpLogo markClassName="h-6 w-6" textClassName="text-xs" />
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {/* Real segmented progress bar (h-1 flex-1 per step), not
              circular numbered badges. */}
          <div className="mb-10 flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={s} className="h-1 flex-1 rounded-full transition-colors" style={{ backgroundColor: i <= step ? accent : "var(--line)" }} />
            ))}
          </div>

          {step === 0 && (
            <div>
              <StepEyebrow accent={accent}>Setting up as {roleLabel}</StepEyebrow>
              <h1 className="mb-4 font-display text-3xl font-bold text-paper">Where are you based?</h1>
              <p className="mb-8 text-muted">This helps show relevant campaigns and insights for your context.</p>

              <div className="mb-8 grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
                {COUNTRIES.map((c) => (
                  <GridCell key={c} active={country === c} accent={accent} onClick={() => selectCountry(c)}>
                    {c}
                  </GridCell>
                ))}
              </div>

              <div className="flex gap-3">
                <Button color={accent} onClick={() => setStep(1)} className="!rounded-none !px-8">
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <StepEyebrow accent={accent}>Setting up as {roleLabel}</StepEyebrow>
              <h1 className="mb-4 font-display text-3xl font-bold text-paper">Which city?</h1>
              <p className="mb-8 text-muted">Cities in {country}.</p>

              <div className="mb-8 grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
                {CITIES_BY_COUNTRY[country].map((c) => (
                  <GridCell key={c} active={city === c} accent={accent} onClick={() => setCity(c)}>
                    {c}
                  </GridCell>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" color={accent} onClick={() => setStep(0)} className="!rounded-none">← Back</Button>
                <Button color={accent} onClick={() => setStep(2)} className="!rounded-none !px-8">Continue →</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <StepEyebrow accent={accent}>Setting up as {roleLabel}</StepEyebrow>
              <h1 className="mb-4 font-display text-3xl font-bold text-paper">Preferred language?</h1>
              <p className="mb-8 text-muted">You can change this any time from your profile.</p>

              <div className="mb-8 flex flex-wrap gap-2">
                {ONBOARDING_LANGUAGES.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLanguage(l)}
                    className={cn(
                      "rounded-none border px-3 py-2 text-sm transition-colors",
                      language === l ? "text-ink" : "border-line bg-transparent text-muted hover:border-[var(--lang-accent)] hover:text-paper"
                    )}
                    style={
                      language === l
                        ? { backgroundColor: accent, borderColor: accent }
                        : { ["--lang-accent" as string]: accent }
                    }
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" color={accent} onClick={() => setStep(1)} className="!rounded-none">← Back</Button>
                <Button color={accent} onClick={finish} className="!rounded-none !px-8">
                  Enter {roleLabel === "Brand / Agency" ? "Agency Command" : "Contributor Capture"} →
                </Button>
              </div>
            </div>
          )}

          <p className="mt-10 text-center text-[12px] text-muted">
            {country} · {step >= 1 ? city : "…"} · {step >= 2 ? language : "…"}
          </p>
        </div>
      </div>
    </div>
  );
}

// Real per-step header: a small vertical accent bar + tracked uppercase
// label -- OnboardingWizard.tsx's own distinct convention, not the
// dashboard's horizontal-rule eyebrow used everywhere else in this demo.
function StepEyebrow({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="h-8 w-2 rounded-full" style={{ backgroundColor: accent }} />
      <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted">{children}</span>
    </div>
  );
}

// Real dense grid-cell picker (grid-cols-2/3, gap-px on a --line
// background so 1px hairlines show between cells, ring-inset when
// selected) -- OnboardingWizard.tsx's own country-picker pattern, applied
// here to both Country and City.
function GridCell({ active, accent, onClick, children }: { active: boolean; accent: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("bg-ink px-4 py-3 text-start text-sm transition-colors", active ? "font-medium" : "text-muted hover:text-paper")}
      style={active ? { color: accent, boxShadow: `inset 0 0 0 1px ${accent}` } : undefined}
    >
      {children}
    </button>
  );
}
