'use client';

import { useState, useCallback } from 'react';
import type { StoryClue, LangCode } from '../data/stories';
import { TASK_FEEDBACK_DURATION } from '../lib/constants';

interface MiniTaskProps {
  clue: StoryClue;
  lang: LangCode;
  onComplete: () => void;
}

/**
 * Embedded mini-task for story clues.
 * Simple tap-to-answer: literacy (letter find), numeracy (count), life skills (choice).
 * No fail states — gentle encouragement on wrong answer, then try again.
 */
export default function MiniTask({ clue, lang, onComplete }: MiniTaskProps) {
  const [feedback, setFeedback] = useState<'correct' | 'tryagain' | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleOptionTap = useCallback((correct: boolean) => {
    if (completed) return;

    if (correct) {
      setFeedback('correct');
      setCompleted(true);
      setTimeout(() => {
        onComplete();
      }, TASK_FEEDBACK_DURATION);
    } else {
      setFeedback('tryagain');
      setTimeout(() => {
        setFeedback(null);
      }, TASK_FEEDBACK_DURATION);
    }
  }, [completed, onComplete]);

  const promptText = clue.task.prompt[lang] || clue.task.prompt.en;

  const tryAgainText: Record<LangCode, string> = {
    en: 'Try again!',
    af: 'Probeer weer!',
    zu: 'Zama futhi!',
    xh: 'Zama kwakhona!',
    st: 'Leka hape!',
  };

  const wellDoneText: Record<LangCode, string> = {
    en: 'Well done!',
    af: 'Goed gedoen!',
    zu: 'Wenze kahle!',
    xh: 'Wenze kakuhle!',
    st: 'U entse hantle!',
  };

  return (
    <div className="bg-nova-sand/30 rounded-xl p-3">
      {/* Task prompt */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{clue.emoji}</span>
        <p className="text-xs font-display text-nova-earth">
          {promptText}
        </p>
      </div>

      {/* Answer options */}
      <div className="flex flex-wrap gap-2">
        {clue.task.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleOptionTap(option.correct)}
            disabled={completed}
            className={`flex-1 min-w-[64px] min-h-[48px] px-3 py-2 rounded-xl text-sm font-display transition-all ${
              completed && option.correct
                ? 'bg-green-100 text-green-800 ring-2 ring-green-400'
                : completed
                ? 'bg-nova-earth/5 text-nova-earth/30 cursor-not-allowed'
                : 'bg-white text-nova-earth shadow-sm active:scale-95 active:bg-nova-sun/20'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback === 'tryagain' && (
        <div className="mt-2 text-center">
          <span className="text-xs font-body text-amber-600">
            {tryAgainText[lang]}
          </span>
        </div>
      )}
      {feedback === 'correct' && (
        <div className="mt-2 text-center">
          <span className="text-xs font-body text-green-600 font-semibold">
            {wellDoneText[lang]}
          </span>
        </div>
      )}
    </div>
  );
}
