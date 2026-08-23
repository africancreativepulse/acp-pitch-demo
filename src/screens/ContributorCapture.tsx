import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Mic, Camera, Check } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PhoneFrame } from "@/components/PhoneFrame";
import { WaveformStatic } from "@/components/WaveformStatic";
import { AcpMark } from "@/components/AcpMark";
import { cn } from "@/lib/cn";
import { CONTRIBUTOR_TASK, REWARD_OPTIONS, SONDELA } from "@/data/demo";

type TaskState = "pending" | "active" | "done";
type TaskKey = "voice" | "photo";

const ACCENT = "var(--sound)";

/**
 * Ported structural pattern from the real app's contributor/
 * CampaignTasks.tsx for everything OUTSIDE the device: the real page's
 * own header (accent rule + eyebrow + H1 + subtitle, inside DashboardShell,
 * max-w-3xl) and its real task-list interaction shape -- an expandable row
 * per task (icon + title + points, a Start/Cancel button, tapping Start
 * reveals the capture UI inline below it; completed rows get a checkmark
 * + green tint + strikethrough title) -- applied INSIDE the phone frame.
 *
 * The phone frame itself stays: an explicit, deliberate choice from the
 * original brief ("Contributor Capture in a phone-frame mockup"), not a
 * structural oversight this pass is meant to correct. The real
 * CampaignTasks.tsx page is a normal responsive web view (no device
 * chrome at all) -- adopting its real task-ROW pattern while keeping the
 * phone-frame device is the right combination: real interaction shape,
 * deliberate presentation choice preserved.
 */
