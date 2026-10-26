import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AlertModal from '../components/AlertModal';
import api from '../lib/api';
import { getApiErrorMessage, getFieldErrors } from '../lib/errors';
import '../styles/Auth.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MIN = 3;
const NAME_MAX = 255;
const PASSWORD_MIN = 8;

// Nama kolom form -> nama kolom yang dipakai backend
const SERVER_FIELD_MAP = { password_confirmation: 'confirmPassword' };

function getPasswordStrength(password) {
  if (!password) return null;
  let score = 0;
  if (password.length >= PASSWORD_MIN) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (password.length < PASSWORD_MIN || score <= 2) return { level: 'weak', label: 'Lemah' };
  if (score === 3) return { level: 'medium', label: 'Sedang' };
  return { level: 'strong', label: 'Kuat' };
}

function validateRegister(formData) {
  const errors = {};
  const name = formData.name.trim();
  const email = formData.email.trim();

  if (!name) errors.name = 'Nama lengkap wajib diisi.';
  else if (name.length < NAME_MIN) errors.name = `Nama lengkap minimal ${NAME_MIN} karakter.`;
  else if (name.length > NAME_MAX) errors.name = `Nama lengkap maksimal ${NAME_MAX} karakter.`;

  if (!email) errors.email = 'Alamat email wajib diisi.';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Format email tidak valid. Contoh: budi@email.com';

  if (!formData.password) errors.password = 'Password wajib diisi.';
  else if (formData.password.length < PASSWORD_MIN) errors.password = `Password minimal ${PASSWORD_MIN} karakter.`;

  if (!formData.confirmPassword) errors.confirmPassword = 'Konfirmasi password wajib diisi.';
  else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Konfirmasi password tidak cocok dengan password.';

  if (!formData.agreed) errors.agreed = 'Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi.';

  return errors;
}

