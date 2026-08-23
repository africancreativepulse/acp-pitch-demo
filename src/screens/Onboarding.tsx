import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/Button";
import { DemoHeader } from "@/components/DemoHeader";
import { ExpertBadge } from "@/components/ExpertBadge";
import { cn } from "@/lib/cn";
import {
  COUNTRIES, COMING_SOON_COUNTRIES, CITIES_BY_COUNTRY, ONBOARDING_LANGUAGES,
  CAMPAIGN_CATEGORIES, type Country,
} from "@/data/demo";
import { useDemoState } from "@/state/DemoState";

type Role = "agency" | "contributor";

/**
 * Ported structural pattern from the real app's own
 * components/onboarding/OnboardingWizard.tsx -- segmented progress bar,
 * vertical-bar-accent step eyebrow, dense grid-cell location pickers,
 * sharp rounded-none language pills. A 4th, role-specific step is new
 * here (the real wizard's own Verify/Expertise steps, which really do
 * differ by role): agencies confirm document verification (Part C, item
 * 10 -- agencies can't post campaigns until this clears); contributors
 * pick expert badges (Part C, item 11 -- the real basis campaign-badge
 * matching runs on). Free-text city/document/contact fields in the real
 * wizard are the one thing NOT carried over -- kept tap-only throughout,
 * per this whole demo's zero-typing rule.
 */
export function Onboarding() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { setContributorBadges } = useDemoState();
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState<Country>("South Africa");
  const [city, setCity] = useState(CITIES_BY_COUNTRY["South Africa"][0]);
  const [language, setLanguage] = useState("English");
  const [docUploaded, setDocUploaded] = useState(false);
  const [badges, setBadges] = useState<string[]>(["finance_business"]);

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

  const toggleBadge = (value: string) =>
    setBadges((prev) => (prev.includes(value) ? prev.filter((b) => b !== value) : [...prev, value]));

  const finish = () => {
    if (typedRole === "contributor") setContributorBadges(badges);
    navigate(destination);
  };

  const steps = ["country", "city", "language", "verify"];

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <DemoHeader backTo="/" />

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
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

              <div className="mb-3 grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
                {COUNTRIES.map((c) => (
                  <GridCell key={c} active={country === c} accent={accent} onClick={() => selectCountry(c)}>
                    {c}
                  </GridCell>
                ))}
                {/* Part D, item 14 -- the platform only shows markets it's
                    actually live in. Shown disabled and clearly labeled,
                    not silently omitted, so the gate itself is visible. */}
                {COMING_SOON_COUNTRIES.map((c) => (
                  <div key={c} className="bg-ink px-4 py-3 text-start text-sm text-muted/40" aria-disabled="true">
                    {c}
                    <span className="ml-1.5 text-[9px] uppercase tracking-[0.1em]">Coming soon</span>
                  </div>
                ))}
              </div>
              <p className="mb-8 text-[11.5px] text-muted">
                Live in {COUNTRIES.length} markets today, expanding deliberately — not overclaiming reach we don't have yet.
              </p>

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
                <Button color={accent} onClick={() => setStep(3)} className="!rounded-none !px-8">Continue →</Button>
              </div>
            </div>
          )}

          {step === 3 && typedRole === "agency" && (
            <div>
              <StepEyebrow accent={accent}>Setting up as {roleLabel}</StepEyebrow>
              <h1 className="mb-4 font-display text-3xl font-bold text-paper">Verify your agency</h1>
              <p className="mb-8 text-muted">
                Agencies go through document verification before campaigns can go live — this
                protects the whole marketplace, not just one client.
              </p>

              <button
                type="button"
                onClick={() => setDocUploaded(true)}
                disabled={docUploaded}
                className="mb-6 flex w-full flex-col items-center justify-center gap-2 border border-dashed py-10 transition-colors disabled:cursor-default"
                style={docUploaded ? { borderColor: "var(--sound)", color: "var(--sound)" } : { borderColor: "var(--line)", color: "var(--muted)" }}
              >
                {docUploaded ? <CheckCircle2 className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
                <span className="text-sm">
                  {docUploaded ? "Registration document uploaded" : "Tap to upload registration document (illustrative)"}
                </span>
              </button>

              {docUploaded && (
                <p className="mb-8 text-[12.5px]" style={{ color: accent }}>
                  Submitted — fast-tracked and verified for this demo. A real submission enters
                  Admin's own Agency Verification queue instead of resolving instantly.
                </p>
              )}

              <div className="flex gap-3">
                <Button variant="ghost" color={accent} onClick={() => setStep(2)} className="!rounded-none">← Back</Button>
                <Button color={accent} onClick={finish} className="!rounded-none !px-8" disabled={!docUploaded}>
                  Enter Agency Command →
                </Button>
              </div>
            </div>
          )}

          {step === 3 && typedRole === "contributor" && (
            <div>
              <StepEyebrow accent={accent}>Setting up as {roleLabel}</StepEyebrow>
              <h1 className="mb-4 font-display text-3xl font-bold text-paper">What do you know well?</h1>
              <p className="mb-8 text-muted">
                Pick a few expert categories — campaigns only reach contributors genuinely matched
                to them, not everyone at once.
              </p>

              <div className="mb-6 flex flex-wrap gap-2">
                {CAMPAIGN_CATEGORIES.map((c) => {
                  const active = badges.includes(c.value);
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => toggleBadge(c.value)}
                      className={cn(
                        "rounded-none border px-3 py-2 text-sm transition-colors",
                        active ? "text-ink" : "border-line bg-transparent text-muted hover:border-[var(--badge-accent)] hover:text-paper"
                      )}
                      style={active ? { backgroundColor: accent, borderColor: accent } : { ["--badge-accent" as string]: accent }}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>

              {/* Part C item 8 -- the picker above selects; this is the
                  real payoff shown immediately, in the same badge visual
                  ContributorCapture pays it off with a step later, not
                  just a checkmark on a chip. */}
              {badges.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-x-6 gap-y-3 rounded-lg border border-line p-4">
                  {badges.map((b) => (
                    <ExpertBadge key={b} category={b} color={accent} size="sm" />
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="ghost" color={accent} onClick={() => setStep(2)} className="!rounded-none">← Back</Button>
                <Button color={accent} onClick={finish} className="!rounded-none !px-8">
                  Enter Contributor Capture →
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

function StepEyebrow({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="h-8 w-2 rounded-full" style={{ backgroundColor: accent }} />
      <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted">{children}</span>
    </div>
  );
}

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
