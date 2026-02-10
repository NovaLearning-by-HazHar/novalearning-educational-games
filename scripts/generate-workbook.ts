/**
 * NovaLearning Workbook Generator
 *
 * Generates a print-ready PDF workbook by combining:
 * 1. Canva-exported PNG pages (from scripts/pages/page-NN.png)
 * 2. Programmatic pdfkit pages (fallback for pages without Canva designs)
 *
 * Each page gets:
 * - QR code overlay (if the page maps to a game)
 * - Crop marks (for print shop trimming)
 *
 * Usage:
 *   npx tsx scripts/generate-workbook.ts           # Generate RGB PDF
 *   npx tsx scripts/generate-workbook.ts --pages 15,22  # Specific pages only
 *
 * Output:
 *   out/novalearning-workbook-v1.pdf  (combined workbook)
 *   out/workbook-page-NN.pdf          (individual pages)
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { generateCountingPage } from './workbook-templates/counting-page';
import { generateTracingPage } from './workbook-templates/tracing-page';
import { generateCanvaPage } from './workbook-templates/canva-page';
import { PAGE, drawCropMarks } from './workbook-templates/shared/page-layout';

// --- Directories ---
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'out');
const PAGES_DIR = path.join(__dirname, 'pages');
const QR_CACHE_DIR = path.join(__dirname, 'qr-cache');

// --- QR code mapping (mirrors src/lib/qrCodes.ts for script context) ---
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://novalearning.vercel.app';

const WORKBOOK_PAGES: Record<number, { gameId: string; title: string }> = {
  15: { gameId: 'count-to-five', title: 'Count to 5 with Sipho' },
  22: { gameId: 'trace-letter-a', title: 'Trace Letter A with Thandi' },
};

// --- Programmatic page generators (fallbacks when no Canva PNG exists) ---
const PROGRAMMATIC_PAGES: Record<number, (doc: PDFKit.PDFDocument) => void> = {
  15: generateCountingPage,
  22: generateTracingPage,
};

// --- Helpers ---

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/** Get the game URL for a workbook page. */
function getGameUrl(pageNumber: number): string | null {
  const page = WORKBOOK_PAGES[pageNumber];
  if (!page) return null;
  return `${BASE_URL}/games/${page.gameId}?wb=${pageNumber}`;
}

/** Generate QR code PNGs locally for all mapped pages. */
async function generateQrCodes(): Promise<Record<number, string>> {
  ensureDir(QR_CACHE_DIR);
  const results: Record<number, string> = {};

  for (const [pageStr, meta] of Object.entries(WORKBOOK_PAGES)) {
    const pageNum = Number(pageStr);
    const gameUrl = getGameUrl(pageNum);
    if (!gameUrl) continue;

    const dest = path.join(QR_CACHE_DIR, `qr-page-${pageStr}.png`);

    // Use cached version if it exists
    if (fs.existsSync(dest)) {
      results[pageNum] = dest;
      console.log(`  QR cached: page ${pageStr} -> ${meta.title}`);
      continue;
    }

    try {
      await QRCode.toFile(dest, gameUrl, {
        width: 300,
        margin: 1,
        color: { dark: '#333333', light: '#FFFFFF' },
        errorCorrectionLevel: 'M',
      });
      results[pageNum] = dest;
      console.log(`  QR generated: page ${pageStr} -> ${meta.title}`);
    } catch (err) {
      console.warn(`  QR generation failed for page ${pageStr}: ${err}`);
    }
  }

  return results;
}

/** Scan scripts/pages/ for Canva PNG exports. Returns map of page number -> file path. */
function scanCanvaPages(): Record<number, string> {
  if (!fs.existsSync(PAGES_DIR)) return {};

  const pages: Record<number, string> = {};
  const files = fs.readdirSync(PAGES_DIR);

  for (const file of files) {
    const match = file.match(/^page-(\d+)\.png$/i);
    if (match) {
      const pageNum = parseInt(match[1], 10);
      pages[pageNum] = path.join(PAGES_DIR, file);
    }
  }

  return pages;
}

/** Create a new pdfkit document with A4 settings. */
function createDoc(title: string): typeof PDFDocument.prototype {
  return new PDFDocument({
    size: 'A4',
    margin: 0,
    info: {
      Title: title,
      Author: 'NovaLearning',
      Subject: 'Grade R Educational Workbook',
      Keywords: 'education, Grade R, CAPS, South Africa, Ubuntu',
    },
  });
}

/** Write a pdfkit document to a file. */
function writeDoc(doc: PDFKit.PDFDocument, outputPath: string): Promise<void> {
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);
  doc.end();
  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      console.log(`  Generated: ${outputPath}`);
      resolve();
    });
    writeStream.on('error', reject);
  });
}

// --- Main ---

