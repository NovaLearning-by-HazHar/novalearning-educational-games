'use client';

import { useEffect, useRef } from 'react';
import { audioManager } from '@/lib/audio';
import { ANIMALS, type AnimalDef } from '../lib/constants';

interface SpotlightPopupProps {
  animalId: string;
  onDismiss: () => void;
}

/** Map ubuntu value icons to simple emoji-like representations */
const VALUE_ICONS: Record<string, string> = {
  magnifyingGlass: '🔍',
  heartFamily: '❤️',
  shield: '🛡️',
  flexedArm: '💪',
  star: '⭐',
  flower: '🌸',
};

/**
 * Full-screen spotlight popup when an animal is discovered.
 * Shows big letter, animal emoji, name, ubuntu value, and auto-plays audio.
 * Tap anywhere to dismiss.
 */
export default function SpotlightPopup({ animalId, onDismiss }: SpotlightPopupProps) {
  const animal = ANIMALS.find((a: AnimalDef) => a.id === animalId);
  const hasPlayedAudio = useRef(false);

  // Auto-play discovery audio
  useEffect(() => {
    if (!animal || hasPlayedAudio.current) return;
    hasPlayedAudio.current = true;

    // Play discovery chime immediately
    audioManager.play('discover-chime');

    // Play marimba tone for the letter after a short delay
    const marimbaTimer = setTimeout(() => {
      audioManager.play(`marimba-${animal.letter}`);
    }, 300);

    // Play animal sound after marimba
    const animalTimer = setTimeout(() => {
      audioManager.play(`animal-${animal.id}`);
    }, 700);

    return () => {
      clearTimeout(marimbaTimer);
      clearTimeout(animalTimer);
    };
  }, [animal]);

  if (!animal) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onDismiss}
    >
      <div
        className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-[340px] w-[92%] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top section — emoji + letter */}
        <div
          className="h-48 flex items-center justify-center relative"
          style={{
            background: `linear-gradient(135deg, ${animal.colors.primary}30, ${animal.colors.secondary}20)`,
          }}
        >
          {/* Big animal emoji */}
          <span className="text-8xl" aria-hidden="true">
            {animal.emoji}
          </span>

          {/* Letter badge */}
          <div
            className="absolute top-4 right-4 w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: animal.colors.primary }}
          >
            <span className="text-4xl font-bold text-white">{animal.letter}</span>
          </div>
        </div>

        {/* Bottom section — name + ubuntu value */}
        <div className="p-6 text-center">
          {/* Animal name */}
          <h2 className="text-2xl font-bold text-[#5D4E37] mb-2">
            {animal.letter} is for {animal.name}!
          </h2>

          {/* Ubuntu value */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl" aria-hidden="true">
              {VALUE_ICONS[animal.valueIcon] ?? '✨'}
            </span>
            <span className="text-lg text-[#FB923C] font-semibold italic">
              {animal.ubuntuValue}
            </span>
          </div>

          {/* Tap to continue hint */}
          <p className="text-sm text-[#8B7355] mt-4">
            Tap anywhere to continue exploring
          </p>
        </div>
      </div>
    </div>
  );
}
