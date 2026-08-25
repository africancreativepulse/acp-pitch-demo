// Taxonomy expansion sync (Part 2) -- the real app's own overhaul, applied
// here: campaigns.category / contributor_badges.category (a flat 10-value
// vocabulary) replaced by a real two-level structure, 29 major fields and
// 220 leaf sub-categories, seeded from ../acp-handoff/supabase/migrations/
// 20260824130030_taxonomy_expansion_stage1_schema.sql -- read-only
// reference, per this project's own no-import discipline (see README).
// Nothing here is invented: every field/leaf name below is copied verbatim
// from that real seed.
//
// Scope decision (approved): all 29 major fields shown in full -- the real
// scale is the point -- but each field carries a CURATED subset of its real
// leaves rather than all 220, since a demo genuinely doesn't need leaf-220
// depth to prove the structure is real. Most fields keep 4 of their real
// leaves; African Diaspora keeps its real geography/topic facet split (4
// geography + 3 topic, of its real 7 + 6). IDs are namespaced
// `${majorFieldSlug}.${leafSlug}` because the real schema's own uniqueness
// is scoped to (major_field_id, slug), not global -- a handful of leaf
// names/slugs genuinely repeat across fields in the real seed (e.g.
// "Esports" under both Sports and Gaming & Youth Entertainment), and a flat
// slug-as-id here would silently collide.

export type Facet = "geography" | "topic";

export interface MajorField {
  slug: string;
  name: string;
}

export interface SubCategory {
  id: string;
  name: string;
  majorFieldSlug: string;
  facet?: Facet;
}

export const MAJOR_FIELDS: MajorField[] = [
  { slug: "business_and_entrepreneurship", name: "Business & Entrepreneurship" },
  { slug: "finance_and_wealth", name: "Finance & Wealth" },
  { slug: "education", name: "Education" },
  { slug: "family_and_parenting", name: "Family & Parenting" },
  { slug: "work_and_careers", name: "Work & Careers" },
  { slug: "housing_and_living", name: "Housing & Living" },
  { slug: "health_and_wellness", name: "Health & Wellness" },
  { slug: "politics_and_civic_life", name: "Politics & Civic Life" },
  { slug: "religion_and_spirituality", name: "Religion & Spirituality" },
  { slug: "fashion_and_beauty", name: "Fashion & Beauty" },
  { slug: "food_and_culinary", name: "Food & Culinary" },
  { slug: "music", name: "Music" },
  { slug: "film_and_television", name: "Film & Television" },
  { slug: "art_and_design", name: "Art & Design" },
  { slug: "sports", name: "Sports" },
  { slug: "technology_and_digital", name: "Technology & Digital" },
  { slug: "creators_and_media", name: "Creators & Media" },
  { slug: "travel_and_tourism", name: "Travel & Tourism" },
  { slug: "youth_and_generations", name: "Youth & Generations" },
  { slug: "society_and_identity", name: "Society & Identity" },
  { slug: "children_and_young_people", name: "Children & Young People" },
  { slug: "community_and_social_life", name: "Community & Social Life" },
  { slug: "environment_and_sustainability", name: "Environment & Sustainability" },
  { slug: "retail_and_consumer_behaviour", name: "Retail & Consumer Behaviour" },
  { slug: "luxury_and_aspirational_culture", name: "Luxury & Aspirational Culture" },
  { slug: "mobility_and_transport", name: "Mobility & Transport" },
  { slug: "african_diaspora", name: "African Diaspora" },
  { slug: "gaming_and_youth_entertainment", name: "Gaming & Youth Entertainment" },
  { slug: "events_festivals_and_nightlife", name: "Events, Festivals & Nightlife" },
];

function leaves(majorFieldSlug: string, entries: [string, string, Facet?][]): SubCategory[] {
  return entries.map(([slug, name, facet]) => ({ id: `${majorFieldSlug}.${slug}`, name, majorFieldSlug, facet }));
}

