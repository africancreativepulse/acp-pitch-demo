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
            <Route path="/contribute" element={<ContributorCapture />} />
            <Route path="/operations" element={<OperationsHub />} />
            <Route path="/operations/field" element={<FieldCapture />} />
            <Route path="/operations/review" element={<SupervisorReview />} />
            <Route path="/operations/admin" element={<AdminOversight />} />
            <Route path="/operations/admin/agencies" element={<AgencyVerification />} />
            <Route path="/operations/research" element={<ResearchHub />} />
            <Route path="/wrap-up" element={<WrapUp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NavHistoryProvider>
      </BrowserRouter>
    </DemoStateProvider>
  );
}
