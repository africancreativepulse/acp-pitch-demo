import { Link } from "react-router-dom";
import { DemoHeader } from "@/components/DemoHeader";
import { DotGrid } from "@/components/DotGrid";
import { GlitchText } from "@/components/GlitchText";
import { SignalRing } from "@/components/SignalRing";
import { CountUp } from "@/components/CountUp";
import { CULTURAL_LAYERS } from "@/data/demo";

/**
 * REFERENCE CORRECTION: this screen was previously built against Auth.tsx
 * / BrandsSplash.tsx (the "/for-agencies" fork splash) -- both real, but
 * neither is the real homepage. Confirmed by reading the real
 * pages/Index.tsx, which at the time rendered (in order) Navbar → Hero →
 * WaveformRibbon → Features → CEISection → CDISection → CulturalLayers →
 * LiveNetwork → Testimonials → Participate → Pricing → CTA → Footer
 * (CulturalLayers later retired as its own section, merged into
 * CEISection's own cards -- see this file's Cultural Dimensions section
 * further down for how that parity move landed here), and its Hero.tsx
 * specifically: DotGrid background (not DataNodes -- that's
 * BrandsSplash/ContributorSplash-only), the six-spoke SignalRing hero
 * visual (not DecodeText's character-scramble -- also fork-splash/Auth-
 * only), Pulse orange as the accent (not Visual blue -- Pulse is the
 * real neutral brand/primary-CTA color; Visual blue is specifically the
 * agency-fork accent, confirmed in both Hero.tsx's own header comment and
 * tokens.css), and real copy: tagline "Positioning vs. Reality"
 * (hero.tagline), headline "Africa's cultures, / read like signals."
 * (hero.headline1/2, GlitchText on "signals." only), subheadline "Scored
 * by contributors on the ground, with every score traceable to what
 * someone actually said." (hero.subheadline) -- all copied verbatim from
 * the real app's i18n/translations.ts, English locale.
 *
 * This demo's own routing (CTAs → /onboarding/:role, not /for-agencies or
 * /for-contributors -- those fork-splash pages don't exist in this demo)
 * and button copy stay this project's own, since nothing in the brief
 * asked for a literal route/label match, only the real hero identity.
 *
 * Part D item 9's Cultural Layers content sits below the hero -- originally
 * its own standalone section, copied verbatim from the real landing/
 * CulturalLayers.tsx + its i18n strings. Later merged with the CEI
 * dimensions (real-app parity, see CULTURAL_LAYERS' own comment in
 * demo.ts) rather than removed -- still the same real content, same
 * position on the page.
 */
