'use client';

import { useEffect, useCallback } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import GameShell from '@/components/GameShell';
import Scene from '@/components/Scene';
import { useGameStore } from '@/stores/gameStore';
import { useProgressStore } from '@/stores/progressStore';
import { audioManager } from '@/lib/audio';
import { useGameSession } from '@/lib/useGameSession';
import BontseGame from './BontseGame';
import BontseCelebration from './components/BontseCelebration';
import { useAudioSetup } from './hooks/useAudioSetup';
import { useBontseState, useDiscoveryCount } from './hooks/useBontseState';
import { CATEGORIES, type DiscoveryCategory } from './data/discoveries';
import { DISCOVERY_TARGET, CATEGORY_COLORS, CAMERA_POSITION, CAMERA_FOV } from './lib/constants';

export default function BontsePage() {
  const phase = useGameStore((s) => s.phase);
  const reset = useGameStore((s) => s.reset);
  const setPhase = useGameStore((s) => s.setPhase);
  const setActiveCharacter = useGameStore((s) => s.setActiveCharacter);
  const setTargetInteractions = useGameStore((s) => s.setTargetInteractions);
  const setLoaded = useGameStore((s) => s.setLoaded);

  const { ready: audioReady } = useAudioSetup();
  const discoveryCount = useDiscoveryCount();
  const selectedCategory = useBontseState((s) => s.selectedCategory);
  const selectedItemId = useBontseState((s) => s.selectedItemId);
  const showPanel = useBontseState((s) => s.showPanel);
  const currentFactIndex = useBontseState((s) => s.currentFactIndex);
  const lang = useBontseState((s) => s.lang);
  const selectCategory = useBontseState((s) => s.selectCategory);
  const selectItem = useBontseState((s) => s.selectItem);
  const nextFact = useBontseState((s) => s.nextFact);
  const closePanel = useBontseState((s) => s.closePanel);
  const setLang = useBontseState((s) => s.setLang);
  const resetBontse = useBontseState((s) => s.resetBontse);

  const { trackPhase, endSession, resetSession } = useGameSession('bontse');
  const addCompletion = useProgressStore((s) => s.addCompletion);

  // Init
  useEffect(() => {
    reset();
    setActiveCharacter('sipho');
    setTargetInteractions(DISCOVERY_TARGET);
  }, [reset, setActiveCharacter, setTargetInteractions]);

  // Audio ready
  useEffect(() => {
    if (audioReady) {
      setLoaded(true);
      audioManager.play('ambient-nature');
    }
  }, [audioReady, setLoaded]);

  // Track phases
  useEffect(() => { trackPhase(phase); }, [phase, trackPhase]);

  // Auto-advance to discover after first category tap
  useEffect(() => {
    if (selectedCategory && phase === 'explore') {
      setPhase('discover');
    }
  }, [selectedCategory, phase, setPhase]);

  // Auto-advance to practice after first discovery
  useEffect(() => {
    if (discoveryCount > 0 && phase === 'discover') {
      setPhase('practice');
    }
  }, [discoveryCount, phase, setPhase]);

  // Trigger celebration when enough discoveries
  useEffect(() => {
    if (discoveryCount >= DISCOVERY_TARGET && phase !== 'celebrate') {
      setPhase('celebrate');
      audioManager.play('celebrate-melody');
      setTimeout(() => audioManager.playRandomEncouragement(), 800);
      const session = endSession(discoveryCount);
      addCompletion('bontse', discoveryCount, {
        durationSeconds: session.durationSeconds,
        phasesVisited: session.phasesVisited,
        deviceTier: session.deviceTier,
      });
    }
  }, [discoveryCount, phase, setPhase, endSession, addCompletion]);

  // Item selection handler
  const handleItemTap = useCallback((itemId: string) => {
    selectItem(itemId);
    audioManager.play('discovery-chime');
  }, [selectItem]);

  // Play again
  const handlePlayAgain = useCallback(() => {
    reset();
    resetBontse();
    resetSession();
    setActiveCharacter('sipho');
    setTargetInteractions(DISCOVERY_TARGET);
    setLoaded(true);
    audioManager.play('ambient-nature');
  }, [reset, resetBontse, resetSession, setActiveCharacter, setTargetInteractions, setLoaded]);

  // Get current category data
  const categoryData = selectedCategory ? CATEGORIES.find((c) => c.id === selectedCategory) : null;
  const selectedItem = categoryData?.items.find((i) => i.id === selectedItemId);

  // Languages
  const LANG_OPTIONS = [
    { code: 'en', label: 'EN' },
    { code: 'af', label: 'AF' },
    { code: 'zu', label: 'ZU' },
    { code: 'xh', label: 'XH' },
    { code: 'st', label: 'ST' },
  ];

  if (phase === 'celebrate') {
    return (
      <ErrorBoundary>
        <GameShell title="Bontse — Discover with Sipho">
          <div className="relative w-full h-full">
            <Scene cameraPosition={CAMERA_POSITION} cameraFov={CAMERA_FOV} backgroundColor="#FFF8E1">
              <BontseCelebration />
            </Scene>
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 pointer-events-none">
              <p className="text-lg text-nova-earth/70 mb-2">
                Our class discovered {discoveryCount} things!
              </p>
              <h2 className="text-2xl md:text-3xl font-display text-nova-earth text-center mb-4">
                What amazing explorers we are!
              </h2>
              <button
                onClick={handlePlayAgain}
                className="pointer-events-auto px-8 py-3 bg-nova-sun text-nova-earth font-display text-xl rounded-full shadow-lg active:scale-95 transition-transform"
              >
                Discover More
              </button>
            </div>
          </div>
        </GameShell>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <GameShell title="Bontse — Discover with Sipho">
        <div className="relative w-full h-full">
          <Scene cameraPosition={CAMERA_POSITION} cameraFov={CAMERA_FOV} backgroundColor="#87CEEB">
            <BontseGame />
          </Scene>

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

          {/* Community Discovery Counter */}
          <div className="absolute top-2 left-2 z-30 bg-white/80 rounded-2xl px-3 py-2 flex items-center gap-2">
            <span className="text-lg">🌍</span>
            <span className="text-sm font-display text-nova-earth">
              Our class found {discoveryCount} discoveries!
            </span>
          </div>

          {/* Category selector */}
          {!selectedCategory && (
            <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-3 px-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { selectCategory(cat.id); audioManager.play('category-tap'); }}
                  className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl bg-white/90 shadow-md active:scale-95 transition-transform min-w-[72px]"
                  style={{ borderBottom: `3px solid ${CATEGORY_COLORS[cat.id]}` }}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-xs font-display text-nova-earth">{cat.label[lang] || cat.label.en}</span>
                </button>
              ))}
            </div>
          )}

          {/* Item grid (when category selected, no item selected) */}
          {selectedCategory && !showPanel && (
            <div className="absolute bottom-4 left-0 right-0 z-30 px-4">
              <div className="bg-white/90 rounded-2xl p-3 shadow-lg max-w-sm mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-display text-nova-earth">
                    {categoryData?.label[lang] || categoryData?.label.en}
                  </h3>
                  <button
                    onClick={() => selectCategory(null as unknown as DiscoveryCategory)}
                    className="text-xs text-nova-earth/50 px-2 py-1"
                  >
                    Back
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {categoryData?.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemTap(item.id)}
                      className="flex items-center gap-2 p-3 rounded-xl bg-nova-sand/50 active:scale-95 transition-transform"
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <span className="text-xs font-body text-nova-earth">
                        {item.name[lang] || item.name.en}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fact panel (when item selected) */}
          {showPanel && selectedItem && (
            <div className="absolute bottom-4 left-0 right-0 z-30 px-4">
              <div className="bg-white/95 rounded-2xl p-4 shadow-lg max-w-sm mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{selectedItem.emoji}</span>
                  <h3 className="text-lg font-display text-nova-earth">
                    {selectedItem.name[lang] || selectedItem.name.en}
                  </h3>
                </div>
                <p className="text-sm font-body text-nova-earth/80 mb-3 min-h-[40px]">
                  {(selectedItem.facts[lang] || selectedItem.facts.en)[currentFactIndex]}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i === currentFactIndex ? 'bg-nova-primary' : 'bg-nova-earth/20'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { nextFact(); audioManager.play('category-tap'); }}
                      className="px-4 py-2 text-xs font-display bg-nova-sun/30 text-nova-earth rounded-full active:scale-95 transition-transform"
                    >
                      Next Fact
                    </button>
                    <button
                      onClick={closePanel}
                      className="px-4 py-2 text-xs font-display bg-nova-primary/20 text-nova-earth rounded-full active:scale-95 transition-transform"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </GameShell>
    </ErrorBoundary>
  );
}
