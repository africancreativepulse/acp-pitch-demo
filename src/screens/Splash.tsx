import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { DotGrid } from "@/components/DotGrid";
import { GlitchText } from "@/components/GlitchText";
import { SignalRing } from "@/components/SignalRing";
import { CountUp } from "@/components/CountUp";
import { DepthGauge } from "@/components/DepthGauge";
import { WaveformRibbon } from "@/components/WaveformRibbon";
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
 * This demo's own routing stays project-specific (CTAs → /onboarding/:role,
 * not /for-agencies or /for-contributors -- those fork-splash pages don't
 * exist in this demo). Button COPY, though, is now literal real-app
 * parity, not invented text: "Brands & Agencies →" / "Contributors →",
 * copied verbatim from the real i18n keys (participate.brands/
 * participate.contributors, English locale), arrow included (real
 * Hero.tsx's own DirArrow -- a plain "→" here, since this demo has no
 * RTL/i18n system for DirArrow's own mirroring to matter). An earlier
 * pass used invented labels ("Enter as a Brand / Agency", "Enter as a
 * Contributor") reasoning that nothing required a literal match --
 * reverted on direct instruction that the info itself, not just the
 * layout, needs to mirror the real site.
 *
 * Part D item 9's Cultural Layers content sits below the hero -- originally
 * its own standalone section, copied verbatim from the real landing/
 * CulturalLayers.tsx + its i18n strings. Later merged with the CEI
 * dimensions (real-app parity, see CULTURAL_LAYERS' own comment in
 * demo.ts) rather than removed -- still the same real content, same
 * position on the page.
 *
 * Real-app parity, Change 1 (Neil's explicit direction): this screen used
 * to be just Hero + Cultural Dimensions, with the role-choice CTAs
 * ("Enter as...") sitting directly in the Hero. Now the full real homepage
 * story plays out below it too (Hero -> WaveformRibbon -> Features -> CEI
 * -> WaveformRibbon -> CDI). An intermediate pass had moved the CTAs out
 * of the Hero into their own closing section after that story, reasoning
 * it as a deliberate demo-specific pacing choice -- reverted on direct
 * instruction to match the real Hero.tsx exactly instead: its own CTAs
 * are immediately visible, un-deferred, so this demo's now are too. The
 * closing section that used to hold them is gone; the CTAs live only in
 * the Hero now, matching real Index.tsx's own page structure (no second,
 * redundant role-choice moment at the bottom the way the real page
 * doesn't have one either).
 *
 * Features and CDI are new here -- neither existed anywhere in this demo
 * before. Features is a straight port of the real landing/Features.tsx's
 * own 2-up CEI/CDI teaser row (real English copy, "Learn more ↓" anchors
 * pointing down to the fuller sections below -- #pricing dropped, since
 * no Pricing section exists in this demo's own scope). CDI is a straight
 * port of the real landing/CDISection.tsx (same "Lagos Cyberpunk: 7.8/10"
 * illustrative sample, same real copy) -- the DepthGauge component itself
 * was already fully ported and in use elsewhere (CampaignDetail.tsx), so
 * this is composition, not new component work. Both WaveformRibbon calls
 * in this file mirror real Index.tsx's own two calls within this demo's
 * ported scope exactly (size="tall" after Hero, default size after CDI --
 * its third call, after Participate, isn't in scope since Participate
 * itself is excluded). LiveNetwork/Testimonials/Participate/Pricing/CTA
 * are deliberately excluded from this port (Testimonials is flag-gated
 * off on the real live site over a real fabricated-quotes risk;
 * Participate IS the real app's own role-choice mechanism, which would
 * duplicate the Hero's own CTAs above; the rest are secondary conversion
 * elements, not part of the Hero/Features/CEI/CDI methodology story Neil
 * named explicitly) -- confirmed scope, not a silent cut.
 */
export function Splash() {
  return (
    <div className="relative flex min-h-screen flex-col bg-ink">
      {/* Real-app parity, Change 2: the real marketing Navbar itself now
          lives here too, not just DemoHeader's own borrowed Sign In
          affordance -- see Navbar.tsx's own header comment. Sign In is
          unconditional on Navbar now (no prop needed); Back/Wrap Up still
          suppressed here, same reasoning as before (fresh load has
          nowhere real to go back to, and the tour hasn't started yet). */}
      <Navbar showBack={false} showWrapUp={false} />

      {/* Real-app parity: real Hero.tsx uses pb-16 pt-[150px] md:pb-24 --
          150px of top clearance because its OWN fixed navbar overlays the
          page (content needs deliberate room reserved to not sit behind
          it). This demo's Navbar is sticky, not fixed (see Navbar.tsx's
          own header comment for why), so its 68px height already pushes
          Hero down in normal document flow -- meaning py-16 (64px) alone
          left this demo's Hero content sitting ~18px higher than the real
          site's at the same viewport (68 sticky-flow + 64 own padding =
          132px total clearance, vs real's fixed 150px). pt-[82px]
          (150 - 68px real nav height) closes that gap exactly; pb-16
          md:pb-24 copied verbatim since bottom spacing has no such
          fixed/sticky asymmetry to correct for. */}
      <div className="relative flex-1 overflow-hidden pb-16 pt-[82px] md:pb-24">
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

        {/* Real-app parity: `container px-6`, matching the real Hero.tsx's
            own wrapper exactly (see tailwind.config.ts's own container
            comment for why this replaced the old mx-auto max-w-6xl
            approximation). */}
        <div className="container relative z-[1] grid grid-cols-1 items-center gap-14 px-6 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-[22px] flex items-center gap-[10px]">
              <div className="h-0.5 w-[34px] bg-pulse" />
              <span className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.24em] text-pulse">
                Positioning vs. Reality
              </span>
            </div>

            <h1 className="mb-6 font-display text-[clamp(2.6rem,5vw,4.4rem)] font-bold leading-[1.02] tracking-tight text-paper">
              <span className="block">Africa&rsquo;s cultures,</span>
              <span className="block">
                read like <GlitchText className="text-pulse">signals.</GlitchText>
              </span>
            </h1>

            <p className="mb-9 max-w-[480px] text-[17px] leading-relaxed text-muted">
              Scored by contributors on the ground, with every score traceable to what someone
              actually said.
            </p>

            {/* Real-app parity, per direct instruction: matches the real
                Hero.tsx exactly -- these sit right here, immediately
                visible, same as the real homepage. An earlier pass moved
                them to a standalone closing section after the full
                Hero -> Features -> CEI -> CDI story; reverted, since the
                real Hero.tsx's own CTAs are ALSO immediately visible,
                un-deferred (see this file's own header comment, which
                used to flag the deferred version as "a genuine
                divergence... a new demo-specific pacing decision" -- that
                decision is reversed now, this is literal parity instead). */}
            <div className="mb-11 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
              <Link
                to="/onboarding/agency"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm border bg-ink px-[22px] py-3 font-display text-[12.5px] font-semibold uppercase tracking-[0.06em] text-visual transition-colors hover:bg-visual hover:text-ink"
                style={{ borderColor: "var(--visual)" }}
              >
                Brands &amp; Agencies <span aria-hidden="true">→</span>
              </Link>
              <Link
                to="/onboarding/contributor"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm border bg-ink px-[22px] py-3 font-display text-[12.5px] font-semibold uppercase tracking-[0.06em] text-sound transition-colors hover:bg-sound hover:text-ink"
                style={{ borderColor: "var(--sound)" }}
              >
                Contributors <span aria-hidden="true">→</span>
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

      {/* Real-app parity: the glowing waveform divider real Index.tsx
          renders directly under Hero, before Features -- size="tall",
          matching real Index.tsx's own <WaveformRibbon size="tall" />
          call at this exact position (its other two calls, at default
          "thin" size, sit after CDISection and after Participate --
          the CDISection one is in this demo's own scope too, see below;
          the Participate one isn't, Participate itself is excluded). */}
      <WaveformRibbon size="tall" />

      {/* Real-app parity, Change 1: straight port of the real landing/
          Features.tsx -- real English copy (features.badge/title1/title2/
          intro/cei.teaser/cdi.teaser), 2-up CEI/CDI teaser row pointing
          down to the fuller sections below. #pricing dropped from the
          real component's own 4-link nav pattern doesn't apply here (this
          is the page-body teaser row, not the navbar), but the same
          "no Pricing section in this demo's scope" reasoning is why there's
          no third teaser card for it either. */}
      <section id="features" className="relative border-t border-line py-16">
        <div className="container relative z-[1] px-6">
          <div className="mb-10 max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-12 bg-pulse" />
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-pulse">Platform</span>
            </div>
            <h2 className="font-display text-2xl font-bold leading-tight text-paper sm:text-3xl">
              Actionable Insights. <span className="text-pulse">Not Just Data.</span>
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
              We combine AI-powered analysis with authentic human perspectives to deliver
              intelligence you can act on.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-lg bg-line sm:grid-cols-2">
            <div className="flex flex-col bg-ink p-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-paper">Cultural Engagement Index (CEI)</h3>
                <span
                  className="rounded-sm px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em]"
                  style={{ backgroundColor: "color-mix(in srgb, var(--pulse) 14%, transparent)", color: "var(--pulse)" }}
                >
                  0–100
                </span>
              </div>
              <p className="mb-6 flex-1 text-[13.5px] leading-relaxed text-muted">
                Measures cultural velocity and market readiness on a scale of 0-100.
              </p>
              <a
                href="#cei"
                className="border-t border-line pt-4 font-mono text-xs uppercase tracking-[0.1em] text-pulse transition-colors hover:text-paper"
              >
                Learn more ↓
              </a>
            </div>

            <div className="flex flex-col bg-ink p-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-paper">Cultural Depth Index (CDI)</h3>
                <span
                  className="rounded-sm px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em]"
                  style={{ backgroundColor: "color-mix(in srgb, var(--soulgap) 14%, transparent)", color: "var(--soulgap)" }}
                >
                  0–10
                </span>
              </div>
              <p className="mb-6 flex-1 text-[13.5px] leading-relaxed text-muted">
                Authenticity metric that measures cultural alignment and flags backlash risk on a
                scale of 0-10.
              </p>
              <a
                href="#cdi"
                className="border-t border-line pt-4 font-mono text-xs uppercase tracking-[0.1em] text-soulgap transition-colors hover:text-paper"
              >
                Learn more ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Real-app parity: was "Five Cultural Layers" as its own section,
          verbatim from the real app's own (now-retired) landing/
          CulturalLayers.tsx. Merged with the CEI dimensions instead, same
          Neil/Garth decision as the live app -- see CULTURAL_LAYERS' own
          header comment in demo.ts for exactly what changed and why this
          demo's own merge runs the opposite direction (score added to the
          existing layer cards, not layer content added to CEI cards --
          this page has no per-dimension CEI card section, only the single
          aggregate SignalRing above, to merge into). id="cei" added for
          Change 1's Features/Navbar anchor links to actually land here. */}
      <section id="cei" className="relative border-t border-line bg-panel/40 py-16">
        <div className="container relative z-[1] px-6 sm:px-16">
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
      </section>

      {/* Real-app parity, Change 1: straight port of the real landing/
          CDISection.tsx -- real copy (cdi.title, features.cdi.gaugeLive,
          features.cdi.stat, cdi.illustrativeSample), the same "Lagos
          Cyberpunk: 7.8/10" illustrative sample used everywhere else on
          this page. DepthGauge itself needed zero new work -- already
          fully ported, already in use elsewhere (CampaignDetail.tsx) --
          this is composition, not new component work. Its own default
          bandLabels (DEFAULT_CDI_BAND_LABELS) are already the real
          English copy, so no override needed here. */}
      <section id="cdi" className="relative border-t border-line py-16">
        <DotGrid />
        <div className="container relative z-[1] px-6 sm:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-soulgap" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-soulgap">Framework</span>
            <div className="h-px w-12 bg-soulgap" />
          </div>
          <h2 className="font-display text-2xl font-bold leading-tight text-paper sm:text-3xl">Cultural Depth Index</h2>

          <div className="mx-auto mt-10 max-w-lg">
            <div className="mb-8 flex items-center justify-center gap-1.5 font-mono text-[13px] uppercase tracking-[0.18em] text-muted">
              <i className="h-1.5 w-1.5 rounded-full bg-sound animate-ds-node-pulse" />
              Authenticity Check
            </div>

            <DepthGauge score={7.8} />

            <div className="mt-1 text-center font-mono text-xs uppercase tracking-[0.1em] text-muted">
              Lagos Cyberpunk: 7.8/10 <span className="mx-1 text-line">·</span> Illustrative sample, not a
              live result
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Real-app parity: real Index.tsx's second <WaveformRibbon />
          (default "thin" size) sits directly after CDISection, before
          LiveNetwork -- LiveNetwork itself is excluded from this demo's
          scope, but the divider position right after CDI is still real
          and still in scope, so it stays. */}
      <WaveformRibbon />

      <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
        <Link to="/operations" className="text-[13px] text-muted hover:text-paper hover:underline">
          See how the data gets collected & verified →
        </Link>
        <p className="label-caps !text-[10px]">Pitch prototype · No login required</p>
      </div>
    </div>
  );
}
