'use client';

import { CHARACTERS } from '@/types/constants';

/**
 * Ubuntu celebration scene shown at the end of every game.
 * All 6 characters appear and celebrate together.
 * "We learned this together!"
 *
 * Phase 0: Placeholder. Phase 1: 3D animated scene with audio.
 */
export default function CelebrationScene() {
  const characterNames = Object.values(CHARACTERS).map((c) => c.displayName);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-nova-sun/20 p-8">
      <div className="text-4xl mb-4" aria-hidden="true">🎉</div>
      <p className="text-xl font-display text-nova-earth text-center mb-4">
        We learned this together!
      </p>
      <div className="flex gap-2 flex-wrap justify-center">
        {characterNames.map((name) => (
          <span
            key={name}
            className="px-3 py-1 bg-nova-sky/20 rounded-full text-sm font-body text-nova-earth"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
