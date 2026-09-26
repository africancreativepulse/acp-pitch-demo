import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatCard, StatGrid } from "@/components/StatCard";
import { LegendDonut } from "@/components/LegendDonut";
import { ROLE_ACCENT } from "@/components/DashboardShell";
import {
  SONDELA, THOLULWAZI_DATA,
  FIELD_AGENT_ROSTER, FIELD_DAILY_TREND, FIELD_DEMOGRAPHIC_SPLIT, FIELD_QUALITY_ALERTS,
} from "@/data/demo";
import { useDemoState } from "@/state/DemoState";

const STATIC_FIELD_CAMPAIGNS = [SONDELA, THOLULWAZI_DATA];
const chartTick = { fill: "rgba(246,241,233,0.45)", fontSize: 10 };
const tooltipStyle = { background: "#141620", border: "1px solid rgba(246,241,233,0.12)", borderRadius: 4, fontSize: 12, color: "#F6F1E9" };
const DEMO_COLORS = ["#38C6FF", "#FF5A29"];

/**
 * Real-app parity (nav/cosmetic audit, deferred bucket item 4): port of
 * the real fieldwork/FieldworkAnalyticsContent.tsx -- extracted the same
 * way the real file documents (so the exact same content renders both as
 * AgencyFieldwork's own Analytics tab and this standalone route,
 * FieldworkAnalytics.tsx, not two copies). Real chart components
 * (LineChart, LegendDonut -- LegendDonut already ported for item 1's
 * Insights rebuild, reused as-is here) over the two real field-eligible
 * campaigns' own illustrative-but-plausible datasets (data/demo.ts's own
 * FIELD_DAILY_TREND/FIELD_DEMOGRAPHIC_SPLIT header comment).
 */
export function FieldworkAnalyticsContent() {
  const [selectedCampaignId, setSelectedCampaignId] = useState(SONDELA.id);
  const accent = ROLE_ACCENT.agency;
  const { draftCampaigns } = useDemoState();

  // Same real bug/fix as AgencyFieldwork.tsx's own campaign list -- a
  // campaign launched via CreateFieldCampaign.tsx needs to be selectable
  // here too, not just on the Campaigns tab.
  const FIELD_CAMPAIGNS = [
    ...STATIC_FIELD_CAMPAIGNS,
    ...draftCampaigns.filter((c) => c.methodology === "Field Only").map((c) => ({ id: c.id, client: c.client })),
  ];

  const campaign = FIELD_CAMPAIGNS.find((c) => c.id === selectedCampaignId)!;
  const roster = FIELD_AGENT_ROSTER.filter((a) => a.campaignId === selectedCampaignId);
  const dailyData = FIELD_DAILY_TREND[selectedCampaignId] ?? [];
  const demographicData = (FIELD_DEMOGRAPHIC_SPLIT[selectedCampaignId] ?? []).map((d, i) => ({ ...d, color: DEMO_COLORS[i % DEMO_COLORS.length] }));
  const alerts = FIELD_QUALITY_ALERTS.filter((a) => a.campaignId === selectedCampaignId);

  const totalResponses = roster.reduce((sum, a) => sum + a.totalCount, 0);
  const targetSample = roster.reduce((sum, a) => sum + a.target, 0) || 1;
  const completionPct = Math.min(100, Math.round((totalResponses / targetSample) * 100));
  const avgDailyRate = dailyData.length > 0 ? Math.round(dailyData.reduce((sum, d) => sum + d.completed, 0) / dailyData.length) : 0;

  const agentStats = [...roster].sort((a, b) => b.totalCount - a.totalCount);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2.5">
            <div className="h-0.5 w-[30px]" style={{ backgroundColor: accent }} />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>Fieldwork Analytics</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-paper">Field Operations Report</h1>
        </div>
        <select
          value={selectedCampaignId}
          onChange={(e) => setSelectedCampaignId(e.target.value)}
          className="h-10 w-64 rounded border border-line bg-panel px-3 text-sm text-paper"
        >
          {FIELD_CAMPAIGNS.map((c) => (
            <option key={c.id} value={c.id}>{c.client}</option>
          ))}
        </select>
      </div>

      <StatGrid className="mb-8">
        <StatCard label="Responses" value={`${totalResponses}/${targetSample}`} delta={`${completionPct}%`} />
        <StatCard label="Avg Daily Rate" value={avgDailyRate} delta="per day" />
        <StatCard label="Agents Active" value={roster.filter((a) => a.status === "active").length} />
        <StatCard label="Quality Flags" value={alerts.length} deltaTone={alerts.length > 0 ? "warn" : "up"} delta={alerts.length > 0 ? "Needs review" : "All clear"} />
      </StatGrid>

      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs text-muted">
          <span>Collection Progress — {campaign.client}</span>
          <span>{completionPct}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-line">
          <div className="h-full transition-all duration-500" style={{ width: `${completionPct}%`, backgroundColor: accent }} />
        </div>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="min-w-0 rounded border border-line p-6">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Daily Collection Trend</div>
          {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200} debounce={200}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(246,241,233,0.08)" />
                <XAxis dataKey="day" tick={chartTick} stroke="rgba(246,241,233,0.2)" />
                <YAxis tick={chartTick} stroke="rgba(246,241,233,0.2)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="completed" stroke={accent} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="flex h-[200px] items-center justify-center text-xs text-muted">No data yet</div>}
        </div>

        <div className="min-w-0 rounded border border-line p-6">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Demographic Breakdown</div>
          {demographicData.length > 0 ? (
            <LegendDonut data={demographicData} size={150} />
          ) : <div className="flex h-[200px] items-center justify-center text-xs text-muted">No data yet</div>}
        </div>
      </div>

      <div className="mb-8 rounded border border-line p-6">
        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Agent Performance Leaderboard</div>
        <div className="overflow-x-auto rounded border border-line">
          <div className="grid min-w-[560px] grid-cols-4 gap-2 border-b border-line bg-panel p-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
            <span>Agent</span><span>Responses</span><span>Quality</span><span>Target</span>
          </div>
          {agentStats.map((a, i) => (
            <div key={a.id} className="grid min-w-[560px] grid-cols-4 items-center gap-2 border-b border-line p-3 text-sm last:border-0" style={i === 0 ? { backgroundColor: `color-mix(in srgb, ${accent} 5%, transparent)` } : undefined}>
              <span className="flex items-center gap-2 font-medium text-paper">
                {i === 0 && <span className="text-xs">🏆</span>}
                {a.name}
              </span>
              <span className="text-paper">{a.totalCount}</span>
              <span className="text-paper">{a.qualityScore > 0 ? `${a.qualityScore}/100` : "—"}</span>
              <span className="text-muted">{a.target}</span>
            </div>
          ))}
          {agentStats.length === 0 && <div className="p-4 text-center text-xs text-muted">No agents assigned</div>}
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="rounded border border-line p-6">
          <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            <AlertTriangle className="h-4 w-4 text-language" /> Quality Alerts
          </div>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between rounded border border-line p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-paper">{alert.description}</span>
                  <span className="text-xs text-muted">{alert.alertType}</span>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em]"
                  style={alert.severity === "critical"
                    ? { color: "var(--pulse)", backgroundColor: "color-mix(in srgb, var(--pulse) 14%, transparent)" }
                    : { color: "var(--language)", backgroundColor: "color-mix(in srgb, var(--language) 14%, transparent)" }}
                >
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FieldworkAnalyticsContent;
