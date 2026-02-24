'use client';

import { useCallback } from 'react';
import { audioManager } from '@/lib/audio';
import { ANIMALS } from '../lib/constants';
import { useExplorerState } from '../hooks/useExplorerState';

interface ExplorerOverlayProps {
  /** Show progress dots (hidden during matching/celebrate) */
  showProgress?: boolean;
}

/**
 * HTML overlay: back button, mute toggle, 6 progress dots.
 * Positioned absolute over the 3D canvas.
 */
export default function ExplorerOverlay({ showProgress = true }: ExplorerOverlayProps) {
  const discoveries = useExplorerState((s) => s.discoveries);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Top bar */}
      <div className="flex justify-between items-center px-4 pt-4 pointer-events-auto">
        <BackButton />
        <MuteButton />
      </div>

      {/* Progress dots at bottom */}
      {showProgress && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
            {ANIMALS.map((animal) => (
              <div
                key={animal.id}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  discoveries.has(animal.id)
                    ? 'bg-[#FF6F00] text-white scale-110'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {animal.letter}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BackButton() {
  const handleBack = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }, []);

  return (
    <button
      onClick={handleBack}
      className="w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md active:scale-95 transition-transform"
      aria-label="Go back"
    >
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#5D4E37" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}

function MuteButton() {
  const handleToggle = useCallback(() => {
    const next = !audioManager.muted;
    audioManager.setMuted(next);
  }, []);

  return (
    <button
      onClick={handleToggle}
      className="w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md active:scale-95 transition-transform"
      aria-label="Toggle sound"
    >
      <span className="text-lg" aria-hidden="true">
        {audioManager.muted ? '🔇' : '🔊'}
      </span>
    </button>
  );
}
