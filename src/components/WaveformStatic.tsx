// A fixed, seeded "waveform" -- purely decorative, never animated (this
// represents a recorded/submitted audio artifact, not a live signal), so
// a deterministic bar pattern is honest here, not a shortcut.
const BAR_HEIGHTS = [
  6, 14, 9, 22, 30, 18, 26, 36, 24, 40, 30, 20, 34, 44, 28, 18, 32, 24, 14, 20, 30, 16, 10, 22, 14, 8,
];

export function WaveformStatic({ color = "#FF5C93", height = 40 }: { color?: string; height?: number }) {
  return (
    <div className="flex items-center gap-[3px]" style={{ height }}>
      {BAR_HEIGHTS.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full"
          style={{ height: `${(h / 44) * height}px`, backgroundColor: color, opacity: 0.55 + (h / 44) * 0.45 }}
        />
      ))}
    </div>
  );
}
