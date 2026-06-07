import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.png';
import styles from './Navbar.module.css';


export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initial = user?.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <button className={styles.brand} onClick={() => navigate('/home')}>
          <img src={logo} alt="logo" height={75}/>
        </button>

        <div className={styles.user}>
          <div className={styles.avatar}>{initial}</div>
          <span className={styles.userName}>{user?.name}</span>
          <button
            className={styles.logoutBtn}
            onClick={() => { logout(); navigate('/'); }}
            aria-label="Sair"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
