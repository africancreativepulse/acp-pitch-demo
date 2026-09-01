import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { DotGrid } from "@/components/DotGrid";
import { GlitchText } from "@/components/GlitchText";
import { SignalRing } from "@/components/SignalRing";
import { CountUp } from "@/components/CountUp";
import { DepthGauge } from "@/components/DepthGauge";
import { WaveformRibbon } from "@/components/WaveformRibbon";
import { PositioningRealityBars } from "@/components/PositioningRealityBars";
import { AcpLogo } from "@/components/AcpLogo";
import { CEI_POSITIONING_REALITY } from "@/data/demo";

// Real-app parity: real landing/LiveNetwork.tsx's own NODES/LINKS/
// GRID_DOTS, copied verbatim (positions, colors, link pairs) -- an
// abstract signal-network diagram, not a literal map, per that
// component's own header comment.
const NETWORK_NODES = [
  { id: "n1", x: 210, y: 190, color: "var(--pulse)" },
  { id: "n2", x: 140, y: 230, color: "var(--language)" },
  { id: "n3", x: 580, y: 220, color: "var(--sound)" },
  { id: "n4", x: 470, y: 400, color: "var(--visual)" },
  { id: "n5", x: 600, y: 150, color: "var(--soulgap)" },
  { id: "n6", x: 420, y: 70, color: "var(--ritual)" },
] as const;

const NETWORK_LINKS: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 4],
  [2, 3],
  [2, 4],
  [4, 5],
  [0, 5],
  [2, 5],
];

const NETWORK_GRID_DOTS = (() => {
  const dots: { x: number; y: number }[] = [];
  for (let gx = 40; gx < 900; gx += 44) {
    for (let gy = 30; gy < 470; gy += 44) {
      dots.push({ x: gx, y: gy });
    }
  }
  return dots;
})();

