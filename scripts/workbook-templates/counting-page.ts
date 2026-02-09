/**
 * Workbook Page 15: "Count to 5 with Sipho" counting activity.
 *
 * Layout:
 * - Header: Title + Ndebele border
 * - Activity: 5 mango outlines to colour in and count
 * - Instruction icon area (no text — children can't read)
 * - Counting grid: numbers 1-5 with tracing guides
 * - QR code: links to digital game
 * - Page number
 */

import PDFDocument from 'pdfkit';
import {
  PAGE, BRAND, FONTS, QR,
  drawPageNumber, drawHeader, drawNdebeleBorder,
  drawRoundedRect, drawQrPlaceholder,
} from './shared/page-layout';

export function generateCountingPage(doc: typeof PDFDocument.prototype) {
  const PAGE_NUM = 15;

  // --- Ndebele border ---
  drawNdebeleBorder(doc, PAGE.margin - 8, PAGE.margin - 8, PAGE.contentWidth + 16, PAGE.contentHeight + 16);

  // --- Header ---
  drawHeader(doc, 'Count to 5', 'with Sipho');

  // --- Instruction area (visual — hand pointing at mangoes) ---
  const instrY = 110;
  drawRoundedRect(doc, PAGE.margin + 20, instrY, PAGE.contentWidth - 40, 40, 12, '#FFF3E0');
  doc
    .fontSize(FONTS.instruction)
    .fillColor(BRAND.earth)
    .text('👆 Count the mangoes and colour them in!', PAGE.margin + 20, instrY + 12, {
      width: PAGE.contentWidth - 40,
      align: 'center',
    });

  // --- 5 Mango outlines (arranged in a row) ---
  const mangoY = 185;
  const mangoSpacing = (PAGE.contentWidth - 60) / 5;
  const mangoRadius = 28;

  for (let i = 0; i < 5; i++) {
    const cx = PAGE.margin + 30 + i * mangoSpacing + mangoSpacing / 2;
    const cy = mangoY + mangoRadius;

    // Mango shape: slightly elongated ellipse
    doc.save();
    doc.translate(cx, cy);
    doc.scale(1, 1.3);

    doc
      .circle(0, 0, mangoRadius)
      .lineWidth(2)
      .strokeColor(BRAND.sun)
      .stroke();

    doc.restore();

    // Stem on top
    doc
      .moveTo(cx, cy - mangoRadius * 1.3 - 2)
      .lineTo(cx + 5, cy - mangoRadius * 1.3 - 12)
      .lineWidth(2)
      .strokeColor('#4CAF50')
      .stroke();

    // Number below each mango
    doc
      .fontSize(FONTS.subtitle)
      .fillColor(BRAND.earth)
      .text(`${i + 1}`, cx - 10, cy + mangoRadius * 1.3 + 10, {
        width: 20,
        align: 'center',
      });
  }

  // --- Number tracing section ---
  const traceY = 340;
  drawRoundedRect(doc, PAGE.margin, traceY, PAGE.contentWidth, 200, 12, '#F3E5F5', BRAND.fatimaPurple);

  doc
    .fontSize(FONTS.instruction)
    .fillColor(BRAND.earth)
    .text('✏️ Trace the numbers:', PAGE.margin, traceY + 12, {
      width: PAGE.contentWidth,
      align: 'center',
    });

  // Large dotted numbers 1-5 for tracing
  const numberY = traceY + 50;
  const numberSpacing = PAGE.contentWidth / 5;

  for (let i = 1; i <= 5; i++) {
    const nx = PAGE.margin + (i - 1) * numberSpacing + numberSpacing / 2;

    // Dotted number outline (simulated with light color)
    doc
      .fontSize(60)
      .fillColor(BRAND.lightGrey)
      .text(`${i}`, nx - 20, numberY, {
        width: 40,
        align: 'center',
      });

    // Solid guide below for writing practice
    doc
      .moveTo(nx - 20, numberY + 80)
      .lineTo(nx + 20, numberY + 80)
      .dash(3, { space: 3 })
      .lineWidth(0.5)
      .strokeColor(BRAND.lightGrey)
      .stroke()
      .undash();
  }

  // --- Drawing area: "Draw 5 of something" ---
  const drawY = 570;
  drawRoundedRect(doc, PAGE.margin, drawY, PAGE.contentWidth, 140, 12, BRAND.white, BRAND.leratoGreen);

  doc
    .fontSize(FONTS.instruction)
    .fillColor(BRAND.earth)
    .text('🎨 Draw 5 of your favourite things!', PAGE.margin, drawY + 12, {
      width: PAGE.contentWidth,
      align: 'center',
    });

  // Grid lines for drawing
  for (let i = 0; i < 5; i++) {
    const gx = PAGE.margin + 20 + i * (PAGE.contentWidth - 40) / 5;
    doc
      .moveTo(gx, drawY + 40)
      .lineTo(gx, drawY + 130)
      .lineWidth(0.3)
      .strokeColor(BRAND.lightGrey)
      .stroke();
  }

  // --- QR Code ---
  drawQrPlaceholder(doc, QR.defaultX, QR.defaultY, 'Count to 5');

  // --- Page number ---
  drawPageNumber(doc, PAGE_NUM);
}
