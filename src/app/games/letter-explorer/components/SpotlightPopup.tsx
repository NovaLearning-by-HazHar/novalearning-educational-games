'use client';

import { useEffect, useRef } from 'react';
import { ANIMALS, TIMINGS, type AnimalDef } from '../lib/constants';
import { useExplorerState } from '../hooks/useExplorerState';

/**
 * HTML overlay showing the discovered animal spotlight.
 * Displays animal name, letter, Ubuntu value.
 * Auto-dismisses after TIMINGS.spotlightDuration or on tap.
 */
export default function SpotlightPopup() {
  const currentSpotlight = useExplorerState((s) => s.currentSpotlight);
  const dismissSpotlight = useExplorerState((s) => s.dismissSpotlight);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const animal = currentSpotlight
    ? ANIMALS.find((a) => a.id === currentSpotlight) ?? null
    : null;

  // Auto-dismiss timer
  useEffect(() => {
    if (!currentSpotlight) return;
    timerRef.current = setTimeout(() => {
      dismissSpotlight();
    }, TIMINGS.spotlightDuration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSpotlight, dismissSpotlight]);

  if (!animal) return null;

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto"
      onClick={dismissSpotlight}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Card */}
      <div
        className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-6 mx-6 max-w-sm shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <SpotlightCard animal={animal} onDismiss={dismissSpotlight} />
        {/* Timer bar */}
        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-nova-sun rounded-full animate-shrink-bar"
            style={{ animationDuration: `${TIMINGS.spotlightDuration}ms` }}
          />
        </div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shrinkBar {
          0% { width: 100%; }
          100% { width: 0%; }
        }
        .animate-pop-in { animation: popIn 0.3s ease-out; }
        .animate-shrink-bar { animation: shrinkBar linear forwards; }
      `}</style>
    </div>
  );
}

function SpotlightCard({
  animal,
  onDismiss,
}: {
  animal: AnimalDef;
  onDismiss: () => void;
}) {
  return (
    <div className="text-center">
      {/* Big letter */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FF6F00] mb-3">
        <span className="text-4xl font-bold text-white">{animal.letter}</span>
      </div>

      {/* Animal name */}
      <h3 className="text-2xl font-bold text-[#5D4E37] mb-1">
        {animal.letter} is for {animal.name}!
      </h3>

      {/* Ubuntu value badge */}
      <div className="inline-flex items-center gap-2 bg-[#E8F5E9] px-4 py-2 rounded-full mb-3">
        <ValueIcon icon={animal.valueIcon} />
        <span className="text-base font-medium text-[#2E7D32]">
          Ubuntu value: {animal.ubuntuValue}
        </span>
      </div>

      {/* Dismiss button */}
      <div className="mt-2">
        <button
          onClick={onDismiss}
          className="px-6 py-2 bg-[#FF6F00] text-white font-bold rounded-full text-lg active:scale-95 transition-transform"
        >
          Keep exploring!
        </button>
      </div>
    </div>
  );
}

/** Simple SVG icons for Ubuntu value display */
function ValueIcon({ icon }: { icon: AnimalDef['valueIcon'] }) {
  const size = 20;
  const icons: Record<AnimalDef['valueIcon'], JSX.Element> = {
    magnifyingGlass: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth={2}>
        <circle cx="10" cy="10" r="7" />
        <line x1="15" y1="15" x2="21" y2="21" />
      </svg>
    ),
    heartFamily: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#2E7D32">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    shield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#2E7D32">
        <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
      </svg>
    ),
    flexedArm: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#2E7D32">
        <path d="M5 16c0-3.87 3.13-7 7-7s7 3.13 7 7M12 3v6M8 5l4 4 4-4" />
      </svg>
    ),
    star: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#2E7D32">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    flower: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#2E7D32">
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="6" r="2.5" opacity={0.7} />
        <circle cx="17" cy="9" r="2.5" opacity={0.7} />
        <circle cx="17" cy="15" r="2.5" opacity={0.7} />
        <circle cx="12" cy="18" r="2.5" opacity={0.7} />
        <circle cx="7" cy="15" r="2.5" opacity={0.7} />
        <circle cx="7" cy="9" r="2.5" opacity={0.7} />
      </svg>
    ),
  };

  return icons[icon] || null;
}
