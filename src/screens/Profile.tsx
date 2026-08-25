import { useParams, Navigate } from "react-router-dom";
import { DashboardShell, ROLE_ACCENT, ROLE_AVATAR_GRADIENT, ROLE_IDENTITY, type ShellRole } from "@/components/DashboardShell";
import { ExpertBadge } from "@/components/ExpertBadge";
import { useDemoState } from "@/state/DemoState";

const SHELL_ROLES: ShellRole[] = ["agency", "contributor", "field_agent", "supervisor", "admin", "head_of_research"];

/**
 * Ported structural pattern from the real app's own pages/Profile.tsx --
 * one shared component reused across every role (via a /profile/:role
 * route, the same pattern Onboarding.tsx already established for its own
 * /onboarding/:role), not six near-duplicate screens. Every real role has
 * this in its own sidebar nav; this was the single most common gap in the
 * navigation-parity audit (missing for all 5 audited roles).
 *
 * Real, deliberate scope line: this shows the same identity/contact-info
 * shape the real Profile.tsx has (Full Name, and -- contributor + agency
 * only -- the real Contact Details section from today's actual live-app
 * work: Address/Postal Code/Phone Number), plus contributor's Expert
 * Badges as a real, honest DISPLAY of what Onboarding picked (matching
 * today's real correction: badges are signup-only, no add/edit
 * capability here). What's NOT ported: any actual editing. This whole
 * demo is tap-only, no free-text fields anywhere (see Onboarding.tsx's
 * own header comment) -- so every field here is a static, disabled
 * display, honestly labeled as such rather than faking editability.
 * Head of Research promotion CTA (a real but smaller Profile.tsx feature)
 * is deliberately left out -- that role already has its own full
 * ResearchHub.tsx operations screen; duplicating a promotion prompt here
 * isn't part of what "a genuine, reachable screen per nav item" requires.
 */
export function Profile() {
  const { role } = useParams<{ role: string }>();
  const { contributorBadges } = useDemoState();

  if (!role || !SHELL_ROLES.includes(role as ShellRole)) return <Navigate to="/" replace />;
  const typedRole = role as ShellRole;

  const accent = ROLE_ACCENT[typedRole];
  const [avatarFrom, avatarTo] = ROLE_AVATAR_GRADIENT[typedRole];
  const identity = ROLE_IDENTITY[typedRole];
  // Real boundary from today's actual profile_contact_details migration --
  // field_agent/supervisor/admin/head_of_research keep field_agent_profiles'
  // own separate identity infra in the real app, so they never got this
  // section there either.
  const hasContactDetails = typedRole === "agency" || typedRole === "contributor";

  return (
    <DashboardShell role={typedRole}>
      <div className="max-w-2xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex items-center gap-2.5">
          <div className="h-0.5 w-[30px]" style={{ backgroundColor: accent }} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>Profile</span>
        </div>
        <h1 className="mb-10 font-display text-[22px] font-bold text-paper">Your Profile</h1>

        <div className="mb-10 flex items-center gap-5">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold text-ink"
            style={{ background: `linear-gradient(135deg, ${avatarFrom}, ${avatarTo})` }}
          >
            {identity.initial}
          </span>
          <div>
            <div className="font-display text-lg font-bold text-paper">{identity.name}</div>
            <div className="text-xs text-muted">{identity.label}</div>
          </div>
        </div>

        {typedRole === "contributor" && (
          <div className="mb-10">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Expert Badges</div>
            {contributorBadges.length > 0 ? (
              <p className="mb-4 text-[13px] text-muted">
                Picked once, at signup -- a pending badge only starts matching you to campaigns once Admin
                approves it in Badge Verification. Not editable here, same real correction the live app just
                shipped.
              </p>
            ) : (
              <p className="mb-4 text-[13px] text-muted">No expert badges picked yet.</p>
            )}
            <div className="flex flex-wrap gap-x-8 gap-y-4 rounded-lg border border-line p-4">
              {contributorBadges.map((b) => (
                <ExpertBadge key={b.subCategoryId} category={b.subCategoryId} color={accent} status={b.status} />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <Field label="Full Name">
            <StaticInput value={identity.name} />
          </Field>

          {hasContactDetails && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Phone Number">
                  <StaticInput value="+27 71 555 0134" />
                </Field>
                <Field label="Postal Code">
                  <StaticInput value="2001" />
                </Field>
              </div>
              <Field label="Address">
                <StaticInput value={`14 Vilakazi Street, ${identity.name === "Ndoni Creative" ? "Braamfontein" : "Orlando West"}`} />
              </Field>
            </>
          )}

          <p className="text-[11px] text-muted">
            Illustrative — this demo has no editable profile fields (no backend, no persistence beyond this tab's
            own session). The real app's own Profile page is fully editable.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] uppercase tracking-[0.1em] text-muted">{label}</label>
      {children}
    </div>
  );
}

function StaticInput({ value }: { value: string }) {
  return (
    <input
      value={value}
      disabled
      readOnly
      className="h-11 w-full rounded border border-line bg-transparent px-3 text-[13px] text-paper/70 disabled:cursor-default"
    />
  );
}
