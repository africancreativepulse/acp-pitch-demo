import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileText, Users, Shield, MapPin, Menu, X, LogOut, ShieldCheck,
  User, FolderOpen, BarChart3, TrendingUp, Languages,
} from "lucide-react";
import { DemoHeader } from "@/components/DemoHeader";
import { NotificationBell } from "@/components/NotificationBell";

/**
 * Ported structural pattern from the real app's
 * components/dashboard/DashboardLayout.tsx -- the persistent sidebar +
 * main-content shell wrapping EVERY real dashboard/operations page. This
 * was the actual structural gap the earlier re-skin pass missed: it
 * ported atomic components (Button, SignalRing, colors, fonts) but every
 * demo screen still composed its own one-off header instead of sitting
 * inside this real shell.
 *
 * Deliberately simplified from the real component: no auth/i18n/
 * notifications/global-search (none of those exist in this demo, and
 * porting them would mean building real subsystems this prototype
 * doesn't need). What's kept is the real STRUCTURE: logo-as-home-link,
 * role-scoped nav list, avatar+role footer, and the same real
 * responsive behavior (fixed desktop sidebar, mobile hamburger +
 * slide-out) -- not just its visual skin.
 */
export type ShellRole = "agency" | "contributor" | "field_agent" | "supervisor" | "admin" | "head_of_research";

// Matches the real app's roleTheme.ts exactly -- not invented for this
// demo. ROLE_LOGO_LABEL is the real sidebar wordmark per role;
// ROLE_ACCENT already existed in this demo's own token set under the
// same names. head_of_research = Taste (var(--taste)) is the real app's
// own choice too, per roleTheme.ts's own documented hue-gap audit.
export const ROLE_ACCENT: Record<ShellRole, string> = {
  agency: "var(--visual)",
  contributor: "var(--sound)",
  field_agent: "var(--pulse)",
  supervisor: "var(--soulgap)",
  admin: "var(--ritual)",
  head_of_research: "var(--taste)",
};

const ROLE_LOGO_LABEL: Record<ShellRole, string> = {
  agency: "ACP AGENCY",
  contributor: "ACP CONTRIBUTE",
  field_agent: "ACP FIELDWORK",
  supervisor: "ACP FIELDWORK",
  admin: "ACP ADMIN",
  head_of_research: "ACP RESEARCH",
};

export const ROLE_AVATAR_GRADIENT: Record<ShellRole, [string, string]> = {
  agency: ["var(--visual)", "var(--soulgap)"],
  contributor: ["var(--sound)", "var(--visual)"],
  field_agent: ["var(--pulse)", "var(--soulgap)"],
  supervisor: ["var(--soulgap)", "var(--visual)"],
  admin: ["var(--ritual)", "var(--language)"],
  head_of_research: ["var(--taste)", "var(--visual)"],
};

// No real accounts exist in this demo (no backend, see README) -- these
// are honest role labels, not fabricated email addresses standing in for
// a login that was never built.
export const ROLE_IDENTITY: Record<ShellRole, { initial: string; name: string; label: string }> = {
  agency: { initial: "N", name: "Ndoni Creative", label: "Agency" },
  contributor: { initial: "C", name: "Guest Contributor", label: "Contributor" },
  field_agent: { initial: "T", name: "Thabo M.", label: "Field Agent" },
  supervisor: { initial: "S", name: "Duty Supervisor", label: "Supervisor" },
  admin: { initial: "A", name: "Platform Admin", label: "Admin" },
  head_of_research: { initial: "N", name: "Nomvula D.", label: "Head of Research" },
};

