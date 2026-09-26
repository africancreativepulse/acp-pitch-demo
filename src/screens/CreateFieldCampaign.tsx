import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { DashboardShell, ROLE_ACCENT } from "@/components/DashboardShell";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { useDemoState } from "@/state/DemoState";

const ACCENT = ROLE_ACCENT.agency;
const STEPS = ["Details", "Review"];

const CITY_OPTIONS = [
  "Soweto (Johannesburg)", "Alexandra (Johannesburg)", "Mamelodi (Pretoria)",
  "uMlazi (Durban)", "KwaMashu (Durban)", "Khayelitsha (Cape Town)",
];
const SAMPLE_SIZES = [50, 100, 200, 500];

/**
 * Real-app parity (nav/cosmetic audit, deferred bucket item 4): port of
 * the real fieldwork/CreateFieldCampaign.tsx's own real fields (Title,
 * Research Objective, Target Geography, Sample Size) -- the real page's
 * further Step 2 dynamic questionnaire builder is NOT ported here.
 * data/demo.ts's DraftCampaign type has no questionnaire-schema field to
 * persist one against (it was built for CampaignBuilder.tsx's own
 * task-list shape), and this demo is tap-only throughout (see
 * CampaignBuilder.tsx's own header comment) -- building a full dynamic
 * form-field editor just to throw its output away would be real,
 * unjustified scope, not a cosmetic port. Methodology is fixed to "Field
 * Only" (this screen's whole reason to exist, distinct from
 * CampaignBuilder.tsx's own Digital/Hybrid options) -- the created
 * campaign lands in the same draftCampaigns pipeline CampaignBuilder.tsx
 * already uses, so it shows up for real on Campaigns/AgencyFieldwork/
 * AgencyCommand alike, not a dead-end form.
 */
export function CreateFieldCampaign() {
  const navigate = useNavigate();
  const { addCampaign } = useDemoState();
  const [step, setStep] = useState(0);

  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [cities, setCities] = useState<string[]>([CITY_OPTIONS[0]]);
  const [sampleSize, setSampleSize] = useState(100);

  const toggleCity = (city: string) =>
    setCities((prev) => (prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]));

  const step1Valid = title.trim().length > 0 && cities.length > 0;

  const launch = () => {
    addCampaign({
      client: title.trim(),
      objective,
      categories: [],
      cities,
      ageBand: "18–34",
      methodology: "Field Only",
      sampleSize,
      tasks: [],
    });
    navigate("/agency/fieldwork");
  };

  return (
    <DashboardShell role="agency">
      <div className="max-w-3xl px-6 py-10 md:p-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-12" style={{ backgroundColor: ACCENT }} />
          <span className="font-mono text-xs font-medium uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
            New Field Campaign
          </span>
        </div>

        <div className="mb-10 flex items-center gap-4">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className="border-b-2 pb-2 font-mono text-xs font-medium uppercase tracking-[0.15em] transition-colors"
              style={step === i ? { borderColor: ACCENT, color: "var(--paper)" } : { borderColor: "transparent", color: "var(--muted)" }}
            >
              {s}
            </button>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-6">
            <Field label="Campaign Title *">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Youth Culture Study — Mamelodi"
                className="h-12 w-full rounded border border-line bg-transparent px-3 text-[15px] text-paper placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-visual"
              />
            </Field>

            <Field label="Research Objective">
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="What are you trying to learn?"
                rows={3}
                className="w-full rounded border border-line bg-transparent p-3 text-sm text-paper placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-visual"
              />
            </Field>

            <Field label="Target Geography * (never country-level)">
              <ChipRow>
                {CITY_OPTIONS.map((c) => (
                  <Chip key={c} active={cities.includes(c)} accent={ACCENT} onClick={() => toggleCity(c)}>{c}</Chip>
                ))}
              </ChipRow>
            </Field>

            <Field label="Sample Size">
              <ChipRow>
                {SAMPLE_SIZES.map((n) => (
                  <Chip key={n} active={sampleSize === n} accent={ACCENT} onClick={() => setSampleSize(n)}>{n.toLocaleString()}</Chip>
                ))}
              </ChipRow>
            </Field>

            <Field label="Collection Method">
              <div className="rounded border border-line bg-panel px-3.5 py-2.5 text-[13px] text-muted">
                Field Only — offline, paper-based collection. For digital or hybrid campaigns, use{" "}
                <button onClick={() => navigate("/agency/new")} className="font-semibold hover:underline" style={{ color: ACCENT }}>
                  New Campaign
                </button>{" "}
                instead.
              </div>
            </Field>

            <div>
              <Button color={ACCENT} disabled={!step1Valid} onClick={() => setStep(1)}>
                Next: Review <ArrowRight className="ms-2 inline h-4 w-4" />
              </Button>
              {!step1Valid && <p className="mt-2 text-xs text-pulse">Add a title and pick at least one target city to continue.</p>}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="rounded border border-line p-5">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Summary</div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Title</dt>
                  <dd className="text-paper">{title || "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Geography</dt>
                  <dd className="text-end text-paper">{cities.join(", ")}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Sample Size</dt>
                  <dd className="text-paper">{sampleSize.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Methodology</dt>
                  <dd className="text-paper">Field Only</dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button variant="ghost" color={ACCENT} onClick={() => setStep(0)}>← Back</Button>
              <Button color={ACCENT} onClick={launch}>Launch Field Campaign</Button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-[0.1em] text-muted">{label}</div>
      {children}
    </div>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Chip({ active, accent, onClick, children }: { active: boolean; accent: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-none border px-3.5 py-2 text-left text-[13px] font-medium transition-colors",
        active ? "" : "border-line text-muted hover:border-white/25 hover:text-paper"
      )}
      style={active ? { borderColor: accent, backgroundColor: `${accent}26`, color: accent } : undefined}
    >
      {children}
    </button>
  );
}
