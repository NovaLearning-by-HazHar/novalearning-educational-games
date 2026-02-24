'use client';

import { useEffect, useCallback } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import GameShell from '@/components/GameShell';
import Scene from '@/components/Scene';
import { useGameStore } from '@/stores/gameStore';
import { useProgressStore } from '@/stores/progressStore';
import { audioManager } from '@/lib/audio';
import { useGameSession } from '@/lib/useGameSession';
import UbuntuGardenGame from './UbuntuGardenGame';
import GardenCelebration from './components/GardenCelebration';
import ItemSelector from './components/ItemSelector';
import MiniTask from './components/MiniTask';
import { useAudioSetup } from './hooks/useAudioSetup';
import { useGardenState, usePlacedCount } from './hooks/useGardenState';
import { PLACEMENT_TARGET, CAMERA_POSITION, CAMERA_FOV } from './lib/constants';

export default function UbuntuGardenPage() {
  const phase = useGameStore((s) => s.phase);
  const reset = useGameStore((s) => s.reset);
  const setPhase = useGameStore((s) => s.setPhase);
  const setActiveCharacter = useGameStore((s) => s.setActiveCharacter);
  const setTargetInteractions = useGameStore((s) => s.setTargetInteractions);
  const setLoaded = useGameStore((s) => s.setLoaded);

  const { ready: audioReady } = useAudioSetup();
  const placedCount = usePlacedCount();
  const currentTaskItemId = useGardenState((s) => s.currentTaskItemId);
  const lang = useGardenState((s) => s.lang);
  const setLang = useGardenState((s) => s.setLang);
  const resetGarden = useGardenState((s) => s.resetGarden);

  const { trackPhase, endSession, resetSession } = useGameSession('ubuntu-garden');
  const addCompletion = useProgressStore((s) => s.addCompletion);

  // Init
  useEffect(() => {
    reset();
    setActiveCharacter('jabu');
    setTargetInteractions(PLACEMENT_TARGET);
  }, [reset, setActiveCharacter, setTargetInteractions]);

  // Audio ready
  useEffect(() => {
    if (audioReady) {
      setLoaded(true);
      audioManager.play('ambient-garden');
    }
  }, [audioReady, setLoaded]);

  // Track phases
  useEffect(() => { trackPhase(phase); }, [phase, trackPhase]);

  // Auto-advance to discover after first item selection
  useEffect(() => {
    if (placedCount > 0 && phase === 'explore') {
      setPhase('discover');
    }
  }, [placedCount, phase, setPhase]);

  // Auto-advance to practice after some placements
  useEffect(() => {
    if (placedCount >= 3 && phase === 'discover') {
      setPhase('practice');
    }
  }, [placedCount, phase, setPhase]);

  // Trigger celebration when enough placements
  useEffect(() => {
    if (placedCount >= PLACEMENT_TARGET && phase !== 'celebrate') {
      setPhase('celebrate');
      audioManager.play('celebrate-melody');
      setTimeout(() => audioManager.playRandomEncouragement(), 800);
      const session = endSession(placedCount);
      addCompletion('ubuntu-garden', placedCount, {
        durationSeconds: session.durationSeconds,
        phasesVisited: session.phasesVisited,
        deviceTier: session.deviceTier,
      });
    }
  }, [placedCount, phase, setPhase, endSession, addCompletion]);

  // Play again
  const handlePlayAgain = useCallback(() => {
    reset();
    resetGarden();
    resetSession();
    setActiveCharacter('jabu');
    setTargetInteractions(PLACEMENT_TARGET);
    setLoaded(true);
    audioManager.play('ambient-garden');
  }, [reset, resetGarden, resetSession, setActiveCharacter, setTargetInteractions, setLoaded]);

  // Languages
  const LANG_OPTIONS = [
    { code: 'en', label: 'EN' },
    { code: 'af', label: 'AF' },
    { code: 'zu', label: 'ZU' },
    { code: 'xh', label: 'XH' },
    { code: 'st', label: 'ST' },
  ];

  // Ubuntu messages per language
  const GARDEN_COUNT_MSG: Record<string, string> = {
    en: `Our garden has ${placedCount} items!`,
    af: `Ons tuin het ${placedCount} items!`,
    zu: `Ingadi yethu ine-${placedCount} izinto!`,
    xh: `Igadi yethu ine-${placedCount} izinto!`,
    st: `Jareteng ea rona e na le lintho tse ${placedCount}!`,
  };

  const CELEBRATE_MSG: Record<string, string> = {
    en: 'What an amazing garden we built together!',
    af: 'Wat \'n wonderlike tuin het ons saam gebou!',
    zu: 'Yeka ingadi emangalisayo esiyakhe ndawonye!',
    xh: 'Hayi igadi emangalisayo esiyakhileyo kunye!',
    st: 'Jarete e makatsang eo re e hahileng mmoho!',
  };

  const DISCOVER_MORE_MSG: Record<string, string> = {
    en: 'Build More',
    af: 'Bou meer',
    zu: 'Yakha okunye',
    xh: 'Yakha ngakumbi',
    st: 'Haha tse ling',
  };

  if (phase === 'celebrate') {
    return (
      <ErrorBoundary>
        <GameShell title="Ubuntu Garden — Build with Jabu">
          <div className="relative w-full h-full">
            <Scene cameraPosition={CAMERA_POSITION} cameraFov={CAMERA_FOV} backgroundColor="#FFF8E1">
              <GardenCelebration />
            </Scene>
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 pointer-events-none">
              <p className="text-lg text-nova-earth/70 mb-2">
                {GARDEN_COUNT_MSG[lang] || GARDEN_COUNT_MSG.en}
              </p>
              <h2 className="text-2xl md:text-3xl font-display text-nova-earth text-center mb-4">
                {CELEBRATE_MSG[lang] || CELEBRATE_MSG.en}
              </h2>
              <button
                onClick={handlePlayAgain}
                className="pointer-events-auto px-8 py-3 bg-nova-sun text-nova-earth font-display text-xl rounded-full shadow-lg active:scale-95 transition-transform min-h-[48px]"
              >
                {DISCOVER_MORE_MSG[lang] || DISCOVER_MORE_MSG.en}
              </button>
            </div>
          </div>
        </GameShell>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <GameShell title="Ubuntu Garden — Build with Jabu">
        <div className="relative w-full h-full">
          <Scene cameraPosition={CAMERA_POSITION} cameraFov={CAMERA_FOV} backgroundColor="#87CEEB">
            <UbuntuGardenGame />
          </Scene>

          {/* Language toggle */}
          <div className="absolute top-2 right-2 z-30 flex gap-1">
            {LANG_OPTIONS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2 py-1 text-xs rounded-full font-body transition-colors min-h-[32px] ${
                  lang === l.code
                    ? 'bg-nova-primary text-white'
                    : 'bg-white/60 text-nova-earth/70'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Community Garden Counter */}
          <div className="absolute top-2 left-2 z-30 bg-white/80 rounded-2xl px-3 py-2 flex items-center gap-2">
            <span className="text-lg">🌱</span>
            <span className="text-sm font-display text-nova-earth">
              {GARDEN_COUNT_MSG[lang] || GARDEN_COUNT_MSG.en}
            </span>
          </div>

          {/* Mini-task popup (when active) */}
          {currentTaskItemId && <MiniTask />}

          {/* Item selector (when no task active) */}
          {!currentTaskItemId && <ItemSelector />}
        </div>
      </GameShell>
    </ErrorBoundary>
  );
}
