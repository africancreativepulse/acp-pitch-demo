import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { CheckCircle2, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/Button";
import { DemoHeader } from "@/components/DemoHeader";
import { ExpertBadge } from "@/components/ExpertBadge";
import { CategoryPicker } from "@/components/CategoryPicker";
import { BadgeEvidencePreview } from "@/components/BadgeEvidencePreview";
import { cn } from "@/lib/cn";
import {
  COUNTRIES, COMING_SOON_COUNTRIES, CITIES_BY_COUNTRY, ONBOARDING_LANGUAGES,
  CEI_DEFINITION, CDI_DEFINITION, type Country,
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
  // Starts empty -- picking is genuinely optional (real app: "Skip" shows
  // until at least one is picked), and every badge picked here starts
  // "pending" on finish, matching the real app's own contributor_badges
  // default -- a badge doesn't affect campaign matching until an admin
  // approves it in Badge Verification.
  const [badges, setBadges] = useState<string[]>([]);

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

  const finish = () => {
    if (typedRole === "contributor") {
      setContributorBadges(badges.map((subCategoryId) => ({ subCategoryId, status: "pending" as const })));
    }
    navigate(destination);
  };

  const steps = ["country", "city", "language", "verify", "ready"];

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <DemoHeader />

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
                <Button color={accent} onClick={() => setStep(4)} className="!rounded-none !px-8" disabled={!docUploaded}>
                  Continue →
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
                to them, not everyone at once. Real 29-field structure, same as the live platform.
              </p>

              {/* Taxonomy expansion sync (Part 2) -- CategoryPicker replaces
                  the old flat 10-item chip grid, which genuinely doesn't
                  scale to a real 29-field structure. "multi" mode: no cap,
                  no nudge, matching this step's existing "optional, pick as
                  many as fit" framing exactly. */}
              <div className="mb-6">
                <CategoryPicker mode="multi" selected={badges} onChange={setBadges} accent={accent} />
              </div>

              {/* Part C item 8 -- the picker above selects; this is the
                  real payoff shown immediately, in the same badge visual
                  ContributorCapture pays it off with a step later, not
                  just a checkmark on a chip. Every badge here starts
                  "pending" until Admin approves it -- see finish(). */}
              {badges.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-x-6 gap-y-3 rounded-lg border border-line p-4">
                  {badges.map((b) => (
                    <ExpertBadge key={b} category={b} color={accent} size="sm" status="pending" />
                  ))}
                </div>
              )}

              {/* Real gap found + fixed: contributor_badges' own
                  social_handle/experience_note fields had no
                  representation at all after tonight's taxonomy rebuild.
                  Own separate block, same separation the real app's
                  BadgeEvidence.tsx keeps from CategoryPicker. */}
              <BadgeEvidencePreview badgeIds={badges} />

              <div className="flex gap-3">
                <Button variant="ghost" color={accent} onClick={() => setStep(2)} className="!rounded-none">← Back</Button>
                <Button color={accent} onClick={() => setStep(4)} className="!rounded-none !px-8">
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {/* Item 3 -- a genuinely unfamiliar investor was landing straight
              on a data-dense screen (CEI/CDI scores, a campaigns table)
              right after picking a language. This step is the light-touch
              fix: a few sentences of real framing -- reusing the exact
              CEI_DEFINITION/CDI_DEFINITION strings InfoHint shows later,
              so nothing here contradicts what they'll read on the actual
              dashboard -- before the numbers actually arrive. Not a
              tutorial modal blocking the dashboard itself; one extra,
              skippable-feeling step already inside the wizard's own
              rhythm. */}
          {step === 4 && (
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: `color-mix(in srgb, ${accent} 16%, transparent)` }}>
                <Sparkles className="h-6 w-6" style={{ color: accent }} />
              </div>
              <h1 className="mb-4 font-display text-3xl font-bold text-paper">You&rsquo;re in.</h1>
              {typedRole === "agency" ? (
                <>
                  <p className="mb-5 text-muted">
                    One quick orientation before the dashboard: every campaign you&rsquo;ll see is
                    scored two ways.
                  </p>
                  <div className="mb-8 space-y-3">
                    <ScorePreview label="CEI — Cultural Engagement Index" color="var(--visual)" text={CEI_DEFINITION.replace("Cultural Engagement Index — ", "")} />
                    <ScorePreview label="CDI — Cultural Depth Index" color="var(--pulse)" text={CDI_DEFINITION.replace("Cultural Depth Index — ", "")} />
                  </div>
                  <p className="mb-8 text-[13px] text-muted">
                    Every number traces back to a real quote, photo, or voice note — tap any score
                    to see it.
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-5 text-muted">
                    One quick orientation before your tasks: you&rsquo;ll see one campaign, matched
                    to your own expert badge, not a random feed of everything on the platform.
                  </p>
                  <p className="mb-8 text-[13px] text-muted">
                    Complete its two quick tasks — a voice note, a photo — and your submission
                    enters the same verified pipeline every campaign here relies on. Points land
                    the moment you submit.
                  </p>
                </>
              )}

              <div className="flex gap-3">
                <Button variant="ghost" color={accent} onClick={() => setStep(3)} className="!rounded-none">← Back</Button>
                <Button color={accent} onClick={finish} className="!rounded-none !px-8">
                  {typedRole === "agency" ? "Enter Agency Command →" : "Enter Contributor Capture →"}
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

function ScorePreview({ label, color, text }: { label: string; color: string; text: string }) {
  return (
    <div className="rounded border border-line p-4" style={{ borderColor: `${color}30` }}>
      <div className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color }}>
        {label}
      </div>
      <p className="text-[13px] leading-relaxed text-muted">{text}</p>
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
