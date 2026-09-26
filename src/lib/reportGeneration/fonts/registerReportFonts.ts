/**
 * Registers the real, embedded brand fonts (see embeddedFonts.ts for
 * provenance) on a jsPDF document instance. Call once per document, before
 * any doc.setFont(FONT_*, ...) call.
 *
 * Family/style keys are arbitrary strings jsPDF just uses as a lookup --
 * confirmed against its own type definitions (`fontStyle: string`, no
 * restricted union) -- so "semibold"/"medium" are as valid as "bold" so
 * long as the same string is used consistently at setFont() time.
 */
import type { jsPDF } from "jspdf";
import {
  SpaceGroteskBold,
  SpaceGroteskSemiBold,
  InterRegular,
  InterSemiBold,
  JetBrainsMonoRegular,
  JetBrainsMonoMedium,
  JetBrainsMonoBold,
} from "./embeddedFonts";

export const FONT_DISPLAY = "SpaceGrotesk";
export const FONT_BODY = "Inter";
export const FONT_MONO = "JetBrainsMono";

export function registerReportFonts(doc: jsPDF): void {
  doc.addFileToVFS("SpaceGrotesk-Bold.ttf", SpaceGroteskBold);
  doc.addFont("SpaceGrotesk-Bold.ttf", FONT_DISPLAY, "bold");
  doc.addFileToVFS("SpaceGrotesk-SemiBold.ttf", SpaceGroteskSemiBold);
  doc.addFont("SpaceGrotesk-SemiBold.ttf", FONT_DISPLAY, "semibold");

  doc.addFileToVFS("Inter-Regular.ttf", InterRegular);
  doc.addFont("Inter-Regular.ttf", FONT_BODY, "normal");
  doc.addFileToVFS("Inter-SemiBold.ttf", InterSemiBold);
  doc.addFont("Inter-SemiBold.ttf", FONT_BODY, "semibold");

  doc.addFileToVFS("JetBrainsMono-Regular.ttf", JetBrainsMonoRegular);
  doc.addFont("JetBrainsMono-Regular.ttf", FONT_MONO, "normal");
  doc.addFileToVFS("JetBrainsMono-Medium.ttf", JetBrainsMonoMedium);
  doc.addFont("JetBrainsMono-Medium.ttf", FONT_MONO, "medium");
  // Real bug found by inspecting every doc.setFont() call site in
  // generateReportPdf.ts: doc.setFont(FONT_MONO, "bold") is used all over
  // the report (every big stat number, every evidence citation label) but
  // "bold" was never registered for this family -- only "normal"/"medium"
  // above. Confirmed via an isolated jsPDF repro: calling setFont() for an
  // unregistered style doesn't error, it silently substitutes jsPDF's
  // built-in Times-Bold, which is exactly the stray serif numerals spotted
  // in the actual rendered report (this is almost certainly what "the
  // fonts are all wrong" was pointing at). Same real family/weight as the
  // other two JetBrains Mono weights above -- sourced from
  // @fontsource/jetbrains-mono's -latin-700-normal.woff2, decompressed to
  // TTF with wawoff2, not a different font standing in for it.
  doc.addFileToVFS("JetBrainsMono-Bold.ttf", JetBrainsMonoBold);
  doc.addFont("JetBrainsMono-Bold.ttf", FONT_MONO, "bold");
}
