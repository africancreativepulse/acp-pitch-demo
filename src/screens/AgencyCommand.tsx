import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/Button";
import { CampaignCard } from "@/components/CampaignCard";
import { Modal } from "@/components/Modal";
import { ScorePill } from "@/components/ScorePill";
import { SONDELA, KASI_BREW, THOLULWAZI_DATA, cdiBand, decayBand, type SecondaryCampaign } from "@/data/demo";
import { useDemoState } from "@/state/DemoState";

export function AgencyCommand() {
  const navigate = useNavigate();
  const { draftCampaigns } = useDemoState();
  const [snapshot, setSnapshot] = useState<SecondaryCampaign | null>(null);

  return (
    <div className="min-h-screen bg-ink">
      <TopBar
        right={
          <Button accent="#38C6FF" onClick={() => navigate("/agency/new")}>
            + New Campaign
          </Button>
        }
      />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-2 label-caps">Featured</div>
        <div className="mb-12">
          <CampaignCard
            featured
            client={SONDELA.client}
            cities={SONDELA.cities}
            methodology={SONDELA.methodology}
            verifiedResponses={SONDELA.verifiedResponses}
            status={SONDELA.status}
            cei={SONDELA.cei ?? undefined}
            cdi={SONDELA.cdi}
            decay={SONDELA.decay}
            onClick={() => navigate(`/agency/campaign/${SONDELA.id}`)}
          />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="label-caps">Portfolio</div>
          <div className="label-caps !text-[10px]">
            {2 + draftCampaigns.length} more campaign{2 + draftCampaigns.length === 1 ? "" : "s"}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {draftCampaigns.map((c) => (
            <CampaignCard
              key={c.id}
              client={c.client}
              cities={c.cities}
              methodology={c.methodology}
              verifiedResponses={0}
              status="new"
              onClick={() =>
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
                })
              }
            />
          ))}
          <CampaignCard
            client={KASI_BREW.client}
            cities={KASI_BREW.cities}
            methodology={KASI_BREW.methodology}
            verifiedResponses={KASI_BREW.verifiedResponses}
            status={KASI_BREW.status}
            cei={KASI_BREW.cei}
            cdi={KASI_BREW.cdi}
            decay={KASI_BREW.decay}
            onClick={() => setSnapshot(KASI_BREW)}
          />
          <CampaignCard
            client={THOLULWAZI_DATA.client}
            cities={THOLULWAZI_DATA.cities}
            methodology={THOLULWAZI_DATA.methodology}
            verifiedResponses={THOLULWAZI_DATA.verifiedResponses}
            status={THOLULWAZI_DATA.status}
            cei={THOLULWAZI_DATA.cei}
            cdi={THOLULWAZI_DATA.cdi}
            decay={THOLULWAZI_DATA.decay}
            onClick={() => setSnapshot(THOLULWAZI_DATA)}
          />
        </div>
      </main>

      {snapshot && <SnapshotModal campaign={snapshot} onClose={() => setSnapshot(null)} />}
    </div>
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
        <p className="rounded-lg border border-line bg-white/[0.02] p-4 text-sm leading-relaxed text-muted">
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

          <div className="mb-5 rounded-lg border border-soulgap/30 bg-soulgap/10 p-4">
            <div className="label-caps mb-1.5 !text-soulgap">Soul Gap — {campaign.soulGap.magnitude}</div>
            <p className="text-sm leading-relaxed text-paper">{campaign.soulGap.headline}</p>
          </div>

          {campaign.reportNote && (
            <div className="rounded-lg border border-line bg-white/[0.02] p-4">
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
