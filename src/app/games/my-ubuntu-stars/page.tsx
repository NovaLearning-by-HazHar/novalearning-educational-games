'use client';

import { useEffect } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import GameShell from '@/components/GameShell';
import { useGameStore } from '@/stores/gameStore';
import { useProgressStore } from '@/stores/progressStore';
import { useAudioSetup } from './hooks/useAudioSetup';
import { useStarsState } from './hooks/useStarsState';
import TabSelector from './components/TabSelector';
import PointsSummary from './components/PointsSummary';
import BadgeGrid from './components/BadgeGrid';
import BadgeDetail from './components/BadgeDetail';
import CommunityMilestone from './components/CommunityMilestone';
import { LANG_OPTIONS, UI_TEXT, t } from './lib/constants';

export default function MyUbuntuStarsPage() {
  const reset = useGameStore((s) => s.reset);
  const setActiveCharacter = useGameStore((s) => s.setActiveCharacter);
  const setLoaded = useGameStore((s) => s.setLoaded);

  const { ready: audioReady } = useAudioSetup();
  const lang = useStarsState((s) => s.lang);
  const setLang = useStarsState((s) => s.setLang);
  const setEarnedBadges = useStarsState((s) => s.setEarnedBadges);

  const completedGames = useProgressStore((s) => s.completedGames);

  // Init
  useEffect(() => {
    reset();
    setActiveCharacter('themba');
  }, [reset, setActiveCharacter]);

  // Audio ready
  useEffect(() => {
    if (audioReady) {
      setLoaded(true);
    }
  }, [audioReady, setLoaded]);

  // Derive earned badges from progress store
  // Simple heuristic: each completed game session earns badges from that game mode
  useEffect(() => {
    const earned: string[] = [];
    const modeCounts: Record<string, number> = {};

    for (const game of completedGames) {
      const mode = game.gameId;
      modeCounts[mode] = (modeCounts[mode] || 0) + 1;
    }

    // Map completions to badge IDs based on count thresholds
    for (const [mode, count] of Object.entries(modeCounts)) {
      // langa badges: 1st, 10th, 20th completion
      if (count >= 1) earned.push(`${modePrefix(mode)}-langa-1`);
      if (count >= 10) earned.push(`${modePrefix(mode)}-langa-2`);
      if (count >= 20) earned.push(`${modePrefix(mode)}-langa-3`);

      // izulu badges at 1, 5, 10
      if (count >= 1) earned.push(`${modePrefix(mode)}-izulu-1`);
      if (count >= 5) earned.push(`${modePrefix(mode)}-izulu-2`);
      if (count >= 10) earned.push(`${modePrefix(mode)}-izulu-3`);

      // umhlaba badges at 1, 3, 5
      if (count >= 1) earned.push(`${modePrefix(mode)}-umhlaba-1`);
      if (count >= 3) earned.push(`${modePrefix(mode)}-umhlaba-2`);
      if (count >= 5) earned.push(`${modePrefix(mode)}-umhlaba-3`);
    }

    // Community badges based on total completions
    const totalCount = completedGames.length;
    const uniqueModes = Object.keys(modeCounts).length;

    if (totalCount >= 1) earned.push('com-langa-1');
    if (totalCount >= 10) earned.push('com-langa-2');
    if (totalCount >= 50) earned.push('com-langa-3');
    if (totalCount >= 100) earned.push('com-langa-4');
    if (uniqueModes >= 7) earned.push('com-langa-5');

    if (totalCount >= 2) earned.push('com-izulu-1');
    if (totalCount >= 5) earned.push('com-izulu-2');
    if (totalCount >= 10) earned.push('com-izulu-3');
    if (totalCount >= 20) earned.push('com-izulu-4');
    if (uniqueModes >= 5) earned.push('com-izulu-5');
    if (totalCount >= 30) earned.push('com-izulu-6');

    if (totalCount >= 10) earned.push('com-umhlaba-1');
    if (totalCount >= 3) earned.push('com-umhlaba-2');
    if (totalCount >= 15) earned.push('com-umhlaba-3');
    if (totalCount >= 20) earned.push('com-umhlaba-4');
    if (uniqueModes >= 7) earned.push('com-umhlaba-5');
    if (totalCount >= 50) earned.push('com-umhlaba-6');

    setEarnedBadges(earned);
  }, [completedGames, setEarnedBadges]);

  return (
    <ErrorBoundary>
      <GameShell title="My Ubuntu Stars \u2014 Themba">
        <div className="relative w-full h-full bg-gradient-to-b from-[#FFF8F0] to-[#FFF3E0] flex flex-col">
          {/* Language toggle — top right */}
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

          {/* Header */}
          <div className="pt-3 pb-2 text-center shrink-0">
            <h1 className="text-xl font-display text-nova-earth flex items-center justify-center gap-2">
              <span>\uD83D\uDC22</span>
              <span>{t(UI_TEXT.title, lang)}</span>
              <span>\u2B50</span>
            </h1>
          </div>

          {/* Tab toggle */}
          <div className="flex justify-center px-4 mb-3 shrink-0">
            <TabSelector />
          </div>

          {/* Points summary */}
          <div className="px-4 mb-3 shrink-0">
            <PointsSummary />
          </div>

          {/* Community milestone (only in community tab) */}
          <CommunityMilestone />

          {/* Badge grid — scrollable */}
          <BadgeGrid />

          {/* Badge detail popup */}
          <BadgeDetail />
        </div>
      </GameShell>
    </ErrorBoundary>
  );
}

/** Map game IDs to badge prefixes */
function modePrefix(gameId: string): string {
  const map: Record<string, string> = {
    'count-to-five': 'ctf',
    'trace-letter-a': 'tla',
    'bontse': 'bon',
    'mzansi-journey': 'mj',
    'ubuntu-stories': 'us',
    'ubuntu-garden': 'ug',
    'thina-trivia': 'tt',
  };
  return map[gameId] || gameId;
}
