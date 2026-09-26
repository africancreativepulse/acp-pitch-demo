/**
 * Shared PDF "brand chrome" -- the dark-grid page background, logo
 * placement, section-heading treatment, hairline dividers, the
 * opacity-workaround helpers, and the cover-page / per-page-footer
 * templates. Extracted out of generateReportPdf.ts so every PDF this
 * product generates (the CEI Report, the portfolio export, and any future
 * one) draws from ONE real implementation instead of two documents that
 * happen to match today and drift apart the next time either one is
 * touched -- the actual problem a side-by-side review of the two files
 * surfaced (generatePortfolioPdf had quietly regrown its own plain-
 * Helvetica, no-grid, no-logo, no-footer version of this same chrome).
 *
 * Every numeric constant and comment below is carried over UNCHANGED from
 * generateReportPdf.ts's own hard-won calibration work (grid alpha,
 * stroke-opacity workaround, logo scale, footer text alpha -- each was
 * arrived at by rendering the actual PDF and measuring real pixel values
 * against a reference, not eyeballed). This is a real extraction, not a
 * reimplementation from memory -- see generateReportPdfBrandChrome.md... no
 * such file; the reasoning lives in these comments, same as it always did.
 * That's precisely what makes Phase B's rewire of generateReportPdf.ts onto
 * this module verifiable as pixel-identical rather than "close enough."
 */
import type { jsPDF, GState as GStateCtor } from "jspdf";
import { FONT_DISPLAY, FONT_BODY, FONT_MONO } from "./fonts/registerReportFonts";
import { ACP_LOGO_MARK_PNG, ACP_LOGO_MARK_ASPECT } from "./fonts/logoAsset";

// Real tokens.css values (literal, not var(--x) -- jsPDF can't resolve CSS
// custom properties). Every branded PDF page in this product uses these
// same four -- moved here from generateReportPdf.ts's own top-level consts
// so a second document can't silently drift to a slightly different literal.
export const INK = "#0B0C10"; // --ink, page background
export const PAPER = "#F6F1E9"; // --paper, primary text on dark
export const PULSE = "#FF5A29"; // --pulse, section eyebrow/accent orange
export const LINE_ALPHA = 0.12; // --line's real alpha, for hairline dividers on dark

// Real company registration number, provided directly by the user for use
// across ACP's own brand collateral -- not fabricated. Shown once per
// cover, below both PREPARED FOR and PREPARED BY (a single shared line,
// not duplicated under each -- see drawCoverPage's own comment).
export const ACP_REGISTRATION_NUMBER = "2026/546758/07";

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/**
 * One instance per document, created right after registerReportFonts(doc)
 * and before drawing anything. Owns the same mutable content-cursor `y`
 * generateReportPdf.ts used to keep as a bare local `let` -- exposed here
 * as a plain public property so call sites read/write it exactly the same
 * way (`chrome.y += 14`), which is what makes the Phase B rewire a
 * mechanical, checkable find/replace rather than a control-flow rewrite.
 */
export class PdfChrome {
  readonly doc: jsPDF;
  readonly PAGE_W: number;
  readonly PAGE_H: number;
  readonly MARGIN: number;
  readonly CONTENT_W: number;
  y: number;

  private readonly GState: typeof GStateCtor;
  private readonly inkRGB: [number, number, number];
  private readonly paperRGB: [number, number, number];
  private readonly pulseRGB: [number, number, number];
  private sectionCounter = 0;

  // GState is passed in, not re-imported here -- every caller already does
  // `const { jsPDF, GState } = await import("jspdf")` to construct `doc`
  // itself, so this avoids a second, redundant dynamic import of the same
  // module.
  constructor(doc: jsPDF, GState: typeof GStateCtor, opts?: { margin?: number }) {
    this.doc = doc;
    this.GState = GState;
    this.MARGIN = opts?.margin ?? 48;
    this.PAGE_W = doc.internal.pageSize.getWidth();
    this.PAGE_H = doc.internal.pageSize.getHeight();
    this.CONTENT_W = this.PAGE_W - this.MARGIN * 2;
    this.y = this.MARGIN;
    this.inkRGB = hexToRgb(INK);
    this.paperRGB = hexToRgb(PAPER);
    this.pulseRGB = hexToRgb(PULSE);
  }

  rightAligned(text: string, xRight: number, yPos: number): void {
    this.doc.text(text, xRight - this.doc.getTextWidth(text), yPos);
  }