// Full parity pass (today) -- this used to be "a pared-down version of the
// real per-role nav lists, scoped to the screens this demo actually has."
// That was the wrong call for what this demo is *for*: it's meant to be a
// true, full representation of the real platform's navigation and depth --
// click-through/no-signup is the only intentional difference from the real
// app, not reduced scope. Every real labelKey/path below (from the real
// app's own agencyNav/contributorNav/fieldAgentNav/supervisorNav/adminNav/
// headOfResearchNav in DashboardLayout.tsx) now has a genuine, reachable
// screen -- see each new screen's own header comment for what real content
// backs it. "Operations"/"Fieldwork" hub-link items that have no real-app
// equivalent are kept (they're this demo's own real navigational spine
// into the Operations Layer, not a stand-in for a missing real item).
const NAV: Record<ShellRole, { label: string; icon: typeof LayoutDashboard; path: string }[]> = {
  agency: [
    { label: "Overview", icon: LayoutDashboard, path: "/agency/overview" },
    { label: "Campaigns", icon: FileText, path: "/agency" },
    { label: "Fieldwork", icon: Users, path: "/operations" },
    { label: "Insights", icon: BarChart3, path: "/agency/insights" },
    { label: "Files", icon: FolderOpen, path: "/files/agency" },
    { label: "Profile", icon: User, path: "/profile/agency" },
  ],
  // Fieldwork/Operations dropped from here -- the real app's own
  // contributorNav never has it (confirmed against roleTheme.ts/
  // DashboardLayout.tsx: nav.overview, nav.browse, nav.myTasks,
  // nav.analytics, nav.files, nav.profile -- no fieldwork entry at
  // all). Fieldwork operations (zones, field agent management) are an
  // Agency/Admin tool in the real product; a Field Agent is a
  // distinct role from Contributor, not an extension of it. This got
  // misattached to Contributor when the Collection & Verification
  // narrative chain was wired in -- the Field half of that story is
  // already correctly reachable from the Agency side (Campaign
  // Detail's own chain card), which is where it belongs.
  contributor: [
    { label: "Overview", icon: LayoutDashboard, path: "/contribute/overview" },
    { label: "Browse", icon: FileText, path: "/contribute/browse" },
    { label: "My Tasks", icon: Users, path: "/contribute" },
    { label: "Analytics", icon: TrendingUp, path: "/contribute/analytics" },
    { label: "Files", icon: FolderOpen, path: "/files/contributor" },
    { label: "Profile", icon: User, path: "/profile/contributor" },
  ],
  field_agent: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/operations/field" },
    { label: "Earnings", icon: BarChart3, path: "/earnings/field_agent" },
    { label: "Profile", icon: User, path: "/profile/field_agent" },
    { label: "Operations", icon: Users, path: "/operations" },
  ],
  supervisor: [
    { label: "Team", icon: Users, path: "/operations/review" },
    // Same route field_agent's own "Dashboard" uses -- matches the real
    // app's own supervisorNav exactly (nav.dashboard points at the same
    // /dashboard/fieldwork/agent field agents use). ?supervisor=1 keeps
    // the sidebar correctly showing the supervisor's own identity/nav
    // while viewing it, same query-param-role pattern AgencyCommand.tsx's
    // ?admin=1 already established.
    { label: "Dashboard", icon: LayoutDashboard, path: "/operations/field?supervisor=1" },
    { label: "Earnings", icon: BarChart3, path: "/earnings/supervisor" },
    { label: "Profile", icon: User, path: "/profile/supervisor" },
    { label: "Operations", icon: MapPin, path: "/operations" },
  ],
  // Badge Verification (real path /dashboard/admin/badges) is the one
  // item deliberately NOT added here yet -- approved staging: it gets its
  // real content (the pending-badge review queue) built directly in Part
  // 2 alongside the taxonomy sync, rather than a placeholder screen now
  // that Part 2 would then have to rebuild. Tracked, not forgotten.
  admin: [
    { label: "Overview", icon: LayoutDashboard, path: "/operations/admin/overview" },
    { label: "Fieldwork Admin", icon: Shield, path: "/operations/admin" },
    { label: "Agency Verification", icon: ShieldCheck, path: "/operations/admin/agencies" },
    { label: "Campaigns", icon: FileText, path: "/agency?admin=1" },
    { label: "Translation QA", icon: Languages, path: "/operations/admin/translation-qa" },
    { label: "Profile", icon: User, path: "/profile/admin" },
    { label: "Operations", icon: MapPin, path: "/operations" },
  ],
  head_of_research: [
    { label: "Area Overview", icon: MapPin, path: "/operations/research" },
    { label: "Profile", icon: User, path: "/profile/head_of_research" },
    { label: "Operations", icon: Users, path: "/operations" },
  ],
};

