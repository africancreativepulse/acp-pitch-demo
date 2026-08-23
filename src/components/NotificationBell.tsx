import { useEffect, useRef, useState } from "react";
import { Bell, Info, AlertTriangle, Gift, Trophy } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Ported structural pattern from the real app's components/notifications/
 * NotificationBell.tsx -- bell icon + pulse-colored unread count, a
 * dropdown of read/unread rows with a per-type icon, "Mark all read", and
 * the same two real placements/anchor directions (`sidebar-footer` opens
 * up-and-toward-the-sidebar's-own-leading-edge so it can't overflow off
 * the bottom or side of the viewport; `header` opens down-right, the
 * mobile top bar's own open space). Real state (fetch + realtime
 * subscription against a `notifications` table) is replaced with a small
 * local seed list -- no backend exists in this demo (see README) -- but
 * the read/unread interaction itself is real, local React state, not a
 * static mockup.
 *
 * This is a genuinely separate system from Part D item 13's device push
 * toast (CampaignDetail's "Mark Urgent" moment): that's an OS/browser-level
 * push arriving over the UI regardless of what's open; this is the
 * in-app inbox a user checks on their own, persisting until dismissed --
 * the real product has both, and they're wired to different code paths
 * there too. n1 below deliberately echoes the same urgent-campaign event
 * CampaignDetail's toast demonstrates, so a click-through investor can see
 * the same real event land through both real channels.
 */
interface DemoNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "campaign" | "warning" | "reward";
  time: string;
  read: boolean;
}

const TYPE_ICON: Record<DemoNotification["type"], typeof Info> = {
  info: Info,
  campaign: Trophy,
  warning: AlertTriangle,
  reward: Gift,
};

const SEED_NOTIFICATIONS: DemoNotification[] = [
  { id: "n1", title: "Sondela Cover marked urgent", message: "An urgent alert went out by device push to every contributor with a matching Finance & Business badge.", type: "warning", time: "2m ago", read: false },
  { id: "n2", title: "Reward paid", message: "+15 points credited for your last Voice Note submission on Sondela Cover.", type: "reward", time: "1h ago", read: false },
  { id: "n3", title: "Campaign matched to your badge", message: "Sondela Cover reached you because it matches your Finance & Business expert badge.", type: "campaign", time: "Yesterday", read: true },
];

export function NotificationBell({ placement = "header" }: { placement?: "header" | "sidebar-footer" }) {
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAsRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded p-2 text-muted transition-colors hover:text-paper"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -end-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-pulse text-[9px] font-bold text-ink">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 flex max-h-[70vh] w-80 flex-col rounded border border-line bg-panel shadow-2xl sm:w-96",
            placement === "sidebar-footer" ? "bottom-full start-0 mb-2" : "end-0 top-full mt-2"
          )}
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-paper">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="font-mono text-[10px] uppercase tracking-[0.1em] text-pulse hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {notifications.map((n) => {
              const Icon = TYPE_ICON[n.type];
              return (
                <button
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={cn(
                    "flex w-full gap-3 border-b border-line/50 px-4 py-3 text-start transition-colors",
                    n.read ? "opacity-60 hover:bg-ink" : "bg-pulse/5 hover:bg-pulse/10"
                  )}
                >
                  <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", n.read ? "text-muted" : "text-pulse")} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-paper">{n.title}</div>
                    <div className="line-clamp-2 text-xs text-muted">{n.message}</div>
                    <div className="mt-1 text-[10px] text-muted">{n.time}</div>
                  </div>
                  {!n.read && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pulse" />}
                </button>
              );
            })}
          </div>
          <div className="border-t border-line px-4 py-2 text-center text-[10.5px] text-muted">
            Illustrative in-app alerts — a separate channel from device push notifications.
          </div>
        </div>
      )}
    </div>
  );
}
