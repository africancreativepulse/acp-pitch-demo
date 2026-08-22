import type { ReactNode } from "react";

/**
 * Copied verbatim from the real app's GlitchText.tsx -- the RGB-split
 * flicker applied to key accent words in hero/CTA headings. Purely
 * decorative, used sparingly (one or two words per page).
 */
export function GlitchText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`relative inline-block animate-ds-glitch-flicker ${className}`}>{children}</span>;
}
