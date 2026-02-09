'use client';

import { TOTAL_STROKES } from '../lib/constants';

interface TracingProgressOverlayProps {
  /** Completed stroke count */
  completedCount: number;
  /** Overall progress 0-1 */
  overallProgress: number;
  /** Show Thandi's hint */
  showHint: boolean;
  /** Whether overlay is visible */
  visible: boolean;
}

/**
 * HTML overlay showing letter tracing progress and Thandi hint bubble.
 * Positioned absolute over the 3D canvas.
 */
export default function TracingProgressOverlay({
  completedCount,
  overallProgress,
  showHint,
  visible,
}: TracingProgressOverlayProps) {
  if (!visible) return null;

  const progressPercent = Math.round(overallProgress * 100);

  return (
    <div className="absolute top-16 left-0 right-0 z-20 pointer-events-none flex flex-col items-center gap-3">
      {/* Stroke indicators */}
      <div className="flex gap-3">
        {Array.from({ length: TOTAL_STROKES }).map((_, i) => (
          <div
            key={i}
            className={`w-10 h-3 rounded-full border-2 transition-all duration-300 ${
              i < completedCount
                ? 'bg-green-500 border-green-500'
                : 'bg-gray-300 border-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Progress label */}
      <p className="text-lg font-display text-nova-earth font-bold">
        {completedCount < TOTAL_STROKES
          ? `Stroke ${Math.min(completedCount + 1, TOTAL_STROKES)} of ${TOTAL_STROKES}`
          : 'Complete!'}
      </p>

      {/* Progress bar */}
      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-nova-sun rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Thandi hint bubble */}
      {showHint && (
        <div className="mt-2 bg-white/90 rounded-2xl px-4 py-2 shadow-lg animate-pulse">
          <p className="text-base font-display text-nova-earth">
            Trace the letter with your finger!
          </p>
        </div>
      )}
    </div>
  );
}
