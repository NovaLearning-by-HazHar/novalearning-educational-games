'use client';

interface RoundProgressProps {
  current: number;
  total: number;
}

/**
 * Non-competitive progress indicator.
 * Shows filled dots for completed rounds — no scores or rankings.
 */
export default function RoundProgress({ current, total }: RoundProgressProps) {
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: '28px',
            height: '8px',
            borderRadius: '4px',
            background:
              i < current
                ? 'linear-gradient(90deg, #F39C12, #E67E22)'
                : 'rgba(93,78,55,0.15)',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}
