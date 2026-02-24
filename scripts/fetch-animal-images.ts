/**
 * fetch-animal-images.ts
 *
 * Downloads animal images and resizes to 512x512 webp under 50KB for web game assets.
 *
 * Sources (auto-selects best available):
 *   1. Pixabay API (illustrated style, needs free API key)
 *   2. Wikimedia Commons (photos/illustrations, no key needed)
 *
 * Usage:
 *   npx tsx scripts/fetch-animal-images.ts              # Uses Wikimedia (no key needed)
 *   PIXABAY_KEY=xxx npx tsx scripts/fetch-animal-images.ts  # Uses Pixabay illustrations
 *   npx tsx scripts/fetch-animal-images.ts --force       # Re-download existing images
 *
 * Get free Pixabay key: https://pixabay.com/api/docs/ (30-second signup)
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import sharp from 'sharp';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const OUTPUT_DIR = path.resolve(__dirname, '../public/assets/animals');
const MAX_SIZE_KB = 50;
const TARGET_SIZE = 512;
const FORCE = process.argv.includes('--force');

/** All 26 SA animals from the A-Z workbook content map */
const ANIMALS: { filename: string; wikiTitle: string; pixabayQueries: string[] }[] = [
  { filename: 'aardvark', wikiTitle: 'Aardvark', pixabayQueries: ['aardvark illustration', 'aardvark cartoon'] },
  { filename: 'baboon', wikiTitle: 'Baboon', pixabayQueries: ['baboon illustration', 'baboon cartoon'] },
  { filename: 'cheetah', wikiTitle: 'Cheetah', pixabayQueries: ['cheetah illustration', 'cheetah cartoon'] },
  { filename: 'dung-beetle', wikiTitle: 'Dung_beetle', pixabayQueries: ['dung beetle illustration', 'scarab beetle cartoon'] },
  { filename: 'elephant', wikiTitle: 'African_elephant', pixabayQueries: ['elephant illustration africa', 'elephant cartoon'] },
  { filename: 'flamingo', wikiTitle: 'Flamingo', pixabayQueries: ['flamingo illustration', 'flamingo cartoon pink'] },
  { filename: 'giraffe', wikiTitle: 'Giraffe', pixabayQueries: ['giraffe illustration', 'giraffe cartoon'] },
  { filename: 'hippo', wikiTitle: 'Hippopotamus', pixabayQueries: ['hippopotamus illustration', 'hippo cartoon'] },
  { filename: 'impala', wikiTitle: 'Impala', pixabayQueries: ['impala antelope illustration', 'impala cartoon'] },
  { filename: 'jackal', wikiTitle: 'Black-backed_jackal', pixabayQueries: ['jackal illustration', 'jackal cartoon'] },
  { filename: 'kudu', wikiTitle: 'Greater_kudu', pixabayQueries: ['kudu antelope illustration', 'kudu cartoon'] },
  { filename: 'lion', wikiTitle: 'Lion', pixabayQueries: ['lion illustration', 'lion cartoon africa'] },
  { filename: 'meerkat', wikiTitle: 'Meerkat', pixabayQueries: ['meerkat illustration', 'meerkat cartoon'] },
  { filename: 'nyala', wikiTitle: 'Nyala', pixabayQueries: ['nyala antelope illustration', 'nyala animal'] },
  { filename: 'ostrich', wikiTitle: 'Common_ostrich', pixabayQueries: ['ostrich illustration', 'ostrich cartoon'] },
  { filename: 'pangolin', wikiTitle: 'Pangolin', pixabayQueries: ['pangolin illustration', 'pangolin cartoon'] },
  { filename: 'quagga', wikiTitle: 'Quagga', pixabayQueries: ['quagga illustration', 'quagga extinct zebra'] },
  { filename: 'rhino', wikiTitle: 'White_rhinoceros', pixabayQueries: ['rhinoceros illustration', 'rhino cartoon'] },
  { filename: 'springbok', wikiTitle: 'Springbok_(antelope)', pixabayQueries: ['springbok illustration', 'springbok antelope'] },
  { filename: 'tortoise', wikiTitle: 'Leopard_tortoise', pixabayQueries: ['tortoise illustration', 'tortoise cartoon'] },
  { filename: 'vulture', wikiTitle: 'Cape_vulture', pixabayQueries: ['vulture illustration', 'vulture cartoon'] },
  { filename: 'warthog', wikiTitle: 'Common_warthog', pixabayQueries: ['warthog illustration', 'warthog cartoon'] },
  { filename: 'x-ray-fish', wikiTitle: 'Pristella_maxillaris', pixabayQueries: ['x-ray tetra fish illustration', 'transparent fish cartoon'] },
  { filename: 'yellow-mongoose', wikiTitle: 'Yellow_mongoose', pixabayQueries: ['mongoose illustration', 'mongoose cartoon'] },
  { filename: 'zebra', wikiTitle: 'Plains_zebra', pixabayQueries: ['zebra illustration', 'zebra cartoon africa'] },
];

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

