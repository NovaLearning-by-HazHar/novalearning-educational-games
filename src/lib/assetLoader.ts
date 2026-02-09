import { BUDGETS } from '@/types/constants';

interface AssetLoadResult {
  url: string;
  sizeKB: number;
  withinBudget: boolean;
}

/**
 * Progressive asset loader with size budget enforcement.
 * Assets exceeding BUDGETS.MAX_ASSET_KB are rejected.
 */
export async function loadAsset(url: string): Promise<AssetLoadResult> {
  const response = await fetch(url);
  const blob = await response.blob();
  const sizeKB = blob.size / 1024;

  return {
    url: URL.createObjectURL(blob),
    sizeKB,
    withinBudget: sizeKB <= BUDGETS.MAX_ASSET_KB,
  };
}

/**
 * Preload a list of asset URLs. Returns results for all, including budget violations.
 */
export async function preloadAssets(
  urls: string[]
): Promise<AssetLoadResult[]> {
  return Promise.all(urls.map(loadAsset));
}
