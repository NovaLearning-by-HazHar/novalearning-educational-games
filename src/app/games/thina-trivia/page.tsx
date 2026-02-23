'use client';

import { useEffect, useCallback } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import GameShell from '@/components/GameShell';
import { useGameStore } from '@/stores/gameStore';
import { useProgressStore } from '@/stores/progressStore';
import { audioManager } from '@/lib/audio';
import { useGameSession } from '@/lib/useGameSession';
import ThinaTriviaGame from './ThinaTriviaGame';
import TriviaCelebration from './components/TriviaCelebration';
import { useAudioSetup } from './hooks/useAudioSetup';
import { useTriviaState, useStarCount } from './hooks/useTriviaState';
import { STAR_TARGET, LANG_OPTIONS } from './lib/constants';

export default function ThinaTriviaPage() {
  const phase = useGameStore((s) => s.phase);
  const reset = useGameStore((s) => s.reset);
  const setPhase = useGameStore((s) => s.setPhase);
  const setActiveCharacter = useGameStore((s) => s.setActiveCharacter);
  const setTargetInteractions = useGameStore((s) => s.setTargetInteractions);
  const setLoaded = useGameStore((s) => s.setLoaded);

  const { ready: audioReady } = useAudioSetup();
  const starCount = useStarCount();
  const celebrating = useTriviaState((s) => s.celebrating);
  const lang = useTriviaState((s) => s.lang);
  const setLang = useTriviaState((s) => s.setLang);
  const resetTrivia = useTriviaState((s) => s.resetTrivia);

  const { trackPhase, endSession, resetSession } = useGameSession('thina-trivia');
  const addCompletion = useProgressStore((s) => s.addCompletion);

  // Init
  useEffect(() => {
    reset();
    setActiveCharacter('amahle');
    setTargetInteractions(STAR_TARGET);
  }, [reset, setActiveCharacter, setTargetInteractions]);

  // Audio ready
  useEffect(() => {
    if (audioReady) {
      setLoaded(true);
    }
  }, [audioReady, setLoaded]);

  // Track phases
  useEffect(() => { trackPhase(phase); }, [phase, trackPhase]);

  // Auto-advance phases
  useEffect(() => {
    if (starCount > 0 && phase === 'explore') {
      setPhase('practice');
    }
  }, [starCount, phase, setPhase]);

  // Trigger celebration
  useEffect(() => {
    if (celebrating && phase !== 'celebrate') {
      setPhase('celebrate');
      audioManager.play('celebrate-melody');
      setTimeout(() => audioManager.playRandomEncouragement(), 800);
      const session = endSession(starCount);
      addCompletion('thina-trivia', starCount, {
        durationSeconds: session.durationSeconds,
        phasesVisited: session.phasesVisited,
        deviceTier: session.deviceTier,
      });
    }
  }, [celebrating, phase, setPhase, endSession, addCompletion, starCount]);

  // Play again
  const handlePlayAgain = useCallback(() => {
    reset();
    resetTrivia();
    resetSession();
    setActiveCharacter('amahle');
    setTargetInteractions(STAR_TARGET);
    setLoaded(true);
  }, [reset, resetTrivia, resetSession, setActiveCharacter, setTargetInteractions, setLoaded]);

  // Celebration screen
  if (phase === 'celebrate') {
    return (
      <ErrorBoundary>
        <GameShell title="Thina Trivia — Quiz with Amahle">
          <div className="relative w-full h-full bg-gradient-to-b from-[#FFF8F0] to-[#FFE0B2]">
            <TriviaCelebration
              lang={lang}
              stars={starCount}
              onPlayAgain={handlePlayAgain}
            />
          </div>
        </GameShell>
      </ErrorBoundary>
    );
  }

  // Main quiz screen — NO Canvas/Scene, pure HTML
  return (
    <ErrorBoundary>
      <GameShell title="Thina Trivia — Quiz with Amahle">
        <div className="relative w-full h-full bg-gradient-to-b from-[#FFF8F0] to-[#FFE0B2]">
          {/* Language toggle */}
          <div className="absolute top-2 right-2 z-30 flex gap-1">
            {LANG_OPTIONS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2 py-1 text-xs rounded-full font-body transition-colors ${
                  lang === l.code
                    ? 'bg-nova-primary text-white'
                    : 'bg-white/60 text-nova-earth/70'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Main game content */}
          <ThinaTriviaGame />
        </div>
      </GameShell>
    </ErrorBoundary>
  );
}
