'use client';

interface ProgressOverlayProps {
  pickedCount: number;
  total: number;
  showHint: boolean;
  visible: boolean;
}

/**
 * HTML overlay showing mango collection progress and Sipho hint bubble.
 * Positioned absolute over the 3D canvas, pointer-events-none.
 */
export default function ProgressOverlay({
  pickedCount,
  total,
  showHint,
  visible,
}: ProgressOverlayProps) {
  if (!visible) return null;

  return (
    <div className="absolute top-16 left-0 right-0 z-20 pointer-events-none flex flex-col items-center gap-3">
      {/* Mango indicators */}
      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
              i < pickedCount
                ? 'bg-nova-sun border-nova-sun scale-110'
                : 'bg-gray-300 border-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Count label */}
      <p className="text-lg font-display text-nova-earth font-bold">
        {pickedCount} of {total}
      </p>

      {/* Sipho hint bubble */}
      {showHint && (
        <div className="mt-2 bg-white/90 rounded-2xl px-4 py-2 shadow-lg animate-pulse">
          <p className="text-base font-display text-nova-earth">
            Tap the mangoes!
          </p>
        </div>
      )}
    </div>
  );
}
