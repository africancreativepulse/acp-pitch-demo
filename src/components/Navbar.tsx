import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Menu, X } from "lucide-react";
import { AcpLogo } from "@/components/AcpLogo";
import { Button } from "@/components/Button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useCanGoBack } from "@/state/NavHistory";

/**
 * Real-app parity, Change 2 (Neil's explicit direction): the real app's
 * own landing/Navbar.tsx everywhere in this demo, including every
 * dashboard-equivalent screen -- replacing DemoHeader.tsx's own minimal
 * treatment there. A deliberate divergence from how the real live app
 * actually behaves (real dashboards use sidebar-only nav, no marketing
 * navbar) -- proceeding as directed, not re-litigating that choice here.
 *
 * Ported from the real component with the real, necessary adjustments
 * this demo requires (all confirmed with Neil before building):
 * - No useI18n() -- this demo has no i18n system anywhere (confirmed,
 *   English-only throughout); every string below is the real component's
 *   own English copy (nav.features/nav.cei/nav.cdi, hero.signIn,
 *   hero.bookDemo), hardcoded -- same pattern every other ported
 *   component here already follows.
 * - LanguageSwitcher IS included (real-app parity, explicitly confirmed
 *   after an earlier pass dropped it): see LanguageSwitcher.tsx's own
 *   header comment for the full reasoning -- real 16-language list, real
 *   working popover, persisted via DemoState (uiLanguage/setUiLanguage)
 *   -- honestly disclosed as not actually translating page content, since
 *   no i18n data exists behind it to translate with.
 * - sticky, not fixed: the real component overlays content and relies on
 *   each page's own top-padding to compensate (Hero.tsx's own
 *   pt-[150px]). Retrofitting that across 25 different screens is real,
 *   avoidable churn for a demo -- sticky gives the identical "pinned
 *   while scrolling" visual behavior in a single-viewport SPA without
 *   needing any of that.
 * - Nav links point to real full paths (/#section), not bare anchors --
 *   works correctly from every screen, not just Splash (the only page
 *   with matching section ids). Scroll-spy only ever activates on Splash
 *   itself for the same reason -- expected, harmless everywhere else.
 * - #pricing dropped -- no Pricing section exists in this demo's own
 *   ported homepage (Change 1 scope explicitly excludes it).
 * - Real regression found + fixed (now moot, see below, but the lesson
 *   still applies to Features/CEI/CDI): a plain `<a href>`/Button-as-
 *   anchor tag is harmless while already on Splash (same-pathname hash
 *   navigation is a same-document browser operation, no reload) but
 *   genuinely broken from anywhere else in the app (Change 2 put this
 *   Navbar on all ~25 screens): a real `<a>` to a different pathname is
 *   a full browser navigation, hard-reloading the whole SPA and wiping
 *   every bit of DemoState -- draft campaigns, review decisions, the
 *   live contributor's own pending/approved status, all of it -- a real
 *   trap mid-presentation. Features/CEI/CDI go through react-router's
 *   `<Link>` for exactly this reason -- client-side, state-preserving.
 *   React Router's own client-side nav doesn't replicate the browser's
 *   native same-document hash-scroll for free the way a real `<a>` does,
 *   so Splash.tsx carries a small `useEffect` keyed on `location.hash`
 *   that does the actual scrollIntoView -- see its own comment there.
 * - Sign In reuses DemoHeader's own existing working dropdown (sign in
 *   as Agency/Contributor) instead of a real /auth route that doesn't
 *   exist here -- and shows unconditionally now, everywhere, rather than
 *   being suppressed per-screen the way DemoHeader's own showSignIn prop
 *   worked (confirmed: navbar shows as-is everywhere, including
 *   mid-dashboard, no adaptive hiding).
 * - Back -- a real demo-only navigation aid DemoHeader itself already
 *   added beyond the real component's own scope (see DemoHeader's own
 *   header comment) -- kept here for the same reason: genuinely
 *   necessary for this demo's own multi-step tour, not part of the real
 *   Navbar's own content. showBack matches DemoHeader's own prop exactly
 *   (same name, same default true) so existing call sites migrate with
 *   minimal changes -- Splash suppresses it.
 * - Book a Demo and Wrap Up -- removed entirely, per direct instruction
 *   (both the buttons/links and their underlying /wrap-up screen/route).
 *   Every reference was audited first (Navbar's own four render sites,
 *   App.tsx's route+import, Splash.tsx's and PrivacyPolicy.tsx's own
 *   showWrapUp props) -- nothing else in the app linked to /wrap-up or
 *   had its own Book a Demo CTA, and the "Restart the Tour" link that
 *   used to live on the (now-deleted) WrapUp.tsx screen only ever
 *   pointed at "/", never referenced from anywhere else, so nothing was
 *   left dangling. A stray deep link to /wrap-up now falls through to
 *   App.tsx's own catch-all (`*` -> `/`) instead of erroring.
 */
