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
  // matched your badge" payoff, and by Admin's Badge Verification queue.
  // Defaults to one already-APPROVED badge (matching Sondela Cover's own
  // real tag) so the match is visible even if a presenter skips
  // Onboarding entirely -- any badge picked live at Onboarding starts
  // "pending" instead, same as a real fresh signup, and won't match
  // anything until approved in Badge Verification.
  contributorBadges: ContributorBadgeEntry[];
  setContributorBadges: (badges: ContributorBadgeEntry[]) => void;
  setBadgeStatus: (subCategoryId: string, status: BadgeStatus) => void;
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
    }),
    [draftCampaigns, reviewStatus, contributorBadges]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemoState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemoState must be used within DemoStateProvider");
  return ctx;
}