const FieldError = ({ id, message }) =>
  message ? (
    <span id={id} className="auth-field-error">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </span>
  ) : null;

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
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

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
      secondaryText: config.secondaryText,
      onSecondary: config.onSecondary,
    });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Buat Akun Baru — JelajahSumatera';
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const inputClass = (field, extra = '') =>
    `auth-input ${extra} ${fieldErrors[field] ? 'auth-input--invalid' : ''}`.trim();

  const passwordStrength = getPasswordStrength(formData.password);

  const handleResendVerification = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    setResendStatus(null);
    try {
      const { data } = await api.post('/email/resend-verification', {
        email: registeredEmail,
      });
      setResendStatus({
        type: 'success',
        message: data.message || 'Tautan verifikasi baru berhasil dikirim ke email Anda.',
      });
      setResendCooldown(60);
    } catch (error) {
      if (error.response?.status === 400) {
        // Email sudah diverifikasi (mis. lewat perangkat lain) — arahkan langsung ke login
        showAlert({
          type: 'info',
          eyebrow: 'Informasi',
          title: 'Email Sudah Terverifikasi',
          message: 'Akun Anda sudah aktif, tidak perlu mengirim ulang tautan. Silakan masuk ke akun Anda.',
          confirmText: 'Tutup',
          secondaryText: 'Ke Halaman Masuk',
          onSecondary: () => navigate('/login'),
        });
        return;
      }
      setResendStatus({
        type: 'error',
        message: getApiErrorMessage(error, 'Gagal mengirim ulang tautan verifikasi. Silakan coba sesaat lagi.'),
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleResetToRegister = () => {
    setIsRegistered(false);
    setResendStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const errors = validateRegister(formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const { data } = await api.post('/register', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });

      if (data.token) {
        login(data.user, data.token);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setRegisteredEmail(formData.email.trim());
        setIsRegistered(true);
        setResendCooldown(60);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      const serverErrors = getFieldErrors(error);

      if (error.response?.status === 422 && /sudah terdaftar/i.test(serverErrors.email || '')) {
        showAlert({
          type: 'info',
          eyebrow: 'Akun Sudah Ada',
          title: 'Email Sudah Terdaftar',
          message: `Email ${formData.email.trim()} sudah terdaftar dan terverifikasi. Silakan masuk, atau gunakan fitur Lupa Password jika Anda tidak ingat password-nya.`,
          confirmText: 'Tutup',
          secondaryText: 'Ke Halaman Masuk',
          onSecondary: () => navigate('/login'),
        });
      } else if (error.response?.status === 422 && Object.keys(serverErrors).length > 0) {
        const mapped = Object.fromEntries(
          Object.entries(serverErrors).map(([field, msg]) => [SERVER_FIELD_MAP[field] || field, msg])
        );
        setFieldErrors(mapped);
      } else {
        showAlert({
          type: 'error',
          eyebrow: 'Pendaftaran Akun',
          title: 'Pendaftaran Gagal Diproses',
          message: getApiErrorMessage(error, 'Pendaftaran gagal. Silakan coba lagi.'),
          confirmText: 'Tutup',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-page"
      style={{ backgroundImage: "url('/images/auth-pattern-bg.jpg')" }}
    >
      <div className="auth-card auth-card--wide">
        {isRegistered ? (
          /* ================= LAYAR DINAMIS VERIFIKASI EMAIL ================= */
          <div className="auth-verify-view">
            <div className="auth-header">
              <div
                className="auth-icon-badge"
                style={{
                  backgroundColor: '#fff7ed',
                  color: '#c4542e',
                  borderColor: '#fed7aa',
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H17.5C20 5 22 7 22 9.5V17z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h1 className="auth-title">Cek Email Anda</h1>
              <p className="auth-subtitle">
                Tautan verifikasi pendaftaran telah dikirimkan
              </p>
            </div>

            <div className="auth-verify-chip-box">
              <div className="auth-verify-chip-label">Alamat Email Terdaftar</div>
              <div className="auth-verify-email-text">{registeredEmail}</div>
            </div>

            <div className="auth-verify-guide">
              <div className="auth-verify-guide-title">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Langkah Aktivasi Akun:
              </div>
              <ol className="auth-verify-guide-list">
                <li>Buka kotak masuk (Inbox) email Anda.</li>
                <li>
                  Cari email dari <strong>Jelajah Sumatera</strong> dengan subjek verifikasi.
                </li>
                <li>
                  Klik tombol atau tautan <strong>Verifikasi Alamat Email</strong> di dalamnya.
                </li>
              </ol>
              <div className="auth-verify-tip">
                <strong>Catatan:</strong> Jika email belum muncul di Inbox, periksa folder{' '}
                <strong>Spam</strong> atau <strong>Promosi</strong>.
              </div>
            </div>

            {resendStatus && (
              <div
                className={`auth-verify-status auth-verify-status--${resendStatus.type}`}
              >
                {resendStatus.message}
              </div>
            )}

            <button
              type="button"
              className="auth-btn-primary"
              onClick={() => navigate('/login')}
            >
              Lanjut ke Halaman Masuk
            </button>

            <button
              type="button"
              className="auth-btn-secondary"
              onClick={handleResendVerification}
              disabled={resendCooldown > 0 || resendLoading}
            >
              {resendLoading
                ? 'Mengirim Ulang...'
                : resendCooldown > 0
                ? `Kirim Ulang Tautan (${resendCooldown}s)`
                : 'Kirim Ulang Tautan Verifikasi'}
            </button>

            <div className="auth-footer-nav" style={{ marginTop: '1.25rem' }}>
              Salah ketik email?{' '}
              <button
                type="button"
                onClick={handleResetToRegister}
                className="auth-link"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  font: 'inherit',
                  cursor: 'pointer',
                }}
              >
                Daftar ulang dengan email lain
              </button>
            </div>
          </div>
        ) : (
          /* ================= FORM PENDAFTARAN UTAMA ================= */
          <>
            <div className="auth-header">
              <div className="auth-icon-badge">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
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
                  maxLength={NAME_MAX}
                  className={inputClass('name')}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? 'reg-name-error' : undefined}
                  autoComplete="name"
                />
                <FieldError id="reg-name-error" message={fieldErrors.name} />
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
                  className={inputClass('email')}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? 'reg-email-error' : undefined}
                  autoComplete="email"
                />
                <FieldError id="reg-email-error" message={fieldErrors.email} />
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
                    placeholder={`Minimal ${PASSWORD_MIN} karakter`}
                    className={inputClass('password', 'auth-input--with-icon')}
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={fieldErrors.password ? 'reg-password-error' : undefined}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-toggle-pwd"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.password ? (
                  <FieldError id="reg-password-error" message={fieldErrors.password} />
                ) : passwordStrength ? (
                  <span className={`auth-pwd-strength auth-pwd-strength--${passwordStrength.level}`}>
                    Kekuatan Password: {passwordStrength.label}
                  </span>
                ) : null}
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
                    className={inputClass('confirmPassword', 'auth-input--with-icon')}
                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                    aria-describedby={fieldErrors.confirmPassword ? 'reg-confirm-error' : undefined}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-toggle-pwd"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <FieldError id="reg-confirm-error" message={fieldErrors.confirmPassword} />
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
              <FieldError id="reg-terms-error" message={fieldErrors.agreed} />

              {/* Tombol Daftar */}
              <button
                type="submit"
                className="auth-btn-primary"
                disabled={loading}
              >
                {loading ? 'Memproses Pendaftaran...' : 'Daftar Sekarang'}
              </button>
            </form>

            {/* Link Footer */}
            <div className="auth-footer-nav">
              Sudah punya akun?{' '}
              <Link to="/login" className="auth-link">
                Masuk
              </Link>
            </div>
          </>
        )}
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
