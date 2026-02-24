'use client';

import type { TriviaQuestion } from '../data/questions';
import { CATEGORY_META } from '../lib/constants';

interface QuestionCardProps {
  question: TriviaQuestion;
  lang: string;
  questionNumber: number;
}

export default function QuestionCard({ question, lang, questionNumber }: QuestionCardProps) {
  const meta = CATEGORY_META[question.category];
  const questionText = question.question[lang] || question.question.en;

  return (
    <div className="bg-white/90 rounded-3xl p-5 shadow-lg mx-4 max-w-lg w-full">
      {/* Category badge */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-display text-white"
          style={{ backgroundColor: meta.color }}
        >
          <span>{meta.emoji}</span>
          <span>{meta.label[lang] || meta.label.en}</span>
        </span>
        <span className="text-xs text-nova-earth/40 font-body ml-auto">
          #{questionNumber}
        </span>
      </div>

      {/* Question text */}
      <p className="text-xl md:text-2xl font-display text-nova-earth leading-snug text-center min-h-[60px] flex items-center justify-center">
        {questionText}
      </p>
    </div>
  );
}
