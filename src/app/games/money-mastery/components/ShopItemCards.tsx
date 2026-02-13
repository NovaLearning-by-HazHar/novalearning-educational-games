'use client';

import { useRef, useCallback } from 'react';
import { animate } from 'animejs';
import { useGameStore } from '@/stores/gameStore';
import { audioManager } from '@/lib/audio';
import { SHOP_ITEMS, SHOP_COLORS, GAME_SETTINGS, AUDIO_IDS } from '../lib/constants';
import { useMoneyState } from '../hooks/useMoneyState';
import type { ShopItem } from '../types/money';

const ITEM_EMOJIS: Record<string, string> = {
  'veg-seeds': '🌱',
  'spaza-stock': '🏪',
  'toy-car': '🚗',
  'fizzy-drink': '🥤',
};

/**
 * HTML overlay showing 4 shop item cards in a responsive grid.
 * Visible during discover + practice phases only.
 * Each card has asset (green) or consumption (red) border.
 */
export default function ShopItemCards() {
  const phase = useGameStore((s) => s.phase);
  const incrementInteraction = useGameStore((s) => s.incrementInteraction);
  const balance = useMoneyState((s) => s.balance);
  const deductBalance = useMoneyState((s) => s.deductBalance);
  const addPurchase = useMoneyState((s) => s.addPurchase);
  const triggerLeratoHint = useMoneyState((s) => s.triggerLeratoHint);

  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handlePurchase = useCallback(
    (item: ShopItem) => {
      if (balance < item.price) return;

      // Deduct and record
      deductBalance(item.price);
      addPurchase(item);
      incrementInteraction();

      // Play purchase chime
      audioManager.play(AUDIO_IDS.purchaseChime);

      // Asset bonus: extra cha-ching
      if (item.type === 'asset') {
        setTimeout(() => {
          audioManager.play(AUDIO_IDS.chaChing);
        }, GAME_SETTINGS.assetBonusAudioDelay);
      }

      // Lerato feedback
      triggerLeratoHint();

      // Card pulse animation
      const el = cardRefs.current[item.id];
      if (el) {
        animate(el, {
          scale: [1, 1.1, 1],
          duration: GAME_SETTINGS.purchaseAnimationDuration,
          ease: 'outElastic(1, 0.5)',
        });
      }
    },
    [balance, deductBalance, addPurchase, incrementInteraction, triggerLeratoHint]
  );

  // Only show during discover and practice phases
  if (phase !== 'discover' && phase !== 'practice') return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '8%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        maxWidth: '420px',
        width: '92%',
        zIndex: 10,
        pointerEvents: 'auto',
      }}
    >
      {SHOP_ITEMS.map((item) => {
        const canAfford = balance >= item.price;
        const borderColor =
          item.type === 'asset'
            ? SHOP_COLORS.assetBorder
            : SHOP_COLORS.consumptionBorder;

        return (
          <button
            key={item.id}
            ref={(el) => { cardRefs.current[item.id] = el; }}
            onClick={() => handlePurchase(item)}
            disabled={!canAfford}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 4px',
              background: canAfford ? 'rgba(255,255,255,0.95)' : 'rgba(200,200,200,0.7)',
              border: `3px solid ${canAfford ? borderColor : '#999'}`,
              borderRadius: '12px',
              cursor: canAfford ? 'pointer' : 'default',
              opacity: canAfford ? 1 : 0.5,
              boxShadow: canAfford ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              transition: 'opacity 0.2s',
              touchAction: 'manipulation',
            }}
          >
            <span style={{ fontSize: '24px', lineHeight: 1 }}>
              {ITEM_EMOJIS[item.id] || '📦'}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#333',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              {item.name}
            </span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: borderColor,
              }}
            >
              R{item.price}
            </span>
          </button>
        );
      })}
    </div>
  );
}
