'use client';

import Link from 'next/link';
import { useExplorerState, useDiscoveryCount } from '../hooks/useExplorerState';
import { ANIMALS } from '../lib/constants';

/**
 * Minimal HTML overlay for the exploration phase.
 * Back button (top-left) + progress dots (bottom-center).
 */
export default function ExplorerOverlay() {
  const discoveries = useExplorerState((s) => s.discoveries);
  const discoveryCount = useDiscoveryCount();

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Back button — top-left */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow-md active:scale-95 transition-transform"
          aria-label="Back to home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5D4E37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
      </div>

      {/* Discovery count — top-right */}
      <div className="absolute top-4 right-14 pointer-events-none">
        <div className="bg-white/80 rounded-full px-3 py-1.5 shadow-md">
          <span className="text-sm font-bold text-[#5D4E37]">
            {discoveryCount} / {ANIMALS.length}
          </span>
        </div>
      </div>

      {/* Progress dots — bottom-center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none">
        {ANIMALS.map((animal) => (
          <div
            key={animal.id}
            className="w-4 h-4 rounded-full border-2 transition-all duration-300"
            style={{
              backgroundColor: discoveries.has(animal.id) ? animal.colors.primary : 'transparent',
              borderColor: discoveries.has(animal.id) ? animal.colors.primary : 'rgba(255,255,255,0.6)',
              transform: discoveries.has(animal.id) ? 'scale(1.15)' : 'scale(1)',
            }}
            title={animal.name}
          />
        ))}
      </div>
    </div>
  );
}
