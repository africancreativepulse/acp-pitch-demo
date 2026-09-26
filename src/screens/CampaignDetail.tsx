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
import { PositioningRealityBars } from "@/components/PositioningRealityBars";
import { cn } from "@/lib/cn";
import {
  SONDELA,
  CEI_ORDER,
  CEI_LABEL,
  CEI_COLOR,
  SOULGAP_COLOR,
  CEI_DEFINITION,
  CDI_DEFINITION,
  COUNTRIES,
  cdiBand,
  decayBand,
  quadrantRead,
  SOUL_GAP_AXIS_META,
  SOUL_GAP_AXIS_ORDER,
  SONDELA_SOUL_GAP_READS,
  soulGapLevelToPercent,
  soulGapComposite,
  deriveSoulGapFlags,
  type CeiKey,
  type EvidenceItem,
  type SoulGapAxisKey,
} from "@/data/demo";
import { subCategoryLabel } from "@/data/taxonomy";
import type { CeiPositioningRealityAxis } from "@/data/demo";

// Real-app parity (deferred feature-parity bucket, item 3): the real
// lib/soul-gap engine's five anchored axes, replacing this tab's old
// single magnitude+headline stub -- see data/demo.ts's own
// SONDELA_SOUL_GAP_READS header comment for the full reasoning. Same
// PositioningRealityBars component the CEI tab already uses (a genuine
// port, not a second implementation) -- only the data and the single
// SOULGAP_COLOR (not per-axis colors) differ, matching the real
// soulGapAxisCards()'s own choice.
function soulGapAxisCards(): CeiPositioningRealityAxis[] {
  return SOUL_GAP_AXIS_ORDER.map((key) => {
    const read = SONDELA_SOUL_GAP_READS[key];
    return {
      key,
      label: SOUL_GAP_AXIS_META[key].name,
      description: SOUL_GAP_AXIS_META[key].description,
      positioning: soulGapLevelToPercent(read.positioningLevel),
      reality: soulGapLevelToPercent(read.realityLevel),
      color: SOULGAP_COLOR,
      evidence: read.realityEvidence,
    };
  });
}

const ACCENT = "var(--visual)";
type SwitcherKey = CeiKey | "soulgap";

// Real, working CSV export -- not simulated. Builds every evidence item
// (all six CEI dimensions plus the standalone Soul Gap panel) into an
// actual downloadable file via a Blob URL, entirely client-side. Matches
// the real app's own shipped capability (Export CSV); PDF export is now
// real too -- see downloadCampaignPdf below, added once the real app's
// own PDF export shipped (this button used to say "coming soon" on the
// strength of that no longer being true).
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

