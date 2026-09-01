import { useEffect, useId, useMemo, useRef } from "react";

/**
 * Real-app parity: straight port of the real design-system/components/
 * WaveformRibbon.tsx -- the glowing woven waveform used as the section
 * divider directly under Hero on the real homepage (Hero -> WaveformRibbon
 * -> Features -> ...). This demo's own Splash.tsx header comment already
 * named this real section order but never actually built this piece --
 * a genuine miss, not a confirmed exclusion the way Testimonials/
 * Participate/LiveNetwork/Pricing/CTA were.
 *
 * Byte-for-byte the same rAF-driven per-frame path recompute (no React
 * re-render in the loop, phase animates over time rather than a
 * translateX marquee) -- only the token classnames changed, from the real
 * app's cei-line/cei-ink to this demo's own line/ink (same colors, this
 * demo's tailwind.config.ts already mirrors tokens.css exactly -- see
 * that file's own header comment).
 */
const VB_WIDTH = 1000;

const GRADIENT_STOPS: { offset: number; color: string }[] = [
  { offset: 0, color: "var(--visual)" },
  { offset: 38, color: "var(--language)" },
  { offset: 52, color: "var(--pulse)" },
  { offset: 70, color: "var(--ritual)" },
  { offset: 100, color: "var(--visual)" },
];

export type WaveformRibbonSize = "thin" | "tall";

interface SizeConfig {
  height: number;
  rowCount: number;
  strokeWidth: number;
  blur: number;
}

const SIZE_CONFIG: Record<WaveformRibbonSize, SizeConfig> = {
  thin: { height: 46, rowCount: 12, strokeWidth: 1, blur: 0.7 },
  tall: { height: 120, rowCount: 24, strokeWidth: 0.9, blur: 1.3 },
};

function seeded(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

interface RowParams {
  yCenter: number;
  amp1: number;
  amp2: number;
  freq1: number;
  freq2: number;
  phase0_1: number;
  phase0_2: number;
  speed: number;
  opacity: number;
}

const ENVELOPE_FREQ = (2 * Math.PI * 1.3) / VB_WIDTH;
const ENVELOPE_SPEED = 5;

function buildRowParams(config: SizeConfig): { rows: RowParams[]; envelopeAmp: number } {
  const { height, rowCount } = config;
  const marginY = height * 0.22;
  const usableHeight = height - marginY * 2;
  const rows = Array.from({ length: rowCount }, (_, r) => {
    const t = rowCount > 1 ? r / (rowCount - 1) : 0.5;
    const amp1 = usableHeight * 0.11 * (0.7 + 0.6 * seeded(r * 3.1));
    return {
      yCenter: marginY + usableHeight * t,
      amp1,
      amp2: amp1 * 0.4,
      freq1: ((2 + seeded(r * 7.7) * 2) * (2 * Math.PI)) / VB_WIDTH,
      freq2: ((2 + seeded(r * 7.7) * 2) * (2 * Math.PI)) / VB_WIDTH * (2.1 + seeded(r * 3.3) * 0.7),
      phase0_1: seeded(r * 5.3) * VB_WIDTH,
      phase0_2: seeded(r * 9.1) * VB_WIDTH,
      speed: 26 * (0.6 + 0.8 * seeded(r * 13.7)),
      opacity: 0.5 - t * 0.28,
    };
  });
  return { rows, envelopeAmp: usableHeight * 0.32 };
}

function buildRowPath(row: RowParams, phase: number, envelopeAmp: number): string {
  const p1 = row.phase0_1 + phase * row.speed;
  const p2 = row.phase0_2 + phase * row.speed * 1.3;
  const envelopePhase = phase * ENVELOPE_SPEED;
  let d = "";
  for (let x = 0; x <= VB_WIDTH; x += 10) {
    const envelope = Math.sin((x + envelopePhase) * ENVELOPE_FREQ) * envelopeAmp;
    const y = row.yCenter + envelope + Math.sin((x + p1) * row.freq1) * row.amp1 + Math.sin((x + p2) * row.freq2) * row.amp2;
    d += x === 0 ? `M 0 ${y.toFixed(1)}` : ` L ${x} ${y.toFixed(1)}`;
  }
  return d;
}

export function WaveformRibbon({
  size = "thin",
  className = "",
}: {
  size?: WaveformRibbonSize;
  className?: string;
}) {
  const config = SIZE_CONFIG[size];
  const baseId = useId();
  const glowRefs = useRef<(SVGPathElement | null)[]>([]);
  const coreRefs = useRef<(SVGPathElement | null)[]>([]);

  const { rows, envelopeAmp } = useMemo(() => buildRowParams(config), [size]);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let raf: number;
    const start = performance.now();

    const paint = (elapsedSeconds: number) => {
      rows.forEach((row, r) => {
        const d = buildRowPath(row, elapsedSeconds, envelopeAmp);
        glowRefs.current[r]?.setAttribute("d", d);
        coreRefs.current[r]?.setAttribute("d", d);
      });
    };

    const tick = (now: number) => {
      paint((now - start) / 1000);
      if (!reduceMotion) raf = requestAnimationFrame(tick);
    };

    paint(0);
    if (!reduceMotion) raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [rows, envelopeAmp]);

  const gradId = `${baseId}-grad`;
  const filterId = `${baseId}-blur`;

  return (
    <div
      className={`relative overflow-hidden border-y border-line bg-ink before:absolute before:inset-y-0 before:start-0 before:z-[2] before:w-16 before:bg-gradient-to-r rtl:before:bg-gradient-to-l before:from-ink before:to-transparent before:content-[''] after:absolute after:inset-y-0 after:end-0 after:z-[2] after:w-16 after:bg-gradient-to-l rtl:after:bg-gradient-to-r after:from-ink after:to-transparent after:content-[''] ${className}`}
      style={{ height: config.height }}
    >
      <svg
        viewBox={`0 0 ${VB_WIDTH} ${config.height}`}
        preserveAspectRatio="none"
        className="block h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={VB_WIDTH} y2="0">
            {GRADIENT_STOPS.map((s, i) => (
              <stop key={i} offset={`${s.offset}%`} stopColor={s.color} />
            ))}
          </linearGradient>
          <filter id={filterId} x="-20%" y="-150%" width="140%" height="400%">
            <feGaussianBlur stdDeviation={config.blur} />
          </filter>
        </defs>

        <g filter={`url(#${filterId})`}>
          {rows.map((row, r) => (
            <path
              key={r}
              ref={(el) => (glowRefs.current[r] = el)}
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth={config.strokeWidth * 4}
              opacity={row.opacity * 0.8}
              style={{ mixBlendMode: "screen" }}
            />
          ))}
        </g>

        <g>
          {rows.map((row, r) => (
            <path
              key={r}
              ref={(el) => (coreRefs.current[r] = el)}
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth={config.strokeWidth}
              opacity={row.opacity}
              style={{ mixBlendMode: "screen" }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
