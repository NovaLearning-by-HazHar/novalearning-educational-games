'use client';

import { useCallback } from 'react';
import { audioManager } from '@/lib/audio';
import { useStoryState } from '../hooks/useStoryState';
import { STORIES, type StoryStep } from '../data/stories';
import { TEXT_ADVANCE_DELAY } from '../lib/constants';
import MiniTask from './MiniTask';

/**
 * Main narrative display panel (2D HTML overlay).
 * Shows character portrait emoji, dialogue text, and embedded mini-tasks.
 * Tap-to-advance between steps.
 */
export default function StoryPanel() {
  const currentStoryIndex = useStoryState((s) => s.currentStoryIndex);
  const currentChapterIndex = useStoryState((s) => s.currentChapterIndex);
  const currentStepIndex = useStoryState((s) => s.currentStepIndex);
  const lang = useStoryState((s) => s.lang);
  const taskAnswered = useStoryState((s) => s.taskAnswered);
  const nextStep = useStoryState((s) => s.nextStep);
  const completeClue = useStoryState((s) => s.completeClue);
  const completedClues = useStoryState((s) => s.completedClues);

  const story = STORIES[currentStoryIndex];
  const chapter = story?.chapters[currentChapterIndex];
  const step: StoryStep | undefined = chapter?.steps[currentStepIndex];

  const isLastStep = step ? currentStepIndex >= (chapter?.steps.length ?? 0) - 1 : true;
  const hasClue = step?.type === 'clue' && step.clue;
  const clueCompleted = hasClue && step?.clue ? completedClues.includes(step.clue.id) : false;

  const handleAdvance = useCallback(() => {
    if (isLastStep) return;
    if (hasClue && !clueCompleted && !taskAnswered) return;

    audioManager.play('page-turn');
    setTimeout(() => {
      nextStep();
    }, TEXT_ADVANCE_DELAY);
  }, [isLastStep, hasClue, clueCompleted, taskAnswered, nextStep]);

  const handleClueComplete = useCallback((clueId: string) => {
    completeClue(clueId);
    audioManager.play('task-complete');
  }, [completeClue]);

  if (!story || !chapter || !step) return null;

  const dialogueText = step.dialogue[lang] || step.dialogue.en;

  // Step type indicator
  const stepTypeLabel = (() => {
    switch (step.type) {
      case 'intro': return { en: 'Story', af: 'Storie', zu: 'Indaba', xh: 'Ibali', st: 'Pale' }[lang] || 'Story';
      case 'clue': return step.clue?.type === 'literacy' ? '\uD83D\uDCDA' : step.clue?.type === 'numeracy' ? '\uD83D\uDD22' : '\uD83C\uDF1F';
      case 'solution': return '\u2728';
      case 'celebration': return '\uD83C\uDF89';
      default: return '';
    }
  })();

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 px-3 pb-3">
      <div
        className="bg-white/95 rounded-2xl shadow-lg max-w-md mx-auto overflow-hidden"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        {/* Speaker bar */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <span className="text-2xl" role="img" aria-label={step.speaker}>
            {step.speakerEmoji}
          </span>
          <span className="text-sm font-display text-nova-earth font-semibold">
            {step.speaker}
          </span>
          <span className="ml-auto text-xs text-nova-earth/40">
            {stepTypeLabel}
          </span>
        </div>

        {/* Dialogue */}
        <div className="px-4 py-2">
          <p className="text-sm font-body text-nova-earth/80 leading-relaxed">
            {dialogueText}
          </p>
        </div>

        {/* Mini-task (if clue step and not yet answered) */}
        {hasClue && step.clue && !clueCompleted && (
          <div className="px-4 pb-2">
            <MiniTask
              clue={step.clue}
              lang={lang}
              onComplete={() => handleClueComplete(step.clue!.id)}
            />
          </div>
        )}

        {/* Completed clue badge */}
        {hasClue && clueCompleted && (
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2">
              <span className="text-lg">{'\u2705'}</span>
              <span className="text-xs font-body text-green-700">
                {{ en: 'Clue solved!', af: 'Leidraad opgelos!', zu: 'Umkhondo utholakele!', xh: 'Umkhondo ufunyenwe!', st: 'Pontso e rarollotse!' }[lang] || 'Clue solved!'}
              </span>
            </div>
          </div>
        )}

        {/* Progress dots + advance button */}
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex gap-1">
            {chapter.steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentStepIndex
                    ? 'bg-nova-primary'
                    : i < currentStepIndex
                    ? 'bg-nova-primary/40'
                    : 'bg-nova-earth/20'
                }`}
              />
            ))}
          </div>

          {!isLastStep && (
            <button
              onClick={handleAdvance}
              disabled={hasClue && !clueCompleted && !taskAnswered}
              className={`px-5 py-2 text-xs font-display rounded-full transition-all min-h-[48px] ${
                hasClue && !clueCompleted && !taskAnswered
                  ? 'bg-nova-earth/10 text-nova-earth/30 cursor-not-allowed'
                  : 'bg-nova-sun/40 text-nova-earth active:scale-95'
              }`}
            >
              {{ en: 'Next', af: 'Volgende', zu: 'Okulandelayo', xh: 'Okulandelayo', st: 'E latelang' }[lang] || 'Next'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
