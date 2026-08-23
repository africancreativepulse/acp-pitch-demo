import { Link } from "react-router-dom";
import { AcpLogo } from "@/components/AcpLogo";
import { GlitchText } from "@/components/GlitchText";
import { DataNodes } from "@/components/DataNodes";
import { DecodeText, type DecodePhrase } from "@/components/DecodeText";
import { SONDELA } from "@/data/demo";

// Re-skin note: this screen previously built its own hero visual out of a
// faint, oversized SignalRing fed fabricated scores ("6 + (key.length * 7)
// % 4" -- decoration, not data). The real app tried and deliberately
// abandoned exactly that pattern for its own Splash hero (see DecodeText's
// own header comment: it kept reading as a generic "glowing tech chart"
// and encoded fake data as decoration, on top of it). Bringing in the
// real components meant bringing in that real design decision too, not
// just the real colors -- so the hero now decodes Sondela's own REAL
// evidence quotes (Ritual/Language/Taste/Soul Gap, all verbatim from the
// brief) instead of a fake shape. DataNodes provides the same "second
// ambient layer behind the hero" texture the real app's own /for-agencies
// and /for-contributors heroes use.
const HERO_PHRASES: DecodePhrase[] = [
  {
    eyebrow: "RITUAL · 8.6",
    text: SONDELA.evidence.ritual[0].kind === "quote" ? SONDELA.evidence.ritual[0].quote : "",
    meta: `${SONDELA.evidence.ritual[0].city} · Verified`,
  },
  {
    eyebrow: "LANGUAGE · 7.4",
    text: SONDELA.evidence.language[0].kind === "quote" ? SONDELA.evidence.language[0].quote : "",
    meta: `${SONDELA.evidence.language[0].city} · Verified`,
  },
  {
    eyebrow: "TASTE · 7.6",
    text: SONDELA.evidence.taste[0].kind === "quote" ? SONDELA.evidence.taste[0].quote : "",
    meta: `${SONDELA.evidence.taste[0].city} · Verified`,
  },
  {
    eyebrow: "SOUL GAP",
    text: SONDELA.soulGap!.evidence[0].kind === "quote" ? SONDELA.soulGap!.evidence[0].quote : "",
    meta: `${SONDELA.soulGap!.evidence[0].city} · Verified`,
  },
];

export function Splash() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 py-16">
      <DataNodes color="var(--visual)" opacity={30} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 40%, transparent 0%, var(--ink) 72%)" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-8">
          <AcpLogo markClassName="h-9 w-9" textClassName="text-base" />
        </div>

        <h1 className="max-w-2xl font-display text-[clamp(2.2rem,5.2vw,3.6rem)] font-extrabold leading-[1.05] tracking-tight text-paper">
          Africa&rsquo;s cultures,
          <br />
          read like <GlitchText className="text-visual">signals.</GlitchText>
        </h1>

        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
          Cultural Engagement Index scoring, traced back to what real people actually said —
          not a survey panel, not a guess.
        </p>

        <div className="mt-11 flex flex-col gap-3.5 sm:flex-row">
          {/* This tap is the role-choice step of onboarding (see
              Onboarding.tsx's own header comment) -- it routes into the
              Country/City/Language setup flow rather than straight to the
              main screen. */}
          <Link
            to="/onboarding/agency"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-visual px-7 py-3.5 font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-ink transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Enter as a Brand / Agency
          </Link>
          <Link
            to="/onboarding/contributor"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-sound/50 bg-sound/10 px-7 py-3.5 font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-sound transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Enter as a Contributor
          </Link>
        </div>

        {/* The real hero moment -- real Sondela evidence, decoding in
            sequence. A single accent (Pulse, the real app's own default
            brand accent) rather than per-quote dimension colors: the real
            DecodeText component takes one `accent` for the whole panel,
            not a per-phrase color, and doesn't expose which phrase is
            showing to a parent -- so this stays honest to the real
            component's actual API instead of forcing a mismatch. */}
        <DecodeText phrases={HERO_PHRASES} accent="var(--pulse)" className="mt-14 w-full max-w-xl text-left" />

        {/* Tertiary entry point -- deliberately below and visually
            quieter than the two primary role-choice CTAs so it doesn't
            compete with that fork moment, but still a genuine top-level
            path into the platform's other half (field capture, review,
            admin oversight), not something only reachable by accident. */}
        <Link to="/operations" className="mt-8 text-[13px] text-muted hover:text-paper hover:underline">
          See how the data gets collected & verified →
        </Link>

        <p className="mt-4 label-caps !text-[10px]">Pitch prototype · No login required</p>
      </div>
    </div>
  );
}
