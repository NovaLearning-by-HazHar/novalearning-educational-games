'use client';

import { CATEGORY_IDS, CATEGORY_META, type TriviaCategory } from '../lib/constants';

interface CategoryFilterProps {
  selected: TriviaCategory | null;
  lang: string;
  onSelect: (cat: TriviaCategory | null) => void;
}

const ALL_LABEL: Record<string, string> = {
  en: 'All',
  af: 'Alles',
  zu: 'Konke',
  xh: 'Konke',
  st: 'Tsohle',
};

export default function CategoryFilter({ selected, lang, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center px-2">
      {/* All button */}
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 rounded-full text-xs font-display transition-all active:scale-95 ${
          selected === null
            ? 'bg-nova-primary text-white shadow-md'
            : 'bg-white/70 text-nova-earth/60'
        }`}
      >
        {ALL_LABEL[lang] || ALL_LABEL.en}
      </button>

      {/* Category chips */}
      {CATEGORY_IDS.map((catId) => {
        const meta = CATEGORY_META[catId];
        const isActive = selected === catId;
        return (
          <button
            key={catId}
            onClick={() => onSelect(catId)}
            className="px-3 py-1.5 rounded-full text-xs font-display transition-all active:scale-95"
            style={{
              backgroundColor: isActive ? meta.color : 'rgba(255,255,255,0.7)',
              color: isActive ? 'white' : meta.color,
              boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
            }}
          >
            <span className="mr-1">{meta.emoji}</span>
            {meta.label[lang] || meta.label.en}
          </button>
        );
      })}
    </div>
  );
}
