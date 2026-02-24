'use client';

interface AnswerButtonProps {
  label: string;
  index: number;
  selected: boolean;
  correct: boolean;
  showResult: boolean;
  isCorrectAnswer: boolean;
  onTap: (index: number) => void;
}

const OPTION_COLORS = [
  { bg: '#E3F2FD', border: '#1565C0', activeBg: '#BBDEFB' },
  { bg: '#FFF3E0', border: '#E65100', activeBg: '#FFE0B2' },
  { bg: '#E8F5E9', border: '#2E7D32', activeBg: '#C8E6C9' },
  { bg: '#F3E5F5', border: '#6A1B9A', activeBg: '#E1BEE7' },
];

export default function AnswerButton({
  label, index, selected, correct, showResult, isCorrectAnswer, onTap,
}: AnswerButtonProps) {
  const colors = OPTION_COLORS[index % OPTION_COLORS.length];

  let bgColor = colors.bg;
  let borderColor = colors.border;
  let textColor = '#3E2723';

  if (showResult) {
    if (isCorrectAnswer) {
      bgColor = '#C8E6C9';
      borderColor = '#2E7D32';
      textColor = '#1B5E20';
    } else if (selected && !correct) {
      bgColor = '#FFE0B2';
      borderColor = '#F57C00';
      textColor = '#E65100';
    } else {
      bgColor = '#F5F5F5';
      borderColor = '#BDBDBD';
      textColor = '#9E9E9E';
    }
  }

  return (
    <button
      onClick={() => !showResult && onTap(index)}
      disabled={showResult}
      className="w-full rounded-2xl font-display text-lg md:text-xl transition-all duration-200 active:scale-95 disabled:active:scale-100"
      style={{
        backgroundColor: bgColor,
        borderWidth: 3,
        borderStyle: 'solid',
        borderColor: borderColor,
        color: textColor,
        minHeight: 64,
        padding: '14px 20px',
      }}
    >
      <span className="flex items-center justify-center gap-2">
        {showResult && isCorrectAnswer && <span>&#10003;</span>}
        {showResult && selected && !correct && <span>~</span>}
        {label}
      </span>
    </button>
  );
}
