import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileText, Users, Shield, MapPin, Menu, X, LogOut, ShieldCheck,
} from "lucide-react";

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
const ROLE_ACCENT: Record<ShellRole, string> = {
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

const ROLE_AVATAR_GRADIENT: Record<ShellRole, [string, string]> = {
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
const ROLE_IDENTITY: Record<ShellRole, { initial: string; name: string; label: string }> = {
  agency: { initial: "N", name: "Ndoni Creative", label: "Agency" },
  contributor: { initial: "C", name: "Guest Contributor", label: "Contributor" },
  field_agent: { initial: "T", name: "Thabo M.", label: "Field Agent" },
  supervisor: { initial: "S", name: "Duty Supervisor", label: "Supervisor" },
  admin: { initial: "A", name: "Platform Admin", label: "Admin" },
  head_of_research: { initial: "N", name: "Nomvula D.", label: "Head of Research" },
};

// A pared-down version of the real per-role nav lists (agencyNav,
// contributorNav, fieldAgentNav, supervisorNav, adminNav, headOfResearchNav
// in the real DashboardLayout.tsx) -- scoped to the screens this demo
// actually has, not a full replica of the real product's much larger nav
// surface. Labels below are the real labelKey copy those roles' sidebars
// actually use.
const NAV: Record<ShellRole, { label: string; icon: typeof LayoutDashboard; path: string }[]> = {
  agency: [
    { label: "Campaigns", icon: FileText, path: "/agency" },
    { label: "Fieldwork", icon: Users, path: "/operations" },
  ],
  contributor: [
    { label: "My Tasks", icon: FileText, path: "/contribute" },
    { label: "Fieldwork", icon: Users, path: "/operations" },
  ],
  field_agent: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/operations/field" },
    { label: "Operations", icon: Users, path: "/operations" },
  ],
  supervisor: [
    { label: "Team", icon: Users, path: "/operations/review" },
    { label: "Operations", icon: LayoutDashboard, path: "/operations" },
  ],
  admin: [
    { label: "Fieldwork Admin", icon: Shield, path: "/operations/admin" },
    { label: "Agency Verification", icon: ShieldCheck, path: "/operations/admin/agencies" },
    { label: "Campaigns", icon: FileText, path: "/agency?admin=1" },
    { label: "Operations", icon: MapPin, path: "/operations" },
  ],
  head_of_research: [
    { label: "Area Overview", icon: MapPin, path: "/operations/research" },
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
    <div className="flex items-center gap-2.5 px-2 py-2">
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
  );

  return (
    <div className="relative flex min-h-screen flex-col bg-ink text-paper">
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
          </header>

          {mobileOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-ink/80 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
              <div className="fixed bottom-0 start-0 top-14 z-50 flex w-64 flex-col border-e border-line bg-panel md:hidden">
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
