import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { DashboardShell } from "@/components/DashboardShell";
import { SignalRing } from "@/components/SignalRing";
import { DepthGauge } from "@/components/DepthGauge";
import { GaugeArc } from "@/components/GaugeArc";
import { ScorePill } from "@/components/ScorePill";
import { VerifiedBadge } from "@/components/Badge";
import { WaveformStatic } from "@/components/WaveformStatic";
import { cn } from "@/lib/cn";
import {
  SONDELA,
  CEI_ORDER,
  CEI_LABEL,
  CEI_COLOR,
  SOULGAP_COLOR,
  cdiBand,
  decayBand,
  quadrantRead,
  type CeiKey,
  type EvidenceItem,
} from "@/data/demo";

const ACCENT = "var(--visual)";
type SwitcherKey = CeiKey | "soulgap";

// Real tabs, verbatim from the real app's agency/CampaignDetail.tsx
// (TABS/TAB_LABEL consts there): Overview / CEI & Taste / Soul Gap / CDI.
// One addition beyond the real set -- "Evidence" -- since this demo's
// core differentiator (traceable quote/photo/audio evidence per
// dimension) isn't a real CampaignDetail.tsx tab at all; the real page's
// closest equivalent ("Positioning vs. Reality" delta bars) needs
// positioning-claim data this demo doesn't model, so rather than force-fit
// fabricated positioning numbers, Evidence stays its own tab with the
// real, audited content this project has been careful about throughout.
const TABS = ["overview", "cei", "soulgap", "cdi", "evidence"] as const;
type Tab = (typeof TABS)[number];
const TAB_LABEL: Record<Tab, string> = {
  overview: "Overview",
  cei: "CEI & Taste",
  soulgap: "Soul Gap",
  cdi: "CDI",
  evidence: "Evidence",
};

/**
 * Ported structural pattern from the real app's agency/CampaignDetail.tsx
 * -- this used to be two separate screens on two separate routes
 * (CulturalRead.tsx + a /evidence/:dimension route), which was itself a
 * structural deviation from the real page: the real CampaignDetail.tsx is
 * ONE route with tabs as pure client-side state (Overview/CEI &
 * Taste/Soul Gap/CDI/Responses), never a second URL per tab. Merged into
 * this single file to match: SignalRing's tap-to-navigate now sets local
 * state (`setActiveDimension` + `setTab("evidence")`) instead of calling
 * navigate() to a sub-route.
 */
