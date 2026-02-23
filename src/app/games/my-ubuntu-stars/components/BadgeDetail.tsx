'use client';

import { useCallback, useEffect } from 'react';
import { audioManager } from '@/lib/audio';
import { useStarsState } from '../hooks/useStarsState';
import { ALL_BADGES } from '../data/badges';
import { POINT_TYPES, GAME_MODES, UI_TEXT, t, type GameMode } from '../lib/constants';

export default function BadgeDetail() {
  const selectedBadge = useStarsState((s) => s.selectedBadge);
  const selectBadge = useStarsState((s) => s.selectBadge);
  const earnedBadges = useStarsState((s) => s.earnedBadges);
  const lang = useStarsState((s) => s.lang);

  const badge = selectedBadge ? ALL_BADGES.find((b) => b.id === selectedBadge) : null;

  const handleClose = useCallback(() => {
    selectBadge(null);
  }, [selectBadge]);

  // Play sparkle on open if earned
  useEffect(() => {
    if (badge && earnedBadges.has(badge.id)) {
      audioManager.play('star-sparkle');
    }
  }, [badge, earnedBadges]);

  if (!badge) return null;

  const earned = earnedBadges.has(badge.id);
  const ptDef = POINT_TYPES[badge.pointType];
  const modeInfo = GAME_MODES[badge.mode as GameMode];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-xs w-full p-5 z-10">
        {/* Badge icon */}
        <div className="flex flex-col items-center mb-3">
          <span
            className={`text-5xl mb-2 ${earned ? '' : 'grayscale opacity-40'}`}
          >
            {badge.icon}
          </span>
          <h2 className="text-lg font-display text-nova-earth text-center">
            {t(badge.name, lang)}
          </h2>
        </div>

        {/* Point type indicator */}
        <div
          className="flex items-center gap-1.5 justify-center rounded-full px-3 py-1 text-xs font-body mb-3 mx-auto w-fit"
          style={{ backgroundColor: ptDef.bgColor, color: ptDef.color }}
        >
          <span>{ptDef.icon}</span>
          <span>{t(ptDef.meaning, lang)}</span>
        </div>

        {/* Description */}
        <p className="text-sm font-body text-nova-earth/80 text-center mb-3">
          {t(badge.description, lang)}
        </p>

        {/* Mode source */}
        {modeInfo && (
          <div className="flex items-center gap-1.5 justify-center text-xs text-nova-earth/60 font-body mb-3">
            <span>{modeInfo.icon}</span>
            <span>
              {t(UI_TEXT.mode, lang)}{' '}
              {t(modeInfo.label, lang)}
            </span>
          </div>
        )}

        {/* Status */}
        <div className="text-center mb-4">
          {earned ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-display">
              \u2705 {t(UI_TEXT.earned, lang)}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-nova-sand text-nova-earth/50 rounded-full text-xs font-display">
              \uD83D\uDD12 {t(UI_TEXT.locked, lang)}
            </span>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="w-full py-2.5 bg-nova-sun/20 text-nova-earth font-display text-sm rounded-full active:scale-95 transition-transform"
        >
          {t(UI_TEXT.close, lang)}
        </button>
      </div>
    </div>
  );
}
