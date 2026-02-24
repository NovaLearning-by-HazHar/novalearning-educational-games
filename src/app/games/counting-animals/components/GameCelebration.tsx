'use client';

import { SHARED_KEYFRAMES } from '../lib/constants';

interface GameCelebrationProps {
  totalAnimalsCounted: number;
  onPlayAgain: () => void;
  onGoToMenu: () => void;
}

/**
 * End-of-game celebration screen.
 * Ubuntu philosophy: always celebrate (no star ratings, no competitive metrics).
 * Shows total animals counted as a collaborative achievement.
 */
export default function GameCelebration({
  totalAnimalsCounted,
  onPlayAgain,
  onGoToMenu,
}: GameCelebrationProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #FFF8E1 0%, #FFECB3 30%, #C8E6C9 70%, #A5D6A7 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Fredoka', 'Nunito', sans-serif",
        padding: '16px',
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
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          animation: 'popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Confetti particles */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: '50%',
                fontSize: `${16 + Math.random() * 16}px`,
                animation: `bounce ${1 + Math.random() * 2}s ${Math.random() * 0.5}s ease-out infinite`,
                opacity: 0.7,
              }}
            >
              {['🌟', '✨', '🎉', '🌍', '🎊'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>

        {/* Trophy */}
        <div
          style={{
            fontSize: '72px',
            marginBottom: '12px',
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          🏆
        </div>

        <h2
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#5D4E37',
            marginBottom: '8px',
          }}
        >
          We counted together!
        </h2>

        <p
          style={{
            fontSize: '16px',
            color: '#8B7355',
            marginBottom: '24px',
            fontWeight: 500,
          }}
        >
          What a great team we make
        </p>

        {/* Collaborative metric — animals counted (not score) */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              background: 'rgba(46,204,113,0.1)',
              borderRadius: '16px',
              padding: '16px 24px',
              minWidth: '120px',
            }}
          >
            <div style={{ fontSize: '28px' }}>🐾</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#2ECC71' }}>
              {totalAnimalsCounted}
            </div>
            <div style={{ fontSize: '12px', color: '#8B7355', fontWeight: 500 }}>
              Animals Counted
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onPlayAgain}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '16px',
              border: 'none',
              background: 'linear-gradient(135deg, #2ECC71, #27AE60)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'transform 0.2s',
              touchAction: 'manipulation',
            }}
          >
            Count Again
          </button>
          <button
            onClick={onGoToMenu}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '16px',
              border: '2px solid #E8D5B7',
              background: 'white',
              color: '#5D4E37',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'transform 0.2s',
              touchAction: 'manipulation',
            }}
          >
            Menu
          </button>
        </div>

        {/* Ubuntu footer */}
        <div
          style={{
            marginTop: '20px',
            fontSize: '12px',
            color: '#8B7355',
            fontWeight: 500,
          }}
        >
          🌍 NovaLearning · Learn together, grow together
        </div>
      </div>
    </div>
  );
}
