import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { BuilderTask } from "@/data/demo";
import { REVIEW_QUEUE, type ReviewStatus } from "@/data/demo";

// A campaign someone creates live in the Campaign Builder. Deliberately
// scores-less: it just launched, so there's honestly nothing to show yet
// -- "no inflated stats" applies here as much as it does to Sondela's own
// real numbers. AgencyCommand renders these with an animated "Collecting"
// pulse dot and an honest "Awaiting first responses" state rather than
// fabricated placeholder scores.
export interface DraftCampaign {
  id: string;
  client: string;
  objective: string;
  cities: string[];
  ageBand: string;
  methodology: string;
  sampleSize: number;
  tasks: BuilderTask[];
  createdAt: number;
  /** Real sub_category ids (taxonomy.ts) -- see Campaign.categories'
      own comment in data/demo.ts for the real multi-tag cardinality
      this mirrors. */
  categories: string[];
  /** Set when launched via Campaign Builder's admin view (?admin=1) --
      no agency owner, matching the real app's own agency_id-nullable
      admin-direct campaigns. */
  adminDirect?: boolean;
}

export type BadgeStatus = "pending" | "approved" | "rejected";

// One row per real contributor_badges row -- a sub-category id plus its
// own review status, matching the real app's own contributor_badge_evidence
// migration (a badge is pending by default, invisible to campaign-matching
// until an admin approves it in Badge Verification).
export interface ContributorBadgeEntry {
  subCategoryId: string;
  status: BadgeStatus;
}

// Unified contributor verification (concept sync with tonight's real-app
// change): a contributor's signup is now ONE reviewed submission --
// identity plus whatever badges they picked -- not badges reviewed on
// their own. This is the account-level gate ContributorGate.tsx checks;
// contributorBadges above still tracks each badge's own status too (the
// real app keeps that granularity for campaign-matching), but the two are
// now driven together by decideContributorVerification/
// resubmitContributorVerification below, never independently.
export type ContributorVerificationStatus = "pending" | "approved" | "rejected";

// Real gap closed: this used to be scoped down to just Country/City/
// Language (this demo's own zero-typing Onboarding didn't yet collect the
// rest). Now field-for-field matches what the real app's own unified
// contributor_identity actually holds -- Name/Surname/Address/Postal Code/
// Phone Number/general social handles -- collected the same tap-only way
// as everything else here (see Onboarding.tsx's own FIRST_NAME_OPTIONS
// etc.): a real tap among a small set of illustrative pre-written values,
// never a free-text input. `handles` holds the platform LABELS toggled on
// (e.g. ["Instagram", "X (Twitter)"]), not typed handle strings -- there's
// no real string to type, so the tap itself ("I have an Instagram") is
// the honest unit of data this demo can actually collect.
export interface ContributorIdentity {
  firstName: string;
  surname: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  phoneNumber: string;
  handles: string[];
  language: string;
}

