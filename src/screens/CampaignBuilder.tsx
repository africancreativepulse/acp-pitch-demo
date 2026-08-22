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

const AGE_BANDS = ["18–24", "18–34", "25–44", "35–54", "55+"];
const METHODOLOGIES = ["Digital Only", "Field Only", "Digital + Field Hybrid"];

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

  const [client, setClient] = useState("");
  const [objective, setObjective] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [ageBand, setAgeBand] = useState(AGE_BANDS[1]);
  const [methodology, setMethodology] = useState(METHODOLOGIES[2]);
  const [sampleSize, setSampleSize] = useState(300);
  const [tasks, setTasks] = useState<BuilderTask[]>([newTask("survey"), newTask("voice_note")]);

  const toggleCity = (city: string) =>
    setCities((prev) => (prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]));

  const step1Valid = client.trim().length > 0 && cities.length > 0;

  const totalPoints = tasks.reduce((sum, t) => sum + t.points, 0);

  const launch = () => {
    addCampaign({ client: client.trim(), objective, cities, ageBand, methodology, sampleSize, tasks });
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
            <Field label="Client Name *">
              <input
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. Sondela Cover"
                className={inputCls}
              />
            </Field>

            <Field label="Objective">
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="What are you trying to understand?"
                rows={3}
                className={inputCls}
              />
            </Field>

            <Field label="Target Cities * (never country-level)">
              <div className="flex flex-wrap gap-2">
                {CITY_OPTIONS.map((city) => {
                  const active = cities.includes(city);
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => toggleCity(city)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                        active ? "border-visual bg-visual/15 text-visual" : "border-line text-muted hover:border-white/25 hover:text-paper"
                      )}
                    >
                      {city}
                    </button>
                  );
                })}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-6">
              <Field label="Age Band">
                <select value={ageBand} onChange={(e) => setAgeBand(e.target.value)} className={inputCls}>
                  {AGE_BANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </Field>
              <Field label="Sample Size">
                <input
                  type="number"
                  min={0}
                  value={sampleSize}
                  onChange={(e) => setSampleSize(Number(e.target.value))}
                  className={cn(inputCls, "tabular")}
                />
              </Field>
            </div>

            <Field label="Methodology">
              <div className="flex flex-wrap gap-2">
                {METHODOLOGIES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethodology(m)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                      methodology === m ? "border-visual bg-visual/15 text-visual" : "border-line text-muted hover:border-white/25 hover:text-paper"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </Field>

            <div className="pt-2">
              <Button color={ACCENT} disabled={!step1Valid} onClick={() => setStep(1)}>
                Next: Tasks →
              </Button>
              {!step1Valid && (
                <p className="mt-2 text-xs text-pulse">Client name and at least one target city are required.</p>
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
                    <label className="flex items-center gap-2 text-xs text-muted">
                      Points
                      <input
                        type="number"
                        min={0}
                        value={task.points}
                        onChange={(e) =>
                          setTasks((prev) =>
                            prev.map((t) => (t.id === task.id ? { ...t, points: Number(e.target.value) } : t))
                          )
                        }
                        className="w-16 rounded border border-line bg-ink px-2 py-1 text-center text-sm text-paper tabular"
                      />
                    </label>
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
              <SummaryRow label="Objective" value={objective || "—"} />
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

const inputCls =
  "w-full rounded-lg border border-line bg-panel px-3.5 py-2.5 text-sm text-paper placeholder:text-muted/60 outline-none focus:border-visual/60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label-caps mb-2">{label}</div>
      {children}
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
