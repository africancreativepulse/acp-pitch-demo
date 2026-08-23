/**
 * Ported verbatim from the real app's design-system/components/DotGrid.tsx
 * -- the hairline panning grid behind Index.tsx's real Hero (and every
 * other marketing section). This demo's Splash previously used DataNodes
 * (a node-network texture) instead, copied from the wrong reference page
 * (BrandsSplash.tsx/for-agencies, not the neutral homepage) -- see item 1
 * of the header/reference-correction pass. DotGrid is the real one.
 */
export function DotGrid({
  intensity = 0.05,
  animated = true,
  className = "",
}: {
  intensity?: number;
  animated?: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}>
      <div
        className={`absolute -inset-[20%] ${animated ? "animate-ds-pan-grid" : ""}`}
        style={{
          backgroundImage:
            `linear-gradient(rgba(246,241,233,${intensity}) 1px, transparent 1px), linear-gradient(90deg, rgba(246,241,233,${intensity}) 1px, transparent 1px)`,
          backgroundSize: "46px 46px",
        }}
      />
    </div>
  );
}
