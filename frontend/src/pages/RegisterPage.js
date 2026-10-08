import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      alert('Mohon setujui Syarat & Ketentuan serta Kebijakan Privasi.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Konfirmasi password tidak cocok.');
      return;
    }

    try {
      const { data } = await api.post('/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });
      
      login(data.user, data.token);
      setSubmitted(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      const msg = error.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.';
      alert(msg);
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
            Pendaftaran berhasil diproses! Mengalihkan ke halaman masuk...
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
        </form>

        {/* Link Footer */}
        <div className="auth-footer-nav">
          Sudah punya akun?{' '}
          <Link to="/login" className="auth-link">
            Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
