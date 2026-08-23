import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { ScorePill } from "@/components/ScorePill";
import { StatGrid, StatCard } from "@/components/StatCard";
import { InfoHint } from "@/components/InfoHint";
import {
  SONDELA, KASI_BREW, THOLULWAZI_DATA, MZANSI_WELLNESS, cdiBand, decayBand, BAND_HEX, categoryLabel,
  CEI_DEFINITION, CDI_DEFINITION,
  type CeiKey, type SecondaryCampaign,
} from "@/data/demo";
import { useDemoState } from "@/state/DemoState";

const ACCENT = "var(--visual)";
const FILTERS = ["all", "live", "draft", "ended"] as const;
type Filter = (typeof FILTERS)[number];

interface Row {
  id: string;
  client: string;
  cities: string[];
  category?: string;
  adminDirect?: boolean;
  verifiedResponses: number;
  cei: Partial<Record<CeiKey, number>> | null;
  cdi: number | null;
  status: "live" | "draft" | "ended";
  onClick: () => void;
}

function compositeCei(cei?: Partial<Record<CeiKey, number>> | null) {
  if (!cei) return null;
  const values = Object.values(cei).filter((v): v is number => typeof v === "number" && v > 0);
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Ported structural pattern from the real app's agency/Campaigns.tsx --
 * header (accent rule + eyebrow + H1 + New Campaign button), a StatGrid
 * summary row, filter chips, then campaigns as a real TABLE (grid header
 * row + hover-to-navigate grid rows), not the card-grid this screen used
 * before. "Budget" (a real column) is dropped -- this demo's data model
 * has no budget concept at all (CampaignBuilder never collects one), and
 * fabricating a number for it would be exactly the kind of invented stat
 * this project has avoided everywhere else. The real page's own "draft"
 * filter bucket stays honestly always-empty here too: this demo's
 * Campaign Builder always launches immediately, there's no save-as-draft
 * path to populate it from.
 *
 * Part E, item 15 -- this same screen doubles as Admin's own Campaign
 * Oversight view (?admin=1, matching the real app's own route -- admin
 * and agency share /dashboard/campaigns there too), same as the real
 * page's `role === "admin" ? "Admin — Campaign Oversight" : "Agency
 * Dashboard"` eyebrow swap. The real, meaningful difference: an admin
 * view sees every campaign including admin-direct ones with no agency
 * owner at all (Mzansi Wellness); an agency's own view only ever sees
 * campaigns they own -- matching the real app's own agency_id-scoped
 * RLS, not just a copy change.
 */
export function AgencyCommand() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get("admin") === "1";
  const { draftCampaigns } = useDemoState();
  const [snapshot, setSnapshot] = useState<SecondaryCampaign | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const rows: Row[] = [
    {
      id: SONDELA.id,
      client: SONDELA.client,
      cities: SONDELA.cities,
      category: SONDELA.category,
      verifiedResponses: SONDELA.verifiedResponses,
      cei: SONDELA.cei,
      cdi: SONDELA.cdi,
      status: "live",
      onClick: () => navigate(`/agency/campaign/${SONDELA.id}`),
    },
    {
      id: KASI_BREW.id,
      client: KASI_BREW.client,
      cities: KASI_BREW.cities,
      category: KASI_BREW.category,
      verifiedResponses: KASI_BREW.verifiedResponses,
      cei: KASI_BREW.cei,
      cdi: KASI_BREW.cdi,
      status: KASI_BREW.status === "completed" ? "ended" : "live",
      onClick: () => setSnapshot(KASI_BREW),
    },
    {
      id: THOLULWAZI_DATA.id,
      client: THOLULWAZI_DATA.client,
      cities: THOLULWAZI_DATA.cities,
      category: THOLULWAZI_DATA.category,
      verifiedResponses: THOLULWAZI_DATA.verifiedResponses,
      cei: THOLULWAZI_DATA.cei,
      cdi: THOLULWAZI_DATA.cdi,
      status: THOLULWAZI_DATA.status === "completed" ? "ended" : "live",
      onClick: () => setSnapshot(THOLULWAZI_DATA),
    },
    ...draftCampaigns.map((c) => ({
      id: c.id,
      client: c.client,
      cities: c.cities,
      category: c.category,
      adminDirect: c.adminDirect,
      verifiedResponses: 0,
      cei: null,
      cdi: null,
      status: "live" as const,
      onClick: () =>
        setSnapshot({
          id: c.id,
          client: c.client,
          cities: c.cities,
          methodology: c.methodology,
          verifiedResponses: 0,
          status: "collecting",
          cei: { visual: 0, sound: 0, language: 0, ritual: 0, pulse: 0, taste: 0 },
          cdi: 0,
          decay: 0,
          soulGap: { magnitude: "Narrow", headline: "" },
        }),
    })),
    // Admin-direct example -- only ever visible from the admin view, same
    // as the real app's own agency_id-scoped RLS would actually enforce.
    ...(isAdmin
      ? [
          {
            id: MZANSI_WELLNESS.id,
            client: MZANSI_WELLNESS.client,
            cities: MZANSI_WELLNESS.cities,
            category: MZANSI_WELLNESS.category,
            adminDirect: true,
            verifiedResponses: MZANSI_WELLNESS.verifiedResponses,
            cei: MZANSI_WELLNESS.cei,
            cdi: MZANSI_WELLNESS.cdi,
            status: "live" as const,
            onClick: () => setSnapshot(MZANSI_WELLNESS),
          },
        ]
      : []),
  ];

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const totalReach = rows.reduce((sum, r) => sum + r.verifiedResponses, 0);
  const ceiValues = rows.map((r) => compositeCei(r.cei)).filter((v): v is number => v != null);
  const avgCei = ceiValues.length > 0 ? (ceiValues.reduce((a, b) => a + b, 0) / ceiValues.length).toFixed(1) : "—";
  const cdiValues = rows.map((r) => r.cdi).filter((v): v is number => v != null);
  const avgCdi = cdiValues.length > 0 ? (cdiValues.reduce((a, b) => a + b, 0) / cdiValues.length).toFixed(1) : "—";

  return (
    <DashboardShell role={isAdmin ? "admin" : "agency"}>
      <div className="max-w-6xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <div className="mb-2.5 flex items-center gap-2.5">
              <div className="h-0.5 w-[30px]" style={{ backgroundColor: ACCENT }} />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                {isAdmin ? "Admin — Campaign Oversight" : "Agency Dashboard"}
              </span>
            </div>
            <h1 className="font-display text-[22px] font-bold text-paper">Campaigns</h1>
          </div>
          <Button color={ACCENT} onClick={() => navigate(isAdmin ? "/agency/new?admin=1" : "/agency/new")}>
            + New Campaign
          </Button>
        </div>

        <StatGrid className="mb-8 md:!grid-cols-4">
          <StatCard label="Active Campaigns" value={rows.filter((r) => r.status === "live").length} />
          <StatCard label="Total Reach" value={totalReach.toLocaleString()} />
          <StatCard label="Avg CEI Score" value={avgCei} />
          <StatCard label="Avg CDI Score" value={avgCdi !== "—" ? `${avgCdi}/10` : "—"} />
        </StatGrid>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-paper">All Campaigns</h2>
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase transition-colors"
                style={
                  filter === f
                    ? { color: ACCENT, borderColor: `color-mix(in srgb, ${ACCENT} 35%, transparent)`, backgroundColor: `color-mix(in srgb, ${ACCENT} 6%, transparent)` }
                    : { color: "var(--muted)", borderColor: "var(--line)" }
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-line">
          <div className="grid min-w-[620px] grid-cols-[2fr_0.9fr_0.9fr_1fr_0.8fr] items-center gap-2 bg-panel px-[18px] py-3 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
            <span>Campaign</span>
            <span className="flex items-center gap-1.5">CEI Score <InfoHint text={CEI_DEFINITION} /></span>
            <span className="flex items-center gap-1.5">CDI Score <InfoHint text={CDI_DEFINITION} /></span>
            <span>Reach</span><span>Status</span>
          </div>
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted">No campaigns match this filter.</div>
          ) : (
            filtered.map((row) => {
              const cei = compositeCei(row.cei);
              return (
                <div
                  key={row.id}
                  onClick={row.onClick}
                  className="grid min-w-[620px] cursor-pointer grid-cols-[2fr_0.9fr_0.9fr_1fr_0.8fr] items-center gap-2 border-t border-line px-[18px] py-[15px] transition-colors hover:bg-panel"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13.5px] font-semibold text-paper">{row.client}</span>
                      {row.adminDirect && (
                        <span className="rounded-full border border-line px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.06em] text-muted">
                          No agency · Admin Direct
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 truncate text-[11.5px] text-muted">
                      {row.cities.join(" · ")}
                      {categoryLabel(row.category) && <span className="text-muted/60"> · {categoryLabel(row.category)}</span>}
                    </div>
                  </div>
                  {cei != null ? (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12.5px] text-paper">{cei.toFixed(1)}</span>
                      <div className="h-1 w-[50px] overflow-hidden rounded-full bg-line">
                        <div className="h-full" style={{ width: `${Math.min(100, cei * 10)}%`, backgroundColor: ACCENT }} />
                      </div>
                    </div>
                  ) : (
                    <span className="font-mono text-[12.5px] text-muted">—</span>
                  )}
                  {row.cdi != null ? (
                    <span className="font-mono text-[12.5px]" style={{ color: BAND_HEX[cdiBand(row.cdi)] }}>
                      {row.cdi.toFixed(1)}/10
                    </span>
                  ) : (
                    <span className="font-mono text-[12.5px] text-muted">—</span>
                  )}
                  <span className="font-mono text-[12.5px] text-muted">{row.verifiedResponses.toLocaleString()}</span>
                  <StatusBadge status={row.status} />
                </div>
              );
            })
          )}
        </div>
      </div>

      {snapshot && <SnapshotModal campaign={snapshot} onClose={() => setSnapshot(null)} />}
    </DashboardShell>
  );
}

