import { DashboardShell } from "@/components/DashboardShell";
import { FieldworkAnalyticsContent } from "./FieldworkAnalyticsContent";

/**
 * Real-app parity: thin DashboardShell wrapper around
 * FieldworkAnalyticsContent, matching the real fieldwork/
 * FieldworkAnalytics.tsx's own role exactly -- a direct-URL access point,
 * same content AgencyFieldwork.tsx's own Analytics tab renders inline.
 */
export function FieldworkAnalytics() {
  return (
    <DashboardShell role="agency">
      <div className="max-w-6xl px-6 pb-[60px] pt-[30px] md:px-10">
        <FieldworkAnalyticsContent />
      </div>
    </DashboardShell>
  );
}
