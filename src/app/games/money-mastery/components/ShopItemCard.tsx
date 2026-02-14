'use client';

import { useMoneyState } from '../hooks/useMoneyState';
import { audioManager } from '@/lib/audio';
import type { ShopItem } from '../types/money';

interface ShopItemCardProps {
  item: ShopItem;
  visible: boolean;
}

/**
 * Shop item card UI overlay for purchasing items.
 * Shows item details, price, and purchase button.
 */
export default function ShopItemCard({ item, visible }: ShopItemCardProps) {
  const { balance, deductBalance, addPurchase } = useMoneyState();

  const canAfford = balance >= item.price;

  const handlePurchase = () => {
    if (canAfford) {
      deductBalance(item.price);
      addPurchase(item);
      audioManager.play('purchase-chime');
    }
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(255, 255, 255, 0.98)',
        border: `4px solid ${item.type === 'asset' ? '#4CAF50' : '#FF9800'}`,
        borderRadius: '24px',
        padding: '24px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        zIndex: 100,
      }}
    >
      {/* Item image placeholder */}
      <div
        style={{
          width: '100%',
          height: '180px',
          background: '#E0E0E0',
          borderRadius: '16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
        }}
      >
        {item.type === 'asset' ? '🌱' : '🍬'}
      </div>

      {/* Item name */}
      <h2
        style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#333',
          marginBottom: '8px',
          textAlign: 'center',
        }}
      >
        {item.name}
      </h2>

      {/* Item description */}
      <p
        style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '16px',
          textAlign: 'center',
          lineHeight: 1.4,
        }}
      >
        {item.description}
      </p>

      {/* Income badge for assets */}
      {item.type === 'asset' && item.incomePerCycle && (
        <div
          style={{
            background: '#E8F5E9',
            border: '2px solid #4CAF50',
            borderRadius: '12px',
            padding: '8px 16px',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '16px', fontWeight: 600, color: '#2E7D32' }}>
            Earns +R{item.incomePerCycle} per garden cycle! 🌟
          </span>
        </div>
      )}

      {/* Price and purchase button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#333',
          }}
        >
          R{item.price}
        </div>
        <button
          onClick={handlePurchase}
          disabled={!canAfford}
          style={{
            flex: 1,
            background: canAfford ? '#4CAF50' : '#BDBDBD',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            padding: '16px 32px',
            fontSize: '20px',
            fontWeight: 700,
            cursor: canAfford ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            boxShadow: canAfford ? '0 4px 12px rgba(76, 175, 80, 0.4)' : 'none',
          }}
        >
          {canAfford ? 'Buy Now!' : 'Not Enough Money'}
        </button>
      </div>
    </div>
  );
}
