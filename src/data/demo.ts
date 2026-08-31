// All demo content lives here, hardcoded, on purpose -- see README. One
// real, fully-detailed campaign (Sondela Cover) carries the exact numbers
// given in the brief verbatim. Two secondary portfolio campaigns exist so
// Screen 1 reads as a real, returning-usage product rather than a single
// hero card in an empty room -- their numbers are invented but plausible
// (not inflated), and they intentionally carry less narrative depth than
// Sondela Cover (see AgencyCommand's snapshot-panel treatment for them,
// rather than the full Cultural Read / Evidence pair Sondela gets).

export type CeiKey = "visual" | "sound" | "language" | "ritual" | "pulse" | "taste";
export type Band = "green" | "amber" | "red";
export type CampaignStatus = "collecting" | "completed";

export const CEI_ORDER: CeiKey[] = ["pulse", "taste", "sound", "visual", "language", "ritual"];

export const CEI_LABEL: Record<CeiKey, string> = {
  visual: "Visual",
  sound: "Sound",
  language: "Language",
  ritual: "Ritual",
  pulse: "Pulse",
  taste: "Taste",
};

export const CEI_COLOR: Record<CeiKey, string> = {
  visual: "#38C6FF",
  sound: "#C8FF4D",
  language: "#FFC93C",
  ritual: "#FF5C93",
  pulse: "#FF5A29",
  taste: "#2DD4A6",
};

export const SOULGAP_COLOR = "#9B6BFF";

// Real definitions, verbatim from the real app's i18n/translations.ts
// (features.cei.desc / features.cdi.desc, English) -- an investor unfamiliar
// with the platform previously saw CEI/CDI/Decay numbers with nothing
// explaining what they measure. Surfaced via InfoHint wherever a score is
// shown (CampaignDetail's Overview cards + CEI/CDI tabs, Agency Command's
// table headers), not invented copy.
export const CEI_DEFINITION =
  "Cultural Engagement Index — measures cultural velocity and market readiness on a scale of 0-100. Higher scores indicate content or trends that are primed for cross-cultural adoption and global export potential.";
export const CDI_DEFINITION =
  "Cultural Depth Index — an authenticity metric that measures cultural alignment and flags backlash risk on a scale of 0-10. Higher scores indicate genuine cultural connection; lower scores suggest potential inauthenticity.";

// ---------------------------------------------------------------------------
// Band logic -- pure functions, not hardcoded per-campaign, so the same
// rules apply to Sondela Cover and to whatever a user creates live in the
// Campaign Builder.
// ---------------------------------------------------------------------------

export function cdiBand(cdi: number): Band {
  if (cdi >= 7) return "green";
  if (cdi >= 5) return "amber";
  return "red";
}

export function decayBand(decay: number): Band {
  // Decay is a risk score -- lower is better, the inverse sense of CDI.
  if (decay < 3) return "green";
  if (decay < 5) return "amber";
  return "red";
}

export const BAND_HEX: Record<Band, string> = {
  green: "#2FBF71",
  amber: "#E8A020",
  red: "#C0392B",
};

export interface QuadrantRead {
  label: string;
  description: string;
}

// The 2x2 collapses each 3-band score to a binary (High/Low depth,
// Elevated/Low risk) -- this is deliberately coarser than the 3-band pills
// on the cards themselves. "Elevated risk" starts wherever Decay leaves
// the green band (amber or red both count), matching the given Sondela
// combo (CDI 7.2 green -> High depth; Decay 4.6 amber -> Elevated risk).
export function quadrantRead(cdi: number, decay: number): QuadrantRead {
  const highDepth = cdiBand(cdi) === "green";
  const elevatedRisk = decayBand(decay) !== "green";
  if (highDepth && !elevatedRisk) {
    return {
      label: "Authentic & Stable",
      description: "The read is deep and holding steady — protect what's working, don't over-optimize it away.",
    };
  }
  if (highDepth && elevatedRisk) {
    return {
      label: "Live but mishandled",
      description: "Biggest upside if you fix the execution.",
    };
  }
  if (!highDepth && !elevatedRisk) {
    return {
      label: "Safe but shallow",
      description: "Nothing's breaking, but there's not much real signal here yet either — worth deepening before scaling spend.",
    };
  }
  return {
    label: "At risk",
    description: "Thin signal and losing ground — this is the one to intervene on first.",
  };
}

// ---------------------------------------------------------------------------
// Evidence
// ---------------------------------------------------------------------------

