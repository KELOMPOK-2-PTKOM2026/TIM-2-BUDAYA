import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import AlertModal from '../components/AlertModal';
import '../styles/ResetPasswordPage.css';

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    document.title = 'Atur Ulang Password — JelajahSumatera';

    if (!token || !email) {
      showAlert({
        type: 'error',
        eyebrow: 'Tautan Tidak Valid',
        title: 'Parameter Hilang',
        message: 'Tautan pengaturan ulang password tidak lengkap atau tidak valid. Silakan ajukan ulang melalui halaman Lupa Password.',
        confirmText: 'Ke Lupa Password',
      });
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !email) {
      showAlert({
        type: 'error',
        eyebrow: 'Tautan Tidak Valid',
        title: 'Tautan Kadaluwarsa / Hilang',
        message: 'Token atau email tidak ditemukan pada URL tautan. Mohon ajukan permintaan reset password baru.',
        confirmText: 'Saya Mengerti',
      });
      return;
    }

    if (password.length < 8) {
      showAlert({
        type: 'warning',
        eyebrow: 'Keamanan Password',
        title: 'Password Terlalu Pendek',
        message: 'Password baru minimal harus terdiri dari 8 karakter demi keamanan akun Anda.',
        confirmText: 'Perbaiki',
      });
      return;
    }

    if (password !== passwordConfirmation) {
      showAlert({
        type: 'warning',
        eyebrow: 'Ketidakcocokan',
        title: 'Konfirmasi Password Tidak Cocok',
        message: 'Password baru dan konfirmasi password tidak sesuai. Pastikan keduanya sama persis.',
        confirmText: 'Perbaiki',
      });
      return;
    }

    setLoading(true);
    try {
      await api.post('/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setIsSuccess(true);
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors?.password?.[0] ||
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.message ||
        'Gagal mengatur ulang password. Tautan mungkin telah kedaluwarsa atau tidak valid.';

      showAlert({
        type: 'error',
        eyebrow: 'Reset Gagal',
        title: 'Tidak Dapat Mengubah Password',
        message: errorMsg,
        confirmText: 'Coba Lagi',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="reset-pwd-page"
      style={{ backgroundImage: "url('/images/auth-pattern-bg.jpg')" }}
    >
      <div className="reset-pwd-card">
        {/* Header */}
        <div className="reset-pwd-header">
          <div className="reset-pwd-header__icon-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="reset-pwd-header__title">Atur Ulang Password</h1>
          <p className="reset-pwd-header__subtitle">
            Buat password baru yang kuat untuk akun Anda.
          </p>
          {email && (
            <span className="reset-pwd-header__email-badge">
              {email}
            </span>
          )}
        </div>

        {isSuccess ? (
          <div className="reset-pwd-success">
            <div className="reset-pwd-success__icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="reset-pwd-success__title">Password Berhasil Diubah!</h2>
            <p className="reset-pwd-success__desc">
              Akun Anda kini sudah diperbarui dengan password baru. Silakan masuk menggunakan kredensial terbaru Anda.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="reset-pwd-btn-submit"
            >
              Masuk Sekarang
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="reset-pwd-form">
            {/* Password Baru */}
            <div className="reset-pwd-field">
              <label htmlFor="reset-new-password" className="reset-pwd-field__label">
                <span>Password Baru</span>
                <span className="reset-pwd-field__hint">Min. 8 karakter</span>
              </label>
              <div className="reset-pwd-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="reset-new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password baru"
                  required
                  className="reset-pwd-input"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="reset-pwd-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
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

            {/* Konfirmasi Password */}
            <div className="reset-pwd-field">
              <label htmlFor="reset-confirm-password" className="reset-pwd-field__label">
                <span>Konfirmasi Password Baru</span>
              </label>
              <div className="reset-pwd-input-wrap">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="reset-confirm-password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Ulangi password baru"
                  required
                  className="reset-pwd-input"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="reset-pwd-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showConfirmPassword ? (
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

            <button
              type="submit"
              className="reset-pwd-btn-submit"
              disabled={loading || !token || !email}
            >
              {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
            </button>
          </form>
        )}

        <div className="reset-pwd-back">
          <Link to="/login" className="reset-pwd-back__link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Kembali ke Halaman Masuk
          </Link>
        </div>
      </div>

      {/* Editorial Custom Alert Modal */}
      <AlertModal
        isOpen={modalConfig.isOpen}
        onClose={() => {
          closeModal();
          if (!token || !email) {
            navigate('/lupa-password');
          }
        }}
        type={modalConfig.type}
        title={modalConfig.title}
        eyebrow={modalConfig.eyebrow}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
      />
    </div>
  );
}