export function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [activeDimension, setActiveDimension] = useState<SwitcherKey>("ritual");

  if (id !== SONDELA.id || !SONDELA.cei || SONDELA.cdi == null || SONDELA.decay == null || !SONDELA.soulGap) {
    return <Navigate to="/agency" replace />;
  }

  const cei = SONDELA.cei;
  const cdi = SONDELA.cdi;
  const decay = SONDELA.decay;
  const soulGap = SONDELA.soulGap;

  const ringData = CEI_ORDER.map((key) => ({
    key,
    name: CEI_LABEL[key].toUpperCase(),
    pct: cei[key] * 10,
    color: CEI_COLOR[key],
  }));
  const ceiOverall = CEI_ORDER.reduce((sum, k) => sum + cei[k], 0) / CEI_ORDER.length;
  const quadrant = quadrantRead(cdi, decay);

  const goToEvidence = (dim: SwitcherKey) => {
    setActiveDimension(dim);
    setTab("evidence");
  };

  return (
    <DashboardShell role="agency">
      <div className="max-w-6xl px-6 pb-[60px] pt-[30px] md:px-10">
        <button onClick={() => navigate("/agency")} className="mb-6 flex items-center gap-2 text-sm text-muted hover:text-paper">
          ← Back to Campaigns
        </button>

        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold text-paper">{SONDELA.client}</h1>
            <span
              className="rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.06em]"
              style={{ color: "var(--sound)", backgroundColor: "color-mix(in srgb, var(--sound) 14%, transparent)" }}
            >
              collecting
            </span>
          </div>
          <p className="text-muted">
            &ldquo;{SONDELA.concept}&rdquo; · {SONDELA.cities.join(" · ")}
          </p>
          <p className="mt-2 text-[12.5px] text-muted">
            Collected via <span className="text-paper">{SONDELA.methodology}</span> ·{" "}
            <a href="/operations" className="font-semibold text-visual hover:underline">see how →</a>
          </p>
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

        {tab === "overview" && (
          <>
            <h3 className="mb-3.5 font-display text-sm font-bold text-paper">Scores at a Glance</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <button onClick={() => setTab("cei")} className="rounded border border-line p-5 text-start transition-colors hover:border-[color-mix(in_srgb,var(--visual)_40%,transparent)] hover:bg-panel">
                <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">CEI Overall</div>
                <div className="font-mono text-2xl font-bold text-paper">{ceiOverall.toFixed(1)}</div>
                <p className="mt-1 text-xs text-muted">Six real dimensions — see CEI & Taste</p>
              </button>
              <button onClick={() => setTab("soulgap")} className="rounded border border-line p-5 text-start transition-colors hover:border-[color-mix(in_srgb,var(--soulgap)_40%,transparent)] hover:bg-panel">
                <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Soul Gap</div>
                <div className="font-mono text-2xl font-bold text-paper">{soulGap.magnitude}</div>
                <p className="mt-1 text-xs text-muted">Distance between claimed and felt</p>
              </button>
              <button onClick={() => setTab("cdi")} className="rounded border border-line p-5 text-start transition-colors hover:border-[color-mix(in_srgb,var(--pulse)_40%,transparent)] hover:bg-panel">
                <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">CDI</div>
                <div className="font-mono text-2xl font-bold text-paper">{cdi.toFixed(1)}/10</div>
                <p className="mt-1 text-xs text-muted">{quadrant.label}</p>
              </button>
            </div>
          </>
        )}

        {tab === "cei" && (
          <div className="rounded border border-line p-6 sm:p-8">
            <h3 className="mb-1 font-display text-sm font-bold text-paper">CEI Snapshot</h3>
            <p className="mb-4 text-xs text-muted">Overall: <span className="text-lg font-bold text-paper">{ceiOverall.toFixed(1)}</span></p>
            <div className="flex flex-col items-center">
              <SignalRing dimensions={ringData} animated={false} onSelect={(key) => goToEvidence(key as SwitcherKey)} />
              <p className="mt-4 text-center text-[12px] text-muted">Tap any dimension to see the evidence behind it →</p>
            </div>
          </div>
        )}

        {tab === "soulgap" && (
          <div className="rounded border border-line p-6" style={{ borderColor: `${SOULGAP_COLOR}40` }}>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="mb-1 font-display text-sm font-bold text-paper">Soul Gap</h3>
                <p className="text-xs text-muted">Distance between what's claimed and what's felt — a derived metric, not one of the six CEI dimensions.</p>
              </div>
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                style={{ backgroundColor: `${SOULGAP_COLOR}22`, color: SOULGAP_COLOR }}
              >
                {soulGap.magnitude}
              </span>
            </div>
            <p className="max-w-2xl font-display text-xl font-semibold leading-snug text-paper">{soulGap.headline}</p>
            <button
              onClick={() => goToEvidence("soulgap")}
              className="mt-4 text-[13px] font-semibold hover:underline"
              style={{ color: SOULGAP_COLOR }}
            >
              See where this comes from →
            </button>
          </div>
        )}

        {tab === "cdi" && (
          <div className="space-y-6">
            <div className="rounded border border-line p-6">
              <h3 className="mb-1 font-display text-sm font-bold text-paper">CDI Snapshot</h3>
              <div className="mb-3 mt-3 flex items-center gap-2.5">
                <span className="font-mono text-2xl font-bold text-paper">{cdi.toFixed(1)}<span className="text-sm text-muted">/10</span></span>
                <span
                  className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em]"
                  style={{ color: "var(--sound)", backgroundColor: "color-mix(in srgb, var(--sound) 14%, transparent)" }}
                >
                  Highly Authentic
                </span>
              </div>
              {/* DepthGauge below is a genuine real design-system component
                  (see SignalRing/DepthGauge port) -- the real CampaignDetail
                  CDI tab is actually this minimal (number + band pill +
                  description, no gauge visual at all), but since DepthGauge
                  is real, kept, rather than dropped, as supporting visual
                  richness on top of the real page's own minimal pattern,
                  not instead of it. */}
              <DepthGauge score={cdi} animated={false} className="mx-auto max-w-lg" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Decay Risk has no real-app equivalent to port -- see
                  GaugeArc.tsx's own header comment. */}
              <div className="flex items-center justify-center rounded border border-line p-6">
                <GaugeArc value={decay} band={decayBand(decay)} label="Decay Risk" />
              </div>
              <div className="rounded border border-line p-6">
                <div className="label-caps mb-3">2×2 Read</div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <ScorePill label="CDI" value={cdi.toFixed(1)} band={cdiBand(cdi)} />
                  <ScorePill label="Decay" value={decay.toFixed(1)} band={decayBand(decay)} />
                </div>
                <h3 className="font-display text-lg font-bold text-paper">{quadrant.label}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{quadrant.description}</p>
              </div>
            </div>
          </div>
        )}

        {tab === "evidence" && (
          <EvidenceTab activeDimension={activeDimension} onSwitch={goToEvidence} />
        )}
      </div>
    </DashboardShell>
  );
}

