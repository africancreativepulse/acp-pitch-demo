import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Flag } from "lucide-react";
import { AcpLogo } from "@/components/AcpLogo";
import { Button } from "@/components/Button";
import { useCanGoBack } from "@/state/NavHistory";

/**
 * RETIRED -- real-app parity, Change 2 (Neil's explicit direction): every
 * screen that rendered this now renders the full real marketing
 * Navbar.tsx instead (see that file's own header comment for the full
 * reasoning: sticky not fixed, dropped #pricing, Book a Demo -> /wrap-up,
 * Sign In reuses this component's own dropdown mechanic verbatim, Back/
 * Wrap Up carried forward). No remaining call site imports this file --
 * genuinely dead code today, kept rather than removed in case a
 * minimal-header treatment is wanted again later. Treat any future edit
 * here as touching dead code, not a live component.
 *
 * Ported structural pattern from the real app's design-system/components/
 * MinimalHeader.tsx -- h-[68px] border-b bar, the real AcpLogo at its
 * real marketing/dashboard size (h-9 w-9). Every one of this demo's own
 * pre-existing headers (Splash, Onboarding, Operations Hub) had shrunk the
 * logo to h-6 w-6, well below any real call site -- this restores the
 * real size and, by living in one shared component, guarantees every
 * screen in the demo now carries an identical header rather than five
 * near-duplicates that drift.
 *
 * One real, deliberate addition beyond MinimalHeader's own scope: a
 * separate Back control, left of the logo. MinimalHeader itself has no
 * back button (a signup/verification funnel doesn't need one -- the logo
 * already goes home), but this demo's screens form a real multi-step tour
 * an investor clicks through and needs a consistent way back at every
 * step.
 *
 * Real-navigation-history fix: this USED to take a `backTo` prop -- a
 * fixed "logical parent" path hardcoded per screen. That broke the
 * moment a screen gained more than one real entry point (which most of
 * them now have, via the narrative chain Campaign Detail/Operations
 * Hub/Supervisor Review/sidebar nav all link through) -- Back would
 * return to the same hardcoded parent regardless of which real path
 * actually got you there. Fixed by tracking real navigation history
 * instead (see state/NavHistory.tsx): `navigate(-1)` when there's a
 * genuine previous screen in this session (`useCanGoBack()`), falling
 * back to Splash when there isn't (a fresh load or a direct/deep-linked
 * URL) rather than calling navigate(-1) with nothing behind it, which
 * would exit the tab instead of doing anything useful.
 *
 * `showBack` still exists as an explicit opt-out, used only on Splash --
 * even with real history tracking, a fresh load of Splash has nowhere
 * real to go back to, and a Back button that just re-lands you on the
 * same screen you're already on is confusing, not helpful. Every other
 * screen (including Wrap Up, which used to also opt out under the old
 * fixed-parent scheme since it has no single logical parent) now gets a
 * real, working Back for free, since "wherever you actually came from"
 * is well-defined regardless of how many different screens can lead here.
 *
 * No NotificationBell here -- matches the real MinimalHeader exactly,
 * confirmed against its own source: the bell only ever lives inside the
 * dashboard shell (sidebar footer on desktop, the mobile-only secondary
 * header on small screens), never on this top bar.
 *
 * Item 5's closing moment -- a small, consistent "Wrap Up" link on the
 * right, the same discoverable spot on every screen, so an investor never
 * has to guess how to bring the tour to a deliberate stop. Suppressed only
 * on Splash (the tour hasn't started) and on the Wrap Up screen itself
 * (already there).
 *
 * Visual-parity fix (real bug found + fixed): Sign In used to live inline
 * in Splash's own page body, below the two "Enter as" buttons -- a plain
 * underlined text link, not a button. That didn't match the real app's
 * own homepage at all: there, Sign In lives in the persistent Navbar
 * (top-right, ghost-variant button, beside Book a Demo), not the page
 * body. showSignIn (default false, so every other ~20 screens using this
 * header are untouched) moves it into the real position -- this header's
 * own right-side slot -- styled with this demo's own Button component,
 * which is a byte-for-byte port of the real app's ghost variant, so the
 * style matches for free, not just the position. Self-contained here
 * (trigger + reveal panel both live in this one component) rather than
 * lifting state up into Splash, since nothing else needs to know about it.
 */
export function DemoHeader({
  showBack = true,
  showWrapUp = true,
  showSignIn = false,
}: {
  showBack?: boolean;
  showWrapUp?: boolean;
  showSignIn?: boolean;
}) {
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();
  const [signInOpen, setSignInOpen] = useState(false);

  const handleBack = () => {
    if (canGoBack) navigate(-1);
    else navigate("/");
  };

  return (
    <header className="relative flex h-[68px] w-full shrink-0 items-center justify-between border-b border-line px-6">
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

      <div className="flex items-center gap-5">
        {showSignIn && (
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
                  <Link to="/agency" className="text-visual hover:underline">
                    Agency
                  </Link>
                  <Link to="/contribute" className="text-sound hover:underline">
                    Contributor
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
        {showWrapUp && (
          <Link to="/wrap-up" className="flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-paper">
            <Flag className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Wrap Up</span>
          </Link>
        )}
      </div>
    </header>
  );
}