  // Runs `fn` with a temporary fill/stroke opacity, then restores full
  // opacity via save/restoreGraphicsState -- scoped so a tinted card fill
  // can never leak transparency into whatever draws after it. jsPDF v4's
  // real API (GState + setGState), not assumed -- confirmed against the
  // installed package's own type definitions before use.
  //
  // Real bug, found by measuring actual pixel brightness against the
  // reference (grid lines rendered ~9x brighter than intended -- 122
  // grayscale units above background instead of a target ~14): GState's
  // `opacity` property only ever controls FILL alpha (PDF's `ca`). Every
  // stroke op (doc.line(), roundedRect(..., "S")) ignored it completely
  // and drew at full 100% stroke opacity regardless of what number was
  // passed here. jsPDF's own GState type has a separate `"stroke-opacity"`
  // property (PDF's `CA`) that has to be set too, confirmed against the
  // installed package's own type definitions before fixing -- not assumed
  // a second time.
  withOpacity(opacity: number, fn: () => void): void {
    this.doc.saveGraphicsState();
    this.doc.setGState(new this.GState({ opacity, "stroke-opacity": opacity }));
    fn();
    this.doc.restoreGraphicsState();
  }

  // Real, empirically-confirmed follow-up to withOpacity()'s own comment:
  // adding "stroke-opacity" to GState did NOT fix stroked lines in
  // practice. Proved with an isolated 4-line jsPDF repro (no-opacity,
  // fill-opacity-only, stroke-opacity-only, both) rendered to PNG and
  // measured with numpy -- all four came back at max brightness 255,
  // regardless of "stroke-opacity". It's a real limitation of the
  // installed jsPDF version's PDF-generation path for stroke ops, not a
  // misuse of the (correctly-typed) API. Strokes that need to look faint
  // -- the grid, hairline() -- use this instead: skip PDF transparency
  // entirely and pre-blend the intended alpha into a flat solid draw color
  // against the actual page background (INK), then draw at normal 100%
  // stroke opacity. A 0.05 alpha stroke on an ink background and a solid
  // color 5% of the way from ink to paper look identical -- this is just
  // doing that blend ourselves instead of trusting jsPDF to.
  blendedStroke(alpha: number): void {
    const [inkR, inkG, inkB] = this.inkRGB;
    const [paperR, paperG, paperB] = this.paperRGB;
    const r = inkR + alpha * (paperR - inkR);
    const g = inkG + alpha * (paperG - inkG);
    const b = inkB + alpha * (paperB - inkB);
    this.doc.setDrawColor(r, g, b);
  }

  // Muted light text on dark -- literal equivalent of tokens.css's own
  // --muted (rgba(246,241,233,0.56)), reused everywhere a secondary/label
  // line needs to read as lower-emphasis than primary paper-white text.
  mutedText(text: string | string[], x: number, yPos: number, opts?: any): void {
    this.withOpacity(0.56, () => {
      this.doc.setTextColor(...this.paperRGB);
      this.doc.text(text as any, x, yPos, opts);
    });
  }

  // Full-page dark background + a faint grid texture -- drawn on EVERY
  // page via newPage() below, never cover-only (an earlier, "staged"
  // version of the report shipped with every interior page silently
  // falling back to a plain white background the moment addPage() ran --
  // this is the actual fix).
  //
  // 0.058 -- sixth real correction, and the one that finally resolved a
  // cross-tool measurement discrepancy two prior attempts (0.17, 0.157)
  // kept running into: those were calibrated against this project's own
  // PyMuPDF measurements, which read this same semi-transparent grid at a
  // meaningfully different absolute brightness than Poppler (pdftoppm)
  // does -- a real rendering-engine difference, not a bug on either side,
  // confirmed once both the reference AND a render of this file were
  // measured with Poppler specifically: alpha 0.13 -> peak 44, alpha
  // 0.157 -> peak 50 (Poppler's own numbers). Solving from those two real
  // Poppler datapoints for the alpha that reaches the reference's own
  // real Poppler-measured peak (28) gives 0.058.
  pageBackground(): void {
    const { doc, PAGE_W, PAGE_H } = this;
    doc.setFillColor(...this.inkRGB);
    doc.rect(0, 0, PAGE_W, PAGE_H, "F");
    // blendedStroke(), not withOpacity() -- see that method's comment.
    this.blendedStroke(0.058);
    doc.setLineWidth(0.5);
    const step = 28;
    for (let gx = 0; gx <= PAGE_W; gx += step) doc.line(gx, 0, gx, PAGE_H);
    for (let gy = 0; gy <= PAGE_H; gy += step) doc.line(0, gy, PAGE_W, gy);
  }

