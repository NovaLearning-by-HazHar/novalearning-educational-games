'use client';

import { useCallback, useState } from 'react';
import { audioManager } from '@/lib/audio';
import { useGardenState } from '../hooks/useGardenState';
import { GARDEN_ITEMS } from '../data/garden-items';

/**
 * Popup task — must complete before placement.
 * Types: count to 3, find letter, what colour.
 * No fail states — wrong answers get gentle "try again" encouragement.
 * Touch targets >= 48px.
 */
export default function MiniTask() {
  const currentTaskItemId = useGardenState((s) => s.currentTaskItemId);
  const lang = useGardenState((s) => s.lang);
  const completeTask = useGardenState((s) => s.completeTask);
  const cancelTask = useGardenState((s) => s.cancelTask);
  const [feedback, setFeedback] = useState<'correct' | 'tryAgain' | null>(null);

  const item = currentTaskItemId
    ? GARDEN_ITEMS.find((g) => g.id === currentTaskItemId)
    : null;

  const handleOptionTap = useCallback((index: number) => {
    if (!item) return;

    if (index === item.task.correctIndex) {
      setFeedback('correct');
      audioManager.play('task-complete');
      // Short delay then place item
      setTimeout(() => {
        completeTask();
        audioManager.play('plant-sound');
        setFeedback(null);
      }, 600);
    } else {
      setFeedback('tryAgain');
      audioManager.play('item-tap');
      setTimeout(() => setFeedback(null), 1000);
    }
  }, [item, completeTask]);

  const handleCancel = useCallback(() => {
    cancelTask();
    setFeedback(null);
  }, [cancelTask]);

  if (!item || !currentTaskItemId) return null;

  const task = item.task;
  const question = task.question[lang] || task.question.en;
  const itemName = item.name[lang] || item.name.en;

  // Feedback messages (not "error" — encouraging only)
  const FEEDBACK_MESSAGES: Record<string, Record<string, string>> = {
    correct: {
      en: 'Well done!',
      af: 'Goed gedoen!',
      zu: 'Wenze kahle!',
      xh: 'Wenze kakuhle!',
      st: 'O entse hantle!',
    },
    tryAgain: {
      en: 'Try again!',
      af: 'Probeer weer!',
      zu: 'Zama futhi!',
      xh: 'Zama kwakhona!',
      st: 'Leka hape!',
    },
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/30 pointer-events-auto">
      <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-xs w-full mx-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{item.emoji}</span>
          <h3 className="text-lg font-display text-nova-earth">{itemName}</h3>
        </div>

        {/* Question */}
        <p className="text-sm font-body text-nova-earth/80 mb-4 text-center">
          {question}
        </p>

        {/* Options */}
        <div className="flex justify-center gap-3 mb-4">
          {task.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleOptionTap(i)}
              disabled={feedback === 'correct'}
              className="min-w-[56px] min-h-[56px] px-4 py-3 text-lg font-display bg-nova-sand/60 text-nova-earth rounded-2xl shadow-sm active:scale-95 transition-transform disabled:opacity-60"
            >
              {option}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {feedback && (
          <p className={`text-center text-sm font-display mb-2 ${
            feedback === 'correct' ? 'text-green-600' : 'text-nova-earth/60'
          }`}>
            {FEEDBACK_MESSAGES[feedback]?.[lang] || FEEDBACK_MESSAGES[feedback]?.en}
          </p>
        )}

        {/* Cancel — not "fail", just go back */}
        {feedback !== 'correct' && (
          <button
            onClick={handleCancel}
            className="w-full text-center text-xs text-nova-earth/40 py-2 min-h-[48px]"
          >
            {lang === 'af' ? 'Kanselleer' : lang === 'zu' ? 'Khansela' : lang === 'xh' ? 'Rhoxisa' : lang === 'st' ? 'Hlakola' : 'Cancel'}
          </button>
        )}
      </div>
    </div>
  );
}