const NAV_LINKS = [
  { href: "/#features", id: "features", label: "Features", color: "var(--visual)" },
  { href: "/#cei", id: "cei", label: "CEI", color: "var(--soulgap)" },
  { href: "/#cdi", id: "cdi", label: "CDI", color: "var(--ritual)" },
] as const;

export function Navbar({
  showBack = true,
}: {
  showBack?: boolean;
}) {
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();
  const [open, setOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleBack = () => {
    if (canGoBack) navigate(-1);
    else navigate("/");
  };

  // Scroll-spy -- only ever finds matching sections on Splash (the only
  // screen with #features/#cei/#cdi elements); no-ops harmlessly
  // everywhere else, same as the real component's own behavior would if
  // its sections weren't present on a given page.
  useEffect(() => {
    const sections = NAV_LINKS
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        setActiveSection(topmost.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const linkClass = (isActive: boolean) =>
    `font-mono text-xs uppercase tracking-[0.12em] transition-colors hover:text-[var(--nav-accent)] ${
      isActive ? "text-[var(--nav-accent)]" : "text-muted"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-ink/72 backdrop-blur-xl">
      <div className="container flex h-[68px] items-center justify-between px-6">
        <div className="flex items-center gap-5">
          {showBack && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-paper"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}
          <Link to="/" className="opacity-100 transition-opacity hover:opacity-80">
            <AcpLogo markClassName="h-9 w-9" textClassName="hidden sm:inline text-base" />
          </Link>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {/* Real-app parity: real Navbar.tsx's own About link -- kept
              outside NAV_LINKS (that array drives the scroll-spy above,
              which only makes sense for actual same-page anchor sections),
              placed first per the real component's own explicit ordering.
              border-b-2 border-transparent pb-1 matches NAV_LINKS' own
              reserved underline space -- the real component's own fix for
              a genuine, confirmed pixel-level misalignment without it. */}
          <Link
            to="/about"
            className="border-b-2 border-transparent pb-1 font-mono text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:text-paper"
          >
            About
          </Link>
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <Link
                key={link.id}
                to={link.href}
                className={`border-b-2 pb-1 ${linkClass(isActive)}`}
                style={{ ["--nav-accent" as string]: link.color, borderColor: isActive ? link.color : "transparent" }}
              >
                {link.label}
              </Link>
            );
          })}
          {/* Real-app parity: real Navbar.tsx's own Contact link -- same
              real-route-not-anchor reasoning and alignment fix as About
              above. */}
          <Link
            to="/contact"
            className="border-b-2 border-transparent pb-1 font-mono text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:text-paper"
          >
            Contact
          </Link>

          <LanguageSwitcher />

          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setSignInOpen((v) => !v)}
              className="!px-[18px] !py-[9px]"
            >
              Sign In
            </Button>
            {signInOpen && (
              <div className="absolute end-0 top-[calc(100%+8px)] z-10 w-[220px] rounded-sm border border-line bg-ink p-4 shadow-xl">
                <div className="mb-2.5 text-[11px] uppercase tracking-[0.1em] text-muted">Sign in as</div>
                <div className="flex flex-col gap-2 text-[13px]">
                  <Link to="/agency" className="text-visual hover:underline" onClick={() => setSignInOpen(false)}>
                    Agency
                  </Link>
                  <Link to="/contribute" className="text-sound hover:underline" onClick={() => setSignInOpen(false)}>
                    Contributor
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <button className="text-paper transition-colors hover:text-pulse" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="space-y-4 border-b border-line bg-ink px-6 pb-6 md:hidden">
          {/* Real-app parity: same About link as the desktop nav above,
              first in the list, same ordering as desktop. */}
          <Link
            to="/about"
            onClick={() => setOpen(false)}
            className="block border-s-2 border-transparent py-2 ps-3 font-mono text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-paper"
          >
            About
          </Link>
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <Link
                key={link.id}
                to={link.href}
                onClick={() => setOpen(false)}
                className={`block border-s-2 py-2 ps-3 font-mono text-xs uppercase tracking-[0.15em] transition-colors hover:text-[var(--nav-accent)] ${
                  isActive ? "text-[var(--nav-accent)]" : "text-muted"
                }`}
                style={{ ["--nav-accent" as string]: link.color, borderColor: isActive ? link.color : "transparent" }}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="block border-s-2 border-transparent py-2 ps-3 font-mono text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-paper"
          >
            Contact
          </Link>
          <div>
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">Sign in as</div>
            <div className="flex gap-4 text-[13px]">
              <Link to="/agency" onClick={() => setOpen(false)} className="text-visual hover:underline">
                Agency
              </Link>
              <Link to="/contribute" onClick={() => setOpen(false)} className="text-sound hover:underline">
                Contributor
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
