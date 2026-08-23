import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { TASK_TYPES, CAMPAIGN_CATEGORIES, type BuilderTask, type TaskTypeKey } from "@/data/demo";
import { useDemoState } from "@/state/DemoState";

const STEPS = ["Details", "Tasks", "Review"];

const CITY_OPTIONS = [
  "Soweto (Johannesburg)",
  "Alexandra (Johannesburg)",
  "Tembisa (Johannesburg)",
  "uMlazi (Durban)",
  "KwaMashu (Durban)",
  "Inanda (Durban)",
  "Khayelitsha (Cape Town)",
  "Gugulethu (Cape Town)",
  "Mitchells Plain (Cape Town)",
  "Mamelodi (Pretoria)",
  "Katlehong (Ekurhuleni)",
];

const CLIENT_PRESETS = ["Amanzi Foods", "Jozi Fintech", "Bantu Beauty Co.", "Sunrise Telecom", "Harambee Retail"];

const OBJECTIVE_PRESETS = [
  "Understand why people delay or distrust this category",
  "Test how a new campaign concept actually lands",
  "Benchmark authenticity against a competitor",
  "Explore an underserved market segment",
];

const AGE_BANDS = ["18–24", "18–34", "25–44", "35–54", "55+"];
const METHODOLOGIES = ["Digital Only", "Field Only", "Digital + Field Hybrid"];
const SAMPLE_SIZES = [100, 300, 500, 1000, 2000];
const POINTS_STEP = 5;
const POINTS_MIN = 5;
const POINTS_MAX = 100;

let taskIdCounter = 0;
function newTask(type: TaskTypeKey): BuilderTask {
  const meta = TASK_TYPES.find((t) => t.key === type)!;
  taskIdCounter += 1;
  return { id: `task-${taskIdCounter}`, type, points: meta.defaultPoints };
}

/**
 * Ported structural pattern from the real app's agency/CreateCampaign.tsx:
 * narrower max-w-3xl form-page wrapper (vs. the list page's max-w-6xl),
 * thin-rule eyebrow ("New Campaign"), and -- the real structural fix --
 * the step indicator is the real page's own flat, always-clickable
 * text-tab convention (border-b-2 pb-2, mono uppercase tracked), not the
 * circular numbered-badge ProgressSteps component this screen used
 * before, which has no equivalent anywhere in the real product. Review
 * step's panels are now plain `rounded border border-line` (the real
 * form-page convention), not the filled card-surface treatment reserved
 * for data-display contexts elsewhere in this demo.
 */
