import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { DotGrid } from "@/components/DotGrid";
import { WaveformRibbon } from "@/components/WaveformRibbon";

/**
 * Real-app parity: the live site added a real, permanent About Us page
 * (commit adding /about + Navbar About/Contact links and the border-b-2
 * vertical-alignment fix those two links needed). This demo never picked
 * that up -- confirmed missing entirely during a full nav/cosmetic audit.
 *
 * Structure is a straight port of the real pages/About.tsx: hero (eyebrow
 * + h1, no CTA row -- this page doesn't sell, it introduces), the shared
 * dashed-border "stitching box" (SectionBox below) every real section sits
 * inside, a standalone un-boxed pull-quote, and two WaveformRibbon dividers
 * -- same positions as the real page (after the pull-quote, and after
 * "What We Do").
 *
 * Content: per direct instruction, the real page's own copy is reused
 * verbatim rather than substituted with placeholder text -- "Our Story"
 * and "Founders & Team" are already public, real, non-fabricated company
 * content on the live site, so there's no "invented for the demo" risk the
 * way there would be for, say, real user data. "What We Do" reuses this
 * demo's own already-ported Features copy (Splash.tsx's #features section)
 * instead of running through an i18n tr() call -- this demo has no i18n
 * system, same precedent every other ported marketing string here follows.
 *
 * Real-app parity note: the real page uses <Reveal> for a mount/scroll
 * fade-in on every section. This demo has no Reveal component anywhere
 * (Splash.tsx's own straight ports render statically, no equivalent
 * animation wrapper) -- sections here render plain, consistent with that
 * existing precedent, not a new gap invented for this page specifically.
 */

const ACCENT = "var(--language)";

const SectionBox = ({ children }: { children: React.ReactNode }) => (
  <div className="container px-6">
    <div className="mx-auto max-w-3xl">
      <div className="rounded-lg p-8 sm:p-10" style={{ border: "1px dashed rgba(255,201,60,0.35)" }}>
        {children}
      </div>
    </div>
  </div>
);

