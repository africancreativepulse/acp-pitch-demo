import { useState } from "react";
import { Link } from "react-router-dom";
import { AcpLogo } from "@/components/AcpLogo";
import { GlitchText } from "@/components/GlitchText";
import { DataNodes } from "@/components/DataNodes";
import { DecodeText, type DecodePhrase } from "@/components/DecodeText";
import { SONDELA, ARABIC_HERO, TOTAL_SUPPORTED_LANGUAGES } from "@/data/demo";

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
  // Part D, item 12 -- the platform's real full right-to-left support,
  // shown working rather than just claimed. Scoped to this hero's own
  // headline/subtitle/CTA copy, real Arabic translations (ARABIC_HERO),
  // not machine-flipped English. The DecodeText evidence panel below
  // stays dir="ltr" even while the rest of the page is RTL -- those are
  // real verbatim quotes (isiZulu/English), not translated content, and
  // flipping their direction would misrepresent them as Arabic source
  // material they aren't.
  const [rtl, setRtl] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col bg-ink" dir={rtl ? "rtl" : "ltr"}>
      {/* Simple logo-only header, matching Onboarding's own header exactly
          -- consistent branding chrome across the pre-shell screens
          (Splash, Onboarding, Operations Hub all share this now), and the
          one place on Splash a language toggle belongs. */}
      <header className="relative z-10 border-b border-line px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <AcpLogo markClassName="h-6 w-6" textClassName="text-xs" />
          <button
            onClick={() => setRtl((v) => !v)}
            className="text-[13px] text-muted hover:text-paper"
            dir="ltr"
          >
            {rtl ? ARABIC_HERO.toggleBack : "عربي"}
          </button>
        </div>
      </header>

      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16">
        <DataNodes color="var(--visual)" opacity={70} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 40%, transparent 0%, var(--ink) 72%)" }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {rtl && (
            <div className="mb-6 label-caps !text-[10px]" style={{ color: "var(--visual)" }}>
              {ARABIC_HERO.eyebrow}
            </div>
          )}

          {rtl ? (
            <h1 className="max-w-2xl font-display text-[clamp(2.2rem,5.2vw,3.6rem)] font-extrabold leading-[1.05] tracking-tight text-paper">
              {ARABIC_HERO.headlineLine1}
              <br />
              <GlitchText className="text-visual">{ARABIC_HERO.headlineLine2}</GlitchText>
            </h1>
          ) : (
            <h1 className="max-w-2xl font-display text-[clamp(2.2rem,5.2vw,3.6rem)] font-extrabold leading-[1.05] tracking-tight text-paper">
              Africa&rsquo;s cultures,
              <br />
              read like <GlitchText className="text-visual">signals.</GlitchText>
            </h1>
          )}

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
            {rtl
              ? ARABIC_HERO.subtitle
              : "Cultural Engagement Index scoring, traced back to what real people actually said — not a survey panel, not a guess."}
          </p>

          <div className="mt-11 flex flex-col gap-3.5 sm:flex-row">
            <Link
              to="/onboarding/agency"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-visual px-7 py-3.5 font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-ink transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              {rtl ? ARABIC_HERO.ctaAgency : "Enter as a Brand / Agency"}
            </Link>
            <Link
              to="/onboarding/contributor"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-sound/50 bg-sound/10 px-7 py-3.5 font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-sound transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              {rtl ? ARABIC_HERO.ctaContributor : "Enter as a Contributor"}
            </Link>
          </div>

          <div dir="ltr">
            <DecodeText phrases={HERO_PHRASES} accent="var(--pulse)" className="mt-14 w-full max-w-xl text-left" />
          </div>

          <Link to="/operations" className="mt-8 text-[13px] text-muted hover:text-paper hover:underline">
            {rtl ? "شاهد كيف يتم جمع البيانات والتحقق منها ←" : "See how the data gets collected & verified →"}
          </Link>

          <p className="mt-4 label-caps !text-[10px]">
            {rtl ? "نموذج تجريبي · لا يتطلب تسجيل دخول" : "Pitch prototype · No login required"}
          </p>

          <p className="mt-2 text-[11px] text-muted">
            {rtl
              ? `أنت تشاهد الآن باللغة العربية — واحدة من ${TOTAL_SUPPORTED_LANGUAGES} لغة مدعومة، بدعم كامل من اليمين إلى اليسار.`
              : `${TOTAL_SUPPORTED_LANGUAGES} languages supported, including full Arabic right-to-left — tap "عربي" above to see it live.`}
          </p>
        </div>
      </div>
    </div>
  );
}