export function CampaignBuilder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Part E, item 15 -- reused as-is by admin, same as the real app's own
  // CreateCampaign.tsx (`role === "admin" ? ROLE_ACCENT.admin : ROLE_ACCENT.agency`).
  const isAdmin = searchParams.get("admin") === "1";
  const ACCENT = isAdmin ? "var(--ritual)" : "var(--visual)";
  const { addCampaign } = useDemoState();
  const [step, setStep] = useState(0);

  const [client, setClient] = useState(CLIENT_PRESETS[0]);
  const [objective, setObjective] = useState(OBJECTIVE_PRESETS[0]);
  const [category, setCategory] = useState(CAMPAIGN_CATEGORIES[0].value);
  const [cities, setCities] = useState<string[]>([CITY_OPTIONS[0]]);
  const [ageBand, setAgeBand] = useState(AGE_BANDS[1]);
  const [methodology, setMethodology] = useState(METHODOLOGIES[2]);
  const [sampleSize, setSampleSize] = useState(300);
  const [tasks, setTasks] = useState<BuilderTask[]>([newTask("survey"), newTask("voice_note")]);

  const toggleCity = (city: string) =>
    setCities((prev) => (prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]));

  const adjustPoints = (id: string, delta: number) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, points: Math.max(POINTS_MIN, Math.min(POINTS_MAX, t.points + delta)) } : t))
    );

  const step1Valid = client.length > 0 && cities.length > 0;
  const totalPoints = tasks.reduce((sum, t) => sum + t.points, 0);

  const launch = () => {
    addCampaign({ client, objective, category, cities, ageBand, methodology, sampleSize, tasks, adminDirect: isAdmin });
    navigate(isAdmin ? "/agency?admin=1" : "/agency");
  };

  return (
    <DashboardShell role={isAdmin ? "admin" : "agency"} backTo={isAdmin ? "/agency?admin=1" : "/agency"}>
      <div className="max-w-3xl px-6 py-10 md:p-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-12" style={{ backgroundColor: ACCENT }} />
          <span className="font-mono text-xs font-medium uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
            New Campaign{isAdmin ? " (Admin Direct)" : ""}
          </span>
        </div>

        {/* Real flat-tab step indicator -- clickable at any time, exactly
            matching CreateCampaign.tsx's own `onClick={() => setStep(i+1)}`
            (no forward-progress gating on the tabs themselves; validation
            still blocks the Next button below). */}
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
            <Field label="Client Name">
              <ChipRow>
                {CLIENT_PRESETS.map((name) => (
                  <Chip key={name} active={client === name} accent={ACCENT} onClick={() => setClient(name)}>
                    {name}
                  </Chip>
                ))}
              </ChipRow>
            </Field>

            <Field label="Objective">
              <ChipRow>
                {OBJECTIVE_PRESETS.map((text) => (
                  <Chip key={text} active={objective === text} accent={ACCENT} onClick={() => setObjective(text)}>
                    {text}
                  </Chip>
                ))}
              </ChipRow>
            </Field>

            <Field label="Category — determines which contributor badges this reaches">
              <ChipRow>
                {CAMPAIGN_CATEGORIES.map((c) => (
                  <Chip key={c.value} active={category === c.value} accent={ACCENT} onClick={() => setCategory(c.value)}>
                    {c.label}
                  </Chip>
                ))}
              </ChipRow>
            </Field>

            <Field label="Target Cities * (never country-level)">
              <ChipRow>
                {CITY_OPTIONS.map((city) => (
                  <Chip key={city} active={cities.includes(city)} accent={ACCENT} onClick={() => toggleCity(city)}>
                    {city}
                  </Chip>
                ))}
              </ChipRow>
            </Field>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="Age Band">
                <ChipRow>
                  {AGE_BANDS.map((b) => (
                    <Chip key={b} active={ageBand === b} accent={ACCENT} onClick={() => setAgeBand(b)}>
                      {b}
                    </Chip>
                  ))}
                </ChipRow>
              </Field>
              <Field label="Sample Size">
                <ChipRow>
                  {SAMPLE_SIZES.map((n) => (
                    <Chip key={n} active={sampleSize === n} accent={ACCENT} onClick={() => setSampleSize(n)}>
                      {n.toLocaleString()}
                    </Chip>
                  ))}
                </ChipRow>
              </Field>
            </div>

            <Field label="Methodology">
              <ChipRow>
                {METHODOLOGIES.map((m) => (
                  <Chip key={m} active={methodology === m} accent={ACCENT} onClick={() => setMethodology(m)}>
                    {m}
                  </Chip>
                ))}
              </ChipRow>
            </Field>

            <div>
              <Button color={ACCENT} disabled={!step1Valid} onClick={() => setStep(1)}>
                Next: Tasks →
              </Button>
              {!step1Valid && (
                <p className="mt-2 text-xs text-pulse">Pick at least one target city to continue.</p>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <p className="text-sm text-muted">
              Add point-weighted collection tasks. Contributors earn points per task completed.
            </p>

            <div className="space-y-4">
              {tasks.map((task) => {
                const meta = TASK_TYPES.find((t) => t.key === task.type)!;
                return (
                  <div key={task.id} className="relative rounded border border-line p-5">
                    <button
                      onClick={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
                      aria-label={`Remove ${meta.label}`}
                      className="absolute end-4 top-4 text-muted hover:text-paper"
                    >
                      ✕
                    </button>
                    <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{meta.label}</div>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      Points
                      <PointsStepper value={task.points} onDecrement={() => adjustPoints(task.id, -POINTS_STEP)} onIncrement={() => adjustPoints(task.id, POINTS_STEP)} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              {TASK_TYPES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTasks((prev) => [...prev, newTask(t.key)])}
                  className="rounded-full border border-dashed border-line px-3.5 py-1.5 text-[13px] text-muted hover:border-visual hover:text-visual"
                >
                  + {t.label}
                </button>
              ))}
            </div>

            <div className="label-caps">Total: {totalPoints} pts per completed set</div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button variant="ghost" color={ACCENT} onClick={() => setStep(0)}>← Back</Button>
              <Button color={ACCENT} disabled={tasks.length === 0} onClick={() => setStep(2)}>
                Next: Review →
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="rounded border border-line p-6">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Campaign</div>
              <h3 className="mb-2 font-display text-xl font-bold text-paper">{client}</h3>
              <p className="text-sm text-muted">{objective}</p>
              <div className="mt-4 flex flex-wrap gap-6 text-sm">
                <span className="text-muted">{CAMPAIGN_CATEGORIES.find((c) => c.value === category)?.label}</span>
                <span className="text-muted">{cities.length} {cities.length === 1 ? "city" : "cities"}</span>
                <span className="text-muted">{ageBand}</span>
                <span className="text-muted">{methodology}</span>
                <span className="text-muted">{sampleSize.toLocaleString()} sample</span>
              </div>
            </div>

            <div className="divide-y divide-line rounded border border-line">
              <div className="p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                {tasks.length} Tasks
              </div>
              {tasks.map((task) => {
                const meta = TASK_TYPES.find((t) => t.key === task.type)!;
                return (
                  <div key={task.id} className="flex items-center justify-between p-4">
                    <span className="font-medium text-paper">{meta.label}</span>
                    <span className="text-sm text-muted">{task.points} pts</span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              <Button variant="ghost" color={ACCENT} onClick={() => setStep(1)}>← Back</Button>
              <Button color={ACCENT} onClick={launch}>Launch Campaign</Button>
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

// Sharp-cornered (rounded-none), matching the real app's own form-picker
// convention (OnboardingWizard.tsx's country/language pickers) -- rounded-
// full pills are reserved elsewhere in the real app for filter/status
// chips, not selectable form options.
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

function PointsStepper({ value, onDecrement, onIncrement }: { value: number; onDecrement: () => void; onIncrement: () => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onDecrement}
        aria-label="Decrease points"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-paper hover:border-white/25"
      >
        −
      </button>
      <span className="tabular w-9 text-center text-sm font-semibold text-paper">{value}</span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label="Increase points"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-paper hover:border-white/25"
      >
        +
      </button>
    </div>
  );
}
