'use client';

import { useStarsState } from '../hooks/useStarsState';
import { UI_TEXT, t, type TabType } from '../lib/constants';

const TABS: { key: TabType; labelKey: keyof typeof UI_TEXT }[] = [
  { key: 'individual', labelKey: 'individual' },
  { key: 'community', labelKey: 'community' },
];

export default function TabSelector() {
  const activeTab = useStarsState((s) => s.activeTab);
  const setActiveTab = useStarsState((s) => s.setActiveTab);
  const lang = useStarsState((s) => s.lang);

  return (
    <div className="flex bg-white/60 rounded-full p-1 gap-1">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`px-4 py-2 text-sm font-display rounded-full transition-colors ${
            activeTab === tab.key
              ? 'bg-white text-nova-earth shadow-sm'
              : 'text-nova-earth/60'
          }`}
        >
          {tab.key === 'individual' ? '\u2B50 ' : '\uD83E\uDD1D '}
          {t(UI_TEXT[tab.labelKey], lang)}
        </button>
      ))}
    </div>
  );
}