function StatusBadge({ status }: { status: Row["status"] }) {
  const meta = {
    live: { label: "live", color: "var(--sound)" },
    draft: { label: "draft", color: "var(--language)" },
    ended: { label: "ended", color: "var(--muted)" },
  }[status];
  return (
    <span
      className="inline-flex w-fit items-center rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.06em]"
      style={{ color: meta.color, backgroundColor: `color-mix(in srgb, ${meta.color} 14%, transparent)` }}
    >
      {meta.label}
    </span>
  );
}

function SnapshotModal({ campaign, onClose }: { campaign: SecondaryCampaign; onClose: () => void }) {
  const isNew = campaign.verifiedResponses === 0;
  return (
    <Modal onClose={onClose}>
      <div className="mb-1 label-caps">Campaign Snapshot</div>
      <h2 className="mb-1 font-display text-2xl font-bold text-paper">{campaign.client}</h2>
      <p className="mb-5 text-[13px] text-muted">{campaign.cities.join(" · ")}</p>

      {isNew ? (
        <p className="rounded border border-line p-4 text-sm leading-relaxed text-muted">
          Just launched — awaiting first responses. Once verified responses start coming in, this
          campaign gets the same full Cultural Read and Evidence traceability as Sondela Cover.
        </p>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <ScorePill label="CDI" value={campaign.cdi.toFixed(1)} band={cdiBand(campaign.cdi)} />
            <ScorePill label="Decay" value={campaign.decay.toFixed(1)} band={decayBand(campaign.decay)} />
            <span className="label-caps rounded-full border border-line px-2.5 py-1">
              {campaign.verifiedResponses} verified responses
            </span>
          </div>

          <div className="mb-5 rounded border border-soulgap/30 bg-soulgap/10 p-4">
            <div className="label-caps mb-1.5 !text-soulgap">Soul Gap — {campaign.soulGap.magnitude}</div>
            <p className="text-sm leading-relaxed text-paper">{campaign.soulGap.headline}</p>
          </div>

          {campaign.reportNote && (
            <div className="rounded border border-line p-4">
              <div className="label-caps mb-1.5">Final Report</div>
              <p className="text-sm leading-relaxed text-muted">{campaign.reportNote}</p>
            </div>
          )}

          <p className="mt-5 text-[12px] text-muted">
            Full dimension-by-dimension evidence traceability is available for Sondela Cover — the
            case study this prototype walks through in depth.
          </p>
        </>
      )}
    </Modal>
  );
}
