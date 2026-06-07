import styles from './ScoreBoard.module.css';

interface ScoreBoardProps {
  score: number;
  currentIndex: number;
  totalQuestions: number;
  progress: number;
  timeLeft: number;
  timePerQuestion: number;
}

export function ScoreBoard({ score, currentIndex, totalQuestions, progress, timeLeft, timePerQuestion }: ScoreBoardProps) {
  const timerPct = (timeLeft / timePerQuestion) * 100;
  const danger = timeLeft <= 5;

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        {/* Question counter */}
        <div className={styles.meta}>
          <span className={styles.metaLabel}>Pergunta</span>
          <span className={styles.metaValue}>
            <span className={styles.current}>{currentIndex + 1}</span>
            <span className={styles.sep}>/</span>
            <span className={styles.total}>{totalQuestions}</span>
          </span>
        </div>

        {/* Timer */}
        <div className={`${styles.timer} ${danger ? styles.timerDanger : ''}`}>
          <svg className={styles.timerSvg} viewBox="0 0 40 40">
            <circle className={styles.timerTrack} cx="20" cy="20" r="17" />
            <circle
              className={styles.timerArc}
              cx="20" cy="20" r="17"
              strokeDasharray={`${(timerPct / 100) * 106.8} 106.8`}
              strokeDashoffset="26.7"
              data-danger={danger}
            />
          </svg>
          <span className={styles.timerNum}>{timeLeft}</span>
        </div>

        {/* Score */}
        <div className={`${styles.meta} ${styles.metaRight}`}>
          <span className={styles.metaLabel}>Pontos</span>
          <span className={styles.metaValue}>
            <span className={styles.current}>{score}</span>
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
