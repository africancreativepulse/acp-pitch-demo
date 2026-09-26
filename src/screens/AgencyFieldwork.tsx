import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, MapPin, Target, UserPlus, CheckCircle2 } from "lucide-react";
import { DashboardShell, ROLE_ACCENT } from "@/components/DashboardShell";
import { Button } from "@/components/Button";
import {
  SONDELA, THOLULWAZI_DATA,
  FIELD_AGENT_ROSTER, FIELD_AGENT_POOL,
  type FieldAgentExperience,
} from "@/data/demo";
import { useDemoState } from "@/state/DemoState";
import { FieldworkAnalyticsContent } from "./FieldworkAnalyticsContent";

const ACCENT = ROLE_ACCENT.agency;

// Real, field-eligible campaigns only -- Kasi Brew is Digital Only, never
// field-eligible (matches the real page's own methodology_type === "field"
// filter, applied here at the data level since this demo's campaigns are
// static rather than queried).
const STATIC_FIELD_CAMPAIGNS = [SONDELA, THOLULWAZI_DATA];

type FieldworkCampaign = { id: string; client: string; status: string; methodology: string };

const STATUS_META: Record<string, { label: string; color: string }> = {
  active: { label: "active", color: "var(--sound)" },
  invited: { label: "invited", color: "var(--language)" },
  accepted: { label: "accepted", color: "var(--visual)" },
  completed: { label: "completed", color: "var(--muted)" },
};

const TABS = ["campaigns", "assign", "roster", "analytics"] as const;
type FieldTab = (typeof TABS)[number];
const TAB_LABEL: Record<FieldTab, string> = {
  campaigns: "Campaigns",
  assign: "Agent Assignment",
  roster: "Agent Roster",
  analytics: "Analytics",
};

/**
 * Real-app parity (nav/cosmetic audit, deferred bucket item 4): port of
 * the real fieldwork/AgencyFieldwork.tsx -- confirmed missing entirely
 * (the nav slot this occupies was deliberately relabeled "Operations
 * Layer" and repointed at the demo-only /operations hub; reversed on
 * direct instruction -- see DashboardShell.tsx's own NAV comment).
 *
 * Scoped to agency's own real tab set (Campaigns/Agent Assignment/Agent
 * Roster/Analytics) -- Back-Check is admin-only in the real page too (a
 * real separation-of-duties reason, not a demo cut: agency already has
 * this covered via a real assigned supervisor, admin doesn't). Zones,
 * agent roster, and the "Find Agents" pool are invented but plausible
 * (data/demo.ts's own FIELD_AGENT_ROSTER/FIELD_AGENT_POOL header comment),
 * grounded in each field-eligible campaign's own real cities.
 *
 * Assigning an agent from the pool is a real, working DemoState mutation
 * (not a no-op click) -- see useDemoState's own assignedFieldAgents.
 */
