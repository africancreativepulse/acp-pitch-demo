import type { ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Clock, XCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import { useDemoState } from "@/state/DemoState";

const ACCENT = "var(--sound)";

/**
 * Admin's "Preview Contributor Dashboard" entry point (ContributorVerification.tsx)
 * lets a presenter see the real dashboard's look without a genuine live
 * approval, driven by DemoState's own independent previewContributorDashboard
 * flag (see that field's own header comment for why it's separate from the
 * real gate). This banner is the disclosure that makes the override honest --
 * "clearly distinct from claiming it's a specific row's actual account," per
 * the explicit brief -- rendered above the entire dashboard tree (Navbar
 * included), same var(--language) amber this codebase already uses for
 * every other "pending/needs attention" signal (STATUS_META in
 * ContributorVerification.tsx, this file's own pending-state icon below).
 */
function PreviewBanner({ onExit }: { onExit: () => void }) {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b px-6 py-2.5 text-center font-mono text-[11px] uppercase tracking-[0.12em]"
      style={{
        borderColor: "color-mix(in srgb, var(--language) 35%, transparent)",
        backgroundColor: "color-mix(in srgb, var(--language) 12%, transparent)",
        color: "var(--language)",
      }}
    >
      <span>Preview mode — illustrative contributor dashboard, not a specific account</span>
      <button type="button" onClick={onExit} className="underline hover:no-underline">
        Exit Preview
      </button>
    </div>
  );
}

/**
 * Unified contributor verification (concept sync with tonight's real-app
 * change): the real app's ProtectedRoute.tsx now full-blocks every
 * /dashboard/* route for a contributor until admin approves their whole
 * submission (identity + badges together) -- a pending contributor
 * genuinely cannot reach their own dashboard or profile at all, not even
 * a glimpse. This wraps every contributor route the same way, in one
 * shared component rather than a check duplicated per screen.
 *
 * Wraps both contributor-only fixed routes (/contribute, /contribute/
 * browse, etc. -- no :role param, always gated) and the shared
 * /profile/:role and /files/:role routes agencies/admins/field workers
 * also use -- appliesHere below only gates when the route is genuinely
 * being viewed as the contributor (paramRole is undefined on the
 * fixed routes, or explicitly "contributor" on the shared ones).
 *
 * Deliberately NOT wrapped in DashboardShell -- a blocked contributor
 * shouldn't see the sidebar/nav for a dashboard they can't enter yet,
 * same reasoning the real app's AgencyPendingReview/ContributorPending
 * Review use a minimal standalone layout instead of the normal shell.
 *
 * Unlocks on either a genuine approval OR admin's own
 * previewContributorDashboard override (see that field's own header
 * comment in DemoState.tsx) -- the two are intentionally independent, so
 * toggling preview on never touches the live session's real
 * contributorVerificationStatus, and a genuinely approved session never
 * shows the preview banner (nothing to disclose -- it's the real account).
 */
export function ContributorGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { role: paramRole } = useParams<{ role?: string }>();
  const { contributorVerificationStatus, resubmitContributorVerification, previewContributorDashboard, setPreviewContributorDashboard } =
    useDemoState();

  const appliesHere = paramRole === undefined || paramRole === "contributor";
  const genuinelyApproved = contributorVerificationStatus === "approved";
  const previewing = appliesHere && previewContributorDashboard && !genuinelyApproved;

  if (!appliesHere || genuinelyApproved || previewContributorDashboard) {
    return (
      <>
        {previewing && (
          <PreviewBanner
            onExit={() => {
              setPreviewContributorDashboard(false);
              navigate("/operations/admin/contributors");
            }}
          />
        )}
        {children}
      </>
    );
  }

  const rejected = contributorVerificationStatus === "rejected";

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      {/* Real-app parity, Change 2 -- see Navbar.tsx's own header comment.
          Still deliberately NOT DashboardShell (see this file's own
          header comment on why), but the top bar itself follows the same
          everywhere-swap as every other screen. */}
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: rejected ? "color-mix(in srgb, var(--pulse) 14%, transparent)" : "color-mix(in srgb, var(--language) 14%, transparent)" }}
          >
            {rejected ? (
              <XCircle className="h-8 w-8" style={{ color: "var(--pulse)" }} />
            ) : (
              <Clock className="h-8 w-8" style={{ color: "var(--language)" }} />
            )}
          </div>
          <h1 className="mb-3 font-display text-2xl font-bold text-paper">
            {rejected ? "Verification not approved" : "Verification pending"}
          </h1>
          <p className="mb-8 leading-relaxed text-muted">
            {rejected ? (
              <>
                We weren't able to approve your submission from the details reviewed. In the real app,
                editing anything here — identity or evidence — automatically resubmits you for review.
                Tap below to simulate that.
              </>
            ) : (
              <>
                Your identity details and expert badges are with our team for review — as one submission,
                not badge by badge. Nothing is visible, including to you, until they're approved together.
              </>
            )}
          </p>

          {rejected ? (
            <Button color={ACCENT} onClick={resubmitContributorVerification} className="!rounded-none !px-8">
              Resubmit for Review
            </Button>
          ) : (
            <Link
              to="/operations/admin/contributors"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] hover:underline"
              style={{ color: ACCENT }}
            >
              See how this gets reviewed →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
