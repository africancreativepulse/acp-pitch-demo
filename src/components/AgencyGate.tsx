import type { ReactNode } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Clock, XCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import { useDemoState } from "@/state/DemoState";

const ACCENT = "var(--visual)";

/**
 * Agency's own live pipeline (Track C, tonight's agency-verification-depth
 * session) -- mirrors ContributorGate.tsx exactly. The real app's own
 * ProtectedRoute.tsx full-blocks every /dashboard/* route for an agency
 * until admin approves their submission; this wraps every agency route the
 * same way, in one shared component rather than a check duplicated per
 * screen.
 *
 * Wraps both agency-only fixed routes (/agency, /agency/new, /agency/
 * campaign/:id, /agency/overview, /agency/insights -- no :role param) and
 * the shared /profile/:role and /files/:role routes contributors/admins/
 * field workers also use -- appliesHere below only gates when the route is
 * genuinely being viewed as the agency itself.
 *
 * Admin oversight bypass: Admin's own "Campaigns" nav item links to
 * /agency?admin=1 (AgencyCommand.tsx's own isAdmin check), and
 * CampaignBuilder.tsx has the identical /agency/new?admin=1 pattern -- two
 * fixed agency routes admin genuinely needs to reach without being an
 * agency at all. appliesHere excludes ?admin=1 for exactly this reason;
 * CampaignDetail/AgencyOverview/AgencyInsights have no such admin path
 * (confirmed by grep before this build), so they gate unconditionally.
 *
 * Deliberately NOT wrapped in DashboardShell -- same reasoning
 * ContributorGate.tsx's own header comment gives: a blocked agency
 * shouldn't see the sidebar/nav for a dashboard it can't enter yet.
 *
 * No preview-mode override here, unlike ContributorGate -- that mechanism
 * exists specifically for ContributorVerification.tsx's own static
 * illustrative rows (Lindiwe K. etc.), which have no live backing at all.
 * Agency's own static illustrative rows (Bright Horizon Media, Lagos Pulse
 * Collective) get the same disabled-button treatment instead (see
 * AgencyVerification.tsx), and the always-verified "Ndoni Creative"
 * shortcut already shows what an approved agency dashboard looks like
 * without needing a separate preview flag.
 */
export function AgencyGate({ children }: { children: ReactNode }) {
  const { role: paramRole } = useParams<{ role?: string }>();
  const [searchParams] = useSearchParams();
  const { agencyVerificationStatus, resubmitAgencyVerification } = useDemoState();

  const isAdminOversight = searchParams.get("admin") === "1";
  const appliesHere = (paramRole === undefined || paramRole === "agency") && !isAdminOversight;
  const genuinelyVerified = agencyVerificationStatus === "verified";

  if (!appliesHere || genuinelyVerified) {
    return <>{children}</>;
  }

  const rejected = agencyVerificationStatus === "rejected";

  return (
    <div className="flex min-h-screen flex-col bg-ink">
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
                editing anything here automatically resubmits you for review. Tap below to simulate that.
              </>
            ) : (
              <>
                Your agency details and document are with our team for review. Full dashboard access
                unlocks as soon as you're verified -- we'll notify you here and by email.
              </>
            )}
          </p>

          {rejected ? (
            <Button color={ACCENT} onClick={resubmitAgencyVerification} className="!rounded-none !px-8">
              Resubmit for Review
            </Button>
          ) : (
            <Link
              to="/operations/admin/agencies"
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
