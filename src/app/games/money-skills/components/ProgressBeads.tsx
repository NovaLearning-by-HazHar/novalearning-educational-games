'use client';

import type { GamePhase } from '@/types/game';

interface ProgressBeadsProps {
  currentPhase: GamePhase;
  visible?: boolean;
}

const PHASES: { key: GamePhase; label: string; color: string }[] = [
  { key: 'explore', label: 'Explore', color: '#52B788' },
  { key: 'discover', label: 'Discover', color: '#4EA8DE' },
  { key: 'practice', label: 'Practice', color: '#9B72CF' },
  { key: 'celebrate', label: 'Celebrate', color: '#FF6B6B' },
];

/**
 * 4-bead Orboot phase indicator (HTML overlay).
 * Shows which phase the child is in with colored beads.
 * No text labels for children -- just visual beads on a string.
 */
export default function ProgressBeads({ currentPhase, visible = true }: ProgressBeadsProps) {
  if (!visible) return null;

  const currentIndex = PHASES.findIndex((p) => p.key === currentPhase);

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 pointer-events-none">
      {/* String connecting beads */}
      <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-amber-300/50 -translate-y-1/2" />

      {PHASES.map((phase, i) => {
        const isActive = i <= currentIndex;
        const isCurrent = phase.key === currentPhase;

        return (
          <div
            key={phase.key}
            className="relative flex items-center justify-center"
            style={{
              width: isCurrent ? 20 : 14,
              height: isCurrent ? 20 : 14,
              borderRadius: '50%',
              backgroundColor: isActive ? phase.color : '#D4D4D4',
              border: isCurrent ? '2px solid white' : 'none',
              boxShadow: isCurrent ? '0 0 6px rgba(0,0,0,0.3)' : 'none',
              transition: 'all 0.3s ease',
              marginLeft: i === 0 ? 0 : 8,
            }}
          />
        );
      })}
    </div>
  );
}
