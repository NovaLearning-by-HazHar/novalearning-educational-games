'use client';

import { useEffect, useCallback } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import GameShell from '@/components/GameShell';
import Scene from '@/components/Scene';
import { useGameStore } from '@/stores/gameStore';
import { useProgressStore } from '@/stores/progressStore';
import { audioManager } from '@/lib/audio';
import { useGameSession } from '@/lib/useGameSession';
import MzansiJourneyGame from './MzansiJourneyGame';
import MzansiCelebration from './components/MzansiCelebration';
import SAMap from './components/SAMap';
import ProvincePanel from './components/ProvincePanel';
import { useAudioSetup } from './hooks/useAudioSetup';
import { useMzansiState, useVisitCount } from './hooks/useMzansiState';
import { LANG_LABELS, type Lang } from './data/provinces';
import {
  VISIT_TARGET,
  CAMERA_POSITION,
  CAMERA_FOV,
  BG_COLOR,
  TEXT_COLOR,
} from './lib/constants';

/**
 * Mzansi Journey — Tour Mode.
 *
 * Gameplay: Liya guides child to tap provinces on an SVG map.
 * Each tap: province panel slides in with 3D animal + 3 facts + language sample.
 * After visiting all 9: 3 characters celebrate together (Ubuntu).
 * Ubuntu: "Collect a friend from each province!" — community sticker book.
 * CAPS: Geography, Social Sciences, Cultural Studies.
 */
