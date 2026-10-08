// file: d:\PTKOM\Baru\TIM-2-BUDAYA\frontend\src\pages\ProfilePage.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Profil Saya</h1>
          <p className="auth-subtitle">Informasi akun Anda.</p>
        </div>
        <div className="auth-form">
          <div className="auth-field">
            <span className="auth-label">Nama</span>
            <div className="auth-input">{user?.name}</div>
          </div>
          <div className="auth-field">
            <span className="auth-label">Email</span>
            <div className="auth-input">{user?.email}</div>
          </div>
          <div className="auth-field">
            <span className="auth-label">Role</span>
            <div className="auth-input">{user?.role}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
