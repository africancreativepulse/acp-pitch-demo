import { Link } from "react-router-dom";
import { SignalRing } from "@/components/SignalRing";
import { CEI_ORDER, CEI_COLOR, CEI_LABEL } from "@/data/demo";

const GHOST_DATA = CEI_ORDER.map((key) => ({
  key,
  label: CEI_LABEL[key],
  score: 6 + ((key.length * 7) % 4),
  color: CEI_COLOR[key],
}));

export function Splash() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6">
      {/* faint background texture -- decorative only, not a real "read" */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.14]">
        <SignalRing data={GHOST_DATA} size={640} />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 40%, transparent 0%, #0B0C10 72%)" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-8 flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-visual/15 font-display text-lg font-extrabold text-visual">
            A
          </span>
          <span className="font-display text-xl font-bold uppercase tracking-[0.14em] text-paper">
            ACP
          </span>
        </div>

        <h1 className="max-w-2xl font-display text-[clamp(2.2rem,5.2vw,3.6rem)] font-extrabold leading-[1.05] tracking-tight text-paper">
          Africa&rsquo;s cultures,
          <br />
          read like <span className="text-visual">signals.</span>
        </h1>

        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
          Cultural Engagement Index scoring, traced back to what real people actually said —
          not a survey panel, not a guess.
        </p>

        <div className="mt-11 flex flex-col gap-3.5 sm:flex-row">
          <Link
            to="/agency"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-visual px-7 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Enter as a Brand / Agency
          </Link>
          <Link
            to="/contribute"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-sound/50 bg-sound/10 px-7 py-3.5 text-sm font-semibold text-sound transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Enter as a Contributor
          </Link>
        </div>

        <p className="mt-8 label-caps !text-[10px]">Pitch prototype · No login required</p>
      </div>
    </div>
  );
}
