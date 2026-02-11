'use client';

import type { SAAnimal } from '../lib/constants';
import { TRY_AGAIN_MESSAGE, SHARED_KEYFRAMES } from '../lib/constants';
import FloatingAnimal from './FloatingAnimal';

interface AnimalArenaProps {
  animal: SAAnimal | null;
  targetCount: number;
  roundKey: number;
  isCorrect: boolean | null;
  celebrationMessage: string;
  showCelebration: boolean;
  onAnimalTap?: () => void;
}

/**
 * The savanna display area where animals appear.
 * Shows floating animals, celebration overlay, or gentle retry message.
 */
export default function AnimalArena({
  animal,
  targetCount,
  roundKey,
  isCorrect,
  celebrationMessage,
  showCelebration,
  onAnimalTap,
}: AnimalArenaProps) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.7)',
        borderRadius: '24px',
        maxWidth: '480px',
        width: '100%',
        height: '320px',
        position: 'relative',
        marginBottom: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{SHARED_KEYFRAMES}</style>

      {/* Savanna background elements */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(to top, rgba(139,195,74,0.2), transparent)',
          borderRadius: '0 0 24px 24px',
        }}
      />
      <div style={{ position: 'absolute', top: '20px', right: '30px', fontSize: '32px', opacity: 0.2 }}>
        ☀️
      </div>
      <div style={{ position: 'absolute', top: '15px', left: '20px', fontSize: '18px', opacity: 0.15 }}>
        🌿
      </div>
      <div style={{ position: 'absolute', bottom: '15px', right: '20px', fontSize: '18px', opacity: 0.15 }}>
        🌱
      </div>

      {/* Animals */}
      {animal && (
        <div
          style={{
            position: 'relative',
            width: `${Math.min(targetCount, 5) * 80}px`,
            height: `${Math.ceil(targetCount / 5) * 90}px`,
          }}
        >
          {Array.from({ length: targetCount }, (_, i) => (
            <FloatingAnimal
              key={`${roundKey}-${i}`}
              animal={animal}
              index={i}
              total={targetCount}
              roundKey={roundKey}
              onTap={onAnimalTap}
            />
          ))}
        </div>
      )}

      {/* Celebration overlay */}
      {showCelebration && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.85)',
            borderRadius: '24px',
            zIndex: 100,
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              animation: 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '12px' }}>🎉</div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#5D4E37',
                fontFamily: "'Fredoka', 'Nunito', sans-serif",
              }}
            >
              {celebrationMessage}
            </div>
          </div>
        </div>
      )}

      {/* Gentle retry message (Ubuntu: warm orange, not punitive red) */}
      {isCorrect === false && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            background: 'rgba(243,156,18,0.9)',
            color: 'white',
            borderRadius: '12px',
            padding: '12px',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: '15px',
            animation: 'gentleShake 0.5s ease',
            fontFamily: "'Fredoka', 'Nunito', sans-serif",
          }}
        >
          {TRY_AGAIN_MESSAGE}
        </div>
      )}
    </div>
  );
}
