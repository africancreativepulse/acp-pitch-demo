import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { SignalRing } from "@/components/SignalRing";
import { DepthGauge } from "@/components/DepthGauge";
import { GaugeArc } from "@/components/GaugeArc";
import { ScorePill } from "@/components/ScorePill";
import {
  SONDELA,
  CEI_ORDER,
  CEI_LABEL,
  CEI_COLOR,
  SOULGAP_COLOR,
  cdiBand,
  decayBand,
  quadrantRead,
} from "@/data/demo";

export function CulturalRead() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Only Sondela Cover has full depth in this prototype -- see
  // AgencyCommand's snapshot modal for why the other portfolio entries
  // don't route here. <Navigate> (a declarative redirect rendered as JSX)
  // is used here rather than calling navigate() directly in the render
  // body -- doing that fires React Router's own "call navigate() in a
  // useEffect" warning and, worse, doesn't reliably complete the redirect
  // at all: an invalid id used to leave this screen blank with no way
  // forward, a real dead end this exact fix closes.
  if (id !== SONDELA.id || !SONDELA.cei || SONDELA.cdi == null || SONDELA.decay == null || !SONDELA.soulGap) {
    return <Navigate to="/agency" replace />;
  }

  // Real SignalRing's own shape: {name, pct(0-100), color}, not this
  // screen's previous {label, score(0-10)} -- name is upper-cased to match
  // the real component's DEFAULT_SIGNAL_DIMENSIONS convention.
  const ringData = CEI_ORDER.map((key) => ({
    key,
    name: CEI_LABEL[key].toUpperCase(),
    pct: SONDELA.cei![key] * 10,
    color: CEI_COLOR[key],
  }));

  const quadrant = quadrantRead(SONDELA.cdi, SONDELA.decay);

  return (
    <div className="min-h-screen bg-ink">
      <TopBar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <button onClick={() => navigate("/agency")} className="mb-6 text-[13px] text-muted hover:text-paper">
          ← Agency Command
        </button>

        <div className="mb-10">
          <div className="label-caps mb-1.5">The Cultural Read</div>
          <h1 className="font-display text-3xl font-bold text-paper">{SONDELA.client}</h1>
          <p className="mt-1 text-[14px] text-muted">
            &ldquo;{SONDELA.concept}&rdquo; · {SONDELA.cities.join(" · ")}
          </p>
          <p className="mt-3 text-[12.5px] text-muted">
            Collected via <span className="text-paper">{SONDELA.methodology}</span> ·{" "}
            <Link to="/operations" className="font-semibold text-visual hover:underline">
              see how →
            </Link>
          </p>
        </div>

        {/* CDI gets the real DepthGauge -- its own full-width card, not
            squeezed into the 360px sidebar. Its on-arc band labels
            (Review Needed / Moderately Authentic / Highly Authentic) need
            real horizontal room; the real app gives it a whole dedicated
            section (CDISection.tsx) for the same reason. */}
        <div className="card-surface mb-8 p-6 sm:p-8">
          <div className="label-caps mb-1">Cultural Depth Index</div>
          <DepthGauge score={SONDELA.cdi} animated={false} className="mx-auto max-w-xl" />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div className="card-surface flex flex-col items-center p-8">
            <SignalRing
              dimensions={ringData}
              animated={false}
              onSelect={(key) => navigate(`/agency/campaign/${SONDELA.id}/evidence/${key}`)}
            />
            <p className="mt-4 text-center text-[12px] text-muted">Tap any dimension to see the evidence behind it →</p>
          </div>

          <div className="space-y-6">
            {/* Decay Risk has no real-app gauge to port -- see GaugeArc.tsx's
                own header comment for why DepthGauge can't safely stand in
                for it. Kept as its own compact card now that CDI has moved
                to the full-width DepthGauge above. */}
            <div className="card-surface flex items-center justify-center p-6">
              <GaugeArc value={SONDELA.decay} band={decayBand(SONDELA.decay)} label="Decay Risk" />
            </div>

            <div className="card-surface p-6">
              <div className="label-caps mb-3">2×2 Read</div>
              <div className="mb-3 flex flex-wrap gap-2">
                <ScorePill label="CDI" value={SONDELA.cdi.toFixed(1)} band={cdiBand(SONDELA.cdi)} />
                <ScorePill label="Decay" value={SONDELA.decay.toFixed(1)} band={decayBand(SONDELA.decay)} />
              </div>
              <h3 className="font-display text-lg font-bold text-paper">{quadrant.label}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{quadrant.description}</p>
            </div>
          </div>
        </div>

        {/* Standalone Soul Gap panel -- deliberately NOT a ring node */}
        <div
          className="card-surface mt-8 p-7"
          style={{ borderColor: `${SOULGAP_COLOR}40` }}
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="label-caps !text-soulgap">Soul Gap</span>
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
              style={{ backgroundColor: `${SOULGAP_COLOR}22`, color: SOULGAP_COLOR }}
            >
              {SONDELA.soulGap.magnitude}
            </span>
          </div>
          <p className="max-w-3xl font-display text-xl font-semibold leading-snug text-paper">
            {SONDELA.soulGap.headline}
          </p>
          <Link
            to={`/agency/campaign/${SONDELA.id}/evidence/soulgap`}
            className="mt-4 inline-block text-[13px] font-semibold hover:underline"
            style={{ color: SOULGAP_COLOR }}
          >
            See where this comes from →
          </Link>
        </div>
      </main>
    </div>
  );
}