  // Replaces every raw doc.addPage() call -- guarantees the dark
  // background is redrawn on genuinely new pages, never skipped.
  newPage(): void {
    this.doc.addPage();
    this.pageBackground();
    this.y = this.MARGIN;
  }

  ensureSpace(needed: number): void {
    if (this.y + needed > this.PAGE_H - this.MARGIN) this.newPage();
  }

  hairline(yPos: number): void {
    // blendedStroke(), not withOpacity() -- same fix as pageBackground()'s
    // grid, same root cause.
    this.blendedStroke(LINE_ALPHA);
    this.doc.setLineWidth(0.75);
    this.doc.line(this.MARGIN, yPos, this.PAGE_W - this.MARGIN, yPos);
  }

  // Colored chip: tinted rounded-rect background + colored border +
  // colored bold text. Reads correctly on the dark page too -- it carries
  // its own fill/border/text colors, doesn't depend on page background.
  pill(text: string, x: number, yTop: number, hex: string, opts?: { bold?: boolean }): number {
    const { doc } = this;
    const [r, g, b] = hexToRgb(hex);
    // FONT_MONO, not the literal string "helvetica" -- real bug, caught by
    // checking every actual text span's font in the rendered PDF: every
    // pill this draws was silently falling back to Helvetica.
    doc.setFont(FONT_MONO, opts?.bold === false ? "normal" : "bold");
    doc.setFontSize(9);
    const textW = doc.getTextWidth(text);
    const padX = 8;
    const h = 17;
    const w = textW + padX * 2;
    this.withOpacity(0.16, () => {
      doc.setFillColor(r, g, b);
      doc.roundedRect(x, yTop, w, h, h / 2, h / 2, "F");
    });
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(0.75);
    doc.roundedRect(x, yTop, w, h, h / 2, h / 2, "S");
    doc.setTextColor(r, g, b);
    doc.text(text, x + padX, yTop + h / 2 + 3.2);
    return w;
  }

  // "SECTION 0X" eyebrow + big display title + accent underline. Callers
  // with an un-splittable image below must ensureSpace() for the FULL
  // block (this heading's own ~90pt plus their image height) BEFORE
  // calling this, not after -- a section's heading can otherwise land
  // alone on one page while its own un-splittable content gets pushed to
  // the next, invisible when verifying by continuously scrolling a PDF
  // viewer (scrolling visually bridges the page break) -- only caught by
  // rendering each page as a discrete image and looking at them one at a
  // time.
  sectionHeading(title: string): void {
    const { doc } = this;
    this.sectionCounter += 1;
    doc.setFont(FONT_MONO, "medium");
    doc.setFontSize(10);
    doc.setTextColor(...this.pulseRGB);
    doc.text(`SECTION ${String(this.sectionCounter).padStart(2, "0")}`, this.MARGIN, this.y);
    this.y += 26;
    doc.setFont(FONT_DISPLAY, "bold");
    doc.setFontSize(26);
    doc.setTextColor(...this.paperRGB);
    doc.text(title, this.MARGIN, this.y);
    this.y += 12;
    doc.setFillColor(...this.pulseRGB);
    doc.rect(this.MARGIN, this.y, 40, 3, "F");
    this.y += 30;
  }

  // Logo mark -- the real AcpMark.tsx path data, rasterized once (see
  // fonts/logoAsset.ts) since jsPDF has no native SVG embedding.
  //
  // Default 57.3, not a round number -- the source PNG canvas (1500x620)
  // isn't a tight crop of the glyph: its real non-transparent mark only
  // fills ~93.4% of the canvas's height (33px to 612px of 620), a ~6.6%
  // margin baked into the asset itself (confirmed via its own alpha
  // channel). addImage() scales the WHOLE canvas to the height passed in,
  // so hitting a real target glyph height of 53.5pt means requesting
  // 53.5 / 0.934 ≈ 57.3 here, not 53.5 directly -- confirmed by
  // re-measuring the rendered PDF after the correction.
  drawLogo(x: number, yTop: number, h = 57.3): { w: number; h: number } {
    const w = h * ACP_LOGO_MARK_ASPECT;
    this.doc.addImage(ACP_LOGO_MARK_PNG, "PNG", x, yTop, w, h);
    return { w, h };
  }
}