// Real-app parity (nav/cosmetic audit): the live app shipped real PDF
// export (generateReportPdf.ts) months ago -- this button used to say
// "genuinely still in progress on the real platform too", which is now
// stale, not an honest disclosure. Real, working, jsPDF-generated export,
// not simulated -- same "native, hand-drawn" approach the real report
// generator moved to (its own header comment: html2canvas raster capture
// was dropped in favor of drawing content directly), just scoped to this
// demo's own single-campaign dataset rather than the real generator's
// full multi-section report. jsPDF is a genuinely new dependency for this
// project (previously zero heavy deps beyond lucide/react-router) --
// deliberately NOT also adding html2canvas/react-simple-maps/world-atlas
// for the map itself; see MarketFootprint.tsx's own header comment for
// why that part gets a hand-built equivalent instead of a literal port.
// Real-app parity fix: this used to be a plain-Helvetica, no-grid, no-
// logo, no-footer PDF -- genuinely missed, not a considered
// simplification (same real gap as AgencyInsights.tsx's own portfolio
// export -- see that file's own downloadPortfolioPdf header comment for
// the full reasoning on why pdfChrome.ts is a genuine, fully portable
// port here, not an approximation). Same real dark grid background, real
// embedded fonts, real logo, real cover-page template every branded PDF
// the live product generates shares.
async function downloadCampaignPdf(cei: Record<CeiKey, number>, ceiOverall: number, cdi: number, soulGapMagnitude: string) {
  const { jsPDF, GState } = await import("jspdf");
  const { registerReportFonts, FONT_BODY, FONT_MONO } = await import("@/lib/reportGeneration/fonts/registerReportFonts");
  const { PdfChrome, drawCoverPage, drawFooter } = await import("@/lib/reportGeneration/pdfChrome");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  registerReportFonts(doc);
  const chrome = new PdfChrome(doc, GState, { margin: 48 });

  const todayIso = new Date().toISOString().slice(0, 10);
  const [year, month] = todayIso.split("-").map(Number);
  const quarter = Math.ceil((month || 1) / 3);
  const needsReview = cdiBand(cdi) === "red";

  drawCoverPage(chrome, {
    badgeText: needsReview ? "REVIEW FLAGGED" : "ALL CLEAR",
    badgeColor: needsReview ? "#FFC93C" : "#2DD4A6",
    reportId: `CEI-${SONDELA.id}-${todayIso}`,
    issuedOn: todayIso,
    eyebrow: `CAMPAIGN SUMMARY · Q${quarter} ${year}`,
    title: SONDELA.client,
    bodyText: `"${SONDELA.concept}" — CEI Overall ${ceiOverall.toFixed(1)}, CDI ${cdi.toFixed(1)}/10, Soul Gap ${soulGapMagnitude}. Collected via ${SONDELA.methodology} across ${SONDELA.cities.join(", ")}.`,
    preparedForLines: [SONDELA.client],
    preparedByLines: ["Ndoni Creative"],
    footerLeft: "CONFIDENTIAL · PREPARED SOLELY FOR THE NAMED RECIPIENT",
    footerRight: "NOT FOR REDISTRIBUTION",
  });

  chrome.newPage();
  chrome.sectionHeading("Scores at a Glance");
  doc.setFont(FONT_MONO, "normal");
  doc.setFontSize(10);
  [
    ["CEI Overall", ceiOverall.toFixed(1)],
    ["CDI", `${cdi.toFixed(1)}/10`],
    ["Soul Gap", soulGapMagnitude],
  ].forEach(([label, value]) => {
    chrome.mutedText(label, chrome.MARGIN, chrome.y);
    doc.setTextColor(246, 241, 233);
    doc.text(value, chrome.MARGIN + 160, chrome.y);
    chrome.y += 18;
  });
  chrome.y += 16;

  chrome.hairline(chrome.y);
  chrome.y += 30;

  chrome.sectionHeading("CEI Dimension Breakdown");
  CEI_ORDER.forEach((key) => {
    chrome.ensureSpace(20);
    doc.setFont(FONT_BODY, "normal");
    doc.setFontSize(11);
    doc.setTextColor(246, 241, 233);
    doc.text(CEI_LABEL[key], chrome.MARGIN, chrome.y);
    doc.setFont(FONT_MONO, "medium");
    chrome.rightAligned(cei[key].toFixed(1), chrome.PAGE_W - chrome.MARGIN, chrome.y);
    chrome.y += 18;
  });
  chrome.y += 16;

  chrome.ensureSpace(80);
  chrome.sectionHeading("Market Footprint");
  doc.setFont(FONT_BODY, "normal");
  doc.setFontSize(9);
  // Same "never omit a live market" principle as the on-screen
  // MarketFootprint component -- every one of ACP's real live countries
  // listed, not just the one this campaign happens to run in.
  const perRow = 3;
  const colW = chrome.CONTENT_W / perRow;
  COUNTRIES.forEach((country, i) => {
    const col = i % perRow;
    const row = Math.floor(i / perRow);
    chrome.mutedText(`• ${country}`, chrome.MARGIN + col * colW, chrome.y + row * 16);
  });
  chrome.y += Math.ceil(COUNTRIES.length / perRow) * 16 + 20;

  doc.setFont(FONT_MONO, "normal");
  doc.setFontSize(8);
  chrome.mutedText("Illustrative sample, not measured results · Pitch prototype · No login required", chrome.MARGIN, chrome.y);

  const pageCount = doc.getNumberOfPages();
  for (let i = 2; i <= pageCount; i++) drawFooter(chrome, i, pageCount);

  doc.save(`${SONDELA.client.toLowerCase().replace(/\s+/g, "-")}-summary.pdf`);
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
  const [selectedSoulGapAxis, setSelectedSoulGapAxis] = useState<SoulGapAxisKey | null>(null);

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
  const soulGapCompositeScore = soulGapComposite(SONDELA_SOUL_GAP_READS);
  const soulGapFlags = deriveSoulGapFlags(SONDELA_SOUL_GAP_READS);

  const ringData = CEI_ORDER.map((key) => ({
    key,
    name: CEI_LABEL[key].toUpperCase(),
    pct: cei[key] * 10,
    color: CEI_COLOR[key],
  }));
  const ceiOverall = CEI_ORDER.reduce((sum, k) => sum + cei[k], 0) / CEI_ORDER.length;
  const quadrant = quadrantRead(cdi, decay);
  // First real tag's label -- Sondela's own categories array can carry more
  // than one (the real app's own multi-tag cardinality), but this header
  // chip and the push-notification toast both only ever had room for one
  // named badge, same as before this sync.
  const sondelaCategoryLabel = SONDELA.categories?.[0] ? subCategoryLabel(SONDELA.categories[0]) : null;

  const goToEvidence = (dim: SwitcherKey) => {
    setActiveDimension(dim);
    setTab("evidence");
  };

  return (
    <DashboardShell role="agency">
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
              {sondelaCategoryLabel && (
                <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                  {sondelaCategoryLabel}
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
            <Button
              variant="ghost"
              color={ACCENT}
              className="!px-3 !py-1.5 !text-[11px]"
              onClick={() => downloadCampaignPdf(cei, ceiOverall, cdi, soulGap.magnitude)}
            >
              <Download className="me-1.5 h-3.5 w-3.5" /> Export PDF
            </Button>
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
              Sent to contributors with a matching {sondelaCategoryLabel} badge — real
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
          <div className="rounded border border-line p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="mb-1 font-display text-sm font-bold text-paper">Soul Gap</h3>
                <p className="text-xs text-muted">Distance between what's claimed and what's felt, across five anchored axes — a derived metric, not one of the six CEI dimensions.</p>
              </div>
              <div className="text-end">
                <div className="font-mono text-2xl font-bold text-paper">
                  {soulGapCompositeScore > 0 ? "+" : ""}{soulGapCompositeScore.toFixed(1)}
                </div>
                <div className="text-[10px] uppercase tracking-[0.1em] text-muted">Soul Gap composite (−4..+4)</div>
              </div>
            </div>

            {soulGapFlags.length > 0 && (
              <div className="mb-4 space-y-2">
                {soulGapFlags.map((flag, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded border px-4 py-3"
                    style={
                      flag.severity === "critical"
                        ? { borderColor: "rgba(255,90,41,0.45)", backgroundColor: "rgba(255,90,41,0.08)" }
                        : { borderColor: "rgba(255,201,60,0.4)", backgroundColor: "rgba(255,201,60,0.07)" }
                    }
                  >
                    <BellRing className="mt-0.5 h-4 w-4 shrink-0" style={{ color: flag.severity === "critical" ? "var(--pulse)" : "var(--language)" }} />
                    <div>
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: flag.severity === "critical" ? "var(--pulse)" : "var(--language)" }}>
                        {flag.severity} — Heritage Connection ({flag.source})
                      </span>
                      <p className="mt-1 text-xs leading-relaxed text-paper">{flag.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <PositioningRealityBars
              axes={soulGapAxisCards()}
              selectedKey={selectedSoulGapAxis}
              onSelect={(key) => setSelectedSoulGapAxis(key === selectedSoulGapAxis ? null : (key as SoulGapAxisKey | null))}
            />

            {selectedSoulGapAxis && (
              <div className="mt-3 rounded-md border border-dashed border-line bg-panel p-4">
                <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Positioning Evidence</div>
                <p className="text-sm italic leading-relaxed text-paper">
                  &ldquo;{SONDELA_SOUL_GAP_READS[selectedSoulGapAxis].positioningEvidence.verbatim}&rdquo;
                </p>
              </div>
            )}
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