export interface QuoteEvidence {
  kind: "quote";
  quote: string;
  gloss?: string; // omitted when the quote itself is already in English
  city: string;
  contributorId: string;
  // Optional, not defaulted -- the real Soul Gap quote came through
  // without a capture date. Inventing one to fill the gap would be
  // exactly the kind of unlabeled fabrication this whole correction is
  // about avoiding, so EvidenceCard renders an honest "pending" state
  // instead when this is absent, rather than a fake specific date.
  date?: string;
  verified: true;
}

export interface PhotoEvidence {
  kind: "photo";
  caption: string;
  city: string;
  contributorId: string;
  date: string;
  verified: true;
}

export interface AudioEvidence {
  kind: "audio";
  caption: string;
  durationLabel: string;
  city: string;
  contributorId: string;
  date: string;
  verified: true;
}

export type EvidenceItem = QuoteEvidence | PhotoEvidence | AudioEvidence;

export interface SoulGap {
  magnitude: "Narrow" | "Moderate" | "Wide";
  headline: string;
  evidence: EvidenceItem[];
}

export interface Campaign {
  id: string;
  client: string;
  concept: string;
  objective: string;
  cities: string[];
  ageBand: string;
  methodology: string;
  verifiedResponses: number;
  status: CampaignStatus;
  cei: Record<CeiKey, number> | null;
  cdi: number | null;
  decay: number | null;
  soulGap: SoulGap | null;
  evidence: Record<CeiKey, EvidenceItem[]>;
  /** Real sub_category ids (taxonomy.ts) this campaign is tagged under --
      the real basis contributor expert badges match against. 1..n, matching
      the real app's own campaign_categories join table (Taxonomy expansion
      Stage 1's approved multi-tag cardinality change, replacing a single
      nullable category column). Optional/empty since draft campaigns
      created live in Campaign Builder may not tag one. */
  categories?: string[];
  /** Set only for a campaign admin created directly, no agency in
      between -- see AgencyCommand.tsx's admin-view filtering. */
  adminDirect?: boolean;
}

export const AGENCY = {
  name: "Ndoni Creative",
  city: "Johannesburg",
};

// ---------------------------------------------------------------------------
// Sondela Cover -- the one fully detailed, real-numbers campaign.
// ---------------------------------------------------------------------------

const sondelaCei: Record<CeiKey, number> = {
  visual: 6.8,
  sound: 8.1,
  language: 7.4,
  ritual: 8.6,
  pulse: 7.9,
  taste: 7.6,
};