export function ContributorCapture() {
  const [activeTask, setActiveTask] = useState<TaskKey | null>(null);
  const [voiceState, setVoiceState] = useState<TaskState>("pending");
  const [photoState, setPhotoState] = useState<TaskState>("pending");
  const [seconds, setSeconds] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [reward, setReward] = useState(REWARD_OPTIONS[0]);
  const [balance, setBalance] = useState(340);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (voiceState === "active") {
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [voiceState]);

  const toggleRecording = () => {
    if (voiceState === "pending") {
      setSeconds(0);
      setVoiceState("active");
    } else if (voiceState === "active") {
      setVoiceState("done");
      setActiveTask(null);
    } else {
      setVoiceState("pending");
      setSeconds(0);
    }
  };

  const capturePhoto = () => {
    setPhotoState("done");
    setActiveTask(null);
  };

  const bothDone = voiceState === "done" && photoState === "done";

  const submit = () => {
    setSubmitted(true);
    setBalance((b) => b + CONTRIBUTOR_TASK.points);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(1, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <DashboardShell role="contributor">
      <div className="max-w-3xl px-4 pb-[60px] pt-[30px] sm:px-6 md:px-10">
        <div className="mb-2.5 flex items-center gap-2.5">
          <div className="h-0.5 w-[30px]" style={{ backgroundColor: ACCENT }} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>My Tasks</span>
        </div>
        <h1 className="mb-2 font-display text-2xl font-bold text-paper sm:text-[28px]">{SONDELA.client}</h1>
        <p className="mb-8 text-sm text-muted sm:mb-10 sm:text-base">
          Complete both tasks below to earn points. Your device stays offline until you submit.
        </p>

        <div className="mb-6">
          <Link to={`/agency/campaign/${SONDELA.id}`} className="text-[13px] text-sound hover:underline">
            View Agency Read →
          </Link>
        </div>

        <PhoneFrame>
          <div className="flex h-full flex-col px-4 pb-6">
            <div className="mb-4 flex items-center justify-between">
              <AcpMark className="h-4 w-auto text-paper" />
              <span className="sr-only">African Creative Pulse</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-language/40 bg-language/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-language">
                <span className="h-1.5 w-1.5 rounded-full bg-language" />
                Offline
              </span>
            </div>

            <div className="mb-1 label-caps">{CONTRIBUTOR_TASK.campaignClient}</div>
            <h2 className="mb-4 font-display text-lg font-bold leading-snug text-paper">{CONTRIBUTOR_TASK.prompt}</h2>

            <div className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-2.5 py-1 text-[11px] text-muted">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
                <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              {CONTRIBUTOR_TASK.location}
            </div>

            <div className="mb-5 space-y-2.5">
              {/* Voice Note row */}
              <TaskRow
                icon={Mic}
                title="Voice Note"
                points={CONTRIBUTOR_TASK.points}
                state={voiceState}
                isActive={activeTask === "voice"}
                onToggle={() => setActiveTask(activeTask === "voice" ? null : "voice")}
              >
                {voiceState === "active" ? (
                  <div className="flex flex-col items-center py-2">
                    <WaveformStatic color="#FF5C93" height={30} />
                    <div className="tabular mt-2 font-mono text-sm text-paper">{mm}:{ss}</div>
                  </div>
                ) : (
                  <p className="py-1 text-[12.5px] text-muted">Tap to record your answer.</p>
                )}
                <button
                  onClick={toggleRecording}
                  className={cn(
                    "mx-auto mt-3 flex h-14 w-14 items-center justify-center rounded-full transition-colors",
                    voiceState === "active" ? "animate-rec-pulse bg-pulse" : "bg-pulse"
                  )}
                  aria-label={voiceState === "active" ? "Stop recording" : "Start recording"}
                >
                  {voiceState === "active" ? (
                    <span className="h-4 w-4 rounded-sm bg-ink" />
                  ) : (
                    <span className="h-4 w-4 rounded-full bg-ink" />
                  )}
                </button>
              </TaskRow>

              {/* Photo row */}
              <TaskRow
                icon={Camera}
                title="Photo"
                points={10}
                state={photoState}
                isActive={activeTask === "photo"}
                onToggle={() => setActiveTask(activeTask === "photo" ? null : "photo")}
              >
                <p className="mb-3 text-[12.5px] text-muted">Tap to attach a photo of your surroundings.</p>
                <button
                  onClick={capturePhoto}
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pulse transition-colors"
                  aria-label="Attach photo"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2">
                    <rect x="3" y="6" width="18" height="13" rx="2" />
                    <circle cx="12" cy="12.5" r="3.2" />
                  </svg>
                </button>
              </TaskRow>
            </div>

            <div className="flex-1" />

            <div className="mb-4 rounded-card border border-line bg-panel p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="label-caps">Balance</span>
                <span className="tabular font-mono text-lg font-bold text-sound">{balance} pts</span>
              </div>
              <div className="flex gap-1.5">
                {REWARD_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setReward(opt)}
                    className={cn(
                      "flex-1 rounded-full border px-2 py-1.5 text-[10.5px] font-medium transition-colors",
                      reward === opt ? "border-sound bg-sound/15 text-sound" : "border-line text-muted"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {submitted ? (
              <div className="rounded-card border border-band-green/40 bg-band-green/10 p-4 text-center">
                <div className="text-[13px] font-semibold text-band-green">Reward paid — +{CONTRIBUTOR_TASK.points} points</div>
                <div className="mt-1 text-[11px] text-muted">Cash-out via {reward} syncs once you're back online.</div>
              </div>
            ) : (
              <button
                disabled={!bothDone}
                onClick={submit}
                className="w-full rounded-full bg-sound py-3 text-sm font-semibold text-ink transition-opacity disabled:opacity-30"
              >
                Submit Tasks
              </button>
            )}

            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-language" />
              Saved locally — will sync when online.
            </div>
          </div>
        </PhoneFrame>
      </div>
    </DashboardShell>
  );
}

function TaskRow({
  icon: Icon,
  title,
  points,
  state,
  isActive,
  onToggle,
  children,
}: {
  icon: typeof Mic;
  title: string;
  points: number;
  state: TaskState;
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const completed = state === "done";
  return (
    <div
      className="rounded border transition-colors"
      style={completed ? { borderColor: "rgba(200,255,77,0.3)", backgroundColor: "rgba(200,255,77,0.05)" } : { borderColor: "var(--line)" }}
    >
      <div className="flex items-center justify-between gap-3 p-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded"
            style={completed ? { backgroundColor: "rgba(200,255,77,0.16)" } : { backgroundColor: "var(--panel)" }}
          >
            {completed ? <Check className="h-4 w-4 text-sound" /> : <Icon className="h-4 w-4 text-muted" />}
          </div>
          <div className="min-w-0">
            <h3 className={cn("truncate text-[13px] font-medium", completed ? "text-muted line-through" : "text-paper")}>{title}</h3>
            <span className="font-mono text-[10px] font-medium text-sound">{points} pts</span>
          </div>
        </div>
        {!completed && (
          <button
            onClick={onToggle}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors",
              isActive ? "border-pulse bg-pulse text-ink" : "border-line text-muted hover:border-white/25 hover:text-paper"
            )}
          >
            {isActive ? "Cancel" : "Start"}
          </button>
        )}
      </div>

      {isActive && !completed && (
        <div className="border-t border-line px-3.5 pb-4 pt-3">{children}</div>
      )}
    </div>
  );
}