export const SUB_CATEGORIES: SubCategory[] = [
  ...leaves("business_and_entrepreneurship", [
    ["smes", "SMEs"], ["startups", "Startups"], ["entrepreneurship", "Entrepreneurship"], ["informal_economy", "Informal economy"],
  ]),
  ...leaves("finance_and_wealth", [
    ["banking", "Banking"], ["fintech", "Fintech"], ["personal_finance", "Personal finance"], ["financial_inclusion", "Financial inclusion"],
  ]),
  ...leaves("education", [
    ["higher_education", "Higher education"], ["online_learning", "Online learning"], ["skills_development", "Skills development"], ["education_technology", "Education technology"],
  ]),
  ...leaves("family_and_parenting", [
    ["parenting", "Parenting"], ["motherhood", "Motherhood"], ["fatherhood", "Fatherhood"], ["family_finances", "Family finances"],
  ]),
  ...leaves("work_and_careers", [
    ["employment", "Employment"], ["careers", "Careers"], ["freelancing", "Freelancing"], ["gig_economy", "Gig economy"],
  ]),
  ...leaves("housing_and_living", [
    ["property", "Property"], ["renting", "Renting"], ["urban_living", "Urban living"], ["household_spending", "Household spending"],
  ]),
  ...leaves("health_and_wellness", [
    ["healthcare", "Healthcare"], ["fitness", "Fitness"], ["mental_wellness", "Mental wellness"], ["traditional_health_practices", "Traditional health practices"],
  ]),
  ...leaves("politics_and_civic_life", [
    ["governance", "Governance"], ["elections", "Elections"], ["civic_participation", "Civic participation"], ["youth_politics", "Youth politics"],
  ]),
  ...leaves("religion_and_spirituality", [
    ["christianity", "Christianity"], ["islam", "Islam"], ["traditional_beliefs", "Traditional beliefs"], ["spirituality", "Spirituality"],
  ]),
  ...leaves("fashion_and_beauty", [
    ["fashion", "Fashion"], ["streetwear", "Streetwear"], ["beauty", "Beauty"], ["hair", "Hair"],
  ]),
  ...leaves("food_and_culinary", [
    ["cuisine", "Cuisine"], ["restaurants", "Restaurants"], ["food_culture", "Food culture"], ["beverages", "Beverages"],
  ]),
  ...leaves("music", [
    ["genres", "Genres"], ["artists", "Artists"], ["live_music", "Live music"], ["music_business", "Music business"],
  ]),
  ...leaves("film_and_television", [
    ["cinema", "Cinema"], ["tv", "TV"], ["streaming", "Streaming"], ["nollywood", "Nollywood"],
  ]),
  ...leaves("art_and_design", [
    ["contemporary_art", "Contemporary art"], ["traditional_art", "Traditional art"], ["photography", "Photography"], ["design", "Design"],
  ]),
  ...leaves("sports", [
    ["football", "Football"], ["rugby", "Rugby"], ["cricket", "Cricket"], ["esports", "Esports"],
  ]),
  ...leaves("technology_and_digital", [
    ["ai", "AI"], ["smartphones", "Smartphones"], ["social_media", "Social media"], ["e_commerce", "E-commerce"],
  ]),
  ...leaves("creators_and_media", [
    ["influencers", "Influencers"], ["podcasts", "Podcasts"], ["journalists", "Journalists"], ["creator_economy", "Creator economy"],
  ]),
  ...leaves("travel_and_tourism", [
    ["domestic_travel", "Domestic travel"], ["international_travel", "International travel"], ["hospitality", "Hospitality"], ["cultural_tourism", "Cultural tourism"],
  ]),
  ...leaves("youth_and_generations", [
    ["gen_z", "Gen Z"], ["millennials", "Millennials"], ["youth_identity", "Youth identity"], ["aspirations", "Aspirations"],
  ]),
  ...leaves("society_and_identity", [
    ["culture", "Culture"], ["language", "Language"], ["regional_identity", "Regional identity"], ["social_values", "Social values"],
  ]),
  ...leaves("children_and_young_people", [
    ["toys", "Toys"], ["entertainment", "Entertainment"], ["children_s_media", "Children's media"], ["youth_consumption", "Youth consumption"],
  ]),
  ...leaves("community_and_social_life", [
    ["communities", "Communities"], ["traditions", "Traditions"], ["celebrations", "Celebrations"], ["social_networks", "Social networks"],
  ]),
  ...leaves("environment_and_sustainability", [
    ["climate", "Climate"], ["recycling", "Recycling"], ["sustainable_consumption", "Sustainable consumption"], ["energy", "Energy"],
  ]),
  ...leaves("retail_and_consumer_behaviour", [
    ["shopping", "Shopping"], ["brands", "Brands"], ["informal_retail", "Informal retail"], ["brand_loyalty", "Brand loyalty"],
  ]),
  ...leaves("luxury_and_aspirational_culture", [
    ["luxury_goods", "Luxury goods"], ["wealth_signalling", "Wealth signalling"], ["status", "Status"], ["premium_experiences", "Premium experiences"],
  ]),
  ...leaves("mobility_and_transport", [
    ["cars", "Cars"], ["public_transport", "Public transport"], ["ride_hailing", "Ride-hailing"], ["commuting", "Commuting"],
  ]),
  ...leaves("african_diaspora", [
    ["uk", "UK", "geography"], ["us", "US", "geography"], ["france", "France", "geography"], ["caribbean", "Caribbean", "geography"],
    ["african_migration", "African migration", "topic"], ["remittances", "Remittances", "topic"], ["diaspora_fashion", "Diaspora fashion", "topic"],
  ]),
  ...leaves("gaming_and_youth_entertainment", [
    ["mobile_gaming", "Mobile gaming"], ["esports", "Esports"], ["gaming_creators", "Gaming creators"], ["anime", "Anime"],
  ]),
  ...leaves("events_festivals_and_nightlife", [
    ["music_festivals", "Music festivals"], ["cultural_festivals", "Cultural festivals"], ["concerts", "Concerts"], ["nightclubs", "Nightclubs"],
  ]),
];

