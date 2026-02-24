'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { SAAnimal } from '../lib/constants';

interface FloatingAnimalProps {
  animal: SAAnimal;
  index: number;
  total: number;
  roundKey: number;
  onTap?: () => void;
}

/**
 * A single animal in the arena — shows AI image with emoji fallback.
 * Positioned in a grid layout. Bounces in on mount and floats gently.
 */
export default function FloatingAnimal({ animal, index, total, roundKey, onTap }: FloatingAnimalProps) {
  const [imgFailed, setImgFailed] = useState(false);

  // Calculate grid position
  const cols = Math.min(total, 5);
  const rows = Math.ceil(total / cols);
  const row = Math.floor(index / cols);
  const col = index % cols;
  const colsInRow = row === rows - 1 ? total - row * cols : cols;
  const xOffset = (cols - colsInRow) * 40;
  const x = xOffset + col * 80 + 10;
  const y = row * 90 + 10;
  const delay = index * 0.1;

  return (
    <div
      key={`${roundKey}-${index}`}
      onClick={onTap}
      role="img"
      aria-label={animal.name}
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: '60px',
        height: '60px',
        cursor: onTap ? 'pointer' : 'default',
        animation: `bounceIn 0.5s ${delay}s both, float 3s ${delay}s ease-in-out infinite`,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
        transition: 'transform 0.2s',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!imgFailed ? (
        <Image
          src={animal.image}
          alt={animal.name}
          width={60}
          height={60}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.1)',
          }}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span style={{ fontSize: '48px', lineHeight: 1 }}>{animal.emoji}</span>
      )}
    </div>
  );
}