async function main() {
  // Parse --pages flag (e.g., --pages 15,22)
  const pagesArg = process.argv.find((a) => a.startsWith('--pages'));
  let requestedPages: number[] | null = null;
  if (pagesArg) {
    const val = pagesArg.includes('=') ? pagesArg.split('=')[1] : process.argv[process.argv.indexOf(pagesArg) + 1];
    if (val) requestedPages = val.split(',').map(Number).filter(Boolean);
  }

  console.log('NovaLearning Workbook Generator');
  console.log('================================');
  console.log('');

  ensureDir(OUT_DIR);

  // Step 1: Generate QR codes locally
  console.log('Generating QR codes...');
  const qrPaths = await generateQrCodes();
  console.log(`  ${Object.keys(qrPaths).length} QR code(s) ready`);
  console.log('');

  // Step 2: Scan for Canva PNG exports
  const canvaPages = scanCanvaPages();
  const canvaCount = Object.keys(canvaPages).length;
  console.log(`Found ${canvaCount} Canva page(s) in scripts/pages/`);
  if (canvaCount > 0) {
    for (const [num, filePath] of Object.entries(canvaPages)) {
      console.log(`  page-${num}: ${path.basename(filePath)}`);
    }
  }
  console.log('');

  // Step 3: Determine which pages to generate
  const programmaticPageNums = Object.keys(PROGRAMMATIC_PAGES).map(Number);
  const canvaPageNums = Object.keys(canvaPages).map(Number);
  const allPageNums = Array.from(new Set([...programmaticPageNums, ...canvaPageNums])).sort((a, b) => a - b);
  const pagesToGenerate = requestedPages
    ? allPageNums.filter((n) => requestedPages!.includes(n))
    : allPageNums;

  if (pagesToGenerate.length === 0) {
    console.log('No pages to generate. Add Canva PNGs to scripts/pages/ or check --pages flag.');
    return;
  }

  console.log(`Generating ${pagesToGenerate.length} page(s): ${pagesToGenerate.join(', ')}`);
  console.log('');

  // Step 4: Generate individual page PDFs
  console.log('Generating individual pages...');
  for (const pageNum of pagesToGenerate) {
    const doc = createDoc(`NovaLearning Workbook - Page ${pageNum}`);
    const outputPath = path.join(OUT_DIR, `workbook-page-${String(pageNum).padStart(2, '0')}.pdf`);
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    const qrData = WORKBOOK_PAGES[pageNum]
      ? { pngPath: qrPaths[pageNum], title: WORKBOOK_PAGES[pageNum].title }
      : undefined;

    if (canvaPages[pageNum]) {
      // Canva PNG page
      generateCanvaPage(doc, canvaPages[pageNum], pageNum, qrData);
    } else if (PROGRAMMATIC_PAGES[pageNum]) {
      // Programmatic fallback page
      PROGRAMMATIC_PAGES[pageNum](doc);
      drawCropMarks(doc);
    }

    doc.end();
    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', () => {
        console.log(`  Generated: ${outputPath}`);
        resolve();
      });
      writeStream.on('error', reject);
    });
  }

  // Step 5: Generate combined PDF
  console.log('');
  console.log('Generating combined PDF...');
  const combinedDoc = createDoc('NovaLearning Workbook v1');
  const combinedPath = path.join(OUT_DIR, 'novalearning-workbook-v1.pdf');
  const combinedStream = fs.createWriteStream(combinedPath);
  combinedDoc.pipe(combinedStream);

  for (let i = 0; i < pagesToGenerate.length; i++) {
    if (i > 0) combinedDoc.addPage();

    const pageNum = pagesToGenerate[i];
    const qrData = WORKBOOK_PAGES[pageNum]
      ? { pngPath: qrPaths[pageNum], title: WORKBOOK_PAGES[pageNum].title }
      : undefined;

    if (canvaPages[pageNum]) {
      generateCanvaPage(combinedDoc, canvaPages[pageNum], pageNum, qrData);
    } else if (PROGRAMMATIC_PAGES[pageNum]) {
      PROGRAMMATIC_PAGES[pageNum](combinedDoc);
      drawCropMarks(combinedDoc);
    }
  }

  combinedDoc.end();
  await new Promise<void>((resolve, reject) => {
    combinedStream.on('finish', () => {
      console.log(`  Generated: ${combinedPath}`);
      resolve();
    });
    combinedStream.on('error', reject);
  });

  // Summary
  console.log('');
  console.log('Done!');
  console.log(`  Pages: ${pagesToGenerate.length}`);
  console.log(`  Canva pages: ${canvaPageNums.filter((n) => pagesToGenerate.includes(n)).length}`);
  console.log(`  Programmatic pages: ${programmaticPageNums.filter((n) => pagesToGenerate.includes(n) && !canvaPages[n]).length}`);
  console.log(`  QR codes embedded: ${Object.keys(qrPaths).filter((n) => pagesToGenerate.includes(Number(n))).length}`);
  console.log(`  Output: ${OUT_DIR}`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Add more Canva PNG pages to scripts/pages/ (page-01.png, page-02.png, ...)');
  console.log('  2. Run: npm run workbook:cmyk  (requires Ghostscript for RGB->CMYK conversion)');
  console.log('  3. Send final PDF to print shop with 3mm bleed specification');
}

main().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
