import { BUDGETS } from '@/types/constants';

export interface AssetLoadResult {
  url: string;
  originalUrl: string;
  sizeKB: number;
  withinBudget: boolean;
  cached: boolean;
}

/** In-memory cache for loaded asset object URLs */
const assetCache = new Map<string, AssetLoadResult>();

/**
 * Progressive asset loader with size budget enforcement.
 * Assets exceeding BUDGETS.MAX_ASSET_KB log a warning but still load.
 * Uses cache-first strategy — checks in-memory cache before fetching.
 */
export async function loadAsset(
  url: string,
  budgetKB: number = BUDGETS.MAX_ASSET_KB
): Promise<AssetLoadResult> {
  // Cache hit
  const cached = assetCache.get(url);
  if (cached) return { ...cached, cached: true };

  const response = await fetch(url, { cache: 'force-cache' });
  if (!response.ok) {
    throw new Error(`Failed to load asset: ${url} (${response.status})`);
  }

  const blob = await response.blob();
  const sizeKB = blob.size / 1024;
  const withinBudget = sizeKB <= budgetKB;

  if (!withinBudget) {
    console.warn(
      `[AssetLoader] ${url} is ${sizeKB.toFixed(1)}KB — exceeds ${budgetKB}KB budget`
    );
  }

  const result: AssetLoadResult = {
    url: URL.createObjectURL(blob),
    originalUrl: url,
    sizeKB,
    withinBudget,
    cached: false,
  };

  assetCache.set(url, result);
  return result;
}

/**
 * Preload a list of asset URLs with progress callback.
 * Loads sequentially on low-end devices to avoid memory spikes.
 */
export async function preloadAssets(
  urls: string[],
  onProgress?: (loaded: number, total: number) => void
): Promise<AssetLoadResult[]> {
  const results: AssetLoadResult[] = [];

  for (let i = 0; i < urls.length; i++) {
    try {
      const result = await loadAsset(urls[i]);
      results.push(result);
    } catch (err) {
      console.error(`[AssetLoader] Failed to preload: ${urls[i]}`, err);
      results.push({
        url: '',
        originalUrl: urls[i],
        sizeKB: 0,
        withinBudget: false,
        cached: false,
      });
    }
    onProgress?.(i + 1, urls.length);
  }

  return results;
}

/** Get total size of all cached assets */
export function getCachedAssetSizeKB(): number {
  let total = 0;
  assetCache.forEach((result) => {
    total += result.sizeKB;
  });
  return total;
}

/** Clear the asset cache and revoke object URLs */
export function clearAssetCache(): void {
  assetCache.forEach((result) => {
    if (result.url) URL.revokeObjectURL(result.url);
  });
  assetCache.clear();
}
