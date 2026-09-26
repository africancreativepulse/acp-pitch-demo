import { useState } from "react";
import { Download, AlertTriangle, Globe } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { DashboardShell, ROLE_ACCENT } from "@/components/DashboardShell";
import { InfoHint } from "@/components/InfoHint";
import { Button } from "@/components/Button";
import { StatGrid, StatCard } from "@/components/StatCard";
import { CountUp } from "@/components/CountUp";
import { LegendDonut } from "@/components/LegendDonut";
import { MarketFootprint } from "@/components/MarketFootprint";
import {
  SONDELA, KASI_BREW, THOLULWAZI_DATA,
  CEI_ORDER, CEI_LABEL, CEI_COLOR, CEI_DEFINITION, CDI_DEFINITION,
  cdiBand, BAND_HEX, COUNTRIES,
  type SecondaryCampaign, type Campaign,
} from "@/data/demo";

const ACCENT = ROLE_ACCENT.agency;
const chartTick = { fill: "rgba(246,241,233,0.45)", fontSize: 11 };
const tooltipStyle = { background: "#141620", border: "1px solid rgba(246,241,233,0.12)", borderRadius: 4, fontSize: 12, color: "#F6F1E9" };

// CDI band labels -- this demo's own established 3-band vocabulary
// (cdiBand -> green/amber/red, data/demo.ts) rather than a forced fit to
// the real app's differently-worded highly_authentic/moderately_authentic/
// review_needed enum, which doesn't exist as a value anywhere in this
// project's own data model. Same bands, same meaning, this demo's own
// established words for them (BAND_HEX already provides the colors).
const CDI_BAND_LABEL: Record<string, string> = { green: "Highly Authentic", amber: "Moderately Authentic", red: "Review Needed" };

type AnyCampaign = Campaign | SecondaryCampaign;
const CAMPAIGNS: AnyCampaign[] = [SONDELA, KASI_BREW, THOLULWAZI_DATA];

/**
 * Real-app parity (deferred feature-parity bucket, item 1): port of the
 * real pages/agency/Insights.tsx chart suite -- confirmed missing
 * entirely during the earlier nav/cosmetic audit (this screen was a
 * single static progress-bar list). Adds recharts as a new dependency
 * (matching the real app's own choice exactly, same version -- see
 * package.json) since "port the real chart components" means the real
 * AreaChart/RadarChart/donut, not a third hand-rolled equivalent.
 *
 * Real, honest data limits carried over rather than papered over:
 * - This demo models exactly one score snapshot per campaign (no
 *   `cei_scores` history table equivalent) -- the CEI Score Trend chart
 *   below therefore always takes the real component's own genuine
 *   sub-2-point fallback path ("Only one scoring run on record"), not a
 *   fabricated multi-point history. That fallback IS real-app parity, not
 *   a compromise -- the real page hits it too whenever a campaign has
 *   only been scored once.
 * - CDI risk_flags and the real 5-axis Soul Gap composite/flags don't
 *   exist in this demo's data model yet (Soul Gap here is still the
 *   pre-migration magnitude+headline shape -- see the deferred bucket's
 *   own item 3, a separate, later pass). Soul Gap Snapshot below shows
 *   what this demo's data actually has honestly, not a fabricated
 *   composite score ahead of that real rebuild.
 * - Reach by City & Country has no field_zones/task_responses-equivalent
 *   aggregation to roll up -- MarketFootprint (already built for
 *   CampaignDetail/this page's PDF) covers the country level; the city
 *   list below is each campaign's own real `cities` array, the closest
 *   honest equivalent this demo's data model actually has.
 */
