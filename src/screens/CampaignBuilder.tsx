import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/Button";
import { ProgressSteps } from "@/components/ProgressSteps";
import { cn } from "@/lib/cn";
import { TASK_TYPES, type BuilderTask, type TaskTypeKey } from "@/data/demo";
import { useDemoState } from "@/state/DemoState";

const STEPS = ["Details", "Tasks", "Review"];
const ACCENT = "var(--visual)";

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

// Client name and objective were previously free-text fields -- both are
// now tap-only preset pickers (click-through audit, see commit message).
// Names deliberately don't overlap Sondela Cover/Kasi Brew/Tholulwazi
// Data (the existing portfolio) so a demo run never looks like it
// duplicated an existing campaign.
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

export function CampaignBuilder() {
  const navigate = useNavigate();
  const { addCampaign } = useDemoState();
  const [step, setStep] = useState(0);

  // Every field below starts pre-filled with a realistic default -- the
  // whole wizard is completable end to end with zero taps at all (every
  // "Next" is enabled from the first screen), but every field is still a
  // real, changeable tap target for a presenter who wants to show it off.
  const [client, setClient] = useState(CLIENT_PRESETS[0]);
  const [objective, setObjective] = useState(OBJECTIVE_PRESETS[0]);
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

  // Defensive only -- every field has a default, but a city chip can be
  // tapped back off down to zero, so this still guards the one way this
  // step could genuinely go empty.
  const step1Valid = client.length > 0 && cities.length > 0;

  const totalPoints = tasks.reduce((sum, t) => sum + t.points, 0);

  const launch = () => {
    addCampaign({ client, objective, cities, ageBand, methodology, sampleSize, tasks });
    navigate("/agency");
  };

  return (
    <div className="min-h-screen bg-ink">
      <TopBar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <button onClick={() => navigate("/agency")} className="mb-6 text-[13px] text-muted hover:text-paper">
          ← Back to Agency Command
        </button>

        <h1 className="mb-7 font-display text-2xl font-bold text-paper">New Campaign</h1>

        <div className="mb-10">
          <ProgressSteps steps={STEPS} current={step} accent={ACCENT} />
        </div>

        {step === 0 && (
          <div className="space-y-7">
            <Field label="Client Name">
              <ChipRow>
                {CLIENT_PRESETS.map((name) => (
                  <Chip key={name} active={client === name} onClick={() => setClient(name)}>
                    {name}
                  </Chip>
                ))}
              </ChipRow>
            </Field>

            <Field label="Objective">
              <ChipRow>
                {OBJECTIVE_PRESETS.map((text) => (
                  <Chip key={text} active={objective === text} onClick={() => setObjective(text)}>
                    {text}
                  </Chip>
                ))}
              </ChipRow>
            </Field>

            <Field label="Target Cities * (never country-level)">
              <ChipRow>
                {CITY_OPTIONS.map((city) => (
                  <Chip key={city} active={cities.includes(city)} onClick={() => toggleCity(city)}>
                    {city}
                  </Chip>
                ))}
              </ChipRow>
            </Field>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="Age Band">
                <ChipRow>
                  {AGE_BANDS.map((b) => (
                    <Chip key={b} active={ageBand === b} onClick={() => setAgeBand(b)}>
                      {b}
                    </Chip>
                  ))}
                </ChipRow>
              </Field>
              <Field label="Sample Size">
                <ChipRow>
                  {SAMPLE_SIZES.map((n) => (
                    <Chip key={n} active={sampleSize === n} onClick={() => setSampleSize(n)}>
                      {n.toLocaleString()}
                    </Chip>
                  ))}
                </ChipRow>
              </Field>
            </div>

            <Field label="Methodology">
              <ChipRow>
                {METHODOLOGIES.map((m) => (
                  <Chip key={m} active={methodology === m} onClick={() => setMethodology(m)}>
                    {m}
                  </Chip>
                ))}
              </ChipRow>
            </Field>

            <div className="pt-2">
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

            <div className="space-y-2.5">
              {tasks.map((task) => {
                const meta = TASK_TYPES.find((t) => t.key === task.type)!;
                return (
                  <div key={task.id} className="flex items-center gap-4 rounded-lg border border-line bg-panel px-4 py-3">
                    <span className="flex-1 text-sm font-medium text-paper">{meta.label}</span>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      Points
                      <PointsStepper value={task.points} onDecrement={() => adjustPoints(task.id, -POINTS_STEP)} onIncrement={() => adjustPoints(task.id, POINTS_STEP)} />
                    </div>
                    <button
                      onClick={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
                      aria-label={`Remove ${meta.label}`}
                      className="text-muted hover:text-pulse"
                    >
                      ✕
                    </button>
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

            <div className="flex gap-3 pt-2">
              <Button variant="ghost" onClick={() => setStep(0)}>← Back</Button>
              <Button color={ACCENT} disabled={tasks.length === 0} onClick={() => setStep(2)}>
                Next: Review →
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="card-surface space-y-4 p-6">
              <SummaryRow label="Client" value={client} />
              <SummaryRow label="Objective" value={objective} />
              <SummaryRow label="Cities" value={cities.join(", ")} />
              <SummaryRow label="Age Band" value={ageBand} />
              <SummaryRow label="Methodology" value={methodology} />
              <SummaryRow label="Sample Size" value={sampleSize.toLocaleString()} />
              <SummaryRow
                label="Tasks"
                value={tasks.map((t) => `${TASK_TYPES.find((m) => m.key === t.type)!.label} (${t.points}pt)`).join(", ")}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
              <Button color={ACCENT} onClick={launch}>Launch Campaign</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label-caps mb-2">{label}</div>
      {children}
    </div>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-left text-[13px] font-medium transition-colors",
        active ? "border-visual bg-visual/15 text-visual" : "border-line text-muted hover:border-white/25 hover:text-paper"
      )}
    >
      {children}
    </button>
  );
}

// Tap-only replacement for the old <input type="number"> points field --
// two big tap targets (+/-), never a keyboard.
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-line pb-3 last:border-0 last:pb-0">
      <span className="label-caps shrink-0">{label}</span>
      <span className="text-right text-sm text-paper">{value}</span>
    </div>
  );
}
