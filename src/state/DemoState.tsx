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
}

interface DemoState {
  draftCampaigns: DraftCampaign[];
  addCampaign: (c: Omit<DraftCampaign, "id" | "createdAt">) => void;
  // Shared between SupervisorReview (writes) and AdminOversight (reads) --
  // a real connected pipeline, not two screens narrating the same idea
  // independently. Keyed by ReviewQueueItem.id, all start "pending".
  reviewStatus: Record<string, ReviewStatus>;
  setReviewStatus: (id: string, status: ReviewStatus) => void;
}

const Ctx = createContext<DemoState | null>(null);

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [draftCampaigns, setDraftCampaigns] = useState<DraftCampaign[]>([]);
  const [reviewStatus, setReviewStatusMap] = useState<Record<string, ReviewStatus>>(() =>
    Object.fromEntries(REVIEW_QUEUE.map((item) => [item.id, "pending" as ReviewStatus]))
  );

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
    }),
    [draftCampaigns, reviewStatus]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemoState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemoState must be used within DemoStateProvider");
  return ctx;
}