export function AgencyFieldwork() {
  const navigate = useNavigate();
  const { assignedFieldAgents, assignFieldAgent, draftCampaigns } = useDemoState();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [tab, setTab] = useState<FieldTab>("campaigns");
  const [agentSearch, setAgentSearch] = useState("");
  const [filterExperience, setFilterExperience] = useState<FieldAgentExperience | "">("");

  // Real bug caught during visual verification: a field campaign launched
  // via CreateFieldCampaign.tsx never showed up here -- this list was
  // reading only the two static campaigns, never draftCampaigns. Same
  // merge AgencyCommand.tsx's own campaign list already does for standard
  // campaigns, scoped here to methodology === "Field Only" (this screen's
  // whole reason to exist, distinct from AgencyCommand's own agency/
  // digital list).
  const FIELD_CAMPAIGNS: FieldworkCampaign[] = [
    ...STATIC_FIELD_CAMPAIGNS,
    // DraftCampaign has no status field of its own (CampaignBuilder.tsx's
    // own AgencyCommand merge hardcodes "live" the same way) -- "collecting"
    // is this file's own equivalent freshly-launched state.
    ...draftCampaigns
      .filter((c) => c.methodology === "Field Only")
      .map((c) => ({ id: c.id, client: c.client, status: "collecting", methodology: c.methodology })),
  ];

  const selectedCampaign = FIELD_CAMPAIGNS.find((c) => c.id === selectedCampaignId) ?? null;
  const rosterForSelected = FIELD_AGENT_ROSTER.filter((a) => a.campaignId === selectedCampaignId);
  const poolAgentsAssigned = assignedFieldAgents[selectedCampaignId ?? ""] ?? [];

  const reachForCampaign = (campaignId: string) =>
    FIELD_AGENT_ROSTER.filter((a) => a.campaignId === campaignId).reduce((sum, a) => sum + a.totalCount, 0);

  const filteredPool = FIELD_AGENT_POOL.filter((a) => {
    const matchSearch = !agentSearch || a.name.toLowerCase().includes(agentSearch.toLowerCase());
    const matchExp = !filterExperience || a.experience === filterExperience;
    return matchSearch && matchExp;
  });

  const goToAssign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setTab("assign");
  };

  return (
    <DashboardShell role="agency">
      <div className="max-w-6xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2.5">
              <div className="h-0.5 w-[30px]" style={{ backgroundColor: ACCENT }} />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>Fieldwork</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-paper">Field Operations</h1>
          </div>
          <Button color={ACCENT} onClick={() => navigate("/agency/fieldwork/new")}>
            <Plus className="me-2 h-4 w-4" /> New Field Campaign
          </Button>
        </div>

        <div className="mb-8 flex gap-4 overflow-x-auto border-b border-line">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="whitespace-nowrap border-b-2 pb-3 font-mono text-xs font-medium uppercase tracking-[0.15em] transition-colors"
              style={{ color: tab === t ? "var(--paper)" : "var(--muted)", borderColor: tab === t ? ACCENT : "transparent" }}
            >
              {TAB_LABEL[t]}
            </button>
          ))}
        </div>

        {tab === "campaigns" && (
          <div className="overflow-x-auto rounded-lg border border-line">
            <div className="grid min-w-[560px] grid-cols-[2fr_1fr_1fr_1fr] gap-2 bg-panel px-[18px] py-3 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
              <span>Campaign</span><span>Reach</span><span>Geography</span><span>Status</span>
            </div>
            {FIELD_CAMPAIGNS.map((c) => (
              <div
                key={c.id}
                className="grid min-w-[560px] cursor-pointer grid-cols-[2fr_1fr_1fr_1fr] items-center gap-2 border-t border-line px-[18px] py-[15px] transition-colors hover:bg-panel"
                onClick={() => goToAssign(c.id)}
              >
                <span className="text-[13.5px] font-semibold text-paper">{c.client}</span>
                <span className="flex items-center gap-1 font-mono text-[12.5px] text-muted">
                  <Target className="h-3 w-3" /> {reachForCampaign(c.id)}
                </span>
                <span className="flex items-center gap-1 font-mono text-[12.5px] text-muted"><MapPin className="h-3 w-3" /> South Africa</span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <span
                    className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em]"
                    style={c.status === "collecting"
                      ? { color: "var(--sound)", backgroundColor: "color-mix(in srgb, var(--sound) 14%, transparent)" }
                      : { color: "var(--muted)", backgroundColor: "color-mix(in srgb, var(--muted) 14%, transparent)" }}
                  >
                    {c.status}
                  </span>
                  <button onClick={() => goToAssign(c.id)} className="text-muted hover:text-paper" title="Assign agents">
                    <UserPlus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "assign" && selectedCampaign && (
          <div className="space-y-6">
            <div>
              <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Zones — {selectedCampaign.client}</span>
              <div className="flex flex-wrap gap-2">
                {rosterForSelected.map((a) => (
                  <span key={a.zone} className="rounded border border-line bg-panel px-3 py-1.5 text-xs text-paper">{a.zone}</span>
                ))}
                {rosterForSelected.length === 0 && <span className="text-xs text-muted">No zones assigned yet.</span>}
              </div>
            </div>

            <div>
              <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Find Agents</span>
              <div className="mb-4 flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    value={agentSearch}
                    onChange={(e) => setAgentSearch(e.target.value)}
                    placeholder="Search by name..."
                    className="h-10 w-full rounded border border-line bg-transparent ps-10 pe-3 text-sm text-paper placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-visual"
                  />
                </div>
                <select
                  value={filterExperience}
                  onChange={(e) => setFilterExperience(e.target.value as FieldAgentExperience | "")}
                  className="h-10 w-40 rounded border border-line bg-panel px-3 text-sm text-paper"
                >
                  <option value="">All levels</option>
                  <option value="novice">Novice</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="divide-y divide-line rounded border border-line">
                {filteredPool.map((a) => {
                  const alreadyAssigned = poolAgentsAssigned.includes(a.id);
                  return (
                    <div key={a.id} className="flex items-center justify-between p-3">
                      <div>
                        <span className="text-sm font-medium text-paper">{a.name}</span>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-muted">
                          <span>{a.city}</span>
                          <span className="capitalize">{a.experience}</span>
                          <span>{a.languages.join(", ")}</span>
                        </div>
                      </div>
                      {alreadyAssigned ? (
                        <span className="flex items-center gap-1 text-xs text-sound"><CheckCircle2 className="h-3 w-3" /> Assigned</span>
                      ) : (
                        <Button
                          variant="ghost"
                          color={ACCENT}
                          className="!px-3 !py-1.5 !text-[11px]"
                          onClick={() => selectedCampaignId && assignFieldAgent(selectedCampaignId, a.id)}
                        >
                          <UserPlus className="me-1 h-3 w-3" /> Invite
                        </Button>
                      )}
                    </div>
                  );
                })}
                {filteredPool.length === 0 && <div className="p-6 text-center text-xs text-muted">No verified agents found.</div>}
              </div>
            </div>
          </div>
        )}

        {tab === "roster" && selectedCampaign && (
          <div className="overflow-x-auto rounded-lg border border-line">
            <div className="grid min-w-[640px] grid-cols-6 gap-2 bg-panel p-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
              <span>Agent</span><span>Zone</span><span>Today</span><span>Total</span><span>Quality</span><span>Status</span>
            </div>
            {rosterForSelected.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted">No agents assigned yet.</div>
            ) : (
              rosterForSelected.map((a) => {
                const meta = STATUS_META[a.status] ?? STATUS_META.invited;
                return (
                  <div key={a.id} className="grid min-w-[640px] grid-cols-6 items-center gap-2 border-t border-line p-3 text-sm">
                    <span className="truncate font-medium text-paper">{a.name}</span>
                    <span className="truncate text-xs text-muted">{a.zone}</span>
                    <span className="text-muted">{a.todayCount}</span>
                    <span className="text-muted">{a.totalCount}/{a.target}</span>
                    <span className="text-muted">{a.qualityScore > 0 ? `${a.qualityScore}/100` : "—"}</span>
                    <span
                      className="w-fit rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em]"
                      style={{ color: meta.color, backgroundColor: `color-mix(in srgb, ${meta.color} 14%, transparent)` }}
                    >
                      {meta.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === "analytics" && <FieldworkAnalyticsContent />}

        {tab !== "campaigns" && tab !== "analytics" && !selectedCampaign && (
          <div className="rounded border border-line p-8 text-center">
            <p className="text-sm text-muted">Select a campaign from the Campaigns tab first.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
