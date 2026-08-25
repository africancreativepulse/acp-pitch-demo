import { useParams, Navigate } from "react-router-dom";
import { FileText, Download } from "lucide-react";
import { DashboardShell, ROLE_ACCENT, type ShellRole } from "@/components/DashboardShell";

const FILE_ROLES: ShellRole[] = ["agency", "contributor"];

/**
 * Ported structural pattern from the real app's own pages/Files.tsx --
 * "Documents" eyebrow, the real single document entry every role's real
 * Files page shows (the ACP Platform Guide, a real 35-page RBAC/visual-
 * walkthrough/offline-PWA guide, not an invented placeholder). Shared
 * across agency + contributor via /files/:role, same pattern Profile.tsx
 * and Onboarding.tsx already established -- the real app's own Files page
 * is identical content for both roles too. Download is illustrative --
 * this demo ships no actual PDF, disclosed rather than a silently dead
 * button.
 */
export function Files() {
  const { role } = useParams<{ role: string }>();
  if (!role || !FILE_ROLES.includes(role as ShellRole)) return <Navigate to="/" replace />;
  const typedRole = role as ShellRole;
  const accent = ROLE_ACCENT[typedRole];

  return (
    <DashboardShell role={typedRole}>
      <div className="max-w-2xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex items-center gap-2.5">
          <div className="h-0.5 w-[30px]" style={{ backgroundColor: accent }} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>Files</span>
        </div>
        <h1 className="mb-2 font-display text-[22px] font-bold text-paper">Documents</h1>
        <p className="mb-8 text-[13px] text-muted">Internal documents and guides</p>

        <div className="flex items-center justify-between rounded border border-line p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded" style={{ backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)` }}>
              <FileText className="h-4.5 w-4.5" style={{ color: accent }} />
            </div>
            <div>
              <div className="text-[13.5px] font-medium text-paper">ACP Platform Guide</div>
              <div className="text-[11.5px] text-muted">
                35-page guide with full RBAC breakdowns, visual walkthroughs for all 5 roles, and offline/PWA details
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.06em] text-muted/70">~100 KB · v10.0</div>
            </div>
          </div>
          <button
            type="button"
            title="Illustrative — this demo ships no real file"
            className="flex shrink-0 items-center gap-1.5 rounded border border-line px-3 py-2 font-mono text-[11px] uppercase tracking-[0.06em] text-muted transition-colors hover:border-paper/40 hover:text-paper"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
