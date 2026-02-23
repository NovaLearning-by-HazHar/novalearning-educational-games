'use client';

import { useMemo } from 'react';
import { audioManager } from '@/lib/audio';
import { useStarsState } from '../hooks/useStarsState';
import { getIndividualBadges, getCommunityBadges, type Badge } from '../data/badges';
import { POINT_TYPES, GAME_MODES, t, type GameMode } from '../lib/constants';

export default function BadgeGrid() {
  const activeTab = useStarsState((s) => s.activeTab);
  const earnedBadges = useStarsState((s) => s.earnedBadges);
  const selectBadge = useStarsState((s) => s.selectBadge);
  const lang = useStarsState((s) => s.lang);

  const badges = useMemo(() => {
    return activeTab === 'individual' ? getIndividualBadges() : getCommunityBadges();
  }, [activeTab]);

  // Group by mode for individual, flat for community
  const grouped = useMemo(() => {
    if (activeTab === 'community') {
      return [{ mode: 'community', badges }];
    }
    const modes = new Map<string, Badge[]>();
    for (const badge of badges) {
      const list = modes.get(badge.mode) || [];
      list.push(badge);
      modes.set(badge.mode, list);
    }
    return Array.from(modes.entries()).map(([mode, modeBadges]) => ({
      mode,
      badges: modeBadges,
    }));
  }, [activeTab, badges]);

  const handleTap = (badgeId: string) => {
    selectBadge(badgeId);
    audioManager.play('badge-tap');
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
      {grouped.map((group) => {
        const modeInfo = GAME_MODES[group.mode as GameMode];
        return (
          <div key={group.mode}>
            {activeTab === 'individual' && modeInfo && (
              <div className="flex items-center gap-2 mb-2 mt-1">
                <span className="text-lg">{modeInfo.icon}</span>
                <h3 className="text-sm font-display text-nova-earth/70">
                  {t(modeInfo.label, lang)}
                </h3>
              </div>
            )}
            <div className="grid grid-cols-4 gap-2">
              {group.badges.map((badge) => {
                const earned = earnedBadges.has(badge.id);
                const ptColor = POINT_TYPES[badge.pointType].color;
                return (
                  <button
                    key={badge.id}
                    onClick={() => handleTap(badge.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-transform active:scale-95 ${
                      earned
                        ? 'bg-white shadow-sm'
                        : 'bg-white/40'
                    }`}
                    style={earned ? { borderBottom: `2px solid ${ptColor}` } : undefined}
                  >
                    <span
                      className={`text-2xl ${earned ? '' : 'grayscale opacity-40'}`}
                    >
                      {badge.icon}
                    </span>
                    <span
                      className={`text-[10px] leading-tight text-center font-body line-clamp-2 ${
                        earned ? 'text-nova-earth' : 'text-nova-earth/40'
                      }`}
                    >
                      {t(badge.name, lang)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