export function DashboardShell({ role, children }: { role: ShellRole; children: ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const accent = ROLE_ACCENT[role];
  const [avatarFrom, avatarTo] = ROLE_AVATAR_GRADIENT[role];
  const identity = ROLE_IDENTITY[role];
  const navItems = NAV[role];
  // Handles nav items that carry a query string (admin's "Campaigns" links
  // to /agency?admin=1, the same route agencies use) -- location.pathname
  // alone never includes the query, so a plain equality check would never
  // highlight that item as active.
  const isActive = (path: string) => {
    const [itemPathname, itemSearch] = path.split("?");
    if (itemSearch) return location.pathname === itemPathname && location.search === `?${itemSearch}`;
    return location.pathname === itemPathname;
  };

  const navItemClass = (active: boolean) =>
    `flex items-center gap-[11px] w-full px-3 py-2.5 text-[13.5px] rounded transition-colors border-s-2 ${
      active ? "text-paper" : "border-transparent text-muted hover:text-[var(--nav-accent)] hover:bg-[color-mix(in_srgb,var(--nav-accent)_8%,transparent)] hover:border-[color-mix(in_srgb,var(--nav-accent)_35%,transparent)]"
    }`;
  const navItemStyle = (active: boolean) =>
    active
      ? { backgroundColor: `color-mix(in srgb, ${accent} 10%, transparent)`, borderColor: accent, ["--nav-accent" as string]: accent }
      : { ["--nav-accent" as string]: accent };

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex-1 space-y-0.5 px-3 py-2">
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <Link key={item.path} to={item.path} onClick={onNavigate} className={navItemClass(active)} style={navItemStyle(active)}>
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const IdentityFooter = () => (
    <div className="flex items-center justify-between gap-2.5 px-2 py-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-display text-xs font-bold text-ink"
          style={{ background: `linear-gradient(135deg, ${avatarFrom}, ${avatarTo})` }}
        >
          {identity.initial}
        </span>
        <div className="min-w-0">
          <div className="truncate text-xs text-paper">{identity.name}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted">{identity.label}</div>
        </div>
      </div>
      {/* Part C item 7 -- real placement match: the real app's own
          NotificationBell sits exactly here, "sidebar-footer" placement,
          next to the identity row. */}
      <NotificationBell placement="sidebar-footer" />
    </div>
  );

  return (
    <div className="relative flex min-h-screen flex-col bg-ink text-paper">
      {/* Item 5 -- the same consistent logo+back header now sits above
          every dashboard/operations screen, matching the real app's own
          MinimalHeader-above-DashboardLayout structure exactly. Back now
          resolves via real navigation history, not a fixed prop -- see
          DemoHeader's own header comment. */}
      <DemoHeader />
      <div className="relative flex flex-1">
        {/* Desktop sidebar -- same w-60/border-e/bg-panel proportions as the
            real app's own <aside>. */}
        <aside className="relative z-[2] hidden w-60 flex-col border-e border-line bg-panel md:flex">
          <Link to="/" className="flex items-center gap-[9px] px-5 pt-[26px] pb-5 opacity-100 transition-opacity hover:opacity-80">
            <span className="h-[9px] w-[9px] flex-shrink-0 rounded-full" style={{ backgroundColor: accent }} />
            <span className="font-display text-[13px] font-bold tracking-wide text-paper">{ROLE_LOGO_LABEL[role]}</span>
          </Link>

          <NavList />

          <div className="space-y-2 border-t border-line px-3 py-4">
            <IdentityFooter />
            <div className="flex items-center justify-end px-1">
              <Link to="/" className="flex items-center gap-1.5 rounded px-2 py-1.5 text-xs text-muted transition-colors hover:text-paper">
                <LogOut className="h-3.5 w-3.5" />
                Exit to Splash
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile header + slide-out nav */}
        <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-line bg-panel px-4 md:hidden">
            <div className="flex items-center gap-2">
              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1 text-paper">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <span className="font-display text-[13px] font-bold tracking-wide text-paper">{ROLE_LOGO_LABEL[role]}</span>
            </div>
            <NotificationBell placement="header" />
          </header>

          {mobileOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-ink/80 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
              {/* top-[124px] = DemoHeader's own h-[68px] + this mobile
                  header's h-14 (56px), now stacked above it -- matches the
                  real app's own identical fix in DashboardLayout.tsx once
                  it grew a MinimalHeader above its mobile header too. */}
              <div className="fixed bottom-0 start-0 top-[124px] z-50 flex w-64 flex-col border-e border-line bg-panel md:hidden">
                <NavList onNavigate={() => setMobileOpen(false)} />
                <div className="border-t border-line px-3 py-4">
                  <IdentityFooter />
                </div>
              </div>
            </>
          )}

          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
