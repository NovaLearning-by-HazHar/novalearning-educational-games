'use client';

import { useEffect, useRef, useCallback } from 'react';
import { audioManager } from '@/lib/audio';
import {
  ENCOURAGEMENT,
  TOTAL_ROUNDS,
  DIFFICULTY_LABELS,
  SHARED_KEYFRAMES,
} from './lib/constants';
import { useCountingAnimalsState } from './hooks/useCountingAnimalsState';
import AnimalArena from './components/AnimalArena';
import NumberButton from './components/NumberButton';
import RoundProgress from './components/RoundProgress';
import GameCelebration from './components/GameCelebration';

/** Pick a random encouragement message */
function randomEncouragement(): string {
  return ENCOURAGEMENT[Math.floor(Math.random() * ENCOURAGEMENT.length)];
}

/**
 * Main 2D Counting Animals game orchestrator.
 *
 * Flow: Menu → Playing (5 rounds) → Complete celebration
 * Each round: animals appear → child picks a number → feedback → next round
 *
 * Integrates with audioManager for sound effects.
 * Game state managed by useCountingAnimalsState Zustand store.
 */
export default function CountingAnimalsGame() {
  const {
    screen,
    difficulty,
    round,
    currentAnimal,
    targetCount,
    selectedAnswer,
    isCorrect,
    totalAnimalsCounted,
    numberOptions,
    startGame,
    submitAnswer,
    clearAnswer,
    advanceRound,
    goToMenu,
    resetGame,
  } = useCountingAnimalsState();

  const celebrationMsgRef = useRef('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAnswer = useCallback(
    (answer: number) => {
      if (isCorrect !== null) return; // Already answered

      audioManager.play('ca-tap');
      submitAnswer(answer);

      if (answer === targetCount) {
        // Correct!
        celebrationMsgRef.current = randomEncouragement();
        audioManager.play('ca-correct');

        // Play counting beep for the number
        const beepId = `ca-count-${targetCount}`;
        audioManager.play(beepId);

        timeoutRef.current = setTimeout(() => {
          advanceRound();
        }, 1500);
      } else {
        // Gentle retry
        audioManager.play('ca-tryagain');

        timeoutRef.current = setTimeout(() => {
          clearAnswer();
        }, 1500);
      }
    },
    [isCorrect, targetCount, submitAnswer, advanceRound, clearAnswer],
  );

  const handlePlayAgain = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    resetGame();
    audioManager.play('ca-ambient');
  }, [resetGame]);

  const handleGoToMenu = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    audioManager.stopCategory('ambient');
    goToMenu();
  }, [goToMenu]);

  const handleStartGame = useCallback(
    (diff: number) => {
      startGame(diff);
      audioManager.play('ca-ambient');
    },
    [startGame],
  );

  // --- MENU SCREEN ---
  if (screen === 'menu') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(160deg, #FFF8E1 0%, #FFECB3 30%, #C8E6C9 70%, #A5D6A7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Fredoka', 'Nunito', sans-serif",
          padding: '20px',
        }}
      >
        <style>{SHARED_KEYFRAMES}</style>

        <div
          style={{
            background: 'rgba(255,255,255,0.92)',
            borderRadius: '32px',
            padding: '40px 32px',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
            animation: 'popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Header with animal icons */}
          <div
            style={{
              fontSize: '56px',
              marginBottom: '8px',
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            🐘🦁🦒
          </div>

          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#5D4E37',
              marginBottom: '4px',
            }}
          >
            Counting Animals
          </h1>

          <p
            style={{
              fontSize: '15px',
              color: '#8B7355',
              marginBottom: '28px',
              fontWeight: 500,
            }}
          >
            Count the South African animals!
          </p>

          {/* Difficulty selection — non-competitive framing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {DIFFICULTY_LABELS.map((label, i) => {
              const colors = [
                ['#2ECC71', '#27AE60'],
                ['#F39C12', '#E67E22'],
                ['#3498DB', '#2980B9'],
              ];
              const [c1, c2] = colors[i];
              const ranges = [[1, 3], [1, 5], [1, 10]];
              const [lo, hi] = ranges[i];

              return (
                <button
                  key={i}
                  onClick={() => handleStartGame(i)}
                  style={{
                    padding: '18px 24px',
                    borderRadius: '16px',
                    border: 'none',
                    background: `linear-gradient(135deg, ${c1}, ${c2})`,
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <span>{label}</span>
                  <span style={{ fontSize: '14px', opacity: 0.8 }}>
                    Count {lo}-{hi}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            style={{
              marginTop: '24px',
              padding: '12px 16px',
              background: 'rgba(93,78,55,0.05)',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#8B7355',
              fontWeight: 500,
            }}
          >
            🇿🇦 NovaLearning · CAPS Aligned · Grade R Numeracy
          </div>
        </div>
      </div>
    );
  }

  // --- COMPLETE SCREEN ---
  if (screen === 'complete') {
    return (
      <GameCelebration
        totalAnimalsCounted={totalAnimalsCounted}
        onPlayAgain={handlePlayAgain}
        onGoToMenu={handleGoToMenu}
      />
    );
  }

  // --- PLAYING SCREEN ---
  const showCelebration = isCorrect === true;
  const animalName = currentAnimal?.name || 'animals';

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(160deg, #FFF8E1 0%, #FFECB3 30%, #C8E6C9 70%, #A5D6A7 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "'Fredoka', 'Nunito', sans-serif",
        padding: '16px',
      }}
    >
      <style>{SHARED_KEYFRAMES}</style>

      {/* Top bar */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <button
          onClick={handleGoToMenu}
          style={{
            background: 'rgba(255,255,255,0.8)',
            border: 'none',
            borderRadius: '12px',
            padding: '8px 14px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#5D4E37',
            cursor: 'pointer',
            fontFamily: 'inherit',
            touchAction: 'manipulation',
          }}
        >
          ← Back
        </button>

        <RoundProgress current={round} total={TOTAL_ROUNDS} />

        <div
          style={{
            background: 'rgba(255,255,255,0.8)',
            borderRadius: '12px',
            padding: '8px 14px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#8B7355',
          }}
        >
          {DIFFICULTY_LABELS[difficulty]}
        </div>
      </div>

      {/* Question */}
      <div
        style={{
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '20px',
          padding: '16px 24px',
          marginBottom: '16px',
          textAlign: 'center',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        <p style={{ fontSize: '20px', fontWeight: 700, color: '#5D4E37' }}>
          Count the {animalName}s! How many are there?
        </p>
      </div>

      {/* Animal arena */}
      <AnimalArena
        animal={currentAnimal}
        targetCount={targetCount}
        roundKey={round}
        isCorrect={isCorrect}
        celebrationMessage={celebrationMsgRef.current}
        showCelebration={showCelebration}
        onAnimalTap={() => audioManager.play('ca-tap')}
      />

      {/* Number options */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
          maxWidth: '480px',
        }}
      >
        {numberOptions.map((num) => (
          <NumberButton
            key={`${round}-${num}`}
            number={num}
            onClick={handleAnswer}
            disabled={isCorrect === true}
            isCorrect={selectedAnswer === num && isCorrect === true}
            isWrong={selectedAnswer === num && isCorrect === false}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '16px',
          fontSize: '12px',
          color: '#8B7355',
          fontWeight: 500,
        }}
      >
        🇿🇦 NovaLearning
      </div>
    </div>
  );
}
