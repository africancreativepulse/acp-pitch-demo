import { subCategoryLabel } from "@/data/taxonomy";

/**
 * Real gap found in tonight's taxonomy sync (commit f7aa1db): contributor_badges
 * carries a real social_handle/experience_note pair per badge on the live
 * app, staged in OnboardingWizard.tsx alongside the badge itself -- nothing
 * in this demo's own rebuilt Expertise step represented that at all.
 *
 * Real correction (mandatory_badge_proof_of_expertise, live app): proof of
 * expertise stopped being optional and its one generic handle field was
 * replaced by five named platforms (Instagram/Facebook/TikTok/X/Other) plus
 * a required written note. Brought into line here -- same five fields, same
 * exact placeholder wording as the real BadgeEvidence.tsx (topic-agnostic,
 * so no mismatch risk the way a filled-in example would have -- "Instagram"
 * doesn't reference any expertise domain).
 *
 * Required signal is deliberately NEUTRAL, not the real app's red-border/
 * "PROOF REQUIRED" treatment: that styling only appears there after a
 * contributor tries to Continue with incomplete evidence -- a real
 * validation-failure event this demo has no equivalent of (no typing, no
 * Continue-blocking, nothing ever actually gets validated). Permanently
 * showing every illustrative card as "failing" would misrepresent what a
 * real user actually sees by default (most people filling this in
 * correctly never see red at all) and would read as a stuck error, not an
 * accurate depiction. A quiet "Required" tag + the real app's own
 * steady-state field labels (asterisk, "at least one required") communicate
 * the real rule honestly without implying a validation failure that isn't
 * happening.
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

const HANDLE_FIELDS = [
  { label: "Instagram", placeholder: "@yourhandle" },
  { label: "Facebook", placeholder: "facebook.com/yourpage" },
  { label: "TikTok", placeholder: "@yourhandle" },
  { label: "X (Twitter)", placeholder: "@yourhandle" },
  { label: "Other", placeholder: "Any other platform" },
] as const;

export function BadgeEvidencePreview({ badgeIds }: { badgeIds: string[] }) {
  if (badgeIds.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Proof of Expertise</span>
        <span className="rounded-full bg-line/60 px-1.5 py-0.5 font-mono text-[8.5px] font-medium uppercase tracking-[0.06em] text-muted">
          Required
        </span>
      </div>
      <div className="space-y-3">
        {badgeIds.map((id) => (
          <div key={id} className="rounded-lg border border-line p-4">
            <div className="mb-3 text-[13px] font-semibold text-paper">{subCategoryLabel(id)}</div>
            <div className="space-y-3">
              <div>
                <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  Social Handles <span className="normal-case tracking-normal text-muted/70">(at least one required)</span>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {HANDLE_FIELDS.map((f) => (
                    <PlaceholderField key={f.label} text={`${f.label} -- ${f.placeholder}`} />
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  Relevant Experience <span className="text-pulse">*</span>
                </div>
                <PlaceholderField text="A short note on why this is a real area of expertise for you" tall />
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted">
        Illustrative — in the real app, this is required for every badge you pick: a written note plus at least one
        handle. This demo stays tap-only, no free text anywhere.
      </p>
    </div>
  );
}

function PlaceholderField({ text, tall = false }: { text: string; tall?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`flex w-full cursor-default items-center rounded border border-line bg-transparent px-3 text-[12.5px] text-muted/50 ${
        tall ? "min-h-[70px] items-start py-2.5" : "h-9"
      }`}
    >
      {text}
    </div>
  );
}