export default function MzansiJourneyPage() {
  const phase = useGameStore((s) => s.phase);
  const reset = useGameStore((s) => s.reset);
  const setPhase = useGameStore((s) => s.setPhase);
  const setActiveCharacter = useGameStore((s) => s.setActiveCharacter);
  const setTargetInteractions = useGameStore((s) => s.setTargetInteractions);
  const setLoaded = useGameStore((s) => s.setLoaded);

  const { ready: audioReady } = useAudioSetup();
  const visitCount = useVisitCount();
  const selectedProvince = useMzansiState((s) => s.selectedProvince);
  const visitedProvinces = useMzansiState((s) => s.visitedProvinces);
  const showPanel = useMzansiState((s) => s.showPanel);
  const currentFactIndex = useMzansiState((s) => s.currentFactIndex);
  const lang = useMzansiState((s) => s.lang);
  const selectProvince = useMzansiState((s) => s.selectProvince);
  const nextFact = useMzansiState((s) => s.nextFact);
  const closePanel = useMzansiState((s) => s.closePanel);
  const setLang = useMzansiState((s) => s.setLang);
  const resetMzansi = useMzansiState((s) => s.resetMzansi);

  const { trackPhase, endSession, resetSession } = useGameSession('mzansi-journey');
  const addCompletion = useProgressStore((s) => s.addCompletion);

  // Init
  useEffect(() => {
    reset();
    setActiveCharacter('liya');
    setTargetInteractions(VISIT_TARGET);
  }, [reset, setActiveCharacter, setTargetInteractions]);

  // Audio ready
  useEffect(() => {
    if (audioReady) {
      setLoaded(true);
      audioManager.play('ambient-nature');
    }
  }, [audioReady, setLoaded]);

  // Track phases
  useEffect(() => {
    trackPhase(phase);
  }, [phase, trackPhase]);

  // Auto-advance to discover after first province tap
  useEffect(() => {
    if (selectedProvince && phase === 'explore') {
      setPhase('discover');
    }
  }, [selectedProvince, phase, setPhase]);

  // Auto-advance to practice after first visit
  useEffect(() => {
    if (visitCount > 0 && phase === 'discover') {
      setPhase('practice');
    }
  }, [visitCount, phase, setPhase]);

  // Trigger celebration when all 9 provinces visited
  useEffect(() => {
    if (visitCount >= VISIT_TARGET && phase !== 'celebrate') {
      setPhase('celebrate');
      audioManager.play('celebrate-melody');
      setTimeout(() => audioManager.playRandomEncouragement(), 800);
      const session = endSession(visitCount);
      addCompletion('mzansi-journey', visitCount, {
        durationSeconds: session.durationSeconds,
        phasesVisited: session.phasesVisited,
        deviceTier: session.deviceTier,
      });
    }
  }, [visitCount, phase, setPhase, endSession, addCompletion]);

  // Province selection handler
  const handleSelectProvince = useCallback(
    (id: string) => {
      selectProvince(id);
      audioManager.play('province-chime');
    },
    [selectProvince]
  );

  // Next fact handler
  const handleNextFact = useCallback(() => {
    nextFact();
    audioManager.play('map-tap');
  }, [nextFact]);

  // Close panel handler
  const handleClosePanel = useCallback(() => {
    closePanel();
    audioManager.play('sticker-collect');
  }, [closePanel]);

  // Play again
  const handlePlayAgain = useCallback(() => {
    reset();
    resetMzansi();
    resetSession();
    setActiveCharacter('liya');
    setTargetInteractions(VISIT_TARGET);
    setLoaded(true);
    audioManager.play('ambient-nature');
  }, [reset, resetMzansi, resetSession, setActiveCharacter, setTargetInteractions, setLoaded]);

  // Language options
  const langOptions = Object.entries(LANG_LABELS) as [Lang, string][];

  if (phase === 'celebrate') {
    return (
      <ErrorBoundary>
        <GameShell title="Mzansi Journey with Liya">
          <div className="relative w-full h-full">
            <Scene cameraPosition={CAMERA_POSITION} cameraFov={CAMERA_FOV} backgroundColor={BG_COLOR}>
              <MzansiCelebration />
            </Scene>
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 pointer-events-none">
              <p className="text-lg mb-2" style={{ color: TEXT_COLOR + 'B0' }}>
                Our class visited all {visitCount} provinces!
              </p>
              <h2
                className="text-2xl md:text-3xl font-bold text-center mb-4"
                style={{ color: TEXT_COLOR }}
              >
                What an amazing journey together!
              </h2>
              <button
                onClick={handlePlayAgain}
                className="pointer-events-auto px-8 py-3 bg-nova-sun font-bold text-xl rounded-full shadow-lg active:scale-95 transition-transform"
                style={{ color: TEXT_COLOR }}
              >
                Journey Again
              </button>
            </div>
          </div>
        </GameShell>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <GameShell title="Mzansi Journey with Liya">
        <div className="relative w-full h-full">
          {/* 3D scene (background — Liya + animal + ground) */}
          <Scene cameraPosition={CAMERA_POSITION} cameraFov={CAMERA_FOV} backgroundColor="#87CEEB">
            <MzansiJourneyGame />
          </Scene>

          {/* Language toggle — always visible */}
          <div className="absolute top-2 right-2 z-30 flex gap-1">
            {langOptions.map(([code, label]) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-2 py-1 text-xs rounded-full font-bold transition-colors ${
                  lang === code
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/60'
                }`}
                style={{ color: lang === code ? undefined : TEXT_COLOR + '99', minWidth: '32px', minHeight: '32px' }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Community Journey Counter */}
          <div className="absolute top-2 left-2 z-30 bg-white/80 rounded-2xl px-3 py-2 flex items-center gap-2">
            <span className="text-lg">🗺</span>
            <span className="text-sm font-bold" style={{ color: TEXT_COLOR }}>
              {visitCount} / 9 provinces visited!
            </span>
          </div>

          {/* Sticker book row — visited province indicators */}
          {visitedProvinces.length > 0 && !showPanel && (
            <div className="absolute top-12 left-2 z-30 flex gap-1 flex-wrap max-w-[200px]">
              {visitedProvinces.map((pid) => (
                <div
                  key={pid}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: getProvinceColor(pid) }}
                  title={pid.replace(/-/g, ' ')}
                >
                  {getProvinceAbbr(pid)}
                </div>
              ))}
            </div>
          )}

          {/* SVG Map overlay (when no panel is showing) */}
          {!showPanel && (
            <div className="absolute bottom-2 left-0 right-0 z-30 flex justify-center px-2">
              <div className="bg-white/85 rounded-2xl p-2 shadow-lg" style={{ maxWidth: '380px', width: '100%' }}>
                <SAMap
                  selectedProvince={selectedProvince}
                  visitedProvinces={visitedProvinces}
                  onSelectProvince={handleSelectProvince}
                />
              </div>
            </div>
          )}

          {/* Province fact panel (slide-in when province selected) */}
          {showPanel && selectedProvince && (
            <ProvincePanel
              provinceId={selectedProvince}
              lang={lang}
              currentFactIndex={currentFactIndex}
              onNextFact={handleNextFact}
              onClose={handleClosePanel}
            />
          )}
        </div>
      </GameShell>
    </ErrorBoundary>
  );
}

/** Helper: get province color by ID */
function getProvinceColor(id: string): string {
  const colors: Record<string, string> = {
    'western-cape': '#42A5F5',
    'eastern-cape': '#66BB6A',
    'northern-cape': '#FF7043',
    'kwazulu-natal': '#AB47BC',
    'free-state': '#FFD54F',
    'gauteng': '#FF5722',
    'mpumalanga': '#4CAF50',
    'limpopo': '#8D6E63',
    'north-west': '#FFCA28',
  };
  return colors[id] || '#999999';
}

/** Helper: short province abbreviation */
function getProvinceAbbr(id: string): string {
  const abbrs: Record<string, string> = {
    'western-cape': 'WC',
    'eastern-cape': 'EC',
    'northern-cape': 'NC',
    'kwazulu-natal': 'KZ',
    'free-state': 'FS',
    'gauteng': 'GP',
    'mpumalanga': 'MP',
    'limpopo': 'LP',
    'north-west': 'NW',
  };
  return abbrs[id] || '??';
}
