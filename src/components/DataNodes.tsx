/**
 * "Data Nodes" ambient background -- copied verbatim from the real app's
 * DataNodes.tsx (isolated points connecting with thin lines). Background
 * texture only, never the primary visual -- zero data encoding, all
 * layout constants generated once from a seeded PRNG. Used here as the
 * ambient second layer behind Splash's hero, matching the real app's own
 * "second ambient layer alongside the hero visual" convention (there:
 * /for-agencies and /for-contributors' heroes; here: the one screen that
 * plays the same marketing/hero role).
 */
function mulberry32(seed: number) {
  return function rand() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const VIEW_W = 960;
const VIEW_H = 540;
const NODE_COUNT = 42;
const LINK_DISTANCE = 118;

interface Point {
  id: number;
  x: number;
  y: number;
  r: number;
  o: number;
}

const rand = mulberry32(1337);
const POINTS: Point[] = Array.from({ length: NODE_COUNT }, (_, id) => ({
  id,
  x: rand() * VIEW_W,
  y: rand() * VIEW_H,
  r: 1 + rand() * 1.1,
  o: 0.35 + rand() * 0.35,
}));

interface Link {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  o: number;
}

const LINKS: Link[] = (() => {
  const links: Link[] = [];
  for (let i = 0; i < POINTS.length; i++) {
    for (let j = i + 1; j < POINTS.length; j++) {
      const a = POINTS[i];
      const b = POINTS[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < LINK_DISTANCE) {
        links.push({ key: `${a.id}-${b.id}`, x1: a.x, y1: a.y, x2: b.x, y2: b.y, o: 0.22 * (1 - d / LINK_DISTANCE) + 0.06 });
      }
    }
  }
  return links;
})();

export function DataNodes({
  color = "var(--visual)",
  opacity = 45,
  className = "",
}: {
  color?: string;
  /** 0-100, applied via inline style (a template-literal Tailwind class
      wouldn't survive static source scanning for a runtime value). */
  opacity?: number;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}>
      <div className="absolute -inset-[6%] animate-ds-drift-1" style={{ opacity: opacity / 100 }}>
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          {LINKS.map((l) => (
            <line key={l.key} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth={0.6} strokeOpacity={l.o} />
          ))}
          {POINTS.map((p) => (
            <circle key={p.id} cx={p.x} cy={p.y} r={p.r} fill={color} fillOpacity={p.o} />
          ))}
        </svg>
      </div>
    </div>
  );
}
