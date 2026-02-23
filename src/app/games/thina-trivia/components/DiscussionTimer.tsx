'use client';

import { useEffect, useState, useRef } from 'react';
import { DISCUSSION_SECONDS } from '../lib/constants';

interface DiscussionTimerProps {
  active: boolean;
  lang: string;
  onComplete?: () => void;
}

const DISCUSS_LABELS: Record<string, string> = {
  en: 'Discuss together!',
  af: 'Bespreek saam!',
  zu: 'Xoxani ndawonye!',
  xh: 'Xoxani kunye!',
  st: 'Buisanang mmoho!',
};

const TIME_UP_LABELS: Record<string, string> = {
  en: 'Time to answer!',
  af: 'Tyd om te antwoord!',
  zu: 'Isikhathi sokuphendula!',
  xh: 'Ixesha lokuphendula!',
  st: 'Nako ya ho araba!',
};

export default function DiscussionTimer({ active, lang, onComplete }: DiscussionTimerProps) {
  const [seconds, setSeconds] = useState(DISCUSSION_SECONDS);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Reset when active changes
    setSeconds(DISCUSSION_SECONDS);
    setDone(false);

    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDone(true);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, onComplete]);

  if (!active && !done) return null;

  const progress = seconds / DISCUSSION_SECONDS;
  const label = done
    ? (TIME_UP_LABELS[lang] || TIME_UP_LABELS.en)
    : (DISCUSS_LABELS[lang] || DISCUSS_LABELS.en);

  return (
    <div className="bg-white/70 rounded-2xl px-3 py-2 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm" role="img" aria-label="timer">&#9200;</span>
        <span className="text-xs font-display text-nova-earth">{label}</span>
        <span className="text-xs font-body text-nova-earth/60 ml-auto">{seconds}s</span>
      </div>
      <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-linear"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: progress > 0.3 ? '#66BB6A' : progress > 0.1 ? '#FFB74D' : '#EF5350',
          }}
        />
      </div>
    </div>
  );
}
