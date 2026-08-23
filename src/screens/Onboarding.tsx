import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { ProgressSteps } from "@/components/ProgressSteps";
import { AcpLogo } from "@/components/AcpLogo";
import { cn } from "@/lib/cn";
import { COUNTRIES, CITIES_BY_COUNTRY, ONBOARDING_LANGUAGES, type Country } from "@/data/demo";

const STEPS = ["Country", "City", "Language"];

type Role = "agency" | "contributor";

// The real signup journey a new user goes through, before landing on their
// role's main screen -- kept to three quick tap steps (not an exhaustive
// replica of every field the real onboarding form collects), entirely
// tap-to-advance. Splash's own two CTAs already ARE the role-choice step
// (per the brief: "this can reuse/extend the existing splash"), so this
// screen picks up right after that, carrying the chosen role via the URL.
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

  // Each persona's onboarding carries that persona's own Splash accent
  // (visual/blue for Brand-Agency, sound/green for Contributor) so the
  // whole journey reads as one continuous color-coded path from the
  // Splash button tapped through to the landing screen.
  const accent = typedRole === "agency" ? "var(--visual)" : "var(--sound)";
  const destination = typedRole === "agency" ? "/agency" : "/contribute";
  const roleLabel = typedRole === "agency" ? "Brand / Agency" : "Contributor";

  const selectCountry = (c: Country) => {
    setCountry(c);
    setCity(CITIES_BY_COUNTRY[c][0]); // keep city always valid for the chosen country
  };

  const finish = () => navigate(destination);

  return (
    <div className="min-h-screen bg-ink">
      {/* Deliberately not TopBar -- that's agency-branded chrome (the
          Ndoni Creative lockup, a link into /agency) that would be wrong
          here, especially for the Contributor persona mid-signup. Plain
          ACP brand mark instead, no role-specific chrome yet. */}
      <header className="border-b border-line px-6 py-4">
        <div className="mx-auto max-w-xl">
          <AcpLogo markClassName="h-6 w-6" textClassName="text-xs" />
        </div>
      </header>

      <main className="mx-auto max-w-xl px-6 py-14">
        <div className="mb-2 label-caps" style={{ color: accent }}>
          Setting up as {roleLabel}
        </div>
        <h1 className="mb-9 font-display text-2xl font-bold text-paper">Quick setup</h1>

        <div className="mb-10">
          <ProgressSteps steps={STEPS} current={step} accent={accent} />
        </div>

        {step === 0 && (
          <StepBlock title="Where are you based?" accent={accent}>
            <ChipGrid>
              {COUNTRIES.map((c) => (
                <Chip key={c} active={country === c} accent={accent} onClick={() => selectCountry(c)}>
                  {c}
                </Chip>
              ))}
            </ChipGrid>
            <NextRow accent={accent} onNext={() => setStep(1)} />
          </StepBlock>
        )}

        {step === 1 && (
          <StepBlock title="Which city?" accent={accent}>
            <ChipGrid>
              {CITIES_BY_COUNTRY[country].map((c) => (
                <Chip key={c} active={city === c} accent={accent} onClick={() => setCity(c)}>
                  {c}
                </Chip>
              ))}
            </ChipGrid>
            <NextRow accent={accent} onBack={() => setStep(0)} onNext={() => setStep(2)} />
          </StepBlock>
        )}

        {step === 2 && (
          <StepBlock title="Preferred language?" accent={accent}>
            <ChipGrid>
              {ONBOARDING_LANGUAGES.map((l) => (
                <Chip key={l} active={language === l} accent={accent} onClick={() => setLanguage(l)}>
                  {l}
                </Chip>
              ))}
            </ChipGrid>
            <div className="mt-8 flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>
                ← Back
              </Button>
              <Button color={accent} onClick={finish}>
                Enter {roleLabel === "Brand / Agency" ? "Agency Command" : "Contributor Capture"} →
              </Button>
            </div>
          </StepBlock>
        )}

        <p className="mt-10 text-center text-[12px] text-muted">
          {country} · {step >= 1 ? city : "…"} · {step >= 2 ? language : "…"}
        </p>
      </main>
    </div>
  );
}

function StepBlock({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="card-surface p-7" style={{ borderColor: `${accent}30` }}>
      <h2 className="mb-5 font-display text-lg font-bold text-paper">{title}</h2>
      {children}
    </div>
  );
}

function ChipGrid({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2.5">{children}</div>;
}

function Chip({
  active,
  accent,
  onClick,
  children,
}: {
  active: boolean;
  accent: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active ? "text-ink" : "border-line text-muted hover:border-white/25 hover:text-paper"
      )}
      style={active ? { backgroundColor: accent, borderColor: accent } : undefined}
    >
      {children}
    </button>
  );
}

function NextRow({ accent, onBack, onNext }: { accent: string; onBack?: () => void; onNext: () => void }) {
  return (
    <div className="mt-8 flex gap-3">
      {onBack && (
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
      )}
      <Button color={accent} onClick={onNext}>
        Next →
      </Button>
    </div>
  );
}
