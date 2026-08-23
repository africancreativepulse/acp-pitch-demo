import type { ReactNode } from "react";

/**
 * Ported from the real app's design-system/components/IconButton.tsx --
 * the small circular bordered icon button used for approve/reject-style
 * row actions across the real supervisor back-check queue and admin
 * verification queue.
 */
export type IconButtonTone = "approve" | "reject" | "neutral";

const TONE_HOVER: Record<IconButtonTone, string> = {
  approve: "hover:border-[rgba(200,255,77,0.5)] hover:bg-[rgba(200,255,77,0.08)] hover:text-sound",
  reject: "hover:border-[rgba(255,90,41,0.5)] hover:bg-[rgba(255,90,41,0.08)] hover:text-pulse",
  neutral: "hover:border-paper/40 hover:text-paper",
};

export function IconButton({
  tone = "neutral",
  children,
  className = "",
  ...rest
}: {
  tone?: IconButtonTone;
  children: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded border border-line text-muted transition-colors ${TONE_HOVER[tone]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