const sondela: Campaign = {
  id: "sondela-cover",
  client: "Sondela Cover",
  concept: "Cover that feels like family",
  objective:
    "Understand why young urban Africans distrust or delay buying funeral / short-term cover.",
  cities: ["Soweto (Johannesburg)", "uMlazi (Durban)", "Khayelitsha (Cape Town)"],
  ageBand: "18–34",
  methodology: "Digital + Field Hybrid",
  verifiedResponses: 340,
  status: "collecting",
  categories: ["finance_and_wealth.personal_finance"],
  cei: sondelaCei,
  cdi: 7.2,
  decay: 4.6,
  soulGap: {
    magnitude: "Wide",
    headline:
      "The brand sells financial freedom and peace of mind. The audience isn't buying wealth — they're buying a dignified send-off and standing in their community. The campaign is speaking to an individual; the audience is thinking about everyone who'll be in the room.",
    evidence: [
      {
        kind: "quote",
        quote: "Peace of mind for who? If I die and there's no cover, it's my mother who carries the shame. That's what I'm paying for.",
        city: "Soweto",
        contributorId: "#A4855",
        // No date given for this one -- see QuoteEvidence's own comment on
        // why this stays undefined rather than getting a fabricated value.
        verified: true,
      },
    ],
  },
  evidence: {
    ritual: [
      {
        kind: "quote",
        quote: "Ukufa akusiyo into oyenza wedwa. Umuntu ufihlwa yikhaya lonke.",
        gloss: "Dying isn't a solo thing. A person is buried by the whole household.",
        city: "Soweto",
        contributorId: "CT-4471",
        date: "4 Aug 2026",
        verified: true,
      },
      {
        kind: "photo",
        caption: "A woman lighting a candle beside a framed family photo, the night before the service.",
        city: "Soweto",
        contributorId: "CT-3312",
        date: "6 Aug 2026",
        verified: true,
      },
      {
        kind: "audio",
        caption: "Voice note describing who is expected to attend and why that list matters.",
        durationLabel: "0:52",
        city: "uMlazi",
        contributorId: "CT-5501",
        date: "9 Aug 2026",
        verified: true,
      },
    ],
    visual: [
      {
        kind: "quote",
        quote: "Sikhumbula ngengubo, hayi ngesudi.",
        gloss: "We remember by the blanket, not the suit.",
        city: "Khayelitsha",
        contributorId: "CT-2208",
        date: "5 Aug 2026",
        verified: true,
      },
    ],
    sound: [
      {
        kind: "quote",
        quote: "Umculo wesililo awuncengi, uyakhala nawe.",
        gloss: "Funeral hymns don't try to persuade you — they grieve with you.",
        city: "uMlazi",
        contributorId: "CT-5563",
        date: "7 Aug 2026",
        verified: true,
      },
    ],
    language: [
      {
        kind: "quote",
        quote: "We don't say insurance, we say 'ipolicy yomngcwabo' — the funeral one. Insurance sounds like something for other people.",
        city: "Khayelitsha",
        contributorId: "#C7702",
        date: "09 Feb 2026",
        verified: true,
      },
    ],
    pulse: [
      {
        kind: "quote",
        quote: "Everyone's talking about their stokvel right now, not their policy number.",
        city: "uMlazi",
        contributorId: "CT-6642",
        date: "10 Aug 2026",
        verified: true,
      },
    ],
    taste: [
      {
        kind: "quote",
        quote: "The cover I'd respect is the one my aunt has — it shows up with a proper programme and a marquee, not a cheap tent. That's the standard.",
        city: "uMlazi",
        contributorId: "#B1204",
        date: "11 Feb 2026",
        verified: true,
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Two secondary portfolio campaigns -- summary-level only. Screen 1 shows
// their real stats; they don't get their own Cultural Read / Evidence
// screens (see AgencyCommand's snapshot panel) so no evidence content is
// needed for them, keeping the one genuinely deep traceability story
// (Sondela) uncompeted-with.
// ---------------------------------------------------------------------------

export interface SecondaryCampaign {
  id: string;
  client: string;
  cities: string[];
  methodology: string;
  verifiedResponses: number;
  status: CampaignStatus;
  cei: Record<CeiKey, number>;
  cdi: number;
  decay: number;
  soulGap: { magnitude: SoulGap["magnitude"]; headline: string };
  reportNote?: string;
  categories?: string[];
  /** Set only for a campaign admin created directly, no agency in
      between -- see AgencyCommand.tsx's admin-view filtering. */
  adminDirect?: boolean;
}

export const KASI_BREW: SecondaryCampaign = {
  id: "kasi-brew",
  client: "Kasi Brew",
  cities: ["Alexandra (Johannesburg)", "Gugulethu (Cape Town)"],
  methodology: "Digital Only",
  verifiedResponses: 210,
  status: "completed",
  categories: ["food_and_culinary.beverages"],
  cei: { visual: 7.2, sound: 8.4, language: 6.5, ritual: 5.9, pulse: 7.0, taste: 8.0 },
  cdi: 6.1,
  decay: 2.8,
  soulGap: {
    magnitude: "Narrow",
    headline:
      "The brand's youthful, aspirational tone genuinely matches how the audience already feels — the small gap here is about which platforms carry that feeling, not the feeling itself.",
  },
  reportNote:
    "Campaign closed at 210 verified responses. Strongest read on Sound (8.4) and Taste (8.0) — the brand's township-social positioning is landing. Ritual (5.9) is the one dimension worth another pass before the next flight.",
};

export const THOLULWAZI_DATA: SecondaryCampaign = {
  id: "tholulwazi-data",
  client: "Tholulwazi Data",
  cities: ["Mamelodi (Pretoria)", "KwaMashu (Durban)"],
  methodology: "Field Only",
  verifiedResponses: 128,
  status: "collecting",
  categories: ["technology_and_digital.smartphones"],
  cei: { visual: 5.5, sound: 6.0, language: 7.8, ritual: 6.2, pulse: 8.3, taste: 5.1 },
  cdi: 5.4,
  decay: 6.2,
  soulGap: {
    magnitude: "Moderate",
    headline:
      "The brand promises connection at the lowest price. The audience already assumes cheap means unreliable — trust has to be earned before price becomes the deciding factor.",
  },
};

// Illustrative admin-direct example -- ACP running a campaign for a brand
// with no agency account in the picture at all (Part E's "admin-direct
// campaigns" business-model point). Only ever shown in the admin view of
// Agency Command (see AgencyCommand.tsx's `?admin=1` filtering) -- a real
// agency's own query is scoped to campaigns THEY own, so this genuinely
// wouldn't appear there, matching the real app's own agency_id-scoped RLS.
export const MZANSI_WELLNESS: SecondaryCampaign = {
  id: "mzansi-wellness",
  client: "Mzansi Wellness",
  cities: ["Soweto (Johannesburg)", "Umlazi (Durban)"],
  methodology: "Digital + Field Hybrid",
  verifiedResponses: 64,
  status: "collecting",
  categories: ["fashion_and_beauty.beauty"],
  adminDirect: true,
  cei: { visual: 6.4, sound: 6.9, language: 6.1, ritual: 5.8, pulse: 7.3, taste: 6.6 },
  cdi: 6.4,
  decay: 3.9,
  soulGap: {
    magnitude: "Moderate",
    headline:
      "Booked directly through ACP -- this brand has no agency of record yet. Early read: the campaign talks self-care as indulgence; contributors are framing it as maintenance, something you budget for, not treat yourself to.",
  },
};

export const SONDELA = sondela;

// ---------------------------------------------------------------------------
// Expert badges / campaign categories -- see data/taxonomy.ts for the real
// 29-field/220-leaf structure (curated here) contributor self-selected
// expertise and campaign tags both draw from, replacing the old flat
// 10-value vocabulary this section used to hold directly.
// ---------------------------------------------------------------------------

// Real correction (badge_case_study_evidence, live app): the old "any one
// handle + a written note" model is gone, replaced by genuine, checkable
// proof of a real client relationship. caseStudyFileName is illustrative-
// only -- a filename-like string these hand-authored rows can carry
// (matching the "illustrative rows can be fully realistic" precedent this
// file already established for handles/experienceNote before this
// change), never a real uploaded file; ContributorVerification.tsx never
// links it anywhere, just displays it as plain text.
export interface BadgeEvidenceEntry {
  subCategoryId: string;
  clientWebsite?: string;
  clientInstagram?: string;
  caseStudyFileName?: string;
  caption?: string;
}

// Unified contributor verification (concept sync with tonight's real-app
// change): one entry per CONTRIBUTOR, not per badge -- identity plus every
// badge they picked, reviewed and approved/rejected together as a single
// submission. Replaces the old BadgeReviewItem/BADGE_REVIEW_QUEUE shape
// (one row per badge, reviewed independently), same reasoning the real
// app's own contributor_identity + bundled contributor_badges review
// action now uses. Lindiwe K. deliberately carries two badges, not one --
// with every illustrative row holding exactly one, the "bundled, not
// per-badge" point wouldn't actually be visible in the queue.
// Real gap closed: identity used to be scoped down to just Country/City/
// Language. Now field-for-field matches what the real app's own unified
// contributor_identity holds -- Address/Postal Code/Phone Number/general
// social handles, alongside the badges already here. `handles` holds
// pre-formatted display strings ("Instagram: @lindiwe.eats") directly --
// unlike the live session's own ContributorIdentity.handles (a plain list
// of platform labels a real tap toggles on, with no typed value to show),
// illustrative rows are hand-authored static content with nothing
// stopping them from being fully realistic.
export interface ContributorVerificationEntry {
  id: string;
  contributorName: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  phoneNumber: string;
  handles: string[];
  language: string;
  badges: BadgeEvidenceEntry[];
}

// Illustrative pending submissions from OTHER contributors -- same
// established pattern as AGENCY_VERIFICATION_QUEUE and REVIEW_QUEUE
// (SupervisorReview's back-check queue): named rows beyond this demo's one
// live Guest Contributor session, so Admin's own Contributor Verification
// queue has real content to review even before anyone touches Onboarding.
// The Guest Contributor's own live identity + badges (from DemoState, set
// at Onboarding) are layered on top of this list at render time in
// ContributorVerification.tsx, not duplicated here.
export const CONTRIBUTOR_VERIFICATION_QUEUE: ContributorVerificationEntry[] = [
  {
    id: "contributor-1",
    contributorName: "Lindiwe K.",
    country: "South Africa",
    city: "Johannesburg",
    address: "34 Vilakazi Street",
    postalCode: "1804",
    phoneNumber: "+27 82 445 9013",
    handles: ["Instagram: @lindiwe.eats", "TikTok: @lindiwe.eats"],
    language: "English",
    badges: [
      {
        subCategoryId: "food_and_culinary.food_culture",
        clientWebsite: "sowetosupperclub.co.za",
        clientInstagram: "@sowetosupperclub",
        caseStudyFileName: "soweto-supper-club-2024.pdf",
        caption: "Six-month supper-club series across Soweto and Alex — booking rates, repeat-guest data, and press coverage.",
      },
      {
        subCategoryId: "travel_and_tourism.cultural_tourism",
        clientWebsite: "capeheritagetours.co.za",
        clientInstagram: "@capeheritagetours",
        caseStudyFileName: "soweto-walking-tours-case-study.pdf",
        caption: "Weekend food-and-culture walking tours for Cape Heritage Tours — visitor feedback and route engagement.",
      },
    ],
  },
  {
    id: "contributor-2",
    contributorName: "Sipho N.",
    country: "South Africa",
    city: "Cape Town",
    address: "19 Bree Street",
    postalCode: "8001",
    phoneNumber: "+27 71 220 5567",
    handles: ["X (Twitter): @sipho_tech"],
    language: "isiZulu",
    badges: [
      {
        subCategoryId: "technology_and_digital.smartphones",
        clientWebsite: "breephones.co.za",
        clientInstagram: "@breephones",
        caseStudyFileName: "bree-street-refurb-case-study.pdf",
        caption: "Refurbished-phone stall at Bree Street taxi rank — how device trust concerns get handled in-person, daily foot traffic.",
      },
    ],
  },
  {
    id: "contributor-3",
    contributorName: "Amahle P.",
    country: "South Africa",
    city: "Cape Town",
    address: "6 Ntlangano Way",
    postalCode: "7750",
    phoneNumber: "+27 84 902 1145",
    handles: ["Instagram: @amahle_locs", "Facebook: facebook.com/amahlelocs"],
    language: "English",
    badges: [
      {
        subCategoryId: "fashion_and_beauty.hair",
        clientWebsite: "amahlelocsstudio.co.za",
        clientInstagram: "@amahle_locs",
        caseStudyFileName: "gugulethu-locs-studio-case-study.pdf",
        caption: "Four years as a natural hair stylist in Gugulethu — before/after client galleries and booking growth.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Cultural Layers -- real-app parity (Neil/Garth decision, same night as
// the Authentic Engine cut): the live app's own standalone CulturalLayers.tsx
// section no longer exists on its own -- its content merged into
// CEISection's own six dimension cards instead of repeating the same
// dimensions as a second section. This demo's Splash screen has no
// per-dimension scored-card section to merge into the way the real
// CEISection did (its own CEI representation here is the single aggregate
// SignalRing hexagon in the Hero above, not six separate cards) -- so this
// array now carries the merge the other direction instead, with an
// identical net result: each of these five gets its real score attached
// (pct, reused verbatim from SignalRing.tsx's own DEFAULT_SIGNAL_DIMENSIONS
// -- the exact same illustrative sample numbers the Hero's own ring already
// plots directly above this section, not a new dataset), plus a sixth
// Pulse entry that has neither description nor example (same reason the
// real app's own LAYERS array never had one: Pulse isn't a "layer" of
// cultural content) -- placeholder covers it honestly instead.
//
// Copy and the named example signals (Amapiano, Kitenge Futurism,
// Pidgin-English, Jollof) are verbatim from the real app's own
// i18n/translations.ts (layer.*/layer.*.desc, English) and
// CulturalLayers.tsx's own LAYERS array (now dead code there, not deleted
// -- see that file's own comment). Colors are NOT carried over from that
// same array, though -- checked directly and confirmed this is a real,
// separate quirk: CulturalLayers.tsx colors each card against a color
// that doesn't match its own same-named CEI dimension (Visual = Soul
// Gap's purple, Ritual = Visual's blue), documented there as deliberate,
// inherited from an even older pre-Phase-2 version. That quirk belongs
// to CulturalLayers.tsx specifically, not to SignalRing.tsx (checked
// that too, both the real app's and this demo's own copy -- both map
// every dimension correctly, no mismatch anywhere). Since this array's
// own pct values are sourced from SignalRing's correctly-colored sample
// and rendered on the same page directly below that same ring, reusing
// CulturalLayers.tsx's mismatched colors here would create a new,
// visible inconsistency this page never had before (Visual blue in the
// Hero, Visual purple in the card below it) -- colors below use each
// dimension's own real token (var(--visual), var(--ritual)) instead.
// Order matches the real app's own CEI_ORDER (pulse first), not this
// array's old sound-first order.
// ---------------------------------------------------------------------------

export interface CulturalLayer {
  key: string;
  label: string;
  pct: number; // 0-100, see file-header comment -- reused from SignalRing's own sample, not new data.
  description?: string;
  example?: string;
  placeholder?: string; // Pulse only
  color: string;
}

export const CULTURAL_LAYERS: CulturalLayer[] = [
  { key: "pulse", label: "Pulse", pct: 85, placeholder: "Data sources being finalized", color: "var(--pulse)" },
  { key: "taste", label: "Taste", pct: 72, description: "Cuisine, street food, spice culture → Flavor & culinary export", example: "Jollof · Food & lifestyle signals", color: "var(--taste)" },
  { key: "sound", label: "Sound", pct: 90, description: "Streaming, radio, playlists → Artist & genre predictions", example: "Amapiano · Streaming & radio trend detection", color: "var(--sound)" },
  { key: "visual", label: "Visual", pct: 78, description: "Fashion, design, NFTs → Aesthetic trends", example: "Kitenge Futurism", color: "var(--visual)" },
  { key: "language", label: "Language", pct: 65, description: "Slang, creoles, memes → Vernacular shifts", example: "Pidgin-English · Slang & code-switching shifts", color: "var(--language)" },
  { key: "ritual", label: "Ritual", pct: 82, description: "Events, challenges, traditions → Cultural moments", example: "Event & challenge tracking", color: "var(--ritual)" },
];

// ---------------------------------------------------------------------------
// Task types -- shared between the Campaign Builder (step 2, choosing
// which collection tasks a campaign runs) and Contributor Capture (the
// task a contributor actually completes).
// ---------------------------------------------------------------------------

export type TaskTypeKey = "survey" | "photo" | "voice_note" | "street_intercept";

export interface TaskTypeMeta {
  key: TaskTypeKey;
  label: string;
  defaultPoints: number;
}

export const TASK_TYPES: TaskTypeMeta[] = [
  { key: "survey", label: "Survey", defaultPoints: 10 },
  { key: "voice_note", label: "Voice Note", defaultPoints: 15 },
  { key: "photo", label: "Photo", defaultPoints: 10 },
  { key: "street_intercept", label: "Street Intercept", defaultPoints: 20 },
];

export interface BuilderTask {
  id: string;
  type: TaskTypeKey;
  points: number;
}

// ---------------------------------------------------------------------------
// Contributor Capture (Screen 5) -- the one active task shown mid-flow.
// ---------------------------------------------------------------------------

export const CONTRIBUTOR_TASK = {
  campaignClient: "Sondela Cover",
  prompt: "What does 'cover' mean to your family?",
  type: "voice_note" as TaskTypeKey,
  points: 75,
  location: "Soweto, Johannesburg",
};

export const REWARD_OPTIONS = ["M-Pesa", "Airtime", "Bank Transfer"];

// ---------------------------------------------------------------------------
// Onboarding (Splash -> Country -> City -> Language, both personas) -- a
// small, tap-only signup journey, not an exhaustive replica of the real
// app's own signup form. Country drives which cities show on the next
// step; language list is a representative subset of ACP's real supported
// languages, not the full set.
// ---------------------------------------------------------------------------

// Synced against the real `countries` table's actual live is_active state
// (checked directly, 2026-08-24 investigation) -- was previously a stale,
// invented 5-country subset that had drifted from reality (the real table
// went from an initial 5 active to 14 of 15 active as the country/signup
// work landed). 14 active, only Mozambique still inactive.
export const COUNTRIES = [
  "Nigeria", "South Africa", "Kenya", "Ghana", "Tanzania", "Uganda", "Ethiopia",
  "Senegal", "Rwanda", "Cameroon", "Côte d'Ivoire", "Morocco", "Egypt", "Angola",
] as const;
export type Country = (typeof COUNTRIES)[number];

export const CITIES_BY_COUNTRY: Record<Country, string[]> = {
  Nigeria: ["Lagos", "Abuja", "Ibadan"],
  "South Africa": ["Johannesburg", "Durban", "Cape Town", "Pretoria"],
  Kenya: ["Nairobi", "Mombasa", "Kisumu"],
  Ghana: ["Accra", "Kumasi"],
  Tanzania: ["Dar es Salaam", "Dodoma", "Arusha"],
  Uganda: ["Kampala", "Entebbe"],
  Ethiopia: ["Addis Ababa", "Bahir Dar"],
  Senegal: ["Dakar", "Thiès"],
  Rwanda: ["Kigali", "Butare"],
  Cameroon: ["Douala", "Yaoundé"],
  "Côte d'Ivoire": ["Abidjan", "Yamoussoukro"],
  Morocco: ["Casablanca", "Rabat", "Marrakech"],
  Egypt: ["Cairo", "Alexandria"],
  Angola: ["Luanda", "Huambo"],
};

// The platform deliberately only shows markets it's actually live in --
// expanding country by country rather than overclaiming reach it doesn't
// have (real `countries.is_active` gate). Shown as disabled, clearly
// labeled chips alongside the live countries above, not silently omitted
// -- the point is showing the gate exists, not hiding it. Mozambique is
// the real table's only current is_active=false row.
export const COMING_SOON_COUNTRIES = ["Mozambique"];

// A representative subset, not the full real set -- this demo is
// English-only (see README); the picker itself is real and working.
// Arabic/RTL was represented here in an earlier pass (a toggle + real
// Arabic hero translations) and was removed by explicit request -- not
// wanted in this demo. Nothing else stood on top of that toggle, so
// removing it was a clean deletion, not a downgrade of anything else.
export const ONBOARDING_LANGUAGES = ["English", "isiZulu", "Yoruba", "Swahili", "Hausa", "Afrikaans"];

// ---------------------------------------------------------------------------
// The Operations Layer -- the platform's other half, beyond the two
// consumer-facing surfaces (Agency Command, Contributor Capture). Shows
// the offline/paper field-collection method that backs up the "Digital +
// Field Hybrid" methodology already sitting on Sondela Cover's own data,
// plus the supervisor back-check and admin oversight that sit behind
// every "Verified" badge in Evidence.tsx.
//
// Role accent colors below match the real ACP app's own role->color
// convention (field_agent = Pulse, supervisor = Soul Gap purple,
// admin = Ritual pink), not invented fresh for this demo.
// ---------------------------------------------------------------------------

export interface FieldStop {
  id: string;
  label: string;
}

// One field worker's route for one day -- illustrative, not a real roster
// or real GPS trail. Deliberately small (5 stops): this is a demo beat,
// not a logistics simulation.
export const FIELD_ROUTE: FieldStop[] = [
  { id: "fs-1", label: "Household 3" },
  { id: "fs-2", label: "Household 7" },
  { id: "fs-3", label: "Household 11" },
  { id: "fs-4", label: "Household 15" },
  { id: "fs-5", label: "Household 19" },
];

export const FIELD_WORKER = {
  name: "Thabo M.",
  zone: "Soweto, Ward 14",
  campaignClient: "Sondela Cover",
};

export type CaptureMethod = "digital" | "field";
export type ReviewStatus = "pending" | "approved" | "flagged";

export type RiskSignalType = "gps_mismatch" | "duplicate_submission" | "suspiciously_fast";
export type AlertSource = "ai" | "rule";

export interface RiskSignal {
  type: RiskSignalType;
  source: AlertSource;
  detail: string;
}

const RISK_SIGNAL_LABEL: Record<RiskSignalType, string> = {
  gps_mismatch: "GPS mismatch",
  duplicate_submission: "Duplicate submission",
  suspiciously_fast: "Suspiciously fast",
};

export function riskSignalLabel(type: RiskSignalType): string {
  return RISK_SIGNAL_LABEL[type];
}

export interface ReviewQueueItem {
  id: string;
  campaignClient: string;
  method: CaptureMethod;
  excerpt: string;
  city: string;
  contributorId: string;
  /** Present when the platform's own hybrid AI + rule-based detection
      already caught something specific -- shown once a supervisor flags
      the item, so "flagging" isn't just a human hunch, it's the system
      surfacing a concrete reason. Absent on genuinely clean responses --
      not every item has a signal, matching a real, mostly-clean queue. */
  riskSignal?: RiskSignal;
}

// Illustrative supervisor review queue -- deliberately drawn from Kasi
// Brew / Tholulwazi Data (the demo's already-invented secondary
// campaigns), not Sondela Cover. Sondela's evidence is the one deep,
// content-audited case study (real quotes, verified verbatim against the
// brief) -- adding new invented quotes under its name would blur that
// real-vs-invented ledger. These are fresh content, clearly separate.
export const REVIEW_QUEUE: ReviewQueueItem[] = [
  {
    id: "rq-1",
    campaignClient: "Kasi Brew",
    method: "digital",
    excerpt: "Everyone's already posting their own brew videos before we even asked them to.",
    city: "Alexandra",
    contributorId: "CT-8810",
    riskSignal: {
      type: "duplicate_submission",
      source: "rule",
      detail: "94% text match with another submission from the same device, 6 minutes earlier.",
    },
  },
  {
    id: "rq-2",
    campaignClient: "Kasi Brew",
    method: "field",
    excerpt: "Paper response: taste testers preferred the stronger blend, noted the aroma specifically.",
    city: "Gugulethu",
    contributorId: "CT-8822",
    riskSignal: {
      type: "gps_mismatch",
      source: "rule",
      detail: "Submission GPS sits 38km outside the assigned Gugulethu zone boundary.",
    },
  },
  {
    id: "rq-3",
    campaignClient: "Tholulwazi Data",
    method: "digital",
    excerpt: "Nobody trusts a data plan that doesn't show the price upfront.",
    city: "Mamelodi",
    contributorId: "CT-9014",
    riskSignal: {
      type: "suspiciously_fast",
      source: "ai",
      detail: "Completed in 9 seconds -- below the AI thoughtfulness-scan threshold for an open-text task.",
    },
  },
  {
    id: "rq-4",
    campaignClient: "Tholulwazi Data",
    method: "field",
    excerpt: "Paper response: respondent compared the offer directly to a competitor's SMS bundle.",
    city: "KwaMashu",
    contributorId: "CT-9027",
  },
  {
    id: "rq-5",
    campaignClient: "Kasi Brew",
    method: "digital",
    excerpt: "The queue outside on launch day was the real signal, not the survey.",
    city: "Alexandra",
    contributorId: "CT-8831",
  },
];

// ---------------------------------------------------------------------------
// Head of Research -- a persistent, city-level leadership role that owns
// a local team of field workers *between* projects, not just for the
// duration of one campaign. Backs the platform's real "mobilize an
// existing trained team in days, not weeks" claim: a roster this deep
// only pays off if it survives past whichever project built it.
// ---------------------------------------------------------------------------

export type RosterRole = "field_agent" | "supervisor";
export type RosterStatus = "available" | "on_assignment" | "invited";

export interface RosterMember {
  id: string;
  name: string;
  role: RosterRole;
  status: RosterStatus;
  /** Who invited them -- never the same person who later reviews their
      submitted work (that's always a Supervisor, a different person).
      See NomvulaD/ResearchHub.tsx's separation-of-duties note. */
  recruitedBy: string;
  currentCampaign?: string;
}

export const RESEARCH_AREA = {
  headOfResearch: "Nomvula D.",
  area: "Soweto Research Area",
  ownedSince: "March 2025",
};

// Thabo M. is the same field worker from Field Worker Capture -- real
// narrative continuity, this roster is genuinely who he's part of.
export const RESEARCH_ROSTER: RosterMember[] = [
  { id: "rm-1", name: "Thabo M.", role: "field_agent", status: "on_assignment", recruitedBy: "Nomvula D.", currentCampaign: "Sondela Cover" },
  { id: "rm-2", name: "Duty Supervisor", role: "supervisor", status: "on_assignment", recruitedBy: "Nomvula D.", currentCampaign: "Sondela Cover" },
  { id: "rm-3", name: "Palesa N.", role: "field_agent", status: "available", recruitedBy: "Nomvula D." },
  { id: "rm-4", name: "Katlego M.", role: "field_agent", status: "available", recruitedBy: "Nomvula D." },
  { id: "rm-5", name: "Refilwe T.", role: "field_agent", status: "available", recruitedBy: "Thabo M." },
];

// Candidates for the tap-only "Invite" flow -- no free-text name/contact
// entry (this demo's standing zero-typing rule), so inviting means
// picking from a small illustrative shortlist instead of typing details.
export const INVITE_CANDIDATES = ["Sipho R.", "Ayanda K.", "Bongani L."];

// ---------------------------------------------------------------------------
// Agency vetting -- agencies go through a document-verification step
// before they can post campaigns. Ndoni Creative (this demo's own agency
// persona) is already verified; the other two are illustrative queue
// entries for Admin's own Agency Verification screen.
// ---------------------------------------------------------------------------

export type VerificationStatus = "verified" | "pending" | "rejected";

export interface AgencyVerificationEntry {
  id: string;
  name: string;
  city: string;
  status: VerificationStatus;
  documentLabel: string;
}

export const AGENCY_VERIFICATION_QUEUE: AgencyVerificationEntry[] = [
  { id: "av-1", name: "Ndoni Creative", city: "Johannesburg", status: "verified", documentLabel: "CIPC registration certificate" },
  { id: "av-2", name: "Bright Horizon Media", city: "Nairobi", status: "pending", documentLabel: "Business registration certificate" },
  { id: "av-3", name: "Lagos Pulse Collective", city: "Lagos", status: "pending", documentLabel: "CAC registration document" },
];
