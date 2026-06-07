import type { Question, GameMode } from '../../types';
import styles from './QuestionCard.module.css';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  answerState: 'idle' | 'correct' | 'wrong' | 'timeout';
  onAnswer: (answer: string) => void;
}

const PROMPT: Record<GameMode, string> = {
  'flag-to-country':    'Qual país possui esta bandeira?',
  'country-to-capital': 'Qual é a capital deste país?',
  'capital-to-country': 'Esta capital pertence a qual país?',
};

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export function QuestionCard({ question, selectedAnswer, answerState, onAnswer }: QuestionCardProps) {
  const { mode, country, options, correctAnswer } = question;

  const getState = (opt: string) => {
    if (!selectedAnswer) return 'idle';
    if (opt === correctAnswer) return 'correct';
    if (opt === selectedAnswer) return answerState === 'wrong' ? 'wrong' : 'idle';
    return 'dimmed';
  };

  return (
    <div className={styles.card}>
      {/* Visual subject */}
      <div className={styles.subject}>
        {mode === 'flag-to-country' && (
          <div className={styles.flagContainer}>
            <img
              src={country.flags.png}
              alt={country.flags.alt ?? `Bandeira de ${country.name.common}`}
              className={styles.flag}
            />
          </div>
        )}

        {mode === 'country-to-capital' && (
          <div className={styles.textSubject}>
            <span className={styles.subjectLabel}>País</span>
            <span className={styles.subjectText}>{country.name}</span>
          </div>
        )}

        {mode === 'capital-to-country' && (
          <div className={styles.textSubject}>
            <span className={styles.subjectLabel}>Capital</span>
            <span className={styles.subjectText}>{country.capital?.[0]}</span>
          </div>
        )}
      </div>

      {/* Prompt */}
      <p className={styles.prompt}>{PROMPT[mode]}</p>

      {/* Options */}
      <div className={styles.options}>
        {options.map((opt, i) => {
          const state = getState(opt);
          return (
            <button
              key={i}
              className={`${styles.option} ${styles[`state_${state}`]}`}
              onClick={() => onAnswer(opt)}
              disabled={!!selectedAnswer}
            >
              <span className={styles.optLabel}>{OPTION_LABELS[i]}</span>
              <span className={styles.optText}>{opt}</span>
              {state === 'correct' && (
                <span className={styles.optIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
              )}
              {state === 'wrong' && (
                <span className={styles.optIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {selectedAnswer && (
        <div className={`${styles.feedback} ${styles[`fb_${answerState}`]}`}>
          {answerState === 'correct' && (
            <span>Correto</span>
          )}
          {answerState === 'wrong' && (
            <span>Incorreto — a resposta é <strong>{correctAnswer}</strong></span>
          )}
          {answerState === 'timeout' && (
            <span>Tempo esgotado — a resposta é <strong>{correctAnswer}</strong></span>
          )}
        </div>
      )}
    </div>
  );
}
