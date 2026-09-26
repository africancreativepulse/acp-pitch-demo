import { COUNTRIES, COMING_SOON_COUNTRIES } from "@/data/demo";

/**
 * Demo-appropriate equivalent of the real app's charts/MarketPulseMap.tsx
 * -- confirmed missing entirely during a full nav/cosmetic audit (the real
 * component is now embedded on both CampaignDetail's Summary PDF and
 * Insights' Portfolio PDF). NOT a straight port, per the standing rule
 * that real-data-dependent features (map data, live scores, etc.) get a
 * demo-appropriate equivalent rather than a literal copy -- two real
 * reasons behind that here specifically:
 *
 * 1. The real component is a genuine geographic choropleth (react-simple-
 *    maps + world-atlas, a ~200KB+ topojson country-border dataset) driven
 *    by real aggregate `profiles.country`/`field_zones.country` counts.
 *    This demo has zero heavy dependencies by design (check package.json
 *    -- lucide-react/react/react-dom/react-router-dom, nothing else,
 *    every chart elsewhere here is hand-built with plain divs/SVG, not a
 *    charting library). Adding a map-rendering library + a real-world
 *    geometry dataset just for one illustrative panel would be a real,
 *    disproportionate architecture change for a pitch prototype.
 * 2. There's no real aggregate country data behind it anyway -- this
 *    demo's own campaigns (Sondela Cover, Kasi Brew, Tholulwazi Data) are
 *    all South Africa-based, so a literal per-country reach count would
 *    be mostly invented.
 *
 * What's kept genuinely real: COUNTRIES itself (the same 14-country list
 * synced against the real `countries` table's actual is_active state --
 * see that constant's own header comment) and the real component's own
 * core design principle, "never omit a market, even at zero" -- every one
 * of ACP's real live countries renders here, not just the one with actual
 * campaign activity. Rendered as a compact intensity-bar grid instead of
 * an SVG map -- same visual hierarchy (baseline footprint tint for a live
 * market with no activity yet vs. a stronger fill for real activity),
 * same Pulse-orange accent the real component uses (its own header
 * comment: ties the report's dominant accent together rather than adding
 * a third color), just no map geometry needed to show it.
 */
export function MarketFootprint({ activityByCountry }: { activityByCountry: Record<string, number> }) {
  const max = Math.max(1, ...Object.values(activityByCountry));

  return (
    <div className="rounded-lg border border-line bg-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Market Footprint</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
          {COUNTRIES.length} live markets
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3">
        {COUNTRIES.map((country) => {
          const count = activityByCountry[country] ?? 0;
          // 0.16 floor, not 0 -- same "never imply a smaller footprint
          // than real" reasoning as the real MarketPulseMap.tsx's own
          // 0.18-not-0.08 fix: every live market gets a visible baseline
          // tint even at zero illustrative activity.
          const intensity = count > 0 ? 0.3 + 0.7 * (count / max) : 0.16;
          return (
            <div key={country} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: `rgba(255,90,41,${intensity.toFixed(2)})` }} />
              <span className="truncate text-[12px] text-paper" title={count > 0 ? `${country}: ${count}` : `${country} (no activity yet)`}>
                {country}
              </span>
            </div>
          );
        })}
      </div>
      {COMING_SOON_COUNTRIES.length > 0 && (
        <div className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-[11px] text-muted">
          <span className="uppercase tracking-[0.1em]">Coming soon:</span>
          {COMING_SOON_COUNTRIES.join(", ")}
        </div>
      )}
      <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
        Illustrative distribution, not measured results
      </div>
    </div>
  );
}