// Reference only -- the real migration's own old-value -> major-field
// mapping (20260824130030's `_legacy_category_map`), copied verbatim so the
// remapping applied to this demo's own 4 existing campaigns (in data/
// demo.ts) traces back to the real app's actual decision, not a guess.
// beauty_wellness -> Fashion & Beauty and entertainment_pop_culture -> Film
// & Television were the two real judgment calls, not clean 1:1 name
// matches -- confirmed against the real migration's own comment.
export const LEGACY_CATEGORY_MAP: Record<string, string> = {
  fashion_style: "fashion_and_beauty",
  finance_business: "finance_and_wealth",
  food_culinary: "food_and_culinary",
  music_audio: "music",
  beauty_wellness: "fashion_and_beauty",
  tech_gadgets: "technology_and_digital",
  sports_fitness: "sports",
  entertainment_pop_culture: "film_and_television",
  parenting_family: "family_and_parenting",
  travel_lifestyle: "travel_and_tourism",
};

const byId = new Map(SUB_CATEGORIES.map((sc) => [sc.id, sc]));
const fieldBySlug = new Map(MAJOR_FIELDS.map((f) => [f.slug, f]));

export function subCategoryById(id: string): SubCategory | undefined {
  return byId.get(id);
}

export function subCategoryLabel(id: string): string | null {
  return byId.get(id)?.name ?? null;
}

export function majorFieldOf(subCategoryId: string): MajorField | undefined {
  const sc = byId.get(subCategoryId);
  return sc ? fieldBySlug.get(sc.majorFieldSlug) : undefined;
}

export function leavesByField(majorFieldSlug: string): SubCategory[] {
  return SUB_CATEGORIES.filter((sc) => sc.majorFieldSlug === majorFieldSlug);
}

/**
 * Real matching rule, ported from the live app's own
 * contributor_matches_campaign() (taxonomy expansion Stage 2 + the later
 * contributor_badge_evidence migration's own status filter): a contributor
 * matches an untagged campaign unconditionally (permissive default -- zero
 * campaign_categories rows means "reaches everyone"), and matches a tagged
 * campaign if any APPROVED badge shares a major field with any of the
 * campaign's tags -- exact sub-category equality is a subset of major-field
 * equality, so this one check covers both, same simplification the real
 * function documents. Pending/rejected badges never count, matching the
 * real app's own real correction (a badge only affects visibility once
 * admin-approved).
 */
export function contributorMatchesCampaign(
  campaignCategoryIds: string[],
  badges: { subCategoryId: string; status: "pending" | "approved" | "rejected" }[]
): boolean {
  if (campaignCategoryIds.length === 0) return true;
  const campaignFields = new Set(campaignCategoryIds.map((id) => majorFieldOf(id)?.slug).filter(Boolean));
  return badges.some((b) => b.status === "approved" && campaignFields.has(majorFieldOf(b.subCategoryId)?.slug));
}
