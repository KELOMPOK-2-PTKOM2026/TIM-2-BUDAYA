import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AlertModal from '../components/AlertModal';
import api from '../lib/api';
import { getApiErrorMessage, getFieldErrors, getRetryAfterSeconds, formatDuration } from '../lib/errors';
import {
  MAX_LOGIN_ATTEMPTS,
  getLockRemaining,
  getRemainingAttempts,
  registerFailedAttempt,
  lockFor,
  resetLoginThrottle,
} from '../lib/loginThrottle';
import '../styles/Auth.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_SERVER_LOCK = 2 * 60;

const formatCountdown = (seconds) => {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

const ErrorIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.successMessage;
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [lockRemaining, setLockRemaining] = useState(() => getLockRemaining());
  const [lockDuration, setLockDuration] = useState(0);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    eyebrow: '',
    message: '',
    confirmText: 'Saya Mengerti',
  });

  // Info dari ProtectedRoute: halaman tujuan & alasan pengguna diarahkan ke sini
  const redirectTo = location.state?.from || '/';
  const accessReason = location.state?.reason;

  const showAlert = (config) => {
    setModalConfig({
      isOpen: true,
      type: config.type || 'warning',
      title: config.title || 'Perhatian',
      eyebrow: config.eyebrow || 'Perhatian',
      message: config.message,
      confirmText: config.confirmText || 'Saya Mengerti',
      secondaryText: config.secondaryText,
      onSecondary: config.onSecondary,
    });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Masuk ke Akun — JelajahSumatera';

    // Hasil klik tautan verifikasi email dari backend: ?verified=1 | ?verified=already | ?error=...
    const params = new URLSearchParams(window.location.search);
    const verifiedParam = params.get('verified');
    const errorParam = params.get('error');

    if (verifiedParam === '1') {
      showAlert({
        type: 'success',
        eyebrow: 'Verifikasi Berhasil',
        title: 'Email Terverifikasi',
        message: 'Akun Anda sudah aktif. Silakan masuk menggunakan email dan password yang Anda daftarkan untuk mulai mengajukan budaya.',
        confirmText: 'Masuk Sekarang',
      });
    } else if (verifiedParam === 'already') {
      showAlert({
        type: 'info',
        eyebrow: 'Informasi',
        title: 'Email Sudah Terverifikasi',
        message: 'Tautan ini sudah pernah digunakan dan akun Anda sudah aktif. Anda tidak perlu memverifikasi ulang, silakan langsung masuk.',
        confirmText: 'Lanjutkan',
      });
    } else if (errorParam) {
      showAlert({
        type: 'error',
        eyebrow: 'Verifikasi Gagal',
        title: 'Tautan Verifikasi Tidak Valid',
        message: `${errorParam} Tautan mungkin sudah kedaluwarsa atau tidak lengkap saat disalin. Coba masuk dengan akun Anda — jika email belum terverifikasi, Anda dapat meminta tautan baru.`,
        confirmText: 'Saya Mengerti',
      });
    }

    // Bersihkan query agar pop-up tidak muncul lagi saat halaman dimuat ulang
    if (verifiedParam || errorParam) {
      window.history.replaceState(window.history.state, '', window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hitung mundur penguncian login
  useEffect(() => {
    if (lockRemaining <= 0) return;
    const timer = setInterval(() => {
      const remaining = getLockRemaining();
      setLockRemaining(remaining);
      if (remaining <= 0) setFormError('');
    }, 1000);
    return () => clearInterval(timer);
  }, [lockRemaining]);

  const isLocked = lockRemaining > 0;

  const startLock = (seconds) => {
    setLockDuration(seconds);
    setLockRemaining(seconds);
    setFormError('');
  };

  const handleResendVerification = async () => {
    closeModal();
    try {
      const { data } = await api.post('/email/resend-verification', { email });
      showAlert({
        type: 'success',
        eyebrow: 'Tautan Terkirim',
        title: 'Cek Kotak Masuk Anda',
        message: `${data.message || 'Tautan verifikasi baru telah dikirim.'} Periksa juga folder Spam atau Promosi jika email belum muncul.`,
        confirmText: 'Baik',
      });
    } catch (error) {
      const alreadyVerified = error.response?.status === 400;
      showAlert({
        type: alreadyVerified ? 'info' : 'error',
        eyebrow: alreadyVerified ? 'Informasi' : 'Pengiriman Gagal',
        title: alreadyVerified ? 'Email Sudah Terverifikasi' : 'Tautan Gagal Dikirim',
        message: getApiErrorMessage(error, 'Gagal mengirim ulang tautan verifikasi. Silakan coba sesaat lagi.'),
        confirmText: 'Tutup',
      });
    }
  };

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Alamat email wajib diisi.';
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = 'Format email tidak valid. Contoh: budi@email.com';
    }
    if (!password) {
      errors.password = 'Password wajib diisi.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked || loading) return;

    const errors = validate();
    setFieldErrors(errors);
    setFormError('');
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const { data } = await api.post('/login', { email: email.trim(), password });
      resetLoginThrottle();
      login(data.user, data.token);
      setSubmitted(true);
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 1200);
    } catch (error) {
      const status = error.response?.status;
      const serverFieldErrors = getFieldErrors(error);
      const emailMessage = serverFieldErrors.email || '';

      if (status === 429) {
        const seconds = getRetryAfterSeconds(error) || DEFAULT_SERVER_LOCK;
        lockFor(seconds);
        startLock(seconds);
      } else if (status === 422 && /belum diverifikasi/i.test(emailMessage)) {
        showAlert({
          type: 'warning',
          eyebrow: 'Akun Belum Aktif',
          title: 'Email Belum Diverifikasi',
          message: `Akun ${email.trim()} belum diverifikasi. Klik tautan verifikasi yang kami kirim ke email Anda (cek juga folder Spam), atau minta tautan baru di bawah ini.`,
          confirmText: 'Tutup',
          secondaryText: 'Kirim Ulang Tautan',
          onSecondary: handleResendVerification,
        });
      } else if (status === 422 && !serverFieldErrors.password && /kredensial/i.test(emailMessage)) {
        const lockSeconds = registerFailedAttempt();
        if (lockSeconds > 0) {
          startLock(lockSeconds);
        } else {
          const remaining = getRemainingAttempts();
          setFormError(
            `Email atau password yang Anda masukkan salah. Sisa percobaan: ${remaining} dari ${MAX_LOGIN_ATTEMPTS} sebelum akses masuk dibatasi sementara.`
          );
        }
      } else if (status === 422) {
        setFieldErrors(serverFieldErrors);
      } else {
        setFormError(getApiErrorMessage(error, 'Login gagal. Silakan coba lagi.'));
      }
    } finally {
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
            Berhasil masuk! Mengalihkan Anda...
          </div>
        )}

        {message && !submitted && (
          <div className="auth-success-alert">
            {message}
          </div>
        )}

        {accessReason && !submitted && !isLocked && (
          <div className="auth-banner auth-banner--info" role="status">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <div>
              <span className="auth-banner__title">Khusus Pengguna Terdaftar</span>
              {accessReason}
            </div>
          </div>
        )}

        {isLocked && (
          <div className="auth-banner auth-banner--locked" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div>
              <span className="auth-banner__title">Percobaan Masuk Dibatasi Sementara</span>
              Terlalu banyak percobaan masuk yang gagal. Demi keamanan akun, silakan tunggu
              {lockDuration > 0 ? ` ${formatDuration(lockDuration)}` : ''} sebelum mencoba lagi.
              <br />
              Coba lagi dalam{' '}
              <span className="auth-banner__countdown" aria-live="polite">
                {formatCountdown(lockRemaining)}
              </span>
              . Lupa password?{' '}
              <Link to="/lupa-password" className="auth-link">Atur ulang di sini</Link>.
            </div>
          </div>
        )}

        {formError && !isLocked && (
          <div className="auth-banner auth-banner--warning" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <span className="auth-banner__title">Gagal Masuk</span>
              {formError}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email */}
          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">
              Alamat Email
            </label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="cth. budi@email.com"
              className={`auth-input ${fieldErrors.email ? 'auth-input--invalid' : ''}`}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
              disabled={isLocked}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <span id="login-email-error" className="auth-field-error">
                <ErrorIcon />
                {fieldErrors.email}
              </span>
            )}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="Masukkan password Anda"
                className={`auth-input auth-input--with-icon ${fieldErrors.password ? 'auth-input--invalid' : ''}`}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
                disabled={isLocked}
                autoComplete="current-password"
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
            {fieldErrors.password && (
              <span id="login-password-error" className="auth-field-error">
                <ErrorIcon />
                {fieldErrors.password}
              </span>
            )}
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
          <button type="submit" className="auth-btn-primary" disabled={isLocked || loading || submitted}>
            {isLocked
              ? `Coba Lagi dalam ${formatCountdown(lockRemaining)}`
              : loading
              ? 'Memeriksa Akun...'
              : 'Masuk Sekarang'}
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
        secondaryText={modalConfig.secondaryText}
        onSecondary={modalConfig.onSecondary}
      />
    </div>
  );
}
