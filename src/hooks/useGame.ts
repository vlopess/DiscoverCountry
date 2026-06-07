import { useState, useCallback, useEffect, useRef } from 'react';
import type { Country, GameMode, Question, GameResult } from '../types';
import { generateQuestion } from '../utils/randomQuestion';
import { calculateScore } from '../utils/scoreCalculator';
import { useAuth } from './useAuth';

const TOTAL_QUESTIONS = 8;
const TIME_PER_QUESTION = 20; // seconds

type AnswerState = 'idle' | 'correct' | 'wrong' | 'timeout';

interface GameState {
  questions: Question[];
  currentIndex: number;
  score: number;
  selectedAnswer: string | null;
  answerState: AnswerState;
  isFinished: boolean;
  result: GameResult | null;
  timeLeft: number;
}

export function useGame(countries: Country[], mode: GameMode) {
  const { user } = useAuth();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const buildQuestions = useCallback((): Question[] => {
    const qs: Question[] = [];
    const seen = new Set<string>();
    let tries = 0;
    while (qs.length < TOTAL_QUESTIONS && tries < 200) {
      tries++;
      const q = generateQuestion(countries, mode);
      if (q && !seen.has(q.country.cca3)) {
        seen.add(q.country.cca3);
        qs.push(q);
      }
    }
    return qs;
  }, [countries, mode]);

  const initialState = useCallback((): GameState => ({
    questions: buildQuestions(),
    currentIndex: 0,
    score: 0,
    selectedAnswer: null,
    answerState: 'idle',
    isFinished: false,
    result: null,
    timeLeft: TIME_PER_QUESTION,
  }), [buildQuestions]);

  const [state, setState] = useState<GameState>(initialState);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finishGame = useCallback((score: number) => {
    const pct = calculateScore(score, TOTAL_QUESTIONS);
    const result: GameResult = {
      score,
      total: TOTAL_QUESTIONS,
      percentage: pct,
      mode,
      playerName: user?.name ?? 'Jogador',
      date: new Date().toISOString().split('T')[0],
    };
    setState((prev) => ({ ...prev, isFinished: true, result }));
  }, [mode, user]);

  // Timer logic
  useEffect(() => {
    if (state.isFinished || state.selectedAnswer !== null) return;

    clearTimer();
    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 1) {
          clearTimer();
          // Timeout: reveal answer but don't add score
          return {
            ...prev,
            timeLeft: 0,
            selectedAnswer: '__timeout__',
            answerState: 'timeout',
          };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return clearTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentIndex, state.isFinished]);

  const currentQuestion = state.questions[state.currentIndex] ?? null;
  const progress = (state.currentIndex / TOTAL_QUESTIONS) * 100;

  const answerQuestion = useCallback(
    (answer: string) => {
      if (state.selectedAnswer !== null) return;
      clearTimer();

      const question = state.questions[state.currentIndex];
      const isCorrect = answer === question.correctAnswer;
      const newScore = isCorrect ? state.score + 1 : state.score;

      setState((prev) => ({
        ...prev,
        selectedAnswer: answer,
        answerState: isCorrect ? 'correct' : 'wrong',
        score: newScore,
      }));
    },
    [state, clearTimer]
  );

  const nextQuestion = useCallback(() => {
    const nextIndex = state.currentIndex + 1;
    if (nextIndex >= TOTAL_QUESTIONS) {
      finishGame(state.score);
    } else {
      setState((prev) => ({
        ...prev,
        currentIndex: nextIndex,
        selectedAnswer: null,
        answerState: 'idle',
        timeLeft: TIME_PER_QUESTION,
      }));
    }
  }, [state, finishGame]);

  const restartGame = useCallback(() => {
    clearTimer();
    setState(initialState());
  }, [initialState, clearTimer]);

  return {
    currentQuestion,
    currentIndex: state.currentIndex,
    score: state.score,
    totalQuestions: TOTAL_QUESTIONS,
    timePerQuestion: TIME_PER_QUESTION,
    progress,
    selectedAnswer: state.selectedAnswer,
    answerState: state.answerState,
    timeLeft: state.timeLeft,
    isFinished: state.isFinished,
    result: state.result,
    answerQuestion,
    nextQuestion,
    restartGame,
  };
}
