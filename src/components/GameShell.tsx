'use client';

import { type ReactNode } from 'react';

interface GameShellProps {
  /** Game title shown to parent (not to child — children cannot read) */
  title: string;
  children: ReactNode;
}

/**
 * Shared wrapper for all games.
 * Provides: loading indicator, audio toggle, parent info bar.
 */
export default function GameShell({ title, children }: GameShellProps) {
  return (
    <div className="flex flex-col h-screen w-screen bg-nova-sand overflow-hidden">
      {/* Parent info bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-nova-sky/10">
        <span className="text-xs text-nova-earth/60 font-body">{title}</span>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-nova-sun/20"
          aria-label="Toggle sound"
        >
          <span className="text-lg" aria-hidden="true">🔊</span>
        </button>
      </header>

      {/* Game viewport */}
      <main className="flex-1 relative game-viewport">{children}</main>
    </div>
  );
}
