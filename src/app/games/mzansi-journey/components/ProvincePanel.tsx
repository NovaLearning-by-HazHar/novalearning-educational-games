'use client';

import { getProvince, type Lang } from '../data/provinces';
import { TEXT_COLOR, BG_COLOR } from '../lib/constants';

interface ProvincePanelProps {
  provinceId: string;
  lang: Lang;
  currentFactIndex: number;
  onNextFact: () => void;
  onClose: () => void;
}

/**
 * Slide-in panel with province facts.
 * Shows animal emoji, 3 facts (paginated), language sample, landmark, cuisine.
 * Touch targets >= 48px. No red errors or fail states.
 */
export default function ProvincePanel({
  provinceId,
  lang,
  currentFactIndex,
  onNextFact,
  onClose,
}: ProvincePanelProps) {
  const province = getProvince(provinceId);
  if (!province) return null;

  const name = province.name[lang] || province.name.en;
  const animalName = province.animal.name[lang] || province.animal.name.en;
  const languageInfo = province.language[lang] || province.language.en;
  const landmark = province.landmark[lang] || province.landmark.en;
  const cuisine = province.cuisine[lang] || province.cuisine.en;
  const facts = province.facts[lang] || province.facts.en;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30 px-3 pb-4 animate-slideUp"
      style={{ pointerEvents: 'auto' }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>

      <div
        className="rounded-2xl p-4 shadow-lg max-w-sm mx-auto"
        style={{ backgroundColor: `${BG_COLOR}F2`, color: TEXT_COLOR }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{province.animal.emoji}</span>
            <div>
              <h3 className="text-lg font-bold" style={{ color: TEXT_COLOR }}>
                {name}
              </h3>
              <p className="text-xs opacity-70">{animalName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full active:scale-95 transition-transform"
            style={{ backgroundColor: province.color + '30' }}
            aria-label="Close panel"
          >
            <span style={{ color: TEXT_COLOR }}>{'x'}</span>
          </button>
        </div>

        {/* Fact carousel */}
        <div
          className="rounded-xl p-3 mb-3 min-h-[52px]"
          style={{ backgroundColor: province.color + '15' }}
        >
          <p className="text-sm" style={{ color: TEXT_COLOR }}>
            {facts[currentFactIndex]}
          </p>
        </div>

        {/* Fact dots */}
        <div className="flex items-center gap-1 mb-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-colors"
              style={{
                backgroundColor: i === currentFactIndex ? province.color : TEXT_COLOR + '30',
              }}
            />
          ))}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <InfoChip label="Language" value={languageInfo} color={province.color} />
          <InfoChip label="Landmark" value={landmark} color={province.color} />
          <InfoChip label="Cuisine" value={cuisine} color={province.color} />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onNextFact}
            className="flex-1 py-3 text-sm font-bold rounded-xl active:scale-95 transition-transform"
            style={{ backgroundColor: province.color + '25', color: TEXT_COLOR }}
          >
            Next Fact
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold rounded-xl active:scale-95 transition-transform"
            style={{ backgroundColor: province.color + '50', color: TEXT_COLOR }}
          >
            Back to Map
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="rounded-lg p-2 text-center"
      style={{ backgroundColor: color + '10' }}
    >
      <p className="text-[10px] opacity-60" style={{ color: TEXT_COLOR }}>
        {label}
      </p>
      <p className="text-[11px] font-medium leading-tight" style={{ color: TEXT_COLOR }}>
        {value}
      </p>
    </div>
  );
}
