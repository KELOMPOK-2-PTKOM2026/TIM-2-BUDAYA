// file: d:\PTKOM\Baru\TIM-2-BUDAYA\frontend\src\components\Navbar.js
import { useState, useContext } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const isExploreActive = location.pathname.startsWith('/eksplorasi') || location.pathname.startsWith('/budaya');

  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="navbar">
      <div className="container-wide">
        <div className="navbar__inner">
          {/* Brand */}
          <Link to="/" className="navbar__brand" onClick={closeMobile}>
            <div className="navbar__logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4542E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M7 8h10" />
                <path d="M12 8v8" />
                <path d="M9 16h6" />
              </svg>
            </div>
            <span className="navbar__brand-text">
              Jelajah<span className="navbar__brand-bold">Sumatera</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="navbar__links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
            >
              Beranda
            </NavLink>
            <NavLink
              to="/eksplorasi"
              className={() => `navbar__link${isExploreActive ? ' navbar__link--active' : ''}`}
            >
              Eksplorasi
            </NavLink>

            <NavLink
              to="/tentang"
              className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
            >
              Tentang
            </NavLink>
            <NavLink
              to="/kontak"
              className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
            >
              Kontak
            </NavLink>
          </nav>

          {/* Desktop Actions */}
          <div className="navbar__actions">
            <button className="navbar__search-btn" aria-label="Cari Kebudayaan">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            {!user ? (
              <>
                <Link to="/login" className="navbar__btn-outline">
                  Masuk
                </Link>
                <Link to="/register" className="navbar__btn-filled">
                  Daftar
                </Link>
              </>
            ) : (
              <div className="navbar__profile">
                <button
                  type="button"
                  className="navbar__avatar"
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-expanded={profileOpen}
                  aria-label="Buka menu profil"
                >
                  {(user.name || user.email || '?').charAt(0).toUpperCase()}
                </button>
                {profileOpen && (
                  <div className="navbar__dropdown">
                    <Link to="/profil" onClick={() => setProfileOpen(false)}>👤 Profil Saya</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setProfileOpen(false)}>⚙️ Panel Admin</Link>
                    )}
                    <button type="button" onClick={logout}>🚪 Keluar</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="navbar__mobile-toggle" onClick={toggleMobile} aria-label="Toggle menu">
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="navbar__mobile">
            <NavLink to="/" end className="navbar__mobile-link" onClick={closeMobile}>
              Beranda
            </NavLink>
            <NavLink to="/eksplorasi" className="navbar__mobile-link" onClick={closeMobile}>
              Eksplorasi
            </NavLink>
            <NavLink to="/tentang" className="navbar__mobile-link" onClick={closeMobile}>
              Tentang
            </NavLink>
            <NavLink to="/kontak" className="navbar__mobile-link" onClick={closeMobile}>
              Kontak
            </NavLink>
            <div className="navbar__mobile-actions">
              {!user ? (
                <>
                  <Link to="/login" className="navbar__btn-outline" style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }} onClick={closeMobile}>
                    Masuk
                  </Link>
                  <Link to="/register" className="navbar__btn-filled" style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }} onClick={closeMobile}>
                    Daftar
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/profil" className="navbar__btn-outline" style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }} onClick={closeMobile}>
                    👤 Profil Saya
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="navbar__btn-filled" style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }} onClick={closeMobile}>
                      ⚙️ Panel Admin
                    </Link>
                  )}
                  <button type="button" className="navbar__btn-outline" onClick={() => { closeMobile(); logout(); }}>
                    🚪 Keluar
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
