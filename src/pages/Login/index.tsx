import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Login.module.css';
import logo from '../../assets/logo.png';

type Tab = 'login' | 'register';

// ─── Small reusable field ──────────────────────────────────────────────────
function Field({
  id, label, type = 'text', placeholder, value, onChange, error, autoFocus,
}: {
  id: string; label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; error?: string; autoFocus?: boolean;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoFocus={autoFocus}
        autoComplete={type === 'password' ? 'current-password' : 'off'}
      />
      {error && <p className={styles.fieldError}>{error}</p>}
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────
export function Login() {
  const { login, register, isAuthenticated, isLoading, authError, clearError } = useAuth();
  const navigate = useNavigate();

  const [tab,      setTab]      = useState<Tab>('login');
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  useEffect(() => { if (isAuthenticated) navigate('/home', { replace: true }); }, [isAuthenticated, navigate]);

  const switchTab = (t: Tab) => {
    setTab(t); setErrors({}); clearError();
    setName(''); setEmail(''); setPassword(''); setConfirm('');
  };

  // ── Validation ────────────────────────────────────────────────────────
  function validateLogin() {
    const e: Record<string, string> = {};
    if (!email.trim())            e.email    = 'E-mail obrigatório.';
    else if (!email.includes('@')) e.email   = 'E-mail inválido.';
    if (!password)                 e.password = 'Senha obrigatória.';
    return e;
  }

  function validateRegister() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2)    e.name     = 'Nome deve ter ao menos 2 caracteres.';
    if (!email.trim())             e.email    = 'E-mail obrigatório.';
    else if (!email.includes('@')) e.email    = 'E-mail inválido.';
    if (password.length < 6)       e.password = 'Senha deve ter ao menos 6 caracteres.';
    if (confirm !== password)      e.confirm  = 'As senhas não coincidem.';
    return e;
  }

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validation = tab === 'login' ? validateLogin() : validateRegister();
    if (Object.keys(validation).length) { setErrors(validation); return; }
    setErrors({});

    try {
      if (tab === 'login') {
        await login({ email: email.trim(), password });
      } else {
        await register({ name: name.trim(), email: email.trim(), password });
      }
      navigate('/home');
    } catch {
      // authError is set in context
    }
  };

  return (
    <div className={styles.page}>
      {/* Left — brand panel */}
      <div className={styles.left}>
        <div className={styles.leftInner}>
          <img src={logo} alt="logo" height={300}/>

          <div className={styles.hero}>
            <h1 className={styles.heroTitle}>
              Explore o mundo<br/>através do conhecimento.
            </h1>
            <p className={styles.heroSub}>
              Quiz educativo sobre bandeiras, capitais e países do mundo inteiro.
            </p>
          </div>

        </div>
      </div>

      {/* Right — form panel */}
      <div className={styles.right}>
        <div className={styles.formWrap}>
          {/* Tab switcher */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
              onClick={() => switchTab('login')}
              type="button"
            >
              Entrar
            </button>
            <button
              className={`${styles.tab} ${tab === 'register' ? styles.tabActive : ''}`}
              onClick={() => switchTab('register')}
              type="button"
            >
              Criar conta
            </button>
          </div>

          {/* Form header */}
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {tab === 'login' ? 'Bem-vindo de volta.' : 'Crie sua conta.'}
            </h2>
            <p className={styles.formSub}>
              {tab === 'login'
                ? 'Entre com suas credenciais para continuar.'
                : 'Preencha os dados para começar a jogar.'}
            </p>
          </div>

          {/* Global API error */}
          {authError && (
            <div className={styles.apiError}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.fields} noValidate>
            {tab === 'register' && (
              <Field
                id="name" label="Nome completo"
                placeholder="Ex: Maria Silva"
                value={name} onChange={v => { setName(v); setErrors(p => ({...p, name: ''})); }}
                error={errors.name} autoFocus
              />
            )}

            <Field
              id="email" label="E-mail" type="email"
              placeholder="seu@email.com"
              value={email} onChange={v => { setEmail(v); setErrors(p => ({...p, email: ''})); }}
              error={errors.email} autoFocus={tab === 'login'}
            />

            <Field
              id="password" label="Senha" type="password"
              placeholder={tab === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
              value={password} onChange={v => { setPassword(v); setErrors(p => ({...p, password: ''})); }}
              error={errors.password}
            />

            {tab === 'register' && (
              <Field
                id="confirm" label="Confirmar senha" type="password"
                placeholder="Repita a senha"
                value={confirm} onChange={v => { setConfirm(v); setErrors(p => ({...p, confirm: ''})); }}
                error={errors.confirm}
              />
            )}

            <button
              type="submit"
              className={styles.btn}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.btnSpinner} />
              ) : (
                <>
                  {tab === 'login' ? 'Entrar' : 'Criar conta'}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className={styles.switchHint}>
            {tab === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
            <button
              type="button"
              className={styles.switchLink}
              onClick={() => switchTab(tab === 'login' ? 'register' : 'login')}
            >
              {tab === 'login' ? 'Criar conta' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
