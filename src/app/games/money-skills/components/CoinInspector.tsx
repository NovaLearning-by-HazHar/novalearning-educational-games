'use client';

import { useState, useCallback } from 'react';
import type { CoinId } from '../types/money-skills';
import { COIN_MAP } from '../lib/constants';

interface CoinInspectorProps {
  coinId: CoinId;
  onClose: () => void;
}

/**
 * Zoom-in coin view as an HTML overlay.
 * Shows coin name, value, and a flip button.
 * Fires onClose when child taps the close button.
 */
export default function CoinInspector({ coinId, onClose }: CoinInspectorProps) {
  const coin = COIN_MAP[coinId];
  const [flipped, setFlipped] = useState(false);

  const handleFlip = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 pointer-events-auto">
      <div className="bg-white rounded-3xl p-6 mx-4 max-w-sm w-full shadow-xl">
        {/* Coin visual */}
        <div className="flex justify-center mb-4">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center border-4 transition-transform duration-500"
            style={{
              backgroundColor: coin.color,
              borderColor: '#555',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            <span
              className="text-2xl font-display text-white select-none"
              style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}
            >
              {flipped ? 'SA' : coin.name}
            </span>
          </div>
        </div>

        {/* Coin info */}
        <h3 className="text-xl font-display text-center text-amber-900 mb-1">
          {coin.name}
        </h3>
        <p className="text-sm font-body text-center text-amber-700 mb-4">
          {coin.description}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleFlip}
            className="px-6 py-3 bg-amber-100 text-amber-900 font-display text-lg rounded-full active:scale-95 transition-transform min-w-[48px] min-h-[48px]"
          >
            Flip
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-amber-500 text-white font-display text-lg rounded-full active:scale-95 transition-transform min-w-[48px] min-h-[48px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