// Real-app parity: real landing/Footer.tsx's own FooterSoonTag, verbatim.
const FooterSoonTag = () => (
  <span className="rounded-full border border-line px-1.5 py-px font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
    Soon
  </span>
);

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
 * Part D item 9's Cultural Layers content originally lived below the hero
 * as its own standalone section, copied verbatim from the real landing/
 * CulturalLayers.tsx. That real component is retired now -- its content
 * merged into CEISection.tsx's own per-dimension cards (real-app parity;
 * see CEI_POSITIONING_REALITY's own header comment in demo.ts for the
 * full history, including an intermediate miss this demo carried for a
 * while: modeling the #cei section on the RETIRED CulturalLayers.tsx
 * shape instead of the real, current CEISection.tsx one).
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
  // Real-app parity: CEISection.tsx's own initial selectedKey is
  // literally "soulgap" -- which matches none of the six real axis keys
  // (pulse/taste/sound/visual/language/ritual), so no card actually
  // starts expanded; a copy-paste-looking but real default from the live
  // source, kept verbatim rather than "corrected" to null.
  const [selectedCeiKey, setSelectedCeiKey] = useState<string | null>("soulgap");

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
          <div className="mb-14 max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-12 bg-pulse" />
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-pulse">Platform</span>
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight text-paper sm:text-4xl md:text-5xl">
              Actionable Insights. <span className="text-pulse">Not Just Data.</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
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

      {/* Real-app parity fix: the real #cei section (CEISection.tsx) is
          NOT a static percentage-card grid -- that was this demo's own
          earlier miss, ported from the real app's now-RETIRED
          CulturalLayers.tsx as if it were still the live section (see
          CEI_POSITIONING_REALITY's own header comment in data/demo.ts for
          the full story). The real section is a per-dimension
          Positioning-vs-Reality comparison: real title ("cei.title"),
          real badge ("cei.badge", "Framework" -- same badge CDI's own
          section uses, not "Cultural Intelligence"), real
          features.cei.stat caption line, and PositioningRealityBars doing
          the actual comparison work -- straight port, see that
          component's own header comment. */}
      <section id="cei" className="relative bg-panel py-16 sm:py-24">
        <DotGrid />
        <div className="container relative z-[1] px-6 sm:px-16">
          <div className="mb-3 max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-12 bg-pulse" />
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-pulse">Framework</span>
            </div>
            <h2 className="font-display text-4xl font-bold leading-tight text-paper sm:text-5xl">Cultural Engagement Index</h2>
          </div>

          <div className="mb-10 font-mono text-xs uppercase tracking-[0.1em] text-muted">
            Lagos Cyberpunk: 88/100 <span className="mx-1 text-line">·</span> Illustrative sample, not measured results
          </div>

          <div className="mx-auto max-w-[640px]">
            <PositioningRealityBars axes={CEI_POSITIONING_REALITY} selectedKey={selectedCeiKey} onSelect={setSelectedCeiKey} />
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
      <section id="cdi" className="relative bg-ink py-16 sm:py-24">
        <DotGrid />
        <div className="container relative z-[1] px-6 sm:px-16">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-soulgap" />
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-soulgap">Framework</span>
              <div className="h-px w-12 bg-soulgap" />
            </div>
            <h2 className="font-display text-4xl font-bold leading-tight text-paper sm:text-5xl">Cultural Depth Index</h2>
          </div>

          <div className="mx-auto w-full max-w-[620px] text-center">
            <div className="mb-10 flex items-center justify-center gap-1.5 font-mono text-[13px] uppercase tracking-[0.18em] text-muted">
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
      </section>

      {/* Real-app parity: real Index.tsx's second <WaveformRibbon />
          (default "thin" size) sits directly after CDISection, before
          LiveNetwork -- straight port, see WaveformRibbon.tsx. */}
      <WaveformRibbon />

      {/* Real-app parity: straight port of the real landing/LiveNetwork.tsx
          -- real copy (network.badge/title1/title2/subtitle), same
          six-node abstract network diagram (not a literal map), same
          grid-dot background, same real node positions/colors/link
          pairs. One real, disclosed gap: the real component labels up to
          6 nodes with real city names, but only once a live
          get_live_network_cities() RPC clears a genuine "3+ cities, 2+
          countries" threshold -- there's no Supabase connection here to
          call, so nodes render permanently unlabeled, which is also the
          real component's own honest default/fallback state (its own
          header comment confirms this is what it renders whenever that
          gate isn't cleared -- not a demo-only simplification of
          something that always shows labels). */}
      <section className="py-24 sm:py-32">
        <div className="container px-6">
          <div className="mb-14 max-w-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-12 bg-pulse" />
              <span className="inline-flex items-center gap-[6px] font-mono text-xs uppercase tracking-[0.3em] text-pulse">
                <i className="h-1.5 w-1.5 rounded-full bg-sound animate-ds-node-pulse" />
                Live across the continent
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight text-paper sm:text-4xl md:text-5xl">
              One signal. <span className="text-pulse">Every city.</span>
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">Culture moves city by city, not country by country.</p>
          </div>

          <div className="relative mx-auto aspect-[16/9] w-full max-w-[900px]">
            <svg viewBox="0 0 900 500" className="h-full w-full" aria-hidden="true">
              <defs>
                <radialGradient id="netGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--pulse)" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="var(--pulse)" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx={450} cy={250} r={260} fill="url(#netGlow)" />

              {NETWORK_GRID_DOTS.map((d) => (
                <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r={1} fill="rgba(246,241,233,0.06)" />
              ))}

              {NETWORK_LINKS.map(([a, b]) => {
                const n1 = NETWORK_NODES[a];
                const n2 = NETWORK_NODES[b];
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={n1.x}
                    y1={n1.y}
                    x2={n2.x}
                    y2={n2.y}
                    style={{ stroke: n1.color, strokeOpacity: 0.35 }}
                    strokeWidth={1}
                    strokeDasharray="4 5"
                  />
                );
              })}

              {NETWORK_NODES.map((n) => (
                <g key={n.id}>
                  <circle cx={n.x} cy={n.y} r={4} fill="none" style={{ stroke: n.color, strokeWidth: 1.4 }} />
                  <circle cx={n.x} cy={n.y} r={5} className="animate-ds-node-pulse" style={{ fill: n.color }} />
                </g>
              ))}
            </svg>
          </div>
        </div>
      </section>

      {/* Real-app parity: straight port of the real landing/CTA.tsx --
          real copy (cta.title1/title2/description), the same closing
          two-way fork Hero opens with (top-of-page + bottom-of-page echo
          of the same fork, per that component's own header comment) --
          same routes/labels as Hero's own buttons above. */}
      <section className="relative overflow-hidden py-[130px] text-center">
        <DotGrid />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute end-[30%] top-[20%] h-[420px] w-[420px] rounded-full blur-[90px]"
          style={{ background: "radial-gradient(circle, rgba(255,90,41,0.22), transparent 70%)" }}
        />
        <div className="container relative z-[1] px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 font-display text-[clamp(2.4rem,6vw,4.6rem)] font-bold leading-[1] text-paper">
              The continent is
              <br />
              <GlitchText className="text-pulse">speaking.</GlitchText>
            </h2>
            <p className="mx-auto mb-10 max-w-md text-[15.5px] text-muted">
              Are you listening? Join as an agency or contributor and tap into Africa&rsquo;s most
              authentic cultural intelligence.
            </p>
            <div className="flex flex-wrap justify-center gap-3.5">
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
          </div>
        </div>
      </section>

      {/* Real-app parity: straight port of the real landing/Footer.tsx --
          real section labels/copy (footer.platform/resources/legal, the
          docs/case studies/blog/privacy/terms/data-policy "Soon" tags for
          real destinations that genuinely don't exist yet on the real
          site either, not a demo-only cut). Two routing adaptations: For
          Agencies/For Contributors point at /onboarding/:role (the real
          /for-agencies//for-contributors fork-splash pages don't exist in
          this demo, same reasoning as Hero's own CTAs), CEI Framework
          keeps its real #cei anchor since that section exists here too. */}
      <footer className="border-t border-line py-16">
        <div className="container px-6">
          <div className="mb-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <div className="mb-4">
                <AcpLogo markClassName="h-10 w-10" textClassName="text-sm font-black" />
              </div>
              <p className="text-sm leading-relaxed text-muted">Africa&rsquo;s cultural intelligence platform.</p>
            </div>
            <div>
              <h4 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-paper">Platform</h4>
              <ul className="space-y-3 text-sm text-muted">
                <li>
                  <Link to="/onboarding/agency" className="transition-colors hover:text-visual">
                    For Agencies
                  </Link>
                </li>
                <li>
                  <Link to="/onboarding/contributor" className="transition-colors hover:text-visual">
                    For Contributors
                  </Link>
                </li>
                <li>
                  <a href="#cei" className="transition-colors hover:text-soulgap">
                    CEI Framework
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-paper">Resources</h4>
              <ul className="space-y-3 text-sm text-muted">
                <li className="flex items-center gap-2 opacity-50">
                  <span>Documentation</span>
                  <FooterSoonTag />
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <span>Case Studies</span>
                  <FooterSoonTag />
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <span>Blog</span>
                  <FooterSoonTag />
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-paper">Legal</h4>
              <ul className="space-y-3 text-sm text-muted">
                <li className="flex items-center gap-2 opacity-50">
                  <span>Privacy (POPIA)</span>
                  <FooterSoonTag />
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <span>Terms</span>
                  <FooterSoonTag />
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <span>Data Policy</span>
                  <FooterSoonTag />
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 border-t border-line pt-7 sm:flex-row">
            <span className="text-xs text-muted">© {new Date().getFullYear()} AFRICAN CREATIVE PULSE</span>
            <span className="font-mono text-xs tracking-wide text-muted">Nigeria · Kenya · South Africa · Ghana</span>
          </div>

          {/* Demo-only addendum, kept from this project's own earlier
              closing element -- real Footer.tsx has no equivalent, but
              this demo's own tour benefits from a direct pointer into the
              operations/field-collection story and an explicit
              "prototype" disclosure the real site doesn't need. */}
          <div className="mt-10 flex flex-col items-center gap-3 border-t border-line pt-7 text-center">
            <Link to="/operations" className="text-[13px] text-muted hover:text-paper hover:underline">
              See how the data gets collected & verified →
            </Link>
            <p className="label-caps !text-[10px]">Pitch prototype · No login required</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