function EvidenceTab({ activeDimension, onSwitch }: { activeDimension: SwitcherKey; onSwitch: (key: SwitcherKey) => void }) {
  const isSoulGap = activeDimension === "soulgap";
  const color = isSoulGap ? SOULGAP_COLOR : CEI_COLOR[activeDimension as CeiKey];
  const label = isSoulGap ? "Soul Gap" : CEI_LABEL[activeDimension as CeiKey];
  const score = isSoulGap ? null : SONDELA.cei?.[activeDimension as CeiKey];
  const items: EvidenceItem[] = isSoulGap ? SONDELA.soulGap?.evidence ?? [] : SONDELA.evidence[activeDimension as CeiKey];

  return (
    <div>
      <div className="mb-7 flex items-baseline gap-3">
        <h2 className="font-display text-2xl font-bold" style={{ color }}>{label}</h2>
        {score != null && <span className="tabular font-mono text-lg font-semibold text-muted">{score.toFixed(1)}</span>}
      </div>

      <div className="no-scrollbar mb-9 flex gap-2 overflow-x-auto pb-1">
        {CEI_ORDER.map((key) => (
          <SwitchChip key={key} active={activeDimension === key} color={CEI_COLOR[key]} label={CEI_LABEL[key]} onClick={() => onSwitch(key)} />
        ))}
        <SwitchChip active={activeDimension === "soulgap"} color={SOULGAP_COLOR} label="Soul Gap" onClick={() => onSwitch("soulgap")} />
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <EvidenceCard key={i} item={item} color={color} />
        ))}
      </div>

      <div className="mt-10 flex items-center gap-3 border-t border-line pt-6">
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
        <p className="font-display text-[15px] font-medium text-paper">Every score traces to what someone actually said.</p>
      </div>
    </div>
  );
}

function SwitchChip({ active, color, label, onClick }: { active: boolean; color: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
        active ? "text-ink" : "border-line text-muted hover:border-white/25 hover:text-paper"
      )}
      style={active ? { backgroundColor: color, borderColor: color } : undefined}
    >
      {label}
    </button>
  );
}

function EvidenceCard({ item, color }: { item: EvidenceItem; color: string }) {
  return (
    <div className="rounded border border-line p-6">
      {item.kind === "quote" && (
        <div>
          <p className="font-display text-[19px] font-medium leading-snug text-paper">&ldquo;{item.quote}&rdquo;</p>
          {item.gloss && <p className="mt-2 text-[14px] italic leading-relaxed text-muted">{item.gloss}</p>}
        </div>
      )}

      {item.kind === "photo" && (
        <div className="flex items-start gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-line bg-white/[0.03]" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="9" cy="10.5" r="1.75" />
              <path d="M21 15.5 15.5 10.5 6 19" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="label-caps mb-1.5">Photo Submission</div>
            <p className="text-[14px] leading-relaxed text-paper">{item.caption}</p>
          </div>
        </div>
      )}

      {item.kind === "audio" && (
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${color}22` }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <span className="label-caps">Audio Submission</span>
              <span className="tabular font-mono text-[12px] text-muted">{item.durationLabel}</span>
            </div>
            <WaveformStatic color={color} />
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{item.caption}</p>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-3.5">
        <span className="label-caps">{item.city}</span>
        <span className="label-caps !text-[10px]">Contributor {item.contributorId}</span>
        {item.date ? (
          <span className="label-caps !text-[10px]">{item.date}</span>
        ) : (
          <span className="label-caps !text-[10px] text-muted">Date pending</span>
        )}
        <VerifiedBadge linkTo="/operations/review" />
      </div>
    </div>
  );
}
