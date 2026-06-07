import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { GameMode } from '../../types';
import { Layout } from '../../components/Layout';
import styles from './Home.module.css';

interface Mode {
  id: GameMode;
  tag: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const FlagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
    <line x1="4" y1="22" x2="4" y2="15"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const MODES: Mode[] = [
  {
    id: 'flag-to-country',
    tag: 'Modo 01',
    title: 'Bandeira para País',
    desc: 'Identifique o país a partir da sua bandeira nacional.',
    icon: <FlagIcon />,
  },
  {
    id: 'country-to-capital',
    tag: 'Modo 02',
    title: 'País para Capital',
    desc: 'Descubra qual é a capital de um determinado país.',
    icon: <MapPinIcon />,
  },
  {
    id: 'capital-to-country',
    tag: 'Modo 03',
    title: 'Capital para País',
    desc: 'Identifique o país a partir do nome de sua capital.',
    icon: <GlobeIcon />,
  },
];

function getStoredMode(): GameMode {
  const m = sessionStorage.getItem('dc_mode');
  if (m === 'flag-to-country' || m === 'country-to-capital' || m === 'capital-to-country') return m;
  return 'flag-to-country';
}

export function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<GameMode>(getStoredMode);

  const select = (id: GameMode) => {
    setSelected(id);
    sessionStorage.setItem('dc_mode', id);
  };

  return (
    <Layout>
      <div className={styles.page}>

        {/* Page header */}
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <p className={styles.greeting}>Olá, {user?.name}</p>
            <h1 className={styles.title}>Escolha um modo<br />e comece a jogar.</h1>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.rankingLink} onClick={() => navigate('/ranking')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 20 18 10"/><polyline points="12 20 12 4"/><polyline points="6 20 6 14"/>
              </svg>
              Ranking
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Mode grid */}
        <div className={styles.modeGrid}>
          {MODES.map((m, i) => (
            <button
              key={m.id}
              className={`${styles.modeCard} ${selected === m.id ? styles.modeSelected : ''}`}
              onClick={() => select(m.id)}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className={styles.modeTop}>
                <span className={styles.modeTag}>{m.tag}</span>
                <div className={`${styles.modeIcon} ${selected === m.id ? styles.modeIconActive : ''}`}>
                  {m.icon}
                </div>
              </div>
              <div className={styles.modeBottom}>
                <h3 className={styles.modeTitle}>{m.title}</h3>
                <p className={styles.modeDesc}>{m.desc}</p>
              </div>
              {selected === m.id && <div className={styles.selectedIndicator} />}
            </button>
          ))}
        </div>

        {/* Footer action */}
        <div className={styles.footer}>
          <div className={styles.footerMeta}>
          </div>
          <button className={styles.playBtn} onClick={() => navigate(`/game?mode=${selected}`)}>
            Iniciar Quiz
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>

      </div>
    </Layout>
  );
}
