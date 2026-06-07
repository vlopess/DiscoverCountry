import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Página não encontrada.</h1>
        <p className={styles.desc}>O endereço que você acessou não existe ou foi removido.</p>
        <button className={styles.btn} onClick={() => navigate('/')}>
          Voltar ao início
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
