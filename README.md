# ACP Pitch Demo

A clickable prototype for an investor/partner pitch meeting. **Not** the
real ACP application — this is a standalone, from-scratch build that
matches ACP's visual language (exact color tokens, the SignalRing motif,
the CEI/CDI/Soul Gap vocabulary) without forking or referencing the real
app's code at all. See the "lift the skin, not the skeleton" note in the
original brief if you're wondering why this exists as its own repo.

## Stack

React + TypeScript + Vite + Tailwind CSS. Client-side only — no backend,
no Supabase, no API calls of any kind. Every piece of data lives in
`src/data/demo.ts`, hardcoded.

## Running it

```
npm install
npm run dev
```

Builds clean for Vercel with `npm run build` (a `vercel.json` rewrite is
included so client-side routes don't 404 on refresh/direct link).

## What's real vs. invented

- **Sondela Cover** is the one fully-detailed campaign — every number
  (CEI dimension scores, CDI, Decay, verified response count, the Soul
  Gap headline) comes directly from the brief, used verbatim. This is the
  case study the demo is built to walk through in depth.
- **Four evidence quotes are real, verbatim from the brief** — the
  Ritual dimension's quote/photo/audio evidence, plus the Language and
  Taste dimensions' quotes, plus the standalone Soul Gap panel's quote.
  (The Language, Taste, and Soul Gap quotes were cut off in transmission
  in the original brief and arrived separately after the initial build;
  they replaced placeholder content once received.) The Soul Gap quote
  came without a capture date — rather than inventing one, the evidence
  card shows an honest "Date pending" label instead.
- **Visual, Sound, and Pulse's evidence quotes are invented**, written
  for this prototype since the brief never specified real ones for those
  three dimensions — kept as clearly-labeled illustrative content by the
  client's own choice, not a gap to fix.
- **Kasi Brew** and **Tholulwazi Data** are two secondary portfolio
  campaigns with invented-but-plausible numbers, included so the Agency
  Command screen reads as a real, returning-usage product rather than a
  single card in an empty room. They don't get their own Cultural
  Read / Evidence screens — clicking them opens a lighter "Campaign
  Snapshot" panel instead, which is honest about the scope rather than
  faking a second full traceability story.

## Screens

Splash → Agency Command (Screen 1) → Campaign Builder (Screen 2, a real
3-step wizard that adds a live "Collecting" card back on Screen 1) →
The Cultural Read (Screen 3, the SignalRing hero) → The Evidence
(Screen 4, tap any ring node or the Soul Gap panel's link to get here) →
Contributor Capture (Screen 5, phone-frame mockup, fully clickable
record/photo/submit flow with a "Reward paid" confirmation).

Every screen connects — there's no dead end anywhere in the navigation
graph, including invalid URLs (both redirect cleanly rather than
blanking out).
