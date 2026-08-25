import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { DashboardShell, ROLE_ACCENT } from "@/components/DashboardShell";
import { Badge } from "@/components/Badge";
import { SONDELA, KASI_BREW, THOLULWAZI_DATA } from "@/data/demo";
import { subCategoryLabel, contributorMatchesCampaign } from "@/data/taxonomy";
import { useDemoState } from "@/state/DemoState";

const ACCENT = ROLE_ACCENT.contributor;

// Only the campaigns a real contributor session could actually see --
// Mzansi Wellness stays admin-direct-only, matching its own established
// comment in data/demo.ts (only ever shown in AgencyCommand's admin
// view). Not a route this demo takes contributors into yet either way
// (no CampaignDetail equivalent for the two secondary campaigns beyond
// AgencyCommand's own Campaign Snapshot panel), so Browse links straight
// into Sondela's real Cultural Read and shows the other two as closed/
// illustrative rows.
const CAMPAIGNS = [SONDELA, KASI_BREW, THOLULWAZI_DATA];

/**
 * Ported structural pattern from the real app's own pages/contributor/
 * BrowseCampaigns.tsx -- a campaign list with a real badge-match
 * indicator, genuinely distinct from My Tasks (which only ever shows the
 * one active Sondela Cover task list). Real badge-matching logic, not
 * decorative: tags come straight off each campaign's own real .categories
 * array (the same one AgencyCommand.tsx/CampaignDetail.tsx already read),
 * checked against contributorBadges from DemoState via the same
 * major-field/approved-only rule the real app's own
 * contributor_matches_campaign() enforces -- see taxonomy.ts.
 */
export function Browse() {
  const navigate = useNavigate();
  const { contributorBadges } = useDemoState();

  return (
    <DashboardShell role="contributor">
      <div className="max-w-3xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex items-center gap-2.5">
          <div className="h-0.5 w-[30px]" style={{ backgroundColor: ACCENT }} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>Browse</span>
        </div>
        <h1 className="mb-2 font-display text-[22px] font-bold text-paper">Active Campaigns</h1>
        <p className="mb-8 text-[13px] text-muted">Find campaigns and earn rewards by completing tasks</p>

        <div className="space-y-3">
          {CAMPAIGNS.map((c) => {
            // Real matching rule is permissive-default (an untagged campaign
            // "matches" everyone) -- but that's not a genuine badge match
            // worth a "Matches your badge" chip, so this indicator only
            // shows for a campaign that's actually tagged AND matched.
            const matches = (c.categories?.length ?? 0) > 0 && contributorMatchesCampaign(c.categories ?? [], contributorBadges);
            const closed = c.status === "completed";
            return (
              <button
                key={c.id}
                type="button"
                disabled={closed}
                onClick={() => navigate(c.id === SONDELA.id ? `/agency/campaign/${c.id}` : "/contribute")}
                className="w-full rounded border border-line p-4 text-start transition-colors enabled:hover:bg-panel disabled:opacity-50"
              >
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="text-[14px] font-semibold text-paper">{c.client}</span>
                  {matches && (
                    <span className="flex shrink-0 items-center gap-1 font-mono text-[10px] uppercase tracking-[0.06em]" style={{ color: ACCENT }}>
                      <CheckCircle2 className="h-3 w-3" /> Matches your badge
                    </span>
                  )}
                </div>
                <div className="mb-2 text-[12.5px] text-muted">{c.cities.join(" · ")}</div>
                <div className="flex flex-wrap items-center gap-2">
                  {c.categories?.map((id) => (
                    <Badge key={id} color={ACCENT}>{subCategoryLabel(id)}</Badge>
                  ))}
                  <Badge color={closed ? "#9AA0AB" : "#2FBF71"}>{closed ? "closed" : "active"}</Badge>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
