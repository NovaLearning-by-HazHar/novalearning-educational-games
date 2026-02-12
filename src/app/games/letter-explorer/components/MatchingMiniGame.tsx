'use client';

import { useCallback, useMemo, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { animate } from 'animejs';
import { audioManager } from '@/lib/audio';
import { ANIMALS, type AnimalDef } from '../lib/constants';
import { useExplorerState } from '../hooks/useExplorerState';
import { buildAnimal } from '../lib/animals';

/**
 * Matching mini-game: tap a letter, then tap the matching animal.
 * 3 letters on top, 3 animals on bottom. Correct = green glow + chime.
 * Wrong = gentle wobble + "Let's try again!" — no penalty.
 */
export default function MatchingMiniGame() {
  const matchingAnimals = useExplorerState((s) => s.matchingAnimals);
  const selectedLetter = useExplorerState((s) => s.selectedLetter);
  const matchedPairs = useExplorerState((s) => s.matchedPairs);
  const selectLetter = useExplorerState((s) => s.selectLetter);
  const attemptMatch = useExplorerState((s) => s.attemptMatch);

  // Resolve animal definitions for the 3 matching animals
  const animalDefs = useMemo(
    () =>
      matchingAnimals
        .map((id) => ANIMALS.find((a) => a.id === id))
        .filter((a): a is AnimalDef => a != null),
    [matchingAnimals],
  );

  // Shuffle order for letters vs animals (so they're not aligned)
  const letterOrder = useMemo(() => {
    const shuffled = [...animalDefs];
    // Simple Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [animalDefs]);

  const handleLetterTap = useCallback(
    (letter: string) => {
      selectLetter(letter);
    },
    [selectLetter],
  );

  const handleAnimalTap = useCallback(
    (animalId: string) => {
      if (!selectedLetter) return;

      const animal = ANIMALS.find((a) => a.id === animalId);
      if (!animal) return;

      if (animal.letter === selectedLetter) {
        // Correct match!
        attemptMatch(animalId);
        audioManager.play('ui_success');
        // Play a random encouragement voice clip after the chime
        setTimeout(() => audioManager.playRandomEncouragement(), 400);
      } else {
        // Wrong — gentle voice feedback, no penalty
        audioManager.play('ui_gentle_error');
        audioManager.play('enc_gentle_redirect');
        selectLetter(null);
      }
    },
    [selectedLetter, attemptMatch, selectLetter],
  );

  return (
    <>
      {/* Simple background */}
      <color attach="background" args={['#FFF8E1']} />
      <ambientLight intensity={1.0} />

      {/* Instruction text at top */}
      <Text
        position={[0, 3.2, 0]}
        fontSize={0.35}
        color="#5D4E37"
        anchorX="center"
        anchorY="middle"
      >
        {selectedLetter
          ? `Now tap the ${selectedLetter} animal!`
          : 'Tap a letter, then its animal!'}
      </Text>

      {/* Letter cards — top row */}
      <group position={[0, 2, 0]}>
        {letterOrder.map((animal, i) => {
          const x = (i - 1) * 2;
          const isMatched = matchedPairs.includes(animal.id);
          const isSelected = selectedLetter === animal.letter && !isMatched;

          return (
            <LetterCard
              key={animal.letter}
              letter={animal.letter}
              position={[x, 0, 0]}
              selected={isSelected}
              matched={isMatched}
              onTap={() => !isMatched && handleLetterTap(animal.letter)}
            />
          );
        })}
      </group>

      {/* Animal cards — bottom row */}
      <group position={[0, -0.5, 0]}>
        {animalDefs.map((animal, i) => {
          const x = (i - 1) * 2.5;
          const isMatched = matchedPairs.includes(animal.id);

          return (
            <AnimalCard
              key={animal.id}
              animal={animal}
              position={[x, 0, 0]}
              matched={isMatched}
              onTap={() => !isMatched && handleAnimalTap(animal.id)}
            />
          );
        })}
      </group>

      {/* Encouragement when wrong */}
      {selectedLetter === null && matchedPairs.length > 0 && matchedPairs.length < matchingAnimals.length && (
        <Text
          position={[0, -2.5, 0]}
          fontSize={0.25}
          color="#FF6F00"
          anchorX="center"
          anchorY="middle"
        >
          {"Let's try again!"}
        </Text>
      )}
    </>
  );
}

/** Tappable letter card */
function LetterCard({
  letter,
  position,
  selected,
  matched,
  onTap,
}: {
  letter: string;
  position: [number, number, number];
  selected: boolean;
  matched: boolean;
  onTap: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const bgColor = matched ? '#66BB6A' : selected ? '#FF6F00' : '#FFFFFF';
  const textColor = matched ? '#FFFFFF' : selected ? '#FFFFFF' : '#5D4E37';
  const borderColor = matched ? '#4CAF50' : selected ? '#E65100' : '#DDD';

  return (
    <group ref={groupRef} position={position} onClick={onTap}>
      {/* Card background */}
      <mesh>
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial color={bgColor} />
      </mesh>
      {/* Border */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.35, 1.35]} />
        <meshBasicMaterial color={borderColor} />
      </mesh>
      {/* Letter */}
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.6}
        color={textColor}
        anchorX="center"
        anchorY="middle"
      >
        {matched ? '\u2713' : letter}
      </Text>
    </group>
  );
}

/** Tappable animal card with procedural mesh */
function AnimalCard({
  animal,
  position,
  matched,
  onTap,
}: {
  animal: AnimalDef;
  position: [number, number, number];
  matched: boolean;
  onTap: () => void;
}) {
  const containerRef = useRef<THREE.Group>(null);
  const animalMeshRef = useRef<THREE.Group>(null);

  const animalGroup = useMemo(
    () => buildAnimal(animal.id, animal.colors),
    [animal.id, animal.colors],
  );

  useEffect(() => {
    if (!animalMeshRef.current) return;
    while (animalMeshRef.current.children.length > 0) {
      animalMeshRef.current.remove(animalMeshRef.current.children[0]);
    }
    animalMeshRef.current.add(animalGroup);
  }, [animalGroup]);

  // Gentle bob
  useFrame(({ clock }) => {
    if (!containerRef.current) return;
    containerRef.current.position.y =
      position[1] + Math.sin(clock.elapsedTime * 1.2 + position[0]) * 0.03;
  });

  // Pop on match
  useEffect(() => {
    if (!matched || !containerRef.current) return;
    const proxy = { scale: 1 };
    animate(proxy, {
      scale: [1, 1.2, 1],
      duration: 400,
      ease: 'outElastic(1, 0.5)',
      onUpdate: () => {
        if (containerRef.current) {
          containerRef.current.scale.setScalar(proxy.scale);
        }
      },
    });
  }, [matched]);

  return (
    <group ref={containerRef} position={position} onClick={onTap}>
      {/* Background card */}
      <mesh position={[0, 0.5, -0.3]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial
          color={matched ? '#E8F5E9' : '#FFF8E1'}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Animal mesh */}
      <group ref={animalMeshRef} scale={0.8} />

      {/* Name label */}
      <Text
        position={[0, -0.3, 0.1]}
        fontSize={0.2}
        color={matched ? '#2E7D32' : '#5D4E37'}
        anchorX="center"
        anchorY="middle"
      >
        {animal.name}
      </Text>

      {/* Matched checkmark */}
      {matched && (
        <Text
          position={[0.7, 1.2, 0.1]}
          fontSize={0.4}
          color="#4CAF50"
          anchorX="center"
          anchorY="middle"
        >
          {'\u2713'}
        </Text>
      )}
    </group>
  );
}
