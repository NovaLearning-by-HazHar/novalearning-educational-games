/**
 * QR Code URL generation for workbook pages.
 *
 * Uses Google Charts API to generate QR code images.
 * No npm dependency needed — just image URLs for the workbook.
 *
 * In production: replace with a self-hosted generator or
 * pre-generated PNGs to avoid external dependency.
 */

/** Base URL for deployed games (configure via env var) */
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://novalearning.vercel.app';

/** QR code size for print (300px = ~1 inch at 300dpi) */
const QR_SIZE = 300;

/** Workbook page → game mapping */
export const WORKBOOK_PAGES: Record<number, { gameId: string; title: string }> = {
  15: { gameId: 'count-to-five', title: 'Count to 5 with Sipho' },
  22: { gameId: 'trace-letter-a', title: 'Trace Letter A with Thandi' },
};

/** Get the game URL for a workbook page */
export function getGameUrl(pageNumber: number): string | null {
  const page = WORKBOOK_PAGES[pageNumber];
  if (!page) return null;
  return `${BASE_URL}/games/${page.gameId}?wb=${pageNumber}`;
}

/**
 * Get a QR code image URL for a workbook page.
 * Returns a Google Charts API URL that renders to a PNG.
 * For print: download and embed in workbook layout.
 */
export function getQrCodeUrl(pageNumber: number): string | null {
  const gameUrl = getGameUrl(pageNumber);
  if (!gameUrl) return null;

  return `https://chart.googleapis.com/chart?chs=${QR_SIZE}x${QR_SIZE}&cht=qr&chl=${encodeURIComponent(gameUrl)}&choe=UTF-8`;
}

/** Get all QR codes for the workbook */
export function getAllQrCodes(): { page: number; title: string; gameUrl: string; qrUrl: string }[] {
  return Object.entries(WORKBOOK_PAGES).map(([pageStr, meta]) => {
    const page = Number(pageStr);
    return {
      page,
      title: meta.title,
      gameUrl: getGameUrl(page)!,
      qrUrl: getQrCodeUrl(page)!,
    };
  });
}
