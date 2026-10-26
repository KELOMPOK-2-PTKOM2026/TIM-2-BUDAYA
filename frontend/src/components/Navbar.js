// file: d:\PTKOM\Baru\TIM-2-BUDAYA\frontend\src\components\Navbar.js
import { useState, useContext, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAccessLevel } from '../lib/roles';
import '../styles/Navbar.css';
import '../styles/AccessLevels.css';

const navItems = [
  { name: 'Beranda', path: '/' },
  { name: 'Eksplorasi', path: '/eksplorasi' },
  { name: 'Tentang', path: '/tentang' },
  { name: 'Kontribusi', path: '/kontribusi' },
];

export default function Navbar({ theme = 'light', toggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const access = getAccessLevel(user);
  const { pathname } = useLocation();
  
  const navRefs = useRef([]);
  const profileRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    setProfileOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!profileOpen) return;

    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [profileOpen]);

  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = navItems.findIndex(item => 
        item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)
      );
      
      if (activeIndex !== -1 && navRefs.current[activeIndex]) {
        const el = navRefs.current[activeIndex];
        setIndicatorStyle({
          left: el.offsetLeft,
          width: el.offsetWidth
        });
      } else {
        setIndicatorStyle({ left: 0, width: 0 });
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [pathname]);

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
          <nav
            className="navbar__links relative h-fit items-center gap-9 py-0"
            style={{ position: 'relative' }}
          >
            {navItems.map((item, index) => {
              const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  ref={el => { navRefs.current[index] = el; }}
                  className="navbar__link py-1 text-sm font-medium transition-colors"
                  style={{ color: isActive ? '#C4542E' : undefined }}
                >
                  <span className="leading-none">{item.name}</span>
                </NavLink>
              );
            })}
            <div
              aria-hidden="true"
              className="navbar-indicator"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />
          </nav>

          {/* Desktop Actions */}
          <div className="navbar__actions">
            {toggleTheme && (
              <button
                type="button"
                className="navbar__theme-toggle"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
              >
                {theme === 'dark' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            )}
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
              <div className="navbar__profile" ref={profileRef}>
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
                    {/* Header Profil */}
                    <div className="navbar__dropdown-header">
                      <span className="navbar__dropdown-name">{user.name || 'Pengguna'}</span>
                      <span className="navbar__dropdown-email">{user.email || ''}</span>
                      <span className={`role-badge role-badge--${access.key}`} style={{ marginTop: '0.4rem', alignSelf: 'flex-start' }}>
                        {access.label}
                      </span>
                    </div>

                    <div className="navbar__divider" />

                    {/* Menu Items */}
                    <div className="navbar__dropdown-menu">
                      <Link to="/profil" className="navbar__dropdown-item" onClick={() => setProfileOpen(false)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>Profil Saya</span>
                      </Link>
                      <Link to="/kontribusi" className="navbar__dropdown-item" onClick={() => setProfileOpen(false)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                        </svg>
                        <span>Dashboard Kontributor</span>
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="navbar__dropdown-item" onClick={() => setProfileOpen(false)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                          </svg>
                          <span>Panel Admin</span>
                        </Link>
                      )}
                    </div>

                    <div className="navbar__divider" />

                    {/* Logout */}
                    <div className="navbar__dropdown-menu">
                      <button type="button" className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={() => { setProfileOpen(false); logout(); }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Keluar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="navbar__mobile-controls">
            {toggleTheme && (
              <button
                type="button"
                className="navbar__theme-toggle navbar__theme-toggle--mobile"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
              >
                {theme === 'dark' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
              onClick={toggleMobile}
              aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              aria-expanded={mobileOpen}
            >
              <span className="navbar__hamburger-bar" />
              <span className="navbar__hamburger-bar" />
              <span className="navbar__hamburger-bar" />
            </button>
          </div>
        </div>

        {/* Mobile Drawer Backdrop */}
        <div
          className={`navbar__overlay ${mobileOpen ? 'navbar__overlay--open' : ''}`}
          onClick={closeMobile}
          aria-hidden="true"
        />

        {/* Mobile Drawer */}
        <div className={`navbar__drawer ${mobileOpen ? 'navbar__drawer--open' : ''}`}>
          <div className="navbar__drawer-inner">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className="navbar__drawer-link"
                onClick={closeMobile}
              >
                {item.name}
              </NavLink>
            ))}

            <div className="navbar__drawer-actions">
              {!user ? (
                <>
                  <Link to="/login" className="navbar__btn-outline navbar__btn--block" onClick={closeMobile}>
                    Masuk
                  </Link>
                  <Link to="/register" className="navbar__btn-filled navbar__btn--block" onClick={closeMobile}>
                    Daftar
                  </Link>
                </>
              ) : (
                <>
                  <div className="navbar__drawer-user">
                    <span className="navbar__drawer-username">{user.name || 'Pengguna'}</span>
                    <span className="navbar__drawer-useremail">{user.email || ''}</span>
                    <span className={`role-badge role-badge--${access.key}`} style={{ marginTop: '0.4rem', alignSelf: 'flex-start' }}>
                      {access.label}
                    </span>
                  </div>
                  <Link to="/profil" className="navbar__btn-outline navbar__btn--block" onClick={closeMobile}>
                    Profil Saya
                  </Link>
                  <Link to="/kontribusi" className="navbar__btn-outline navbar__btn--block" onClick={closeMobile}>
                    Dashboard Kontributor
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="navbar__btn-filled navbar__btn--block" onClick={closeMobile}>
                      Panel Admin
                    </Link>
                  )}
                  <button
                    type="button"
                    className="navbar__btn-outline navbar__btn--block navbar__btn--danger"
                    onClick={() => { closeMobile(); logout(); }}
                  >
                    Keluar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
