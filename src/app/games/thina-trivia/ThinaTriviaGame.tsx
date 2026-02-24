'use client';

import { useCallback } from 'react';
import { audioManager } from '@/lib/audio';
import { useTriviaState, useCurrentQuestion } from './hooks/useTriviaState';
import { TRY_AGAIN_MESSAGES } from './lib/constants';
import QuestionCard from './components/QuestionCard';
import AnswerButton from './components/AnswerButton';
import StarMeter from './components/StarMeter';
import DiscussionTimer from './components/DiscussionTimer';
import CategoryFilter from './components/CategoryFilter';

/**
 * Thina Trivia — Main game component (pure HTML/React, no R3F).
 * Cooperative quiz: Question -> discuss -> answer -> community star meter fills.
 */
export default function ThinaTriviaGame() {
  const lang = useTriviaState((s) => s.lang);
  const stars = useTriviaState((s) => s.stars);
  const answeredCount = useTriviaState((s) => s.answeredCount);
  const selectedAnswer = useTriviaState((s) => s.selectedAnswer);
  const showResult = useTriviaState((s) => s.showResult);
  const isCorrect = useTriviaState((s) => s.isCorrect);
  const showTimer = useTriviaState((s) => s.showTimer);
  const timerActive = useTriviaState((s) => s.timerActive);
  const categoryFilter = useTriviaState((s) => s.categoryFilter);
  const questions = useTriviaState((s) => s.questions);

  const submitAnswer = useTriviaState((s) => s.submitAnswer);
  const nextQuestion = useTriviaState((s) => s.nextQuestion);
  const setCategoryFilter = useTriviaState((s) => s.setCategoryFilter);
  const startQuiz = useTriviaState((s) => s.startQuiz);
  const toggleTimer = useTriviaState((s) => s.toggleTimer);

  const currentQuestion = useCurrentQuestion();
  const quizStarted = questions.length > 0;

  const handleAnswer = useCallback((index: number) => {
    submitAnswer(index);
    // Determine if correct for audio
    if (currentQuestion && index === currentQuestion.correctIndex) {
      audioManager.play('correct-ding');
      // Check if this earns a star sound (after state updates)
      setTimeout(() => audioManager.play('star-earned'), 400);
    } else {
      audioManager.play('gentle-nudge');
    }
  }, [submitAnswer, currentQuestion]);

  const handleNext = useCallback(() => {
    nextQuestion();
    audioManager.play('button-tap');
  }, [nextQuestion]);

  const handleCategoryChange = useCallback((cat: typeof categoryFilter) => {
    setCategoryFilter(cat);
    audioManager.play('button-tap');
  }, [setCategoryFilter]);

  const handleStart = useCallback(() => {
    startQuiz();
    audioManager.play('button-tap');
  }, [startQuiz]);

  // Gentle "try again" message
  const tryAgainMsg = TRY_AGAIN_MESSAGES[lang] || TRY_AGAIN_MESSAGES.en;

  // Start screen
  if (!quizStarted) {
    const startLabels: Record<string, string> = {
      en: 'Start Quiz!', af: 'Begin Vasvra!', zu: 'Qala!', xh: 'Qala!', st: 'Qala!',
    };
    const welcomeLabels: Record<string, string> = {
      en: 'Let\'s learn together!',
      af: 'Kom ons leer saam!',
      zu: 'Masifunde ndawonye!',
      xh: 'Masifunde kunye!',
      st: 'Ha re ithuteng mmoho!',
    };

    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
        {/* Guide intro */}
        <div className="text-center">
          <div className="text-5xl mb-2">&#129421;</div>
          <h2 className="text-2xl font-display text-nova-earth mb-1">Thina Trivia</h2>
          <p className="text-sm font-body text-nova-earth/60">
            {welcomeLabels[lang] || welcomeLabels.en}
          </p>
        </div>

        {/* Category filter */}
        <CategoryFilter
          selected={categoryFilter}
          lang={lang}
          onSelect={handleCategoryChange}
        />

        {/* Timer toggle */}
        <label className="flex items-center gap-2 text-xs font-body text-nova-earth/60 cursor-pointer">
          <input
            type="checkbox"
            checked={showTimer}
            onChange={toggleTimer}
            className="w-4 h-4 rounded"
          />
          {lang === 'en' ? 'Discussion timer' : lang === 'af' ? 'Bespreking-timer' : 'Timer'}
        </label>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="px-10 py-4 bg-nova-primary text-white font-display text-xl rounded-full shadow-lg active:scale-95 transition-transform"
        >
          {startLabels[lang] || startLabels.en}
        </button>
      </div>
    );
  }

  // Active quiz
  if (!currentQuestion) {
    return <div className="flex items-center justify-center h-full text-nova-earth/40">Loading...</div>;
  }

  const options = currentQuestion.options[lang] || currentQuestion.options.en;
  const nextLabel: Record<string, string> = {
    en: 'Next Question', af: 'Volgende Vraag', zu: 'Umbuzo Olandelayo', xh: 'Umbuzo Olandelayo', st: 'Potso e Latelang',
  };

  return (
    <div className="flex flex-col items-center h-full py-3 gap-3 overflow-y-auto">
      {/* Top bar: star meter + category filter */}
      <div className="w-full px-3 flex flex-col gap-2">
        <StarMeter stars={stars} lang={lang} />
        <CategoryFilter
          selected={categoryFilter}
          lang={lang}
          onSelect={handleCategoryChange}
        />
      </div>

      {/* Discussion timer */}
      {showTimer && (
        <div className="w-full px-3">
          <DiscussionTimer
            active={timerActive}
            lang={lang}
          />
        </div>
      )}

      {/* Question card */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <QuestionCard
          question={currentQuestion}
          lang={lang}
          questionNumber={answeredCount + 1}
        />

        {/* Answer options */}
        <div className="flex flex-col gap-3 mt-4 w-full max-w-lg px-4">
          {options.map((opt, i) => (
            <AnswerButton
              key={i}
              label={opt}
              index={i}
              selected={selectedAnswer === i}
              correct={isCorrect}
              showResult={showResult}
              isCorrectAnswer={i === currentQuestion.correctIndex}
              onTap={handleAnswer}
            />
          ))}
        </div>

        {/* Result feedback */}
        {showResult && (
          <div className="mt-4 text-center">
            {isCorrect ? (
              <p className="text-lg font-display text-green-700 animate-pulse">
                &#11088; {lang === 'en' ? 'Well done!' : lang === 'af' ? 'Goed gedoen!' : 'Wenze kahle!'}
              </p>
            ) : (
              <p className="text-lg font-display text-amber-700">
                {tryAgainMsg}
              </p>
            )}
            <button
              onClick={handleNext}
              className="mt-3 px-8 py-3 bg-nova-primary text-white font-display text-base rounded-full shadow-md active:scale-95 transition-transform"
            >
              {nextLabel[lang] || nextLabel.en}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
