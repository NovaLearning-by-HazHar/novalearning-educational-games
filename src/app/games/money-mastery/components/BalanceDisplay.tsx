'use client';

import { useMoneyState } from '../hooks/useMoneyState';

/**
 * Balance display UI overlay showing current money balance.
 * Always visible at top-left corner.
 */
export default function BalanceDisplay() {
  const balance = useMoneyState((s) => s.balance);

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(255, 255, 255, 0.95)',
        border: '3px solid #FFB300',
        borderRadius: '16px',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: 50,
      }}
    >
      <span style={{ fontSize: '32px' }}>💰</span>
      <div>
        <div style={{ fontSize: '14px', color: '#666', fontWeight: 600 }}>
          My Money
        </div>
        <div
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#F57C00',
          }}
        >
          R{balance}
        </div>
      </div>
    </div>
  );
}
