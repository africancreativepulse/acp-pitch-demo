import { cdiBand, decayBand, type Band, type CeiKey } from "@/data/demo";
import { ScorePill } from "@/components/ScorePill";
import { cn } from "@/lib/cn";

export interface CampaignCardProps {
  client: string;
  cities: string[];
  methodology: string;
  verifiedResponses: number;
  status: "collecting" | "completed" | "new";
  cei?: Partial<Record<CeiKey, number>> | null;
  cdi?: number | null;
  decay?: number | null;
  featured?: boolean;
  onClick?: () => void;
}

function compositeCei(cei?: Partial<Record<CeiKey, number>> | null) {
  if (!cei) return null;
  const values = Object.values(cei).filter((v): v is number => typeof v === "number");
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function CampaignCard({
  client,
  cities,
  methodology,
  verifiedResponses,
  status,
  cei,
  cdi,
  decay,
  featured = false,
  onClick,
}: CampaignCardProps) {
  const composite = compositeCei(cei);
  const cdiB: Band | null = cdi != null ? cdiBand(cdi) : null;
  const decayB: Band | null = decay != null ? decayBand(decay) : null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "card-surface group w-full text-left transition-all hover:border-white/20",
        featured ? "p-7" : "p-5"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-2.5">
            <h3 className={cn("font-display font-bold text-paper", featured ? "text-2xl" : "text-base")}>
              {client}
            </h3>
            <StatusPill status={status} />
          </div>
          <p className="text-[13px] text-muted">{cities.join(" · ")}</p>
        </div>
        {composite != null && (
          <div className="text-right">
            <div className="label-caps">Composite CEI</div>
            <div className="tabular font-mono text-2xl font-bold text-paper">{composite.toFixed(1)}</div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <span className="label-caps rounded-full border border-line px-2.5 py-1">{methodology}</span>
        <span className="label-caps rounded-full border border-line px-2.5 py-1">
          {verifiedResponses} verified responses
        </span>
        {cdi != null && cdiB && <ScorePill label="CDI" value={cdi.toFixed(1)} band={cdiB} />}
        {decay != null && decayB && decayB !== "green" && (
          <ScorePill label="Decay risk" value={decay.toFixed(1)} band={decayB} />
        )}
      </div>
    </button>
  );
}

function StatusPill({ status }: { status: "collecting" | "completed" | "new" }) {
  if (status === "collecting") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-0.5 label-caps !text-[10px]">
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-sound" />
        Collecting
      </span>
    );
  }
  if (status === "new") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-0.5 label-caps !text-[10px] !text-visual">
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-visual" />
        Just launched
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-0.5 label-caps !text-[10px] !text-band-green">
      Completed
    </span>
  );
}
