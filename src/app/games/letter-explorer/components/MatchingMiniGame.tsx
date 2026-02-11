'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { audioManager } from '@/lib/audio';
import { useExplorerState } from '../hooks/useExplorerState';
import { ANIMALS, type AnimalDef } from '../lib/constants';

/**
 * HTML overlay matching mini-game.
 * Shows 3 letters (top) and 3 animals (bottom), shuffled.
 * Tap a letter, then tap the matching animal.
 * Correct → pair locks in green. Wrong → gentle shake + reset. No failure states.
 */
export default function MatchingMiniGame() {
  const matchingAnimals = useExplorerState((s) => s.matchingAnimals);
  const matchedPairs = useExplorerState((s) => s.matchedPairs);
  const selectedLetter = useExplorerState((s) => s.selectedLetter);
  const selectLetter = useExplorerState((s) => s.selectLetter);
  const attemptMatch = useExplorerState((s) => s.attemptMatch);

  const [shakeAnimal, setShakeAnimal] = useState<string | null>(null);

  // Get full animal definitions for matching animals
  const matchingAnimalDefs = useMemo(
    () => matchingAnimals.map((id) => ANIMALS.find((a: AnimalDef) => a.id === id)!).filter(Boolean),
    [matchingAnimals],
  );

  // Shuffle letters and animals independently (stable per game)
  const shuffledLetters = useMemo(
    () => [...matchingAnimalDefs].sort(() => Math.random() - 0.5),
    [matchingAnimalDefs],
  );
  const shuffledAnimals = useMemo(
    () => [...matchingAnimalDefs].sort(() => Math.random() - 0.5),
    [matchingAnimalDefs],
  );

  const handleLetterTap = useCallback(
    (letter: string) => {
      selectLetter(selectedLetter === letter ? null : letter);
    },
    [selectLetter, selectedLetter],
  );

  const handleAnimalTap = useCallback(
    (animal: AnimalDef) => {
      if (!selectedLetter) return;
      if (matchedPairs.includes(animal.id)) return;

      if (animal.letter === selectedLetter) {
        // Correct match!
        attemptMatch(animal.id);
        audioManager.play('match-correct');
      } else {
        // Wrong match — gentle nudge, no punishment
        audioManager.play('match-try-again');
        setShakeAnimal(animal.id);
        selectLetter(null);
        setTimeout(() => setShakeAnimal(null), 500);
      }
    },
    [selectedLetter, matchedPairs, attemptMatch, selectLetter],
  );

  // Play a welcoming sound when matching starts
  useEffect(() => {
    audioManager.play('discover-chime');
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#FEF7EC] to-[#E8F5E0] p-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-[#5D4E37] mb-2">
        Match the Letters!
      </h2>
      <p className="text-sm text-[#8B7355] mb-8">
        Tap a letter, then tap its animal
      </p>

      {/* Letters row */}
      <div className="flex gap-4 mb-10">
        {shuffledLetters.map((animal) => {
          const isMatched = matchedPairs.includes(animal.id);
          const isSelected = selectedLetter === animal.letter;

          return (
            <button
              key={`letter-${animal.id}`}
              onClick={() => !isMatched && handleLetterTap(animal.letter)}
              disabled={isMatched}
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: isMatched
                  ? '#4CAF50'
                  : isSelected
                    ? '#FFB800'
                    : 'white',
                color: isMatched || isSelected ? 'white' : '#5D4E37',
                transform: isSelected ? 'scale(1.1)' : undefined,
                opacity: isMatched ? 0.7 : 1,
              }}
            >
              {animal.letter}
            </button>
          );
        })}
      </div>

      {/* Animals row */}
      <div className="flex gap-4">
        {shuffledAnimals.map((animal) => {
          const isMatched = matchedPairs.includes(animal.id);
          const isShaking = shakeAnimal === animal.id;

          return (
            <button
              key={`animal-${animal.id}`}
              onClick={() => handleAnimalTap(animal)}
              disabled={isMatched}
              className={`w-24 h-28 rounded-2xl flex flex-col items-center justify-center shadow-lg transition-all duration-200 active:scale-95 ${isShaking ? 'animate-shake' : ''}`}
              style={{
                backgroundColor: isMatched ? '#E8F5E9' : 'white',
                borderWidth: 3,
                borderColor: isMatched
                  ? '#4CAF50'
                  : selectedLetter
                    ? '#FFB800'
                    : animal.colors.primary,
                opacity: isMatched ? 0.7 : 1,
              }}
            >
              <span className="text-4xl mb-1" aria-hidden="true">
                {animal.emoji}
              </span>
              <span
                className="text-xs font-semibold"
                style={{ color: animal.colors.primary }}
              >
                {animal.name}
              </span>
              {isMatched && (
                <span className="text-lg absolute" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Encouraging message */}
      {shakeAnimal && (
        <p className="mt-6 text-lg text-[#FB923C] font-semibold animate-pulse">
          Let&apos;s try again!
        </p>
      )}
    </div>
  );
}
