import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AlertModal from '../components/AlertModal';
import api from '../lib/api';
import '../styles/Auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreed: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      title: config.title || 'Persetujuan Diperlukan',
      eyebrow: config.eyebrow || 'Perhatian',
      message: config.message,
      confirmText: config.confirmText || 'Saya Mengerti',
    });
  };

  const closeModal = () => {
    const wasSuccess = modalConfig.type === 'success';
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
    if (wasSuccess) {
      navigate('/login');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Buat Akun Baru — JelajahSumatera';
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleGoogleLogin = () => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
    window.location.href = `${apiBaseUrl}/auth/google/redirect`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      showAlert({
        type: 'warning',
        eyebrow: 'Persetujuan Diperlukan',
        title: 'Syarat & Ketentuan Belum Disetujui',
        message: 'Mohon setujui Syarat & Ketentuan serta Kebijakan Privasi dengan mencentang kotak persetujuan sebelum melanjutkan pendaftaran.',
        confirmText: 'Saya Mengerti',
      });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showAlert({
        type: 'error',
        eyebrow: 'Verifikasi Password',
        title: 'Konfirmasi Password Tidak Cocok',
        message: 'Password dan konfirmasi password tidak cocok. Silakan pastikan kedua kolom password terisi sama persis.',
        confirmText: 'Periksa Kembali',
      });
      return;
    }

    try {
      const { data } = await api.post('/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });

      if (data.token) {
        login(data.user, data.token);
        setSubmitted(true);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setSubmitted(true);
        showAlert({
          type: 'success',
          eyebrow: 'Pendaftaran Berhasil',
          title: 'Verifikasi Email Dikirim',
          message: data.message || `Tautan verifikasi telah dikirim ke ${formData.email}. Silakan periksa kotak masuk atau spam email Anda untuk mengaktifkan akun.`,
          confirmText: 'Ke Halaman Masuk',
        });
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.';
      showAlert({
        type: 'error',
        eyebrow: 'Pendaftaran Akun',
        title: 'Pendaftaran Gagal Diproses',
        message: msg,
        confirmText: 'Tutup',
      });
    }
  };

  return (
    <div
      className="auth-page"
      style={{ backgroundImage: "url('/images/auth-pattern-bg.jpg')" }}
    >
      <div className="auth-card auth-card--wide">
        {/* Header Icon & Title */}
        <div className="auth-header">
          <div className="auth-icon-badge">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="m9 9 6 6" />
              <path d="m15 9-6 6" />
            </svg>
          </div>
          <h1 className="auth-title">Buat Akun Baru</h1>
          <p className="auth-subtitle">
            Bergabunglah sebagai kontributor budaya Sumatra
          </p>
        </div>

        {submitted && (
          <div className="auth-success-alert">
            Pendaftaran berhasil diproses! Silakan periksa email Anda untuk verifikasi.
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Nama Lengkap */}
          <div className="auth-field">
            <label htmlFor="reg-name" className="auth-label">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="reg-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="cth. Budi Siregar"
              required
              className="auth-input"
            />
          </div>

          {/* Alamat Email */}
          <div className="auth-field">
            <label htmlFor="reg-email" className="auth-label">
              Alamat Email
            </label>
            <input
              type="email"
              id="reg-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="cth. budi@email.com"
              required
              className="auth-input"
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="reg-password" className="auth-label">
              Password
            </label>
            <div className="auth-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="reg-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
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
            <span className="auth-pwd-strength">
              Kekuatan Password: Sangat Kuat
            </span>
          </div>

          {/* Konfirmasi Password */}
          <div className="auth-field">
            <label htmlFor="reg-confirm-password" className="auth-label">
              Konfirmasi Password
            </label>
            <div className="auth-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="reg-confirm-password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Ulangi password"
                required
                className="auth-input auth-input--with-icon"
              />
              <button
                type="button"
                className="auth-toggle-pwd"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle password visibility"
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

          {/* Persetujuan */}
          <div className="auth-checkbox-group">
            <input
              type="checkbox"
              id="reg-terms"
              name="agreed"
              checked={formData.agreed}
              onChange={handleChange}
              className="auth-checkbox"
            />
            <label htmlFor="reg-terms">
              Saya setuju dengan{' '}
              <Link to="/syarat-ketentuan" className="auth-link">
                Syarat &amp; Ketentuan
              </Link>{' '}
              serta{' '}
              <Link to="/kebijakan-privasi" className="auth-link">
                Kebijakan Privasi
              </Link>
              .
            </label>
          </div>

          {/* Tombol Daftar */}
          <button type="submit" className="auth-btn-primary">
            Daftar Sekarang
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
            <span>Daftar dengan Google</span>
          </button>
        </form>

        {/* Link Footer */}
        <div className="auth-footer-nav">
          Sudah punya akun?{' '}
          <Link to="/login" className="auth-link">
            Masuk
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