export function About() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <Navbar />

      <section className="relative overflow-hidden pb-14 pt-16 sm:pb-20">
        <DotGrid />
        <div className="container relative z-[1] px-6 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-px w-10" style={{ backgroundColor: ACCENT }} />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
              About Us
            </span>
            <div className="h-px w-10" style={{ backgroundColor: ACCENT }} />
          </div>
          <h1 className="mx-auto mb-4 max-w-2xl font-display text-[clamp(2.2rem,5vw,3.4rem)] font-bold leading-[1.1] text-paper">
            African Creative Pulse
          </h1>
        </div>
      </section>

      {/* Section 1: Our Story -- real, company-provided content, verbatim
          from the real pages/About.tsx. */}
      <SectionBox>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-pulse">Our Story</span>
        </div>
        <h2 className="mb-4 font-display text-2xl font-bold text-paper sm:text-3xl">Why ACP exists</h2>
        <div className="space-y-4 text-[15px] leading-relaxed text-muted">
          <p>
            African Creative Pulse didn&rsquo;t start in a boardroom. It started in the places most algorithms can&rsquo;t
            see — and with two people who had spent a decade betting on the voices those algorithms missed.
          </p>

          <h3 className="pt-2 font-display text-base font-semibold text-language">The consultant and the suitcase</h3>
          <p>
            Garth Brown began his career in the rural heart of South Africa, consulting on government infrastructure
            projects in some of the continent&rsquo;s most marginalised communities. He kept meeting the same paradox:
            brilliant young people with rich cultural identities who were, as far as the global data economy was
            concerned, invisible. Being unseen by the world&rsquo;s data didn&rsquo;t mean the market wasn&rsquo;t there. It
            meant the world was missing the voice.
          </p>
          <p>
            Around the same time, Neil Naidoo arrived in Johannesburg from Cape Town with a suitcase and a
            conviction. With no industry ties, he started finding talent at street level — long before the
            mainstream caught up. He backed producers like Ameen Harron and Ashley Valentine while they were still
            local legends, and signed Open Mic to Africori after the major labels passed.
          </p>
          <p>Both of them built the same way: by trusting the culture before the data existed to prove it.</p>

          <h3 className="pt-2 font-display text-base font-semibold text-language">Betting on the underdog — and being right</h3>
          <p>
            Neil heard what the metropolis ignored. He brought the subcultures of the Free State and Limpopo —
            Prince Kaybee, King Monada, the street-level Bacardi sound — into rooms that hadn&rsquo;t been listening.
            Those same sounds later surfaced in Grammy-stage performances, and Limpopo gave the world Master KG&rsquo;s
            Jerusalema.
          </p>
          <p>
            Garth took the same instinct to Warner Music Africa, leading the campaigns behind two of the most
            Shazam&rsquo;d songs in history — Dance Monkey and CKay&rsquo;s Love Nwantiti — and scaling CKay past three
            billion streams. From Tones and I to Inkabi Zezwe, the pattern held: the &ldquo;underdog&rdquo; story was
            usually the global mainstream, just waiting for a platform.
          </p>

          <h3 className="pt-2 font-display text-base font-semibold text-language">The wall they kept hitting</h3>
          <p>
            For all of it, the same problem showed up every time. Global brands wanted to reach these audiences and
            had no honest way to measure them. They were pointing Western algorithms at Pidgin, Sheng, and
            Tsotsitaal and getting noise back. They couldn&rsquo;t see the local rituals that actually move a purchase,
            or the gap between what a brand thinks it&rsquo;s saying and what an audience actually lives.
          </p>
          <p>
            The lesson was blunt: without the data, you don&rsquo;t have a voice. African Creative Pulse exists to
            close that gap — and to do it the hard, credible way, so that every score the platform produces can be
            traced back to a real person who actually said it.
          </p>

          <h3 className="pt-2 font-display text-base font-semibold text-language">What they&rsquo;re building</h3>
          <p>
            ACP is the productised version of a decade of doing this by hand: a pan-African cultural intelligence
            platform that reads culture city by city, from consenting, compensated contributors on the ground. Garth
            and Neil built the first working version of the platform self-funded, with no outside capital — proof,
            before the raise, that the instinct scales.
          </p>

          <blockquote className="mt-2 border-s-2 ps-4 italic text-paper" style={{ borderColor: "var(--pulse)" }}>
            &ldquo;We spent a decade amplifying African voices manually. Now we&rsquo;ve built the engine to do it at
            scale.&rdquo;
          </blockquote>
        </div>
      </SectionBox>

      <div className="container px-6">
        <div className="mx-auto max-w-2xl py-4 text-center">
          <span className="mb-2 block font-display text-[40px] leading-none text-pulse">&ldquo;</span>
          <p className="font-display text-xl font-medium italic leading-snug text-paper sm:text-2xl">
            We measure culture the way it actually travels — city by city, not country by country — and every number
            we produce traces back to a real African voice.
          </p>
        </div>
      </div>

      <WaveformRibbon />

      {/* Section 2: What We Do -- reuses this demo's own already-ported
          Features copy (Splash.tsx #features section) rather than
          inventing new copy, same real-app parity reasoning the real
          page's own "What We Do" section documents for reusing
          Features.tsx. */}
      <SectionBox>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-pulse">Our Work</span>
        </div>
        <h2 className="mb-4 font-display text-2xl font-bold text-paper sm:text-3xl">What We Do</h2>
        <p className="mb-6 text-[15px] leading-relaxed text-muted">
          We combine AI-powered analysis with authentic human perspectives to deliver intelligence you can act on.
        </p>

        <div className="grid gap-px overflow-hidden rounded-lg bg-line sm:grid-cols-2">
          <div className="bg-ink p-6">
            <h3 className="mb-2 font-display text-base font-semibold text-paper">Cultural Engagement Index (CEI)</h3>
            <p className="mb-4 text-sm leading-relaxed text-muted">
              Measures cultural velocity and market readiness on a scale of 0-100.
            </p>
            {/* Link, not <a> -- a plain anchor to a different pathname is a
                full browser navigation from here (this is a real route, not
                Splash itself), which would hard-reload the whole SPA and
                wipe DemoState. Same fix Navbar.tsx's own Features/CEI/CDI
                links already apply, see that file's header comment. */}
            <Link to="/#cei" className="font-mono text-xs uppercase tracking-[0.1em] text-pulse hover:text-paper">
              Learn more ↓
            </Link>
          </div>
          <div className="bg-ink p-6">
            <h3 className="mb-2 font-display text-base font-semibold text-paper">Cultural Depth Index (CDI)</h3>
            <p className="mb-4 text-sm leading-relaxed text-muted">
              Authenticity metric that measures cultural alignment and flags backlash risk on a scale of 0-10.
            </p>
            <Link to="/#cdi" className="font-mono text-xs uppercase tracking-[0.1em] text-soulgap hover:text-paper">
              Learn more ↓
            </Link>
          </div>
        </div>
      </SectionBox>

      <WaveformRibbon />

      {/* Section 3: Founders & Team -- real, company-provided content,
          verbatim from the real pages/About.tsx (per direct instruction:
          already-public company bios, reused rather than substituted). */}
      <SectionBox>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-pulse">Our Team</span>
        </div>
        <h2 className="mb-6 font-display text-2xl font-bold text-paper sm:text-3xl">Founders & Team</h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h3 className="font-display text-lg font-semibold text-paper">Garth Brown</h3>
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.1em] text-pulse">Co-Founder & CEO</div>
            <p className="mb-3 text-[15px] leading-relaxed text-muted">
              Johannesburg. Vocalist, creative executive, and the creative lead at Warner Music Africa from 2018 to
              2023, where he directed global campaigns and secured brand partnerships across the continent.
            </p>
            <ul className="list-disc space-y-2 ps-5 text-sm leading-relaxed text-muted">
              <li>
                Led the campaigns behind Dance Monkey and CKay&rsquo;s Love Nwantiti — two of the most Shazam&rsquo;d
                records ever made — and scaled CKay beyond three billion streams.
              </li>
              <li>Chaired the WMG / BFF Social Justice Fund, directing $1M into Sub-Saharan Africa.</li>
              <li>Campaign work across Ed Sheeran, Dua Lipa, Coldplay, and Cardi B.</li>
              <li>Recording Academy member, BET Awards judge, and SAMA committee member.</li>
              <li>
                Released his debut EP in 2026 — which doubled as ACP&rsquo;s first live proof of concept, scored by
                the platform before the market confirmed the call.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-paper">Neil Naidoo</h3>
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.1em] text-pulse">Co-Founder & COO</div>
            <p className="mb-3 text-[15px] leading-relaxed text-muted">
              Johannesburg. A talent scout turned operator who has spent his career finding scenes before they
              break.
            </p>
            <ul className="list-disc space-y-2 ps-5 text-sm leading-relaxed text-muted">
              <li>
                Took early equity in Africori and helped scale it to $10M+ in revenue, 7,000+ artists, and a 65%
                international footprint — through to its acquisition by Warner Music.
              </li>
              <li>Former Head of Marketing and AVP at Warner Music Africa.</li>
              <li>As Country Manager for ONErpm South Africa, landed the country&rsquo;s #1 record within three months.</li>
              <li>Brokered the R200M Makhadzi × Kicks deal — the largest artist-brand partnership in South African history.</li>
              <li>
                1B+ global streams across the portfolios he&rsquo;s managed, with client work spanning Investec,
                Henley Business School, and Canal+ Africa.
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-8 border-t border-line pt-6 text-[15px] italic leading-relaxed text-paper">
          Two operators who spent ten years proving the underdog was the mainstream. ACP is the infrastructure they
          built so the rest of the world can see it too.
        </p>
      </SectionBox>

      <WaveformRibbon />

      {/* Demo-only addendum: real Footer.tsx isn't a separate component
          here (Splash.tsx inlines its own) -- rather than duplicating that
          whole block on a second screen, this closes with the same
          Navbar-reachable "Return to Home" pattern PrivacyPolicy.tsx
          already established for a non-Splash full page. */}
      <div className="border-t border-line py-10 text-center">
        <Link
          to="/"
          className="font-mono text-xs uppercase tracking-[0.15em] text-paper underline decoration-line underline-offset-4 transition-colors hover:text-pulse hover:decoration-pulse"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
