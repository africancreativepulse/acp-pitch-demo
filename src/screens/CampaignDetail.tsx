import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Download, BellRing } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/Button";
import { SignalRing } from "@/components/SignalRing";
import { DepthGauge } from "@/components/DepthGauge";
import { GaugeArc } from "@/components/GaugeArc";
import { ScorePill } from "@/components/ScorePill";
import { VerifiedBadge } from "@/components/Badge";
import { WaveformStatic } from "@/components/WaveformStatic";
import { InfoHint } from "@/components/InfoHint";
import { cn } from "@/lib/cn";
import {
  SONDELA,
  CEI_ORDER,
  CEI_LABEL,
  CEI_COLOR,
  SOULGAP_COLOR,
  CEI_DEFINITION,
  CDI_DEFINITION,
  cdiBand,
  decayBand,
  quadrantRead,
  categoryLabel,
  type CeiKey,
  type EvidenceItem,
} from "@/data/demo";

const ACCENT = "var(--visual)";
type SwitcherKey = CeiKey | "soulgap";

// Real, working CSV export -- not simulated. Builds every evidence item
// (all six CEI dimensions plus the standalone Soul Gap panel) into an
// actual downloadable file via a Blob URL, entirely client-side. Matches
// the real app's own shipped capability (Export CSV); PDF stays a
// disabled "coming soon" button below since the real app's own PDF
// export is genuinely deferred too, not because this demo is cutting a
// corner the real product doesn't also have.
function downloadEvidenceCsv() {
  const rows: string[][] = [["Dimension", "Kind", "Content", "City", "Contributor", "Date", "Verified"]];
  const contentOf = (item: EvidenceItem) => (item.kind === "quote" ? item.quote : item.caption);

  (Object.keys(SONDELA.evidence) as CeiKey[]).forEach((dim) => {
    SONDELA.evidence[dim].forEach((item) => {
      rows.push([CEI_LABEL[dim], item.kind, contentOf(item), item.city, item.contributorId, item.date ?? "Pending", "Yes"]);
    });
  });
  (SONDELA.soulGap?.evidence ?? []).forEach((item) => {
    rows.push(["Soul Gap", item.kind, contentOf(item), item.city, item.contributorId, item.date ?? "Pending", "Yes"]);
  });

  const csv = rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sondela-cover-evidence.csv";
  a.click();
  URL.revokeObjectURL(url);
}

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
  const [tab, setTab] = useState<Tab>("overview");
  const [activeDimension, setActiveDimension] = useState<SwitcherKey>("ritual");
  const [urgent, setUrgent] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Part D, item 13 -- a real device push notification, shown as a
  // moment rather than claimed in copy. Ties to badge matching (Part C,
  // item 11): the toast names the specific badge Sondela Cover's own
  // category matches against, not a generic "some contributors."
  const markUrgent = () => {
    setUrgent(true);
    window.setTimeout(() => setShowToast(true), 700);
    window.setTimeout(() => setShowToast(false), 7000);
  };

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
    <DashboardShell role="agency" backTo="/agency">
      <div className="max-w-6xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-bold text-paper">{SONDELA.client}</h1>
              <span
                className="rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.06em]"
                style={{ color: "var(--sound)", backgroundColor: "color-mix(in srgb, var(--sound) 14%, transparent)" }}
              >
                collecting
              </span>
              {categoryLabel(SONDELA.category) && (
                <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                  {categoryLabel(SONDELA.category)}
                </span>
              )}
              {urgent && (
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em]"
                  style={{ color: "var(--pulse)", backgroundColor: "color-mix(in srgb, var(--pulse) 14%, transparent)" }}
                >
                  <BellRing className="h-2.5 w-2.5" /> Urgent
                </span>
              )}
            </div>
            <p className="text-muted">
              &ldquo;{SONDELA.concept}&rdquo; · {SONDELA.cities.join(" · ")}
            </p>
            <p className="mt-2 text-[12.5px] text-muted">
              Collected via <span className="text-paper">{SONDELA.methodology}</span> ·{" "}
              <a href="#collection" className="font-semibold text-visual hover:underline">see how →</a>
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button variant="ghost" color="var(--pulse)" className="!px-3 !py-1.5 !text-[11px]" onClick={markUrgent} disabled={urgent}>
              <BellRing className="me-1.5 h-3.5 w-3.5" /> {urgent ? "Marked Urgent" : "Mark Urgent"}
            </Button>
            <Button variant="ghost" color={ACCENT} className="!px-3 !py-1.5 !text-[11px]" onClick={downloadEvidenceCsv}>
              <Download className="me-1.5 h-3.5 w-3.5" /> Export CSV
            </Button>
            <span
              className="inline-flex cursor-not-allowed items-center gap-1 rounded-sm border border-line px-[14px] py-2 font-display text-[11px] font-semibold uppercase tracking-[0.06em] text-muted"
              title="PDF export is genuinely still in progress on the real platform too -- not a corner cut for this demo."
            >
              Export PDF · Coming Soon
            </span>
          </div>
        </div>

        {/* Simulated device push -- fixed to the viewport so it reads as
            arriving "over" the UI the way a real OS/browser push would,
            regardless of which tab is open underneath it. */}
        {showToast && (
          <div className="fixed bottom-6 end-6 z-50 w-80 rounded border border-line bg-panel p-4 shadow-2xl animate-toast-in">
            <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--pulse)" }}>
              <BellRing className="h-3.5 w-3.5" /> Push Notification
            </div>
            <p className="text-[13px] leading-relaxed text-paper">
              New urgent campaign: <strong>Sondela Cover</strong> needs your voice.
            </p>
            <p className="mt-1 text-[11.5px] text-muted">
              Sent to contributors with a matching {categoryLabel(SONDELA.category)} badge — real
              device push, illustrative recipient count.
            </p>
          </div>
        )}

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
              {/* role="button" divs, not <button>, on these two -- each now
                  contains InfoHint's own real (nested) button, and a
                  <button> can't validly contain another <button>. */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setTab("cei")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setTab("cei")}
                className="cursor-pointer rounded border border-line p-5 text-start transition-colors hover:border-[color-mix(in_srgb,var(--visual)_40%,transparent)] hover:bg-panel"
              >
                <div className="mb-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                  CEI Overall <InfoHint text={CEI_DEFINITION} />
                </div>
                <div className="font-mono text-2xl font-bold text-paper">{ceiOverall.toFixed(1)}</div>
                <p className="mt-1 text-xs text-muted">Six real dimensions — see CEI & Taste</p>
              </div>
              <button onClick={() => setTab("soulgap")} className="rounded border border-line p-5 text-start transition-colors hover:border-[color-mix(in_srgb,var(--soulgap)_40%,transparent)] hover:bg-panel">
                <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Soul Gap</div>
                <div className="font-mono text-2xl font-bold text-paper">{soulGap.magnitude}</div>
                <p className="mt-1 text-xs text-muted">Distance between claimed and felt</p>
              </button>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setTab("cdi")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setTab("cdi")}
                className="cursor-pointer rounded border border-line p-5 text-start transition-colors hover:border-[color-mix(in_srgb,var(--pulse)_40%,transparent)] hover:bg-panel"
              >
                <div className="mb-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                  CDI <InfoHint text={CDI_DEFINITION} />
                </div>
                <div className="font-mono text-2xl font-bold text-paper">{cdi.toFixed(1)}/10</div>
                <p className="mt-1 text-xs text-muted">{quadrant.label}</p>
              </div>
            </div>

            {/* Part A, item 3 -- one continuous journey, not disconnected
                screens. This is the "Digital + Field Hybrid" methodology
                line above made concrete: every response, whichever method
                captured it, goes through the same back-check before it
                counts toward this campaign's evidence. */}
            <div id="collection" className="mt-10 scroll-mt-6">
              <h3 className="mb-1 font-display text-sm font-bold text-paper">Collection & Verification</h3>
              <p className="mb-4 max-w-2xl text-[13px] text-muted">
                Digital + Field Hybrid means two collection methods feed this one campaign — both
                back-checked the same way before anything counts as Verified.
              </p>
              <div className="grid gap-3 sm:grid-cols-4">
                <ChainCard to="/contribute" accent="var(--sound)" step="1" label="Digital" desc="Contributor app" />
                <ChainCard to="/operations/field" accent="var(--pulse)" step="2" label="Field" desc="Paper, Thabo M." />
                <ChainCard to="/operations/review" accent="var(--soulgap)" step="3" label="Supervisor" desc="Back-check queue" />
                <ChainCard to="/operations/admin" accent="var(--ritual)" step="4" label="Admin" desc="Platform oversight" />
              </div>
            </div>
          </>
        )}

        {tab === "cei" && (
          <div className="rounded border border-line p-6 sm:p-8">
            <h3 className="mb-1 font-display text-sm font-bold text-paper">CEI Snapshot</h3>
            <p className="mb-2 text-xs text-muted">Overall: <span className="text-lg font-bold text-paper">{ceiOverall.toFixed(1)}</span></p>
            <p className="mb-4 max-w-lg text-[12.5px] leading-relaxed text-muted">{CEI_DEFINITION}</p>
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
              <p className="max-w-lg text-[12.5px] leading-relaxed text-muted">{CDI_DEFINITION}</p>
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

function ChainCard({ to, accent, step, label, desc }: { to: string; accent: string; step: string; label: string; desc: string }) {
  return (
    <Link
      to={to}
      className="group rounded border border-line p-4 transition-colors hover:bg-panel"
      style={{ borderColor: `${accent}30` }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Step {step}</span>
        <span className="text-muted transition-transform group-hover:translate-x-1" style={{ color: accent }}>→</span>
      </div>
      <div className="font-display text-sm font-bold" style={{ color: accent }}>{label}</div>
      <p className="mt-0.5 text-[11.5px] text-muted">{desc}</p>
    </Link>
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
