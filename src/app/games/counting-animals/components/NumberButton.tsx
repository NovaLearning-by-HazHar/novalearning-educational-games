'use client';

import { NUMBER_WORDS } from '../lib/constants';

interface NumberButtonProps {
  number: number;
  onClick: (n: number) => void;
  disabled: boolean;
  isCorrect: boolean;
  isWrong: boolean;
}

/**
 * Circular number answer button with word label.
 * Visually responds to correct/incorrect state with color + scale animations.
 */
export default function NumberButton({
  number,
  onClick,
  disabled,
  isCorrect,
  isWrong,
}: NumberButtonProps) {
  const word = NUMBER_WORDS[number] || '';

  const borderColor = isCorrect ? '#2ECC71' : isWrong ? '#E67E22' : '#E8D5B7';
  const background = isCorrect
    ? 'linear-gradient(135deg, #2ECC71, #27AE60)'
    : isWrong
      ? 'linear-gradient(135deg, #F39C12, #E67E22)'
      : 'linear-gradient(135deg, #FFF8E7, #F5E6C8)';
  const color = isCorrect || isWrong ? 'white' : '#5D4E37';
  const transform = isCorrect ? 'scale(1.15)' : isWrong ? 'scale(0.9)' : 'scale(1)';
  const boxShadow = isCorrect
    ? '0 0 20px rgba(46,204,113,0.5)'
    : isWrong
      ? '0 4px 8px rgba(243,156,18,0.3)'
      : '0 4px 12px rgba(0,0,0,0.1)';

  return (
    <button
      onClick={() => onClick(number)}
      disabled={disabled}
      aria-label={`${number}, ${word}`}
      style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        border: `3px solid ${borderColor}`,
        background,
        color,
        fontSize: '24px',
        fontWeight: 800,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform,
        boxShadow,
        fontFamily: "'Fredoka', 'Nunito', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2px',
        lineHeight: 1,
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }}
    >
      <span>{number}</span>
      <span style={{ fontSize: '9px', fontWeight: 600, opacity: 0.7 }}>{word}</span>
    </button>
  );
}