export function Splash() {
  return (
    <div className="relative flex min-h-screen flex-col bg-ink">
      {/* Sign In (returning-visitor path) -- same real gap just found and
          fixed on the live app's actual homepage, mirrored here, now in
          the real matching position too (header, not page body -- see
          DemoHeader's own showSignIn comment for the visual-parity fix). */}
      <DemoHeader showBack={false} showWrapUp={false} showSignIn />

      <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16">
        <DotGrid />
        <div
          className="pointer-events-none absolute -top-[120px] end-[6%] z-0 h-[420px] w-[420px] animate-ds-drift-1 rounded-full blur-[90px]"
          style={{ background: "radial-gradient(circle, rgba(255,90,41,0.22), transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-[100px] start-[2%] z-0 h-[340px] w-[340px] animate-ds-drift-2 rounded-full blur-[90px]"
          style={{ background: "radial-gradient(circle, rgba(155,107,255,0.16), transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative z-[1] mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-14 py-8 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-[22px] flex items-center gap-[10px]">
              <div className="h-0.5 w-[34px] bg-pulse" />
              <span className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.24em] text-pulse">
                Positioning vs. Reality
              </span>
            </div>

            <h1 className="mb-6 font-display text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight text-paper">
              <span className="block">Africa&rsquo;s cultures,</span>
              <span className="block">
                read like <GlitchText className="text-pulse">signals.</GlitchText>
              </span>
            </h1>

            <p className="mb-9 max-w-[440px] text-[15px] leading-relaxed text-muted">
              Scored by contributors on the ground, with every score traceable to what someone
              actually said.
            </p>

            <div className="mb-9 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
              <Link
                to="/onboarding/agency"
                className="inline-flex items-center justify-center gap-2 rounded-sm border bg-ink px-7 py-3.5 font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-visual transition-colors hover:bg-visual hover:text-ink"
                style={{ borderColor: "var(--visual)" }}
              >
                Enter as a Brand / Agency
              </Link>
              <Link
                to="/onboarding/contributor"
                className="inline-flex items-center justify-center gap-2 rounded-sm border bg-ink px-7 py-3.5 font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-sound transition-colors hover:bg-sound hover:text-ink"
                style={{ borderColor: "var(--sound)" }}
              >
                Enter as a Contributor
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 border-t border-line pt-7">
              <div>
                <CountUp target={6} className="block font-mono text-[26px] font-semibold text-paper" />
                <div className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">CEI Dimensions</div>
              </div>
            </div>
          </div>

          <div>
            <div className="relative mx-auto aspect-square w-full max-w-[420px]">
              <SignalRing />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-1.5 font-mono text-[13px] uppercase tracking-[0.18em] text-muted">
                  <i className="h-1.5 w-1.5 rounded-full bg-sound" />
                  Sample Signal
                </div>
                <div className="my-1 font-display text-[52px] font-bold text-paper">88</div>
                <div className="font-mono text-[13px] uppercase tracking-[0.18em] text-muted">Cultural Engagement Index</div>
              </div>
            </div>
            <div className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
              Illustrative sample, not measured results
            </div>
          </div>
        </div>
      </div>

      {/* Real-app parity: was "Five Cultural Layers" as its own section,
          verbatim from the real app's own (now-retired) landing/
          CulturalLayers.tsx. Merged with the CEI dimensions instead, same
          Neil/Garth decision as the live app -- see CULTURAL_LAYERS' own
          header comment in demo.ts for exactly what changed and why this
          demo's own merge runs the opposite direction (score added to the
          existing layer cards, not layer content added to CEI cards --
          this page has no per-dimension CEI card section, only the single
          aggregate SignalRing above, to merge into). */}
      <div className="relative border-t border-line bg-panel/40 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-12 bg-pulse" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-pulse">Cultural Intelligence</span>
          </div>
          <h2 className="mb-2 font-display text-2xl font-bold leading-tight text-paper sm:text-3xl">Six Cultural Dimensions</h2>
          <p className="mb-10 max-w-lg text-[15px] text-muted">Complete intelligence through six interconnected lenses.</p>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-line sm:grid-cols-2 lg:grid-cols-3">
            {CULTURAL_LAYERS.map((layer) => (
              <div key={layer.key} className="flex h-full flex-col bg-ink p-[26px_22px] transition-colors duration-300 hover:bg-panel">
                <div className="mb-3 flex items-center justify-between">
                  <div className="h-[3px] w-[34px] rounded-sm" style={{ backgroundColor: layer.color }} />
                  <span className="font-mono text-xs font-semibold" style={{ color: layer.color }}>{layer.pct}</span>
                </div>
                <h3 className="mb-2 font-display text-base font-bold text-paper">{layer.label}</h3>
                {layer.description ? (
                  <>
                    <p className="mb-5 min-h-[48px] flex-1 text-[12.5px] leading-relaxed text-muted">{layer.description}</p>
                    <span className="font-mono text-[11px] font-semibold" style={{ color: layer.color }}>
                      {layer.example}
                    </span>
                  </>
                ) : (
                  <p className="mb-5 flex-1 text-[12.5px] italic leading-relaxed text-muted">{layer.placeholder}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
        <Link to="/operations" className="text-[13px] text-muted hover:text-paper hover:underline">
          See how the data gets collected & verified →
        </Link>
        <p className="label-caps !text-[10px]">Pitch prototype · No login required</p>
      </div>
    </div>
  );
}