interface DemoState {
  draftCampaigns: DraftCampaign[];
  addCampaign: (c: Omit<DraftCampaign, "id" | "createdAt">) => void;
  // Shared between SupervisorReview (writes) and AdminOversight (reads) --
  // a real connected pipeline, not two screens narrating the same idea
  // independently. Keyed by ReviewQueueItem.id, all start "pending".
  reviewStatus: Record<string, ReviewStatus>;
  setReviewStatus: (id: string, status: ReviewStatus) => void;
  // Set during Onboarding's Expertise step (contributor persona only) --
  // read back by Browse/Contributor Capture to show the real "this task
  // matched your badge" payoff, and by Admin's Contributor Verification
  // queue. Defaults to one already-APPROVED badge (matching Sondela
  // Cover's own real tag) so the match is visible even if a presenter
  // skips Onboarding entirely -- any badge picked live at Onboarding
  // starts "pending" instead, same as a real fresh signup, and won't
  // match anything (or unlock the contributor's own dashboard -- see
  // contributorVerificationStatus below) until an admin approves it.
  contributorBadges: ContributorBadgeEntry[];
  setContributorBadges: (badges: ContributorBadgeEntry[]) => void;
  setBadgeStatus: (subCategoryId: string, status: BadgeStatus) => void;
  // The full identity bundle actually picked at Onboarding -- previously
  // only Country/City/Language, and even those were local-only state that
  // vanished on navigation. Now persisted in full so the Guest
  // Contributor's own card in ContributorVerification's queue is
  // genuinely live-wired, same as their badges already are. Null until
  // Onboarding's contributor flow actually runs once.
  contributorIdentity: ContributorIdentity | null;
  // Defaults "approved" -- matching that DemoHeader's "Sign In as
  // Contributor" shortcut represents an already-existing, already-
  // verified contributor, not a fresh signup; only Onboarding's own
  // finish() (via submitContributorApplication) ever sets this to
  // "pending". ContributorGate.tsx is what actually enforces the block.
  contributorVerificationStatus: ContributorVerificationStatus;
  // The one real submission action: identity + every picked badge, set
  // together, gate flipped to "pending" -- mirrors the real app's own
  // handleFinish() writing to contributor_identity and contributor_badges
  // in the same signup action.
  submitContributorApplication: (identity: ContributorIdentity, badges: ContributorBadgeEntry[]) => void;
  // The one real admin action: approves/rejects the WHOLE bundle, not a
  // badge at a time -- cascades to every one of this contributor's badge
  // rows too, matching the real unified ContributorVerification queue's
  // own single approve/reject per contributor.
  decideContributorVerification: (status: "approved" | "rejected") => void;
  // Tap-only stand-in for "the contributor edited something and it auto-
  // resubmitted" (the real app's own protect_contributor_identity_review_
  // fields trigger behavior) -- no free-text editing to simulate, so this
  // is the honest tap-only representation: flips the gate back to
  // pending and un-rejects any badge that was cascaded to "rejected".
  resubmitContributorVerification: () => void;
  // Real-app parity: the live Navbar's own LanguageSwitcher persists the
  // chosen language app-wide via I18nProvider's context, not per-component
  // local state -- selecting a language on one screen still shows it
  // selected after navigating elsewhere. Mirrored here the same way,
  // through this same app-wide DemoState rather than giving
  // LanguageSwitcher.tsx its own separate context (this demo already has
  // exactly one shared state provider; no reason to add a second).
  // Defaults "en" (English), matching the real I18nProvider's own default.
  uiLanguage: string;
  setUiLanguage: (code: string) => void;
}

const Ctx = createContext<DemoState | null>(null);

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [draftCampaigns, setDraftCampaigns] = useState<DraftCampaign[]>([]);
  const [reviewStatus, setReviewStatusMap] = useState<Record<string, ReviewStatus>>(() =>
    Object.fromEntries(REVIEW_QUEUE.map((item) => [item.id, "pending" as ReviewStatus]))
  );
  const [contributorBadges, setContributorBadges] = useState<ContributorBadgeEntry[]>([
    { subCategoryId: "finance_and_wealth.personal_finance", status: "approved" },
  ]);
  const [contributorIdentity, setContributorIdentity] = useState<ContributorIdentity | null>(null);
  const [contributorVerificationStatus, setContributorVerificationStatus] =
    useState<ContributorVerificationStatus>("approved");
  const [uiLanguage, setUiLanguage] = useState("en");

  const value = useMemo<DemoState>(
    () => ({
      draftCampaigns,
      addCampaign: (c) =>
        setDraftCampaigns((prev) => [
          { ...c, id: `draft-${Date.now()}`, createdAt: Date.now() },
          ...prev,
        ]),
      reviewStatus,
      setReviewStatus: (id, status) => setReviewStatusMap((prev) => ({ ...prev, [id]: status })),
      contributorBadges,
      setContributorBadges,
      setBadgeStatus: (subCategoryId, status) =>
        setContributorBadges((prev) => prev.map((b) => (b.subCategoryId === subCategoryId ? { ...b, status } : b))),
      contributorIdentity,
      contributorVerificationStatus,
      submitContributorApplication: (identity, badges) => {
        setContributorIdentity(identity);
        setContributorBadges(badges);
        setContributorVerificationStatus("pending");
      },
      decideContributorVerification: (status) => {
        setContributorVerificationStatus(status);
        setContributorBadges((prev) => prev.map((b) => ({ ...b, status })));
      },
      resubmitContributorVerification: () => {
        setContributorVerificationStatus("pending");
        setContributorBadges((prev) => prev.map((b) => (b.status === "rejected" ? { ...b, status: "pending" } : b)));
      },
      uiLanguage,
      setUiLanguage,
    }),
    [draftCampaigns, reviewStatus, contributorBadges, contributorIdentity, contributorVerificationStatus, uiLanguage]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemoState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemoState must be used within DemoStateProvider");
  return ctx;
}
