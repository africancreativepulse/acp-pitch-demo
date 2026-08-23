import { Link } from "react-router-dom";
import { ArrowLeft, Flag } from "lucide-react";
import { AcpLogo } from "@/components/AcpLogo";

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
 * step. `backTo` is always a literal path -- this demo's own logical
 * parent for that screen (e.g. Campaign Detail's parent is its Campaigns
 * list, Field Capture's is the Operations hub) -- never raw browser
 * history: history.back() would exit the tab entirely from a freshly
 * loaded or deep-linked screen, which is worse than no button at all in a
 * pitch demo. `backTo` is omitted only on Splash itself, which has no
 * logical parent -- matching the real homepage's own lack of a back
 * control, not an oversight.
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
 * (already there) -- the same two-exception pattern `backTo` already uses.
 */
export function DemoHeader({ backTo, showWrapUp = true }: { backTo?: string; showWrapUp?: boolean }) {
  return (
    <header className="flex h-[68px] w-full shrink-0 items-center justify-between border-b border-line px-6">
      <div className="flex items-center gap-5">
        {backTo && (
          <Link to={backTo} className="flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-paper">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
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
