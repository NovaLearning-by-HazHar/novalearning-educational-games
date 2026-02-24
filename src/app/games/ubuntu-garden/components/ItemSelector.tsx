'use client';

import { useCallback } from 'react';
import { audioManager } from '@/lib/audio';
import { useGardenState } from '../hooks/useGardenState';
import { GARDEN_ITEMS, ITEM_CATEGORIES, type ItemCategory } from '../data/garden-items';
import { CATEGORY_COLORS } from '../lib/constants';

/**
 * HTML overlay: scrollable item palette.
 * Touch targets >= 48px. No competition/fail states.
 */
export default function ItemSelector() {
  const selectedCategory = useGardenState((s) => s.selectedCategory);
  const lang = useGardenState((s) => s.lang);
  const selectCategory = useGardenState((s) => s.selectCategory);
  const startTask = useGardenState((s) => s.startTask);
  const placedItems = useGardenState((s) => s.placedItems);

  const handleCategoryTap = useCallback((cat: ItemCategory) => {
    selectCategory(cat);
    audioManager.play('item-tap');
  }, [selectCategory]);

  const handleItemTap = useCallback((itemId: string) => {
    // Check if already placed
    const alreadyPlaced = placedItems.some((p) => p.itemId === itemId);
    if (alreadyPlaced) return;
    startTask(itemId);
    audioManager.play('item-tap');
  }, [startTask, placedItems]);

  const handleBack = useCallback(() => {
    selectCategory(null);
  }, [selectCategory]);

  const categoryItems = selectedCategory
    ? GARDEN_ITEMS.filter((item) => item.category === selectedCategory)
    : [];

  const categoryData = selectedCategory
    ? ITEM_CATEGORIES.find((c) => c.id === selectedCategory)
    : null;

  // Category selector
  if (!selectedCategory) {
    return (
      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-3 px-4">
        {ITEM_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryTap(cat.id)}
            className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl bg-white/90 shadow-md active:scale-95 transition-transform min-w-[72px]"
            style={{ borderBottom: `3px solid ${CATEGORY_COLORS[cat.id]}` }}
          >
            <span className="text-2xl">{cat.emoji}</span>
            <span className="text-xs font-display text-nova-earth">
              {cat.label[lang] || cat.label.en}
            </span>
          </button>
        ))}
      </div>
    );
  }

  // Item grid for selected category
  return (
    <div className="absolute bottom-4 left-0 right-0 z-30 px-4">
      <div className="bg-white/90 rounded-2xl p-3 shadow-lg max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-display text-nova-earth">
            {categoryData?.label[lang] || categoryData?.label.en}
          </h3>
          <button
            onClick={handleBack}
            className="text-xs text-nova-earth/50 px-2 py-1 min-h-[48px] min-w-[48px] flex items-center justify-center"
          >
            Back
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto">
          {categoryItems.map((item) => {
            const isPlaced = placedItems.some((p) => p.itemId === item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleItemTap(item.id)}
                disabled={isPlaced}
                className={`flex items-center gap-2 p-3 rounded-xl active:scale-95 transition-transform min-h-[48px] ${
                  isPlaced
                    ? 'bg-nova-primary/20 opacity-60'
                    : 'bg-nova-sand/50'
                }`}
              >
                <span className="text-xl">{item.emoji}</span>
                <span className="text-xs font-body text-nova-earth">
                  {item.name[lang] || item.name.en}
                </span>
                {isPlaced && <span className="text-xs ml-auto">&#10003;</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