async function downloadPortfolioPdf(
  avgCei: number,
  cdiReviewCount: number,
  soulGapFlaggedCount: number,
  ranked: { title: string; overall: number }[],
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("African Creative Pulse", margin, y);
  y += 22;
  doc.setFontSize(14);
  doc.text("Portfolio Insights — CEI Scores", margin, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  const introLines = doc.splitTextToSize(
    `${ranked.length} campaigns scored across this portfolio, averaging a CEI of ${avgCei.toFixed(1)}${cdiReviewCount > 0 ? `, with ${cdiReviewCount} flagged for CDI review` : ""}.`,
    pageWidth - margin * 2,
  );
  doc.text(introLines, margin, y);
  y += introLines.length * 13 + 20;

  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Portfolio Summary", margin, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Campaigns Scored: ${ranked.length}   ·   Avg CEI: ${avgCei.toFixed(1)}   ·   CDI Review Needed: ${cdiReviewCount}   ·   Soul Gap Flags: ${soulGapFlaggedCount}`, margin, y);
  y += 28;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Top Performing Campaigns", margin, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  ranked.forEach((c, i) => {
    doc.text(`${String(i + 1).padStart(2, "0")}. ${c.title}`, margin, y);
    doc.text(Math.round(c.overall).toString(), margin + 400, y);
    y += 16;
  });
  y += 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Market Footprint", margin, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const perRow = 3;
  COUNTRIES.forEach((country, i) => {
    const col = i % perRow;
    const row = Math.floor(i / perRow);
    doc.text(`• ${country}`, margin + col * 170, y + row * 14);
  });
  y += Math.ceil(COUNTRIES.length / perRow) * 14 + 20;

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Illustrative sample, not measured results · Pitch prototype · No login required", margin, y);

  doc.save(`acp-portfolio-insights-${new Date().toISOString().slice(0, 10)}.pdf`);
}