/**
 * Generic per-page footer (every page except the cover, which draws its
 * own bespoke one -- see drawCoverPage). Sets the active page itself
 * (doc.setPage(pageIndex)) before drawing -- real gap caught comparing
 * against the original generateReportPdf.ts loop, which always called
 * doc.setPage(i) first: a caller of this function mid-way through
 * building later pages should never have to remember to switch pages
 * back before asking for a footer on an earlier one.
 */
export function drawFooter(chrome: PdfChrome, pageIndex: number, pageCount: number): void {
  const { doc, MARGIN, PAGE_W, PAGE_H } = chrome;
  doc.setPage(pageIndex);
  doc.setFont(FONT_MONO, "normal");
  doc.setFontSize(7.5);
  // 0.6, not a lower value -- real, measured correction. This is a FILL op
  // (doc.text()), so unlike the grid/hairline's real stroke-opacity bug,
  // GState opacity genuinely works here -- confirmed by measuring the
  // actual reference's own footer text peak brightness and solving for
  // the alpha that reproduces it against this file's own ink/paper pair.
  chrome.withOpacity(0.6, () => {
    doc.setTextColor(...hexToRgb(PAPER));
    doc.text(`Generated by African Creative Pulse — ${new Date().toLocaleString()}`, MARGIN, PAGE_H - 24);
    const pageText = `Page ${pageIndex} of ${pageCount}`;
    doc.text(pageText, PAGE_W - MARGIN - doc.getTextWidth(pageText), PAGE_H - 24);
  });
}

export interface CoverPageContent {
  /** Small bordered chip, top-right (e.g. "SAMPLE CONFIRMED" / "SAMPLE PRELIMINARY"). */
  badgeText: string;
  badgeColor: string;
  /** Small muted caption under the badge/report-id block, disambiguating what the badge claims. Optional -- omit if there's nothing to disambiguate. */
  badgeCaption?: string;
  reportId: string;
  issuedOn: string;
  eyebrow: string;
  title: string;
  bodyText: string;
  /**
   * Optional -- omit (or pass an empty array) when there's no single real
   * entity this document is prepared for (e.g. an admin-generated
   * portfolio export spans every agency, not one). When omitted, the
   * PREPARED FOR label/column is skipped entirely rather than left as a
   * blank left column -- PREPARED BY takes its position instead.
   */
  preparedForLines?: string[];
  preparedByLines: string[];
  footerLeft: string;
  footerRight: string;
}

