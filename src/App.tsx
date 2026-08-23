import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DemoStateProvider } from "@/state/DemoState";
import { Splash } from "@/screens/Splash";
import { Onboarding } from "@/screens/Onboarding";
import { AgencyCommand } from "@/screens/AgencyCommand";
import { CampaignBuilder } from "@/screens/CampaignBuilder";
import { CulturalRead } from "@/screens/CulturalRead";
import { Evidence } from "@/screens/Evidence";
import { ContributorCapture } from "@/screens/ContributorCapture";
import { OperationsHub } from "@/screens/OperationsHub";
import { FieldCapture } from "@/screens/FieldCapture";
import { SupervisorReview } from "@/screens/SupervisorReview";
import { AdminOversight } from "@/screens/AdminOversight";

export default function App() {
  return (
    <DemoStateProvider>
      {/* Opting into both v7 future flags now -- purely to silence
          React Router's own informational console warnings about them,
          since this demo needs a genuinely clean console. Neither flag
          changes any behavior this app relies on. */}
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding/:role" element={<Onboarding />} />
          <Route path="/agency" element={<AgencyCommand />} />
          <Route path="/agency/new" element={<CampaignBuilder />} />
          <Route path="/agency/campaign/:id" element={<CulturalRead />} />
          <Route path="/agency/campaign/:id/evidence/:dimension" element={<Evidence />} />
          <Route path="/contribute" element={<ContributorCapture />} />
          <Route path="/operations" element={<OperationsHub />} />
          <Route path="/operations/field" element={<FieldCapture />} />
          <Route path="/operations/review" element={<SupervisorReview />} />
          <Route path="/operations/admin" element={<AdminOversight />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </DemoStateProvider>
  );
}
