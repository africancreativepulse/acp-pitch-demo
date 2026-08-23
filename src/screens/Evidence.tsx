import { useParams, useNavigate, Navigate } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { VerifiedBadge } from "@/components/Badge";
import { WaveformStatic } from "@/components/WaveformStatic";
import { cn } from "@/lib/cn";
import {
  SONDELA,
  CEI_ORDER,
  CEI_LABEL,
  CEI_COLOR,
  SOULGAP_COLOR,
  type CeiKey,
  type EvidenceItem,
} from "@/data/demo";

type SwitcherKey = CeiKey | "soulgap";

export function Evidence() {
  const { id, dimension } = useParams<{ id: string; dimension: string }>();
  const navigate = useNavigate();

  // Same fix as CulturalRead.tsx's identical guard -- <Navigate> (JSX),
  // not an imperative navigate() call during render. See that file's
  // comment for why: the imperative form is a genuine dead end here, not
  // just a lint warning.
  if (id !== SONDELA.id) {
    return <Navigate to="/agency" replace />;
  }

  const current: SwitcherKey =
    dimension === "soulgap" || (CEI_ORDER as string[]).includes(dimension ?? "")
      ? (dimension as SwitcherKey)
      : "ritual";

  const isSoulGap = current === "soulgap";
  const color = isSoulGap ? SOULGAP_COLOR : CEI_COLOR[current as CeiKey];
  const label = isSoulGap ? "Soul Gap" : CEI_LABEL[current as CeiKey];
  const score = isSoulGap ? null : SONDELA.cei?.[current as CeiKey];
  const items: EvidenceItem[] = isSoulGap ? SONDELA.soulGap?.evidence ?? [] : SONDELA.evidence[current as CeiKey];

  const switchTo = (key: SwitcherKey) => navigate(`/agency/campaign/${SONDELA.id}/evidence/${key}`);

  return (
    <div className="min-h-screen bg-ink">
      <TopBar />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <button
          onClick={() => navigate(`/agency/campaign/${SONDELA.id}`)}
          className="mb-6 text-[13px] text-muted hover:text-paper"
        >
          ← Back to The Cultural Read
        </button>

        <div className="mb-2 label-caps">The Evidence</div>
        <div className="mb-7 flex items-baseline gap-3">
          <h1 className="font-display text-3xl font-bold text-paper" style={{ color }}>
            {label}
          </h1>
          {score != null && <span className="tabular font-mono text-xl font-semibold text-muted">{score.toFixed(1)}</span>}
        </div>

        {/* dimension switcher */}
        <div className="no-scrollbar mb-9 flex gap-2 overflow-x-auto pb-1">
          {CEI_ORDER.map((key) => (
            <SwitchChip key={key} active={current === key} color={CEI_COLOR[key]} label={CEI_LABEL[key]} onClick={() => switchTo(key)} />
          ))}
          <SwitchChip active={current === "soulgap"} color={SOULGAP_COLOR} label="Soul Gap" onClick={() => switchTo("soulgap")} />
        </div>

        <div className="space-y-4">
          {items.map((item, i) => (
            <EvidenceCard key={i} item={item} color={color} />
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3 border-t border-line pt-6">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
          <p className="font-display text-[15px] font-medium text-paper">
            Every score traces to what someone actually said.
          </p>
        </div>
      </main>
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
    <div className="card-surface p-6">
      {item.kind === "quote" && (
        <div>
          <p className="font-display text-[19px] font-medium leading-snug text-paper">&ldquo;{item.quote}&rdquo;</p>
          {item.gloss && <p className="mt-2 text-[14px] italic leading-relaxed text-muted">{item.gloss}</p>}
        </div>
      )}

      {item.kind === "photo" && (
        <div className="flex items-start gap-4">
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-line bg-white/[0.03]"
            aria-hidden="true"
          >
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
        {/* Quote evidence can arrive without a capture date (the real Soul
            Gap quote did) -- shown as an honest "pending" label rather than
            fabricating a plausible-looking one. Photo/audio dates are still
            required on their types, so this only ever applies to quotes. */}
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
