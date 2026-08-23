import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, CheckCircle2 } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/Button";
import { StatGrid, StatCard } from "@/components/StatCard";
import { RESEARCH_AREA, RESEARCH_ROSTER, INVITE_CANDIDATES, type RosterStatus } from "@/data/demo";

const ACCENT = "var(--taste)";

const STATUS_LABEL: Record<RosterStatus, string> = {
  available: "Available",
  on_assignment: "On Assignment",
  invited: "Invited",
};
const STATUS_COLOR: Record<RosterStatus, string> = {
  available: "var(--sound)",
  on_assignment: "var(--visual)",
  invited: "var(--language)",
};

/**
 * Ported structural pattern from the real app's research/Roster.tsx --
 * same column shape (Member/Role/Status/Recruited By/Action), same real
 * "invite panel toggled by a button" interaction, and the real
 * `recruited_by` field this component's separation-of-duties note is
 * built on. New: a persistent-roster StatGrid and a tap-only Promote
 * flow (the real page has no promotion action -- that's a genuinely new
 * moment this demo needs, built in the same real visual language).
 *
 * Represents five related product facts on one screen (Parts B, items
 * 4-8 of the brief) since they're all facets of the same role, not five
 * separate concepts: Head of Research is a persistent, city-level owner
 * of a local team (not project-scoped); recruitment is invite-only, never
 * self-signup; the roster survives between projects (the "Available"
 * status below existed before today and stays after); a field worker can
 * be promoted into this same role; and whoever recruits someone is never
 * the same person who later approves their submitted work.
 */
export function ResearchHub() {
  const roster = RESEARCH_ROSTER;
  const [showInvite, setShowInvite] = useState(false);
  const [invited, setInvited] = useState<Set<string>>(new Set());
  const [promoted, setPromoted] = useState<Set<string>>(new Set());

  const invite = (name: string) => setInvited((prev) => new Set(prev).add(name));

  const requestPromotion = (id: string) => setPromoted((prev) => new Set(prev).add(id));

  const available = roster.filter((m) => m.status === "available").length;
  const onAssignment = roster.filter((m) => m.status === "on_assignment").length;

  return (
    <DashboardShell role="head_of_research">
      <div className="px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-0.5 w-[30px]" style={{ backgroundColor: ACCENT }} />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                Head of Research
              </span>
            </div>
            <h1 className="mt-2.5 font-display text-[22px] font-bold text-paper">{RESEARCH_AREA.area}</h1>
            <p className="mt-1 text-[13px] text-muted">Owned by {RESEARCH_AREA.headOfResearch} since {RESEARCH_AREA.ownedSince}</p>
          </div>
          <Button color={ACCENT} className="!px-3 !py-1.5 !text-[11px]" onClick={() => setShowInvite((v) => !v)}>
            <UserPlus className="me-1.5 h-3.5 w-3.5" /> Invite Member
          </Button>
        </div>

        <StatGrid className="mb-8">
          <StatCard label="Team Size" value={roster.length} />
          <StatCard label="Available Now" value={available} delta="Ready between projects" />
          <StatCard label="On Assignment" value={onAssignment} />
          <StatCard label="Avg Mobilization" value="2 days" delta="Not weeks" />
        </StatGrid>

        <p className="mb-8 max-w-2xl text-[13px] leading-relaxed text-muted">
          This roster existed before Sondela Cover and stays intact after it ends — the same trained
          team can be remobilized for the next project in days, not weeks spent recruiting and vetting
          from scratch.
        </p>

        {showInvite && (
          <div className="mb-8 rounded border border-line p-5">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Invite Only — Recruitment
            </div>
            <p className="mb-4 text-[13px] text-muted">
              Field workers join by invitation from their Head of Research, never by self-signup.
              Pick a candidate to send an invite.
            </p>
            <div className="flex flex-wrap gap-2">
              {INVITE_CANDIDATES.map((name) => {
                const done = invited.has(name);
                return (
                  <button
                    key={name}
                    type="button"
                    disabled={done}
                    onClick={() => invite(name)}
                    className="flex items-center gap-2 rounded-none border px-3.5 py-2 text-[13px] font-medium transition-colors disabled:cursor-default"
                    style={done ? { borderColor: "var(--language)", color: "var(--language)" } : { borderColor: "var(--line)", color: "var(--paper)" }}
                  >
                    {done && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {name} {done ? "— Invited" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-paper">Roster</h2>
        </div>

        <div className="overflow-x-auto rounded border border-line">
          <div className="grid min-w-[720px] grid-cols-5 gap-2 border-b border-line bg-panel p-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
            <span>Member</span><span>Role</span><span>Status</span><span>Recruited By</span><span>Action</span>
          </div>

          {roster.map((m) => (
            <div key={m.id} className="grid min-w-[720px] items-center gap-2 border-b border-line p-3 text-sm last:border-0 grid-cols-5">
              <div>
                <span className="font-medium text-paper">{m.name}</span>
                {m.currentCampaign && <div className="mt-0.5 text-[11px] text-muted">{m.currentCampaign}</div>}
              </div>
              <span className="text-xs capitalize text-muted">{m.role === "supervisor" ? "Supervisor" : "Field Agent"}</span>
              <span
                className="w-fit rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.06em]"
                style={{ color: STATUS_COLOR[m.status], backgroundColor: `color-mix(in srgb, ${STATUS_COLOR[m.status]} 14%, transparent)` }}
              >
                {STATUS_LABEL[m.status]}
              </span>
              {/* The separation-of-duties fact this whole screen is partly
                  built to show: whoever's named here (recruiter) is never
                  the same person as this campaign's Supervisor (reviewer) --
                  compare against Team Overview on Supervisor Review. */}
              <span className="text-xs text-muted">{m.recruitedBy}</span>
              {m.role === "field_agent" ? (
                promoted.has(m.id) ? (
                  <span className="flex w-fit items-center gap-1 text-xs" style={{ color: ACCENT }}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Promotion requested
                  </span>
                ) : (
                  <button
                    onClick={() => requestPromotion(m.id)}
                    className="w-fit text-[11px] font-semibold hover:underline"
                    style={{ color: ACCENT }}
                  >
                    Promote to Head of Research
                  </button>
                )
              ) : (
                <span className="text-xs text-muted">—</span>
              )}
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-2xl text-[11.5px] leading-relaxed text-muted">
          Separation of duties, by construction: {RESEARCH_AREA.headOfResearch} recruited Thabo M. onto
          this roster, but never reviews his submitted work — that's Duty Supervisor's job, a different
          person entirely. See{" "}
          <Link to="/operations/review" className="font-semibold hover:underline" style={{ color: ACCENT }}>
            Supervisor Review →
          </Link>
        </p>

        <p className="mt-4 text-[11.5px] leading-relaxed text-muted">
          Illustrative roster and promotion flow — a real request here would enter an actual approval
          queue, not resolve instantly.
        </p>
      </div>
    </DashboardShell>
  );
}
