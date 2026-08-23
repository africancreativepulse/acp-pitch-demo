import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Flag } from "lucide-react";
import { AcpLogo } from "@/components/AcpLogo";
import { useCanGoBack } from "@/state/NavHistory";

/**
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
 */
export function DemoHeader({ showBack = true, showWrapUp = true }: { showBack?: boolean; showWrapUp?: boolean }) {
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();

  const handleBack = () => {
    if (canGoBack) navigate(-1);
    else navigate("/");
  };

  return (
    <header className="flex h-[68px] w-full shrink-0 items-center justify-between border-b border-line px-6">
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
      {showWrapUp && (
        <Link to="/wrap-up" className="flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-paper">
          <Flag className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Wrap Up</span>
        </Link>
      )}
    </header>
  );
}
