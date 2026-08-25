import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { DashboardShell, ROLE_ACCENT } from "@/components/DashboardShell";
import { StatCard, StatGrid } from "@/components/StatCard";
import { Button } from "@/components/Button";
import { SONDELA, KASI_BREW, THOLULWAZI_DATA, AGENCY } from "@/data/demo";
import { useDemoState } from "@/state/DemoState";

const ACCENT = ROLE_ACCENT.agency;

/**
 * Ported structural pattern from the real app's own pages/Dashboard.tsx
 * (agency branch) -- welcome banner + 3-up StatGrid, genuinely distinct
 * from AgencyCommand.tsx (the real Campaigns list screen, which is what
 * this demo's "Campaigns" nav item was already covering). Real numbers
 * throughout: the 3 real campaigns' own verifiedResponses/cdi fields
 * (same figures AgencyCommand.tsx's own table shows), not new invented
 * stats -- this is a summary view of data that already exists elsewhere
 * in this demo, not a second data source to keep in sync.
 */
export function AgencyOverview() {
  const navigate = useNavigate();
  const { draftCampaigns } = useDemoState();

  const campaigns = [SONDELA, KASI_BREW, THOLULWAZI_DATA];
  const activeCount = campaigns.filter((c) => c.status === "collecting").length + draftCampaigns.length;
  const totalResponses = campaigns.reduce((sum, c) => sum + c.verifiedResponses, 0);
  const avgCdi = (campaigns.reduce((sum, c) => sum + (c.cdi ?? 0), 0) / campaigns.length).toFixed(1);

  return (
    <DashboardShell role="agency">
      <div className="max-w-4xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-2 label-caps" style={{ color: ACCENT }}>Agency Dashboard</div>
        <h1 className="mb-2 font-display text-2xl font-bold text-paper">Welcome, {AGENCY.name}</h1>
        <p className="mb-8 max-w-lg text-[13px] leading-relaxed text-muted">
          A cross-campaign summary — Campaigns has the full list and detail traceability.
        </p>

        <StatGrid className="mb-8 sm:!grid-cols-3">
          <StatCard label="Active Campaigns" value={activeCount} />
          <StatCard label="Verified Responses" value={totalResponses.toLocaleString()} />
          <StatCard label="Avg CDI Score" value={`${avgCdi}/10`} />
        </StatGrid>

        <Button color={ACCENT} onClick={() => navigate("/agency")} className="!rounded-none">
          Go to Campaigns <ArrowRight className="ms-1.5 h-3.5 w-3.5" />
        </Button>
      </div>
    </DashboardShell>
  );
}
