import { Languages } from "lucide-react";
import { DashboardShell, ROLE_ACCENT } from "@/components/DashboardShell";
import { ONBOARDING_LANGUAGES } from "@/data/demo";

const ACCENT = ROLE_ACCENT.admin;

// Illustrative coverage per language -- this demo is deliberately
// English-only (see Onboarding.tsx's own header comment: a real, working
// language picker, but no actual translated copy behind it). The real
// platform supports these languages for real; showing a believable
// coverage read for each is honest about what the real feature does
// without claiming this demo itself has translated content it doesn't.
const COVERAGE: Record<string, number> = {
  English: 100,
  isiZulu: 94,
  Yoruba: 91,
  Swahili: 96,
  Hausa: 88,
  Afrikaans: 97,
};

/**
 * Ported structural pattern from the real app's own pages/admin/
 * TranslationQA.tsx -- a per-language coverage grid. Real language list
 * (ONBOARDING_LANGUAGES, already used by Onboarding.tsx's own picker);
 * coverage percentages are illustrative and labeled as such, since this
 * demo has no actual translated copy to measure real coverage against.
 */
export function TranslationQA() {
  return (
    <DashboardShell role="admin">
      <div className="max-w-2xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex items-center gap-2.5">
          <Languages className="h-5 w-5" style={{ color: ACCENT }} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
            Admin — Translation QA
          </span>
        </div>
        <h1 className="mb-2 font-display text-[22px] font-bold text-paper">Translation Coverage</h1>
        <p className="mb-8 max-w-lg text-[13px] leading-relaxed text-muted">
          Illustrative coverage — this demo is English-only (a real, working language picker with no translated
          copy behind it). The real platform supports these languages for real.
        </p>

        <div className="space-y-3">
          {ONBOARDING_LANGUAGES.map((lang) => {
            const pct = COVERAGE[lang] ?? 90;
            return (
              <div key={lang} className="rounded border border-line p-4">
                <div className="mb-2 flex items-center justify-between text-[13px]">
                  <span className="font-medium text-paper">{lang}</span>
                  <span className="font-mono text-muted">{pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: ACCENT }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
