import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, AlertTriangle, ShieldCheck, Globe, CheckCircle2, XCircle, Plus } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { StatGrid, StatCard } from "@/components/StatCard";
import { AlertSourceBadge } from "@/components/AlertSourceBadge";
import {
  REVIEW_QUEUE, riskSignalLabel, COUNTRIES, COMING_SOON_COUNTRIES,
  SONDELA, THOLULWAZI_DATA,
  AGENT_VERIFICATION_QUEUE, FIELD_PAYMENTS_QUEUE, PAYMENT_AGING_DAYS, PAYMENT_DISPUTES_QUEUE,
  RESEARCH_AREA, RESEARCH_ROSTER,
} from "@/data/demo";
import { useDemoState } from "@/state/DemoState";

const ACCENT = "var(--ritual)";
const FIELD_CAMPAIGNS = [SONDELA, THOLULWAZI_DATA];

const TABS = ["agents", "campaigns", "payments", "alerts", "disputes", "areas", "promotions"] as const;
type AdminFieldTab = (typeof TABS)[number];
const TAB_LABEL: Record<AdminFieldTab, string> = {
  agents: "Agents",
  campaigns: "Campaigns",
  payments: "Payments",
  alerts: "Alerts",
  disputes: "Disputes",
  areas: "Areas",
  promotions: "Promotions",
};

/**
 * Real-app parity (nav/cosmetic audit, deferred bucket item 5): port of
 * the real fieldwork/AdminFieldwork.tsx's full 7-tab structure -- this
 * screen previously covered only Alerts (as its whole page), confirmed
 * missing the other 6 entirely. Agents/Payments/Disputes use the same
 * "illustrative, disabled action" discipline AgencyVerification.tsx's own
 * non-live queue rows already established (real, working actions are
 * reserved for state genuinely wired to this session -- see Promotions
 * below) -- not fake-functional buttons that silently do nothing.
 * Promotions is the one real, working exception: a genuine connection to
 * ResearchHub.tsx's own promotion requests (lifted into shared DemoState),
 * closing the exact gap that screen's own closing line used to name.
 */
