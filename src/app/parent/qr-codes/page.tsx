'use client';

import Link from 'next/link';
import { getAllQrCodes } from '@/lib/qrCodes';

/**
 * QR Code reference page for workbook production.
 * Shows all QR codes with their target URLs for print layout.
 */
export default function QrCodesPage() {
  const qrCodes = getAllQrCodes();

  return (
    <main className="flex flex-col items-center min-h-screen p-6 bg-nova-sand overflow-auto">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-display text-nova-earth mb-2">Workbook QR Codes</h1>
        <p className="text-xs text-nova-earth/60 mb-6">
          These QR codes link workbook pages to their companion games.
          Right-click to save images for print layout.
        </p>

        {qrCodes.length === 0 && (
          <p className="text-sm text-nova-earth/50 bg-white/50 rounded-xl p-4 text-center">
            No QR codes configured yet. Add pages to WORKBOOK_PAGES in qrCodes.ts.
          </p>
        )}

        <div className="space-y-4">
          {qrCodes.map((qr) => (
            <div key={qr.page} className="bg-white rounded-xl p-4 border border-nova-earth/10">
              <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qr.qrUrl}
                  alt={`QR code for page ${qr.page}`}
                  width={120}
                  height={120}
                  className="rounded-lg border border-nova-earth/10"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-nova-earth text-lg">
                    Page {qr.page}
                  </p>
                  <p className="text-sm text-nova-earth/70 mb-2">{qr.title}</p>
                  <p className="text-xs text-nova-earth/40 break-all font-mono">
                    {qr.gameUrl}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/parent/dashboard"
            className="flex-1 py-3 rounded-xl bg-nova-sand border border-nova-earth/20 text-nova-earth font-display text-center hover:bg-nova-sun/10 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 rounded-xl bg-nova-sun text-nova-earth font-display text-center hover:bg-nova-sun/90 transition-colors"
          >
            Back to Games
          </Link>
        </div>
      </div>
    </main>
  );
}
