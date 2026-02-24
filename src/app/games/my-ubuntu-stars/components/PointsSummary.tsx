'use client';

import { useMemo } from 'react';
import { useStarsState } from '../hooks/useStarsState';
import { ALL_BADGES } from '../data/badges';
import { POINT_TYPES, t, type PointType } from '../lib/constants';

export default function PointsSummary() {
  const earnedBadges = useStarsState((s) => s.earnedBadges);
  const lang = useStarsState((s) => s.lang);

  const counts = useMemo(() => {
    const result: Record<PointType, number> = { langa: 0, izulu: 0, umhlaba: 0 };
    for (const badge of ALL_BADGES) {
      if (earnedBadges.has(badge.id)) {
        result[badge.pointType]++;
      }
    }
    return result;
  }, [earnedBadges]);

  return (
    <div className="flex gap-2 justify-center">
      {(Object.keys(POINT_TYPES) as PointType[]).map((pt) => {
        const def = POINT_TYPES[pt];
        return (
          <div
            key={pt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body"
            style={{ backgroundColor: def.bgColor, color: def.color }}
          >
            <span>{def.icon}</span>
            <span className="font-display">{counts[pt]}</span>
            <span className="text-xs opacity-75">
              {t(def.label, lang)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
