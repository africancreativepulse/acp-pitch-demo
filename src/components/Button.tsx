import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  accent?: string;
  icon?: ReactNode;
}

// A single Button primitive used everywhere -- accent is a CSS color
// (usually one of the CEI tokens or the agency/contributor accent) so the
// same component reads correctly in either role's context without a prop
// explosion of one-off color variants.
export function Button({
  variant = "primary",
  accent = "#38C6FF",
  icon,
  className,
  style,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]";

  if (variant === "primary") {
    return (
      <button
        className={cn(base, "text-ink hover:brightness-110", className)}
        style={{ backgroundColor: accent, ...style }}
        {...props}
      >
        {icon}
        {children}
      </button>
    );
  }

  if (variant === "outline") {
    return (
      <button
        className={cn(base, "border bg-transparent hover:bg-white/5", className)}
        style={{ borderColor: accent, color: accent, ...style }}
        {...props}
      >
        {icon}
        {children}
      </button>
    );
  }

  return (
    <button
      className={cn(base, "border border-line bg-transparent text-paper hover:border-white/25 hover:bg-white/5", className)}
      style={style}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
