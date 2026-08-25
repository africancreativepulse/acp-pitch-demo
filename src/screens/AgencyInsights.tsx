import { DashboardShell, ROLE_ACCENT } from "@/components/DashboardShell";
import { InfoHint } from "@/components/InfoHint";
import { SONDELA, KASI_BREW, THOLULWAZI_DATA, CEI_ORDER, CEI_LABEL, CEI_COLOR, CEI_DEFINITION } from "@/data/demo";

const ACCENT = ROLE_ACCENT.agency;

/**
 * Ported structural pattern from the real app's own pages/agency/
 * Insights.tsx -- a cross-campaign CEI dimension breakdown, genuinely
 * distinct from any single campaign's own Cultural Read (SignalRing on
 * CampaignDetail.tsx is per-campaign; this is the portfolio-wide roll-up
 * across all 3 real campaigns' own cei scores, averaged per dimension --
 * same real numbers those campaigns' own records already carry, not a
 * new invented dataset).
 */
export function AgencyInsights() {
  const campaigns = [SONDELA, KASI_BREW, THOLULWAZI_DATA];
  const avgByDimension = Object.fromEntries(
    // Non-null assertion: SONDELA (the only campaign here typed to allow
    // null cei, for the draft-campaign case elsewhere in the app) always
    // has real cei data in this static demo dataset.
    CEI_ORDER.map((key) => [key, campaigns.reduce((sum, c) => sum + c.cei![key], 0) / campaigns.length])
  ) as Record<(typeof CEI_ORDER)[number], number>;

  return (
    <DashboardShell role="agency">
      <div className="max-w-2xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex items-center gap-2.5">
          <div className="h-0.5 w-[30px]" style={{ backgroundColor: ACCENT }} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>Insights</span>
        </div>
        <h1 className="mb-2 flex items-center gap-2 font-display text-[22px] font-bold text-paper">
          CEI Dimension Mix
          <InfoHint text={CEI_DEFINITION} color={ACCENT} />
        </h1>
        <p className="mb-8 max-w-lg text-[13px] leading-relaxed text-muted">
          Averaged across your 3 campaigns — Sondela Cover, Kasi Brew, Tholulwazi Data.
        </p>

        <div className="space-y-4">
          {CEI_ORDER.map((key) => (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between text-[13px]">
                <span className="font-medium text-paper">{CEI_LABEL[key]}</span>
                <span className="font-mono text-muted">{avgByDimension[key].toFixed(1)}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${avgByDimension[key] * 10}%`, backgroundColor: CEI_COLOR[key] }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
