import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Lupa Password — JelajahSumatera';
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert('Mohon masukkan alamat email terdaftar Anda.');
      return;
    }

    setSubmitted(true);
  };

  return (
    <div
      className="auth-page"
      style={{ backgroundImage: "url('/images/auth-pattern-bg.jpg')" }}
    >
      <div className="auth-card auth-card--narrow">
        {/* Soft Icon Badge */}
        <div className="auth-header">
          <div className="auth-icon-badge auth-icon-badge--soft">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4542E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="auth-title">Lupa Password?</h1>
          <p className="auth-subtitle">
            Masukkan email terdaftar Anda di bawah. Kami akan mengirimkan tautan aman untuk mengatur ulang password Anda.
          </p>
        </div>

        {submitted ? (
          <div className="auth-success-alert" style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
              Tautan Reset Terkirim!
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              Instruksi pemulihan telah dikirim ke <strong>{email}</strong>. Silakan periksa kotak masuk atau spam email Anda.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="forgot-email" className="auth-label">
                Alamat Email
              </label>
              <input
                type="email"
                id="forgot-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cth. budi@email.com"
                required
                className="auth-input"
              />
            </div>

            <button type="submit" className="auth-btn-primary">
              Kirim Link Reset
            </button>
          </form>
        )}

        <div className="auth-back-link-wrapper">
          <Link to="/login" className="auth-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Kembali ke Halaman Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
