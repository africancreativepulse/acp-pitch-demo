import {
  Briefcase, Landmark, GraduationCap, Baby, Building2, Home, HeartPulse, Vote, BookOpen,
  Shirt, UtensilsCrossed, Music2, Clapperboard, Palette, Dumbbell, Smartphone, Video, Plane,
  Sparkles, Globe, ToyBrick, Users, Leaf, ShoppingBag, Gem, Car, Compass, Gamepad2, PartyPopper,
  Clock, type LucideIcon,
} from "lucide-react";
import { subCategoryLabel, majorFieldOf } from "@/data/taxonomy";
import type { BadgeStatus } from "@/state/DemoState";

// Taxonomy expansion sync (Part 2) -- one icon per MAJOR FIELD (29 of
// them), not per leaf (a curated ~120 and a real 220) -- the real
// product's own expert-badge concept has no per-leaf icon system, and 220
// distinct icons would be decoration, not signal. Picked for direct
// recognizability, keyed by taxonomy.ts's own major-field slugs.
const MAJOR_FIELD_ICON: Record<string, LucideIcon> = {
  business_and_entrepreneurship: Briefcase,
  finance_and_wealth: Landmark,
  education: GraduationCap,
  family_and_parenting: Baby,
  work_and_careers: Building2,
  housing_and_living: Home,
  health_and_wellness: HeartPulse,
  politics_and_civic_life: Vote,
  religion_and_spirituality: BookOpen,
  fashion_and_beauty: Shirt,
  food_and_culinary: UtensilsCrossed,
  music: Music2,
  film_and_television: Clapperboard,
  art_and_design: Palette,
  sports: Dumbbell,
  technology_and_digital: Smartphone,
  creators_and_media: Video,
  travel_and_tourism: Plane,
  youth_and_generations: Sparkles,
  society_and_identity: Globe,
  children_and_young_people: ToyBrick,
  community_and_social_life: Users,
  environment_and_sustainability: Leaf,
  retail_and_consumer_behaviour: ShoppingBag,
  luxury_and_aspirational_culture: Gem,
  mobility_and_transport: Car,
  african_diaspora: Compass,
  gaming_and_youth_entertainment: Gamepad2,
  events_festivals_and_nightlife: PartyPopper,
};

const STATUS_LABEL: Record<BadgeStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

/**
 * A genuinely visible badge treatment for contributor expert categories --
 * Part C item 11's capability existed before this (Onboarding's Expertise
 * step picks one, ContributorCapture named it in a small muted text line)
 * but the payoff was easy to miss. This is the same fact given real visual
 * weight: an icon in a colored ring, not a sentence to read past.
 *
 * `category` is now a real taxonomy.ts sub-category id, not a flat legacy
 * value -- label and icon both derive from the real 29-field/220-leaf
 * structure (icon per major field the leaf belongs to). `status`
 * (optional) shows the real pending/approved/rejected review state where a
 * caller has it (Profile, Badge Verification) -- omitted where a badge is
 * already known-approved by construction (e.g. ContributorCapture's own
 * matched-badge payoff, which only ever fires for an approved badge).
 */
export function ExpertBadge({
  category,
  color = "var(--sound)",
  size = "md",
  status,
}: {
  category: string;
  color?: string;
  size?: "sm" | "md";
  status?: BadgeStatus;
}) {
  const label = subCategoryLabel(category);
  if (!label) return null;
  const fieldSlug = majorFieldOf(category)?.slug;
  const Icon = (fieldSlug && MAJOR_FIELD_ICON[fieldSlug]) || Sparkles;
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
        <span className="flex items-center gap-1.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em]" style={{ color }}>
          Expert Badge
          {status && status !== "approved" && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-line/60 px-1.5 py-0.5 text-[8.5px] font-medium normal-case tracking-normal text-muted">
              {status === "pending" && <Clock className="h-2.5 w-2.5" />}
              {STATUS_LABEL[status]}
            </span>
          )}
        </span>
        <span className="font-display text-[14px] font-bold leading-tight text-paper">{label}</span>
      </span>
    </span>
  );
}
