'use client';

import { STAR_TARGET } from '../lib/constants';

interface StarMeterProps {
  stars: number;
  lang: string;
}

const STAR_LABELS: Record<string, string> = {
  en: 'Community Stars',
  af: 'Gemeenskap-sterre',
  zu: 'Izinkanyezi Zomphakathi',
  xh: 'Iinkwenkwezi Zoluntu',
  st: 'Dinaledi tsa Setjhaba',
};

export default function StarMeter({ stars, lang }: StarMeterProps) {
  const progress = Math.min(stars / STAR_TARGET, 1);
  const label = STAR_LABELS[lang] || STAR_LABELS.en;

  return (
    <div className="bg-white/80 rounded-2xl px-3 py-2 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm" role="img" aria-label="star">&#11088;</span>
        <span className="text-xs font-display text-nova-earth">
          {label}: {stars}/{STAR_TARGET}
        </span>
      </div>
      {/* Star circles */}
      <div className="flex gap-1">
        {Array.from({ length: STAR_TARGET }, (_, i) => (
          <div
            key={i}
            className="transition-all duration-500"
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: i < stars ? '#FFD54F' : '#E0E0E0',
              border: i < stars ? '2px solid #F9A825' : '2px solid #BDBDBD',
              transform: i === stars - 1 ? 'scale(1.3)' : 'scale(1)',
              boxShadow: i < stars ? '0 0 6px rgba(255, 213, 79, 0.6)' : 'none',
            }}
          />
        ))}
      </div>
      {/* Progress bar fallback for small screens */}
      <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
