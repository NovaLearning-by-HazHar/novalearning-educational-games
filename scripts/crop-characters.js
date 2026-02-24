/**
 * Crop character reference sheets to front-view portraits.
 * Reads full sheets from project root, extracts top-left quadrant,
 * resizes to 400x500, saves to public/characters/.
 *
 * Usage: node scripts/crop-characters.js
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'characters');

const CHARACTERS = [
  { src: 'chanel.png', out: 'chanel-front.png', panel: 'top-right' },
  { src: 'priya.png',  out: 'priya-front.png',  panel: 'top-left' },
  { src: 'naledi.png', out: 'naledi-front.png', panel: 'top-left' },
];

async function cropCharacter({ src, out, panel }) {
  const inputPath = path.join(ROOT, src);
  const outputPath = path.join(OUT_DIR, out);

  const metadata = await sharp(inputPath).metadata();
  const { width, height } = metadata;

  // Extract top-left or top-right quadrant (front-facing pose)
  const cropW = Math.floor(width / 2);
  const cropH = Math.floor(height / 2);
  const left = panel === 'top-right' ? cropW : 0;

  await sharp(inputPath)
    .extract({ left, top: 0, width: cropW, height: cropH })
    .resize(260, 325, { fit: 'cover', position: 'top' })
    .png({ compressionLevel: 9, palette: true, quality: 65 })
    .toFile(outputPath);

  const stat = fs.statSync(outputPath);
  const sizeKB = (stat.size / 1024).toFixed(1);
  const warn = stat.size > 50 * 1024 ? ' ⚠️  OVER 50KB BUDGET!' : '';
  console.log(`  Cropped ${src} (${width}x${height}) -> ${out} (260x325) ${sizeKB}KB${warn}`);
}

async function main() {
  // Ensure output directory exists
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('Cropping character reference sheets...\n');

  for (const char of CHARACTERS) {
    await cropCharacter(char);
  }

  console.log('\nDone! Check public/characters/');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
