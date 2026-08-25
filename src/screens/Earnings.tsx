import { useParams, Navigate } from "react-router-dom";
import { DashboardShell, ROLE_ACCENT, ROLE_IDENTITY, type ShellRole } from "@/components/DashboardShell";
import { StatCard, StatGrid } from "@/components/StatCard";
import { Badge } from "@/components/Badge";
import { FIELD_WORKER } from "@/data/demo";

const EARNINGS_ROLES: ShellRole[] = ["field_agent", "supervisor"];

// Illustrative payout history -- same "small, plausible, clearly a demo
// beat, not a logistics simulation" scale as FIELD_ROUTE in data/demo.ts.
// Kept local to this screen rather than data/demo.ts since nothing else
// in the app reads it (matching CampaignBuilder.tsx's own Field/Chip
// helpers staying local rather than every small thing living centrally).
const PAYOUTS = [
  { id: "p1", label: "Sondela Cover — Week 3", method: "M-Pesa", amount: 420, status: "paid" as const },
  { id: "p2", label: "Sondela Cover — Week 2", method: "M-Pesa", amount: 380, status: "paid" as const },
  { id: "p3", label: "Sondela Cover — Week 1", method: "Bank Transfer", amount: 310, status: "paid" as const },
];

/**
 * Ported structural pattern from the real app's own pages/fieldwork/
 * AgentEarnings.tsx -- balance StatGrid + a payout history list, shared
 * across field_agent + supervisor via /earnings/:role since the real
 * app's own supervisorNav points its "Earnings" item at the exact same
 * route field_agent's own Earnings uses.
 */
export function Earnings() {
  const { role } = useParams<{ role: string }>();
  if (!role || !EARNINGS_ROLES.includes(role as ShellRole)) return <Navigate to="/" replace />;
  const typedRole = role as ShellRole;
  const accent = ROLE_ACCENT[typedRole];
  const total = PAYOUTS.reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardShell role={typedRole}>
      <div className="max-w-2xl px-6 pb-[60px] pt-[30px] md:px-10">
        <div className="mb-7 flex items-center gap-2.5">
          <div className="h-0.5 w-[30px]" style={{ backgroundColor: accent }} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>Earnings</span>
        </div>
        <h1 className="mb-2 font-display text-[22px] font-bold text-paper">{ROLE_IDENTITY[typedRole].name}'s Earnings</h1>
        <p className="mb-8 text-[13px] text-muted">{FIELD_WORKER.zone} · {FIELD_WORKER.campaignClient}</p>

        <StatGrid className="mb-8 sm:!grid-cols-3">
          <StatCard label="Total Paid" value={`R${total.toLocaleString()}`} />
          <StatCard label="This Month" value={`R${PAYOUTS[0].amount}`} delta="Week 3" />
          <StatCard label="Payment Method" value="M-Pesa" />
        </StatGrid>

        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Payment History</div>
        <div className="divide-y divide-line rounded border border-line">
          {PAYOUTS.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <div className="text-[13px] font-medium text-paper">{p.label}</div>
                <div className="text-[11.5px] text-muted">{p.method}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[13px] text-paper">R{p.amount}</span>
                <Badge color="#2FBF71">paid</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
