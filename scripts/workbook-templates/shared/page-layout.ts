/**
 * Shared workbook page layout constants and helpers.
 * A4 page with 3mm bleed, CAPS-aligned South African workbook.
 *
 * Reference: SA_Workbook_Design_Guide.pdf (v1.0, Feb 2026)
 * - 5 template types: Activity, Coloring, Writing Practice, Matching/Connect, Sequencing
 * - Print: A4 (210x297mm), 3mm bleed, 5mm safe zone, 20mm binding margin, 300 DPI, CMYK, PDF/X-1a
 * - Typography: KG Primary Dots (tracing 40-48pt), Sassoon Primary (body 18-24pt), Arial Rounded (headings 30-40pt)
 * - Layout: max 2 activities/page, 30% white space, 15mm min margins (20mm binding), portrait
 * - Elements: writing lines 12mm height (solid baseline + dashed midline), tracing guides 30% gray 3pt stroke
 * - Universal: name field (top-right), page # (bottom-center 14pt), logo (bottom-left 15mm), activity icon (top-left),
 *   QR zone (bottom-right 20x20mm), reward element, Ubuntu moment
 */

/** A4 dimensions in PDF points (1 point = 1/72 inch) */
export const PAGE = {
  /** A4 width in points */
  width: 595.28,
  /** A4 height in points */
  height: 841.89,
  /** Bleed margin (3mm = ~8.5pt) */
  bleed: 8.5,
  /** Safe zone inside trim (5mm = ~14.2pt) */
  safeZone: 14.2,
  /** Safe margin from trim edge (15mm = ~42.5pt) */
  margin: 42.5,
  /** Binding margin for spine side (20mm = ~56.7pt) */
  bindingMargin: 56.7,
  /** Inner content area width */
  get contentWidth() {
    return this.width - this.margin - this.bindingMargin;
  },
  /** Inner content area height */
  get contentHeight() {
    return this.height - this.margin * 2;
  },
} as const;

/** NovaLearning brand colors (CMYK-safe equivalents) */
export const BRAND = {
  earth: '#5D4037',       // Nova Earth (warm brown)
  sun: '#FFB300',         // Nova Sun (amber)
  sky: '#42A5F5',         // Nova Sky (blue)
  green: '#4CAF50',       // Success green
  sand: '#FFF8E1',        // Nova Sand (cream bg)
  white: '#FFFFFF',
  black: '#333333',
  lightGrey: '#E0E0E0',
  // Character colors
  siphoOrange: '#FF6D00',
  thandiBlue: '#1565C0',
  leratoGreen: '#2E7D32',
  pieterYellow: '#F57F17',
  fatimaPurple: '#6A1B9A',
  amahleRed: '#D84315',
  // SA Flag colors (for national identity pages)
  saGreen: '#007749',
  saGold: '#FFB81C',
  saBlack: '#000000',
  saRed: '#DE3831',
  saBlue: '#002395',
  saWhite: '#FFFFFF',
} as const;

/**
 * Font sizes in points.
 *
 * Design Guide recommended fonts (for Canva templates):
 * - KG Primary Dots: Letter/number tracing (40-48pt)
 * - Sassoon Primary: Body text, adult instructions (18-24pt)
 * - Comic Sans MS: Alternative body text (18-24pt)
 * - Arial Rounded: Headings, activity titles (30-40pt)
 *
 * pdfkit uses Helvetica by default. Canva templates will use the proper fonts above.
 */
export const FONTS = {
  pageNumber: 14,         // Design guide: 14pt minimum for page numbers
  caption: 10,
  body: 18,               // Design guide: 18-24pt body text (Sassoon Primary)
  instruction: 20,
  subtitle: 24,
  title: 30,              // Design guide: 30-40pt headings (Arial Rounded)
  gameTitle: 36,
  tracing: 44,            // Design guide: 40-48pt tracing exercises (KG Primary Dots)
} as const;

/** Activity area specifications from SA Workbook Design Guide */
export const ACTIVITY_SPECS = {
  /** Writing line height for Grade R (solid baseline + dashed midline) */
  writingLineHeight: 34,  // 12mm = ~34pt
  /** Tracing guide stroke width */
  tracingStroke: 3,       // 3pt stroke
  /** Tracing guide opacity (30% gray) */
  tracingOpacity: 0.3,
  /** Coloring area outline width */
  coloringOutline: 2,     // 2pt black outline
  /** Minimum enclosed coloring area (20mm = ~56.7pt) */
  coloringMinArea: 56.7,
  /** Cutting line dash pattern */
  cuttingDash: [4, 3],    // 2pt dashed
  /** Matching dot target diameter (8mm = ~22.7pt) */
  matchingDotSize: 22.7,
  /** Minimum touch/interaction target (15x15mm = ~42.5pt) */
  minTouchTarget: 42.5,
  /** Background tint opacity for section differentiation */
  bgTintOpacity: 0.12,    // 10-15% opacity
} as const;

