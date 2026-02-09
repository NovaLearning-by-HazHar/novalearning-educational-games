/**
 * NovaLearning Workbook Page Generator
 *
 * Generates print-ready PDF pages for the 50-page workbook.
 * Uses pdfkit for programmatic PDF creation.
 *
 * Usage:
 *   npx tsx scripts/generate-workbook.ts
 *
 * Output:
 *   out/workbook-page-15.pdf (Counting activity)
 *   out/workbook-page-22.pdf (Letter tracing activity)
 *   out/workbook-combined.pdf (Both pages in one file)
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { generateCountingPage } from './workbook-templates/counting-page';
import { generateTracingPage } from './workbook-templates/tracing-page';

const OUT_DIR = path.join(__dirname, '..', 'out');

// Ensure output directory exists
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function generatePage(
  filename: string,
  generator: (doc: typeof PDFDocument.prototype) => void,
) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 0, // We handle margins manually for bleed
    info: {
      Title: `NovaLearning Workbook - ${filename}`,
      Author: 'NovaLearning',
      Subject: 'Grade R Educational Workbook',
      Keywords: 'education, Grade R, CAPS, South Africa, Ubuntu',
    },
  });

  const outputPath = path.join(OUT_DIR, `${filename}.pdf`);
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  generator(doc);

  doc.end();

  return new Promise<void>((resolve, reject) => {
    writeStream.on('finish', () => {
      console.log(`  Generated: ${outputPath}`);
      resolve();
    });
    writeStream.on('error', reject);
  });
}

async function generateCombined() {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 0,
    info: {
      Title: 'NovaLearning Workbook - Pages 15 & 22',
      Author: 'NovaLearning',
      Subject: 'Grade R Educational Workbook',
      Keywords: 'education, Grade R, CAPS, South Africa, Ubuntu',
    },
  });

  const outputPath = path.join(OUT_DIR, 'workbook-combined.pdf');
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  // Page 15: Counting
  generateCountingPage(doc);

  // Page 22: Letter tracing
  doc.addPage();
  generateTracingPage(doc);

  doc.end();

  return new Promise<void>((resolve, reject) => {
    writeStream.on('finish', () => {
      console.log(`  Generated: ${outputPath}`);
      resolve();
    });
    writeStream.on('error', reject);
  });
}

async function main() {
  console.log('NovaLearning Workbook Generator');
  console.log('================================');
  console.log('');

  console.log('Generating individual pages...');
  await generatePage('workbook-page-15', generateCountingPage);
  await generatePage('workbook-page-22', generateTracingPage);

  console.log('');
  console.log('Generating combined PDF...');
  await generateCombined();

  console.log('');
  console.log('Done! PDFs are in the out/ directory.');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Replace QR placeholder boxes with actual QR code images');
  console.log('  2. Replace emoji placeholders with SA-themed illustrations');
  console.log('  3. Send to print shop with 3mm bleed specification');
}

main().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
