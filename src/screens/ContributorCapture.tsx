import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PhoneFrame } from "@/components/PhoneFrame";
import { WaveformStatic } from "@/components/WaveformStatic";
import { AcpMark } from "@/components/AcpMark";
import { cn } from "@/lib/cn";
import { CONTRIBUTOR_TASK, REWARD_OPTIONS, SONDELA } from "@/data/demo";

type TaskState = "pending" | "active" | "done";

export function ContributorCapture() {
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
    } else {
      setVoiceState("pending");
      setSeconds(0);
    }
  };

  const bothDone = voiceState === "done" && photoState === "done";

  const submit = () => {
    setSubmitted(true);
    setBalance((b) => b + CONTRIBUTOR_TASK.points);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(1, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-ink px-6 py-10">
      <div className="mx-auto mb-6 flex max-w-md items-center justify-between">
        <Link to="/" className="text-[13px] text-muted hover:text-paper">← Splash</Link>
        <Link to={`/agency/campaign/${SONDELA.id}`} className="text-[13px] text-sound hover:underline">
          View Agency Read →
        </Link>
      </div>

      <PhoneFrame>
        <div className="flex h-full flex-col px-4 pb-6">
          {/* status area */}
          <div className="mb-4 flex items-center justify-between">
            {/* Icon-only, matching real phone status-bar branding
                convention -- also the small/collapsed size the real
                AcpMark is specifically designed to still read correctly
                at. */}
            <AcpMark className="h-4 w-auto text-paper" />
            <span className="sr-only">African Creative Pulse</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-language/40 bg-language/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-language">
              <span className="h-1.5 w-1.5 rounded-full bg-language" />
              Offline
            </span>
          </div>

          <div className="mb-1 label-caps">{CONTRIBUTOR_TASK.campaignClient}</div>
          <h1 className="mb-4 font-display text-lg font-bold leading-snug text-paper">{CONTRIBUTOR_TASK.prompt}</h1>

          {/* GPS chip */}
          <div className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-2.5 py-1 text-[11px] text-muted">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
              <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            {CONTRIBUTOR_TASK.location}
          </div>

          {/* voice note task */}
          <div className="mb-4 rounded-card border border-line bg-panel p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="label-caps">Voice Note · {CONTRIBUTOR_TASK.points} pts</span>
              {voiceState === "done" && <span className="text-[11px] font-semibold text-band-green">Captured</span>}
            </div>

            {voiceState === "active" ? (
              <div className="flex flex-col items-center py-2">
                <WaveformStatic color="#FF5C93" height={30} />
                <div className="tabular mt-2 font-mono text-sm text-paper">{mm}:{ss}</div>
              </div>
            ) : voiceState === "done" ? (
              <WaveformStatic color="#2FBF71" height={26} />
            ) : (
              <p className="py-1 text-[12.5px] text-muted">Tap to record your answer.</p>
            )}

            <button
              onClick={toggleRecording}
              className={cn(
                "mx-auto mt-3 flex h-14 w-14 items-center justify-center rounded-full transition-colors",
                voiceState === "active" ? "animate-rec-pulse bg-pulse" : voiceState === "done" ? "bg-white/10" : "bg-pulse"
              )}
              aria-label={voiceState === "active" ? "Stop recording" : voiceState === "done" ? "Re-record" : "Start recording"}
            >
              {voiceState === "done" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--paper)" strokeWidth="2">
                  <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3.5 15a9 9 0 1 0 2.13-9.36L1 10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : voiceState === "active" ? (
                <span className="h-4 w-4 rounded-sm bg-ink" />
              ) : (
                <span className="h-4 w-4 rounded-full bg-ink" />
              )}
            </button>
          </div>

          {/* photo task */}
          <button
            onClick={() => setPhotoState((s) => (s === "done" ? "pending" : "done"))}
            className="mb-5 flex items-center gap-3 rounded-card border border-line bg-panel p-4 text-left"
          >
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border",
                photoState === "done" ? "border-band-green bg-band-green/10" : "border-line bg-white/[0.03]"
              )}
            >
              {photoState === "done" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2FBF71" strokeWidth="2">
                  <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.6">
                  <rect x="3" y="6" width="18" height="13" rx="2" />
                  <circle cx="12" cy="12.5" r="3.2" />
                  <path d="M8 6l1.4-2h5.2L16 6" />
                </svg>
              )}
            </div>
            <div>
              <div className="text-[13px] font-medium text-paper">Photo · 10 pts</div>
              <div className="text-[11.5px] text-muted">{photoState === "done" ? "Captured" : "Tap to attach a photo"}</div>
            </div>
          </button>

          <div className="flex-1" />

          {/* points + rewards rail */}
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
  );
}
