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

// Real-app parity fix, found the hard way: this used to model the real
// app's now-RETIRED landing/CulturalLayers.tsx (flat pct + description +
// example cards) as if it were still the live #cei section. It isn't --
// CulturalLayers.tsx was retired and merged INTO CEISection.tsx (see that
// file's own header comment), which today is a completely different UI:
// per-dimension Positioning-vs-Reality comparison cards (claimed
// messaging vs. measured evidence, with a Delta and an expandable verbatim
// quote), not a static percentage grid. This type/data replace the old
// CulturalLayer/CULTURAL_LAYERS entirely -- copied verbatim from the real
// data/ceiPositioningRealitySample.ts (positioning/reality/evidence) with
// each dimension's own layerNote/layerExample merged in exactly the way
// CEISection.tsx's own axes mapping merges them (from the retired
// CulturalLayers.tsx content, real layer.{key}.desc strings) -- English
// only, matching every other ported string in this file.
export interface CeiPositioningRealityAxis {
  key: string;
  label: string;
  description: string;
  positioning: number; // 0-100, illustrative brand-claim value
  reality: number; // 0-100, illustrative measured value
  color: string;
  evidence: { verbatim: string; languageLabel: string; gloss?: string };
  layerNote?: string;
  layerExample?: string;
  layerPlaceholder?: string; // Pulse only -- no retired CulturalLayers card ever existed for it
}