function exportCampaignScoresCsv(ranked: AnyCampaign[]) {
  const rows: string[][] = [["Campaign", "CEI Overall", ...CEI_ORDER.map((k) => CEI_LABEL[k]), "CDI Score", "CDI Band", "Soul Gap"]];
  ranked.forEach((c) => {
    const overall = CEI_ORDER.reduce((sum, k) => sum + c.cei![k], 0) / CEI_ORDER.length;
    rows.push([
      c.client,
      overall.toFixed(1),
      ...CEI_ORDER.map((k) => c.cei![k].toFixed(1)),
      c.cdi!.toFixed(1),
      CDI_BAND_LABEL[cdiBand(c.cdi!)],
      c.soulGap!.magnitude,
    ]);
  });
  const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `campaign-scores-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AgencyInsights() {
  const [selectedId, setSelectedId] = useState(SONDELA.id);
  const selected = CAMPAIGNS.find((c) => c.id === selectedId)!;

  const overallOf = (c: AnyCampaign) => CEI_ORDER.reduce((sum, k) => sum + c.cei![k], 0) / CEI_ORDER.length;
  const avgCei = CAMPAIGNS.reduce((sum, c) => sum + overallOf(c), 0) / CAMPAIGNS.length;
  const cdiReviewCount = CAMPAIGNS.filter((c) => cdiBand(c.cdi!) === "red").length;
  // Soul Gap flag proxy: this demo's data model doesn't have the real
  // 5-axis flags array yet (see this file's own header comment, item 3 of
  // the deferred bucket rebuilds that properly) -- "Narrow" is the only
  // magnitude that means the read and reality already line up, so
  // anything else is the honest current equivalent of "has a real gap
  // worth flagging."
  const soulGapFlaggedCount = CAMPAIGNS.filter((c) => c.soulGap!.magnitude !== "Narrow").length;

  const ranked = [...CAMPAIGNS].sort((a, b) => overallOf(b) - overallOf(a));

  const selectedOverall = overallOf(selected);
  // This demo models exactly one score snapshot per campaign (no
  // cei_scores-history equivalent) -- always one point, which correctly
  // and honestly takes the real component's own sub-2-point fallback
  // path below. Real, reachable code either way: this renders the actual
  // AreaChart the moment a campaign ever carries a second point.
  const trendData = [{ date: "Current", score: Math.round(selectedOverall * 10) }];
  const radarData = CEI_ORDER.map((key) => ({ dimension: CEI_LABEL[key], score: selected.cei![key] * 10, fullMark: 100 }));
  const donutData = CEI_ORDER.map((key) => ({ name: CEI_LABEL[key], value: selected.cei![key], color: CEI_COLOR[key] }));
  const selectedCdiBand = cdiBand(selected.cdi!);
  const selectedNote = "reportNote" in selected ? selected.reportNote : undefined;

  return (
    <DashboardShell role="agency">
      <div className="max-w-6xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-2.5 flex items-center gap-2.5">
          <div className="h-0.5 w-[30px]" style={{ backgroundColor: ACCENT }} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>Insights</span>
        </div>
        <h1 className="mb-1 font-display text-[22px] font-bold text-paper">CEI Scores</h1>
        <p className="mb-8 text-[13px] text-muted">Cultural Engagement Index analysis across your campaigns.</p>

        <StatGrid className="mb-8">
          <StatCard label="Campaigns Scored" value={<CountUp target={CAMPAIGNS.length} />} />
          <StatCard label="Avg CEI Score" value={avgCei.toFixed(1)} />
          <StatCard
            label="CDI Review Needed"
            value={<CountUp target={cdiReviewCount} />}
            deltaTone={cdiReviewCount > 0 ? "warn" : "up"}
            delta={cdiReviewCount > 0 ? `${cdiReviewCount} of ${CAMPAIGNS.length} campaigns` : "All clear"}
          />
          <StatCard
            label="Soul Gap Flags"
            value={<CountUp target={soulGapFlaggedCount} />}
            deltaTone={soulGapFlaggedCount > 0 ? "warn" : "up"}
            delta={soulGapFlaggedCount > 0 ? `${soulGapFlaggedCount} of ${CAMPAIGNS.length} campaigns` : "All clear"}
          />
        </StatGrid>

        <div className="mb-8 flex flex-wrap gap-2">
          {CAMPAIGNS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className="rounded border px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] transition-colors"
              style={
                selectedId === c.id
                  ? { backgroundColor: ACCENT, borderColor: ACCENT, color: "var(--ink)" }
                  : { color: "var(--muted)", borderColor: "var(--line)" }
              }
            >
              {c.client}
            </button>
          ))}
        </div>

        <h2 className="mb-1 font-display text-lg font-bold text-paper">This Campaign</h2>
        <p className="mb-5 text-xs text-muted">Trend, scores, and dimension mix for the campaign selected above.</p>

        <div className="mb-8 rounded-lg border border-line bg-panel p-5 shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:p-6">
          <h3 className="mb-1 font-display text-sm font-bold text-paper">CEI Score Trend</h3>
          <p className="mb-4 text-xs text-muted">{selected.client}</p>
          {trendData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={200} debounce={200}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="insights-trend-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(246,241,233,0.08)" />
                <XAxis dataKey="date" tick={chartTick} axisLine={false} tickLine={false} />
                <YAxis tick={chartTick} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="score" stroke={ACCENT} strokeWidth={2} fill="url(#insights-trend-fill)" dot={{ fill: ACCENT, r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            // This demo models exactly one score snapshot per campaign
            // (see this file's own header comment) -- same genuine
            // sub-2-point fallback the real component itself falls back
            // to for a sparsely-scored campaign, not a cut corner.
            <div className="flex h-[120px] flex-col items-center justify-center text-center">
              <div className="font-mono text-2xl font-semibold text-paper">{Math.round(selectedOverall)}</div>
              <p className="mt-1.5 text-xs text-muted">
                Only one scoring run on record — a trend will appear once this campaign has been scored again.
              </p>
            </div>
          )}
        </div>

        <div className="mb-px grid gap-px overflow-hidden rounded-lg border border-line bg-line shadow-[0_8px_24px_rgba(0,0,0,0.25)] lg:grid-cols-[1.6fr_1fr]">
          <div className="min-w-0 bg-panel p-5 sm:p-6">
            <h3 className="mb-1 font-display text-sm font-bold text-paper">{selected.client}</h3>
            <p className="mb-4 text-xs text-muted">
              CEI Scores: <span className="text-lg font-bold text-paper">{selectedOverall.toFixed(1)}</span>
              <InfoHint text={CEI_DEFINITION} color={ACCENT} />
            </p>
            <ResponsiveContainer width="100%" height={280} debounce={200}>
              <RadarChart data={radarData}>
                <defs>
                  <radialGradient id="insights-radar-fill">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity={0.05} />
                  </radialGradient>
                </defs>
                <PolarGrid stroke="rgba(246,241,233,0.08)" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: "rgba(246,241,233,0.45)", fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "rgba(246,241,233,0.3)", fontSize: 10 }} />
                <Radar dataKey="score" stroke={ACCENT} fill="url(#insights-radar-fill)" strokeWidth={2} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="min-w-0 bg-panel p-6">
            <h3 className="mb-4 font-display text-sm font-bold text-paper">CEI Dimension Mix</h3>
            <LegendDonut data={donutData} size={110} />
          </div>
        </div>

        <div className="mb-8 mt-px rounded-lg border border-line bg-panel p-5 shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:p-6">
          <h3 className="mb-4 font-display text-sm font-bold text-paper">CDI Snapshot <InfoHint text={CDI_DEFINITION} color={ACCENT} /></h3>
          <div className="mb-3 flex items-center gap-2.5">
            <span className="font-mono text-2xl font-bold text-paper">{selected.cdi!.toFixed(1)}<span className="text-sm text-muted">/10</span></span>
            <span
              className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em]"
              style={{ color: BAND_HEX[selectedCdiBand], backgroundColor: `color-mix(in srgb, ${BAND_HEX[selectedCdiBand]} 14%, transparent)` }}
            >
              {CDI_BAND_LABEL[selectedCdiBand]}
            </span>
          </div>
          {selectedNote && <p className="text-xs leading-relaxed text-muted">{selectedNote}</p>}
        </div>

        <div className="mb-8 rounded-lg border border-line bg-panel p-5 shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:p-6">
          <h3 className="mb-4 font-display text-sm font-bold text-paper">Soul Gap Snapshot</h3>
          <div className="mb-3 flex items-center gap-2.5">
            <span className="font-mono text-lg font-bold text-paper">{selected.soulGap!.magnitude}</span>
            <span className="text-xs text-muted">distance between claimed and felt</span>
          </div>
          <p className="text-xs leading-relaxed text-muted">{selected.soulGap!.headline}</p>
        </div>

        <div className="mb-5 mt-10 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-8">
          <div>
            <h2 className="mb-1 font-display text-lg font-bold text-paper">Across All Campaigns</h2>
            <p className="text-xs text-muted">Rollup and comparison across every campaign you run.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" color={ACCENT} className="!px-3 !py-1.5 !text-[11px]" onClick={() => exportCampaignScoresCsv(ranked)}>
              <Download className="me-2 h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button
              variant="ghost"
              color={ACCENT}
              className="!px-3 !py-1.5 !text-[11px]"
              onClick={() => downloadPortfolioPdf(avgCei, cdiReviewCount, soulGapFlaggedCount, ranked.map((c) => ({ title: c.client, overall: overallOf(c) })))}
            >
              <Download className="me-2 h-3.5 w-3.5" /> Export PDF
            </Button>
          </div>
        </div>

        <h3 className="mb-4 font-display text-base font-bold text-paper">Top Performing Campaigns</h3>
        <div className="mb-8 space-y-2">
          {ranked.map((c, i) => {
            const flagged = cdiBand(c.cdi!) === "red" || c.soulGap!.magnitude !== "Narrow";
            const rowColor = CEI_COLOR[CEI_ORDER[i % CEI_ORDER.length]];
            const overall = overallOf(c);
            return (
              <div key={c.id} className="flex items-center gap-3.5 rounded border border-line px-4 py-3">
                <span className="w-[18px] font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                {flagged && <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-pulse" aria-label="Flagged for review" />}
                <span className="flex-1 truncate text-sm font-semibold text-paper">{c.client}</span>
                <span className="font-mono text-[13px] text-paper">{Math.round(overall)}</span>
                <div className="h-1 w-[100px] overflow-hidden rounded-full bg-line">
                  <div className="h-full" style={{ width: `${Math.min(100, overall)}%`, background: `linear-gradient(90deg, color-mix(in srgb, ${rowColor} 55%, transparent), ${rowColor})` }} />
                </div>
              </div>
            );
          })}
        </div>

        <h3 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-paper">
          <Globe className="h-4 w-4 text-visual" /> Reach by City &amp; Country
        </h3>
        <div className="mb-6">
          <MarketFootprint activityByCountry={{ "South Africa": CAMPAIGNS.length }} />
        </div>
        <p className="mb-4 text-xs text-muted">
          Every campaign in this portfolio runs in South Africa today -- the list below keeps each campaign's own city-level detail, the finer granularity the map above rounds up past.
        </p>
        <div className="rounded-lg border border-line p-5 shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:p-6">
          {CAMPAIGNS.flatMap((c) => c.cities.map((city) => ({ city, client: c.client }))).map(({ city, client }) => (
            <div key={`${client}-${city}`} className="mb-3 flex items-center gap-3 last:mb-0">
              <span className="w-40 shrink-0 truncate text-xs text-muted" title={city}>{city}</span>
              <span className="flex-1 truncate text-xs text-paper">{client}</span>
              <span className="w-14 shrink-0 font-mono text-[9px] uppercase tracking-[0.08em] text-muted">city</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