function fetchUrl(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, { headers: { 'User-Agent': 'NovaLearning/1.0 (educational project)' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve, reject);
      }
      if (res.statusCode && res.statusCode >= 400) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function fetchJSON<T>(url: string): Promise<T> {
  const buf = await fetchUrl(url);
  return JSON.parse(buf.toString('utf8'));
}

// ---------------------------------------------------------------------------
// Wikimedia Commons source (no API key needed)
// ---------------------------------------------------------------------------

interface WikiImageResponse {
  query?: {
    pages: Record<string, {
      title: string;
      original?: { source: string };
      thumbnail?: { source: string };
    }>;
  };
}

async function fetchFromWikimedia(wikiTitle: string, retries = 3): Promise<Buffer | null> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&format=json&pithumbsize=${TARGET_SIZE}&piprop=original%7Cthumbnail`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`    Retry ${attempt}/${retries - 1} for ${wikiTitle}...`);
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }

      const data = await fetchJSON<WikiImageResponse>(url);
      if (!data.query?.pages) continue;

      const page = Object.values(data.query.pages)[0];
      const imgUrl = page?.original?.source || page?.thumbnail?.source;
      if (!imgUrl) continue;

      return await fetchUrl(imgUrl);
    } catch (err: any) {
      console.log(`    Attempt ${attempt + 1} failed: ${err.message}`);
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Pixabay source (free API key required)
// ---------------------------------------------------------------------------

interface PixabayResponse {
  totalHits: number;
  hits: { largeImageURL: string; webformatURL: string }[];
}

async function fetchFromPixabay(queries: string[], apiKey: string): Promise<Buffer | null> {
  for (const query of queries) {
    const url = new URL('https://pixabay.com/api/');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('q', query);
    url.searchParams.set('image_type', 'illustration');
    url.searchParams.set('category', 'animals');
    url.searchParams.set('safesearch', 'true');
    url.searchParams.set('per_page', '3');
    url.searchParams.set('min_width', '256');

    try {
      const data = await fetchJSON<PixabayResponse>(url.toString());
      if (data.hits.length > 0) {
        const imgUrl = data.hits[0].largeImageURL || data.hits[0].webformatURL;
        return await fetchUrl(imgUrl);
      }
    } catch {
      continue;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Image processing
// ---------------------------------------------------------------------------

async function processToWebp(inputBuffer: Buffer, outputPath: string): Promise<number> {
  let quality = 80;
  let result: Buffer;

  do {
    result = await sharp(inputBuffer)
      .resize(TARGET_SIZE, TARGET_SIZE, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .webp({ quality })
      .toBuffer();

    if (result.length <= MAX_SIZE_KB * 1024) break;
    quality -= 5;
  } while (quality >= 20);

  fs.writeFileSync(outputPath, result);
  return result.length;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const pixabayKey = process.env.PIXABAY_KEY;
  const source = pixabayKey ? 'pixabay' : 'wikimedia';

  console.log(`\n  NovaLearning Animal Image Fetcher`);
  console.log(`  Source: ${source === 'pixabay' ? 'Pixabay (illustrated)' : 'Wikimedia Commons (photos)'}`);
  console.log(`  Output: ${OUTPUT_DIR}`);
  console.log(`  Target: ${TARGET_SIZE}x${TARGET_SIZE} webp, max ${MAX_SIZE_KB}KB`);
  if (!pixabayKey) {
    console.log(`\n  Tip: Set PIXABAY_KEY for illustrated style images.`);
    console.log(`  Get free key: https://pixabay.com/api/docs/\n`);
  }
  console.log('');

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const results: { animal: string; status: string; sizeKB: number }[] = [];

  for (const animal of ANIMALS) {
    const outPath = path.join(OUTPUT_DIR, `${animal.filename}.webp`);

    // Skip existing unless --force
    if (fs.existsSync(outPath) && !FORCE) {
      const sizeKB = Math.round(fs.statSync(outPath).size / 1024 * 10) / 10;
      console.log(`  SKIP  ${animal.filename} (${sizeKB}KB, use --force to overwrite)`);
      results.push({ animal: animal.filename, status: 'skipped', sizeKB });
      continue;
    }

    let buffer: Buffer | null = null;

    // Try Pixabay first (illustrated), then Wikimedia fallback
    if (pixabayKey) {
      console.log(`  FETCH ${animal.filename} (pixabay)...`);
      buffer = await fetchFromPixabay(animal.pixabayQueries, pixabayKey);
    }

    if (!buffer) {
      console.log(`  FETCH ${animal.filename} (wikimedia: ${animal.wikiTitle})...`);
      buffer = await fetchFromWikimedia(animal.wikiTitle);
    }

    if (!buffer) {
      console.log(`  MISS  ${animal.filename} -- no image found`);
      results.push({ animal: animal.filename, status: 'MISSING', sizeKB: 0 });
      continue;
    }

    try {
      const sizeBytes = await processToWebp(buffer, outPath);
      const sizeKB = Math.round(sizeBytes / 1024 * 10) / 10;
      console.log(`    OK  ${animal.filename}.webp (${sizeKB}KB)`);
      results.push({ animal: animal.filename, status: 'downloaded', sizeKB });
    } catch (err: any) {
      console.log(`  ERR   ${animal.filename}: ${err.message}`);
      results.push({ animal: animal.filename, status: 'ERROR', sizeKB: 0 });
    }

    // Rate limiting -- Wikipedia needs ~1s between requests to avoid blocks
    await new Promise((r) => setTimeout(r, source === 'pixabay' ? 700 : 1200));
  }

  // Summary
  console.log('\n--- SUMMARY ---');
  const downloaded = results.filter((r) => r.status === 'downloaded');
  const skipped = results.filter((r) => r.status === 'skipped');
  const missing = results.filter((r) => r.status === 'MISSING' || r.status === 'ERROR');

  console.log(`  Downloaded: ${downloaded.length}`);
  console.log(`  Skipped:    ${skipped.length}`);
  if (missing.length > 0) {
    console.log(`  MISSING:    ${missing.length}`);
    missing.forEach((m) => console.log(`    - ${m.animal}`));
    console.log('\n  For missing animals, manually download from:');
    console.log('    rawpixel.com/search/animal+cartoon  (CC0 public domain)');
    console.log('    freepik.com  (search "animal illustration", free w/ attribution)');
    console.log('    biodiversitylibrary.org/item/92533  (SA vintage plates, public domain)');
  }

  const totalKB = results.reduce((sum, r) => sum + r.sizeKB, 0);
  console.log(`\n  Total asset size: ${Math.round(totalKB)}KB (${Math.round(totalKB / 10) / 100}MB)`);

  if (source === 'wikimedia') {
    console.log('\n  These are photo-style images from Wikipedia.');
    console.log('  For illustrated/cartoon style, re-run with a Pixabay API key:');
    console.log('    PIXABAY_KEY=your-key npx tsx scripts/fetch-animal-images.ts --force');
  }
  console.log('');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
