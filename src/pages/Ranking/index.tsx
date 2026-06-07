import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { useRanking } from '../../hooks/useRanking';
import { useAuth } from '../../hooks/useAuth';
import styles from './Ranking.module.css';
import {Loading} from "../../components/Loading";

export function Ranking() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { ranking, refresh } = useRanking();

  if (!ranking) return <Loading message="Carregando ranking..." fullScreen />;


  return (
    <Layout>
      <div className={styles.page}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Ranking</h1>
            <p className={styles.subtitle}>Os melhores resultados registrados.</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.refreshBtn} onClick={refresh}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Atualizar
            </button>
            <button className={styles.playBtn} onClick={() => navigate('/home')}>
              Jogar agora
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Table */}
        {ranking.data.meta.total === 0 ? (
          <div className={styles.empty}>
            <p>Nenhum resultado ainda.</p>
            <button className={styles.playBtn} onClick={() => navigate('/home')}>Jogar agora</button>
          </div>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <span className={`${styles.th} ${styles.thPos}`}>#</span>
              <span className={`${styles.th} ${styles.thPlayer}`}>Jogador</span>
              <span className={`${styles.th} ${styles.thScore}`}>Score</span>
            </div>

            {ranking.data.data.map((entry, i) => {
              const isMe = entry.user.name.toLowerCase() === user?.name.toLowerCase();
              return (
                <div
                  key={`${entry.position}-${entry.user.name}-${i}`}
                  className={`${styles.row} ${isMe ? styles.rowMe : ''}`}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <span className={styles.tdPos}>
                    {i <= 3 ? (
                      <span className={`${styles.medal} ${styles[`medal${i + 1}`]}`}>
                        {i + 1}
                      </span>
                    ) : (
                      <span className={styles.posNum}>{i + 1}</span>
                    )}
                  </span>

                  <span className={styles.tdPlayer}>
                    <span className={styles.avatar}>
                      {entry.user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className={styles.playerName}>
                      {entry.user.name}
                      {isMe && <span className={styles.youTag}>Você</span>}
                    </span>
                  </span>


                  <span className={styles.tdScore}>
                    <span className={styles.scoreNum}>{entry.totalPoints}</span>
                    <span className={styles.scorePct}> pts</span>
                  </span>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </Layout>
  );
}
