import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AlertModal from '../components/AlertModal';
import api from '../lib/api';
import '../styles/Auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    eyebrow: '',
    message: '',
    confirmText: 'Saya Mengerti',
  });

  const showAlert = (config) => {
    setModalConfig({
      isOpen: true,
      type: config.type || 'warning',
      title: config.title || 'Perhatian',
      eyebrow: config.eyebrow || 'Perhatian',
      message: config.message,
      confirmText: config.confirmText || 'Saya Mengerti',
    });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Masuk ke Akun — JelajahSumatera';

    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    if (tokenParam) {
      const userData = {
        id: params.get('id') || '',
        name: params.get('name') || '',
        email: params.get('email') || '',
        role: params.get('role') || 'user',
      };
      login(userData, tokenParam);
      setSubmitted(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
      return;
    }

    const errorParam = params.get('error');
    if (errorParam) {
      showAlert({
        type: 'error',
        eyebrow: 'Autentikasi Google Gagal',
        title: 'Gagal Masuk Akun',
        message: errorParam,
        confirmText: 'Saya Mengerti',
      });
    }
  }, [login, navigate]);

  const handleGoogleLogin = () => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
    window.location.href = `${apiBaseUrl}/auth/google/redirect`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showAlert({
        type: 'warning',
        eyebrow: 'Kelengkapan Data',
        title: 'Formulir Belum Lengkap',
        message: 'Mohon isi alamat email dan password Anda untuk masuk ke akun.',
        confirmText: 'Lengkapi Data',
      });
      return;
    }

    try {
      const { data } = await api.post('/login', { email, password });
      login(data.user, data.token);
      setSubmitted(true);
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (error) {
      showAlert({
        type: 'error',
        eyebrow: 'Autentikasi Gagal',
        title: 'Gagal Masuk Akun',
        message: error.response?.data?.message || 'Login gagal. Periksa kembali alamat email dan password Anda.',
        confirmText: 'Coba Lagi',
      });
    }
  };

  return (
    <div
      className="auth-page"
      style={{ backgroundImage: "url('/images/auth-pattern-bg.jpg')" }}
    >
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-badge">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="m9 9 6 6" />
              <path d="m15 9-6 6" />
            </svg>
          </div>
          <h1 className="auth-title">Masuk ke Akun Anda</h1>
          <p className="auth-subtitle">
            Selamat datang kembali di platform dokumentasi kebudayaan Sumatra.
          </p>
        </div>

        {submitted && (
          <div className="auth-success-alert">
            Verifikasi berhasil! Mengalihkan ke halaman utama...
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email */}
          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">
              Alamat Email
            </label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cth. budi@email.com"
              required
              className="auth-input"
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-label-row">
              <label htmlFor="login-password" className="auth-label">
                Password
              </label>
              <Link to="/lupa-password" className="auth-forgot-link">
                Lupa Password?
              </Link>
            </div>
            <div className="auth-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password Anda"
                required
                className="auth-input auth-input--with-icon"
              />
              <button
                type="button"
                className="auth-toggle-pwd"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Ingat Saya */}
          <div className="auth-checkbox-group">
            <input
              type="checkbox"
              id="login-remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="auth-checkbox"
            />
            <label htmlFor="login-remember" style={{ cursor: 'pointer' }}>
              Ingat saya di perangkat ini
            </label>
          </div>

          {/* Tombol Masuk */}
          <button type="submit" className="auth-btn-primary">
            Masuk Sekarang
          </button>

          <div className="auth-divider">atau</div>

          {/* Tombol Masuk dengan Google */}
          <button
            type="button"
            className="auth-btn-google"
            onClick={handleGoogleLogin}
          >
            <span className="auth-btn-google__icon">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </span>
            <span>Masuk dengan Google</span>
          </button>
        </form>

        {/* Footer Nav */}
        <div className="auth-footer-nav">
          Belum punya akun?{' '}
          <Link to="/register" className="auth-link">
            Daftar Sekarang
          </Link>
        </div>
      </div>

      {/* Editorial Custom Alert Modal */}
      <AlertModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        type={modalConfig.type}
        title={modalConfig.title}
        eyebrow={modalConfig.eyebrow}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
      />
    </div>
  );
}