export function AdminOversight() {
  const { reviewStatus, setReviewStatus, promotionRequests, decidePromotion } = useDemoState();
  const [tab, setTab] = useState<AdminFieldTab>("agents");
  const [newAreaOpen, setNewAreaOpen] = useState(false);

  const pendingCount = REVIEW_QUEUE.filter((i) => (reviewStatus[i.id] ?? "pending") === "pending").length;
  const flaggedItems = REVIEW_QUEUE.filter((i) => reviewStatus[i.id] === "flagged");
  const resolveFlag = (id: string) => setReviewStatus(id, "approved");

  const pendingPromotions = RESEARCH_ROSTER.filter((m) => promotionRequests[m.id] === "pending");
  const agingPayments = FIELD_PAYMENTS_QUEUE.filter((p) => p.daysPending > PAYMENT_AGING_DAYS);

  return (
    <DashboardShell role="admin">
      <div className="max-w-6xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Shield className="h-5 w-5" style={{ color: ACCENT }} />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
              Admin — Fieldwork Controls
            </span>
          </div>
          <Link to="/agency/campaign/sondela-cover" className="text-[13px] text-muted hover:text-paper">
            ← Back to Sondela Cover
          </Link>
        </div>

        <p className="mb-8 max-w-lg text-[13.5px] leading-relaxed text-muted">
          Illustrative platform snapshot — not live production metrics. Pending Verifications and
          Quality Flags Open do move live with whatever's actually happened in Supervisor Review
          this session, and Promotions moves live with Head of Research's own real requests.
        </p>

        <StatGrid className="mb-9">
          <StatCard label="Active Campaigns" value={FIELD_CAMPAIGNS.length} />
          <StatCard label="Pending Verifications" value={pendingCount} />
          <StatCard
            label="Quality Flags Open"
            value={flaggedItems.length}
            deltaTone={flaggedItems.length > 0 ? "warn" : "up"}
            delta={flaggedItems.length > 0 ? "Needs review" : undefined}
          />
          <StatCard label="Field Workers Today" value="6" />
        </StatGrid>

        <div className="mb-8 flex gap-4 overflow-x-auto border-b border-line">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative whitespace-nowrap border-b-2 pb-3 font-mono text-xs font-medium uppercase tracking-[0.15em] transition-colors"
              style={{ color: tab === t ? "var(--paper)" : "var(--muted)", borderColor: tab === t ? ACCENT : "transparent" }}
            >
              {TAB_LABEL[t]}
              {t === "promotions" && pendingPromotions.length > 0 && (
                <span className="ms-1.5 rounded-full px-1.5 py-0.5 font-mono text-[10px]" style={{ backgroundColor: "color-mix(in srgb, var(--language) 16%, transparent)", color: "var(--language)" }}>
                  {pendingPromotions.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "agents" && (
          <div className="space-y-2.5">
            <p className="mb-2 text-xs text-muted">Illustrative queue — this session's own field agents (Thabo M., Zanele K., Kagiso N., Nomsa D.) are already verified.</p>
            {AGENT_VERIFICATION_QUEUE.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded border border-line p-4">
                <div>
                  <div className="text-sm font-medium text-paper">{a.name}</div>
                  <div className="mt-0.5 text-xs text-muted">{a.city} · {a.experience} · submitted {a.submittedDaysAgo}d ago</div>
                </div>
                <div className="flex items-center gap-2">
                  <IconButton tone="approve" disabled><CheckCircle2 className="h-4 w-4" /></IconButton>
                  <IconButton tone="reject" disabled><XCircle className="h-4 w-4" /></IconButton>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "campaigns" && (
          <div className="overflow-x-auto rounded-lg border border-line">
            <div className="grid min-w-[480px] grid-cols-3 gap-2 bg-panel px-[18px] py-3 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
              <span>Campaign</span><span>Methodology</span><span>Status</span>
            </div>
            {FIELD_CAMPAIGNS.map((c) => (
              <div key={c.id} className="grid min-w-[480px] grid-cols-3 items-center gap-2 border-t border-line px-[18px] py-[15px]">
                <span className="text-[13.5px] font-semibold text-paper">{c.client}</span>
                <span className="text-[12.5px] text-muted">{c.methodology}</span>
                <span
                  className="w-fit rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em]"
                  style={{ color: "var(--sound)", backgroundColor: "color-mix(in srgb, var(--sound) 14%, transparent)" }}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "payments" && (
          <div className="space-y-2.5">
            {agingPayments.length > 0 && (
              <div className="mb-2 flex items-center gap-2 rounded border border-dashed p-3 text-xs" style={{ borderColor: "rgba(255,201,60,0.4)", color: "var(--language)" }}>
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {agingPayments.length} payment{agingPayments.length === 1 ? "" : "s"} pending more than {PAYMENT_AGING_DAYS} days.
              </div>
            )}
            {FIELD_PAYMENTS_QUEUE.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded border border-line p-4">
                <div>
                  <div className="text-sm font-medium text-paper">{p.agentName} — {p.campaignClient}</div>
                  <div className="mt-0.5 text-xs text-muted">
                    {p.currency} {p.amount.toLocaleString()} ·{" "}
                    <span style={p.daysPending > PAYMENT_AGING_DAYS ? { color: "var(--language)" } : undefined}>
                      pending {p.daysPending}d
                    </span>
                  </div>
                </div>
                <Button variant="ghost" color={ACCENT} className="!px-3 !py-1.5 !text-[11px]" disabled>Approve</Button>
              </div>
            ))}
          </div>
        )}

        {tab === "alerts" && (
          <div className="space-y-2.5">
            {flaggedItems.length === 0 ? (
              <div className="rounded border border-line p-6 text-center text-xs text-muted">
                No open alerts. Flag something in Supervisor Review to see it land here.
              </div>
            ) : (
              flaggedItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded border border-line p-4">
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-language" />
                      <span className="text-sm font-medium text-paper">{item.campaignClient} · {item.city}</span>
                      {item.riskSignal && <AlertSourceBadge source={item.riskSignal.source} />}
                    </div>
                    <span className="text-xs text-muted">&ldquo;{item.excerpt}&rdquo;</span>
                    {item.riskSignal && (
                      <p className="mt-1 text-[11.5px] text-language">
                        {riskSignalLabel(item.riskSignal.type)} — {item.riskSignal.detail}
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" color={ACCENT} className="!px-3 !py-1.5 !text-[11px]" onClick={() => resolveFlag(item.id)}>
                    Resolve
                  </Button>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "disputes" && (
          <div className="space-y-2.5">
            {PAYMENT_DISPUTES_QUEUE.length === 0 ? (
              <div className="rounded border border-line p-6 text-center text-xs text-muted">No open disputes.</div>
            ) : (
              PAYMENT_DISPUTES_QUEUE.map((d) => (
                <div key={d.id} className="rounded border border-line p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-paper">{d.agentName} — {d.campaignClient}</span>
                    <span className="font-mono text-xs text-muted">{d.currency} {d.amount.toLocaleString()}</span>
                  </div>
                  <p className="mb-3 text-xs text-muted">{d.reason}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" color={ACCENT} className="!px-3 !py-1.5 !text-[11px]" disabled>Uphold</Button>
                    <Button variant="ghost" color={ACCENT} className="!px-3 !py-1.5 !text-[11px]" disabled>Dismiss</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "areas" && (
          <div className="space-y-4">
            <div className="rounded border border-line p-5">
              <div className="mb-1 font-display text-sm font-bold text-paper">{RESEARCH_AREA.area}</div>
              <p className="text-[13px] text-muted">Owned by {RESEARCH_AREA.headOfResearch} since {RESEARCH_AREA.ownedSince} · {RESEARCH_ROSTER.length} roster members</p>
            </div>
            {newAreaOpen ? (
              <div className="rounded border border-dashed border-line p-5 text-xs text-muted">
                Illustrative — creating a second research area isn't wired to real state in this demo; the one real area above (Soweto) is where Head of Research's own roster and promotion queue actually live.
                <button onClick={() => setNewAreaOpen(false)} className="mt-3 block font-semibold hover:underline" style={{ color: ACCENT }}>Close</button>
              </div>
            ) : (
              <Button variant="ghost" color={ACCENT} className="!px-3 !py-1.5 !text-[11px]" onClick={() => setNewAreaOpen(true)}>
                <Plus className="me-1.5 h-3.5 w-3.5" /> New Research Area
              </Button>
            )}
          </div>
        )}

        {tab === "promotions" && (
          <div className="space-y-2.5">
            {pendingPromotions.length === 0 ? (
              <div className="rounded border border-line p-6 text-center text-xs text-muted">
                No pending promotion requests. Request one from a field agent's row in{" "}
                <Link to="/operations/research" className="font-semibold hover:underline" style={{ color: ACCENT }}>Research Hub →</Link>{" "}
                to see it land here for real.
              </div>
            ) : (
              pendingPromotions.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded border border-line p-4">
                  <div>
                    <div className="text-sm font-medium text-paper">{m.name}</div>
                    <div className="mt-0.5 text-xs text-muted">Recruited by {m.recruitedBy} · requesting Head of Research</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconButton tone="approve" onClick={() => decidePromotion(m.id, "approved")}><CheckCircle2 className="h-4 w-4" /></IconButton>
                    <IconButton tone="reject" onClick={() => decidePromotion(m.id, "rejected")}><XCircle className="h-4 w-4" /></IconButton>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="mt-10 rounded border border-line p-5">
          <div className="mb-1 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" style={{ color: ACCENT }} />
            <h3 className="font-display text-sm font-bold text-paper">Agency Vetting</h3>
          </div>
          <p className="mb-3 text-[13px] text-muted">
            Agencies can't post campaigns until their registration documents clear this same
            approve/reject queue.
          </p>
          <Link to="/operations/admin/agencies" className="text-[13px] font-semibold hover:underline" style={{ color: ACCENT }}>
            Open Agency Verification →
          </Link>
        </div>

        <div className="mt-10 rounded border border-line p-5">
          <div className="mb-1 flex items-center gap-2">
            <Globe className="h-4 w-4" style={{ color: ACCENT }} />
            <h3 className="font-display text-sm font-bold text-paper">Markets</h3>
          </div>
          <p className="mb-3 text-[13px] text-muted">
            Live market-by-market, deliberately — not a reach claim ahead of what's actually operated.
          </p>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map((c) => (
              <span key={c} className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em]" style={{ color: "var(--sound)", backgroundColor: "color-mix(in srgb, var(--sound) 14%, transparent)" }}>
                {c} · Live
              </span>
            ))}
            {COMING_SOON_COUNTRIES.map((c) => (
              <span key={c} className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                {c} · Coming Soon
              </span>
            ))}
          </div>
        </div>

        <Link to="/operations/review" className="mt-6 inline-block text-[13px] font-semibold hover:underline" style={{ color: ACCENT }}>
          Go to Supervisor Review →
        </Link>
      </div>
    </DashboardShell>
  );
}
