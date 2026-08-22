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
}

export const KASI_BREW: SecondaryCampaign = {
  id: "kasi-brew",
  client: "Kasi Brew",
  cities: ["Alexandra (Johannesburg)", "Gugulethu (Cape Town)"],
  methodology: "Digital Only",
  verifiedResponses: 210,
  status: "completed",
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
  cei: { visual: 5.5, sound: 6.0, language: 7.8, ritual: 6.2, pulse: 8.3, taste: 5.1 },
  cdi: 5.4,
  decay: 6.2,
  soulGap: {
    magnitude: "Moderate",
    headline:
      "The brand promises connection at the lowest price. The audience already assumes cheap means unreliable — trust has to be earned before price becomes the deciding factor.",
  },
};

export const SONDELA = sondela;

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
