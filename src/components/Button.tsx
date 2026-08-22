import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Ported from the real app's Button.tsx (the `.btn`/`.btn-solid`/
 * `.btn-ghost` button used throughout the real marketing + dashboard
 * pages). Only changes from the original: `text-cei-ink`/`border-cei-
 * paper`/`text-cei-paper` -> this project's flat `text-ink`/`border-
 * paper`/`text-paper` token names (same resolved colors), and the prop
 * this demo's call sites previously named `accent` is now `color` to
 * match the real component's actual API -- call sites were updated to
 * match rather than aliasing around the real component's shape.
 *
 * Renders an `<a>` when `href` is given, a `<button>` otherwise.
 */
type CommonProps = {
  variant?: "solid" | "ghost" | "outline";
  /** CSS color for the solid fill / ghost hover border / outline border+hover-fill. Defaults to Pulse. */
  color?: string;
  children: ReactNode;
  className?: string;
};

type ButtonAsAnchor = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export function Button(props: ButtonAsAnchor | ButtonAsButton) {
  const { variant = "solid", color = "var(--pulse)", children, className = "", ...rest } = props;

  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm border font-display text-[12.5px] font-semibold uppercase tracking-[0.06em] px-[22px] py-3 transition-colors disabled:pointer-events-none disabled:opacity-40";

  const variantClasses =
    variant === "solid"
      ? "border-transparent text-ink hover:brightness-110"
      : variant === "outline"
      ? "bg-[var(--ink)] text-[var(--btn-accent)] hover:bg-[var(--btn-accent)] hover:text-ink"
      : "border-paper/25 text-paper bg-transparent hover:border-[var(--btn-accent)] hover:text-[var(--btn-accent)]";

  // Every variant only ever sets the --btn-accent *variable* inline (plus
  // border-color for outline) -- never background-color/color directly,
  // so hover classes can actually win over the cascade (see the real
  // component's own header comment for the inline-vs-class hover bug this
  // avoids by construction).
  const style =
    variant === "solid"
      ? { backgroundColor: color }
      : variant === "outline"
      ? { borderColor: color, ["--btn-accent" as string]: color }
      : ({ ["--btn-accent" as string]: color } as const);

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={`${base} ${variantClasses} ${className}`} style={style} {...anchorRest}>
        {children}
      </a>
    );
  }

  return (
    <button className={`${base} ${variantClasses} ${className}`} style={style} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
