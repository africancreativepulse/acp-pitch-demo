import { FileText } from "lucide-react";
import { subCategoryLabel } from "@/data/taxonomy";

/**
 * Real gap found in tonight's taxonomy sync (commit f7aa1db): contributor_badges
 * carries real proof-of-expertise fields per badge on the live app, staged
 * in OnboardingWizard.tsx alongside the badge itself -- nothing in this
 * demo's own rebuilt Expertise step represented that at all.
 *
 * Real correction (badge_case_study_evidence, live app): the old "any one
 * handle + a written note" model is gone entirely, replaced by genuine,
 * checkable proof of a real client relationship -- Client Website, Client
 * Instagram, a case study file, and a required caption describing what it
 * shows. All four mandatory for every selected badge, no exceptions, no
 * alternate path -- brought into line here with the same field order and
 * same per-field red-asterisk markers the real BadgeEvidence.tsx now uses
 * (no more "(at least one required)" OR-framing -- that only ever applied
 * to the old handle-choice model this one replaces).
 *
 * Case Study is deliberately a STATIC indicator, not a tappable upload
 * control, unlike e.g. agency's own document-upload step earlier in this
 * same file (which genuinely toggles on tap). This whole component has
 * never held real state -- contributor badge evidence was never wired
 * into DemoState even for the live Guest Contributor's own picked badges
 * (see ContributorVerification.tsx's own liveRow, which always falls back
 * to "no evidence submitted" for exactly this reason) -- so a real tap-to-
 * attach interaction here would be new scope this component was
 * deliberately built to avoid, not a genuine gap. A quiet static "case
 * study attached" indicator is the honest representation given that.
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
 * steady-state field labels (asterisks) communicate the real rule
 * honestly without implying a validation failure that isn't happening.
 *
 * Rendered as its own block below the ExpertBadge preview (same
 * separation the real app keeps -- BadgeEvidence is its own component,
 * never folded into CategoryPicker, since evidence is a badge-claim
 * concept CategoryPicker's other two modes have no use for).
 *
 * Deliberately topic-agnostic GREY PLACEHOLDER TEXT, not a filled-in
 * example: an actual example ("clientbrand.com") tied to one real domain
 * would only make sense under some of the 29 fields and read as a visible
 * mismatch under the rest. Styled like an empty real form field waiting
 * for input, not a static answer -- the honest signal here is "this is
 * what you'd fill in," not "here's what someone filled in." Static and
 * non-interactive throughout, same zero-typing rule as everywhere else in
 * this demo -- no real input is ever collected.
 */

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
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    Client Website <span className="text-pulse">*</span>
                  </div>
                  <PlaceholderField text="e.g. clientbrand.com" />
                </div>
                <div>
                  <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    Client Instagram <span className="text-pulse">*</span>
                  </div>
                  <PlaceholderField text="@clientbrand" />
                </div>
              </div>
              <div>
                <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  Case Study <span className="text-pulse">*</span>
                </div>
                <div
                  aria-hidden="true"
                  className="flex h-9 w-full cursor-default items-center gap-2 rounded border border-line bg-transparent px-3 text-[12.5px] text-muted/50"
                >
                  <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                  Illustrative case study attached
                </div>
              </div>
              <div>
                <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  Caption <span className="text-pulse">*</span>
                </div>
                <PlaceholderField text="What does this case study show? — results, deliverables, client feedback" tall />
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted">
        Illustrative — in the real app, this is required for every badge you pick: a client website, client
        Instagram, case study, and caption, all four. This demo stays tap-only, no free text or real uploads
        anywhere.
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
