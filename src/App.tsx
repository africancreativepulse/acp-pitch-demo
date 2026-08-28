import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DemoStateProvider } from "@/state/DemoState";
import { NavHistoryProvider } from "@/state/NavHistory";
import { Splash } from "@/screens/Splash";
import { Onboarding } from "@/screens/Onboarding";
import { AgencyCommand } from "@/screens/AgencyCommand";
import { CampaignBuilder } from "@/screens/CampaignBuilder";
import { CampaignDetail } from "@/screens/CampaignDetail";
import { ContributorCapture } from "@/screens/ContributorCapture";
import { OperationsHub } from "@/screens/OperationsHub";
import { FieldCapture } from "@/screens/FieldCapture";
import { SupervisorReview } from "@/screens/SupervisorReview";
import { AdminOversight } from "@/screens/AdminOversight";
import { ResearchHub } from "@/screens/ResearchHub";
import { AgencyVerification } from "@/screens/AgencyVerification";
import { WrapUp } from "@/screens/WrapUp";
// Navigation-parity pass (today) -- every real per-role nav item now has
// a genuine, reachable screen. See DashboardShell.tsx's own NAV comment
// for the full reasoning.
import { Profile } from "@/screens/Profile";
import { AgencyOverview } from "@/screens/AgencyOverview";
import { ContributorOverview } from "@/screens/ContributorOverview";
import { AdminOverview } from "@/screens/AdminOverview";
import { Files } from "@/screens/Files";
import { AgencyInsights } from "@/screens/AgencyInsights";
import { ContributorAnalytics } from "@/screens/ContributorAnalytics";
import { Earnings } from "@/screens/Earnings";
import { Browse } from "@/screens/Browse";
import { TranslationQA } from "@/screens/TranslationQA";
// Unified contributor verification (concept sync) -- replaces the old
// per-badge BadgeVerification screen.
import { ContributorVerification } from "@/screens/ContributorVerification";
import { ContributorGate } from "@/components/ContributorGate";

export default function App() {
  return (
    <DemoStateProvider>
      {/* Opting into both v7 future flags now -- purely to silence
          React Router's own informational console warnings about them,
          since this demo needs a genuinely clean console. Neither flag
          changes any behavior this app relies on. */}
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {/* Must sit inside BrowserRouter (needs useLocation/useNavigationType)
            and wrap every route so it sees every navigation in the app,
            not just some -- see NavHistory.tsx for why this replaced the
            old fixed-per-screen `backTo` prop. */}
        <NavHistoryProvider>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/onboarding/:role" element={<Onboarding />} />
            <Route path="/agency" element={<AgencyCommand />} />
            <Route path="/agency/new" element={<CampaignBuilder />} />
            {/* Single route now, matching the real app's own
                CampaignDetail.tsx -- tabs (Overview/CEI & Taste/Soul
                Gap/CDI/Evidence) are local component state, not sub-routes.
                The old /evidence/:dimension route is gone; SignalRing's tap
                now sets that state directly instead of navigating. */}
            <Route path="/agency/campaign/:id" element={<CampaignDetail />} />
            <Route path="/contribute" element={<ContributorGate><ContributorCapture /></ContributorGate>} />
            <Route path="/operations" element={<OperationsHub />} />
            <Route path="/operations/field" element={<FieldCapture />} />
            <Route path="/operations/review" element={<SupervisorReview />} />
            <Route path="/operations/admin" element={<AdminOversight />} />
            <Route path="/operations/admin/agencies" element={<AgencyVerification />} />
            <Route path="/operations/research" element={<ResearchHub />} />
            {/* Navigation-parity pass (today) */}
            {/* ContributorGate: wraps every contributor route so a pending/
                rejected contributor can't reach any of them, not just the
                one entry point -- matches the real app's own full-block
                ProtectedRoute. /profile/:role and /files/:role are shared
                across roles (agency/admin/field workers use them too); the
                gate itself only actually blocks when the route's own :role
                param is "contributor" -- see ContributorGate.tsx. */}
            <Route path="/profile/:role" element={<ContributorGate><Profile /></ContributorGate>} />
            <Route path="/agency/overview" element={<AgencyOverview />} />
            <Route path="/agency/insights" element={<AgencyInsights />} />
            <Route path="/contribute/overview" element={<ContributorGate><ContributorOverview /></ContributorGate>} />
            <Route path="/contribute/browse" element={<ContributorGate><Browse /></ContributorGate>} />
            <Route path="/contribute/analytics" element={<ContributorGate><ContributorAnalytics /></ContributorGate>} />
            <Route path="/files/:role" element={<ContributorGate><Files /></ContributorGate>} />
            <Route path="/earnings/:role" element={<Earnings />} />
            <Route path="/operations/admin/overview" element={<AdminOverview />} />
            <Route path="/operations/admin/translation-qa" element={<TranslationQA />} />
            <Route path="/operations/admin/contributors" element={<ContributorVerification />} />
            <Route path="/wrap-up" element={<WrapUp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NavHistoryProvider>
      </BrowserRouter>
    </DemoStateProvider>
  );
}
