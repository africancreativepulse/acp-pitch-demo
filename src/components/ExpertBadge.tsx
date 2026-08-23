import {
  Shirt, Landmark, UtensilsCrossed, Music2, Sparkles, Smartphone, Dumbbell, Clapperboard, Users, Plane, type LucideIcon,
} from "lucide-react";
import { categoryLabel } from "@/data/demo";

// No real-app icon set to port -- the real product's expert-badge concept
// has no visual system of its own yet, just the category vocabulary
// (CAMPAIGN_CATEGORIES). One icon per category, picked for direct
// recognizability, not decoration.
const CATEGORY_ICON: Record<string, LucideIcon> = {
  fashion_style: Shirt,
  finance_business: Landmark,
  food_culinary: UtensilsCrossed,
  music_audio: Music2,
  beauty_wellness: Sparkles,
  tech_gadgets: Smartphone,
  sports_fitness: Dumbbell,
  entertainment_pop_culture: Clapperboard,
  parenting_family: Users,
  travel_lifestyle: Plane,
};

/**
 * A genuinely visible badge treatment for contributor expert categories --
 * Part C item 11's capability existed before this (Onboarding's Expertise
 * step picks one, ContributorCapture named it in a small muted text line)
 * but the payoff was easy to miss. This is the same fact given real visual
 * weight: an icon in a colored ring, not a sentence to read past.
 */
export function ExpertBadge({
  category,
  color = "var(--sound)",
  size = "md",
}: {
  category: string;
  color?: string;
  size?: "sm" | "md";
}) {
  const label = categoryLabel(category);
  if (!label) return null;
  const Icon = CATEGORY_ICON[category] ?? Sparkles;
  const dims = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  const iconDims = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <span className="inline-flex shrink-0 items-center gap-3">
      <span
        className={`flex ${dims} shrink-0 items-center justify-center rounded-full border-2`}
        style={{ borderColor: color, backgroundColor: `color-mix(in srgb, ${color} 16%, transparent)` }}
      >
        <Icon className={iconDims} style={{ color }} />
      </span>
      <span className="flex flex-col whitespace-nowrap">
        <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em]" style={{ color }}>
          Expert Badge
        </span>
        <span className="font-display text-[14px] font-bold leading-tight text-paper">{label}</span>
      </span>
    </span>
  );
}