export const CEI_POSITIONING_REALITY: CeiPositioningRealityAxis[] = [
  {
    key: "pulse",
    label: "Pulse",
    description: "Trending cultural signals",
    positioning: 90,
    reality: 85,
    color: "var(--pulse)",
    evidence: {
      verbatim: "This dropped the same week everyone was already talking about the Afrobeats-meets-alté crossover — good timing, not luck.",
      languageLabel: "English",
    },
    layerPlaceholder: "Data sources being finalized",
  },
  {
    key: "taste",
    label: "Taste",
    description: "Cuisine & culinary culture",
    positioning: 86,
    reality: 74,
    color: "var(--taste)",
    evidence: {
      verbatim: "They used jollof as a backdrop image, but nothing in the campaign is actually about food — feels like a prop, not the culture.",
      languageLabel: "English",
    },
    layerNote: "Cuisine, street food, spice culture → Flavor & culinary export",
    layerExample: "Jollof · Food & lifestyle signals",
  },
  {
    key: "sound",
    label: "Sound",
    description: "Audio & oral traditions",
    positioning: 93,
    reality: 90,
    color: "var(--sound)",
    evidence: {
      verbatim: "The amapiano/afrobeats blend in the background actually matches what's playing on real dance floors right now.",
      languageLabel: "English",
    },
    layerNote: "Streaming, radio, playlists → Artist & genre predictions",
    layerExample: "Amapiano · Streaming & radio trend detection",
  },
  {
    key: "visual",
    label: "Visual",
    description: "Aesthetic identity",
    positioning: 84,
    reality: 78,
    color: "var(--visual)",
    evidence: {
      verbatim: "The colors and styling read as generic 'Afrofuturism' stock imagery, not anything specific to Lagos street style.",
      languageLabel: "English",
    },
    layerNote: "Fashion, design, NFTs → Aesthetic trends",
    layerExample: "Kitenge Futurism",
  },
  {
    key: "language",
    label: "Language",
    description: "Linguistic nuance",
    positioning: 80,
    reality: 65,
    color: "var(--language)",
    evidence: {
      verbatim: "Wasu daga cikin kalmomin sun ji kamar an fassara su ne kawai, ba yadda ake magana a nan ba.",
      languageLabel: "Hausa",
      gloss: "Some of the words felt like they were just translated, not how people actually talk here.",
    },
    layerNote: "Slang, creoles, memes → Vernacular shifts",
    layerExample: "Pidgin-English · Slang & code-switching shifts",
  },
  {
    key: "ritual",
    label: "Ritual",
    description: "Habits & ceremonies",
    positioning: 87,
    reality: 82,
    color: "var(--ritual)",
    evidence: {
      verbatim: "The event moments they referenced are things people actually do, not just imagined traditions.",
      languageLabel: "English",
    },
    layerNote: "Events, challenges, traditions → Cultural moments",
    layerExample: "Event & challenge tracking",
  },
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

// Full real-app parity build (Track C, tonight's agency-verification-depth
// session) -- these three illustrative rows now carry the same field depth
// ContributorVerificationEntry's own illustrative rows already have
// (address/postalCode/phoneNumber/handles etc.), matching the real app's
// own now-expanded agency_profiles. workEmail through primaryContactRole
// are all new; name/city/status/documentLabel are unchanged from before.
export interface AgencyVerificationEntry {
  id: string;
  name: string;
  city: string;
  status: VerificationStatus;
  documentLabel: string;
  workEmail: string;
  registrationNumber: string;
  vatNumber: string;
  businessAddress: string;
  website: string;
  linkedinUrl: string;
  phoneNumber: string;
  primaryContactFirstName: string;
  primaryContactSurname: string;
  primaryContactRole: string;
}

export const AGENCY_VERIFICATION_QUEUE: AgencyVerificationEntry[] = [
  {
    id: "av-1",
    name: "Ndoni Creative",
    city: "Johannesburg",
    status: "verified",
    documentLabel: "CIPC registration certificate",
    workEmail: "hello@ndonicreative.com",
    registrationNumber: "2018/045213/07",
    vatNumber: "4780123456",
    businessAddress: "12 Keyes Avenue, Rosebank, Johannesburg",
    website: "https://ndonicreative.com",
    linkedinUrl: "linkedin.com/company/ndoni-creative",
    phoneNumber: "+27 11 447 2200",
    primaryContactFirstName: "Zola",
    primaryContactSurname: "Ndoni",
    primaryContactRole: "Founder & Managing Director",
  },
  {
    id: "av-2",
    name: "Bright Horizon Media",
    city: "Nairobi",
    status: "pending",
    documentLabel: "Business registration certificate",
    workEmail: "info@brighthorizonmedia.co.ke",
    registrationNumber: "PVT-A1B2C3D4",
    vatNumber: "P051234567X",
    businessAddress: "Riverside Drive, Nairobi",
    website: "https://brighthorizonmedia.co.ke",
    linkedinUrl: "linkedin.com/company/bright-horizon-media",
    phoneNumber: "+254 20 445 0198",
    primaryContactFirstName: "Wanjiru",
    primaryContactSurname: "Kamau",
    primaryContactRole: "Client Services Director",
  },
  {
    id: "av-3",
    name: "Lagos Pulse Collective",
    city: "Lagos",
    status: "pending",
    documentLabel: "CAC registration document",
    workEmail: "team@lagospulse.ng",
    registrationNumber: "RC-1834562",
    vatNumber: "TIN-08765432-0001",
    businessAddress: "12 Adeola Odeku Street, Victoria Island, Lagos",
    website: "https://lagospulse.ng",
    linkedinUrl: "linkedin.com/company/lagos-pulse-collective",
    phoneNumber: "+234 1 291 0087",
    primaryContactFirstName: "Chidinma",
    primaryContactSurname: "Eze",
    primaryContactRole: "Managing Partner",
  },
];

// ---------------------------------------------------------------------------
// Admin Overview charts (nav/cosmetic audit, deferred bucket item 2) --
// the real page's own "Users by Role" bar list and Translation Coverage
// donut both need a dataset this demo has never modeled (a full user base;
// per-language translation coverage). Invented but plausible, same
// standard the two secondary portfolio campaigns above already set for
// this project -- not inflated, not a literal copy of any real production
// snapshot. Campaign Mix, by contrast, is NOT invented here -- AdminOverview.tsx
// derives it live from the real CAMPAIGNS/MZANSI_WELLNESS records already
// in this file, same "real numbers already fetched, not a new query" the
// real page's own comment documents.
// ---------------------------------------------------------------------------

// Real app's own ROLE_ORDER (pages/admin/AdminOverview.tsx) is exactly
// these five -- head_of_research is a real, newer live role this constant
// doesn't include either (a live-app gap, not a demo one) -- matching it
// exactly here is genuine parity, not an oversight.
export const ADMIN_ROLE_ORDER = ["contributor", "agency", "field_agent", "supervisor", "admin"] as const;
export const ADMIN_ROLE_LABEL: Record<(typeof ADMIN_ROLE_ORDER)[number], string> = {
  contributor: "Contributor",
  agency: "Agency",
  field_agent: "Field Agent",
  supervisor: "Supervisor",
  admin: "Admin",
};
export const ADMIN_ROLE_COUNTS: Record<(typeof ADMIN_ROLE_ORDER)[number], number> = {
  contributor: 34,
  agency: 6,
  field_agent: 9,
  supervisor: 3,
  admin: 3,
};

// Shared with TranslationQA.tsx -- same real-app reasoning as
// AdminOverview.tsx's own translation-coverage comment ("same calc as
// TranslationQA.tsx, reused rather than re-derived so the two screens can
// never disagree"). This demo is deliberately English-only (no i18n
// system behind any of it -- see Onboarding.tsx's own header comment);
// these percentages are an honest illustrative stand-in for what the real
// platform's actual per-language coverage looks like, not a measurement
// of content that exists here.
export const TRANSLATION_COVERAGE: Record<string, number> = {
  English: 100,
  isiZulu: 94,
  Yoruba: 91,
  Swahili: 96,
  Hausa: 88,
  Afrikaans: 97,
};

// ---------------------------------------------------------------------------
// Soul Gap 5-axis (nav/cosmetic audit, deferred bucket item 3) -- the real
// lib/soul-gap engine's own five anchored axes (anchors.ts), replacing the
// old single magnitude+headline stub this demo's CampaignDetail Soul Gap
// tab still showed. Scoped to Sondela Cover only, same real distinction
// data/demo.ts's own top comment already draws: Sondela is "the one fully
// detailed, real-numbers campaign" with its own Cultural Read/Evidence
// pair; Kasi Brew/Tholulwazi Data stay summary-level only (SONDELA.soulGap's
// existing magnitude/headline shape is untouched -- still what AgencyCommand's
// snapshot panel and AgencyInsights.tsx's Soul Gap Snapshot both read; this
// is a genuinely separate, additive field, not a replacement).
//
// Levels are illustrative but plausible (this project's standing rule for
// invented campaign data), grounded in Sondela's own real headline
// ("the campaign speaks to an individual; the audience is thinking about
// everyone who'll be in the room") -- Aspiration Match and Representation
// show the widest brand-overclaims-reality gaps, matching that story.
// Heritage Connection's positioning read is deliberately level 1 --
// demonstrates the real flag system (deriveSoulGapFlags in the real app
// fires independently of the composite whenever a positioning read is
// level 1, exactly the "brand's own material treats sacred/restricted
// content decoratively" case lib/soul-gap/flags.ts documents).
//
// Two of the five reality quotes below reuse SONDELA's own real, existing
// evidence entries (ritual/pulse dimensions) rather than inventing new
// ones where an established quote already fits the axis -- Community
// Belonging and Aspiration Match respectively.
export type SoulGapAxisKey = "authenticity" | "representation" | "heritageConnection" | "aspirationMatch" | "communityBelonging";

export const SOUL_GAP_AXIS_META: Record<SoulGapAxisKey, { name: string; description: string }> = {
  authenticity: {
    name: "Authenticity",
    description: "Whether the cultural reference feels genuinely sourced, or borrowed wholesale with nothing real behind it.",
  },
  representation: {
    name: "Representation",
    description: "Depicts people and communities with real specificity, or falls back on flattened, stereotyped shorthand.",
  },
  heritageConnection: {
    name: "Heritage Connection",
    description: "Engages the actual lineage — history, practice, meaning — behind a cultural reference, or just its surface signifiers.",
  },
  aspirationMatch: {
    name: "Aspiration Match",
    description: "Matches what the audience actually aspires to, or imports an aspiration from somewhere else.",
  },
  communityBelonging: {
    name: "Community Belonging",
    description: "Reads as made by or with the community, or observed and rendered from outside it.",
  },
};

interface SoulGapAxisRead {
  positioningLevel: 1 | 2 | 3 | 4 | 5;
  realityLevel: 1 | 2 | 3 | 4 | 5;
  positioningEvidence: { verbatim: string; languageLabel: string; gloss?: string };
  realityEvidence: { verbatim: string; languageLabel: string; gloss?: string };
}

export const SONDELA_SOUL_GAP_READS: Record<SoulGapAxisKey, SoulGapAxisRead> = {
  authenticity: {
    positioningLevel: 4,
    realityLevel: 3,
    positioningEvidence: { verbatim: "Real cover for real families — because life doesn't wait.", languageLabel: "English" },
    realityEvidence: {
      verbatim: "Ikhava iyasebenza kahle, kodwa akuyona into esiyikhulumayo njalo emphakathini.",
      languageLabel: "isiZulu",
      gloss: "The cover works fine, but it's not something we openly talk about in the community.",
    },
  },
  representation: {
    positioningLevel: 4,
    realityLevel: 1,
    positioningEvidence: { verbatim: "Built for the modern South African family, wherever you call home.", languageLabel: "English" },
    realityEvidence: {
      verbatim: "Umndeni abawukhombisayo awufani nathi — thina sihlala nezizukulwane ezintathu ndlini nye.",
      languageLabel: "isiZulu",
      gloss: "The family they show isn't like ours — we live three generations under one roof.",
    },
  },
  heritageConnection: {
    positioningLevel: 1,
    realityLevel: 2,
    positioningEvidence: { verbatim: "Peace of mind, today.", languageLabel: "English" },
    realityEvidence: {
      verbatim: "Bathi ipholisi, kodwa abakaze bakhulume ngendlela esenza ngayo izilo zomngcwabo.",
      languageLabel: "isiZulu",
      gloss: "They call it a policy, but they've never spoken to how we actually do funeral rites.",
    },
  },
  aspirationMatch: {
    positioningLevel: 4,
    realityLevel: 1,
    positioningEvidence: { verbatim: "Financial freedom starts with the right cover.", languageLabel: "English" },
    // Reused verbatim from SONDELA.evidence.pulse -- same real quote, same
    // contributor/city, genuinely the closest fit for this axis.
    realityEvidence: { verbatim: "Everyone's talking about their stokvel right now, not their policy number.", languageLabel: "English" },
  },
  communityBelonging: {
    positioningLevel: 4,
    realityLevel: 2,
    positioningEvidence: { verbatim: "Millions of families already trust us.", languageLabel: "English" },
    // Reused verbatim from SONDELA.evidence.ritual -- same real quote, same
    // contributor/city.
    realityEvidence: {
      verbatim: "Ukufa akusiyo into oyenza wedwa. Umuntu ufihlwa yikhaya lonke.",
      languageLabel: "isiZulu",
      gloss: "Dying isn't a solo thing. A person is buried by the whole household.",
    },
  },
};

export const SOUL_GAP_AXIS_ORDER: SoulGapAxisKey[] = ["authenticity", "representation", "heritageConnection", "aspirationMatch", "communityBelonging"];

// levelToPercent: identical formula to the real app's own soulGapLevelToPercent
// (pages/agency/CampaignDetail.tsx) -- ((level-1)/4)*100, so level 1..5 maps
// to 0/25/50/75/100, the 0-100 scale PositioningRealityBars needs.
export const soulGapLevelToPercent = (level: number) => Math.round(((level - 1) / 4) * 100);

export interface SoulGapFlag {
  axis: SoulGapAxisKey;
  source: "positioning" | "reality";
  severity: "critical" | "severe";
  reason: string;
}

/** Same derivation the real lib/soul-gap/flags.ts uses -- heritageConnection
 *  level 1 on either side, independent of the composite. */
export function deriveSoulGapFlags(reads: Record<SoulGapAxisKey, SoulGapAxisRead>): SoulGapFlag[] {
  const flags: SoulGapFlag[] = [];
  const hc = reads.heritageConnection;
  if (hc.positioningLevel === 1) {
    flags.push({
      axis: "heritageConnection",
      source: "positioning",
      severity: "critical",
      reason:
        "Heritage Connection scored at level 1 on the positioning read: the brand's own material treats sacred or restricted content decoratively. Directly verifiable against the brand artifact, raised at full severity regardless of reality sample size.",
    });
  }
  if (hc.realityLevel === 1) {
    flags.push({
      axis: "heritageConnection",
      source: "reality",
      severity: "severe",
      reason: "Heritage Connection scored at level 1 on the reality read: contributor evidence indicates the work reads as extractive of sacred or restricted material.",
    });
  }
  return flags;
}

export function soulGapComposite(reads: Record<SoulGapAxisKey, SoulGapAxisRead>): number {
  const deltas = SOUL_GAP_AXIS_ORDER.map((key) => reads[key].positioningLevel - reads[key].realityLevel);
  return Math.round((deltas.reduce((sum, d) => sum + d, 0) / deltas.length) * 10) / 10;
}

// ---------------------------------------------------------------------------
// Agency Field Operations (nav/cosmetic audit, deferred bucket item 4) --
// AgencyFieldwork.tsx/CreateFieldCampaign.tsx/FieldworkAnalytics.tsx all
// confirmed missing entirely. Scoped to this demo's two real field-eligible
// campaigns (SONDELA's own "Digital + Field Hybrid", THOLULWAZI_DATA's own
// "Field Only" -- Kasi Brew is Digital Only, never field-eligible). Zones
// and agents are invented but plausible, grounded in each campaign's own
// real `cities` array rather than new invented geography. Thabo M. is
// reused verbatim from FIELD_WORKER (SupervisorReview.tsx/FieldCapture.tsx's
// own real narrative continuity) -- same person, not a coincidence.
// ---------------------------------------------------------------------------

export type FieldAgentExperience = "novice" | "intermediate" | "expert";
export type FieldAssignmentStatus = "invited" | "accepted" | "active" | "completed";

export interface FieldAgentRosterEntry {
  id: string;
  name: string;
  city: string;
  experience: FieldAgentExperience;
  languages: string[];
  campaignId: string; // SONDELA.id | THOLULWAZI_DATA.id
  zone: string;
  status: FieldAssignmentStatus;
  todayCount: number;
  totalCount: number;
  target: number;
  qualityScore: number; // 0-100, avg across this agent's own responses
}

export const FIELD_AGENT_ROSTER: FieldAgentRosterEntry[] = [
  {
    id: "fa-thabo",
    name: "Thabo M.",
    city: "Soweto, Johannesburg",
    experience: "intermediate",
    languages: ["isiZulu", "English"],
    campaignId: "sondela-cover",
    zone: "Soweto, Ward 14",
    status: "active",
    todayCount: 4,
    totalCount: 62,
    target: 80,
    qualityScore: 91,
  },
  {
    id: "fa-zanele",
    name: "Zanele K.",
    city: "uMlazi, Durban",
    experience: "expert",
    languages: ["isiZulu", "English"],
    campaignId: "sondela-cover",
    zone: "uMlazi, Ward 3",
    status: "active",
    todayCount: 6,
    totalCount: 74,
    target: 80,
    qualityScore: 96,
  },
  {
    id: "fa-kagiso",
    name: "Kagiso N.",
    city: "Mamelodi, Pretoria",
    experience: "novice",
    languages: ["Sepedi", "English"],
    campaignId: "tholulwazi-data",
    zone: "Mamelodi, Ward 8",
    status: "active",
    todayCount: 2,
    totalCount: 31,
    target: 60,
    qualityScore: 84,
  },
  {
    id: "fa-nomsa",
    name: "Nomsa D.",
    city: "KwaMashu, Durban",
    experience: "intermediate",
    languages: ["isiZulu", "English"],
    campaignId: "tholulwazi-data",
    zone: "KwaMashu, Ward 5",
    status: "invited",
    todayCount: 0,
    totalCount: 0,
    target: 60,
    qualityScore: 0,
  },
];

// Verified, unassigned agents an agency could invite onto a field campaign
// -- the "Find Agents" pool the real AgencyFieldwork.tsx's own Agent
// Assignment tab searches.
export const FIELD_AGENT_POOL = [
  { id: "pool-1", name: "Lindiwe P.", city: "Soweto, Johannesburg", experience: "expert" as FieldAgentExperience, languages: ["isiZulu", "English"] },
  { id: "pool-2", name: "Sipho R.", city: "Khayelitsha, Cape Town", experience: "intermediate" as FieldAgentExperience, languages: ["isiXhosa", "English"] },
  { id: "pool-3", name: "Amahle T.", city: "Mamelodi, Pretoria", experience: "novice" as FieldAgentExperience, languages: ["Sepedi", "English"] },
];

// Daily collection trend + demographic split, per field campaign --
// illustrative but plausible, feeds FieldworkAnalytics.tsx's own chart
// port. 7-day window ending "today" (relative labels, not fixed dates --
// this demo has no real submission timestamps to derive them from).
export const FIELD_DAILY_TREND: Record<string, { day: string; completed: number }[]> = {
  "sondela-cover": [
    { day: "Mon", completed: 14 }, { day: "Tue", completed: 19 }, { day: "Wed", completed: 22 },
    { day: "Thu", completed: 17 }, { day: "Fri", completed: 25 }, { day: "Sat", completed: 21 }, { day: "Sun", completed: 18 },
  ],
  "tholulwazi-data": [
    { day: "Mon", completed: 6 }, { day: "Tue", completed: 8 }, { day: "Wed", completed: 5 },
    { day: "Thu", completed: 9 }, { day: "Fri", completed: 11 }, { day: "Sat", completed: 7 }, { day: "Sun", completed: 4 },
  ],
};

export const FIELD_DEMOGRAPHIC_SPLIT: Record<string, { name: string; value: number }[]> = {
  "sondela-cover": [
    { name: "Women", value: 79 },
    { name: "Men", value: 61 },
  ],
  "tholulwazi-data": [
    { name: "Women", value: 18 },
    { name: "Men", value: 24 },
  ],
};

export interface FieldQualityAlert {
  id: string;
  campaignId: string;
  description: string;
  alertType: string;
  severity: "critical" | "warning";
}

export const FIELD_QUALITY_ALERTS: FieldQualityAlert[] = [
  {
    id: "fqa-1",
    campaignId: "sondela-cover",
    description: "3 responses submitted under 90 seconds apart from the same device.",
    alertType: "suspiciously_fast",
    severity: "warning",
  },
];

// ---------------------------------------------------------------------------
// Admin Fieldwork Controls (nav/cosmetic audit, deferred bucket item 5) --
// AdminOversight.tsx confirmed missing 6 of the real page's 7 tabs
// (agents/campaigns/payments/disputes/areas/promotions -- only alerts
// existed). Illustrative but plausible data for the tabs with no existing
// dataset to reuse; Alerts/Promotions reuse REVIEW_QUEUE/promotionRequests
// (real, already-wired state), not new invented data.
// ---------------------------------------------------------------------------

export interface AgentVerificationEntry {
  id: string;
  name: string;
  city: string;
  experience: FieldAgentExperience;
  submittedDaysAgo: number;
}

export const AGENT_VERIFICATION_QUEUE: AgentVerificationEntry[] = [
  { id: "av-agent-1", name: "Bongiwe S.", city: "Gugulethu, Cape Town", experience: "intermediate", submittedDaysAgo: 2 },
  { id: "av-agent-2", name: "Karabo M.", city: "Katlehong, Ekurhuleni", experience: "novice", submittedDaysAgo: 5 },
];

export interface FieldPaymentEntry {
  id: string;
  agentName: string;
  campaignClient: string;
  amount: number;
  currency: string;
  daysPending: number;
}

// PAYMENT_AGING_DAYS: same 3-day threshold the real AdminFieldwork.tsx
// documents for its own aging queue -- a payment approved longer ago than
// this needs a second look, not left indefinitely in "approved" limbo.
export const PAYMENT_AGING_DAYS = 3;

export const FIELD_PAYMENTS_QUEUE: FieldPaymentEntry[] = [
  { id: "fp-1", agentName: "Thabo M.", campaignClient: "Sondela Cover", amount: 1240, currency: "ZAR", daysPending: 1 },
  { id: "fp-2", agentName: "Zanele K.", campaignClient: "Sondela Cover", amount: 1480, currency: "ZAR", daysPending: 4 },
  { id: "fp-3", agentName: "Kagiso N.", campaignClient: "Tholulwazi Data", amount: 620, currency: "ZAR", daysPending: 6 },
];

export interface PaymentDisputeEntry {
  id: string;
  agentName: string;
  campaignClient: string;
  amount: number;
  currency: string;
  reason: string;
}

export const PAYMENT_DISPUTES_QUEUE: PaymentDisputeEntry[] = [
  {
    id: "pd-1",
    agentName: "Kagiso N.",
    campaignClient: "Tholulwazi Data",
    amount: 180,
    currency: "ZAR",
    reason: "Agent reports 9 completed interviews logged, only 7 counted toward this payment.",
  },
];

// ---------------------------------------------------------------------------
// Translation QA (nav/cosmetic audit, deferred bucket item 6) -- confirmed
// the biggest structural gap between the two apps: the real page audits
// coverage across the real platform's full 16-language i18n system (real
// key/value pairs, a real "Auto-fill via AI" edge function, and a live
// preview that force-renders real landing sections in any language). This
// demo has no i18n system anywhere by design (English-only throughout --
// see Navbar.tsx's own header comment), so none of that has real data
// behind it here. What ports faithfully: the real coverage-matrix grid
// itself (all 16 real languages, real names/flags -- not the 6-language
// ONBOARDING_LANGUAGES subset, which exists for a different, narrower
// purpose) and the same red/yellow/green threshold read. Auto-fill and
// Live Preview are represented as honest, labeled placeholders rather
// than either faked or silently dropped -- see TranslationQA.tsx's own
// header comment for the full reasoning.
// ---------------------------------------------------------------------------

export interface QaLanguage {
  code: string;
  name: string;
  flag: string;
}

// Real names/flags/codes, matching the live platform's own full i18n
// language list exactly (src/i18n/translations.ts) -- not invented.
export const QA_LANGUAGES: QaLanguage[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
  { code: "yo", name: "Yorùbá", flag: "🇳🇬" },
  { code: "ha", name: "Hausa", flag: "🇳🇬" },
  { code: "ig", name: "Igbo", flag: "🇳🇬" },
  { code: "am", name: "አማርኛ", flag: "🇪🇹" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "zu", name: "isiZulu", flag: "🇿🇦" },
  { code: "xh", name: "isiXhosa", flag: "🇿🇦" },
  { code: "af", name: "Afrikaans", flag: "🇿🇦" },
  { code: "st", name: "Sesotho", flag: "🇿🇦" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "wo", name: "Wolof", flag: "🇸🇳" },
  { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
  { code: "tw", name: "Twi", flag: "🇬🇭" },
  { code: "ar", name: "العربية", flag: "🇪🇬" },
];

// Illustrative but plausible -- same standard as TRANSLATION_COVERAGE
// above (which this supersedes for TranslationQA.tsx specifically; that
// smaller map stays as AdminOverview's own quick-glance source, unchanged).
// Total key count (870) is a round illustrative number in the same
// ballpark as the real platform's own i18n key count -- not a literal
// copy of a real production figure.
export const QA_TOTAL_KEYS = 870;
export const QA_COVERAGE_PCT: Record<string, number> = {
  en: 100, sw: 96, yo: 91, ha: 88, ig: 93, am: 82, fr: 100, zu: 94, xh: 90,
  af: 97, st: 85, pt: 100, wo: 79, rw: 84, tw: 81, ar: 76,
};
