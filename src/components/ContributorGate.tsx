import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Clock, XCircle } from "lucide-react";
import { DemoHeader } from "@/components/DemoHeader";
import { Button } from "@/components/Button";
import { useDemoState } from "@/state/DemoState";

const ACCENT = "var(--sound)";

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
 */
export function ContributorGate({ children }: { children: ReactNode }) {
  const { role: paramRole } = useParams<{ role?: string }>();
  const { contributorVerificationStatus, resubmitContributorVerification } = useDemoState();

  const appliesHere = paramRole === undefined || paramRole === "contributor";
  if (!appliesHere || contributorVerificationStatus === "approved") {
    return <>{children}</>;
  }

  const rejected = contributorVerificationStatus === "rejected";

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <DemoHeader />
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
