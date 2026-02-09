/**
 * Workbook Page 22: "Trace Letter A with Thandi" letter tracing activity.
 *
 * Layout:
 * - Header: Title + Ndebele border
 * - Large letter A outline with numbered stroke arrows
 * - Tracing practice lines (4 rows of dotted letter A)
 * - Picture matching: items that start with "A"
 * - QR code: links to digital game
 * - Page number
 */

import PDFDocument from 'pdfkit';
import {
  PAGE, BRAND, FONTS, QR,
  drawPageNumber, drawHeader, drawNdebeleBorder,
  drawRoundedRect, drawQrPlaceholder,
} from './shared/page-layout';

export function generateTracingPage(doc: typeof PDFDocument.prototype) {
  const PAGE_NUM = 22;

  // --- Ndebele border ---
  drawNdebeleBorder(doc, PAGE.margin - 8, PAGE.margin - 8, PAGE.contentWidth + 16, PAGE.contentHeight + 16);

  // --- Header ---
  drawHeader(doc, 'Letter A', 'with Thandi');

  // --- Instruction area ---
  const instrY = 110;
  drawRoundedRect(doc, PAGE.margin + 20, instrY, PAGE.contentWidth - 40, 40, 12, '#E3F2FD');
  doc
    .fontSize(FONTS.instruction)
    .fillColor(BRAND.earth)
    .text('✏️ Trace the letter A — follow the arrows!', PAGE.margin + 20, instrY + 12, {
      width: PAGE.contentWidth - 40,
      align: 'center',
    });

  // --- Large letter A with stroke guides ---
  const letterY = 170;
  const letterCenterX = PAGE.width / 2;

  // Draw large A outline
  drawLargeLetterA(doc, letterCenterX, letterY, 120);

  // Stroke number labels
  doc.fontSize(FONTS.body).fillColor(BRAND.siphoOrange);
  doc.text('1', letterCenterX - 75, letterY + 40, { width: 20, align: 'center' });
  doc.text('2', letterCenterX + 55, letterY + 40, { width: 20, align: 'center' });
  doc.text('3', letterCenterX - 5, letterY + 85, { width: 20, align: 'center' });

  // --- Tracing practice section ---
  const traceY = 350;
  drawRoundedRect(doc, PAGE.margin, traceY, PAGE.contentWidth, 200, 12, '#FFF8E1', BRAND.sun);

  doc
    .fontSize(FONTS.instruction)
    .fillColor(BRAND.earth)
    .text('✏️ Trace the letter A:', PAGE.margin, traceY + 10, {
      width: PAGE.contentWidth,
      align: 'center',
    });

  // 4 rows of dotted letter A for practice
  const practiceStartY = traceY + 40;
  const rowHeight = 40;

  for (let row = 0; row < 4; row++) {
    const ry = practiceStartY + row * rowHeight;

    // Baseline
    doc
      .moveTo(PAGE.margin + 20, ry + 32)
      .lineTo(PAGE.width - PAGE.margin - 20, ry + 32)
      .dash(3, { space: 3 })
      .lineWidth(0.5)
      .strokeColor(BRAND.lightGrey)
      .stroke()
      .undash();

    // Midline
    doc
      .moveTo(PAGE.margin + 20, ry + 16)
      .lineTo(PAGE.width - PAGE.margin - 20, ry + 16)
      .dash(2, { space: 4 })
      .lineWidth(0.3)
      .strokeColor(BRAND.lightGrey)
      .stroke()
      .undash();

    // Dotted letter A samples across the row
    const aCount = row === 0 ? 8 : 6; // First row more guided, subsequent less
    const aSpacing = (PAGE.contentWidth - 60) / aCount;

    for (let j = 0; j < aCount; j++) {
      const ax = PAGE.margin + 30 + j * aSpacing + aSpacing / 2;

      if (row === 0 || j < 2) {
        // Dotted guide A
        doc
          .fontSize(28)
          .fillColor(BRAND.lightGrey)
          .text('A', ax - 10, ry + 2, { width: 20, align: 'center' });
      }
      // Remaining spots are blank for free practice
    }
  }

  // --- "A is for..." picture matching ---
  const matchY = 570;
  drawRoundedRect(doc, PAGE.margin, matchY, PAGE.contentWidth, 130, 12, '#E8F5E9', BRAND.leratoGreen);

  doc
    .fontSize(FONTS.instruction)
    .fillColor(BRAND.earth)
    .text('🍎 A is for...', PAGE.margin, matchY + 10, {
      width: PAGE.contentWidth,
      align: 'center',
    });

  // Items starting with A (emoji placeholders — real workbook uses illustrations)
  const items = [
    { emoji: '🍎', label: 'Apple' },
    { emoji: '🐜', label: 'Ant' },
    { emoji: '✈️', label: 'Aeroplane' },
    { emoji: '🥑', label: 'Avocado' },
  ];

  const itemSpacing = PAGE.contentWidth / items.length;
  for (let i = 0; i < items.length; i++) {
    const ix = PAGE.margin + i * itemSpacing + itemSpacing / 2;

    // Circle for illustration
    doc
      .circle(ix, matchY + 60, 25)
      .lineWidth(1.5)
      .strokeColor(BRAND.thandiBlue)
      .stroke();

    // Emoji placeholder
    doc
      .fontSize(24)
      .text(items[i].emoji, ix - 14, matchY + 48, { width: 28, align: 'center' });

    // Label
    doc
      .fontSize(FONTS.caption)
      .fillColor(BRAND.earth)
      .text(items[i].label, ix - 30, matchY + 95, { width: 60, align: 'center' });
  }

  // --- QR Code ---
  drawQrPlaceholder(doc, QR.defaultX, QR.defaultY, 'Trace Letter A');

  // --- Page number ---
  drawPageNumber(doc, PAGE_NUM);
}

