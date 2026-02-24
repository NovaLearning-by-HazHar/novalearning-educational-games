'use client';

import { useCallback } from 'react';
import { audioManager } from '@/lib/audio';
import type { CoinId } from '../types/money-skills';
import { COIN_MAP, PRACTICE_ROUNDS } from '../lib/constants';
import { useMoneySkillsState } from '../hooks/useMoneySkillsState';

interface PracticeRoundProps {
  onComplete: () => void;
}

/**
 * Practice phase: "Find the coin Gogo describes" mini-game.
 * HTML overlay showing the clue and coin options as tappable circles.
 * No penalty for wrong answers (Ubuntu: no failure states).
 * After 2 wrong attempts: hint glow on correct coin.
 */
export default function PracticeRound({ onComplete }: PracticeRoundProps) {
  const practiceRound = useMoneySkillsState((s) => s.practiceRound);
  const practiceCorrect = useMoneySkillsState((s) => s.practiceCorrect);
  const wrongAttemptsThisRound = useMoneySkillsState((s) => s.wrongAttemptsThisRound);
  const showHintGlow = useMoneySkillsState((s) => s.showHintGlow);
  const submitPracticeAnswer = useMoneySkillsState((s) => s.submitPracticeAnswer);
  const nextPracticeRound = useMoneySkillsState((s) => s.nextPracticeRound);

  const round = PRACTICE_ROUNDS[practiceRound];

  const handleCoinTap = useCallback(
    (tappedId: CoinId) => {
      if (!round) return;

      submitPracticeAnswer(tappedId, round.correctCoinId);

      if (tappedId === round.correctCoinId) {
        audioManager.play('correct-sfx');
        audioManager.play(`coin-tone-${tappedId}`);
        // Auto-advance to next round after a short delay
        setTimeout(() => {
          if (practiceRound < PRACTICE_ROUNDS.length - 1) {
            nextPracticeRound();
          } else {
            onComplete();
          }
        }, 800);
      } else {
        audioManager.play('try-again-sfx');
      }
    },
    [round, practiceRound, submitPracticeAnswer, nextPracticeRound, onComplete]
  );

  if (!round) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
      {/* Clue card */}
      <div className="pointer-events-auto bg-white/90 rounded-2xl px-6 py-4 mb-6 mx-4 shadow-lg max-w-sm">
        <p className="text-sm font-body text-amber-700 text-center mb-1">
          Gogo Nomsa says:
        </p>
        <p className="text-lg font-display text-amber-900 text-center">
          &ldquo;{round.clue}&rdquo;
        </p>
        <p className="text-xs font-body text-amber-600 text-center mt-2">
          Round {practiceRound + 1} of {PRACTICE_ROUNDS.length}
        </p>
        {wrongAttemptsThisRound > 0 && wrongAttemptsThisRound < 2 && (
          <p className="text-xs font-body text-amber-500 text-center mt-1">
            Try again -- you can do it!
          </p>
        )}
        {showHintGlow && (
          <p className="text-xs font-body text-amber-500 text-center mt-1">
            Look for the glowing coin!
          </p>
        )}
      </div>

      {/* Coin options as tappable circles */}
      <div className="pointer-events-auto flex flex-wrap justify-center gap-3 px-4 max-w-sm">
        {round.options.map((optionId) => {
          const coinData = COIN_MAP[optionId];
          const isHinted = showHintGlow && optionId === round.correctCoinId;

          return (
            <button
              key={optionId}
              onClick={() => handleCoinTap(optionId)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl active:scale-95 transition-transform min-w-[64px] min-h-[64px]"
              style={{
                boxShadow: isHinted ? '0 0 12px 4px #FFD700' : 'none',
              }}
            >
              <div
                className="w-14 h-14 rounded-full border-2 flex items-center justify-center"
                style={{
                  backgroundColor: coinData.color,
                  borderColor: isHinted ? '#FFD700' : '#666',
                }}
              >
                <span className="text-xs font-display text-white select-none">
                  {coinData.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
