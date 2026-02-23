'use client';

import { useEffect, useState } from 'react';
import { CELEBRATION_MESSAGES } from '../lib/constants';

interface TriviaCelebrationProps {
  lang: string;
  stars: number;
  onPlayAgain: () => void;
}

const CONFETTI_COLORS = ['#FF5722', '#FFD54F', '#4CAF50', '#42A5F5', '#AB47BC', '#FF7043', '#E91E63', '#00BCD4'];

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
}

const PLAY_AGAIN: Record<string, string> = {
  en: 'Play Again!',
  af: 'Speel Weer!',
  zu: 'Dlala Futhi!',
  xh: 'Dlala Kwakhona!',
  st: 'Bapala Hape!',
};

export default function TriviaCelebration({ lang, stars, onPlayAgain }: TriviaCelebrationProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const confetti: ConfettiPiece[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + Math.random() * 10,
      rotation: Math.random() * 360,
    }));
    setPieces(confetti);
  }, []);

  const message = CELEBRATION_MESSAGES[lang] || CELEBRATION_MESSAGES.en;
  const playAgainText = PLAY_AGAIN[lang] || PLAY_AGAIN.en;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center">
      {/* Confetti layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {pieces.map((p) => (
          <div
            key={p.id}
            className="absolute animate-confetti-fall"
            style={{
              left: `${p.left}%`,
              top: -20,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.size > 12 ? '50%' : '2px',
              transform: `rotate(${p.rotation}deg)`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Message */}
      <div className="relative z-10 bg-white/95 rounded-3xl p-8 shadow-2xl max-w-sm mx-4 text-center">
        <div className="text-5xl mb-4">&#11088;</div>
        <h2 className="text-2xl md:text-3xl font-display text-nova-earth mb-2">
          {message}
        </h2>
        <p className="text-lg text-nova-earth/60 font-body mb-1">
          {stars} {lang === 'en' ? 'Community Stars earned!' : lang === 'af' ? 'Gemeenskap-sterre verdien!' : 'stars!'}
        </p>
        <p className="text-sm text-nova-earth/40 font-body mb-6">
          Ubuntu
        </p>
        <button
          onClick={onPlayAgain}
          className="px-8 py-3 bg-nova-sun text-nova-earth font-display text-xl rounded-full shadow-lg active:scale-95 transition-transform"
        >
          {playAgainText}
        </button>
      </div>

      {/* CSS animation */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation: confetti-fall linear forwards;
        }
      `}</style>
    </div>
  );
}