/**
 * Draw a large outlined letter A with stroke direction arrows.
 * Uses simple lines (not text) for consistent rendering.
 */
function drawLargeLetterA(
  doc: typeof PDFDocument.prototype,
  cx: number,
  topY: number,
  height: number,
) {
  const halfWidth = height * 0.4;
  const bottomY = topY + height;
  const crossbarY = topY + height * 0.6;

  // Stroke 1: Left leg (bottom-left → top)
  doc
    .moveTo(cx - halfWidth, bottomY)
    .lineTo(cx, topY)
    .lineWidth(3)
    .strokeColor(BRAND.thandiBlue)
    .stroke();

  // Arrow on stroke 1 (upward)
  drawArrow(doc, cx - halfWidth * 0.5, topY + height * 0.5, cx - halfWidth * 0.3, topY + height * 0.3, BRAND.siphoOrange);

  // Stroke 2: Right leg (top → bottom-right)
  doc
    .moveTo(cx, topY)
    .lineTo(cx + halfWidth, bottomY)
    .lineWidth(3)
    .strokeColor(BRAND.thandiBlue)
    .stroke();

  // Arrow on stroke 2 (downward)
  drawArrow(doc, cx + halfWidth * 0.3, topY + height * 0.3, cx + halfWidth * 0.5, topY + height * 0.5, BRAND.siphoOrange);

  // Stroke 3: Crossbar (left → right)
  const crossLeftX = cx - halfWidth * 0.55;
  const crossRightX = cx + halfWidth * 0.55;
  doc
    .moveTo(crossLeftX, crossbarY)
    .lineTo(crossRightX, crossbarY)
    .lineWidth(3)
    .strokeColor(BRAND.thandiBlue)
    .stroke();

  // Arrow on stroke 3 (rightward)
  drawArrow(doc, cx - 10, crossbarY, cx + 10, crossbarY, BRAND.siphoOrange);
}

/** Draw a small directional arrow */
function drawArrow(
  doc: typeof PDFDocument.prototype,
  x1: number, y1: number,
  x2: number, y2: number,
  color: string,
) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLength = 8;

  doc
    .moveTo(x1, y1)
    .lineTo(x2, y2)
    .lineWidth(2)
    .strokeColor(color)
    .stroke();

  // Arrowhead
  doc
    .moveTo(x2, y2)
    .lineTo(
      x2 - headLength * Math.cos(angle - Math.PI / 6),
      y2 - headLength * Math.sin(angle - Math.PI / 6),
    )
    .moveTo(x2, y2)
    .lineTo(
      x2 - headLength * Math.cos(angle + Math.PI / 6),
      y2 - headLength * Math.sin(angle + Math.PI / 6),
    )
    .lineWidth(2)
    .strokeColor(color)
    .stroke();
}
