'use client';

import { type ReactNode, useState, useCallback, useEffect } from 'react';
import { audioManager } from '@/lib/audio';
import { useGameStore } from '@/stores/gameStore';

interface GameShellProps {
  /** Game title shown to parent (not to child — children cannot read) */
  title: string;
  children: ReactNode;
}

/**
 * Shared wrapper for all games.
 * Provides: loading state, audio toggle, parent info bar, audio unlock on first touch.
 */
export default function GameShell({ title, children }: GameShellProps) {
  const [muted, setMuted] = useState(false);
  const isLoaded = useGameStore((s) => s.isLoaded);

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    audioManager.setMuted(next);
  }, [muted]);

  // Unlock audio on first interaction (required by mobile browsers)
  useEffect(() => {
    const unlock = () => audioManager.unlock();
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => window.removeEventListener('pointerdown', unlock);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-nova-sand overflow-hidden">
      {/* Parent info bar — minimal, not distracting */}
      <header className="flex items-center justify-between px-4 py-2 bg-nova-sky/10 shrink-0">
        <span className="text-xs text-nova-earth/60 font-body">{title}</span>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-nova-sun/20 active:bg-nova-sun/40 transition-colors"
          aria-label={muted ? 'Unmute sound' : 'Mute sound'}
          onClick={toggleMute}
        >
          <span className="text-lg" aria-hidden="true">
            {muted ? '🔇' : '🔊'}
          </span>
        </button>
      </header>

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-nova-sand">
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl animate-pulse" aria-hidden="true">🌍</div>
            <p className="text-sm text-nova-earth/60 font-body">Loading...</p>
          </div>
        </div>
      )}

      {/* Game viewport */}
      <main className="flex-1 relative game-viewport">{children}</main>
    </div>
  );
}
