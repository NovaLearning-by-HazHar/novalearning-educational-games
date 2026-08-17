'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/stores/gameStore';
import { CHARACTERS } from '../lib/constants';
type MoneyCharId = keyof typeof CHARACTERS;
const CHARACTER_IDS: MoneyCharId[] = ['chanel', 'priya', 'naledi'];
const EMOJIS: Record<MoneyCharId, string> = {
  chanel: '📖',
  priya: '🔍',
  naledi: '⭐',
  aisha: '🍲',
  sipho: '🔢',
};

/** Stars background — procedural twinkle dots */
function Stars() {
  const [stars, setStars] = useState<
    { left: string; top: string; d: string; delay: string; size: string }[]
  >([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 60 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        d: `${2 + Math.random() * 4}s`,
        delay: `${Math.random() * 5}s`,
        size: `${2 + Math.random() * 3}px`,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDuration: s.d,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}

/** Emoji burst on selection */
function Burst({ emoji, active }: { emoji: string; active: boolean }) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-50 flex items-center justify-center transition-opacity duration-300 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {active && (
        <span className="text-6xl animate-burst">{emoji}</span>
      )}
    </div>
  );
}

export default function CharacterSelectPage() {
  const router = useRouter();
  const setActiveCharacter = useGameStore((s) => s.setActiveCharacter);

  const [selected, setSelected] = useState<MoneyCharId | null>(null);
  const [burst, setBurst] = useState<{ emoji: string; active: boolean }>({
    emoji: '',
    active: false,
  });
  const [starting, setStarting] = useState(false);

  const handleSelect = useCallback(
    (id: MoneyCharId) => {
      setSelected(id);
      const emoji = EMOJIS[id];
      setBurst({ emoji, active: true });
      setTimeout(() => setBurst((b) => ({ ...b, active: false })), 800);
    },
    []
  );

  const handleStart = useCallback(() => {
    if (!selected || starting) return;
    setStarting(true);
    setBurst({ emoji: '🎉', active: true });

    setActiveCharacter(selected);

    setTimeout(() => {
      router.push('/games/money-skills');
    }, 600);
  }, [selected, starting, setActiveCharacter, router]);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-8 overflow-x-hidden"
      style={{
        background: 'linear-gradient(160deg, #1a3a5c 0%, #0d2035 100%)',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <Stars />
      <Burst emoji={burst.emoji} active={burst.active} />

      {/* Header */}
      <header className="relative z-10 text-center mb-10 animate-fadeDown">
        <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-5 backdrop-blur-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F7C948] animate-pulse" />
          <span className="text-white/85 text-[13px] font-bold tracking-widest uppercase">
            NovaLearning &middot; Money Skills
          </span>
        </div>
        <h1
          className="font-black text-white leading-tight"
          style={{
            fontSize: 'clamp(26px, 5vw, 42px)',
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
          }}
        >
          Who is your <span className="text-[#F7C948]">learning friend</span>?
        </h1>
        <p className="mt-2.5 text-white/65 text-base font-semibold">
          Pick a friend to start your adventure together
        </p>
      </header>

      {/* Character Cards */}
      <div className="relative z-10 flex gap-6 justify-center flex-wrap animate-fadeUp">
        {CHARACTER_IDS.map((id) => {
          const char = CHARACTERS[id];
          const isSelected = selected === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => handleSelect(id)}
              className={`w-[240px] max-[680px]:w-[300px] rounded-3xl overflow-hidden bg-white shadow-xl transition-all duration-300 text-left outline-offset-[3px] ${
                isSelected
                  ? 'outline outline-4 outline-[#F7C948] -translate-y-3.5 scale-105 shadow-2xl'
                  : 'outline outline-4 outline-transparent hover:-translate-y-2.5 hover:scale-[1.03] hover:shadow-2xl'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Image area */}
              <div
                className="relative h-[220px] overflow-hidden"
                style={{ background: char.cardBg }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={char.image}
                  alt={`${char.name} the ${char.role}`}
                  className={`absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 ${
                    isSelected ? 'scale-[1.06] animate-sprite-bounce' : 'animate-sprite-idle'
                  }`}
                />

                {/* Role badge */}
                <span
                  className="absolute top-3 right-3 text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full text-white backdrop-blur-sm"
                  style={{ background: `${char.accent}dd` }}
                >
                  {char.role}
                </span>

                {/* Selected tick */}
                <div
                  className={`absolute top-3 left-3 w-[30px] h-[30px] rounded-full bg-[#F7C948] flex items-center justify-center text-base transition-all duration-300 ${
                    isSelected
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-[0.4]'
                  }`}
                >
                  &#10003;
                </div>
              </div>

              {/* Card body */}
              <div className="px-5 pt-4 pb-5">
                <div
                  className="text-xl font-black"
                  style={{
                    color:
                      id === 'chanel'
                        ? '#b35a0a'
                        : id === 'priya'
                        ? '#1a6b3c'
                        : '#1a3a7c',
                  }}
                >
                  {char.name}
                </div>
                <div className="mt-1 text-[13px] font-bold text-gray-400 uppercase tracking-wider">
                  The {char.role}
                </div>
                <p className="mt-2.5 text-sm text-gray-500 leading-relaxed">
                  {id === 'chanel' &&
                    'Loves sharing stories and teaching friends through imagination and play.'}
                  {id === 'priya' &&
                    'Always asking "why?" and exploring every corner to find the answer.'}
                  {id === 'naledi' &&
                    'Raises her hand to help the class and always looks out for her friends.'}
                </p>
                <div className="inline-flex items-center gap-1.5 mt-3.5 bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-500 font-bold">
                  <span aria-hidden="true">&#129309;</span>
                  {char.trait}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <div className="relative z-10 mt-10 text-center animate-fadeUp">
        <button
          type="button"
          onClick={handleStart}
          disabled={!selected || starting}
          className={`inline-flex items-center gap-3 px-12 py-4 rounded-full font-black text-xl text-white tracking-wide transition-all duration-300 min-w-[48px] min-h-[48px] ${
            selected && !starting
              ? 'bg-gradient-to-br from-[#E67E22] to-[#F7C948] shadow-lg shadow-orange-500/40 hover:-translate-y-1 hover:scale-[1.04] hover:shadow-xl active:translate-y-px active:scale-[0.98]'
              : 'bg-white/15 text-white/40 cursor-not-allowed shadow-none'
          }`}
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
        >
          <span>{starting ? `Starting with ${CHARACTERS[selected!]?.name}...` : "Let's learn together"}</span>
          {!starting && <span className="text-[22px]">&rarr;</span>}
        </button>
        <p className="mt-3.5 text-white/45 text-[13px] font-semibold min-h-[20px]">
          {selected
            ? `${EMOJIS[selected]} ${CHARACTERS[selected].name} is ready to learn with you!`
            : 'Tap a friend above to begin'}
        </p>
      </div>

      {/* Ubuntu Footer */}
      <div className="relative z-10 mt-9 text-white/30 text-xs font-bold tracking-widest uppercase">
        Umuntu ngumuntu ngabantu &middot; I am because we are
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.4); }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeDown {
          animation: fadeDown 0.7s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp {
          animation: fadeUp 0.8s 0.2s ease both;
        }
        @keyframes burst {
          from { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.2) rotate(8deg); opacity: 1; }
          to   { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-burst {
          animation: burst 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes spriteIdle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-sprite-idle {
          animation: spriteIdle 2.4s ease-in-out infinite;
        }
        @keyframes spriteBounce {
          0% { transform: translateY(0) scale(1.06); }
          40% { transform: translateY(-8px) scale(1.06); }
          100% { transform: translateY(0) scale(1.06); }
        }
        .animate-sprite-bounce {
          animation: spriteBounce 0.5s ease-out;
        }
      `}</style>
    </main>
  );
}
