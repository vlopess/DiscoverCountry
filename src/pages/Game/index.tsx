import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { GameMode } from '../../types';
import { useCountries } from '../../hooks/useCountries';
import { useGame } from '../../hooks/useGame';
import { Layout } from '../../components/Layout';
import { Loading } from '../../components/Loading';
import { QuestionCard } from '../../components/QuestionCard';
import { ScoreBoard } from '../../components/ScoreBoard';
import { rankingService } from '../../services/rankingService';
import { getScoreLabel } from '../../utils/scoreCalculator';
import styles from './Game.module.css';

const VALID_MODES: GameMode[] = ['flag-to-country','country-to-capital','capital-to-country'];
function isValidMode(m: string | null): m is GameMode { return VALID_MODES.includes(m as GameMode); }

const MODE_LABELS: Record<GameMode, string> = {
  'flag-to-country':    'Bandeira para País',
  'country-to-capital': 'País para Capital',
  'capital-to-country': 'Capital para País',
};

function GameContent({ mode }: { mode: GameMode }) {
  const navigate = useNavigate();
  const { countries, loading, error } = useCountries();
  const {
    currentQuestion, currentIndex, score, totalQuestions,
    timePerQuestion, progress, selectedAnswer, answerState,
    timeLeft, isFinished, result, answerQuestion, nextQuestion, restartGame,
  } = useGame(countries, mode);

  useEffect(() => { if (result) rankingService.saveResult(result); }, [result]);

  if (loading) return <Loading message="Carregando países..." fullScreen />;

  if (error) return (
    <div className={styles.errorState}>
      <p>{error}</p>
      <button className={styles.retryBtn} onClick={() => window.location.reload()}>Tentar novamente</button>
    </div>
  );

  if (isFinished && result) {
    const { label } = getScoreLabel(result.percentage);
    const verdicts: Record<string, string> = {
      'Extraordinário! 🏆': 'Desempenho excepcional.',
      'Muito bom! 🌟': 'Ótimo resultado.',
      'Bom esforço! 💪': 'Bom esforço, continue praticando.',
      'Continue praticando! 📚': 'Continue praticando.',
    };
    const verdict = verdicts[label] ?? 'Resultado registrado.';

    return (
      <div className={styles.resultPage}>
        <div className={styles.resultCard}>
          <p className={styles.resultBadge}>Resultado — {MODE_LABELS[mode]}</p>
          <h2 className={styles.resultTitle}>
            {result.percentage}%<br />de aproveitamento.
          </h2>
          <p className={styles.resultVerdict}>
            {verdict} <strong>{result.score} de {result.total}</strong> respostas corretas.
          </p>

          <div className={styles.resultStats}>
            <div className={styles.resultStat}>
              <span className={styles.resultStatNum}>{result.score}</span>
              <span className={styles.resultStatLabel}>Acertos</span>
            </div>
            <div className={styles.resultStat}>
              <span className={styles.resultStatNum}>{result.total - result.score}</span>
              <span className={styles.resultStatLabel}>Erros</span>
            </div>
            <div className={styles.resultStat}>
              <span className={styles.resultStatNum}>{result.percentage}%</span>
              <span className={styles.resultStatLabel}>Taxa</span>
            </div>
          </div>

          <div className={styles.resultBar}>
            <div className={styles.resultBarFill} style={{ width: `${result.percentage}%` }} />
          </div>

          <div className={styles.resultActions}>
            <button className={styles.btnPrimary} onClick={restartGame}>
              Jogar novamente
            </button>
            <button className={styles.btnSecondary} onClick={() => navigate('/home')}>
              Voltar ao início
            </button>
            <button className={styles.btnSecondary} onClick={() => navigate('/ranking')}>
              Ver ranking
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return (
    <div className={styles.errorState}>
      <p>Não foi possível gerar perguntas.</p>
      <button className={styles.retryBtn} onClick={() => navigate('/home')}>Voltar</button>
    </div>
  );

  return (
    <div className={styles.gamePage}>
      <ScoreBoard
        score={score}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        progress={progress}
        timeLeft={timeLeft}
        timePerQuestion={timePerQuestion}
      />
      <QuestionCard
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        answerState={answerState}
        onAnswer={answerQuestion}
      />
      {selectedAnswer !== null && (
        <button className={styles.nextBtn} onClick={nextQuestion}>
          {currentIndex + 1 < totalQuestions ? 'Próxima pergunta' : 'Ver resultado'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      )}
    </div>
  );
}

export function Game() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode');
  if (!isValidMode(mode)) {
    return (
      <Layout>
        <div className={styles.errorState}>
          <p>Modo de jogo inválido.</p>
          <button className={styles.retryBtn} onClick={() => navigate('/home')}>Voltar ao início</button>
        </div>
      </Layout>
    );
  }
  return <Layout><GameContent mode={mode} /></Layout>;
}