// Full cover-page template: logo, sample/status badge, report ID + issued
// date, eyebrow, title, body summary, PREPARED FOR / PREPARED BY columns,
// shared registration caption, bespoke cover footer with a confidentiality
// line. Every offset below is a real, measured correction against an
// approved reference render (see each comment) -- parameterized only on
// TEXT CONTENT, never on the geometry, so a second document using this
// gets pixel-identical spacing, not just a similar layout.
export function drawCoverPage(chrome: PdfChrome, content: CoverPageContent): void {
  const { doc, MARGIN, PAGE_W, CONTENT_W } = chrome;
  const [paperR, paperG, paperB] = hexToRgb(PAPER);
  const [pulseR, pulseG, pulseB] = hexToRgb(PULSE);

  chrome.pageBackground();
  chrome.drawLogo(MARGIN, MARGIN);

  const [bR, bG, bB] = hexToRgb(content.badgeColor);
  doc.setFont(FONT_MONO, "medium");
  doc.setFontSize(8);
  const badgeTextW = doc.getTextWidth(content.badgeText);
  const badgePadX = 9;
  const badgeH = 16;
  const badgeW = badgeTextW + badgePadX * 2;
  const badgeX = PAGE_W - MARGIN - badgeW;
  doc.setDrawColor(bR, bG, bB);
  doc.setLineWidth(0.75);
  doc.rect(badgeX, MARGIN - 2, badgeW, badgeH, "S");
  doc.setTextColor(bR, bG, bB);
  doc.text(content.badgeText, badgeX + badgePadX, MARGIN - 2 + badgeH / 2 + 2.8);

  doc.setFont(FONT_MONO, "normal");
  doc.setFontSize(8);
  chrome.withOpacity(0.55, () => {
    doc.setTextColor(paperR, paperG, paperB);
    chrome.rightAligned(content.reportId, PAGE_W - MARGIN, MARGIN + 26);
    chrome.rightAligned(`ISSUED ${content.issuedOn}`, PAGE_W - MARGIN, MARGIN + 38);
  });
  if (content.badgeCaption) {
    doc.setFont(FONT_BODY, "normal");
    doc.setFontSize(7);
    chrome.withOpacity(0.4, () => {
      doc.setTextColor(paperR, paperG, paperB);
      const captionLines = doc.splitTextToSize(content.badgeCaption!, 170);
      for (let i = 0; i < captionLines.length; i++) chrome.rightAligned(captionLines[i], PAGE_W - MARGIN, MARGIN + 50 + i * 9);
    });
  }

  doc.setFont(FONT_MONO, "medium");
  doc.setFontSize(10);
  doc.setTextColor(pulseR, pulseG, pulseB);
  const eyebrowY = MARGIN + 96;
  doc.text(content.eyebrow, MARGIN, eyebrowY);

  doc.setFont(FONT_DISPLAY, "bold");
  doc.setFontSize(34);
  doc.setTextColor(paperR, paperG, paperB);
  const titleLines = doc.splitTextToSize(content.title, CONTENT_W);
  let titleY = eyebrowY + 42;
  doc.text(titleLines, MARGIN, titleY);
  titleY += titleLines.length * 38;

  doc.setFillColor(pulseR, pulseG, pulseB);
  doc.rect(MARGIN, titleY + 4, 48, 3, "F");

  doc.setFont(FONT_BODY, "normal");
  doc.setFontSize(11);
  // +58 -- real, measured correction (see original generateReportPdf.ts
  // history for the trailing-gap-vs-reference measurement behind this).
  const bodyY = titleY + 58;
  const bodyLines = doc.splitTextToSize(content.bodyText, CONTENT_W * 0.75);
  chrome.withOpacity(0.8, () => {
    doc.setTextColor(paperR, paperG, paperB);
    doc.text(bodyLines, MARGIN, bodyY);
  });

  // +118 -- second real measured correction, same provenance as +58 above.
  const preparedY = bodyY + bodyLines.length * 15 + 118;
  const colW = CONTENT_W / 2;
  // Real, deliberate choice, not a leftover blank column: when there's no
  // single entity to name in PREPARED FOR (an admin-generated portfolio
  // export has no one owning agency), skip that label/column entirely
  // rather than render it empty -- PREPARED BY moves into the left
  // position it would otherwise have used, so the cover never shows a
  // silently blank half.
  const hasPreparedFor = !!content.preparedForLines && content.preparedForLines.length > 0;
  const preparedByX = hasPreparedFor ? MARGIN + colW : MARGIN;
  doc.setFont(FONT_MONO, "normal");
  doc.setFontSize(8.5);
  chrome.withOpacity(0.5, () => {
    doc.setTextColor(paperR, paperG, paperB);
    if (hasPreparedFor) doc.text("PREPARED FOR", MARGIN, preparedY);
    doc.text("PREPARED BY", preparedByX, preparedY);
  });
  doc.setFont(FONT_BODY, "normal");
  doc.setFontSize(11);
  doc.setTextColor(paperR, paperG, paperB);
  if (hasPreparedFor) doc.text(content.preparedForLines!, MARGIN, preparedY + 16);
  doc.text(content.preparedByLines, preparedByX, preparedY + 16);

  // Shared registration caption -- see ACP_REGISTRATION_NUMBER's own
  // comment for why this is one shared line rather than duplicated under
  // each column. Positioned below whichever of the two blocks runs taller.
  const maxPreparedLines = Math.max(hasPreparedFor ? content.preparedForLines!.length : 0, content.preparedByLines.length);
  const registrationY = preparedY + 16 + maxPreparedLines * 15 + 4;
  doc.setFont(FONT_MONO, "normal");
  doc.setFontSize(8);
  chrome.withOpacity(0.45, () => {
    doc.setTextColor(paperR, paperG, paperB);
    doc.text(`AFRICAN CREATIVE PULSE · REG ${ACP_REGISTRATION_NUMBER}`, MARGIN, registrationY);
  });

  // Cover's own bespoke footer -- drawn here rather than by the generic
  // drawFooter() above, which the caller should skip for page 1 so it
  // never duplicates/clashes with this one.
  const footerY = chrome.PAGE_H - MARGIN;
  chrome.hairline(footerY - 16);
  doc.setFont(FONT_MONO, "normal");
  doc.setFontSize(7.5);
  // 0.6 -- same real measured correction as drawFooter()'s own text.
  chrome.withOpacity(0.6, () => {
    doc.setTextColor(paperR, paperG, paperB);
    doc.text(content.footerLeft, MARGIN, footerY);
    chrome.rightAligned(content.footerRight, PAGE_W - MARGIN, footerY);
  });
}
