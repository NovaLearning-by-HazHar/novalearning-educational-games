/**
 * Canva page template: embeds a full-page PNG export into a pdfkit PDF.
 *
 * Production workflow:
 * 1. Design page in Canva Pro (A4, 300 DPI)
 * 2. Export as PNG to scripts/pages/page-NN.png
 * 3. This template embeds the PNG and overlays:
 *    - Page number (bottom-center, safety net if Canva design omits it)
 *    - QR code (if page has a game mapping)
 *    - Crop marks (for print shop trimming)
 *
 * Set overlayPageNumber=false if Canva designs include page numbers already.
 */

import fs from 'fs';
import {
  PAGE, QR, FONTS, BRAND,
  drawQrCode, drawQrPlaceholder, drawCropMarks,
} from './shared/page-layout';

export interface CanvaPageOptions {
  /** Overlay a page number at bottom-center. Default: true (safety net). */
  overlayPageNumber?: boolean;
}

const DEFAULT_OPTIONS: CanvaPageOptions = {
  overlayPageNumber: true,
};

/**
 * Generate a page from a Canva-exported PNG.
 * Embeds the image at full A4 size, overlays QR code if mapped, adds crop marks.
 */
export function generateCanvaPage(
  doc: PDFKit.PDFDocument,
  pngPath: string,
  pageNumber: number,
  qrData?: { pngPath: string; title: string },
  options?: CanvaPageOptions,
) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Embed PNG at full A4 dimensions (image should be 300 DPI, 2480x3508px for A4)
  doc.image(pngPath, 0, 0, {
    width: PAGE.width,
    height: PAGE.height,
  });

  // Overlay page number at bottom-center (safety net)
  if (opts.overlayPageNumber) {
    doc
      .fontSize(FONTS.pageNumber)
      .fillColor(BRAND.earth)
      .text(`${pageNumber}`, 0, PAGE.height - PAGE.margin + 10, {
        width: PAGE.width,
        align: 'center',
      });
  }

  // Overlay QR code if this page has a game mapping
  if (qrData?.pngPath && fs.existsSync(qrData.pngPath)) {
    drawQrCode(doc, QR.defaultX, QR.defaultY, qrData.pngPath, qrData.title);
  } else if (qrData?.title) {
    // Fallback to placeholder if QR image not available
    drawQrPlaceholder(doc, QR.defaultX, QR.defaultY, qrData.title);
  }

  // Crop marks for print trimming
  drawCropMarks(doc);
}
