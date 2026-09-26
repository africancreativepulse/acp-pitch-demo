import { useState } from "react";
import { Languages, AlertTriangle, CheckCircle2, Sparkles, Eye } from "lucide-react";
import { DashboardShell, ROLE_ACCENT } from "@/components/DashboardShell";
import { QA_LANGUAGES, QA_TOTAL_KEYS, QA_COVERAGE_PCT } from "@/data/demo";

const ACCENT = ROLE_ACCENT.admin;

/**
 * Real-app parity (nav/cosmetic audit, deferred bucket item 6, last in
 * sequence per its own lowest-visibility ranking): port of the real
 * pages/admin/TranslationQA.tsx's coverage-matrix grid -- confirmed the
 * largest structural gap in the whole audit (this screen used to be a
 * flat 6-language progress-bar list). What's real here: all 16 of the
 * real platform's own languages (QA_LANGUAGES, real names/flags/codes,
 * not this demo's own narrower 6-language ONBOARDING_LANGUAGES subset),
 * the same red/yellow/green coverage-threshold read, and the same
 * missing-count badge.
 *
 * What's NOT ported, and why: the real page's "Auto-fill via AI" calls a
 * live Supabase edge function (translate) against real i18n key/value
 * pairs; "Live Preview" force-renders real landing sections (Hero/
 * Features/CEI/Participate/Methodology/BookDemo) in the selected
 * language. Neither has anything real to operate on here -- this demo
 * has no i18n system anywhere by design (English-only throughout, see
 * Navbar.tsx's own header comment), no real per-key translation table,
 * and several of those exact landing components (Participate/
 * Methodology/BookDemo) were never ported as this demo's own content
 * scope excluded them (see Splash.tsx's own header comment). Building a
 * full parallel i18n system just to power one admin screen's preview
 * would be a real, disproportionate architecture change, not a cosmetic
 * port -- both are represented below as honest, clearly-labeled
 * placeholders instead of either faked or silently dropped.
 */
export function TranslationQA() {
  const [selectedLang, setSelectedLang] = useState("sw");
  const selected = QA_LANGUAGES.find((l) => l.code === selectedLang)!;
  const selectedPct = QA_COVERAGE_PCT[selectedLang] ?? 90;
  const selectedTranslated = Math.round((selectedPct / 100) * QA_TOTAL_KEYS);
  const selectedMissing = QA_TOTAL_KEYS - selectedTranslated;

  return (
    <DashboardShell role="admin">
      <div className="max-w-7xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-6 flex items-center gap-3">
          <Languages className="h-5 w-5" style={{ color: ACCENT }} />
          <span className="font-mono text-xs font-medium uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
            Internal · Translation QA
          </span>
        </div>
        <h1 className="mb-2 font-display text-3xl font-bold text-paper">Translation QA</h1>
        <p className="mb-10 max-w-2xl text-muted">
          Audit translation coverage across {QA_LANGUAGES.length} languages. Illustrative coverage —
          this demo is English-only (a real, working language picker with no translated copy behind
          it); the real platform supports these languages for real.
        </p>

        <div className="mb-10 grid grid-cols-2 gap-px overflow-hidden rounded border border-line bg-line md:grid-cols-4 lg:grid-cols-6">
          {QA_LANGUAGES.map((l) => {
            const pct = QA_COVERAGE_PCT[l.code] ?? 90;
            const missing = QA_TOTAL_KEYS - Math.round((pct / 100) * QA_TOTAL_KEYS);
            const isSel = l.code === selectedLang;
            const tone = pct === 100 ? "text-sound" : pct >= 90 ? "text-language" : "text-pulse";
            return (
              <button
                key={l.code}
                onClick={() => setSelectedLang(l.code)}
                className="bg-ink p-4 text-start transition-colors hover:bg-panel"
                style={isSel ? { boxShadow: `inset 0 0 0 1px ${ACCENT}` } : undefined}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-lg">{l.flag}</span>
                  <span className="text-xs font-medium text-paper">{l.name}</span>
                </div>
                <div className={`mb-1 text-2xl font-bold ${tone}`}>{pct}%</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                  {QA_TOTAL_KEYS - missing}/{QA_TOTAL_KEYS} keys
                </div>
                {missing > 0 ? (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-pulse">
                    <AlertTriangle className="h-3 w-3" /> {missing} missing
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-sound">
                    <CheckCircle2 className="h-3 w-3" /> Complete
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mb-10 rounded border border-line p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-medium text-paper">
                {selected.flag} {selected.name} <span className="ms-2 font-normal text-muted">({selected.code})</span>
              </div>
              <div className="mt-1 text-xs text-muted">
                {selectedTranslated} translated · {selectedMissing} missing of {QA_TOTAL_KEYS} keys
              </div>
            </div>
            <div
              className="flex items-center gap-2 rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] opacity-50"
              style={{ borderColor: ACCENT, color: ACCENT }}
              title="No real per-key translation table or AI edge function exists in this demo — see this file's own header comment."
            >
              <Sparkles className="h-3 w-3" /> Auto-fill via AI
            </div>
          </div>
        </div>

        <div className="rounded border border-dashed border-line p-8 text-center">
          <Eye className="mx-auto mb-3 h-6 w-6 text-muted" />
          <h2 className="mb-1 font-display text-base font-bold text-paper">Live Preview</h2>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-muted">
            The real page force-renders live landing sections in whichever language is selected
            above. This demo has no i18n system to translate content with — every screen here is
            English-only by design, so there's no real per-language render to preview.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
