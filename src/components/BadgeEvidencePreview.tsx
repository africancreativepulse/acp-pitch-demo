import { subCategoryLabel } from "@/data/taxonomy";

/**
 * Real gap found in tonight's taxonomy sync: contributor_badges carries a
 * real social_handle/experience_note pair per badge on the live app (see
 * components/shared/BadgeEvidence.tsx there), staged in
 * OnboardingWizard.tsx alongside the badge itself -- nothing in this
 * demo's own rebuilt Expertise step represented that at all.
 *
 * Rendered as its own block below the ExpertBadge preview (same
 * separation the real app keeps -- BadgeEvidence is its own component,
 * never folded into CategoryPicker, since evidence is a badge-claim
 * concept CategoryPicker's other two modes have no use for).
 *
 * Deliberately topic-agnostic GREY PLACEHOLDER TEXT, not a filled-in
 * example: an actual example ("Run a stokvel group for 3 years") would
 * only make sense under some of the 29 fields and read as a visible
 * mismatch under the rest (e.g. a finance example under a Gaming badge).
 * Styled like an empty real form field waiting for input, not a static
 * answer -- the honest signal here is "this is what you'd type," not
 * "here's what someone typed." Static and non-interactive throughout,
 * same zero-typing rule as everywhere else in this demo -- no real input
 * is ever collected.
 */
export function BadgeEvidencePreview({ badgeIds }: { badgeIds: string[] }) {
  if (badgeIds.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Proof of Expertise <span className="normal-case tracking-normal text-muted/70">(optional)</span>
      </div>
      <div className="space-y-3">
        {badgeIds.map((id) => (
          <div key={id} className="rounded-lg border border-line p-4">
            <div className="mb-3 text-[13px] font-semibold text-paper">{subCategoryLabel(id)}</div>
            <div className="space-y-2">
              <PlaceholderField text="e.g. @your_handle" />
              <PlaceholderField text="Briefly describe your real-world experience in this area" />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted">
        Illustrative — a real submission includes your own handle and a short note here; this demo
        stays tap-only, no free text anywhere.
      </p>
    </div>
  );
}

function PlaceholderField({ text }: { text: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-9 w-full cursor-default items-center rounded border border-line bg-transparent px-3 text-[12.5px] text-muted/50"
    >
      {text}
    </div>
  );
}