/** QR code dimensions and placement (Design Guide: 20x20mm bottom-right) */
export const QR = {
  /** QR code size on page (20mm = ~56.7pt per design guide) */
  size: 56.7,
  /** Padding around QR code */
  padding: 8,
  /** Default position: bottom-right corner */
  get defaultX() {
    return PAGE.width - PAGE.margin - this.size;
  },
  get defaultY() {
    return PAGE.height - PAGE.margin - this.size - 24; // above page number
  },
} as const;

/** Draw a page number at the bottom center */
export function drawPageNumber(doc: PDFKit.PDFDocument, pageNum: number) {
  doc
    .fontSize(FONTS.pageNumber)
    .fillColor(BRAND.earth)
    .text(`${pageNum}`, 0, PAGE.height - PAGE.margin + 10, {
      width: PAGE.width,
      align: 'center',
    });
}

/** Draw the NovaLearning header bar */
export function drawHeader(
  doc: PDFKit.PDFDocument,
  title: string,
  subtitle?: string,
) {
  const headerY = PAGE.margin;

  // Title
  doc
    .fontSize(FONTS.title)
    .fillColor(BRAND.earth)
    .text(title, PAGE.margin, headerY, {
      width: PAGE.contentWidth,
      align: 'center',
    });

  // Subtitle
  if (subtitle) {
    doc
      .fontSize(FONTS.subtitle)
      .fillColor(BRAND.sky)
      .text(subtitle, PAGE.margin, headerY + 32, {
        width: PAGE.contentWidth,
        align: 'center',
      });
  }
}

/** Draw a rounded rectangle */
export function drawRoundedRect(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  fillColor: string,
  strokeColor?: string,
) {
  doc.roundedRect(x, y, w, h, radius);
  if (fillColor) doc.fillColor(fillColor).fill();
  if (strokeColor) {
    doc.roundedRect(x, y, w, h, radius);
    doc.strokeColor(strokeColor).lineWidth(1).stroke();
  }
}

/** Draw a simple Ndebele-inspired border pattern */
export function drawNdebeleBorder(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const colors = [BRAND.siphoOrange, BRAND.thandiBlue, BRAND.leratoGreen, BRAND.sun];
  const segmentWidth = 12;
  const borderWidth = 4;

  // Top border
  for (let i = 0; i < Math.ceil(width / segmentWidth); i++) {
    const color = colors[i % colors.length];
    const sx = x + i * segmentWidth;
    doc.rect(sx, y, segmentWidth, borderWidth).fillColor(color).fill();
  }

  // Bottom border
  for (let i = 0; i < Math.ceil(width / segmentWidth); i++) {
    const color = colors[(i + 2) % colors.length];
    const sx = x + i * segmentWidth;
    doc.rect(sx, y + height - borderWidth, segmentWidth, borderWidth).fillColor(color).fill();
  }

  // Left border
  for (let i = 0; i < Math.ceil(height / segmentWidth); i++) {
    const color = colors[(i + 1) % colors.length];
    const sy = y + i * segmentWidth;
    doc.rect(x, sy, borderWidth, segmentWidth).fillColor(color).fill();
  }

  // Right border
  for (let i = 0; i < Math.ceil(height / segmentWidth); i++) {
    const color = colors[(i + 3) % colors.length];
    const sy = y + i * segmentWidth;
    doc.rect(x + width - borderWidth, sy, borderWidth, segmentWidth).fillColor(color).fill();
  }
}

/** Draw QR code placeholder box with label */
export function drawQrPlaceholder(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  gameTitle: string,
) {
  // QR box outline
  drawRoundedRect(doc, x, y, QR.size, QR.size, 8, BRAND.white, BRAND.lightGrey);

  // QR placeholder text
  doc
    .fontSize(FONTS.caption)
    .fillColor(BRAND.earth)
    .text('QR Code', x, y + QR.size / 2 - 10, {
      width: QR.size,
      align: 'center',
    });

  // Label below
  doc
    .fontSize(FONTS.caption - 1)
    .fillColor(BRAND.sky)
    .text(`Scan to play: ${gameTitle}`, x - 20, y + QR.size + 4, {
      width: QR.size + 40,
      align: 'center',
    });
}
