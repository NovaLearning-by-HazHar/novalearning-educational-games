'use client';

import { useEffect, useCallback } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import GameShell from '@/components/GameShell';
import Scene from '@/components/Scene';
import { useGameStore } from '@/stores/gameStore';
import { useProgressStore } from '@/stores/progressStore';
import { audioManager } from '@/lib/audio';
import { useGameSession } from '@/lib/useGameSession';
import UbuntuStoriesGame from './UbuntuStoriesGame';
import StoryCelebration from './components/StoryCelebration';
import StoryPanel from './components/StoryPanel';
import { useAudioSetup } from './hooks/useAudioSetup';
import { useStoryState, useCompletedClueCount } from './hooks/useStoryState';
import { STORIES, type LangCode } from './data/stories';
import { CAMERA_POSITION, CAMERA_FOV, CLUE_TARGET } from './lib/constants';

const LANG_OPTIONS: { code: LangCode; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'af', label: 'AF' },
  { code: 'zu', label: 'ZU' },
  { code: 'xh', label: 'XH' },
  { code: 'st', label: 'ST' },
];

export default function UbuntuStoriesPage() {
  const phase = useGameStore((s) => s.phase);
  const reset = useGameStore((s) => s.reset);
  const setPhase = useGameStore((s) => s.setPhase);
  const setActiveCharacter = useGameStore((s) => s.setActiveCharacter);
  const setTargetInteractions = useGameStore((s) => s.setTargetInteractions);
  const setLoaded = useGameStore((s) => s.setLoaded);

  const { ready: audioReady } = useAudioSetup();
  const completedClueCount = useCompletedClueCount();
  const currentStoryIndex = useStoryState((s) => s.currentStoryIndex);
  const currentStepIndex = useStoryState((s) => s.currentStepIndex);
  const lang = useStoryState((s) => s.lang);
  const setLang = useStoryState((s) => s.setLang);
  const selectStory = useStoryState((s) => s.selectStory);
  const resetStory = useStoryState((s) => s.resetStory);

  const { trackPhase, endSession, resetSession } = useGameSession('ubuntu-stories');
  const addCompletion = useProgressStore((s) => s.addCompletion);

  // Init
  useEffect(() => {
    reset();
    setActiveCharacter('gogo_thandi');
    setTargetInteractions(CLUE_TARGET);
  }, [reset, setActiveCharacter, setTargetInteractions]);

  // Audio ready
  useEffect(() => {
    if (audioReady) {
      setLoaded(true);
    }
  }, [audioReady, setLoaded]);

  // Track phases
  useEffect(() => { trackPhase(phase); }, [phase, trackPhase]);

  // Auto-advance to discover after story selection
  useEffect(() => {
    if (currentStoryIndex >= 0 && phase === 'explore') {
      setPhase('discover');
    }
  }, [currentStoryIndex, phase, setPhase]);

  // Auto-advance to practice after first clue
  useEffect(() => {
    if (completedClueCount > 0 && phase === 'discover') {
      setPhase('practice');
    }
  }, [completedClueCount, phase, setPhase]);

  // Check if current story chapter is complete (at celebration step)
  const currentStory = currentStoryIndex >= 0 ? STORIES[currentStoryIndex] : null;
  const currentChapter = currentStory?.chapters[0];
  const isAtCelebration = currentChapter
    ? currentStepIndex >= currentChapter.steps.length - 1
      && currentChapter.steps[currentStepIndex]?.type === 'celebration'
    : false;

  // Trigger celebration when all clues in chapter are done
  useEffect(() => {
    if (isAtCelebration && phase !== 'celebrate') {
      setPhase('celebrate');
      audioManager.play('celebrate-melody');
      setTimeout(() => audioManager.playRandomEncouragement(), 800);
      const session = endSession(completedClueCount);
      addCompletion('ubuntu-stories', completedClueCount, {
        durationSeconds: session.durationSeconds,
        phasesVisited: session.phasesVisited,
        deviceTier: session.deviceTier,
      });
    }
  }, [isAtCelebration, phase, setPhase, endSession, addCompletion, completedClueCount]);

  // Play again
  const handlePlayAgain = useCallback(() => {
    reset();
    resetStory();
    resetSession();
    setActiveCharacter('gogo_thandi');
    setTargetInteractions(CLUE_TARGET);
    setLoaded(true);
  }, [reset, resetStory, resetSession, setActiveCharacter, setTargetInteractions, setLoaded]);

  // Story selection handler
  const handleSelectStory = useCallback((index: number) => {
    selectStory(index);
    audioManager.play('page-turn');
  }, [selectStory]);

  // ─── Celebration screen ─────────────────────────────────────────────
  if (phase === 'celebrate') {
    const celebrationText: Record<string, string> = {
      en: 'Together we solved the mystery!',
      af: 'Saam het ons die raaisel opgelos!',
      zu: 'Ndawonye sixazulule imfihlo!',
      xh: 'Kunye sisombulule imfihlelo!',
      st: 'Mmoho re rarollotse sephiri!',
    };

    const badgeText: Record<string, string> = {
      en: 'Ubuntu Story Badge earned!',
      af: 'Ubuntu Storie-kenteken verdien!',
      zu: 'Ibhejana Le-Ubuntu Lendaba litholakele!',
      xh: 'Ibheji Yebali le-Ubuntu ifunyenwe!',
      st: 'Bache ea Pale ea Ubuntu e fumanehile!',
    };

    return (
      <ErrorBoundary>
        <GameShell title="Ubuntu Stories">
          <div className="relative w-full h-full">
            <Scene cameraPosition={CAMERA_POSITION} cameraFov={CAMERA_FOV} backgroundColor="#FFF8E1">
              <StoryCelebration />
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

            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 pointer-events-none">
              <div className="bg-nova-sun/20 rounded-full px-4 py-1 mb-2">
                <span className="text-sm font-display text-nova-earth">
                  {badgeText[lang] || badgeText.en}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display text-nova-earth text-center mb-2 px-4">
                {celebrationText[lang] || celebrationText.en}
              </h2>
              <p className="text-sm text-nova-earth/60 mb-4">
                {completedClueCount} {{ en: 'clues solved', af: 'leidrade opgelos', zu: 'izimpawu zitholakele', xh: 'iimpawu zifunyenwe', st: 'lipontso li rarollotse' }[lang] || 'clues solved'}
              </p>
              <button
                onClick={handlePlayAgain}
                className="pointer-events-auto px-8 py-3 bg-nova-sun text-nova-earth font-display text-xl rounded-full shadow-lg active:scale-95 transition-transform min-h-[48px]"
              >
                {{ en: 'Read Another Story', af: 'Lees Nog \'n Storie', zu: 'Funda Enye Indaba', xh: 'Funda Elinye Ibali', st: 'Bala Pale e \'Ngoe' }[lang] || 'Read Another Story'}
              </button>
            </div>
          </div>
        </GameShell>
      </ErrorBoundary>
    );
  }

  // ─── Story selection screen ─────────────────────────────────────────
  if (currentStoryIndex < 0) {
    const selectTitle: Record<string, string> = {
      en: 'Choose a Story',
      af: 'Kies \'n Storie',
      zu: 'Khetha Indaba',
      xh: 'Khetha Ibali',
      st: 'Khetha Pale',
    };

    return (
      <ErrorBoundary>
        <GameShell title="Ubuntu Stories">
          <div className="relative w-full h-full">
            <Scene cameraPosition={CAMERA_POSITION} cameraFov={CAMERA_FOV} backgroundColor="#87CEEB">
              <UbuntuStoriesGame />
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

            {/* Gogo Thandi intro */}
            <div className="absolute top-14 left-2 z-30 bg-white/80 rounded-2xl px-3 py-2 max-w-[240px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{'\uD83D\uDC75'}</span>
                <span className="text-xs font-display text-nova-earth">Gogo Thandi</span>
              </div>
              <p className="text-xs font-body text-nova-earth/70">
                {{ en: 'Come, let me tell you a story about Ubuntu!', af: 'Kom, laat ek jou \'n storie vertel oor Ubuntu!', zu: 'Woza, ake ngikuxoxele indaba ye-Ubuntu!', xh: 'Yiza, mandikuxelele ibali le-Ubuntu!', st: 'Tloo, ke u bolelle pale ea Ubuntu!' }[lang] || 'Come, let me tell you a story about Ubuntu!'}
              </p>
            </div>

            {/* Story selection cards */}
            <div className="absolute bottom-4 left-0 right-0 z-30 px-4">
              <h3 className="text-center text-sm font-display text-white mb-3 drop-shadow">
                {selectTitle[lang] || selectTitle.en}
              </h3>
              <div className="flex justify-center gap-3">
                {STORIES.map((story, idx) => (
                  <button
                    key={story.id}
                    onClick={() => handleSelectStory(idx)}
                    className="flex flex-col items-center gap-2 px-4 py-3 rounded-2xl bg-white/90 shadow-md active:scale-95 transition-transform min-w-[120px] min-h-[64px]"
                  >
                    <span className="text-2xl">{story.emoji}</span>
                    <span className="text-xs font-display text-nova-earth text-center leading-tight">
                      {story.title[lang] || story.title.en}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </GameShell>
      </ErrorBoundary>
    );
  }

  // ─── Story reading screen ───────────────────────────────────────────
  return (
    <ErrorBoundary>
      <GameShell title="Ubuntu Stories">
        <div className="relative w-full h-full">
          <Scene cameraPosition={CAMERA_POSITION} cameraFov={CAMERA_FOV} backgroundColor="#87CEEB">
            <UbuntuStoriesGame />
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

          {/* Story progress counter */}
          <div className="absolute top-2 left-2 z-30 bg-white/80 rounded-2xl px-3 py-2 flex items-center gap-2">
            <span className="text-lg">{'\uD83D\uDCD6'}</span>
            <span className="text-sm font-display text-nova-earth">
              {currentStory?.title[lang] || currentStory?.title.en}
            </span>
          </div>

          {/* Clue progress */}
          <div className="absolute top-12 left-2 z-30 bg-white/60 rounded-xl px-2 py-1 flex items-center gap-1">
            <span className="text-xs text-nova-earth/60">
              {completedClueCount}/{CLUE_TARGET} {{ en: 'clues', af: 'leidrade', zu: 'izimpawu', xh: 'iimpawu', st: 'lipontso' }[lang] || 'clues'}
            </span>
          </div>

          {/* Story narrative panel */}
          <StoryPanel />
        </div>
      </GameShell>
    </ErrorBoundary>
  );
}
