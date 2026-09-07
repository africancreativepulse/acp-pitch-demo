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

// Full real-app parity build (Tracks B+C, tonight's agency-verification-
// depth session): agency's own Verify step used to collect nothing but a
// fake document-upload toggle -- this is the same field-for-field
// treatment ContributorIdentity already got, now field-for-field matching
// the real app's own now-expanded agency_profiles (company_name/work_email
// plus the 9 fields added tonight: registration_number/vat_number/
// business_address/website/linkedin_company_url/phone_number/
// primary_contact_first_name/surname/role). Same "small illustrative
// pre-written set, never free text" collection method as ContributorIdentity
// -- see Onboarding.tsx's own *_OPTIONS constants.
export type AgencyVerificationStatus = "pending" | "verified" | "rejected";

export interface AgencyProfile {
  companyName: string;
  workEmail: string;
  registrationNumber: string;
  vatNumber: string;
  businessAddress: string;
  website: string;
  linkedinUrl: string;
  phoneNumber: string;
  primaryContactFirstName: string;
  primaryContactSurname: string;
  primaryContactRole: string;
  country: string;
  city: string;
  language: string;
  docUploaded: boolean;
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
  // Agency's own live pipeline (Track C), mirroring every field/action
  // above exactly: null until Onboarding's agency flow actually runs once,
  // "verified" default (not "pending") -- matching that DemoHeader's own
  // "Sign In as Agency" shortcut represents Ndoni Creative, an already-
  // existing, already-verified agency, same reasoning
  // contributorVerificationStatus's own default follows for the
  // Contributor shortcut. Only Onboarding's agency finish() (via
  // submitAgencyApplication) ever sets this to "pending" -- AgencyGate.tsx
  // is what actually enforces the block, same as ContributorGate.tsx.
  agencyProfile: AgencyProfile | null;
  agencyVerificationStatus: AgencyVerificationStatus;
  // The one real submission action -- mirrors submitContributorApplication.
  // Called from the Verify step's own Continue button now, not deferred to
  // the Ready screen's exit button (see Onboarding.tsx's own header comment
  // on tonight's confirmation-timing fix, applied to agency's brand-new
  // pipeline from the start rather than shipping the same bug it was built
  // to avoid).
  submitAgencyApplication: (profile: AgencyProfile) => void;
  // The one real admin action -- mirrors decideContributorVerification.
  // "verified" (not "approved") to match the real app's own
  // agency_profiles.verification_status vocabulary, and this demo's own
  // pre-existing AGENCY_VERIFICATION_QUEUE status values.
  decideAgencyVerification: (status: "verified" | "rejected") => void;
  // Tap-only stand-in for "the agency edited something and it auto-
  // resubmitted" -- mirrors resubmitContributorVerification. No badges to
  // un-reject here (agency has none), so this is simpler: just flips the
  // gate back to pending.
  resubmitAgencyVerification: () => void;
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
  // Admin's "Preview Contributor Dashboard" (ContributorVerification.tsx) --
  // a real gap the illustrative Lindiwe K./Sipho N./Amahle P. rows exposed:
  // they're static example data with nothing behind them by design (see
  // their own disabled approve/reject buttons), so there was no way to
  // show "what an approved contributor's dashboard looks like" without
  // either a full tab reload (loses every other bit of live demo state --
  // draft campaigns, review decisions, everything) or re-approving the
  // live session's own card (works, but conflates "just show the look" with
  // the real reactive-unlock loop, and doesn't help if that live card is
  // deliberately sitting pending/rejected mid-demo). Deliberately its own
  // independent field, not reusing/aliasing contributorVerificationStatus --
  // ContributorGate.tsx unlocks on EITHER being true, but they're free to
  // disagree (preview on while the live session is genuinely still
  // pending/rejected is the whole point) and toggling this one never
  // touches the real gate's own state.
  previewContributorDashboard: boolean;
  setPreviewContributorDashboard: (on: boolean) => void;
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
  const [agencyProfile, setAgencyProfile] = useState<AgencyProfile | null>(null);
  const [agencyVerificationStatus, setAgencyVerificationStatus] =
    useState<AgencyVerificationStatus>("verified");
  const [uiLanguage, setUiLanguage] = useState("en");
  const [previewContributorDashboard, setPreviewContributorDashboard] = useState(false);

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
      agencyProfile,
      agencyVerificationStatus,
      submitAgencyApplication: (profile) => {
        setAgencyProfile(profile);
        setAgencyVerificationStatus("pending");
      },
      decideAgencyVerification: (status) => setAgencyVerificationStatus(status),
      resubmitAgencyVerification: () => setAgencyVerificationStatus("pending"),
      uiLanguage,
      setUiLanguage,
      previewContributorDashboard,
      setPreviewContributorDashboard,
    }),
    [
      draftCampaigns,
      reviewStatus,
      contributorBadges,
      contributorIdentity,
      contributorVerificationStatus,
      agencyProfile,
      agencyVerificationStatus,
      uiLanguage,
      previewContributorDashboard,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemoState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemoState must be used within DemoStateProvider");
  return ctx;
}
