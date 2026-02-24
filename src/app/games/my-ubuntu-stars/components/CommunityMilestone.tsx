'use client';

import { useMemo } from 'react';
import { useStarsState } from '../hooks/useStarsState';
import { getCommunityBadges } from '../data/badges';
import { POINT_TYPES, UI_TEXT, t, type PointType } from '../lib/constants';

export default function CommunityMilestone() {
  const earnedBadges = useStarsState((s) => s.earnedBadges);
  const activeTab = useStarsState((s) => s.activeTab);
  const lang = useStarsState((s) => s.lang);

  const communityBadges = useMemo(() => getCommunityBadges(), []);

  const stats = useMemo(() => {
    let earned = 0;
    const byType: Record<PointType, number> = { langa: 0, izulu: 0, umhlaba: 0 };
    for (const badge of communityBadges) {
      if (earnedBadges.has(badge.id)) {
        earned++;
        byType[badge.pointType]++;
      }
    }
    return { earned, total: communityBadges.length, byType };
  }, [earnedBadges, communityBadges]);

  // Only show in community tab
  if (activeTab !== 'community') return null;

  const progress = stats.total > 0 ? (stats.earned / stats.total) * 100 : 0;

  return (
    <div className="mx-4 mb-3 bg-white/80 rounded-2xl p-3 shadow-sm">
      {/* Together message */}
      <p className="text-sm font-display text-nova-earth text-center mb-2">
        {t(UI_TEXT.togetherMessage, lang)}
      </p>

      {/* Progress bar */}
      <div className="h-2 bg-nova-sand rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #FF8F00, #1565C0, #2E7D32)',
          }}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-between text-xs text-nova-earth/60 font-body">
        <span>
          {t(UI_TEXT.milestonePrefix, lang)}:{' '}
          {stats.earned}/{stats.total}
        </span>
        <div className="flex gap-2">
          {(Object.keys(POINT_TYPES) as PointType[]).map((pt) => (
            <span key={pt} className="flex items-center gap-0.5">
              <span className="text-xs">{POINT_TYPES[pt].icon}</span>
              <span>{stats.byType[pt]}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
